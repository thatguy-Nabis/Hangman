import React from 'react';

function WordDisplay({ maskedWord, actualWord, status }) {
  // If game is lost, we might want to fill in the missing letters in a different color
  const renderLetters = () => {
    if (status === "lost" && actualWord) {
      return actualWord.split('').map((char, index) => {
        const isGuessed = maskedWord[index] !== "_";
        return (
          <div key={index} className={`letter-space ${!isGuessed ? 'missed' : ''}`}>
            {char}
          </div>
        );
      });
    }

    return maskedWord.split('').map((char, index) => (
      <div key={index} className={`letter-space ${char === '_' ? 'empty' : ''}`}>
        {char !== '_' ? char : ''}
      </div>
    ));
  };

  return (
    <div className="word-display">
      {renderLetters()}
    </div>
  );
}

export default WordDisplay;
