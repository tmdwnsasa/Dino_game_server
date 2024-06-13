import Item from './Item.js';
import { currentStage } from './Score.js';
import itemUnlock from './assets/item_unlock.json' with { type: 'json' };

class ItemController {
  INTERVAL_MIN = 5000;
  INTERVAL_MAX = 10000;

  nextInterval = null;
  items = [];

  constructor(ctx, itemImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.itemImages = itemImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextItemTime();
  }

  setNextItemTime() {
    this.nextInterval = this.getRandomNumber(this.INTERVAL_MIN, this.INTERVAL_MAX);
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createItem() {
    const index = this.getRandomNumber(
      itemUnlock['data'][currentStage]['min_item_id'],
      itemUnlock['data'][currentStage]['max_item_id'],
    );
    const itemInfo = this.itemImages[index];
    const x = this.canvas.width * 1.5;
    const y = this.getRandomNumber(10, this.canvas.height - itemInfo.height);
    const item = new Item(
      this.ctx,
      itemInfo.id,
      x,
      y,
      itemInfo.width,
      itemInfo.height,
      itemInfo.image,
    );

    this.items.push(item);
  }

  update(gameSpeed, deltaTime) {
    if (this.nextInterval <= 0) {
      this.createItem();
      this.setNextItemTime();
    }

    this.nextInterval -= deltaTime;

    this.items.forEach((item) => {
      item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    this.items = this.items.filter((item) => item.x > -item.width);
  }

  draw() {
    this.items.forEach((item) => item.draw());
  }

  collideWith(sprite) {
    const collidedItem = this.items.find((item) => item.collideWith(sprite));
    if (collidedItem) {
      this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height);
      return {
        itemId: collidedItem.id,
      };
    }
  }

  reset() {
    this.items = [];
  }
}

export default ItemController;
