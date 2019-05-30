/*
 * @ Author Aford
 * @ Date: 2019/05/30
 */
const throttle = require('lodash/throttle');

class Radar {
  public containerEl: HTMLElement | null = null;
  public canvasEl: HTMLElement | null = null;
  public dpr: number = window.devicePixelRatio;
  public offsetWidth: number = 0;
  public offsetHeight: number = 0;
  public center: { x: number; y: number } = { x: 0, y: 0 };
  public animateRaf: any = null;
  public isPause: boolean = false;
  public isDestory: boolean = false;
  private ctx: any = null;
  private time: number = 0;
  private target: any = Array(10)
    .fill({})
    .map(() => ({
      r: Math.random() * 200 * this.dpr,
      deg: Math.random() * 360,
      opacity: 0,
    }));

  constructor(el: HTMLElement) {
    this.drawFrame = this.drawFrame.bind(this);
    this.containerEl = el;
  }

  public start() {
    this.isPause = false;
    this.init();
    this.draw();
    window.addEventListener('resize', this.resizeControl, false);
    this.isDestory = false;
  }

  private resizeControl() {
    throttle(this.init, 30);
  }

  private colorBlue(opacity: number): string {
    return `rgba(34, 68, 207, ${opacity})`;
  }

  private colorBlueDark(opacity: number): string {
    return `rgba(89, 115, 179, ${opacity})`;
  }

  private colorRed(opacity: number): string {
    return `rgba(255, 0, 109, ${opacity})`;
  }

  private point(r: number, deg: number) {
    const deg_to_pi = Math.PI / 180;
    return {
      x: r * Math.cos(deg_to_pi * deg),
      y: r * Math.sin(deg_to_pi * deg),
    };
  }

  private init() {
    if (this.containerEl) {
      this.offsetWidth = this.containerEl.offsetWidth * this.dpr;
      this.offsetHeight = this.containerEl.offsetHeight * this.dpr;

      this.center = {
        x: this.offsetWidth / 2,
        y: this.offsetHeight / 2,
      };

      if (!this.canvasEl) {
        const canvasEl = document.createElement('canvas');
        const ctx = canvasEl.getContext('2d');

        canvasEl.width = this.offsetWidth;
        canvasEl.height = this.offsetHeight;

        canvasEl.style.width = `${this.offsetWidth / this.dpr}px`;
        canvasEl.style.height = `${this.offsetHeight / this.dpr}px`;

        this.containerEl.appendChild(canvasEl);
        this.canvasEl = canvasEl;
        this.ctx = ctx;
      }

      if (!this.isDestory) {
        this.ctx.restore();
        this.ctx.translate(this.center.x, this.center.y);
      }
    }
  }

  private condCircle(
    r: number,
    lineWidth: number,
    condFn: (p: number) => boolean
  ) {
    const ctx = this.ctx;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = this.colorBlueDark(1);

    ctx.beginPath();
    for (let i = 0; i <= 360; i++) {
      var point = this.point(r, i);
      if (condFn(i)) {
        ctx.lineTo(point.x, point.y);
      } else {
        ctx.moveTo(point.x, point.y);
      }
    }
    ctx.stroke();
  }

  private drawBg() {
    const ctx = this.ctx;
    const dpr = this.dpr;

    ctx.beginPath();
    ctx.fillStyle = '#090819';
    ctx.rect(-2000 * dpr, -2000 * dpr, 4000 * dpr, 4000 * dpr);
    ctx.fill();
  }

  private drawAxis() {
    const ctx = this.ctx;

    ctx.strokeStyle = this.colorBlueDark(0.3);
    ctx.moveTo(-this.offsetWidth / 2, 0);
    ctx.lineTo(this.offsetWidth / 2, 0);
    ctx.moveTo(0, -this.offsetHeight / 2);
    ctx.lineTo(0, this.offsetHeight / 2);
    ctx.stroke();
  }

  private drawFan() {
    const ctx = this.ctx;
    const dpr = this.dpr;

    const r = 188 * dpr;
    const line_deg = (this.time / 2) % 360;
    const line_deg_len = 100;

    for (let i = 0; i < line_deg_len; i++) {
      const deg1 = line_deg - i - 1;
      const deg2 = line_deg - i;

      const point1 = this.point(r, deg1);
      const point2 = this.point(r, deg2);

      let opacity = 1 - i / line_deg_len - 0.3;
      if (i === 0) {
        opacity = 1;
      }

      ctx.beginPath();
      ctx.fillStyle = this.colorBlue(opacity);
      ctx.moveTo(0, 0);
      ctx.lineTo(point1.x, point1.y);
      ctx.lineTo(point2.x, point2.y);
      ctx.fill();
    }

    this.target.forEach((obj: any) => {
      const { opacity, r, deg } = obj;

      ctx.fillStyle = this.colorRed(opacity);
      const { x, y } = this.point(r, deg);

      ctx.beginPath();
      ctx.arc(x, y, 4 * dpr, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = this.colorRed(opacity);
      const x_size = 6 * dpr;
      ctx.lineWidth = 4 * dpr;

      ctx.beginPath();
      ctx.moveTo(x - x_size, y + x_size);
      ctx.lineTo(x + x_size, y - x_size);
      ctx.moveTo(x + x_size, y + x_size);
      ctx.lineTo(x - x_size, y - x_size);
      ctx.stroke();

      if (Math.abs(deg - line_deg) <= 1) {
        obj.opacity = 1;
      }

      obj.opacity *= 0.99;

      ctx.strokeStyle = this.colorRed(opacity);
      ctx.lineWidth = 1 * dpr;
      ctx.beginPath();
      ctx.arc(x, y, 10 * (1 / (opacity + 0.0001)) * dpr, 0, 2 * Math.PI);

      ctx.stroke();
    });
  }

  private drawCalibration() {
    const ctx = this.ctx;
    const dpr = this.dpr;

    ctx.strokeStyle = this.colorBlueDark(1);
    const split = 120;
    const feature = 15;
    const start_r = 164 * dpr;
    let len = 5 * dpr;

    for (let i = 0; i < split; i++) {
      ctx.beginPath();
      const deg = (i / 120) * 360;
      if (i % feature == 0) {
        len = 10 * dpr;
        ctx.lineWidth = 3 * dpr;
      } else {
        len = 5 * dpr;
        ctx.lineWidth = 1;
      }

      const point1 = this.point(start_r, deg);
      const point2 = this.point(start_r + len, deg);

      ctx.moveTo(point1.x, point1.y);
      ctx.lineTo(point2.x, point2.y);

      ctx.stroke();
    }
    this.condCircle(
      188 * dpr,
      2 * dpr,
      deg => (deg + this.time / 10) % 180 < 90
    );

    this.condCircle(60 * dpr, 1, deg => deg % 3 < 1);
    this.condCircle(136 * dpr, 1, () => true);
  }

  private drawFrame() {
    this.time += 1;

    this.drawBg();
    this.drawAxis();
    !this.isPause && this.drawFan();
    this.drawCalibration();
  }

  public pause() {
    this.isPause = true;
  }

  public play() {
    this.isPause = false;
  }

  private draw() {
    this.animateRaf = window.requestAnimationFrame(this.draw.bind(this));
    this.drawFrame();
  }

  public destroy() {
    window.removeEventListener('resize', this.resizeControl);
    window.cancelAnimationFrame(this.animateRaf);
    this.pause();
    this.drawFrame();
    this.isDestory = true;
  }
}

export default Radar;
