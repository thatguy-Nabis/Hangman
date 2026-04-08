import React from 'react';

const ALPHABET = "QWERTYUIOPASDFGHJKLZXCVBNM".split('');

function Keyboard({ guessedLetters, maskedWord, onGuess, disabled }) {
  return (
    <div className="keyboard">
      {ALPHABET.map((letter) => {
        const isGuessed = guessedLetters.includes(letter);
        let keyClass = "key";
        
        if (isGuessed) {
          const isCorrect = maskedWord.includes(letter);
          keyClass += isCorrect ? " correct" : " wrong";
        }

        return (
          <button
            key={letter}
            className={keyClass}
            onClick={() => onGuess(letter)}
            disabled={disabled || isGuessed}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}

export default Keyboard;
