import React, { useState, useEffect, useCallback, useRef } from 'react';
import Board from './Board';
import ShapeTray from './ShapeTray';
import ParticleSystem from './ParticleSystem';
import { SHAPES, getRandomShapes } from '../constants/shapes';
import { audio } from '../utils/audioController';

const ROWS = 10;
const COLS = 10;

const createEmptyGrid = () => Array(ROWS).fill(null).map(() => Array(COLS).fill(null));

const Game = () => {
  const particleRef = useRef(null);
  const [grid, setGrid] = useState(createEmptyGrid());
  const [availableShapes, setAvailableShapes] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Drag state
  const [draggedShape, setDraggedShape] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragShapeIndex, setDragShapeIndex] = useState(null);
  const [previewOffsets, setPreviewOffsets] = useState([]);
  const [previewValid, setPreviewValid] = useState(true);
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
  const [isReturning, setIsReturning] = useState(false);
  const [clearingCells, setClearingCells] = useState(null);
  const [boardCellSize, setBoardCellSize] = useState(32);

  // Ref for calculating board positions accurately
  const isDraggingRef = useRef(false);

  useEffect(() => {
    setAvailableShapes(getRandomShapes());
    
    const updateSize = () => {
      const boardEl = document.getElementById('board-container');
      if (boardEl) {
        const width = boardEl.clientWidth;
        // 16px padding inside container + 18px total gap = 34px buffer roughly
        const size = (width - 34) / 10;
        setBoardCellSize(size);
      }
    };
    updateSize();
    setTimeout(updateSize, 100);
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Check if grid can place the shape at r, c
  const canPlace = (shapeBlocks, startR, startC) => {
    for (const b of shapeBlocks) {
      const r = startR + b.r;
      const c = startC + b.c;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || grid[r][c] !== null) {
        return false;
      }
    }
    return true;
  };

  // Convert pointer x/y to grid coordinates algebraically
  const getGridCoordinates = (x, y, shapeTopLeftX, shapeTopLeftY) => {
    const boardEl = document.getElementById('board-container');
    if (!boardEl) return null;
    
    // We get the specific cell elements to find exact coordinates
    const rect = boardEl.getBoundingClientRect();
    
    // Check if pointer is over the board area safely
    if (
      x >= rect.left - 30 && x <= rect.right + 30 &&
      y >= rect.top - 30 && y <= rect.bottom + 30
    ) {
      // Algebraic calculation
      const gridStartX = rect.left + 8; // padding is 8px
      const gridStartY = rect.top + 8;
      const cellTotal = boardCellSize + 2; // size + gap
      
      const targetX = shapeTopLeftX + boardCellSize / 2;
      const targetY = shapeTopLeftY + boardCellSize / 2;
      
      const col = Math.floor((targetX - gridStartX) / cellTotal);
      const row = Math.floor((targetY - gridStartY) / cellTotal);
      
      return { r: row, c: col };
    }
    return null;
  };

  // --- Pointer Handlers ---
  const handleDragStart = (e, shape, index, grabOffset) => {
    if (gameOver || clearingCells || isReturning) return;
    
    const trayBlockSize = window.innerWidth < 480 ? 20 : 26;
    const f = boardCellSize / trayBlockSize;
    
    // Scale offset to keep cursor pinned smoothly over enlarged shadow
    const scaledOffset = {
      x: grabOffset.x * f,
      y: grabOffset.y * f
    };
    
    setDraggedShape(shape);
    setDragShapeIndex(index);
    setDragOffset(scaledOffset);
    setDragPosition({ x: e.clientX, y: e.clientY });
    setStartDragPos({ x: e.clientX, y: e.clientY });
    setIsReturning(false);
    isDraggingRef.current = true;
    
    // Prevent default on document.body for touch scaling
    document.body.style.userSelect = 'none';
  };

  const handlePointerMove = useCallback((e) => {
    if (!isDraggingRef.current || !draggedShape) return;
    
    // e.preventDefault(); // may throw on passive listeners, handled in CSS
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);
    
    if (x === undefined || y === undefined) return;

    setDragPosition({ x, y });

    const shapeTopLeftX = x - dragOffset.x;
    const shapeTopLeftY = y - dragOffset.y;
    
    // Calculate grid cell under the cursor algebraically
    const gridCoords = getGridCoordinates(x, y, shapeTopLeftX, shapeTopLeftY);
    
    if (gridCoords) {
      const isValid = canPlace(draggedShape.blocks, gridCoords.r, gridCoords.c);
      setPreviewValid(isValid);
      
      const pOffsets = draggedShape.blocks.map(b => ({
        r: gridCoords.r + b.r,
        c: gridCoords.c + b.c
      }));
      setPreviewOffsets(pOffsets);
    } else {
      setPreviewOffsets([]);
      setPreviewValid(false);
    }
  }, [draggedShape, grid]);

  const handlePointerUp = useCallback((e) => {
    if (!isDraggingRef.current || !draggedShape) return;
    isDraggingRef.current = false;
    document.body.style.userSelect = 'auto';

    const x = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
    const y = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);

    const shapeTopLeftX = x - dragOffset.x;
    const shapeTopLeftY = y - dragOffset.y;

    const gridCoords = getGridCoordinates(x, y, shapeTopLeftX, shapeTopLeftY);

    if (gridCoords && canPlace(draggedShape.blocks, gridCoords.r, gridCoords.c)) {
      // Place it
      const newGrid = [...grid.map(row => [...row])];
      draggedShape.blocks.forEach(b => {
        newGrid[gridCoords.r + b.r][gridCoords.c + b.c] = draggedShape.colorHex;
      });
      setGrid(newGrid);
      
      const scoreGain = draggedShape.blocks.length; // 1 point per block
      
      // Update shapes
      const newAvailable = [...availableShapes];
      newAvailable[dragShapeIndex] = null;
      
      // Check if all used, then get new ones
      if (newAvailable.every(s => s === null)) {
        setAvailableShapes(getRandomShapes());
      } else {
        setAvailableShapes(newAvailable);
      }
      
      setDraggedShape(null);
      setDragShapeIndex(null);
      setPreviewOffsets([]);
      
      handleScoreAndClears(newGrid, score + scoreGain, newAvailable);
      audio.playPlace();
    } else {
      // Invalid drop, animate back
      setIsReturning(true);
      setDragPosition(startDragPos);
      setPreviewOffsets([]);
      
      setTimeout(() => {
        setDraggedShape(null);
        setDragShapeIndex(null);
        setIsReturning(false);
      }, 300); // match CSS transitions
    }
  }, [draggedShape, dragShapeIndex, availableShapes, grid, score, startDragPos]);

  // Handle global events
  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);
    
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  // -- Game Logic: Clearing & Game Over --
  const handleScoreAndClears = (currentGrid, currentScore, nextShapes) => {
    let newGrid = [...currentGrid.map(row => [...row])];
    let rowsToClear = [];
    let colsToClear = [];

    // Check rows
    for (let r = 0; r < ROWS; r++) {
      if (newGrid[r].every(cell => cell !== null)) {
        rowsToClear.push(r);
      }
    }

    // Check cols
    for (let c = 0; c < COLS; c++) {
      let isFull = true;
      for (let r = 0; r < ROWS; r++) {
        if (newGrid[r][c] === null) {
          isFull = false;
          break;
        }
      }
      if (isFull) colsToClear.push(c);
    }

    let cellsToClear = [];
    let clearedBlocks = 0;
    
    // Clear rows
    rowsToClear.forEach(r => {
      for (let c = 0; c < COLS; c++) {
        if (newGrid[r][c] !== null && !cellsToClear.some(x => x.r === r && x.c === c)) {
          cellsToClear.push({ r, c });
          clearedBlocks++;
        }
      }
    });

    // Clear cols
    colsToClear.forEach(c => {
      for (let r = 0; r < ROWS; r++) {
        if (newGrid[r][c] !== null && !cellsToClear.some(x => x.r === r && x.c === c)) {
          cellsToClear.push({ r, c });
          clearedBlocks++;
        }
      }
    });

    let newScore = currentScore;
    
    // Refill shapes if needed immediately to check game over
    let shapesToCheck = nextShapes;
    if (nextShapes.every(s => s === null)) {
      shapesToCheck = getRandomShapes();
      setAvailableShapes(shapesToCheck);
    }

    if (cellsToClear.length > 0) {
      // Bonus points for clearing lines
      const lineScore = (rowsToClear.length + colsToClear.length) * 10;
      newScore += lineScore + clearedBlocks;
      audio.playClear();
      
      setClearingCells(cellsToClear);

      // Trigger particle effects based on board element DOM positions
      setTimeout(() => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
          const r = parseInt(cell.getAttribute('data-row'), 10);
          const c = parseInt(cell.getAttribute('data-col'), 10);
          if (cellsToClear.some(x => x.r === r && x.c === c)) {
            const rect = cell.getBoundingClientRect();
            const color = window.getComputedStyle(cell).backgroundColor;
            if (particleRef.current && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
              particleRef.current.createExplosion(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                color
              );
            }
          }
        });
      }, 0);
      
      setTimeout(() => {
        setGrid(prev => {
          const next = prev.map(row => [...row]);
          cellsToClear.forEach(c => {
            next[c.r][c.c] = null;
          });
          
          setTimeout(() => checkGameOver(next, shapesToCheck), 0);
          return next;
        });
        
        setScore(newScore);
        setClearingCells(null);
      }, 300);
    } else {
      setScore(newScore);
      checkGameOver(newGrid, shapesToCheck);
    }
  };

  const checkGameOver = (currentGrid, shapes) => {
    // If there are no shapes to place (they were just refilled and are empty? shouldn't happen)
    const validShapes = shapes.filter(s => s !== null);
    if (validShapes.length === 0) return;

    const isOver = validShapes.every(shape => {
      // Can this shape be placed anywhere?
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          // Pass currentGrid instead of grid here!
          if (canPlaceOnGrid(shape.blocks, r, c, currentGrid)) {
            return false; // Found a valid spot for this shape
          }
        }
      }
      return true; // No valid spot for this shape
    });

    if (isOver) {
      setGameOver(true);
      audio.playGameOver();
    }
  };

  const canPlaceOnGrid = (shapeBlocks, startR, startC, targetGrid) => {
    for (const b of shapeBlocks) {
      const r = startR + b.r;
      const c = startC + b.c;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || targetGrid[r][c] !== null) {
        return false;
      }
    }
    return true;
  };

  const restartGame = () => {
    setGrid(createEmptyGrid());
    setAvailableShapes(getRandomShapes());
    setScore(0);
    setGameOver(false);
  };

  // Render draggable proxy
  const renderDraggedShape = () => {
    if (!draggedShape) return null;

    return (
      <div 
        className={`shape-container dragging ${isReturning ? 'returning' : ''}`}
        style={{
          left: dragPosition.x - dragOffset.x,
          top: dragPosition.y - dragOffset.y,
          pointerEvents: 'none', // Crucial so elementsFromPoint works
          transition: isReturning ? 'left 0.3s ease, top 0.3s ease' : 'none'
        }}
      >
        {draggedShape.blocks.map((b, idx) => (
          <div 
            key={idx}
            className={`shape-block ${draggedShape.colorClass}`}
            style={{
              backgroundColor: draggedShape.colorHex,
              top: `${b.r * (boardCellSize + 2)}px`,
              left: `${b.c * (boardCellSize + 2)}px`,
              width: `${boardCellSize}px`,
              height: `${boardCellSize}px`
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <header>
        <div className="title">Brick puzzel demo</div>
        <div className="score-panel">
          <span className="score-label">Score</span>
          <span className="score-value">{score}</span>
        </div>
      </header>
      
      <Board grid={grid} previewOffsets={previewOffsets} previewValid={previewValid} clearingCells={clearingCells} />
      
      <ShapeTray 
        availableShapes={availableShapes} 
        onDragStart={handleDragStart} 
      />

      {renderDraggedShape()}

      {gameOver && (
        <div className="game-over">
          <h2>Game Over</h2>
          <p>Final Score: {score}</p>
          <button className="restart-btn" onClick={restartGame}>Play Again</button>
        </div>
      )}

      <ParticleSystem ref={particleRef} />
    </>
  );
};

export default Game;
