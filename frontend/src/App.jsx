import React, { useState, useEffect, useCallback } from 'react';
import { fetchNewGame, sendGuess, fetchHint } from './api';
import WordDisplay from './components/WordDisplay';
import Keyboard from './components/Keyboard';
import Status from './components/Status';
import Hint from './components/Hint';

function App() {
  const [gameState, setGameState] = useState({
    masked_word: "",
    attempts_left: 6,
    status: "ongoing",
    guessed_letters: [],
    word: null // only available when won/lost
  });
  
  const [hint, setHint] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const startNewGame = useCallback(async () => {
    setIsLoading(true);
    setHint("");
    try {
      const data = await fetchNewGame();
      setGameState(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleGuess = async (letter) => {
    if (gameState.status !== "ongoing" || gameState.guessed_letters.includes(letter)) {
      return;
    }
    
    // Optimistic update
    setGameState(prev => ({
      ...prev,
      guessed_letters: [...prev.guessed_letters, letter]
    }));

    try {
      const data = await sendGuess(letter);
      if (!data.error) {
        setGameState(data);
      }
    } catch (e) {
      console.error(e);
      // Wait for user to refresh or retry if sync fails
    }
  };

  const handleGetHint = async () => {
    if (hint) return;
    try {
      const data = await fetchHint();
      setHint(data.hint);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key) && gameState.status === "ongoing") {
        handleGuess(key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleGuess]);

  return (
    <div className="app-container">
      <header className="header">
        <h2 className="header-logo">THE KINETIC ARCADE</h2>
        <nav className="header-nav">
            <span>Arcade</span>
            <span>Trophies</span>
            <span>Store</span>
            <span>Profile</span>
        </nav>
      </header>

      <main className="main-content">
        <div className="game-header">
            <div className="level-info">LEVEL 04 &bull; HARD MODE</div>
            <h1 className="title-text">HANGMAN</h1>
        </div>

        <div className="game-layout">
          <div className="left-panel">
            <Hint hint={hint} />
            <div className="hangman-graphic">
               <Status attempts={gameState.attempts_left} status={gameState.status} />
            </div>
          </div>
          
          <div className="right-panel">
            <div className="attempts-gauge">
                <div className="gauge-text">
                    <span>ATTEMPTS LEFT</span>
                    <span className="attempts-number">0{gameState.attempts_left}/06</span>
                </div>
                <div className="gauge-bar-bg">
                    <div className="gauge-bar-fill" style={{ width: `${(gameState.attempts_left / 6) * 100}%`}}></div>
                </div>
            </div>

            <div className="word-card">
               {isLoading ? (
                   <div className="loading-state">Loading Module...</div>
               ) : (
                   <WordDisplay maskedWord={gameState.masked_word} actualWord={gameState.word} status={gameState.status} />
               )}
            </div>

            {gameState.status === "won" && (
                <div className="game-over-banner won">
                    YOU WON! 🏆
                </div>
            )}
            {gameState.status === "lost" && (
                <div className="game-over-banner lost">
                    GAME OVER! 💀
                </div>
            )}

            <Keyboard 
                guessedLetters={gameState.guessed_letters} 
                maskedWord={gameState.masked_word}
                onGuess={handleGuess} 
                disabled={gameState.status !== "ongoing"}
            />
            
            <div className="actions">
               <button className="new-game-btn" onClick={startNewGame}>
                   NEW GAME
               </button>
               <button className="hint-btn" onClick={handleGetHint} disabled={!!hint || gameState.status !== "ongoing"}>
                   USE HINT (-20 PTS)
               </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
