"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categories } from '@/lib/mockData';
import { AppSettings, Flashcard } from '@/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onSaveCustomCard: (card: Flashcard) => void;
  accentColor?: string;
}

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onSaveCustomCard,
  accentColor = '#6F3CFA',
}: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [customCard, setCustomCard] = useState<{
    question: string;
    answer: string;
    category: string;
  }>({
    question: '',
    answer: '',
    category: '1',
  });
  
  if (!isOpen) return null;
  
  const handleSettingsChange = (field: keyof AppSettings, value: any) => {
    const newSettings = { ...localSettings, [field]: value };
    setLocalSettings(newSettings);
    onUpdateSettings(newSettings);
  };
  
  const handleCustomCardChange = (field: string, value: string) => {
    setCustomCard({ ...customCard, [field]: value });
  };
  
  const handleSaveCustomCard = () => {
    if (!customCard.question || !customCard.answer) return;
    
    onSaveCustomCard({
      id: `custom-${Date.now()}`,
      ...customCard,
    });
    
    // Reset form
    setCustomCard({
      question: '',
      answer: '',
      category: '1',
    });
  };
  
  const getAnimationSpeedValue = (speed: string): number => {
    switch (speed) {
      case 'fast': return 0;
      case 'medium': return 50;
      case 'slow': return 100;
      default: return 50;
    }
  };
  
  const getAnimationSpeedLabel = (value: number): 'fast' | 'medium' | 'slow' => {
    if (value < 25) return 'fast';
    if (value < 75) return 'medium';
    return 'slow';
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div 
        className="relative w-[600px] max-h-[80vh] overflow-y-auto rounded-lg bg-[#2D2D44] border border-[#6F3CFA]/40 shadow-xl"
        style={{ 
          borderColor: `${accentColor}40`,
          animation: 'scaleIn 0.3s ease-out'
        }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Settings</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="space-y-6">
            {/* Sound & Timer Settings */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-white">General Settings</h3>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-effects" className="text-sm text-muted-foreground">
                  Sound Effects
                </Label>
                <Switch
                  id="sound-effects"
                  checked={localSettings.soundEffects}
                  onCheckedChange={(checked) => handleSettingsChange('soundEffects', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="timer" className="text-sm text-muted-foreground">
                  Timer
                </Label>
                <Switch
                  id="timer"
                  checked={localSettings.timerEnabled}
                  onCheckedChange={(checked) => handleSettingsChange('timerEnabled', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="animation-speed" className="text-sm text-muted-foreground">
                    Flip Animation Speed
                  </Label>
                  <span className="text-sm text-white capitalize">
                    {localSettings.flipAnimationSpeed}
                  </span>
                </div>
                <Slider
                  id="animation-speed"
                  min={0}
                  max={100}
                  step={1}
                  value={[getAnimationSpeedValue(localSettings.flipAnimationSpeed)]}
                  onValueChange={(value) => handleSettingsChange('flipAnimationSpeed', getAnimationSpeedLabel(value[0]))}
                  className="[&>[data-orientation=horizontal]]:h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Fast</span>
                  <span>Medium</span>
                  <span>Slow</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accent-color" className="text-sm text-muted-foreground">
                  Accent Color
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="accent-color"
                    type="color"
                    value={localSettings.accentColor}
                    onChange={(e) => handleSettingsChange('accentColor', e.target.value)}
                    className="w-12 h-8 p-1 bg-transparent border border-muted cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={localSettings.accentColor}
                    onChange={(e) => handleSettingsChange('accentColor', e.target.value)}
                    className="w-32 h-8 bg-[#161629] border-muted"
                  />
                </div>
              </div>
            </div>
            
            {/* Custom Card */}
            <div className="pt-4 border-t border-muted/20">
              <h3 className="text-md font-medium text-white mb-4">Add Custom Flashcard</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="question" className="text-sm text-muted-foreground">
                    Question
                  </Label>
                  <Input
                    id="question"
                    value={customCard.question}
                    onChange={(e) => handleCustomCardChange('question', e.target.value)}
                    className="bg-[#161629] border-muted"
                    placeholder="Enter your question"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="answer" className="text-sm text-muted-foreground">
                    Answer
                  </Label>
                  <Input
                    id="answer"
                    value={customCard.answer}
                    onChange={(e) => handleCustomCardChange('answer', e.target.value)}
                    className="bg-[#161629] border-muted"
                    placeholder="Enter your answer"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm text-muted-foreground">
                    Category
                  </Label>
                  <Select
                    value={customCard.category}
                    onValueChange={(value) => handleCustomCardChange('category', value)}
                  >
                    <SelectTrigger className="bg-[#161629] border-muted">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2D2D44] border-muted">
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  onClick={handleSaveCustomCard}
                  disabled={!customCard.question || !customCard.answer}
                  className="w-full"
                  style={{ backgroundColor: accentColor }}
                >
                  Add Custom Card
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}