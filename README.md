# Brick Puzzle Demo

A responsive, visually engaging 2D block puzzle game built with **React** and **Vite**. The game challenges players to drag and drop distinct Tetromino-style shapes onto a 10x10 grid to form and automatically clear full rows and columns, earning score multipliers for consecutive clears.

## Features
- **Intuitive Drag & Drop**: Flawless, precise placement geometry allowing players to snap pieces onto the board confidently.
- **19 Unique Shapes**: Varied block distributions ranging from simple 1x1 squares to complex 3x3 L-shapes.
- **Responsive Design**: Designed Mobile-first to be fully playable anywhere from small smartphone touchscreens to ultra-wide desktop monitors without UI clipping.
- **Dynamic Physics & Particles**: Highly polished visual feedback including grid validation highlighting, smooth shape drop shadows, and exploding block particle animations upon clearing lines.
- **Audio Feedback**: Satisfying, cleanly synthesized audio cues mapping to placement locks and game over states.

## How to Play

1. Drag blocks from your tray to the 10x10 board.
2. Form completely solid horizontal or vertical lines to clear the blocks and score.
3. You get 3 pieces at a time; when all 3 are played, the tray replenishes.
4. If there's absolutely nowhere left to place any of the pieces remaining in your tray, it's **Game Over!**

## Tech Stack
- React
- Vanilla CSS (Glassmorphism & CSS Animations)
- Web Audio API

## Getting Started

To run this project locally:

```bash
npm install
npm run dev
```
