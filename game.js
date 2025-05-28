class Sprite {
    constructor(image, x, y) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = image.width;
        this.height = image.height;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y);
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.keys = {};
        window.addEventListener('keydown', e => this.keys[e.key] = true);
        window.addEventListener('keyup', e => this.keys[e.key] = false);
        this.loadAssets().then(() => this.start());
    }

    async loadAssets() {
        this.sprites = [];
        for (let i = 1; i <= 30; i++) {
            const num = String(i).padStart(2, '0');
            const path = `assets/sprites/${num}.png`;
            const img = await this.loadImage(path);
            if (img) {
                this.sprites.push(img);
            }
        }
    }

    loadImage(src) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = src;
        });
    }

    start() {
        const heroImg = this.sprites[0];
        this.player = new Sprite(heroImg || this.createPlaceholder(), 400, 300);
        requestAnimationFrame(() => this.loop());
    }

    createPlaceholder() {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 16;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'magenta';
        ctx.fillRect(0, 0, 16, 16);
        return canvas;
    }

    loop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.loop());
    }

    update() {
        const speed = 2;
        if (this.keys['ArrowUp']) this.player.y -= speed;
        if (this.keys['ArrowDown']) this.player.y += speed;
        if (this.keys['ArrowLeft']) this.player.x -= speed;
        if (this.keys['ArrowRight']) this.player.x += speed;
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.draw(this.ctx);
    }
}

window.addEventListener('DOMContentLoaded', () => new Game());
