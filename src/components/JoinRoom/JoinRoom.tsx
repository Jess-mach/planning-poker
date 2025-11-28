import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../contexts/SessionContext';
import { Container } from '../Container/Container';
import { Button } from '../Button/Button';
import './JoinRoom.css';

interface JoinRoomProps {
  sessionId?: string;
  onJoin?: () => void;
}

export const JoinRoom = ({ sessionId, onJoin }: JoinRoomProps) => {
  const navigate = useNavigate();
  const { joinSession, createSession } = useSession();
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState<'voter' | 'observer'>('voter');
  const [sessionName, setSessionName] = useState('');
  const [deckType, setDeckType] = useState<'fibonacci' | 'powersOf2' | 'tshirt'>('fibonacci');
  const [isCreating, setIsCreating] = useState(!sessionId);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomCode, setRoomCode] = useState(sessionId || '');

  // Formatar o código da sala enquanto digita (adicionar maiúsculas)
  const handleRoomCodeChange = (value: string) => {
    // Remove espaços e limita a 6 caracteres
    const cleanedValue = value.replace(/\s/g, '').toUpperCase().substring(0, 6);
    setRoomCode(cleanedValue);
  };

  const handleJoin = async () => {
    if (!userName.trim()) {
      setError('Por favor, informe seu nome');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let gameId: string;

      if (isCreating) {
        if (!sessionName.trim()) {
          setError('Por favor, informe o nome da sessão');
          setIsLoading(false);
          return;
        }
        // Ao criar, o usuário será o facilitador
        const newSession = await createSession(sessionName, deckType, userName);
        gameId = newSession.id;
      } else {
        if (!roomCode.trim()) {
          setError('Por favor, informe o código da sala');
          setIsLoading(false);
          return;
        }
        // Usar o roomCode (ou sessionId se vier da URL)
        const codeToUse = roomCode.trim().toUpperCase();
        const joinedSession = await joinSession(codeToUse, userName, role);
        // Usar o ID real da sessão para navegação
        gameId = joinedSession.id;
      }

      if (onJoin) {
        onJoin();
      }

      // Redirecionar para a página do jogo
      navigate(`/game/${gameId}`);
    } catch (err) {
      console.error('Erro ao entrar/criar sessão:', err);
      setError(
        isCreating 
          ? 'Erro ao criar sessão. Tente novamente.' 
          : 'Sala não encontrada. Verifique o código e tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="join-room">
      <Container>
        <div className="join-room__content">
          <h1 className="join-room__title">
            {isCreating ? 'Criar Nova Sessão' : 'Entrar na Sessão'}
          </h1>

          {isCreating && (
            <>
              <div className="join-room__field">
                <label htmlFor="sessionName" className="join-room__label">
                  Nome da Sessão
                </label>
                <input
                  id="sessionName"
                  type="text"
                  className="join-room__input"
                  placeholder="Ex: Sprint Planning - Feature X"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                />
              </div>

              <div className="join-room__field">
                <label className="join-room__label">Tipo de Baralho</label>
                <div className="join-room__radio-group">
                  <label className="join-room__radio">
                    <input
                      type="radio"
                      name="deckType"
                      value="fibonacci"
                      checked={deckType === 'fibonacci'}
                      onChange={() => setDeckType('fibonacci')}
                    />
                    <span>Fibonacci (0, 1, 2, 3, 5, 8, 13, 21...)</span>
                  </label>
                  <label className="join-room__radio">
                    <input
                      type="radio"
                      name="deckType"
                      value="powersOf2"
                      checked={deckType === 'powersOf2'}
                      onChange={() => setDeckType('powersOf2')}
                    />
                    <span>Potências de 2 (0, 1, 2, 4, 8, 16, 32...)</span>
                  </label>
                  <label className="join-room__radio">
                    <input
                      type="radio"
                      name="deckType"
                      value="tshirt"
                      checked={deckType === 'tshirt'}
                      onChange={() => setDeckType('tshirt')}
                    />
                    <span>T-Shirt Sizes (XS, S, M, L, XL)</span>
                  </label>
                </div>
              </div>
            </>
          )}

          {!isCreating && (
            <div className="join-room__field">
              <label htmlFor="roomCode" className="join-room__label">
                Código da Sala
              </label>
              <input
                id="roomCode"
                type="text"
                className="join-room__input join-room__input--code"
                placeholder="Ex: A1B2C3"
                value={roomCode}
                onChange={(e) => handleRoomCodeChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
                maxLength={6}
                autoComplete="off"
              />
              <span className="join-room__hint">Digite o código de 6 caracteres compartilhado pelo facilitador</span>
            </div>
          )}

          <div className="join-room__field">
            <label htmlFor="userName" className="join-room__label">
              Seu Nome
            </label>
            <input
              id="userName"
              type="text"
              className="join-room__input"
              placeholder="Ex: João Silva"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
            />
          </div>

          {!isCreating && (
            <div className="join-room__field">
              <label className="join-room__label">Tipo de Participante</label>
              <div className="join-room__radio-group">
                <label className="join-room__radio">
                  <input
                    type="radio"
                    name="role"
                    value="voter"
                    checked={role === 'voter'}
                    onChange={() => setRole('voter')}
                  />
                  <span>Votante</span>
                </label>
                <label className="join-room__radio">
                  <input
                    type="radio"
                    name="role"
                    value="observer"
                    checked={role === 'observer'}
                    onChange={() => setRole('observer')}
                  />
                  <span>Observador</span>
                </label>
              </div>
            </div>
          )}

          {error && (
            <div className="join-room__error">
              {error}
            </div>
          )}

          <Button 
            variant="primary" 
            size="large" 
            onClick={handleJoin} 
            className="join-room__button"
            disabled={isLoading}
          >
            {isLoading ? 'Conectando...' : isCreating ? 'Criar Sessão' : 'Entrar na Sessão'}
          </Button>

          {isCreating && (
            <button
              type="button"
              className="join-room__toggle"
              onClick={() => {
                setIsCreating(false);
                setError(null);
              }}
              disabled={isLoading}
            >
              Já tenho um código de sala
            </button>
          )}
          
          {!isCreating && !sessionId && (
            <button
              type="button"
              className="join-room__toggle"
              onClick={() => {
                setIsCreating(true);
                setError(null);
                setRoomCode('');
              }}
              disabled={isLoading}
            >
              Criar nova sessão
            </button>
          )}
        </div>
      </Container>
    </div>
  );
};

