# The Explorer Game Skeleton

This repository contains a minimal browser game setup. Drop your sprite
files inside `assets/sprites` using sequential names like `01.png`,
`02.png`, etc. The first sprite will be used as the player's placeholder
image.

## Running

Open `index.html` in a modern browser. Use the arrow keys to move the
player sprite around the canvas.

You can also serve the folder with any static web server if you prefer:

```bash
npx serve .
```

## File Structure

- `index.html` – main HTML page
- `styles.css` – simple styling for the canvas
- `game.js` – JavaScript game loop and asset loader
- `assets/sprites` – place your sprite PNG files here
