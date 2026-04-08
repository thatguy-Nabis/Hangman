import React from 'react';

function Status({ attempts, status }) {
  const maxWrong = 6;
  const wrongGuesses = maxWrong - attempts;

  const parts = [
    <circle key="head" className="hangman-head" cx="160" cy="90" r="25" />,         // 1. Head
    <line key="body" className="hangman-line" x1="160" y1="115" x2="160" y2="190" />, // 2. Body
    <line key="larm" className="hangman-line" x1="160" y1="130" x2="120" y2="170" />, // 3. Left Arm
    <line key="rarm" className="hangman-line" x1="160" y1="130" x2="200" y2="170" />, // 4. Right Arm
    <line key="lleg" className="hangman-line" x1="160" y1="190" x2="130" y2="250" />, // 5. Left Leg
    <line key="rleg" className="hangman-line" x1="160" y1="190" x2="190" y2="250" />, // 6. Right Leg
  ];

  return (
    <svg viewBox="0 0 300 300" className="hangman-svg" xmlns="http://www.w3.org/2000/svg">
        <line className="hangman-bg-line" x1="50" y1="280" x2="220" y2="280" /> {/* Base */}
        <line className="hangman-bg-line" x1="90" y1="280" x2="90" y2="20" />    {/* Vertical */}
        <line className="hangman-bg-line" x1="85" y1="20" x2="160" y2="20" />    {/* Top */}
        <line className="hangman-bg-line" x1="160" y1="20" x2="160" y2="65" />   {/* Rope */}
        
        {parts.slice(0, wrongGuesses)}

        {status === "lost" && (
            <g className="dead-eyes">
              <line className="hangman-line" x1="148" y1="83" x2="156" y2="91" strokeWidth="4" />
              <line className="hangman-line" x1="156" y1="83" x2="148" y2="91" strokeWidth="4" />
              <line className="hangman-line" x1="164" y1="83" x2="172" y2="91" strokeWidth="4" />
              <line className="hangman-line" x1="172" y1="83" x2="164" y2="91" strokeWidth="4" />
            </g>
        )}
    </svg>
  );
}

export default Status;
