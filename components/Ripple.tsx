'use client';

import React, { useState, useLayoutEffect } from 'react';

interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
}

export function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useLayoutEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prevRipples) => prevRipples.slice(1));
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  const addRipple = (event: React.MouseEvent<HTMLElement>) => {
    const container = event.currentTarget.getBoundingClientRect();
    const size = Math.max(container.width, container.height);
    const x = event.clientX - container.left - size / 2;
    const y = event.clientY - container.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples((prevRipples) => [...prevRipples, newRipple]);
  };

  return { ripples, addRipple };
}

export function RippleContainer({ ripples, color = 'rgba(255, 255, 255, 0.3)' }: { ripples: Ripple[], color?: string }) {
  return (
    <span className="absolute inset-0 overflow-hidden pointer-events-none rounded-[inherit]">
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full animate-ripple"
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: color,
          }}
        />
      ))}
    </span>
  );
}
