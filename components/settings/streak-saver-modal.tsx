"use client";

import React, { useState, useEffect } from 'react';
import { Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StreakSaverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  accentColor?: string;
}

export function StreakSaverModal({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  accentColor = '#6F3CFA',
}: StreakSaverModalProps) {
  const [animationActive, setAnimationActive] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      // Start animation when modal opens
      setAnimationActive(true);
      
      // Stop animation after 1.5s
      const timeout = setTimeout(() => {
        setAnimationActive(false);
      }, 1500);
      
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div 
        className="relative w-[400px] rounded-lg bg-[#2D2D44] border border-[#6F3CFA]/40 shadow-xl"
        style={{ 
          borderColor: `${accentColor}40`,
          animation: 'scaleIn 0.3s ease-out'
        }}
      >
        <div className="p-6 flex flex-col items-center">
          <div 
            className={`w-20 h-20 flex items-center justify-center mb-4 ${animationActive ? 'animate-flip' : ''}`}
            style={{ animation: animationActive ? 'flip 1.5s ease-out' : 'none' }}
          >
            <Coins className="h-16 w-16" style={{ color: accentColor }} />
          </div>
          
          <h2 className="text-xl font-bold text-white mb-2">Use Streak Saver?</h2>
          
          <p className="text-sm text-muted-foreground text-center mb-6">
            Use a streak saver token to preserve your current streak?
            This will count your answer as correct and maintain your streak.
          </p>
          
          <div className="flex gap-4 w-full">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 bg-transparent border-muted text-white hover:bg-muted/20"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1"
              style={{ backgroundColor: accentColor }}
            >
              Use Token
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}