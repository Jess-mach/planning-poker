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
      console.error('Erro ao revelar cartas:', error);
      alert('Erro ao revelar cartas. Tente novamente.');
    }
  };

  const handleReset = async () => {
    if (confirm('Tem certeza que deseja resetar a rodada? Todos os votos serão limpos.')) {
      try {
        await resetRound();
      } catch (error) {
        console.error('Erro ao resetar rodada:', error);
        alert('Erro ao resetar rodada. Tente novamente.');
      }
    }
  };

  const handleLeave = async () => {
    if (confirm('Tem certeza que deseja sair da sessão?')) {
      try {
        await leaveSession();
        navigate('/');
      } catch (error) {
        console.error('Erro ao sair da sessão:', error);
        navigate('/');
      }
    }
  };

  return (
    <div className="game-room">
      <Container>
        <div className="game-room__header">
          <div>
            <h1 className="game-room__title">{session.name}</h1>
            <p className="game-room__session-id">ID da Sessão: {session.id}</p>
          </div>
          <Button variant="secondary" size="medium" onClick={handleLeave}>
            Sair da Sessão
          </Button>
        </div>

        <div className="game-room__content">
          <div className="game-room__main">
            <div className="game-room__info">
              <p className="game-room__user-info">
                Você está como: <strong>{currentUser.name}</strong> ({currentUser.role === 'facilitator' ? 'Facilitador' : currentUser.role === 'voter' ? 'Votante' : 'Observador'})
              </p>
              {currentUser.hasVoted && (
                <p className="game-room__vote-status">
                  ✓ Você votou: <strong>{currentUser.vote}</strong>
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
                <p>Você está como observador e não pode votar.</p>
                <p>Aguarde os participantes votarem e o facilitador revelar as cartas.</p>
              </div>
            )}

            <div className="game-room__facilitator-actions">
              {canReveal && (
                <Button variant="primary" size="large" onClick={handleReveal}>
                  Revelar Cartas
                </Button>
              )}
              {session.isRevealed && isFacilitator && (
                <Button variant="secondary" size="large" onClick={handleReset}>
                  Nova Rodada
                </Button>
              )}
              {!allVoted && !session.isRevealed && (
                <p className="game-room__waiting">
                  Aguardando todos votarem... ({session.users.filter(u => u.hasVoted && u.role !== 'observer').length}/{session.users.filter(u => u.role !== 'observer').length})
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

