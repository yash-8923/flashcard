"use client";

import React from 'react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { UserStats } from '@/types';
import { categories } from '@/lib/mockData';
import { getFlashcardStats } from '@/lib/localStorage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsTimeline } from './analytics-timeline';

interface AnalyticsDashboardProps {
  userStats: UserStats;
  accentColor?: string;
}

const categoryIdToPrefix: { [key: string]: string } = {
  "1": "m", // Math
  "2": "s", // Science
  "3": "h", // History
  "4": "g", // Geography
  "5": "l", // Languages
};

export function AnalyticsDashboard({ 
  userStats,
  accentColor = '#6F3CFA'
}: AnalyticsDashboardProps) {
  // Get all flashcard stats
  const flashcardStats = getFlashcardStats();
  
  // Prepare category data for chart
  const categoryData = categories.map(category => {
    const prefix = categoryIdToPrefix[category.id];
    const categoryStats = flashcardStats.filter(stat => 
      prefix ? stat.flashcardId.startsWith(prefix) : false
    );
    
    const known = categoryStats.filter(stat => stat.isKnown).length;
    const notKnown = categoryStats.filter(stat => !stat.isKnown).length;
    
    return {
      name: category.name,
      Correct: known || 0,
      Incorrect: notKnown || 0
    };
  });
  
  // Calculate statistics
  const knownRate = userStats.totalReviewed > 0 
    ? Math.round((userStats.knownCount / userStats.totalReviewed) * 100) 
    : 0;
    
  const averageReviewTime = flashcardStats.length > 0
    ? Math.round(flashcardStats.reduce((sum, stat) => sum + stat.reviewTime, 0) / flashcardStats.length)
    : 0;
  
  return (
    <div className="w-full space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#2D2D44] border-muted/20">
          <CardHeader className="pb-2">
            <CardDescription>Success Rate</CardDescription>
            <CardTitle className="text-4xl font-bold">{knownRate}%</CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="bg-[#2D2D44] border-muted/20">
          <CardHeader className="pb-2">
            <CardDescription>Total Cards</CardDescription>
            <CardTitle className="text-4xl font-bold">{userStats.totalReviewed}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="bg-[#2D2D44] border-muted/20">
          <CardHeader className="pb-2">
            <CardDescription>Average Time</CardDescription>
            <CardTitle className="text-4xl font-bold">{averageReviewTime}s</CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="bg-[#2D2D44] border-muted/20">
          <CardHeader className="pb-2">
            <CardDescription>Best Streak</CardDescription>
            <CardTitle className="text-4xl font-bold">{userStats.streak}</CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      {/* Bar Chart */}
      <Card className="bg-[#2D2D44] border-muted/20">
        <CardHeader>
          <CardTitle>Performance by Category</CardTitle>
          <CardDescription>Correct vs. incorrect responses by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                barGap={0}
                barCategoryGap={30}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'white' }}
                  axisLine={{ stroke: '#4B5563' }}
                />
                <YAxis 
                  tick={{ fill: 'white' }}
                  axisLine={{ stroke: '#4B5563' }}
                  allowDecimals={false}
                  domain={[0, 'auto']}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F1F33', 
                    borderColor: '#6F3CFA',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                />
                <Legend 
                  wrapperStyle={{ color: 'white' }}
                  iconType="circle"
                />
                <Bar 
                  name="Correct Answers"
                  dataKey="Correct" 
                  fill="#22C55E" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Bar 
                  name="Incorrect Answers"
                  dataKey="Incorrect" 
                  fill="#EF4444" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Timeline */}
      <Card className="bg-[#2D2D44] border-muted/20">
        <CardHeader>
          <CardTitle>Study Timeline</CardTitle>
          <CardDescription>Your flashcard activity over the past 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <AnalyticsTimeline 
            reviewHistory={userStats.reviewHistory}
            accentColor={accentColor}
          />
        </CardContent>
      </Card>
    </div>
  );
}