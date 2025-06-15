import React, { useState, useEffect } from 'react';
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
}

// In-memory storage that persists during the session
let persistentStorage: { [key: string]: any } = {};

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentCat: null,
    streak: 0,
    lastVisit: '',
    totalVisits: 0,
    favorites: [],
    dailyCatDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [showHeart, setShowHeart] = useState(false);

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

  // Save state to persistent storage
  const saveState = (state: AppState) => {
    persistentStorage['dailyCatState'] = JSON.stringify(state);
  };

  // Load state from persistent storage
  const loadState = (): AppState | null => {
    const saved = persistentStorage['dailyCatState'];
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing saved state:', error);
        return null;
      }
    }
    return null;
  };

  const fetchRandomCat = async (): Promise<CatData> => {
    try {
      const response = await fetch(
        'https://api.thecatapi.com/v1/images/search',
      );
      const data = await response.json();

      if (data && data[0]) {
        const randomFact =
          catFacts[Math.floor(Math.random() * catFacts.length)];
        const randomName =
          catNames[Math.floor(Math.random() * catNames.length)];

        return {
          id: `api-${data[0].id}`,
          url: data[0].url,
          fact: randomFact,
          name: randomName,
          isPersonal: false,
        };
      }
    } catch (error) {
      console.error('Error fetching cat:', error);
    }

    // Fallback cat if API fails
    return {
      id: 'fallback-cat',
      url: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=800',
      fact: "Sometimes the internet cats need a nap too! Here's a backup cutie.",
      name: 'Backup',
      isPersonal: false,
    };
  };

  const getDailyCat = async (
    savedState: AppState | null,
  ): Promise<{ cat: CatData; isNewDay: boolean }> => {
    const today = new Date().toDateString();

    // If we have a saved state and it's for today, return the current cat
    if (
      savedState &&
      savedState.dailyCatDate === today &&
      savedState.currentCat
    ) {
      return { cat: savedState.currentCat, isNewDay: false };
    }

    // It's a new day or first visit - get a new cat
    // 30% chance to show a personal cat, 70% chance for API cat
    const showPersonalCat = Math.random() < 0.3 && personalCats.length > 0;

    let newCat: CatData;
    if (showPersonalCat) {
      newCat = personalCats[Math.floor(Math.random() * personalCats.length)];
    } else {
      newCat = await fetchRandomCat();
    }

    return { cat: newCat, isNewDay: true };
  };

  const updateStreakAndVisits = (
    savedState: AppState | null,
    isNewDay: boolean,
  ) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (!isNewDay && savedState) {
      // Same day visit - don't update stats, just load existing ones
      return {
        streak: savedState.streak,
        totalVisits: savedState.totalVisits,
        lastVisit: savedState.lastVisit,
      };
    }

    // This is a new day visit
    let newStreak = savedState ? savedState.streak : 0;
    let newTotalVisits = savedState ? savedState.totalVisits : 0;

    if (!savedState || savedState.lastVisit !== today) {
      // Update total visits for new day
      newTotalVisits = newTotalVisits + 1;

      // Update streak logic
      if (!savedState || savedState.lastVisit === '') {
        // First ever visit
        newStreak = 1;
      } else if (savedState.lastVisit === yesterday) {
        // Consecutive day - increment streak
        newStreak = savedState.streak + 1;
      } else {
        // Gap in visits - reset streak to 1
        newStreak = 1;
      }
    }

    return {
      streak: newStreak,
      totalVisits: newTotalVisits,
      lastVisit: today,
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
    const initializeApp = async () => {
      // Load saved state
      const savedState = loadState();
      const today = new Date().toDateString();

      // Get today's cat (will be same cat if same day, new cat if new day)
      const { cat: dailyCat, isNewDay } = await getDailyCat(savedState);

      // Calculate streak and visits
      const stats = updateStreakAndVisits(savedState, isNewDay);

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
            <div className="text-white/60 text-xs mt-1">Since day one</div>
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
          <p className="text-xs mt-1 opacity-40">
            Fresh cats daily from around the internet + your special Gidget! 🐾
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
