# The Explorer Game Skeleton

This repository contains a minimal browser game setup. Drop your sprite
files inside `assets/sprites` using sequential names like `01.png`,
`02.png`, etc. The first sprite will be used as the player's placeholder
image.

## Running

Open `index.html` in a modern browser. Use the arrow keys to move the
player sprite around the canvas.

For a text-only version, run the game directly with Node:

```bash
node game.js
```

Use the arrow keys (or `WASD`) to move and `q` to swap heroes.

You can also serve the folder with any static web server if you prefer:

```bash
npx serve .
```

## File Structure

- `index.html` – main HTML page
- `styles.css` – simple styling for the canvas
- `game.js` – JavaScript game loop and asset loader
- `assets/sprites` – place your sprite PNG files here

### 1 · Opening Story (in-game cut-scene)

Your light plane has gone down somewhere deep in the emerald maze of the **Great Rainforest**.
Four school-mates—**Finn**, **Maya**, **Leo**, and **Amara**—scramble clear just before the fuel tank explodes.
With no grown-ups, no mobile signal, and only the scraps in your backpacks, you swear a leaf-printed oath:

> *“We’ll find our way home—and protect this forest while we do!”*

Rumours in old geography magazines speak of a hidden **Sky-Temple** whose beacon once guided early aviators.
If you can reach that temple, you can transmit an SOS … but the journey winds through tangled canopy, sun-burnt rivers, and forgotten ruins guarded by creatures that call this place home.

---

### 2 · Core Gameplay Loop

1. **Explore** procedurally built jungle tilemaps.
2. **Gather** food, water, and crafting parts (vines, bamboo, crystal shards).
3. **Craft or combine** items at night-camp: rope ladder, slingshot, raft, beacon battery.
4. **Solve micro-puzzles** that unlock new zones (e.g., align ancient glyphs, repair rope bridge).
5. **Avoid or pacify wildlife**—stealth past a jaguar, distract piranha with fruit.
6. **Reach the Day’s Goal tile** before sunset or risk stamina loss.
7. **Final stage:** assemble the beacon atop the Sky-Temple and trigger the rescue flare.

---

### 3 · Detailed Mechanics for MakeCode Arcade

| Feature             | Implementation Hint                                                                                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Multi-Hero Swap** | Pressing the letter `q` cycles through the four kid sprites. Each has a signature ability (Finn = climb, Maya = heal plants, Leo = craft, Amara = navigate waterways).                   |
| **Status Bars**     | Use the Status Bar extension: *Health*, *Stamina*, *Hunger*. Hunger depletes over time; refill with collected food items.                                                                 |
| **Inventory**       | Store up to 6 items in an array; lay out icons at bottom using `setFlag(SpriteFlag.Ghost)` so the player can still move underneath.                                                       |
| **Crafting Bench**  | A camp-fire tile. On overlap + `A` button, open a modal tilemap overlay that lists craftable combos.                                                                                      |
| **Day/Night Cycle** | A countdown timer (90 s default). At 10 s, add a semi-transparent indigo screen-fill to simulate dusk. If timer hits 0, stamina drains 1 per second until player sleeps at camp.          |
| **Animal AI**       | Each hazard sprite uses `moveWithObstacles()` along a patrol path or `follow()` when the player is near.                                                                                  |
| **Mini-games**      | ‣ **Bridge-repair** (arrange planks in a 3×3 grid).<br>‣ **Raft-ride** (auto-scrolling endless-runner segment; avoid logs & caiman).<br>‣ **Glyph-dial** (rotate rings so symbols align). |
| **Checkpoint Save** | After every big puzzle, store hero stats & map index in `blockSettings`.                                                                                                                  |
| **Victory Scene**   | When beacon assembled, spawn rescue-plane silhouette sprite; fade to white and roll credits.                                                                                              |

---

### 4 · List of Sprites (ready-to-send prompts for any pixel-art generator)

> *All sprites: 16 × 16 px, bright 16-color palette, MakeCode Arcade style, transparent background unless noted.*

#### **Playable Characters**

1. **Finn** — brown-haired boy, rolled-up khaki sleeves, explorer hat, tiny rope coil at belt.
2. **Maya** — dark-skinned girl, short curls, teal bandana, satchel with plant icon.
3. **Leo** — tan-skinned boy, messy blond hair, red hoodie tied at waist, holding wrench.
4. **Amara** — Black girl, braided ponytail, yellow life-vest over green shirt, paddle strapped on back.

#### **Companion & NPC**

5. **Tame Capybara** — round chestnut rodent, friendly eyes, small leaf saddle.
6. **The Old Explorer** — silver-bearded adult, patched flight jacket, monocle, walking stick.

#### **Wildlife & Hazards**

7. **Jaguar** — sleek black cat, gold eyes, crouched animation frame.
8. **Emerald Boa** — coiled green snake with tongue flick.
9. **Caiman** — river reptile top-down, jaws agape frame.
10. **Piranha** — red-bellied fish, side view, angry expression.
11. **Stinging Ant Swarm** — cloud of tiny red dots with wavy outline.
12. **Venom Dart** — glowing purple dart trap projectile.

#### **Environment Tiles / Objects**

13. **Jungle Ground Tile** — leafy floor with scattered roots.
14. **Climbable Vine Tile** — vertical vine with broad leaves.
15. **Rope Bridge Segment** — wooden plank with side ropes.
16. **Camp-fire** — low log circle, small animated flame (3-frame loop).
17. **Ancient Glyph Dial** — stone circle with insect motif, four wedge buttons.
18. **Sky-Temple Beacon** — pedestal with crystal socket; idle glow frame.
19. **Crystal Shard Item** — cyan rhombus with sparkle.
20. **Fruit Bunch Item** — red palm berries cluster.
21. **Water Gourd Item** — light-brown flask with cork.
22. **Bamboo Pole Item** — slim green stalk, cut ends.
23. **Raft Piece** — trio of lashed logs, top-down.

#### **UI & Effects**

24. **Heart Icon** — glossy red heart.
25. **Stamina Bolt** — white lightning shape.
26. **Hunger Drumstick** — cartoon cooked leg.
27. **Dialogue Portrait Frames** — 32 × 32 partial-body busts matching each kid.
28. **Sun/Moon HUD icon** — sun with smiling face, moon crescent with stars (for day/night).

---

### 5 · Why Kids Will Love It

* **Teamwork fantasy**: even in single-player, swapping heroes feels like co-op.
* **Short play sessions**: each day/night loop \~3 minutes—snack-size achievements.
* **Gentle learning**: discreet lessons in ecology, resource management, and map reading.
* **Generative replay**: randomised jungle patches ensure new secrets every flight-crash.

Feel free to lift, remix, or simplify any mechanic to suit your classroom or workshop time. Happy jungle-making in MakeCode Arcade!

