"use client";

import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface ParticleBackgroundProps {
  color?: string;
  particleCount?: number;
  particleSize?: number;
  speed?: number;
  interactive?: boolean;
  className?: string;
}

export function ParticleBackground({
  color = "#6F3CFA",
  particleCount = 20,
  particleSize = 3,
  speed = 0.5,
  interactive = true,
  className,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize particles
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(createParticle(dimensions.width, dimensions.height));
    }

    // Mouse event listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;

      // Create particles on mouse move if interactive
      if (interactive) {
        for (let i = 0; i < 2; i++) {
          const particle = createParticle(dimensions.width, dimensions.height, true);
          particle.x = mouseRef.current.x;
          particle.y = mouseRef.current.y;
          particlesRef.current.push(particle);
        }
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    // Animation
    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        // Update particle position
        particle.x += particle.speedX * speed;
        particle.y += particle.speedY * speed;
        
        // Update life
        particle.life -= 1;
        particle.opacity = particle.life / particle.maxLife;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
        
        // Boundary check or death
        return (
          particle.life > 0 &&
          particle.x > -particle.size &&
          particle.x < canvas.width + particle.size &&
          particle.y > -particle.size &&
          particle.y < canvas.height + particle.size
        );
      });
      
      // Add new particles to maintain count
      while (particlesRef.current.length < particleCount) {
        particlesRef.current.push(createParticle(dimensions.width, dimensions.height));
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [dimensions, color, particleCount, particleSize, speed, interactive]);

  // Helper to create a new particle
  const createParticle = (width: number, height: number, fromMouse = false): Particle => {
    const size = Math.random() * particleSize + 1;
    const maxLife = fromMouse ? 20 + Math.random() * 30 : 100 + Math.random() * 100;

    return {
      x: fromMouse ? mouseRef.current.x : Math.random() * width,
      y: fromMouse ? mouseRef.current.y : Math.random() * height,
      size,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      opacity: 1,
      life: maxLife,
      maxLife
    };
  };

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className || ''}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
}