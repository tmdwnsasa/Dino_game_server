export let highScore = 0;

export const setHighScore = (uuid, payload) => {
  if (highScore < payload.broadcast) {
    highScore = payload.broadcast;
  }
  return { broadcast: highScore, status: 'success' };
};
