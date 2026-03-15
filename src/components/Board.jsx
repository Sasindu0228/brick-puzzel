import React from 'react';

const Board = ({ grid, previewOffsets, previewValid, clearingCells }) => {
  return (
    <div className="board-container" id="board-container">
      <div className="board-grid">
        {grid.map((row, rEntry) => (
          row.map((cell, cEntry) => {
            const isPreview = previewOffsets.some(
              (p) => p.r === rEntry && p.c === cEntry
            );
            const isClearing = clearingCells && clearingCells.some(c => c.r === rEntry && c.c === cEntry);
            const className = `cell ${cell ? 'filled ' + cell : ''} ${isPreview ? 'preview' : ''} ${isClearing ? 'clearing' : ''}`;
            const isFilled = cell !== null;
            // style with CSS variable if cell has color string (e.g. 'var(--color-3)')
            const style = isFilled ? { backgroundColor: cell } : {};
            if (isPreview && !isFilled) {
               style.backgroundColor = previewValid ? 'rgba(72, 187, 120, 0.6)' : 'rgba(245, 101, 101, 0.6)'; // Green or Red highlight
            }

            return (
              <div
                key={`${rEntry}-${cEntry}`}
                className={className}
                style={style}
                data-row={rEntry}
                data-col={cEntry}
              />
            );
          })
        ))}
      </div>
    </div>
  );
};

export default Board;
