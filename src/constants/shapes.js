// Block definitions:
// Each shape has an ID, color (for styling), and a blocks array.
// The blocks array contains {r, c} coordinates relative to the shape's origin (0, 0).

export const SHAPES = [
  // 1x1 Square
  {
    id: 'dot',
    colorClass: 'color-1',
    colorHex: 'var(--color-1)',
    blocks: [{ r: 0, c: 0 }]
  },
  // 2x2 Square
  {
    id: 'square-2',
    colorClass: 'color-3',
    colorHex: 'var(--color-3)',
    blocks: [
      { r: 0, c: 0 }, { r: 0, c: 1 },
      { r: 1, c: 0 }, { r: 1, c: 1 }
    ]
  },
  // 3x3 Square
  {
    id: 'square-3',
    colorClass: 'color-7',
    colorHex: 'var(--color-7)',
    blocks: [
      { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 },
      { r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 },
      { r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 }
    ]
  },
  // 1x2 Line H
  {
    id: 'line-2-h',
    colorClass: 'color-2',
    colorHex: 'var(--color-2)',
    blocks: [{ r: 0, c: 0 }, { r: 0, c: 1 }]
  },
  // 1x2 Line V
  {
    id: 'line-2-v',
    colorClass: 'color-2',
    colorHex: 'var(--color-2)',
    blocks: [{ r: 0, c: 0 }, { r: 1, c: 0 }]
  },
  // 1x3 Line H
  {
    id: 'line-3-h',
    colorClass: 'color-4',
    colorHex: 'var(--color-4)',
    blocks: [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }]
  },
  // 1x3 Line V
  {
    id: 'line-3-v',
    colorClass: 'color-4',
    colorHex: 'var(--color-4)',
    blocks: [{ r: 0, c: 0 }, { r: 1, c: 0 }, { r: 2, c: 0 }]
  },
  // 1x4 Line H
  {
    id: 'line-4-h',
    colorClass: 'color-5',
    colorHex: 'var(--color-5)',
    blocks: [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 0, c: 3 }]
  },
  // 1x4 Line V
  {
    id: 'line-4-v',
    colorClass: 'color-5',
    colorHex: 'var(--color-5)',
    blocks: [{ r: 0, c: 0 }, { r: 1, c: 0 }, { r: 2, c: 0 }, { r: 3, c: 0 }]
  },
  // 1x5 Line H
  {
    id: 'line-5-h',
    colorClass: 'color-1',
    colorHex: 'var(--color-1)',
    blocks: [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 0, c: 3 }, { r: 0, c: 4 }]
  },
  // 1x5 Line V
  {
    id: 'line-5-v',
    colorClass: 'color-1',
    colorHex: 'var(--color-1)',
    blocks: [{ r: 0, c: 0 }, { r: 1, c: 0 }, { r: 2, c: 0 }, { r: 3, c: 0 }, { r: 4, c: 0 }]
  },
  // L Shape Small (2x2) TR
  {
    id: 'l-sm-tr',
    colorClass: 'color-6',
    colorHex: 'var(--color-6)',
    blocks: [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 1, c: 1 }]
  },
  // L Shape Small (2x2) TL
  {
    id: 'l-sm-tl',
    colorClass: 'color-6',
    colorHex: 'var(--color-6)',
    blocks: [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 1, c: 0 }]
  },
  // L Shape Small (2x2) BR
  {
    id: 'l-sm-br',
    colorClass: 'color-6',
    colorHex: 'var(--color-6)',
    blocks: [{ r: 0, c: 1 }, { r: 1, c: 0 }, { r: 1, c: 1 }]
  },
  // L Shape Small (2x2) BL
  {
    id: 'l-sm-bl',
    colorClass: 'color-6',
    colorHex: 'var(--color-6)',
    blocks: [{ r: 0, c: 0 }, { r: 1, c: 0 }, { r: 1, c: 1 }]
  },
  // L Shape Big (3x3) TR
  {
    id: 'l-bg-tr',
    colorClass: 'color-4',
    colorHex: 'var(--color-4)',
    blocks: [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 1, c: 2 }, { r: 2, c: 2 }]
  },
  // L Shape Big (3x3) TL
  {
    id: 'l-bg-tl',
    colorClass: 'color-4',
    colorHex: 'var(--color-4)',
    blocks: [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 1, c: 0 }, { r: 2, c: 0 }]
  },
  // L Shape Big (3x3) BR
  {
    id: 'l-bg-br',
    colorClass: 'color-4',
    colorHex: 'var(--color-4)',
    blocks: [{ r: 0, c: 2 }, { r: 1, c: 2 }, { r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 }]
  },
  // L Shape Big (3x3) BL
  {
    id: 'l-bg-bl',
    colorClass: 'color-4',
    colorHex: 'var(--color-4)',
    blocks: [{ r: 0, c: 0 }, { r: 1, c: 0 }, { r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 }]
  }
];

// Helper to get exactly 3 random shapes
export const getRandomShapes = () => {
  const shapes = [];
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * SHAPES.length);
    // Add unique identifier instance-id to separate identical shapes in the tray
    shapes.push({ ...SHAPES[randomIndex], instanceId: `${Date.now()}-${i}` });
  }
  return shapes;
};
