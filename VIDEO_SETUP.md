# Video Setup Guide

## Correct Answer Order (by Clip ID)

| ID | Correct Player | Role/Description | Video File Name Suggestion |
|----|----------------|------------------|---------------------------|
| 1  | **Faker**      | Mid-lane outplay | `faker-highlight.mp4` |
| 2  | **Uzi**        | ADC positioning | `uzi-highlight.mp4` |
| 3  | **TheShy**     | Top-lane aggressive play | `theshy-highlight.mp4` |
| 4  | **Caps**       | European mid-lane teamfight | `caps-highlight.mp4` |
| 5  | **Rookie**     | Mid-lane game sense | `rookie-highlight.mp4` |

## Where to Store Videos

**Location**: `/public/videos/`

The directory has been created for you. Place your video files directly in this folder.

## Step-by-Step Setup

### 1. Add Video Files
Place your video files in `public/videos/`:
```
public/
  videos/
    faker-highlight.mp4
    uzi-highlight.mp4
    theshy-highlight.mp4
    caps-highlight.mp4
    rookie-highlight.mp4
```

### 2. Update JSON File
Edit `src/data/esportsClips.json` and update each `videoUrl`:

**Before:**
```json
{
  "id": 1,
  "videoUrl": "placeholder",
  "correctPlayer": "Faker",
  ...
}
```

**After:**
```json
{
  "id": 1,
  "videoUrl": "/videos/faker-highlight.mp4",
  "correctPlayer": "Faker",
  ...
}
```

### 3. Complete Example

Here's how your `esportsClips.json` should look after adding videos:

```json
[
  {
    "id": 1,
    "videoUrl": "/videos/faker-highlight.mp4",
    "correctPlayer": "Faker",
    "choices": ["Faker", "Chovy", "Knight", "ShowMaker"],
    "lore": "A legendary mid-lane outplay known around the world. This iconic play cemented Faker's status as the greatest League of Legends player of all time."
  },
  {
    "id": 2,
    "videoUrl": "/videos/uzi-highlight.mp4",
    "correctPlayer": "Uzi",
    "choices": ["Uzi", "Deft", "Ruler", "JackeyLove"],
    "lore": "One of the most mechanically gifted ADCs in esports history. This play showcased Uzi's incredible positioning and teamfight awareness."
  },
  {
    "id": 3,
    "videoUrl": "/videos/theshy-highlight.mp4",
    "correctPlayer": "TheShy",
    "choices": ["TheShy", "Nuguri", "Khan", "369"],
    "lore": "A top-lane mastermind known for aggressive plays and mechanical outplays. This highlight demonstrates why TheShy is feared in the top lane."
  },
  {
    "id": 4,
    "videoUrl": "/videos/caps-highlight.mp4",
    "correctPlayer": "Caps",
    "choices": ["Caps", "Perkz", "Humanoid", "Larssen"],
    "lore": "The European mid-lane prodigy who brought innovation to the region. This play shows Caps' ability to turn teamfights with creative positioning."
  },
  {
    "id": 5,
    "videoUrl": "/videos/rookie-highlight.mp4",
    "correctPlayer": "Rookie",
    "choices": ["Rookie", "Doinb", "Scout", "Xiaohu"],
    "lore": "A versatile mid-laner with incredible game sense. This highlight captures Rookie's ability to read the game and make game-winning plays."
  }
]
```

## Important Notes

- **Path format**: Use `/videos/filename.mp4` (starts with `/`)
- **File names**: Can be anything you want, just match them in the JSON
- **Video format**: MP4 (H.264) recommended for best browser support
- **File size**: Keep videos under 10MB each for better loading
- **Testing**: After adding videos, refresh your browser to see them

## Quick Reference: Player → Video Mapping

- **Faker** → `/videos/faker-highlight.mp4`
- **Uzi** → `/videos/uzi-highlight.mp4`
- **TheShy** → `/videos/theshy-highlight.mp4`
- **Caps** → `/videos/caps-highlight.mp4`
- **Rookie** → `/videos/rookie-highlight.mp4`

