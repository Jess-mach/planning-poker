import { Header } from './components/Header/Header';
import { HeroSection } from './components/HeroSection/HeroSection';
import { FeaturesSection } from './components/FeaturesSection/FeaturesSection';
import { HowItWorksSection } from './components/HowItWorksSection/HowItWorksSection';
import { Footer } from './components/Footer/Footer';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
