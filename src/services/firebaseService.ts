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
 * Service to manage sessions in the Firebase Realtime Database
 */
export class FirebaseService {
  /**
   * Create a new session in Firebase
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

    // Set up facilitator presence
    await this.setUserPresence(sessionId, facilitator.id, true);

    return newSession;
  }

  /**
   * Fetch an existing session
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
   * Add a user to a session
   */
  static async joinSession(
    sessionId: string,
    user: User
  ): Promise<void> {
    const session = await this.getSession(sessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }

    // Check if the user already exists in the session
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

    // Set up user presence
    await this.setUserPresence(sessionId, user.id, true);
  }

  /**
   * Remove a user from a session
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

    // Remove presence
    await this.setUserPresence(sessionId, userId, false);
  }

  /**
   * Register a user's vote
   */
  static async vote(
    sessionId: string,
    userId: string,
    value: number | string
  ): Promise<void> {
    const session = await this.getSession(sessionId);
    
    if (!session) {
      throw new Error('Session not found');
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
   * Reveal cards (facilitator only)
   */
  static async revealCards(sessionId: string): Promise<void> {
    const sessionRef = ref(database, `sessions/${sessionId}`);
    await update(sessionRef, {
      isRevealed: true,
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Reset round (facilitator only)
   */
  static async resetRound(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId);
    
    if (!session) {
      throw new Error('Session not found');
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
   * Listen to real-time changes of a session
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

    // Return unsubscribe function
    return unsubscribe;
  }

  /**
   * Configure user's online presence
   */
  static async setUserPresence(
    sessionId: string,
    userId: string,
    isOnline: boolean
  ): Promise<void> {
    const presenceRef = ref(database, `sessions/${sessionId}/presence/${userId}`);
    
    if (isOnline) {
      // Set to mark offline when disconnecting
      await set(presenceRef, {
        online: true,
        lastSeen: serverTimestamp(),
      });

      // Configurar o que acontece quando desconectar
      // Configure behavior on disconnect
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
   * Check if a session exists
   */
  static async sessionExists(sessionId: string): Promise<boolean> {
    const sessionRef = ref(database, `sessions/${sessionId}`);
    const snapshot = await get(sessionRef);
    return snapshot.exists();
  }

  /**
   * Delete a session (facilitator only)
   */
  static async deleteSession(sessionId: string): Promise<void> {
    const sessionRef = ref(database, `sessions/${sessionId}`);
    await set(sessionRef, null);
  }

  /**
   * Generate unique session ID
   */
  static generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Generate unique user ID
   */
  static generateUserId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * Generate a 6-character room code
   * Format: alternate uppercase letter and number (e.g. A1B2C3)
   */
  static generateRoomCode(): string {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Exclude I and O to avoid confusion with 1 and 0
    const numbers = '23456789'; // Exclude 0 and 1 to avoid confusion with O and I
    
    let code = '';
    for (let i = 0; i < 6; i++) {
      if (i % 2 === 0) {
        // Even positions: letters (0, 2, 4)
        code += letters.charAt(Math.floor(Math.random() * letters.length));
      } else {
        // Odd positions: numbers (1, 3, 5)
        code += numbers.charAt(Math.floor(Math.random() * numbers.length));
      }
    }
    return code;
  }

  /**
   * Find a session by room code
   */
  static async getSessionByRoomCode(roomCode: string): Promise<Session | null> {
    const sessionsRef = ref(database, 'sessions');
    const snapshot = await get(sessionsRef);
    
    if (!snapshot.exists()) {
      return null;
    }

    const sessions = snapshot.val();
    
    // Search for a session with the matching code (case insensitive)
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
   * Check if a room code already exists
   */
  static async roomCodeExists(roomCode: string): Promise<boolean> {
    const session = await this.getSessionByRoomCode(roomCode);
    return session !== null;
  }

  /**
   * Generate a unique room code (checks for collisions)
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

