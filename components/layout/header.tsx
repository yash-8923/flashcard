"use client";

import React from 'react';
import Link from 'next/link';
import { Settings, ChevronLeft, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { categories } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HeaderProps {
  onOpenSettings?: () => void;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  showBackButton?: boolean;
  className?: string;
}

export function Header({
  onOpenSettings,
  selectedCategory,
  onCategoryChange,
  showBackButton = false,
  className,
}: HeaderProps) {
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-20",
        "bg-background/95 backdrop-blur-md border-b border-border",
        className
      )}
    >
      <div className="flex items-center justify-between h-full max-w-[1200px] mx-auto px-8">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Link href="/">
              <Button
                variant="outline"
                size="icon"
                className="glass-button"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <Link href="/" className="group">
            <h1 className="text-2xl font-bold tracking-tight text-shadow">
              Flashcard Frenzy
              <span className="block h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-300" />
            </h1>
          </Link>
        </div>

        <div className="flex-1 flex justify-center max-w-[300px] mx-auto">
          {onCategoryChange && (
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-full glass-card border-primary/20 text-foreground">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="glass-card border-primary/20">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/analytics" 
            className="nav-link flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <BarChart2 className="h-5 w-5" />
            <span className="font-medium">Analytics</span>
          </Link>
          
          {onOpenSettings && (
            <Button
              variant="outline"
              size="icon"
              onClick={onOpenSettings}
              className="glass-button"
            >
              <Settings className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}