import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection/FeaturesSection';
import { HowItWorksSection } from '../components/HowItWorksSection/HowItWorksSection';

export const HomePage = () => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/join');
  };

  return (
    <>
      <HeroSection onStartGame={handleStartGame} />
      <FeaturesSection />
      <HowItWorksSection />
    </>
  );
};

