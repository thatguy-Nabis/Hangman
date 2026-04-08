import React from 'react';

function Hint({ hint }) {
  if (!hint) return null;

  return (
    <div className="hint-bubble">
      Psst! It's related to <span>{hint}</span>
    </div>
  );
}

export default Hint;
