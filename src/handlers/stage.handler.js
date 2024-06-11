import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';

export const moveStageHandler = (userId, payload) => {
  let currentStages = getStage(userId);
  const { stages } = getGameAssets();

  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current stage missed' };
  }

  // 점수 검증
  const serverTime = Date.now();
  const elapsedTime =
    (serverTime - currentStage.timeStamp) / 1000 / currentStages[currentStages.length];

  if (
    elapsedTime < stages['data'][currentStages.length]['score'] - 0.5 ||
    elapsedTime > stages['data'][currentStages.length]['score'] + 0.5
  ) {
    return { status: 'fail', message: 'invalid elapsed time' };
  }

  //  targetStage 검증
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'fail', message: 'Target stage not found' };
  }

  setStage(userId, payload.targetStage, serverTime);
  return { status: 'success' };
};
