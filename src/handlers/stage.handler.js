import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';

export const moveStageHandler = (userId, payload) => {
  let currentStages = getStage(userId);

  console.log('!!!' + currentStages);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  console.log(payload);
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current stage missed' };
  }

  // 점수 검증
  const serverTime = Date.now();
  const elapsedTime = (serverTime - currentStage.timeStamp) / 1000;

  if (elapsedTime < 9.5 || elapsedTime > 10.5) {
    console.log(elapsedTime);
    return { status: 'fail', message: 'invalid elapsed time' };
  }

  //  targetStage 검증
  const { stages } = getGameAssets();
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'fail', message: 'Target stage not found' };
  }

  setStage(userId, payload.targetStage, serverTime);
  return { currentStage: currentStage.id };
};
