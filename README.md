# 🐱 Daily Cat

A delightful React application that brightens your day with a new adorable cat every single day! Track your daily visits, build streaks, and collect your favorite feline friends.

## ✨ Features

### 🎯 Core Features

- **Daily Cat**: A new cat appears every day with interesting facts
- **Streak Tracking**: Build consecutive daily visit streaks
- **Real-time Visit Counter**: Tracks every time you visit the app
- **Favorites System**: Heart your favorite cats to save them
- **Share Functionality**: Share today's cat with friends

### 🎨 Visual Experience

- **Beautiful Gradient Backgrounds**: Eye-catching purple-to-pink gradients
- **Responsive Design**: Works perfectly on mobile and desktop
- **Smooth Animations**: Heart animations, hover effects, and transitions
- **Modern UI**: Glass-morphism cards with backdrop blur effects

### 🐾 Special Cats

- **Personal Cats**: Special appearances from Gidget (your personal cat)
- **Deterministic Daily Selection**: Same cat appears all day, changes at midnight
- **Curated Cat Images**: High-quality images from Pexels

## 📱 How It Works

### Daily Cat Logic

- Each day gets a deterministic cat based on the date
- 30% chance of showing a personal cat
- 70% chance of showing a curated cat with random facts
- Same cat appears throughout the entire day regardless of refreshes

### Statistics Tracking

- **Streak**: Consecutive days you've visited (resets if you miss a day)
- **Total Visits**: Every time you open/refresh the app
- **Favorites**: Cats you've hearted (persists across sessions)

### Data Persistence

The app uses multiple storage strategies to maintain your data:

- Primary: SessionStorage (when available)
- Fallback: Window object storage
- Backup: Global variable storage

## 🛠 Technical Details

### Built With

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Pexels API** for cat images

### Key Components

- **State Management**: React useState with persistent storage
- **Session Tracking**: Unique session IDs to prevent double-counting
- **Deterministic Cats**: Hash-based daily cat selection
- **Error Handling**: Graceful fallbacks for failed image loads

## 🎯 Features Deep Dive

### Streak System

- Increments when you visit on consecutive days
- Resets to 1 if you miss a day
- Shows fire emoji (🔥) when streak > 1

### Visit Tracking

- Increments every time the app loads
- Uses session IDs to prevent double-counting
- Tracks total visits since first use

### Personal Cats

- Special cats (Gidget) with custom facts
- 30% daily appearance probability
- Marked with "Your Cat ❤️" badge

### Share Feature

- Uses native Web Share API when available
- Falls back to clipboard copy
- Shares cat name, fact, and app URL

## 🎨 Customization

### Adding Your Own Cats

1. Add your cat images to the `public` folder
2. Update the `personalCats` array in `App.tsx`:
   ```typescript
   const personalCats: CatData[] = [
     {
       id: 'personal-1',
       url: '/your-cat.jpg',
       fact: 'Your custom cat fact here!',
       name: 'Your Cat Name',
       isPersonal: true,
     },
   ];
   ```

### Adding Cat Facts

Update the `catFacts` array with new interesting facts:

```typescript
const catFacts = [
  'Your new cat fact here!',
  // ... existing facts
];
```

### Styling Changes

The app uses Tailwind CSS. Key classes to modify:

- Background: `bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500`
- Cards: `bg-white/95 backdrop-blur-sm rounded-3xl`
- Buttons: Various gradient and solid color combinations

## 🐛 Troubleshooting

### Images Not Loading

- Check that personal cat images are in the `public` folder
- Verify image file names match exactly in the code
- The app includes fallback images for external failures

### Data Not Persisting

- Clear browser cache and reload
- Check browser console for storage errors
- The app uses multiple storage fallbacks automatically

### Streak Not Updating

- Streaks only update on new calendar days
- Visit the app on consecutive days to build streaks
- Missing a day resets the streak to 1

_Come back every day for your dose of feline joy!_
