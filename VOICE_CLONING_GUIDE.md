# VoiceCraft - Voice Cloning & Usage Guide

## 🎯 Complete User Flow

### Overview
Users can clone their voice and then use it to generate speech. Here's the complete workflow:

```
1. Upload Audio Sample → Clone Voice → Get voice_id
2. Enter Text → Generate with voice_id → Get Audio in Custom Voice
```

---

## Step 1: Clone a Voice

### API Endpoint
```
POST /api/voices/clone
```

### Request Example
```json
{
  "userId": "user_abc123",
  "name": "My Professional Voice",
  "description": "My voice for professional content",
  "audioFileUrl": "https://example.com/my-voice-sample.mp3",
  "model": "speech-02-turbo",
  "accuracy": 0.7,
  "noiseReduction": true,
  "normalizeVolume": true,
  "language": "en-US",
  "gender": "male",
  "style": "professional"
}
```

### Audio File Requirements
- **Format**: MP3, M4A, or WAV
- **Duration**: 10 seconds to 5 minutes
- **File Size**: Less than 20MB
- **Quality**: Clear speech, minimal background noise
- **Content**: Should contain natural speaking voice

### Response Example
```json
{
  "success": true,
  "voice": {
    "id": "clk123abc",                        // Database ID
    "name": "My Professional Voice",
    "voiceId": "v_abc123xyz",                 // ⭐ Replicate voice_id (USE THIS!)
    "description": "My voice for professional content",
    "language": "en-US",
    "model": "speech-02-turbo",
    "sampleAudioUrl": "https://example.com/my-voice-sample.mp3",
    "createdAt": "2025-11-08T10:30:00Z"
  },
  "metadata": {
    "model": "minimax/voice-cloning",
    "version": "fff8a670...",
    "settings": {
      "accuracy": 0.7,
      "noiseReduction": true,
      "normalizeVolume": true
    }
  }
}
```

### What Happens Behind the Scenes
1. ✅ Validates request with Zod schema
2. ✅ Creates database record with status: "processing"
3. ✅ Calls Replicate's Minimax Voice Cloning model
4. ✅ Receives `voice_id` from Replicate (e.g., "v_abc123xyz")
5. ✅ Updates database with `voice_id` and status: "active"
6. ✅ Returns complete voice object

---

## Step 2: Generate Speech with Cloned Voice

### API Endpoint
```
POST /api/voices/generate
```

### Request Example (Using Custom Voice)
```json
{
  "text": "Hello! This is my custom cloned voice speaking. How do I sound?",
  "userId": "user_abc123",
  "voiceId": "v_abc123xyz",              // ⭐ Use the voice_id from Step 1
  "emotion": "happy",
  "speed": 1.0,
  "pitch": 0,
  "volume": 1.0,
  "audioFormat": "mp3",
  "sampleRate": 32000
}
```

### Response Example
```json
{
  "success": true,
  "audioUrl": "https://replicate.delivery/pbxt/xyz123.mp3",  // ⭐ Download/play this!
  "metadata": {
    "characterCount": 65,
    "model": "minimax/speech-02-turbo",
    "version": "e2e8812b...",
    "isCustomVoice": true,                 // ✅ Confirms custom voice was used
    "voiceName": "My Professional Voice",
    "settings": {
      "voiceId": "v_abc123xyz",
      "emotion": "happy",
      "speed": 1.0,
      "pitch": 0,
      "volume": 1.0,
      "audioFormat": "mp3",
      "sampleRate": 32000
    }
  }
}
```

### What Happens Behind the Scenes
1. ✅ Validates request with Zod schema
2. ✅ If `userId` provided, looks up voice in database
3. ✅ Verifies user owns the voice
4. ✅ Gets the Replicate `voice_id` from database
5. ✅ Calls Minimax Speech-02-Turbo with custom voice_id
6. ✅ Saves generation to database for tracking
7. ✅ Returns audio URL in user's custom voice

---

## Alternative: Use Preset Voices

If you don't want to clone a voice, you can use preset voices:

### Request Example (Preset Voice)
```json
{
  "text": "This is a preset voice speaking.",
  "voiceId": "Wise_Woman",               // Preset voice name
  "emotion": "calm",
  "speed": 1.0
}
```

### Available Preset Voices
- `Wise_Woman` (default female voice)
- `Young_Man`
- `Narrator`
- 300+ other voices available via Minimax API

---

## Complete Integration Flow

### Frontend → Backend Flow

```typescript
// 1. Clone Voice (upload audio)
const cloneResponse = await fetch('/api/voices/clone', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: currentUser.id,
    name: "My Voice",
    audioFileUrl: uploadedAudioUrl,
    model: "speech-02-turbo",
    noiseReduction: true,
  })
});

const { voice } = await cloneResponse.json();
const customVoiceId = voice.voiceId;  // Save this!

// 2. Generate Speech with Custom Voice
const generateResponse = await fetch('/api/voices/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: "Hello from my custom voice!",
    userId: currentUser.id,
    voiceId: customVoiceId,  // Use the voice_id from step 1
    emotion: "happy",
    speed: 1.0
  })
});

const { audioUrl } = await generateResponse.json();

// 3. Play or Download Audio
const audio = new Audio(audioUrl);
audio.play();
```

---

## Managing Cloned Voices

### List All My Voices
```
GET /api/voices/my-clones?userId=user_abc123&status=active&page=1&limit=20
```

### Get Single Voice Details
```
GET /api/voices/clone/clk123abc?userId=user_abc123
```

