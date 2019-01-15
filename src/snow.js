const defaultOptions = {
  screen: 'fullscreen',
  color: 'white',
  count: 300,
};

export default class Snow {
  constructor(canvas, options) {
    this.canvas = canvas;
    this.options = Object.assign(defaultOptions, options);
    this.width = 0;
    this.height = 0;
    this.snowFlakes = [];

    this.init();
  }

  init() {
    this.canvasContext = this.canvas.getContext('2d');

    this.onResize();
  }

  onResize() {
    this.setScreenMode();

    window.addEventListener('resize', this.setScreenMode.bind(this), false);

    this.drawSnowFlakes();

    this.update();
  }

  setScreenMode() {
    switch (this.options.screen) {
      case 'fullscreen':
        this.setFullScreenMode();
        break;
    }
  }

  setFullScreenMode() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  update() {
    this.canvasContext.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.snowFlakes.length; i++) {
      const snowflake = this.snowFlakes[i];
      snowflake.y += snowflake.vy;
      snowflake.x += snowflake.vx;

      this.canvasContext.fillStyle = this.options.color;
      this.canvasContext.globalAlpha = snowflake.o;
      this.canvasContext.beginPath();
      this.canvasContext.arc(
          snowflake.x, snowflake.y, snowflake.r, 0, Math.PI * 2, false
      );
      this.canvasContext.closePath();
      this.canvasContext.fill();

      if (snowflake.y > this.height) {
        this.snowFlakeReset(i);
      }
    }

    window.requestAnimationFrame(this.update.bind(this));
  }

  drawSnowFlakes() {
    for (let i = 0; i < this.options.count; i++) {
      this.snowFlakes.push(this.generateSnowFlake());
      this.snowFlakeReset(i);
    }
  }

  generateSnowFlake() {
    const snowFlake = {};

    snowFlake.x = 0;
    snowFlake.y = 0;
    snowFlake.vy = 0;
    snowFlake.vx = 0;
    snowFlake.r = 0;

    return snowFlake;
  }

  snowFlakeReset(i) {
    this.snowFlakes[i].x = Math.random() * this.width;
    this.snowFlakes[i].y = Math.random() * -this.height;
    this.snowFlakes[i].vy = 1 + Math.random() * 3;
    this.snowFlakes[i].vx = 0.5 - Math.random();
    this.snowFlakes[i].r = 1 + Math.random() * 2;
    this.snowFlakes[i].o = 0.5 + Math.random() * 0.5;
  }
}
