const BASE_URL = 'http://localhost:5000';

export const fetchNewGame = async () => {
  const response = await fetch(`${BASE_URL}/new-game`);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

export const sendGuess = async (letter) => {
  const response = await fetch(`${BASE_URL}/guess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ letter })
  });
  if (!response.ok && response.status !== 400) throw new Error('Network response was not ok');
  return response.json();
};

export const fetchHint = async () => {
  const response = await fetch(`${BASE_URL}/hint`);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};
