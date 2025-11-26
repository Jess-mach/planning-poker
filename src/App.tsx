import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { SessionProvider, useSession } from './contexts/SessionContext';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { HomePage } from './pages/HomePage';
import { JoinPage } from './pages/JoinPage';
import { GamePage } from './pages/GamePage';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, leaveSession } = useSession();
  
  // Determinar se deve mostrar o botão "Start new game"
  const showStartGameButton = location.pathname === '/';

  const handleStartGame = async () => {
    // Sair da sessão anterior se houver
    if (session) {
      await leaveSession();
    }
    navigate('/join', { replace: true, state: { createNew: true } });
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
