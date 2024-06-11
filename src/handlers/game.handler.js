import { getGameAssets } from '../init/assets.js';
import { clearStage, getStage, setStage } from '../models/stage.model.js';

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();
  clearStage(uuid);
  setStage(uuid, stages.data[0].id, payload.timeStamp);
  console.log('Stage:', getStage(uuid));

  return { status: 'success' };
};

export const gameEnd = (uuid, payload) => {
  const { timestamp: gameEndTime, score } = payload;
  const stage = getStage(uuid);

  if (!stage.length) {
    return { status: 'fail', message: 'No stage found for user' };
  }

  let totalScore = 0;

  stages.forEach((stage, index) => {
    let stageEndTime;
    if (index === stages.length - 1) {
      stageEndTime = gameEndTime;
    } else {
      stageEndTime = stage[index + 1].timestamp;
    }

    const stageDuration = (stageEndTime - stage.timestamp) / 1000;
    totalScore += stageDuration;
  });

  if (Math.abs(score - totalScore) > 5) {
    return { status: 'fail', message: 'score verification failed' };
  }

  //DB에 저장한다면 여기서
  return { status: 'success', message: 'Game ended', score };
};
