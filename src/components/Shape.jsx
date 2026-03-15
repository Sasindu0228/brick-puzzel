import React, { useRef } from 'react';

const Shape = ({ shape, onDragStart, blockSize = 32 }) => {
  const containerRef = useRef(null);

  const handlePointerDown = (e) => {
    e.preventDefault(); 
    
    // Calculate the bounding box so we can determine where the grab occurred
    const rect = containerRef.current.getBoundingClientRect();
    
    const grabOffset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    if (onDragStart) {
      onDragStart(e, grabOffset);
    }
  };

  if (!shape) return null;

  let minR = Infinity, maxR = -Infinity;
  let minC = Infinity, maxC = -Infinity;
  shape.blocks.forEach(b => {
    minR = Math.min(minR, b.r);
    maxR = Math.max(maxR, b.r);
    minC = Math.min(minC, b.c);
    maxC = Math.max(maxC, b.c);
  });
  
  const shapeWidth = (maxC - minC + 1) * (blockSize + 2); 
  const shapeHeight = (maxR - minR + 1) * (blockSize + 2);

  return (
    <div 
      className="shape-container pop-animation"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      style={{
        width: `${shapeWidth}px`,
        height: `${shapeHeight}px`,
      }}
    >
      {shape.blocks.map((b, idx) => (
        <div 
          key={idx}
          className={`shape-block ${shape.colorClass}`}
          style={{
            backgroundColor: shape.colorHex,
            top: `${b.r * (blockSize + 2)}px`,
            left: `${b.c * (blockSize + 2)}px`,
            width: `${blockSize}px`,
            height: `${blockSize}px`
          }}
        />
      ))}
    </div>
  );
};

export default Shape;
