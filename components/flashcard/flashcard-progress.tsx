"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface FlashcardProgressProps {
  current: number;
  total: number;
  accentColor?: string;
  className?: string;
}

export function FlashcardProgress({
  current,
  total,
  accentColor = '#6F3CFA',
  className,
}: FlashcardProgressProps) {
  const progress = (current / total) * 100;
  
  return (
    <div className={cn("w-full max-w-[400px] flex flex-col gap-2", className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Progress</span>
        <span className="text-sm font-medium text-white">{current}/{total}</span>
      </div>
      
      <div className="h-2 w-full bg-[#4B5563] rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${progress}%`,
            backgroundColor: accentColor
          }}
        />
      </div>
    </div>
  );
}