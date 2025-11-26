import './HeroSection.css';
import { Container } from '../Container/Container';
import { Button } from '../Button/Button';

interface HeroSectionProps {
  onStartGame?: () => void;
}

export const HeroSection = ({ onStartGame }: HeroSectionProps) => {
  return (
    <section className="hero">
      <Container>
        <div className="hero__content">
          <h1 className="hero__title">
            Planning Poker Online
          </h1>
          <p className="hero__subtitle">
            Estimate user stories collaboratively with your team in real-time. 
            No login required. Simple, fast, and effective.
          </p>
          <div className="hero__actions">
            <Button variant="primary" size="large" onClick={onStartGame}>
              Start new game
            </Button>
            <Button variant="secondary" size="large">
              Learn more
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

