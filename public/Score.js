import { sendEvent } from './Socket.js';
import stageData from './assets/stage.json' with { type: 'json' };
import itemData from './assets/item.json' with { type: 'json' };
import unlockData from './assets/item_unlock.json' with { type: 'json' };

export let currentStage = 0;

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  scoreIncrement = 0.001;
  targetStageScore = 10;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    this.score += deltaTime * 0.001 * stageData['data'][currentStage]['scoreMultiply'];

    if (currentStage === 6) {
      return;
    }
    // 점수가 100점 이상이 될 시 서버에 메세지 전송
    console.log(stageData['data'][currentStage + 1]['score']);
    if (Math.floor(this.score) === stageData['data'][currentStage + 1]['score']) {
      sendEvent(11, {
        currentStage: stageData['data'][currentStage]['id'],
        targetStage: stageData['data'][currentStage + 1]['id'],
      });
      currentStage++;
    }
  }

  getItem(itemId) {
    sendEvent(21, {
      currentStage: stageData['data'][currentStage]['id'],
      itemId: itemId - 1,
      itemScore: itemData['data'][itemId - 1]['score'],
    });

    if (
      !unlockData.data.some((unlock) => {
        if (
          unlock.stage_id === stageData['data'][currentStage]['id'] &&
          unlock.min_item_id <= itemId - 1 &&
          unlock.max_item_id >= itemId - 1
        ) {
          return true;
        }
      })
    ) {
      return { status: 'fail', message: 'Item is not unlocked' };
    }
    this.score += itemData['data'][itemId - 1]['score'];
  }

  reset() {
    this.score = 0;
    currentStage = 0;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
    sendEvent(31, {
      score: this.score,
    });
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
