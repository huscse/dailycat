import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, Share2, Sparkles } from 'lucide-react';

interface CatData {
  id: string;
  url: string;
  fact: string;
  name: string;
  isPersonal?: boolean;
}

interface AppState {
  currentCat: CatData | null;
  streak: number;
  lastVisit: string;
  totalVisits: number;
  favorites: string[];
  dailyCatDate: string;
  lastSessionId: string; // Track unique sessions
}

// Use a more persistent approach by creating a deterministic cat based on the date
// This ensures the same cat appears for the entire day regardless of refreshes

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentCat: null,
    streak: 0,
    lastVisit: '',
    totalVisits: 0,
    favorites: [],
    dailyCatDate: '',
    lastSessionId: '',
  });
  const [loading, setLoading] = useState(true);
  const [showHeart, setShowHeart] = useState(false);
  const hasInitialized = useRef(false);

  const catFacts = [
    "Black cats are considered lucky in many cultures! In Japan, they're believed to bring good fortune and ward off evil spirits.",
    "Cats have a special scent organ called the Jacobson's organ that helps them 'taste' smells. That's why they sometimes open their mouths when sniffing!",
    "A cat's purr vibrates at frequencies between 20-50 Hz, which can actually help heal bones and reduce pain. They're natural healers!",
    'Cats have 32 muscles controlling their outer ears, allowing them to rotate their ears 180 degrees to pinpoint sounds perfectly.',
    'Cats can rotate their ears 180 degrees and have better hearing than dogs. They can hear sounds up to 64,000 Hz!',
    "A group of cats is called a 'clowder' and a group of kittens is called a 'kindle'. How adorable is that?",
    "Cats have a third eyelid called a 'nictitating membrane' that helps protect their eyes while hunting.",
    'Indoor cats live on average 13-17 years, while outdoor cats typically live 2-5 years due to various dangers.',
  ];

  const catNames = [
    'Whiskers',
    'Fluffy',
    'Mittens',
    'Shadow',
    'Luna',
    'Simba',
    'Oliver',
    'Bella',
    'Max',
    'Charlie',
    'Milo',
    'Tiger',
    'Smokey',
  ];

  const personalCats: CatData[] = [
    {
      id: 'personal-1',
      url: '/1000195036.jpg',
      fact: "This gorgeous tabby has the most mesmerizing eyes! Did you know that cats' eyes can see in light levels six times lower than what humans need?",
      name: 'Gidget',
      isPersonal: true,
    },
    {
      id: 'personal-2',
      url: '/1000195037.jpg',
      fact: "Look at this cozy little angel all curled up! Cats sleep 12-16 hours a day to conserve energy for hunting, even though house cats don't need to hunt.",
      name: 'Gidget',
      isPersonal: true,
    },
  ];

  // Generate a unique session ID for each app load
  const generateSessionId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Create a simple hash function for date-based seeding
  const hashCode = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  // Create a more persistent storage solution using multiple approaches
  const STORAGE_KEY = 'dailyCatState';

  const saveState = (state: AppState) => {
    try {
      const stateString = JSON.stringify(state);
      // Try multiple storage approaches
      (window as any).dailyCatState = stateString;

      // Also try to use sessionStorage as backup (may work in some environments)
      try {
        sessionStorage.setItem(STORAGE_KEY, stateString);
      } catch (e) {
        // Silent fail if sessionStorage not available
      }

      // Store in a global variable as additional backup
      (globalThis as any).dailyCatPersistentState = stateString;
    } catch (error) {
      console.error('Error saving state:', error);
    }
  };

  // Load state from multiple sources
  const loadState = (): AppState | null => {
    try {
      let saved = null;

      // Try to load from sessionStorage first
      try {
        saved = sessionStorage.getItem(STORAGE_KEY);
      } catch (e) {
        // Silent fail
      }

      // Fallback to window object
      if (!saved) {
        saved = (window as any).dailyCatState;
      }

      // Fallback to global variable
      if (!saved) {
        saved = (globalThis as any).dailyCatPersistentState;
      }

      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading state:', error);
    }
    return null;
  };

  // Generate deterministic cat for today based on date
  const getDeterministicCat = (dateString: string): CatData => {
    const hash = hashCode(dateString);

    // Use hash to determine if we show personal cat (30% chance)
    const showPersonalCat = hash % 100 < 30 && personalCats.length > 0;

    if (showPersonalCat) {
      const personalIndex = hash % personalCats.length;
      return personalCats[personalIndex];
    }

    // For API cats, use deterministic selection
    const factIndex = hash % catFacts.length;
    const nameIndex = (hash + 1) % catNames.length;

    // Create a deterministic cat ID based on date
    const catId = `daily-${dateString.replace(/\s/g, '-')}`;

    // Use a selection of predetermined cat images that are likely to work
    const reliableCatImages = [
      'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1543793/pexels-photo-1543793.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2071873/pexels-photo-2071873.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/320014/pexels-photo-320014.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1276553/pexels-photo-1276553.jpeg?auto=compress&cs=tinysrgb&w=800',
    ];

    const imageIndex = hash % reliableCatImages.length;

    return {
      id: catId,
      url: reliableCatImages[imageIndex],
      fact: catFacts[factIndex],
      name: catNames[nameIndex],
      isPersonal: false,
    };
  };

  const getDailyCat = (
    savedState: AppState | null,
  ): { cat: CatData; isNewDay: boolean } => {
    const today = new Date().toDateString();

    // If we have a saved state and it's for today, return the current cat
    if (
      savedState &&
      savedState.dailyCatDate === today &&
      savedState.currentCat
    ) {
      return { cat: savedState.currentCat, isNewDay: false };
    }

    // It's a new day or first visit - get deterministic cat for today
    const todaysCat = getDeterministicCat(today);
    return { cat: todaysCat, isNewDay: true };
  };

  // Helper function to get date in YYYY-MM-DD format for consistent comparison
  const getDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Helper function to check if two dates are consecutive days
  const areConsecutiveDays = (dateStr1: string, dateStr2: string): boolean => {
    const date1 = new Date(dateStr1);
    const date2 = new Date(dateStr2);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  };

  const updateStreakAndVisits = (
    savedState: AppState | null,
    isNewDay: boolean,
    currentSessionId: string,
  ) => {
    const today = getDateKey(new Date());
    const yesterday = getDateKey(new Date(Date.now() - 86400000));

    // Always increment visits for new sessions (when app loads/reloads)
    const isNewSession =
      !savedState || savedState.lastSessionId !== currentSessionId;

    let newStreak = savedState ? savedState.streak : 0;
    let newTotalVisits = savedState ? savedState.totalVisits : 0;

    // Always increment visits for new sessions
    if (isNewSession) {
      newTotalVisits = newTotalVisits + 1;
    }

    // Update streak logic - FIXED VERSION
    if (isNewDay) {
      if (!savedState || !savedState.lastVisit) {
        // First ever visit
        newStreak = 2;
      } else {
        // Convert stored lastVisit to consistent format for comparison
        const lastVisitDate = getDateKey(new Date(savedState.lastVisit));

        if (lastVisitDate === yesterday) {
          // Consecutive day - increment streak
          newStreak = savedState.streak + 1;
        } else {
          // Gap in visits - reset streak to 1
          newStreak = 1;
        }
      }
    } else if (savedState) {
      // Same day, keep existing streak
      newStreak = savedState.streak;
    }

    return {
      streak: newStreak,
      totalVisits: newTotalVisits,
      lastVisit: isNewDay ? today : savedState?.lastVisit || today,
      lastSessionId: currentSessionId,
    };
  };

  const toggleFavorite = () => {
    if (!appState.currentCat) return;

    setAppState((prev) => {
      const newFavorites = prev.favorites.includes(prev.currentCat!.id)
        ? prev.favorites.filter((id) => id !== prev.currentCat!.id)
        : [...prev.favorites, prev.currentCat!.id];

      const newState = { ...prev, favorites: newFavorites };
      saveState(newState);
      return newState;
    });

    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1000);
  };

  const shareCat = async () => {
    if (!appState.currentCat) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Daily Cat: ${appState.currentCat.name}`,
          text: `Check out today's adorable cat ${appState.currentCat.name}! ${appState.currentCat.fact}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share canceled');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(
          `Check out today's daily cat: ${window.location.href}`,
        );
        alert('Link copied to clipboard!');
      } catch (error) {
        console.log('Clipboard not available');
      }
    }
  };

  useEffect(() => {
    const initializeApp = () => {
      // Prevent double initialization using ref
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      // Generate unique session ID for this app load
      const currentSessionId = generateSessionId();

      // Load saved state
      const savedState = loadState();
      const today = new Date().toDateString();

      // Get today's cat (will be same cat if same day, new cat if new day)
      const { cat: dailyCat, isNewDay } = getDailyCat(savedState);

      // Calculate streak and visits (visits increment every session)
      const stats = updateStreakAndVisits(
        savedState,
        isNewDay,
        currentSessionId,
      );

      // Create the new state
      const newState: AppState = {
        currentCat: dailyCat,
        dailyCatDate: today,
        favorites: savedState ? savedState.favorites : [],
        ...stats,
      };

      // Save the new state
      saveState(newState);
      setAppState(newState);
      setLoading(false);
    };

    initializeApp();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Loading today's cat...</p>
          <p className="text-sm mt-2 opacity-75">
            Preparing your daily dose of joy
          </p>
        </div>
      </div>
    );
  }

  const isFavorited =
    appState.currentCat && appState.favorites.includes(appState.currentCat.id);
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 animate-pulse" />
            Daily Cat
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 animate-pulse" />
          </h1>
          <p className="text-white/80 text-lg">Your daily dose of feline joy</p>
          <p className="text-white/60 text-sm mt-2">{today}</p>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center transform hover:scale-105 transition-transform duration-200">
            <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
              {appState.streak}
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-white/80 text-sm">Day Streak</div>
            {appState.streak > 1 && (
              <div className="text-white/60 text-xs mt-1">🔥 On fire!</div>
            )}
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center transform hover:scale-105 transition-transform duration-200">
            <div className="text-2xl font-bold text-white">
              {appState.totalVisits}
            </div>
            <div className="text-white/80 text-sm">Total Visits</div>
            <div className="text-white/60 text-xs mt-1">Every session</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center md:col-span-1 col-span-2 transform hover:scale-105 transition-transform duration-200">
            <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
              {appState.favorites.length}
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div className="text-white/80 text-sm">Favorites</div>
            <div className="text-white/60 text-xs mt-1">Loved cats</div>
          </div>
        </div>

        {/* Main Cat Card */}
        {appState.currentCat && (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl mb-8 relative overflow-hidden">
            {/* Personal cat badge */}
            {appState.currentCat.isPersonal && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10 animate-pulse">
                Your Cat ❤️
              </div>
            )}

            {/* Daily cat indicator */}
            <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
              Today's Cat 📅
            </div>

            {/* Cat Image */}
            <div className="relative mb-6 group">
              <img
                src={appState.currentCat.url}
                alt={`Today's cat: ${appState.currentCat.name}`}
                className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=800';
                }}
              />

              {/* Heart Animation */}
              {showHeart && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Heart className="w-20 h-20 text-red-500 fill-current animate-ping" />
                </div>
              )}
            </div>

            {/* Cat Info */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {appState.currentCat.name}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {appState.currentCat.fact}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={toggleFavorite}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isFavorited
                    ? 'bg-red-500 text-white shadow-lg hover:bg-red-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`}
                />
                {isFavorited ? 'Favorited' : 'Favorite'}
              </button>

              <button
                onClick={shareCat}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-white/60 pb-8">
          <p>Come back tomorrow for a new adorable cat! 🐱</p>
          <p className="text-xs mt-2">
            Your streak resets if you miss a day • Visit daily to keep it
            growing!
          </p>
          <p className="text-xs mt-1">
            Fresh cats daily from around the internet + your special Gidget! 🐾
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
