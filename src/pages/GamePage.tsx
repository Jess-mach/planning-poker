import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';
import { GameRoom } from '../components/GameRoom/GameRoom';

export const GamePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session, currentUser } = useSession();

  useEffect(() => {
    // Se não há sessão ou o ID não corresponde, redirecionar para join
    if (!session || !currentUser) {
      navigate(`/join?sessionId=${id}`, { replace: true });
    } else if (session.id !== id) {
      navigate(`/join?sessionId=${id}`, { replace: true });
    }
  }, [session, currentUser, id, navigate]);

  // Se não há sessão, não renderizar nada (vai redirecionar)
  if (!session || !currentUser || session.id !== id) {
    return null;
  }

  return <GameRoom />;
};

