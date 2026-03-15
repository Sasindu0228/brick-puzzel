import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

const ParticleSystem = forwardRef((props, ref) => {
  const [particles, setParticles] = useState([]);

  useImperativeHandle(ref, () => ({
    createExplosion(x, y, color) {
      const newParticles = [];
      const numParticles = 8;
      
      for (let i = 0; i < numParticles; i++) {
        const angle = (Math.PI * 2 * i) / numParticles;
        const velocity = 30 + Math.random() * 20;
        newParticles.push({
          id: Date.now() + '-' + i + '-' + Math.random(),
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          color,
          life: 1.0
        });
      }
      
      setParticles(prev => [...prev, ...newParticles]);
    }
  }));

  useEffect(() => {
    if (particles.length === 0) return;

    let lastTime = performance.now();
    let frameId;

    const animate = (time) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      setParticles(prev => {
        const updated = prev.map(p => ({
          ...p,
          x: p.x + p.vx * dt,
          y: p.y + p.vy * dt,
          life: p.life - dt * 2 // Particles live for ~0.5s
        })).filter(p => p.life > 0);
        return updated;
      });

      if (particles.length > 0) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [particles]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: p.color,
            opacity: p.life,
            transform: `translate(-50%, -50%) scale(${p.life})`,
          }}
        />
      ))}
    </div>
  );
});

export default ParticleSystem;
