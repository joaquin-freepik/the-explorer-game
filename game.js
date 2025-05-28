class Sprite {
    constructor(image, x, y) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = image.width;
        this.height = image.height;
        this.vx = 0;
        this.vy = 0;
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
        this.heroes = [
            { name: 'Finn', img: this.sprites[0] },
            { name: 'Maya', img: this.sprites[1] },
            { name: 'Leo',  img: this.sprites[2] },
            { name: 'Amara',img: this.sprites[3] }
        ];
        this.heroIndex = 0;

        const startImg = this.heroes[0].img || this.createPlaceholder();
        this.player = new Sprite(startImg, 400, 300);

        this.items = [];
        this.spawnItems();

        const enemyImg = this.sprites[4] || this.createRedSquare();
        this.enemy = new Sprite(enemyImg, 100, 100);
        this.enemy.vx = 1;
        this.enemy.vy = 1;

        this.health = 100;
        this.stamina = 100;
        this.hunger = 100;
        this.dayTimer = 90; // seconds

        this.lastTime = performance.now();
        requestAnimationFrame(t => this.loop(t));
    }

    createPlaceholder() {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 16;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'magenta';
        ctx.fillRect(0, 0, 16, 16);
        return canvas;
    }

    createRedSquare() {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 16;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 16, 16);
        return canvas;
    }

    spawnItems() {
        this.items = [];
        for (let i = 0; i < 5; i++) {
            const img = this.sprites[5] || this.createPlaceholder();
            const item = new Sprite(img, Math.random() * (this.canvas.width - 16), Math.random() * (this.canvas.height - 16));
            item.type = 'food';
            this.items.push(item);
        }
    }

    loop(time) {
        const dt = (time - this.lastTime) / 1000;
        this.lastTime = time;
        this.update(dt);
        this.render();
        requestAnimationFrame(t => this.loop(t));
    }

    update(dt) {
        const speed = 100 * dt;
        if (this.keys['ArrowUp']) this.player.y -= speed;
        if (this.keys['ArrowDown']) this.player.y += speed;
        if (this.keys['ArrowLeft']) this.player.x -= speed;
        if (this.keys['ArrowRight']) this.player.x += speed;

        if (this.keys['q']) {
            this.keys['q'] = false;
            this.heroIndex = (this.heroIndex + 1) % this.heroes.length;
            const hero = this.heroes[this.heroIndex];
            this.player.image = hero.img || this.createPlaceholder();
        }

        // Bounds
        this.player.x = Math.max(0, Math.min(this.canvas.width - this.player.width, this.player.x));
        this.player.y = Math.max(0, Math.min(this.canvas.height - this.player.height, this.player.y));

        // Enemy simple move
        this.enemy.x += this.enemy.vx;
        this.enemy.y += this.enemy.vy;
        if (this.enemy.x < 0 || this.enemy.x > this.canvas.width - this.enemy.width) this.enemy.vx *= -1;
        if (this.enemy.y < 0 || this.enemy.y > this.canvas.height - this.enemy.height) this.enemy.vy *= -1;

        // Collision with enemy
        if (this.checkCollision(this.player, this.enemy)) {
            this.health = Math.max(0, this.health - 20 * dt);
        }

        // Item collection
        this.items = this.items.filter(item => {
            if (this.checkCollision(this.player, item)) {
                this.hunger = Math.min(100, this.hunger + 20);
                return false;
            }
            return true;
        });

        if (this.items.length === 0) this.spawnItems();

        // Timers
        this.dayTimer -= dt;
        this.hunger = Math.max(0, this.hunger - dt * 2);
        if (this.dayTimer <= 0) {
            this.stamina = Math.max(0, this.stamina - dt * 10);
        }
    }

    checkCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // ground
        this.ctx.fillStyle = '#063';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // items
        for (const item of this.items) item.draw(this.ctx);

        // enemy
        this.enemy.draw(this.ctx);

        // player
        this.player.draw(this.ctx);

        // HUD
        this.drawBar(10, 10, 'Health', '#c33', this.health);
        this.drawBar(10, 30, 'Stamina', '#3c3', this.stamina);
        this.drawBar(10, 50, 'Hunger', '#cc3', this.hunger);
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText('Hero: ' + this.heroes[this.heroIndex].name, 10, 70);

        if (this.dayTimer < 10 && Math.floor(this.dayTimer * 5) % 2 === 0) {
            this.ctx.fillStyle = 'rgba(20,0,50,0.3)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    drawBar(x, y, label, color, value) {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(x - 1, y - 8, 104, 6);
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y - 7, value, 4);
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '10px sans-serif';
        this.ctx.fillText(label, x + 110, y - 2);
    }
}

window.Game = Game;
