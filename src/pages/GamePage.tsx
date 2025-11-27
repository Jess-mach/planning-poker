import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';
import { GameRoom } from '../components/GameRoom/GameRoom';

export const GamePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session, currentUser } = useSession();

  // Verificar se o ID na URL corresponde à sessão atual (por ID ou roomCode)
  const isMatchingSession = session && (
    session.id === id || 
    session.roomCode === id?.toUpperCase()
  );

  useEffect(() => {
    // Se não há sessão ou o ID não corresponde, redirecionar para join
    if (!session || !currentUser) {
      navigate(`/join?code=${id}`, { replace: true });
    } else if (!isMatchingSession) {
      navigate(`/join?code=${id}`, { replace: true });
    }
  }, [session, currentUser, id, navigate, isMatchingSession]);

  // Se não há sessão, não renderizar nada (vai redirecionar)
  if (!session || !currentUser || !isMatchingSession) {
    return null;
  }

  return <GameRoom />;
};

