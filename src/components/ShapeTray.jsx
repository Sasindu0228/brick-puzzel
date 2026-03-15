import React, { useState, useEffect } from 'react';
import Shape from './Shape';

const ShapeTray = ({ availableShapes, onDragStart }) => {
  const [trayBlockSize, setTrayBlockSize] = useState(window.innerWidth < 480 ? 20 : 26);

  useEffect(() => {
    const updateSize = () => {
      setTrayBlockSize(window.innerWidth < 480 ? 20 : 26);
    };
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div className="shape-tray">
      {availableShapes.map((shape, index) => (
        <div key={shape ? shape.instanceId : `empty-${index}`} className="shape-slot">
          {shape && (
            <Shape 
              shape={shape} 
              onDragStart={(e, offset) => onDragStart(e, shape, index, offset)}
              blockSize={trayBlockSize}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ShapeTray;
