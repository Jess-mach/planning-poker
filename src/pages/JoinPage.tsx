import { useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';
import { JoinRoom } from '../components/JoinRoom/JoinRoom';

export const JoinPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { session, currentUser, leaveSession } = useSession();
  // Support both sessionId and roomCode in the URL
  const sessionIdFromUrl = searchParams.get('sessionId') || searchParams.get('code');
  const isCreatingNew = location.state?.createNew;

  useEffect(() => {
    // If creating a new session, do not redirect
    if (isCreatingNew) {
      return;
    }

    // If there is an active session
    if (session && currentUser) {
      // If there is a code/ID in the URL and it's different from current session (check id and roomCode)
      if (sessionIdFromUrl && sessionIdFromUrl !== session.id && sessionIdFromUrl.toUpperCase() !== session.roomCode) {
        leaveSession();
        return;
      }
      
      // If there is a code/ID in the URL and it matches the current session, redirect to the game
      if (sessionIdFromUrl && (sessionIdFromUrl === session.id || sessionIdFromUrl.toUpperCase() === session.roomCode)) {
        navigate(`/game/${session.id}`, { replace: true });
        return;
      }
      
      // If there's no code/ID in the URL but there's an active session, redirect to current game
      if (!sessionIdFromUrl) {
        navigate(`/game/${session.id}`, { replace: true });
      }
    }
  }, [session, currentUser, navigate, sessionIdFromUrl, leaveSession, isCreatingNew]);

  const handleJoin = () => {
    // Após o join, o contexto será atualizado e o useEffect acima redirecionará
  };

  return (
    <JoinRoom 
      sessionId={sessionIdFromUrl || undefined}
      onJoin={handleJoin}
    />
  );
};

