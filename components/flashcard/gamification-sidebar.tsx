"use client";

import React, { useState, useEffect } from 'react';
import { Award, Star, Trophy, Zap, Brain, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserStats, Badge as BadgeType } from '@/types';
import { Button } from '@/components/ui/button';
import { TiltCard } from '@/components/ui/tilt-card';

interface GamificationSidebarProps {
  userStats: UserStats;
  onUseStreakSaver?: () => void;
  accentColor?: string;
  className?: string;
  showBadgesOnly?: boolean;
  showPointsOnly?: boolean;
}

export function GamificationSidebar({
  userStats,
  onUseStreakSaver,
  className,
  showBadgesOnly = false,
  showPointsOnly = false,
}: GamificationSidebarProps) {
  const [animatePoints, setAnimatePoints] = useState(false);
  const [previousPoints, setPreviousPoints] = useState(userStats.points);
  
  useEffect(() => {
    if (userStats.points !== previousPoints) {
      setAnimatePoints(true);
      const timeout = setTimeout(() => {
        setAnimatePoints(false);
        setPreviousPoints(userStats.points);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [userStats.points, previousPoints]);
  
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'award': return <Award className="h-6 w-6" />;
      case 'star': return <Star className="h-6 w-6" />;
      case 'trophy': return <Trophy className="h-6 w-6" />;
      case 'zap': return <Zap className="h-6 w-6" />;
      case 'brain': return <Brain className="h-6 w-6" />;
      default: return <Award className="h-6 w-6" />;
    }
  };
  
  const renderPointsSection = () => (
    <>
      {/* Stats Card */}
      <div className="glass-card rounded-xl p-8 space-y-8">
        {/* Points */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium">Points</h3>
          <span 
            className={cn(
              "text-3xl font-bold text-primary",
              animatePoints && "animate-count-up"
            )}
          >
            {userStats.points}
          </span>
        </div>
        
        {/* Streak */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-medium">Streak</h3>
            <Flame className={cn(
              "h-6 w-6 text-orange-400",
              userStats.streak > 0 && "animate-pulse"
            )} />
          </div>
          <span className="text-2xl font-bold">{userStats.streak} cards</span>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card rounded-lg p-4">
            <h4 className="text-base text-muted-foreground mb-2">Known</h4>
            <p className="text-2xl font-medium">{userStats.knownCount}</p>
          </div>
          <div className="glass-card rounded-lg p-4">
            <h4 className="text-base text-muted-foreground mb-2">Don't Know</h4>
            <p className="text-2xl font-medium">{userStats.notKnownCount}</p>
          </div>
          <div className="glass-card rounded-lg p-4">
            <h4 className="text-base text-muted-foreground mb-2">Success</h4>
            <p className="text-2xl font-medium">
              {userStats.totalReviewed > 0 
                ? `${Math.round((userStats.knownCount / userStats.totalReviewed) * 100)}%` 
                : '0%'}
            </p>
          </div>
          <div className="glass-card rounded-lg p-4">
            <h4 className="text-base text-muted-foreground mb-2">Total</h4>
            <p className="text-2xl font-medium">{userStats.totalReviewed}</p>
          </div>
        </div>
      </div>
      
      {/* Streak Saver */}
      {userStats.streakSaverTokens > 0 && (
        <div className="glass-card rounded-xl p-6 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-medium">Streak Saver Tokens</h3>
            <span className="text-xl font-bold text-primary">
              {userStats.streakSaverTokens}
            </span>
          </div>
          <Button 
            variant="outline"
            className="w-full glass-button text-lg py-6"
            onClick={onUseStreakSaver}
            disabled={!onUseStreakSaver}
          >
            Use Token
          </Button>
        </div>
      )}
    </>
  );

  const renderBadgesSection = () => (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-xl font-medium mb-4">Badges</h3>
      <div className="grid grid-cols-1 gap-4">
        {userStats.badges.map((badge) => (
          <TiltCard 
            key={badge.id}
            className={cn(
              "badge p-4",
              !badge.isUnlocked && "badge-locked"
            )}
            maxTilt={2}
            disabled={!badge.isUnlocked}
          >
            <div className="badge-icon">
              {getBadgeIcon(badge.icon)}
            </div>
            <div>
              <h4 className="text-base font-medium">{badge.name}</h4>
              <p className="text-sm text-muted-foreground">{badge.description}</p>
            </div>
          </TiltCard>
        ))}
      </div>
    </div>
  );
  
  return (
    <aside className={cn(
      "w-[350px] flex flex-col gap-6",
      className
    )}>
      {showBadgesOnly && renderBadgesSection()}
      {showPointsOnly && renderPointsSection()}
      {!showBadgesOnly && !showPointsOnly && (
        <>
          {renderPointsSection()}
          {renderBadgesSection()}
        </>
      )}
    </aside>
  );
}