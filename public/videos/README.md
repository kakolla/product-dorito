# Video Files Directory

Place your esports highlight videos here.

## File Naming Convention

You can name your files however you like, but here's a suggested naming pattern:

- `faker-highlight.mp4` (for ID 1 - Faker)
- `uzi-highlight.mp4` (for ID 2 - Uzi)
- `theshy-highlight.mp4` (for ID 3 - TheShy)
- `caps-highlight.mp4` (for ID 4 - Caps)
- `rookie-highlight.mp4` (for ID 5 - Rookie)

## Video Requirements

- **Format**: MP4 (recommended), WebM, or OGG
- **Codec**: H.264 for best browser compatibility
- **Size**: Compress videos for web (recommended: < 10MB per clip)
- **Aspect Ratio**: 16:9 recommended

## After Adding Videos

Update `/src/data/esportsClips.json` and change the `videoUrl` values:

```json
{
  "id": 1,
  "videoUrl": "/videos/faker-highlight.mp4",  // ← Change from "placeholder"
  ...
}
```

