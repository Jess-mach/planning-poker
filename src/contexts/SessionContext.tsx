import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, Session, UserRole } from '../types/session';


export type { User, Session, UserRole };

interface SessionContextType {
  session: Session | null;
  currentUser: User | null;
  createSession: (sessionName: string, deckType: 'fibonacci' | 'powersOf2' | 'tshirt', facilitatorName?: string) => Session;
  joinSession: (sessionId: string, userName: string, role: UserRole) => void;
  leaveSession: () => void;
  vote: (userId: string, value: number | string) => void;
  revealCards: () => void;
  resetRound: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  // Tentar carregar sessão do localStorage ao inicializar
  const loadStoredSession = (): { session: Session | null; user: User | null } => {
    try {
      const storedSession = localStorage.getItem('currentSession');
      const storedUser = localStorage.getItem('currentUser');
      
      if (storedSession && storedUser) {
        return {
          session: JSON.parse(storedSession),
          user: JSON.parse(storedUser),
        };
      }
    } catch (e) {
      console.error('Error loading stored session', e);
    }
    return { session: null, user: null };
  };

  const { session: initialSession, user: initialUser } = loadStoredSession();
  const [session, setSession] = useState<Session | null>(initialSession);
  const [currentUser, setCurrentUser] = useState<User | null>(initialUser);

  const generateId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const createSession = (
    sessionName: string,
    deckType: 'fibonacci' | 'powersOf2' | 'tshirt',
    facilitatorName?: string
  ): Session => {
    const facilitatorId = generateId();
    const facilitator: User = {
      id: facilitatorId,
      name: facilitatorName || 'Facilitator',
      role: 'facilitator',
      hasVoted: false,
    };

    const newSession: Session = {
      id: generateId(),
      name: sessionName,
      deckType,
      users: [facilitator],
      isRevealed: false,
      facilitatorId,
    };

    setSession(newSession);
    setCurrentUser(facilitator);
    
    // Salvar no localStorage para persistência
    localStorage.setItem('currentSession', JSON.stringify(newSession));
    localStorage.setItem('currentUser', JSON.stringify(facilitator));

    return newSession;
  };

  const joinSession = (sessionId: string, userName: string, role: UserRole) => {
    // Em uma implementação real, isso buscaria a sessão do servidor
    // Por enquanto, vamos usar o localStorage ou criar uma nova sessão
    const storedSession = localStorage.getItem('currentSession');
    let targetSession: Session | null = null;

    if (storedSession) {
      try {
        targetSession = JSON.parse(storedSession);
      } catch (e) {
        console.error('Error parsing stored session', e);
      }
    }

    if (!targetSession || targetSession.id !== sessionId) {
      // Criar uma sessão temporária se não existir
      targetSession = {
        id: sessionId,
        name: 'New Session',
        deckType: 'fibonacci',
        users: [],
        isRevealed: false,
        facilitatorId: '',
      };
    }

    const newUser: User = {
      id: generateId(),
      name: userName,
      role,
      hasVoted: false,
    };

    const updatedSession: Session = {
      ...targetSession,
      users: [...targetSession.users, newUser],
    };

    setSession(updatedSession);
    setCurrentUser(newUser);
    
    localStorage.setItem('currentSession', JSON.stringify(updatedSession));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
  };

  const leaveSession = () => {
    setSession(null);
    setCurrentUser(null);
    localStorage.removeItem('currentSession');
    localStorage.removeItem('currentUser');
  };

  const vote = (userId: string, value: number | string) => {
    if (!session) return;

    const updatedUsers = session.users.map((user) =>
      user.id === userId
        ? { ...user, hasVoted: true, vote: value }
        : user
    );

    const updatedSession: Session = {
      ...session,
      users: updatedUsers,
    };

    setSession(updatedSession);
    
    if (currentUser?.id === userId) {
      setCurrentUser({ ...currentUser, hasVoted: true, vote: value });
    }

    localStorage.setItem('currentSession', JSON.stringify(updatedSession));
    if (currentUser?.id === userId) {
      localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, hasVoted: true, vote: value }));
    }
  };

  const revealCards = () => {
    if (!session || currentUser?.id !== session.facilitatorId) return;

    const updatedSession: Session = {
      ...session,
      isRevealed: true,
    };

    setSession(updatedSession);
    localStorage.setItem('currentSession', JSON.stringify(updatedSession));
  };

  const resetRound = () => {
    if (!session || currentUser?.id !== session.facilitatorId) return;

    const updatedUsers = session.users.map((user) => ({
      ...user,
      hasVoted: false,
      vote: undefined,
    }));

    const updatedSession: Session = {
      ...session,
      users: updatedUsers,
      isRevealed: false,
    };

    setSession(updatedSession);
    localStorage.setItem('currentSession', JSON.stringify(updatedSession));
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        currentUser,
        createSession,
        joinSession,
        leaveSession,
        vote,
        revealCards,
        resetRound,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

