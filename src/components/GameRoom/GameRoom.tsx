import { useNavigate } from 'react-router-dom';
import { useSession } from '../../contexts/SessionContext';
import { Container } from '../Container/Container';
import { Button } from '../Button/Button';
import { VotingCards } from '../VotingCards/VotingCards';
import { ParticipantsList } from '../ParticipantsList/ParticipantsList';
import './GameRoom.css';

export const GameRoom = () => {
  const navigate = useNavigate();
  const { session, currentUser, revealCards, resetRound, leaveSession, vote } = useSession();

  if (!session || !currentUser) {
    return null;
  }

  const isFacilitator = currentUser.id === session.facilitatorId;
  const allVoted = session.users.filter(u => u.role !== 'observer').every(u => u.hasVoted);
  const canReveal = allVoted && !session.isRevealed;

  const handleReveal = async () => {
    try {
      await revealCards();
    } catch (error) {
      console.error('Error revealing cards:', error);
      alert('Error revealing cards. Please try again.');
    }
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset the round? All votes will be cleared.')) {
      try {
        await resetRound();
      } catch (error) {
        console.error('Error resetting round:', error);
        alert('Error resetting round. Please try again.');
      }
    }
  };

  const handleLeave = async () => {
    if (confirm('Are you sure you want to leave the session?')) {
      try {
        await leaveSession();
        navigate('/');
      } catch (error) {
        console.error('Error leaving session:', error);
        navigate('/');
      }
    }
  };

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(session.roomCode).then(() => {
      alert('Room code copied!');
    }).catch(() => {
      // Fallback para navegadores que não suportam clipboard API
      prompt('Copy the room code:', session.roomCode);
    });
  };

  return (
    <div className="game-room">
      <Container>
        <div className="game-room__header">
          <div>
            <h1 className="game-room__title">{session.name}</h1>
            <div className="game-room__code-container">
              <span className="game-room__code-label">Room Code:</span>
              <span className="game-room__code" onClick={handleCopyRoomCode} title="Click to copy">
                {session.roomCode}
              </span>
              <button 
                className="game-room__copy-btn" 
                onClick={handleCopyRoomCode}
                title="Copy code"
              >
                📋
              </button>
            </div>
          </div>
          <Button variant="secondary" size="medium" onClick={handleLeave}>
            Leave Session
          </Button>
        </div>

        <div className="game-room__content">
          <div className="game-room__main">
            <div className="game-room__info">
              <p className="game-room__user-info">
                You are: <strong>{currentUser.name}</strong> ({currentUser.role === 'facilitator' ? 'Facilitator' : currentUser.role === 'voter' ? 'Voter' : 'Observer'})
              </p>
              {currentUser.hasVoted && (
                <p className="game-room__vote-status">
                  ✓ You voted: <strong>{currentUser.vote}</strong>
                </p>
              )}
            </div>

            {currentUser.role !== 'observer' && (
              <VotingCards
                deckType={session.deckType}
                currentVote={currentUser.vote}
                isRevealed={session.isRevealed}
                onVote={async (value) => {
                  if (!session.isRevealed && currentUser) {
                    try {
                      await vote(currentUser.id, value);
                    } catch (error) {
                      console.error('Erro ao votar:', error);
                      alert('Erro ao registrar voto. Tente novamente.');
                    }
                  }
                }}
              />
            )}

            {currentUser.role === 'observer' && (
              <div className="game-room__observer-message">
                <p>You are an observer and cannot vote.</p>
                <p>Wait for participants to vote and for the facilitator to reveal the cards.</p>
              </div>
            )}

            <div className="game-room__facilitator-actions">
              {canReveal && (
                <Button variant="primary" size="large" onClick={handleReveal}>
                  Reveal Cards
                </Button>
              )}
              {session.isRevealed && isFacilitator && (
                <Button variant="secondary" size="large" onClick={handleReset}>
                  New Round
                </Button>
              )}
              {!allVoted && !session.isRevealed && (
                <p className="game-room__waiting">
                  Waiting for everyone to vote... ({session.users.filter(u => u.hasVoted && u.role !== 'observer').length}/{session.users.filter(u => u.role !== 'observer').length})
                </p>
              )}
            </div>
          </div>

          <div className="game-room__sidebar">
            <ParticipantsList
              participants={session.users}
              isRevealed={session.isRevealed}
              currentUserId={currentUser.id}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

