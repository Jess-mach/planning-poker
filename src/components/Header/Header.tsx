import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { Container } from '../Container/Container';
import { Button } from '../Button/Button';

interface HeaderProps {
  sessionId?: string;
  onStartGame?: () => void;
}

export const Header = ({ sessionId, onStartGame }: HeaderProps) => {
  const navigate = useNavigate();
  const [copySuccess, setCopySuccess] = useState(false);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleShareRoom = () => {
    if (!sessionId) return;

    const shareUrl = `${window.location.origin}/game/${sessionId}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch((err) => {
      console.error('Erro ao copiar link:', err);
      alert('Não foi possível copiar o link. Por favor, copie manualmente: ' + shareUrl);
    });
  };

  return (
    <header className="header">
      <Container>
        <div className="header__content">
          <button 
            className="header__logo" 
            onClick={handleLogoClick}
            aria-label="Voltar para página inicial"
          >
            <svg width="192" height="40" viewBox="0 0 192 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M22.4205 2.01261C21.638 1.22317 20.362 1.22317 19.5795 2.01261L9.28443 12.3996L3.42625 18.311C0.191007 21.5751 0.191007 26.8672 3.42625 30.1313C6.66149 33.3954 11.9068 33.3954 15.1421 30.1313L17.3056 27.9485L16.9404 25.7148L12.7662 26.4452C12.3663 26.5152 12 26.2075 12 25.8015C12 24.0954 12.8324 22.4966 14.2301 21.5183L16.0475 20.2461L15.7158 18.2143C15.2706 15.4875 16.264 12.724 18.3432 10.9047L19.683 9.73238C20.437 9.07258 21.563 9.07258 22.317 9.73238L23.6568 10.9047C25.7361 12.724 26.7294 15.4875 26.2842 18.2143L25.9525 20.2461L27.7699 21.5183C29.1676 22.4966 30 24.0954 30 25.8015C30 26.2075 29.6337 26.5152 29.2338 26.4452L25.0596 25.7148L24.7025 27.9023L26.8579 30.1303C30.0932 33.3944 35.3385 33.3944 38.5738 30.1303C41.809 26.8662 41.809 21.5741 38.5738 18.31L22.4205 2.01261ZM21 19.0793C22.3807 19.0793 23.5 17.96 23.5 16.5793C23.5 15.1986 22.3807 14.0793 21 14.0793C19.6193 14.0793 18.5 15.1986 18.5 16.5793C18.5 17.96 19.6193 19.0793 21 19.0793ZM29 37.0795C29 37.6423 28.814 38.1616 28.5002 38.5795H13.4998C13.186 38.1616 13 37.6423 13 37.0795C13 35.6988 14.1193 34.5795 15.5 34.5795C16.0756 34.5795 16.6058 34.774 17.0283 35.1009C17.2648 33.1174 18.9528 31.5795 21 31.5795C23.0472 31.5795 24.7352 33.1174 24.9717 35.1009C25.3942 34.774 25.9244 34.5795 26.5 34.5795C27.8807 34.5795 29 35.6988 29 37.0795Z" fill="white"/>
            </svg>
          </button>
          <nav className="header__nav">
            <a href="#features" className="header__link">Features</a>
            <a href="#how-it-works" className="header__link">How It Works</a>
            <a href="#faq" className="header__link">FAQ</a>
            <div className="header__actions">
              {sessionId && (
                <button 
                  className={`header__share-button ${copySuccess ? 'header__share-button--success' : ''}`}
                  onClick={handleShareRoom}
                  title="Compartilhar sala"
                >
                  {copySuccess ? (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Copiado!
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12548 15.0077 5.24917 15.0227 5.37061L8.08259 9.16909C7.54305 8.46815 6.72229 8 5.8 8C4.14315 8 2.8 9.34315 2.8 11C2.8 12.6569 4.14315 14 5.8 14C6.72229 14 7.54305 13.5318 8.08259 12.8309L15.0227 16.6294C15.0077 16.7508 15 16.8745 15 17C15 18.6569 16.3431 20 18 20C19.6569 20 21 18.6569 21 17C21 15.3431 19.6569 14 18 14C17.0777 14 16.257 14.4682 15.7174 15.1691L8.77732 11.3706C8.79234 11.2492 8.8 11.1255 8.8 11C8.8 10.8745 8.79234 10.7508 8.77732 10.6294L15.7174 6.83091C16.257 7.53185 17.0777 8 18 8Z" fill="currentColor"/>
                      </svg>
                      Compartilhar
                    </>
                  )}
                </button>
              )}
              {onStartGame && (
                <Button variant="primary" size="medium" onClick={onStartGame}>
                  Start new game
                </Button>
              )}
            </div>
          </nav>
        </div>
      </Container>
    </header>
  );
};

