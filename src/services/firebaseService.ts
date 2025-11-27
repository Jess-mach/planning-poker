import { 
  ref, 
  set, 
  get, 
  update, 
  onValue,
  serverTimestamp,
  onDisconnect
} from 'firebase/database';
import { database } from '../config/firebase';
import type { Session, User } from '../types/session';

/**
 * Serviço para gerenciar sessões no Firebase Realtime Database
 */
export class FirebaseService {
  /**
   * Criar uma nova sessão no Firebase
   */
  static async createSession(
    sessionId: string,
    roomCode: string,
    sessionName: string,
    deckType: 'fibonacci' | 'powersOf2' | 'tshirt',
    facilitator: User
  ): Promise<Session> {
    const sessionRef = ref(database, `sessions/${sessionId}`);
    
    const newSession: Session = {
      id: sessionId,
      roomCode,
      name: sessionName,
      deckType,
      users: [facilitator],
      isRevealed: false,
      facilitatorId: facilitator.id,
    };

    await set(sessionRef, {
      ...newSession,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Configurar presença do facilitador
    await this.setUserPresence(sessionId, facilitator.id, true);

    return newSession;
  }

  /**
   * Buscar uma sessão existente
   */
  static async getSession(sessionId: string): Promise<Session | null> {
    const sessionRef = ref(database, `sessions/${sessionId}`);
    const snapshot = await get(sessionRef);
    
    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.val();
    return {
      id: data.id,
      roomCode: data.roomCode || '',
      name: data.name,
      deckType: data.deckType,
      users: data.users || [],
      isRevealed: data.isRevealed || false,
      facilitatorId: data.facilitatorId,
    };
  }

  /**
   * Adicionar usuário a uma sessão
   */
  static async joinSession(
    sessionId: string,
    user: User
  ): Promise<void> {
    const session = await this.getSession(sessionId);
    
    if (!session) {
      throw new Error('Sessão não encontrada');
    }

    // Verificar se o usuário já existe na sessão
    const existingUserIndex = session.users.findIndex(u => u.id === user.id);
    
    if (existingUserIndex >= 0) {
      // Atualizar usuário existente
      session.users[existingUserIndex] = user;
    } else {
      // Adicionar novo usuário
      session.users.push(user);
    }

    const sessionRef = ref(database, `sessions/${sessionId}`);
    await update(sessionRef, {
      users: session.users,
      updatedAt: serverTimestamp(),
    });

    // Configurar presença do usuário
    await this.setUserPresence(sessionId, user.id, true);
  }

  /**
   * Remover usuário de uma sessão
   */
  static async leaveSession(sessionId: string, userId: string): Promise<void> {
    const session = await this.getSession(sessionId);
    
    if (!session) {
      return;
    }

    const updatedUsers = session.users.filter(u => u.id !== userId);
    
    const sessionRef = ref(database, `sessions/${sessionId}`);
    await update(sessionRef, {
      users: updatedUsers,
      updatedAt: serverTimestamp(),
    });

    // Remover presença
    await this.setUserPresence(sessionId, userId, false);
  }

  /**
   * Registrar voto de um usuário
   */
  static async vote(
    sessionId: string,
    userId: string,
    value: number | string
  ): Promise<void> {
    const session = await this.getSession(sessionId);
    
    if (!session) {
      throw new Error('Sessão não encontrada');
    }

    const updatedUsers = session.users.map(user =>
      user.id === userId
        ? { ...user, hasVoted: true, vote: value }
        : user
    );

    const sessionRef = ref(database, `sessions/${sessionId}`);
    await update(sessionRef, {
      users: updatedUsers,
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Revelar cartas (apenas facilitador)
   */
  static async revealCards(sessionId: string): Promise<void> {
    const sessionRef = ref(database, `sessions/${sessionId}`);
    await update(sessionRef, {
      isRevealed: true,
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Resetar rodada (apenas facilitador)
   */
  static async resetRound(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId);
    
    if (!session) {
      throw new Error('Sessão não encontrada');
    }

    const updatedUsers = session.users.map(user => {
      const { vote, ...userWithoutVote } = user;
      return {
        ...userWithoutVote,
        hasVoted: false,
      };
    });

    const sessionRef = ref(database, `sessions/${sessionId}`);
    await update(sessionRef, {
      users: updatedUsers,
      isRevealed: false,
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Escutar mudanças em tempo real de uma sessão
   */
  static subscribeToSession(
    sessionId: string,
    callback: (session: Session | null) => void
  ): () => void {
    const sessionRef = ref(database, `sessions/${sessionId}`);
    
    const unsubscribe = onValue(sessionRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      const data = snapshot.val();
      const session: Session = {
        id: data.id,
        roomCode: data.roomCode || '',
        name: data.name,
        deckType: data.deckType,
        users: data.users || [],
        isRevealed: data.isRevealed || false,
        facilitatorId: data.facilitatorId,
      };
      
      callback(session);
    });

    // Retornar função de unsubscribe
    return unsubscribe;
  }

  /**
   * Configurar presença online do usuário
   */
  static async setUserPresence(
    sessionId: string,
    userId: string,
    isOnline: boolean
  ): Promise<void> {
    const presenceRef = ref(database, `sessions/${sessionId}/presence/${userId}`);
    
    if (isOnline) {
      // Configurar para marcar como offline quando desconectar
      await set(presenceRef, {
        online: true,
        lastSeen: serverTimestamp(),
      });

      // Configurar o que acontece quando desconectar
      onDisconnect(presenceRef).set({
        online: false,
        lastSeen: serverTimestamp(),
      });
    } else {
      await set(presenceRef, {
        online: false,
        lastSeen: serverTimestamp(),
      });
    }
  }

  /**
   * Verificar se uma sessão existe
   */
  static async sessionExists(sessionId: string): Promise<boolean> {
    const sessionRef = ref(database, `sessions/${sessionId}`);
    const snapshot = await get(sessionRef);
    return snapshot.exists();
  }

  /**
   * Deletar uma sessão (apenas facilitador)
   */
  static async deleteSession(sessionId: string): Promise<void> {
    const sessionRef = ref(database, `sessions/${sessionId}`);
    await set(sessionRef, null);
  }

  /**
   * Gerar ID único para sessão
   */
  static generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Gerar ID único para usuário
   */
  static generateUserId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * Gerar código de sala de 6 caracteres
   * Formato: alternância entre letra maiúscula e número (ex: A1B2C3)
   */
  static generateRoomCode(): string {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Sem I e O para evitar confusão com 1 e 0
    const numbers = '23456789'; // Sem 0 e 1 para evitar confusão com O e I
    
    let code = '';
    for (let i = 0; i < 6; i++) {
      if (i % 2 === 0) {
        // Posições pares: letras (0, 2, 4)
        code += letters.charAt(Math.floor(Math.random() * letters.length));
      } else {
        // Posições ímpares: números (1, 3, 5)
        code += numbers.charAt(Math.floor(Math.random() * numbers.length));
      }
    }
    return code;
  }

  /**
   * Buscar sessão pelo código da sala
   */
  static async getSessionByRoomCode(roomCode: string): Promise<Session | null> {
    const sessionsRef = ref(database, 'sessions');
    const snapshot = await get(sessionsRef);
    
    if (!snapshot.exists()) {
      return null;
    }

    const sessions = snapshot.val();
    
    // Buscar sessão com o código correspondente (case insensitive)
    const normalizedCode = roomCode.toUpperCase();
    
    for (const sessionId of Object.keys(sessions)) {
      const sessionData = sessions[sessionId];
      if (sessionData.roomCode && sessionData.roomCode.toUpperCase() === normalizedCode) {
        return {
          id: sessionData.id,
          roomCode: sessionData.roomCode,
          name: sessionData.name,
          deckType: sessionData.deckType,
          users: sessionData.users || [],
          isRevealed: sessionData.isRevealed || false,
          facilitatorId: sessionData.facilitatorId,
        };
      }
    }
    
    return null;
  }

  /**
   * Verificar se um código de sala já existe
   */
  static async roomCodeExists(roomCode: string): Promise<boolean> {
    const session = await this.getSessionByRoomCode(roomCode);
    return session !== null;
  }

  /**
   * Gerar código de sala único (verifica se já existe)
   */
  static async generateUniqueRoomCode(): Promise<string> {
    let code = this.generateRoomCode();
    let attempts = 0;
    const maxAttempts = 10;
    
    while (await this.roomCodeExists(code) && attempts < maxAttempts) {
      code = this.generateRoomCode();
      attempts++;
    }
    
    return code;
  }
}

export default FirebaseService;

