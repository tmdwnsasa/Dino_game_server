import { gameEnd, gameStart } from './game.handler.js';
import { moveStageHandler } from './stage.handler.js';
import { getItemHandler } from './item.handler.js';
import { setHighScore } from './score.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: moveStageHandler,
  21: getItemHandler,
  31: setHighScore,
};

export default handlerMappings;
