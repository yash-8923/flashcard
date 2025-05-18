"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ProgressRing } from '@/components/ui/progress-ring';
import { TiltCard } from '@/components/ui/tilt-card';
import { Flashcard as FlashcardType } from '@/types';

interface FlashcardProps {
  card: FlashcardType;
  onKnow: () => void;
  onDontKnow: () => void;
  timerEnabled?: boolean;
  timerDuration?: number;
  animationSpeed?: 'fast' | 'medium' | 'slow';
  accentColor?: string;
}

export function Flashcard({
  card,
  onKnow,
  onDontKnow,
  timerEnabled = true,
  timerDuration = 20,
  animationSpeed = 'medium',
  accentColor = '#6F3CFA',
}: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [isTimeWarning, setIsTimeWarning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Animation speed map
  const speedMap = {
    fast: 300,
    medium: 500,
    slow: 800,
  };
  
  const animationDuration = speedMap[animationSpeed];
  
  // Start timer
  useEffect(() => {
    if (!timerEnabled) return;
    
    // Reset timer when card changes
    setTimeLeft(timerDuration);
    setIsTimeWarning(false);
    
    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Start new timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        // Set warning when less than 5 seconds remain
        if (prev <= 6 && prev > 5) {
          setIsTimeWarning(true);
        }
        
        // Time's up
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          onDontKnow();
          return 0;
        }
        
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [card.id, timerEnabled, timerDuration, onDontKnow]);
  
  // Handle flip
  const handleFlip = () => {
    setFlipped(!flipped);
  };
  
  // Handle know/don't know
  const handleKnow = (e: React.MouseEvent) => {
    e.stopPropagation();
    onKnow();
    setFlipped(false);
  };
  
  const handleDontKnow = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDontKnow();
    setFlipped(false);
  };
  
  return (
    <TiltCard 
      className={cn(
        "relative flex flex-col items-center justify-center p-8 rounded-lg",
        "w-[700px] h-[500px] bg-[#2D2D44] shadow-xl backdrop-blur-md",
        "perspective-1000 transform transition"
      )}
      maxTilt={3}
      glareOpacity={0.1}
    >
      <div 
        className={cn(
          "relative w-full h-full flex flex-col items-center justify-center",
          "transform-style-preserve-3d transition-transform",
          flipped ? "rotate-y-180" : ""
        )}
        style={{ 
          transformStyle: 'preserve-3d',
          transition: `transform ${animationDuration}ms ease-in-out`,
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
        onClick={handleFlip}
      >
        {/* Front */}
        <div 
          className={cn(
            "absolute inset-0 backface-hidden",
            "flex flex-col items-center justify-center p-8",
            "cursor-pointer"
          )}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <h3 className="text-3xl font-bold text-white mb-8">Question</h3>
          <p className="text-2xl text-white text-center">{card.question}</p>
        </div>
        
        {/* Back */}
        <div 
          className={cn(
            "absolute inset-0 backface-hidden rotate-y-180",
            "flex flex-col items-center justify-center p-8",
            "cursor-pointer"
          )}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <h3 className="text-3xl font-bold text-white mb-8">Answer</h3>
          <p className="text-2xl text-white text-center">{card.answer}</p>
        </div>
      </div>
      
      {/* Controls - moved to corners */}
      <div className="absolute bottom-6 w-full px-6 flex justify-between items-center">
        <Button
          variant="destructive"
          className="w-[120px] h-[40px] flex items-center gap-2"
          onClick={handleDontKnow}
        >
          <X className="h-4 w-4" />
          Don't Know
        </Button>
        
        <Button
          variant="outline"
          className="w-[120px] h-[40px] bg-[#6F3CFA] text-white border-none hover:bg-[#8355FB]"
          style={{ backgroundColor: accentColor }}
          onClick={handleFlip}
        >
          Flip
        </Button>
        
        <Button
          variant="default"
          className="w-[120px] h-[40px] flex items-center gap-2 bg-[#22C55E] hover:bg-[#16A34A]"
          onClick={handleKnow}
        >
          <Check className="h-4 w-4" />
          Know
        </Button>
      </div>
      
      {/* Timer - moved to top-right corner */}
      {timerEnabled && (
        <div 
          className={cn(
            "absolute top-6 right-6",
            isTimeWarning && "animate-pulse"
          )}
          style={{
            animation: isTimeWarning ? 'pulse 1s infinite' : 'none',
          }}
        >
          <ProgressRing
            progress={(timeLeft / timerDuration) * 100}
            size={50}
            strokeWidth={5}
            color={isTimeWarning ? "#F59E0B" : "#6F3CFA"}
            backgroundColor="#4B5563"
            showText
          />
        </div>
      )}
    </TiltCard>
  );
}