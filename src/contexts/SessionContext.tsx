import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, Session, UserRole } from '../types/session';
import FirebaseService from '../services/firebaseService';

export type { User, Session, UserRole };

interface SessionContextType {
  session: Session | null;
  currentUser: User | null;
  createSession: (sessionName: string, deckType: 'fibonacci' | 'powersOf2' | 'tshirt', facilitatorName?: string) => Promise<Session>;
  joinSession: (sessionId: string, userName: string, role: UserRole) => Promise<void>;
  leaveSession: () => Promise<void>;
  vote: (userId: string, value: number | string) => Promise<void>;
  revealCards: () => Promise<void>;
  resetRound: () => Promise<void>;
  isLoading: boolean;
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
  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Tentar carregar sessão do sessionStorage ao inicializar
  useEffect(() => {
    const loadStoredSession = async () => {
      try {
        const storedSessionId = sessionStorage.getItem('currentSessionId');
        const storedUser = sessionStorage.getItem('currentUser');
        
        if (storedSessionId && storedUser) {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
          
          // Verificar se a sessão ainda existe no Firebase
          const sessionExists = await FirebaseService.sessionExists(storedSessionId);
          
          if (sessionExists) {
            // Inscrever-se para mudanças em tempo real
            const unsubscribe = FirebaseService.subscribeToSession(
              storedSessionId,
              (updatedSession) => {
                if (updatedSession) {
                  setSession(updatedSession);
                  // Atualizar currentUser com dados mais recentes
                  const updatedUser = updatedSession.users.find(u => u.id === user.id);
                  if (updatedUser) {
                    setCurrentUser(updatedUser);
                    sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
                  }
                } else {
                  // Sessão foi deletada
                  clearLocalSession();
                }
              }
            );

            // Reativar presença do usuário
            await FirebaseService.setUserPresence(storedSessionId, user.id, true);

            // Cleanup ao desmontar
            return () => {
              unsubscribe();
            };
          } else {
            // Sessão não existe mais, limpar sessionStorage
            clearLocalSession();
          }
        }
      } catch (e) {
        console.error('Error loading stored session', e);
        clearLocalSession();
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredSession();
  }, []);

  // Configurar listener em tempo real quando a sessão mudar
  useEffect(() => {
    if (!session || !currentUser) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = FirebaseService.subscribeToSession(
      session.id,
      (updatedSession) => {
        if (updatedSession) {
          setSession(updatedSession);
          // Atualizar currentUser com dados mais recentes
          const updatedUser = updatedSession.users.find(u => u.id === currentUser.id);
          if (updatedUser) {
            setCurrentUser(updatedUser);
            sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
          }
        } else {
          // Sessão foi deletada
          clearLocalSession();
        }
      }
    );

    setIsLoading(false);

    // Cleanup
    return () => {
      unsubscribe();
    };
  }, [session?.id]);

  const clearLocalSession = () => {
    setSession(null);
    setCurrentUser(null);
    sessionStorage.removeItem('currentSessionId');
    sessionStorage.removeItem('currentUser');
  };

  const createSession = async (
    sessionName: string,
    deckType: 'fibonacci' | 'powersOf2' | 'tshirt',
    facilitatorName?: string
  ): Promise<Session> => {
    try {
      const facilitatorId = FirebaseService.generateUserId();
      const facilitator: User = {
        id: facilitatorId,
        name: facilitatorName || 'Facilitator',
        role: 'facilitator',
        hasVoted: false,
      };

      const sessionId = FirebaseService.generateSessionId();
      
      const newSession = await FirebaseService.createSession(
        sessionId,
        sessionName,
        deckType,
        facilitator
      );

      setSession(newSession);
      setCurrentUser(facilitator);
      
      // Salvar no sessionStorage para persistência
      sessionStorage.setItem('currentSessionId', sessionId);
      sessionStorage.setItem('currentUser', JSON.stringify(facilitator));

      return newSession;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  };

  const joinSession = async (sessionId: string, userName: string, role: UserRole) => {
    try {
      // Verificar se a sessão existe
      const existingSession = await FirebaseService.getSession(sessionId);
      
      if (!existingSession) {
        throw new Error('Sessão não encontrada');
      }

      const newUser: User = {
        id: FirebaseService.generateUserId(),
        name: userName,
        role,
        hasVoted: false,
      };

      await FirebaseService.joinSession(sessionId, newUser);

      // Buscar sessão atualizada
      const updatedSession = await FirebaseService.getSession(sessionId);
      
      if (updatedSession) {
        setSession(updatedSession);
        setCurrentUser(newUser);
        
        sessionStorage.setItem('currentSessionId', sessionId);
        sessionStorage.setItem('currentUser', JSON.stringify(newUser));
      }
    } catch (error) {
      console.error('Error joining session:', error);
      throw error;
    }
  };

  const leaveSession = async () => {
    if (!session || !currentUser) return;

    try {
      await FirebaseService.leaveSession(session.id, currentUser.id);
      clearLocalSession();
    } catch (error) {
      console.error('Error leaving session:', error);
      // Limpar localmente mesmo se houver erro
      clearLocalSession();
    }
  };

  const vote = async (userId: string, value: number | string) => {
    if (!session) return;

    try {
      await FirebaseService.vote(session.id, userId, value);
      // O listener em tempo real vai atualizar o estado automaticamente
    } catch (error) {
      console.error('Error voting:', error);
      throw error;
    }
  };

  const revealCards = async () => {
    if (!session) return;

    try {
      await FirebaseService.revealCards(session.id);
      // O listener em tempo real vai atualizar o estado automaticamente
    } catch (error) {
      console.error('Error revealing cards:', error);
      throw error;
    }
  };

  const resetRound = async () => {
    if (!session || currentUser?.id !== session.facilitatorId) return;

    try {
      await FirebaseService.resetRound(session.id);
      // O listener em tempo real vai atualizar o estado automaticamente
    } catch (error) {
      console.error('Error resetting round:', error);
      throw error;
    }
  };

  // Limpar presença ao fechar a aba/navegador
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (session && currentUser) {
        FirebaseService.setUserPresence(session.id, currentUser.id, false);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [session, currentUser]);

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
        isLoading,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
