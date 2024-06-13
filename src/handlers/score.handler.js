let HighScore = 0;

export const setHighScore = (uuid, payload) => {
  if (HighScore < payload.score) HighScore = payload.score;
  return { status: 'success' };
};