### Update Voice Metadata
```
PATCH /api/voices/clone/clk123abc
{
  "userId": "user_abc123",
  "name": "Updated Voice Name",
  "description": "New description",
  "isPublic": false
}
```

### Delete Voice
```
DELETE /api/voices/clone/clk123abc
{
  "userId": "user_abc123"
}
```

---

## Advanced Features

### Voice Generation Parameters

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `text` | string | 1-10,000 chars | - | Text to convert to speech |
| `voiceId` | string | - | "Wise_Woman" | Preset or custom voice ID |
| `emotion` | enum | See below | "auto" | Emotional tone |
| `speed` | number | 0.5 - 2.0 | 1.0 | Playback speed |
| `pitch` | number | -12 to +12 | 0 | Pitch adjustment (semitones) |
| `volume` | number | 0 - 10 | 1.0 | Volume level |
| `audioFormat` | enum | mp3, wav, flac, pcm | "mp3" | Output format |
| `sampleRate` | number | See below | 32000 | Audio quality |

### Supported Emotions
- `auto` - Automatic detection
- `happy` - Joyful, upbeat
- `sad` - Melancholic, somber
- `angry` - Frustrated, intense
- `excited` - Enthusiastic, energetic
- `calm` - Relaxed, peaceful
- `serious` - Professional, formal
- `friendly` - Warm, approachable

### Supported Sample Rates
- 16000 Hz - Telephone quality
- 22050 Hz - FM radio quality
- 24000 Hz - Standard quality
- 32000 Hz - High quality (default)
- 44100 Hz - CD quality
- 48000 Hz - Studio quality

---

## Error Handling

### Validation Errors (400)
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "text",
      "message": "Text cannot exceed 10000 characters"
    },
    {
      "field": "speed",
      "message": "Speed must be between 0.5 and 2.0"
    }
  ]
}
```

### Voice Not Found (404)
```json
{
  "error": "Voice not found or access denied"
}
```

### Rate Limiting (429)
```json
{
  "error": "Rate limit exceeded. Please try again later.",
  "retryAfter": 120
}
```

### Cloning Failed (500)
```json
{
  "error": "Voice cloning failed",
  "details": "Audio quality too low or file corrupted"
}
```

---

## Best Practices

### For Voice Cloning
1. ✅ Use high-quality audio (clear, minimal noise)
2. ✅ Record 30-60 seconds of natural speech
3. ✅ Speak at normal pace with varied intonation
4. ✅ Use studio/quiet environment
5. ✅ Enable noise reduction if recording has background sounds
6. ✅ Save the `voice_id` immediately for future use

### For Voice Generation
1. ✅ Always provide `userId` to track usage and access custom voices
2. ✅ Use database ID or Replicate voice_id interchangeably
3. ✅ Cache frequently used audio outputs
4. ✅ Handle rate limits gracefully with retries
5. ✅ Validate text length before sending (max 10,000 chars)

### Security
1. ✅ All APIs verify user ownership of custom voices
2. ✅ Voice IDs are validated against database
3. ✅ Failed cloning attempts update status to "failed"
4. ✅ All requests use Zod schema validation
5. ✅ Sensitive operations require userId

---

## Database Schema

### Voice Record
```sql
CREATE TABLE voices (
  id              TEXT PRIMARY KEY,
  userId          TEXT NOT NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  voiceId         TEXT UNIQUE,          -- Replicate voice_id
  language        TEXT DEFAULT 'en-US',
  model           TEXT,                 -- Which model was used
  sampleAudioUrl  TEXT,
  isCloned        BOOLEAN DEFAULT false,
  status          TEXT DEFAULT 'active', -- active, processing, failed
  createdAt       TIMESTAMP DEFAULT NOW()
);
```

### Voice Generation Record
```sql
CREATE TABLE voice_generations (
  id             TEXT PRIMARY KEY,
  userId         TEXT NOT NULL,
  voiceId        TEXT NOT NULL,
  text           TEXT NOT NULL,
  audioUrl       TEXT,
  characterCount INTEGER,
  emotion        TEXT,
  speed          FLOAT,
  pitch          FLOAT,
  status         TEXT DEFAULT 'completed',
  createdAt      TIMESTAMP DEFAULT NOW()
);
```

---

## Testing Examples

### Test Voice Cloning
```bash
curl -X POST http://localhost:3000/api/voices/clone \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_123",
    "name": "Test Voice",
    "audioFileUrl": "https://example.com/sample.mp3",
    "model": "speech-02-turbo",
    "noiseReduction": true
  }'
```

### Test Voice Generation with Custom Voice
```bash
curl -X POST http://localhost:3000/api/voices/generate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Testing my custom voice!",
    "userId": "test_user_123",
    "voiceId": "v_abc123xyz",
    "emotion": "happy"
  }'
```

### Test Voice Generation with Preset
```bash
curl -X POST http://localhost:3000/api/voices/generate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Testing preset voice!",
    "voiceId": "Wise_Woman",
    "emotion": "calm"
  }'
```

---

## Next Steps

1. **Frontend UI**: Create voice cloning uploader component
2. **Voice Library**: Build UI to manage user's cloned voices
3. **Voice Selector**: Update voice dropdown to show custom voices
4. **Usage Analytics**: Track generation counts per voice
5. **Subscription Limits**: Enforce voice clone limits by plan tier

---

## Support & Documentation

- **Replicate Docs**: https://replicate.com/minimax/voice-cloning
- **Minimax Speech**: https://replicate.com/minimax/speech-02-turbo
- **Implementation Guide**: See `REPLICATE_IMPLEMENTATION_GUIDE.md`
- **Setup Guide**: See `SETUP.md`

---

**Last Updated**: November 8, 2025
