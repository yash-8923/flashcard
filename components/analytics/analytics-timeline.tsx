"use client";

import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface TimelineItem {
  date: string;
  knownCount: number;
  notKnownCount: number;
}

interface AnalyticsTimelineProps {
  reviewHistory: TimelineItem[];
  accentColor?: string;
}

export function AnalyticsTimeline({
  reviewHistory,
  accentColor = '#6F3CFA'
}: AnalyticsTimelineProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const handleItemHover = (index: number) => {
    setActiveIndex(index);
  };
  
  const handleItemLeave = () => {
    setActiveIndex(null);
  };
  
  const maxCount = Math.max(
    ...reviewHistory.map(item => item.knownCount + item.notKnownCount),
    1
  );
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        {reviewHistory.map((item, index) => {
          const total = item.knownCount + item.notKnownCount;
          const percentage = maxCount > 0 ? (total / maxCount) * 100 : 0;
          const isActive = activeIndex === index;
          const isEmpty = total === 0;
          
          return (
            <div
              key={item.date}
              className="flex flex-col items-center"
              onMouseEnter={() => handleItemHover(index)}
              onMouseLeave={handleItemLeave}
            >
              <div 
                className={cn(
                  "h-[100px] flex items-end justify-center gap-1",
                  "transition-all duration-300 ease-out"
                )}
              >
                {/* Known (Correct) Bar */}
                <div
                  className="w-[12px] rounded-t-md transition-all duration-300"
                  style={{
                    height: `${(item.knownCount / maxCount) * 100}%`,
                    backgroundColor: isEmpty ? '#4B5563' : '#22C55E',
                    opacity: isActive ? 1 : 0.7,
                  }}
                />
                
                {/* Not Known (Incorrect) Bar */}
                <div
                  className="w-[12px] rounded-t-md transition-all duration-300"
                  style={{
                    height: `${(item.notKnownCount / maxCount) * 100}%`,
                    backgroundColor: isEmpty ? '#4B5563' : '#EF4444',
                    opacity: isActive ? 1 : 0.7,
                  }}
                />
                
                {/* Dot */}
                <div 
                  className={cn(
                    "absolute -bottom-3 transform",
                    "w-3 h-3 rounded-full transition-all duration-300",
                    isEmpty ? "bg-gray-500" : ""
                  )}
                  style={{
                    backgroundColor: isEmpty ? '#4B5563' : accentColor,
                    transform: `scale(${isActive ? 1.5 : 1})`,
                  }}
                />
              </div>
              
              <span className="text-xs text-muted-foreground mt-4">
                {format(parseISO(item.date), 'MMM d')}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Fixed height container for tooltip */}
      <div className="h-[100px] relative">
        {/* Tooltip */}
        {activeIndex !== null && (
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0">
            <div className="bg-[#161629] p-3 rounded-md border border-muted/20 shadow-lg">
              <h4 className="text-sm font-medium text-white mb-1">
                {format(parseISO(reviewHistory[activeIndex].date), 'MMMM d, yyyy')}
              </h4>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
                  <span className="text-muted-foreground">Correct:</span>
                  <span className="font-medium text-white">{reviewHistory[activeIndex].knownCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#EF4444]" />
                  <span className="text-muted-foreground">Incorrect:</span>
                  <span className="font-medium text-white">{reviewHistory[activeIndex].notKnownCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accentColor }} />
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-medium text-white">
                    {reviewHistory[activeIndex].knownCount + reviewHistory[activeIndex].notKnownCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#22C55E]"></div>
          <span className="text-xs text-muted-foreground">Correct</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#EF4444]"></div>
          <span className="text-xs text-muted-foreground">Incorrect</span>
        </div>
      </div>
    </div>
  );
}