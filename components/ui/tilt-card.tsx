"use client";

import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  perspective?: number;
  transitionSpeed?: number;
  glareOpacity?: number;
  glareColor?: string;
  disabled?: boolean;
}

export function TiltCard({
  children,
  className,
  maxTilt = 5,
  scale = 1.02,
  perspective = 1000,
  transitionSpeed = 300,
  glareOpacity = 0.2,
  glareColor = "#ffffff",
  disabled = false,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card center
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation based on mouse position
    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;
    
    // Update transform
    setTransform(`
      perspective(${perspective}px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale3d(${scale}, ${scale}, ${scale})
    `);
    
    // Update glare position
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    });
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    setIsHovering(false);
    setTransform('');
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative overflow-hidden',
        'transition-transform duration-300 ease-out',
        isHovering ? '' : 'transition-all',
        className
      )}
      style={{
        transform: transform,
        transitionDuration: `${transitionSpeed}ms`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {isHovering && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, ${glareColor} 0%, rgba(255,255,255,0) 60%)`,
            opacity: glareOpacity,
            mixBlendMode: 'overlay',
          }}
        />
      )}
    </div>
  );
}