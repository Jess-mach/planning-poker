import { useNavigate } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';
import { HeroSection } from '../components/HeroSection/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection/FeaturesSection';
import { HowItWorksSection } from '../components/HowItWorksSection/HowItWorksSection';

export const HomePage = () => {
  const navigate = useNavigate();
  const { session, leaveSession } = useSession();

  const handleStartGame = async () => {
    // Sair da sessão anterior se houver
    if (session) {
      await leaveSession();
    }
    navigate('/join', { replace: true, state: { createNew: true } });
  };

  return (
    <>
      <HeroSection onStartGame={handleStartGame} />
      <FeaturesSection />
      <HowItWorksSection />
    </>
  );
};

