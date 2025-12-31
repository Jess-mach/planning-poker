import type { User } from '../../types/session';
import './ParticipantsList.css';

interface ParticipantsListProps {
  participants: User[];
  isRevealed: boolean;
  currentUserId: string;
}

export const ParticipantsList = ({ participants, isRevealed, currentUserId }: ParticipantsListProps) => {
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
      {participants.map((participant) => {
        const isCurrentUser = participant.id === currentUserId;

        return (
          <div
            key={participant.id}
            className={`participant-item ${isCurrentUser ? 'participant-item--current' : ''}`}
          >
            <div className="participant-item__content" >
              <div className="participant-item__header">
                <span className="participant-item__badge">
                  {getRoleBadge(participant.role)} {participant.name}
                  {isCurrentUser && ' (You)'}
                </span>
              </div>
              <div className="participant-item__info">
                {participant.role !== 'observer' && !isRevealed && (
                  <div className="participant-item__status">
                    {participant.hasVoted ? (
                      <span className="participant-item__status--voted">
                        ✓ Voted
                      </span>
                    ) : (
                      <span className="participant-item__status--waiting">
                        ⏳ Waiting
                      </span>
                    )}
                  </div>
                )}
                {isRevealed && participant.hasVoted && participant.vote !== undefined && (
                  
                  <div className="participant-item__vote">
                    <strong>{participant.vote}</strong>
                  </div>
                )}
              </div>
            </div>
            
          </div>
          
        );
      })}
    </div>
  );
};

