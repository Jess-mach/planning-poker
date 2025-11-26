import './HowItWorksSection.css';
import { Container } from '../Container/Container';

const steps = [
  {
    number: '1',
    title: 'Create a Room',
    description: 'Click "Start new game" and give your session a name. Choose your card deck type.',
  },
  {
    number: '2',
    title: 'Share the Link',
    description: 'Copy the unique room URL and share it with your team members.',
  },
  {
    number: '3',
    title: 'Vote',
    description: 'Team members select their estimation cards. Votes remain hidden until revealed.',
  },
  {
    number: '4',
    title: 'Reveal & Discuss',
    description: 'The facilitator reveals all votes. Discuss discrepancies and reach consensus.',
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="how-it-works">
      <Container>
        <h2 className="how-it-works__title">How It Works</h2>
        <p className="how-it-works__subtitle">
          Get started in 4 simple steps
        </p>
        <div className="how-it-works__steps">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-card__number">{step.number}</div>
              <h3 className="step-card__title">{step.title}</h3>
              <p className="step-card__description">{step.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

