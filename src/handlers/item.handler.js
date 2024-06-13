import { getGameAssets } from '../init/assets.js';
import { getItem, setItem } from '../models/item.model.js';
import { getStage } from '../models/stage.model.js';

export const getItemHandler = (userId, payload) => {
  let currentItems = getItem(userId);
  let currentStages = getStage(userId);
  let { currentStage, itemId, itemScore } = payload;
  let unlockCheck = false;

  const { item_unlocks, items } = getGameAssets();

  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  currentStages.sort((a, b) => a.id - b.id);
  const userCurrentStage = currentStages[currentStages.length - 1];

  if (userCurrentStage.id !== currentStage) {
    return { status: 'fail', message: 'Current stage missed' };
  }

  // 해금 검증
  if (
    !item_unlocks.data.some((unlock) => {
      if (
        unlock.stage_id === currentStage &&
        unlock.min_item_id <= itemId &&
        unlock.max_item_id >= itemId
      ) {
        return true;
      }
    })
  ) {
    return { status: 'fail', message: 'Item is not unlocked' };
  }

  // 점수 검증
  if (!items.data.some((item) => item.score === itemScore)) {
    console.log(item.id + ' ' + itemId);
    return { status: 'fail', message: 'Item score is not correct' };
  }

  setItem(userId, payload.targetStage);
  return { status: 'success' };
};
