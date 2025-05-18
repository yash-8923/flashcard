"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard';
import { ParticleBackground } from '@/components/ui/particle-background';
import { getUserStats, getAppSettings } from '@/lib/localStorage';
import { UserStats, AppSettings } from '@/types';
import { defaultUserStats } from '@/lib/mockData';

export default function AnalyticsPage() {
  const [userStats, setUserStats] = useState<UserStats>(defaultUserStats);
  const [settings, setSettings] = useState<AppSettings>({
    soundEffects: true,
    timerEnabled: true,
    flipAnimationSpeed: 'medium',
    accentColor: '#6F3CFA'
  });
  
  // Load user stats and settings
  useEffect(() => {
    const savedUserStats = getUserStats();
    setUserStats(savedUserStats);
    
    const savedSettings = getAppSettings();
    setSettings(savedSettings);
  }, []);
  
  return (
    <main className="relative min-h-screen bg-[#161629] pt-20 pb-10 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-[#161629] to-[#2D2D44] opacity-50" />
      <ParticleBackground color={settings.accentColor} />
      
      {/* Header */}
      <Header showBackButton />
      
      {/* Main Content */}
      <div className="relative max-w-[1200px] mx-auto px-4 flex flex-col items-center mt-10">
        <h1 className="text-3xl font-bold text-white mb-8">Analytics Dashboard</h1>
        
        <AnalyticsDashboard 
          userStats={userStats}
          accentColor={settings.accentColor}
        />
      </div>
    </main>
  );
}