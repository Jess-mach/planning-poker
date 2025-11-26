import { useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';
import { JoinRoom } from '../components/JoinRoom/JoinRoom';

export const JoinPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { session, currentUser, leaveSession } = useSession();
  const sessionIdFromUrl = searchParams.get('sessionId');
  const isCreatingNew = location.state?.createNew;

  useEffect(() => {
    // Se está criando uma nova sessão, não redirecionar
    if (isCreatingNew) {
      return;
    }

    // Se há uma sessão ativa
    if (session && currentUser) {
      // Se há um sessionId na URL e é diferente da sessão atual, sair da sessão atual
      if (sessionIdFromUrl && sessionIdFromUrl !== session.id) {
        leaveSession();
        return;
      }
      
      // Se há um sessionId na URL e é o mesmo da sessão atual, redirecionar para o jogo
      if (sessionIdFromUrl && sessionIdFromUrl === session.id) {
        navigate(`/game/${session.id}`, { replace: true });
        return;
      }
      
      // Se não há sessionId na URL mas há sessão ativa, redirecionar para o jogo atual
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

