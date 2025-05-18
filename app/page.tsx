"use client";

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Header } from '@/components/layout/header';
import { Flashcard } from '@/components/flashcard/flashcard';
import { FlashcardProgress } from '@/components/flashcard/flashcard-progress';
import { GamificationSidebar } from '@/components/flashcard/gamification-sidebar';
import { SettingsModal } from '@/components/settings/settings-modal';
import { StreakSaverModal } from '@/components/settings/streak-saver-modal';
import { ParticleBackground } from '@/components/ui/particle-background';
import { Confetti } from '@/components/ui/confetti';
import { 
  flashcards as mockFlashcards, 
  getFlashcardsByCategory,
  defaultUserStats
} from '@/lib/mockData';
import { 
  getCustomFlashcards, 
  saveCustomFlashcard,
  getFlashcardStats,
  saveFlashcardStat,
  getUserStats,
  saveUserStats,
  getAppSettings,
  saveAppSettings,
  getReviewQueue,
  saveReviewQueue
} from '@/lib/localStorage';
import { Flashcard as FlashcardType, UserStats, AppSettings } from '@/types';

export default function Home() {
  // State for flashcards
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [reviewQueue, setReviewQueue] = useState<string[]>([]);
  
  // State for user stats
  const [userStats, setUserStats] = useState<UserStats>(defaultUserStats);
  
  // State for app settings
  const [settings, setSettings] = useState<AppSettings>(getAppSettings());
  
  // State for UI
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [streakSaverModalOpen, setStreakSaverModalOpen] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [tempCardAnswer, setTempCardAnswer] = useState<'know' | 'dontKnow' | null>(null);
  
  // Initialize flashcards and user stats
  useEffect(() => {
    // Load custom flashcards
    const customCards = getCustomFlashcards();
    
    // Load user stats
    const savedUserStats = getUserStats();
    setUserStats(savedUserStats);
    
    // Load review queue
    const savedQueue = getReviewQueue();
    setReviewQueue(savedQueue);
    
    // Load settings
    const savedSettings = getAppSettings();
    setSettings(savedSettings);
    
    // Filter flashcards by category
    loadFlashcards(selectedCategory, [...mockFlashcards, ...customCards], savedQueue);
  }, []);
  
  // Update flashcards when category changes
  useEffect(() => {
    const customCards = getCustomFlashcards();
    loadFlashcards(selectedCategory, [...mockFlashcards, ...customCards], reviewQueue);
  }, [selectedCategory]);
  
  // Load flashcards based on category and review queue
  const loadFlashcards = (
    category: string, 
    allCards: FlashcardType[], 
    queue: string[]
  ) => {
    // Filter by category if not 'all'
    let filteredCards = category === 'all' 
      ? allCards 
      : allCards.filter(card => card.category === category);
      
    // Prioritize cards in review queue
    if (queue.length > 0) {
      // Get cards that are both in the queue and match the category filter
      const queuedCards = queue
        .map(id => allCards.find(card => card.id === id))
        .filter(card => card !== undefined && (category === 'all' || card.category === category)) as FlashcardType[];
        
      // Add other cards that match the category
      const otherCards = filteredCards.filter(card => !queue.includes(card.id));
      
      // Combine queued cards first, then other cards
      filteredCards = [...queuedCards, ...otherCards];
    }
    
    // Randomize order of non-queued cards
    const queuedIds = new Set(queue);
    const queuedCards = filteredCards.filter(card => queuedIds.has(card.id));
    const nonQueuedCards = filteredCards.filter(card => !queuedIds.has(card.id));
    
    // Shuffle non-queued cards
    for (let i = nonQueuedCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nonQueuedCards[i], nonQueuedCards[j]] = [nonQueuedCards[j], nonQueuedCards[i]];
    }
    
    // Set flashcards, queued first then shuffled non-queued
    setFlashcards([...queuedCards, ...nonQueuedCards]);
    
    // Reset card index
    setCurrentCardIndex(0);
  };
  
  // Handle "Know" button
  const handleKnow = () => {
    if (currentCardIndex >= flashcards.length) return;
    
    const currentCard = flashcards[currentCardIndex];
    const isReview = reviewQueue.includes(currentCard.id);
    
    // Record stat
    const stat = {
      id: uuidv4(),
      flashcardId: currentCard.id,
      isKnown: true,
      reviewDate: new Date().toISOString(),
      reviewTime: 20 - (settings.timerEnabled ? 20 : 0), // Assume max time if timer disabled
    };
    saveFlashcardStat(stat);
    
    // Update user stats
    const newStreak = userStats.streak + 1;
    const earnToken = newStreak % 5 === 0 && newStreak > 0;
    
    const updatedStats: UserStats = {
      ...userStats,
      points: userStats.points + 10, // 10 points for "Know"
      streak: newStreak,
      totalReviewed: userStats.totalReviewed + 1,
      knownCount: userStats.knownCount + 1,
      streakSaverTokens: earnToken ? userStats.streakSaverTokens + 1 : userStats.streakSaverTokens,
    };
    
    // Update today's history
    const today = new Date().toISOString().split('T')[0];
    const updatedHistory = [...userStats.reviewHistory];
    const todayIndex = updatedHistory.findIndex(item => item.date === today);
    
    if (todayIndex >= 0) {
      updatedHistory[todayIndex] = {
        ...updatedHistory[todayIndex],
        knownCount: updatedHistory[todayIndex].knownCount + 1,
      };
    }
    
    // Check badges
    const updatedBadges = [...updatedStats.badges];
    
    // 5 Cards Master badge
    if (newStreak >= 5 && !updatedBadges[0].isUnlocked) {
      updatedBadges[0].isUnlocked = true;
      setConfettiActive(true);
    }
    
    // Update review queue (remove card if it was in queue)
    let updatedQueue = [...reviewQueue];
    if (isReview) {
      updatedQueue = updatedQueue.filter(id => id !== currentCard.id);
      saveReviewQueue(updatedQueue);
      setReviewQueue(updatedQueue);
    }
    
    // Check for completion bonus
    if (currentCardIndex === flashcards.length - 1) {
      // Perfect Deck badge
      const allKnown = getFlashcardStats()
        .filter(stat => flashcards.some(card => card.id === stat.flashcardId))
        .every(stat => stat.isKnown);
      
      if (allKnown && !updatedBadges[1].isUnlocked) {
        updatedBadges[1].isUnlocked = true;
        setConfettiActive(true);
      }
      
      // Complete 3 decks badge
      const completedDecks = userStats.totalReviewed > 0 ? 1 : 0;
      if (completedDecks >= 3 && !updatedBadges[2].isUnlocked) {
        updatedBadges[2].isUnlocked = true;
        setConfettiActive(true);
      }
      
      // Completion bonus
      updatedStats.points += 50;
    }
    
    updatedStats.badges = updatedBadges;
    setUserStats(updatedStats);
    saveUserStats(updatedStats);
    
    // Move to next card
    goToNextCard();
  };
  
  // Handle "Don't Know" button
  const handleDontKnow = () => {
    // Check if we should use a streak saver
    if (userStats.streak >= 5 && userStats.streakSaverTokens > 0) {
      setTempCardAnswer('dontKnow');
      setStreakSaverModalOpen(true);
      return;
    }
    
    processDontKnow();
  };
  
  // Process "Don't Know" answer (after streak saver decision)
  const processDontKnow = () => {
    if (currentCardIndex >= flashcards.length) return;
    
    const currentCard = flashcards[currentCardIndex];
    
    // Record stat
    const stat = {
      id: uuidv4(),
      flashcardId: currentCard.id,
      isKnown: false,
      reviewDate: new Date().toISOString(),
      reviewTime: 20 - (settings.timerEnabled ? 20 : 0), // Assume max time if timer disabled
    };
    saveFlashcardStat(stat);
    
    // Update user stats
    const updatedStats: UserStats = {
      ...userStats,
      points: userStats.points + 5, // 5 points for "Don't Know"
      streak: 0, // Reset streak
      totalReviewed: userStats.totalReviewed + 1,
      notKnownCount: userStats.notKnownCount + 1,
    };
    
    // Update today's history
    const today = new Date().toISOString().split('T')[0];
    const updatedHistory = [...userStats.reviewHistory];
    const todayIndex = updatedHistory.findIndex(item => item.date === today);
    
    if (todayIndex >= 0) {
      updatedHistory[todayIndex] = {
        ...updatedHistory[todayIndex],
        notKnownCount: updatedHistory[todayIndex].notKnownCount + 1,
      };
    }
    
    updatedStats.reviewHistory = updatedHistory;
    setUserStats(updatedStats);
    saveUserStats(updatedStats);
    
    // Add to review queue
    if (!reviewQueue.includes(currentCard.id)) {
      const updatedQueue = [...reviewQueue, currentCard.id];
      saveReviewQueue(updatedQueue);
      setReviewQueue(updatedQueue);
    }
    
    // Move to next card
    goToNextCard();
  };
  
  // Use streak saver token
  const useStreakSaver = () => {
    if (userStats.streakSaverTokens <= 0) return;
    
    // Update user stats
    const updatedStats: UserStats = {
      ...userStats,
      streakSaverTokens: userStats.streakSaverTokens - 1,
    };
    setUserStats(updatedStats);
    saveUserStats(updatedStats);
    
    // Close modal
    setStreakSaverModalOpen(false);
    
    // Process as "Know" instead
    handleKnow();
  };
  
  // Cancel streak saver
  const cancelStreakSaver = () => {
    setStreakSaverModalOpen(false);
    
    // Process original answer
    if (tempCardAnswer === 'dontKnow') {
      processDontKnow();
    }
    
    setTempCardAnswer(null);
  };
  
  // Move to next card
  const goToNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // End of deck
      setConfettiActive(true);
      
      // Reload with any changes to the review queue
      const customCards = getCustomFlashcards();
      loadFlashcards(selectedCategory, [...mockFlashcards, ...customCards], reviewQueue);
    }
  };
  
  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  
  // Handle settings update
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveAppSettings(newSettings);
  };
  
  // Handle saving custom flashcard
  const handleSaveCustomCard = (card: FlashcardType) => {
    saveCustomFlashcard(card);
    
    // Reload flashcards to include the new card
    const customCards = getCustomFlashcards();
    loadFlashcards(selectedCategory, [...mockFlashcards, ...customCards], reviewQueue);
    
    // Close settings modal
    setSettingsModalOpen(false);
  };
  
  // Confetti callback
  const handleConfettiComplete = () => {
    setConfettiActive(false);
  };
  
  return (
    <main className="relative min-h-screen bg-[#161629] pt-20 pb-10 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-[#161629] to-[#2D2D44] opacity-50" />
      <ParticleBackground color={settings.accentColor} />
      
      {/* Header */}
      <Header
        onOpenSettings={() => setSettingsModalOpen(true)}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      {/* Main Content */}
      <div className="relative max-w-[1400px] mx-auto px-4">
        <div className="flex gap-10 items-start justify-between mt-10">
          {/* Left Side - Badges */}
          <GamificationSidebar
            userStats={userStats}
            onUseStreakSaver={() => setStreakSaverModalOpen(true)}
            accentColor={settings.accentColor}
            className="order-1 sticky top-24"
            showBadgesOnly={true}
          />
          
          {/* Center - Flashcard Area */}
          <div className="flex flex-col items-center space-y-6 flex-1 order-2">
            {flashcards.length > 0 ? (
              <>
                <Flashcard
                  card={flashcards[currentCardIndex]}
                  onKnow={handleKnow}
                  onDontKnow={handleDontKnow}
                  timerEnabled={settings.timerEnabled}
                  animationSpeed={settings.flipAnimationSpeed}
                  accentColor={settings.accentColor}
                />
                
                <FlashcardProgress
                  current={currentCardIndex + 1}
                  total={flashcards.length}
                  accentColor={settings.accentColor}
                />
              </>
            ) : (
              <div className="w-[700px] h-[500px] flex items-center justify-center bg-[#2D2D44] rounded-lg shadow-xl backdrop-blur-md">
                <p className="text-xl text-white">No flashcards available for this category.</p>
              </div>
            )}
          </div>
          
          {/* Right Side - Points */}
          <GamificationSidebar
            userStats={userStats}
            onUseStreakSaver={() => setStreakSaverModalOpen(true)}
            accentColor={settings.accentColor}
            className="order-3 sticky top-24"
            showPointsOnly={true}
          />
        </div>
      </div>
      
      {/* Modals */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onSaveCustomCard={handleSaveCustomCard}
        accentColor={settings.accentColor}
      />
      
      <StreakSaverModal
        isOpen={streakSaverModalOpen}
        onClose={() => setStreakSaverModalOpen(false)}
        onConfirm={useStreakSaver}
        onCancel={cancelStreakSaver}
        accentColor={settings.accentColor}
      />
      
      {/* Confetti */}
      <Confetti
        active={confettiActive}
        colors={[settings.accentColor, '#22C55E', '#F59E0B', '#ffffff']}
        onComplete={handleConfettiComplete}
      />
    </main>
  );
}