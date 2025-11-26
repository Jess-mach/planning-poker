import './FeaturesSection.css';
import { Container } from '../Container/Container';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: '⚡',
    title: 'Real-time Collaboration',
    description: 'See votes appear instantly as your team members make their choices. No page refresh needed.',
  },
  {
    icon: '🚀',
    title: 'No Login Required',
    description: 'Start estimating immediately. Just create a room and share the link with your team.',
  },
  {
    icon: '🎴',
    title: 'Multiple Card Decks',
    description: 'Choose from Fibonacci, Powers of 2, or T-Shirt sizes. Customize your estimation scale.',
  },
  {
    icon: '📱',
    title: 'Mobile Friendly',
    description: 'Works perfectly on desktop, tablet, and mobile devices. Vote from anywhere.',
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    description: 'Your sessions are private and secure. No data stored without your permission.',
  },
  {
    icon: '🎯',
    title: 'Easy to Use',
    description: 'Simple interface that anyone can use. Get started in seconds, not minutes.',
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="features">
      <Container>
        <h2 className="features__title">Why Choose Planning Poker Online?</h2>
        <p className="features__subtitle">
          Everything you need for effective agile estimation
        </p>
        <div className="features__grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-card__icon">{feature.icon}</div>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__description">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

