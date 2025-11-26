import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SessionProvider, useSession } from './contexts/SessionContext';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { HomePage } from './pages/HomePage';
import { JoinPage } from './pages/JoinPage';
import { GamePage } from './pages/GamePage';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const { session } = useSession();
  
  // Determinar se deve mostrar o botão "Start new game"
  const showStartGameButton = location.pathname === '/';

  const handleStartGame = () => {
    window.location.href = '/join';
  };

  return (
    <div className="app">
      <Header 
        sessionId={session?.id}
        onStartGame={showStartGameButton ? handleStartGame : undefined}
      />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/game/:id" element={<GamePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <AppContent />
      </SessionProvider>
    </BrowserRouter>
  );
}

export default App;
