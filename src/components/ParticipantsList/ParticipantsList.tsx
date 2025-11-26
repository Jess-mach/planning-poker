import type { User } from '../../types/session';
import './ParticipantsList.css';

interface ParticipantsListProps {
  participants: User[];
  isRevealed: boolean;
  currentUserId: string;
}

export const ParticipantsList = ({ participants, isRevealed, currentUserId }: ParticipantsListProps) => {
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'facilitator':
        return 'Facilitador';
      case 'voter':
        return 'Votante';
      case 'observer':
        return 'Observador';
      default:
        return role;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'facilitator':
        return '👑';
      case 'voter':
        return '✋';
      case 'observer':
        return '👁️';
      default:
        return '';
    }
  };

  return (
    <div className="participants-list">
      <h3 className="participants-list__title">
        Participantes ({participants.length})
      </h3>
      <div className="participants-list__items">
        {participants.map((participant) => {
          const isCurrentUser = participant.id === currentUserId;
          
          return (
            <div
              key={participant.id}
              className={`participant-item ${isCurrentUser ? 'participant-item--current' : ''}`}
            >
              <div className="participant-item__header">
                <span className="participant-item__badge">
                  {getRoleBadge(participant.role)}
                </span>
                <span className="participant-item__name">
                  {participant.name}
                  {isCurrentUser && ' (Você)'}
                </span>
              </div>
              <div className="participant-item__info">
                <span className="participant-item__role">
                  {getRoleLabel(participant.role)}
                </span>
                {participant.role !== 'observer' && (
                  <div className="participant-item__status">
                    {participant.hasVoted ? (
                      <span className="participant-item__status--voted">
                        ✓ Votou
                      </span>
                    ) : (
                      <span className="participant-item__status--waiting">
                        ⏳ Aguardando
                      </span>
                    )}
                  </div>
                )}
                {isRevealed && participant.hasVoted && participant.vote !== undefined && (
                  <div className="participant-item__vote">
                    Voto: <strong>{participant.vote}</strong>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

