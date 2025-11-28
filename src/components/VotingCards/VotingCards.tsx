import { useSession } from '../../contexts/SessionContext';
import './VotingCards.css';

interface VotingCardsProps {
  deckType: 'fibonacci' | 'powersOf2' | 'tshirt';
  currentVote?: number | string;
  isRevealed: boolean;
  onVote: (value: number | string) => void;
}

const FIBONACCI_DECK = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '?', '☕'];
const POWERS_OF_2_DECK = [0, 1, 2, 4, 8, 16, 32, 64, '?', '☕'];
const TSHIRT_DECK = ['XS', 'S', 'M', 'L', 'XL', '?', '☕'];

export const VotingCards = ({ deckType, currentVote, isRevealed, onVote }: VotingCardsProps) => {
  const { currentUser } = useSession();
  
  let deck: (number | string)[] = [];
  
  switch (deckType) {
    case 'fibonacci':
      deck = FIBONACCI_DECK;
      break;
    case 'powersOf2':
      deck = POWERS_OF_2_DECK;
      break;
    case 'tshirt':
      deck = TSHIRT_DECK;
      break;
  }

  const handleCardClick = (value: number | string) => {
    if (!isRevealed && currentUser) {
      onVote(value);
    }
  };

  return (
    <div className="voting-cards">
      <h3 className="voting-cards__title">
        {isRevealed ? 'Votes Revealed' : 'Select your estimate'}
      </h3>
      <div className="voting-cards__deck">
        {deck.map((value, index) => {
          const isSelected = currentVote === value;
          const isDisabled = isRevealed;
          
          return (
            <button
              key={index}
              className={`voting-card ${isSelected ? 'voting-card--selected' : ''} ${isDisabled ? 'voting-card--disabled' : ''}`}
              onClick={() => handleCardClick(value)}
              disabled={isDisabled}
            >
              <span className="voting-card__value">{value}</span>
              {isSelected && !isRevealed && (
                <span className="voting-card__check">✓</span>
              )}
            </button>
          );
        })}
      </div>
      {isRevealed && (
        <p className="voting-cards__message">
          The cards have been revealed. Wait for the facilitator to start a new round.
        </p>
      )}
    </div>
  );
};

