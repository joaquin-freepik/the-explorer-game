// Basic tile-based adventure with dual renderers
const TILE_SIZE = 32;
const MAP_TEMPLATE = [
  '####################',
  '#P.......F.........#',
  '#..#####..####.....#',
  '#..#...#......F....#',
  '#..#.E.#..#####....#',
  '#..#####...........#',
  '#.................#',
  '####################'
];

class Game {
  constructor(renderer) {
    this.renderer = renderer;
    this.heroes = ['Finn', 'Maya', 'Leo', 'Amara'];
    this.heroIndex = 0;
    this.loadMap(MAP_TEMPLATE);
  }

  loadMap(template) {
    this.map = template.map(row => row.split(''));
    this.height = this.map.length;
    this.width = this.map[0].length;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const c = this.map[y][x];
        if (c === 'P') { this.player = {x, y}; }
        if (c === 'E') { this.enemy = {x, y}; }
      }
    }
  }

  handleInput(key) {
    let dx = 0, dy = 0;
    if (key === 'left' || key === 'a') dx = -1;
    if (key === 'right' || key === 'd') dx = 1;
    if (key === 'up' || key === 'w') dy = -1;
    if (key === 'down' || key === 's') dy = 1;
    if (key === 'q') {
      this.heroIndex = (this.heroIndex + 1) % this.heroes.length;
      return;
    }
    const nx = this.player.x + dx;
    const ny = this.player.y + dy;
    if (this.map[ny] && this.map[ny][nx] && this.map[ny][nx] !== '#') {
      if (this.map[ny][nx] === 'F') {
        // pick up food -> just remove
      }
      this.map[this.player.y][this.player.x] = '.';
      this.player.x = nx; this.player.y = ny;
      this.map[ny][nx] = 'P';
    }
  }

  update() {
    // simple enemy random walk
    if (!this.enemy) return;
    const dirs = [[0,-1],[0,1],[-1,0],[1,0]];
    const [dx,dy] = dirs[Math.floor(Math.random()*dirs.length)];
    const nx = this.enemy.x + dx;
    const ny = this.enemy.y + dy;
    if (this.map[ny] && this.map[ny][nx] && this.map[ny][nx] !== '#') {
      if (this.map[ny][nx] === 'P') {
        // simple collision -> reset player
        this.map[this.player.y][this.player.x] = '.';
        this.player.x = 1; this.player.y = 1;
      }
      this.map[this.enemy.y][this.enemy.x] = '.';
      this.enemy.x = nx; this.enemy.y = ny;
      this.map[ny][nx] = 'E';
    }
  }

  tick() {
    this.update();
    this.renderer.render(this);
  }

  run() {
    this.renderer.render(this);
    this.interval = setInterval(() => this.tick(), 500);
  }
}

class CanvasRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }
  render(game) {
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    for (let y=0; y<game.height; y++) {
      for (let x=0; x<game.width; x++) {
        const c = game.map[y][x];
        this.ctx.fillStyle = this.colorFor(c);
        this.ctx.fillRect(x*TILE_SIZE,y*TILE_SIZE,TILE_SIZE,TILE_SIZE);
      }
    }
    this.ctx.fillStyle = '#fff';
    this.ctx.fillText('Hero: '+game.heroes[game.heroIndex], 10, this.canvas.height-10);
  }
  colorFor(c){
    switch(c){
      case '#': return '#333';
      case 'P': return '#0f0';
      case 'E': return '#f00';
      case 'F': return '#ff0';
      default: return '#063';
    }
  }
}

class TextRenderer {
  render(game) {
    console.clear();
    const rows = game.map.map(row => row.join(''));
    console.log(rows.join('\n'));
    console.log('Hero: '+game.heroes[game.heroIndex]);
  }
}

if (typeof window === 'undefined') {
  // Node version
  const readline = require('readline');
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  const renderer = new TextRenderer();
  const game = new Game(renderer);
  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') { process.exit(); }
    game.handleInput(key.name || str);
  });
  game.run();
} else {
  window.Game = Game;
  window.CanvasRenderer = CanvasRenderer;
  window.TextRenderer = TextRenderer;
}
