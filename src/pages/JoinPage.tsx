import { useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';
import { JoinRoom } from '../components/JoinRoom/JoinRoom';

export const JoinPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { session, currentUser, leaveSession } = useSession();
  // Suporta tanto sessionId quanto roomCode na URL
  const sessionIdFromUrl = searchParams.get('sessionId') || searchParams.get('code');
  const isCreatingNew = location.state?.createNew;

  useEffect(() => {
    // Se está criando uma nova sessão, não redirecionar
    if (isCreatingNew) {
      return;
    }

    // Se há uma sessão ativa
    if (session && currentUser) {
      // Se há um código/ID na URL e é diferente da sessão atual (verificar tanto id quanto roomCode)
      if (sessionIdFromUrl && sessionIdFromUrl !== session.id && sessionIdFromUrl.toUpperCase() !== session.roomCode) {
        leaveSession();
        return;
      }
      
      // Se há um código/ID na URL e corresponde à sessão atual, redirecionar para o jogo
      if (sessionIdFromUrl && (sessionIdFromUrl === session.id || sessionIdFromUrl.toUpperCase() === session.roomCode)) {
        navigate(`/game/${session.id}`, { replace: true });
        return;
      }
      
      // Se não há código/ID na URL mas há sessão ativa, redirecionar para o jogo atual
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

