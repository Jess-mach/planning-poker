import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';
import { JoinRoom } from '../components/JoinRoom/JoinRoom';

export const JoinPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { session, currentUser } = useSession();
  const sessionIdFromUrl = searchParams.get('sessionId');

  useEffect(() => {
    // Se já existe uma sessão ativa, redirecionar para a sala de jogo
    if (session && currentUser) {
      navigate(`/game/${session.id}`, { replace: true });
    }
  }, [session, currentUser, navigate]);

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

