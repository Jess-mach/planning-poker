import { useState, useEffect } from 'react';
import { SessionProvider, useSession } from './contexts/SessionContext';
import { Header } from './components/Header/Header';
import { HeroSection } from './components/HeroSection/HeroSection';
import { FeaturesSection } from './components/FeaturesSection/FeaturesSection';
import { HowItWorksSection } from './components/HowItWorksSection/HowItWorksSection';
import { Footer } from './components/Footer/Footer';
import { JoinRoom } from './components/JoinRoom/JoinRoom';
import { GameRoom } from './components/GameRoom/GameRoom';
import './App.css';

const AppContent = () => {
  const { session, currentUser, leaveSession } = useSession();
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [sessionIdFromUrl, setSessionIdFromUrl] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se há um ID de sessão na URL primeiro
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('sessionId');
    const action = urlParams.get('action');
    
    if (id) {
      setSessionIdFromUrl(id);
      setShowJoinRoom(true);
    } else if (action === 'create') {
      setShowJoinRoom(true);
    }
    // Se não houver parâmetros na URL, a sessão será carregada pelo contexto se existir
  }, []);

  const handleBackToHome = () => {
    if (session) {
      if (confirm('Tem certeza que deseja sair? Você perderá o acesso à sessão atual.')) {
        leaveSession();
        setShowJoinRoom(false);
        setSessionIdFromUrl(null);
        // Limpar parâmetros da URL
        window.history.pushState({}, '', window.location.pathname);
      }
    } else {
      setShowJoinRoom(false);
      setSessionIdFromUrl(null);
      // Limpar parâmetros da URL
      window.history.pushState({}, '', window.location.pathname);
    }
  };

  // Se há uma sessão ativa, mostrar a sala de jogo
  if (session && currentUser) {
    return (
      <div className="app">
        <Header 
          sessionId={session.id}
          onStartGame={() => {
            if (confirm('Tem certeza que deseja criar uma nova sessão? Você sairá da sessão atual.')) {
              leaveSession();
              setShowJoinRoom(true);
            }
          }}
          onBackToHome={handleBackToHome}
        />
        <main>
          <GameRoom />
        </main>
        <Footer />
      </div>
    );
  }

  // Se deve mostrar a tela de entrada
  if (showJoinRoom) {
    return (
      <div className="app">
        <Header 
          onStartGame={() => setShowJoinRoom(true)}
          onBackToHome={handleBackToHome}
        />
        <main>
          <JoinRoom 
            sessionId={sessionIdFromUrl || undefined}
            onJoin={() => setShowJoinRoom(false)}
          />
        </main>
        <Footer />
      </div>
    );
  }

  // Caso contrário, mostrar a landing page
  return (
    <div className="app">
      <Header onStartGame={() => setShowJoinRoom(true)} />
      <main>
        <HeroSection onStartGame={() => setShowJoinRoom(true)} />
        <FeaturesSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <SessionProvider>
      <AppContent />
    </SessionProvider>
  );
}

export default App;
