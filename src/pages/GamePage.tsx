import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';
import { GameRoom } from '../components/GameRoom/GameRoom';

export const GamePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session, currentUser } = useSession();

  // Check if the ID in the URL matches the current session (by ID or roomCode)
  const isMatchingSession = session && (
    session.id === id || 
    session.roomCode === id?.toUpperCase()
  );

  useEffect(() => {
    // If there's no session or the ID doesn't match, redirect to join
    if (!session || !currentUser) {
      navigate(`/join?code=${id}`, { replace: true });
    } else if (!isMatchingSession) {
      navigate(`/join?code=${id}`, { replace: true });
    }
  }, [session, currentUser, id, navigate, isMatchingSession]);

  // If there's no session, render nothing (will redirect)
  if (!session || !currentUser || !isMatchingSession) {
    return null;
  }

  return <GameRoom />;
};

