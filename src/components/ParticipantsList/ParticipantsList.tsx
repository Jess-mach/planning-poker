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

  const radius = 400; // Radius of the circle
  const angle = 360 / participants.length;

  return (
    <div className="participants-list">
      {participants.map((participant, index) => {
        const isCurrentUser = participant.id === currentUserId;
        const rotation = angle * index;
        const x = radius * Math.cos((rotation - 90) * (Math.PI / 180));
        const y = radius * Math.sin((rotation - 90) * (Math.PI / 180));

        return (
          <div
            key={participant.id}
            className={`participant-item ${isCurrentUser ? 'participant-item--current' : ''}`}
            style={{
              transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
            }}
          >
            <div className="participant-item__content" style={{ transform: `rotate(-${rotation}deg)`}}>
              <div className="participant-item__header">
                <span className="participant-item__badge">
                  {getRoleBadge(participant.role)}
                </span>
                <span className="participant-item__name">
                  {participant.name}
                  {isCurrentUser && ' (You)'}
                </span>
              </div>
              <div className="participant-item__info">
                {participant.role !== 'observer' && (
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
                    Vote: <strong>{participant.vote}</strong>
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

