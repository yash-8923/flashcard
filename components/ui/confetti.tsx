"use client";

import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
  active: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  onComplete?: () => void;
}

export function Confetti({
  active,
  duration = 3000,
  particleCount = 100,
  colors = ['#6F3CFA', '#22C55E', '#F59E0B', '#ffffff'],
  onComplete
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to match window
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    // Create particles
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocity: {
          x: (Math.random() - 0.5) * 15,
          y: (Math.random() - 0.5) * 15 - 3 // Mostly upward
        },
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 5,
        gravity: 0.1 + Math.random() * 0.1,
        opacity: 1
      });
    }
    
    // Animation
    startTimeRef.current = Date.now();
    
    const animate = () => {
      if (!ctx || !canvas || !startTimeRef.current) return;
      
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(1, elapsed / duration);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (const particle of particlesRef.current) {
        // Apply gravity
        particle.velocity.y += particle.gravity;
        
        // Update position
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
        
        // Update rotation
        particle.rotation += particle.rotationSpeed;
        
        // Update opacity based on progress
        particle.opacity = 1 - progress;
        
        // Draw particle
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        ctx.restore();
      }
      
      // Continue animation or complete
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        if (onComplete) onComplete();
      }
    };
    
    rafRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [active, colors, duration, particleCount, onComplete]);
  
  if (!active) return null;
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}