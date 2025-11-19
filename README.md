# Valorant Aim Trainer - Mini Games Platform

A React-based mini games platform featuring aim training and esports player guessing games.

## Tech Stack

- **React 18** with **Vite**
- **React Router DOM** for navigation
- **CSS Modules** for styling
- **Three.js** (for Aim Reflex MVP game only)

## Project Structure

```
src/
  components/
    GuessPlayer/          # Guess the Esports Player game components
      HighlightCard.jsx
      GuessOptions.jsx
      ResultPanel.jsx
      ScoreScreen.jsx
      GameController.jsx
    Game.jsx             # Aim Reflex MVP game
    GamePage.jsx
    MiniGamesHome.jsx    # Landing page
    ...
  data/
    esportsClips.json    # Game data for Guess the Esports Player
  pages/
    GuessPlayerPage.jsx  # Main page for Guess the Esports Player
```

## Games

1. **Aim Reflex MVP** (`/game`) - 3D aim training game
2. **Guess the Esports Player** (`/guess-player`) - Identify the pro player from highlights
3. **Coming Soon** - Placeholder for future games

## Replacing Placeholder Videos

The "Guess the Esports Player" game currently uses placeholder videos. To replace them with real video clips:

### Step 1: Add Video Files

1. Place your video files in the `public/` directory (or any accessible location)
2. Supported formats: `.mp4`, `.webm`, `.ogg`
3. Recommended: Use compressed MP4 files for best browser compatibility

### Step 2: Update JSON Data

Edit `/src/data/esportsClips.json` and replace the `"videoUrl": "placeholder"` values with your actual video paths:

```json
[
  {
    "id": 1,
    "videoUrl": "/videos/faker-highlight.mp4",  // ← Update this
    "correctPlayer": "Faker",
    "choices": ["Faker", "Chovy", "Knight", "ShowMaker"],
    "lore": "A legendary mid-lane outplay..."
  },
  // ... more clips
]
```

### Step 3: Video Path Options

You can use:
- **Relative paths from public**: `/videos/clip1.mp4` (files in `public/videos/`)
- **Absolute URLs**: `https://example.com/videos/clip1.mp4`
- **Import paths**: If using Vite, you can import videos and use the imported path

### Step 4: Video Component

The `HighlightCard` component automatically detects when `videoUrl` is not `"placeholder"` and renders a `<video>` element instead of the placeholder box.

**Current implementation** (`src/components/GuessPlayer/HighlightCard.jsx`):
- Shows placeholder if `videoUrl === "placeholder"`
- Shows video player if `videoUrl` is any other value
- Video has controls and plays inline

### Example Video Structure

```
public/
  videos/
    faker-highlight.mp4
    uzi-highlight.mp4
    theshy-highlight.mp4
    caps-highlight.mp4
    rookie-highlight.mp4
```

Then update `esportsClips.json`:
```json
{
  "videoUrl": "/videos/faker-highlight.mp4"
}
```

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Notes

- The game shuffles clips on each playthrough for variety
- Score is calculated as correct guesses / total clips
- All styling uses CSS Modules for component isolation
- Mobile responsive design included

