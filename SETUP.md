# VoiceCraft Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your Replicate API token:

```env
REPLICATE_API_TOKEN=your_replicate_api_token_here
```

**Get your Replicate API token:**
1. Visit https://replicate.com/account/api-tokens
2. Create a new token or copy an existing one
3. Paste it into your `.env` file

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

### 4. Test Voice Generation

1. Navigate to http://localhost:3000/demo
2. Enter text in the text area
3. Adjust voice settings (emotion, speed, pitch, volume)
4. Click "Generate Voice"
5. Listen to the generated audio and download if desired

---

## Project Structure

```
voicecraft/
├── app/
│   ├── api/
│   │   └── voices/
│   │       └── generate/
│   │           └── route.ts          # Voice generation API endpoint
│   ├── demo/
│   │   └── page.tsx                  # Demo page with voice generator
│   ├── layout.tsx                    # Root layout with fonts & providers
│   ├── page.tsx                      # Homepage
│   └── globals.css                   # Global styles & design system
├── components/
│   ├── ui/                           # Base UI components (button, card, etc.)
│   ├── marketing/                    # Marketing components (header, hero, etc.)
│   └── voicecraft/                   # Voice synthesis components
│       ├── voice-generator.tsx       # Main voice generator component ⭐
│       ├── audio-player.tsx          # Audio playback with waveform
│       ├── voice-selector.tsx        # Voice selection interface
│       ├── generation-progress.tsx   # Progress indicator
│       └── waveform.tsx              # Waveform visualization
├── lib/
│   ├── mantine-theme.ts              # Mantine UI theme (yellow/black/white)
│   └── utils.ts                      # Utility functions
├── .env.example                      # Environment variable template
├── REPLICATE_IMPLEMENTATION_GUIDE.md # Complete implementation guide
└── SETUP.md                          # This file
```

---

## Features Implemented

### Phase 1: Text-to-Speech (Complete ✅)

- ✅ **API Endpoint**: `/api/voices/generate`
  - Accepts text input (up to 10,000 characters)
  - Configurable voice, emotion, speed, pitch, volume
  - Returns MP3 audio URL
  - Full error handling and validation

- ✅ **Voice Generator UI**: `/demo`
  - Text input with character counter
  - Voice selector (currently Wise Woman preset)
  - Emotion control (auto, happy, sad, angry, etc.)
  - Speed control (0.5x - 2.0x)
  - Pitch adjustment (-12 to +12 semitones)
  - Volume control (0 - 10)
  - Real-time progress indicators
  - Audio player with download functionality

- ✅ **Model Integration**: Minimax Speech-02-Turbo
  - 5M+ runs on Replicate
  - Production-ready, low latency
  - High-quality voice synthesis
  - Multilingual support

---

## API Reference

### POST /api/voices/generate

Generate speech from text using Minimax Speech-02-Turbo.

**Request Body:**

```json
{
  "text": "Your text here",
  "voiceId": "Wise_Woman",
  "emotion": "auto",
  "speed": 1.0,
  "pitch": 0,
  "volume": 1.0,
  "audioFormat": "mp3",
  "sampleRate": 48000,
  "languageBoost": "Automatic"
}
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `text` | string | Yes | - | Text to convert to speech (max 10,000 chars) |
| `voiceId` | string | No | "Wise_Woman" | Voice ID to use |
| `emotion` | string | No | "auto" | Emotion: auto, happy, sad, angry, excited, calm, serious, friendly |
| `speed` | number | No | 1.0 | Speed multiplier (0.5 - 2.0) |
| `pitch` | number | No | 0 | Pitch adjustment in semitones (-12 to +12) |
| `volume` | number | No | 1.0 | Volume level (0 - 10) |
| `audioFormat` | string | No | "mp3" | Audio format: mp3, wav, flac, pcm |
| `sampleRate` | number | No | 48000 | Sample rate: 16000, 22050, 24000, 32000, 44100, 48000 |
| `languageBoost` | string | No | "Automatic" | Language hint for better quality |

**Response (Success):**

```json
{
  "success": true,
  "audioUrl": "https://replicate.delivery/...",
  "metadata": {
    "characterCount": 42,
    "model": "minimax/speech-02-turbo",
    "version": "e2e8812b...",
    "settings": {
      "voiceId": "Wise_Woman",
      "emotion": "auto",
      "speed": 1.0,
      "pitch": 0,
      "volume": 1.0,
      "audioFormat": "mp3",
      "sampleRate": 48000
    }
  }
}
```

**Response (Error):**

```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

---

## Design System

VoiceCraft uses a **brutalist black/white/yellow design system**.

### Colors

- **Primary**: #EAB308 (Yellow)
- **Black**: #000000
- **White**: #FFFFFF
- **Gray Scale**: #0A0A0A → #FAFAFA

### Typography

- **Display Font**: Stack Sans Headline (Google Fonts)
- **Body Font**: Inter (Google Fonts)
- **All headings**: Uppercase, bold, tight tracking

### Visual Style

- **Borders**: 4px solid black
- **Shadows**: 8px offset brutalist shadows
- **Borders**: Bold, black outlines
- **Accent**: Yellow highlights and buttons

---

## Next Steps

### Phase 2: Voice Cloning (Planned)

To implement voice cloning:

1. **Set up database**:
   - Create PostgreSQL database
   - Run migrations from `REPLICATE_IMPLEMENTATION_GUIDE.md`
   - Add `DATABASE_URL` to `.env`

2. **Create API endpoints**:
   - `POST /api/voices/clone` - Clone a voice from audio
   - `GET /api/voices/my-clones` - Get user's cloned voices
   - `DELETE /api/voices/clone/:id` - Delete a clone

3. **Build UI**:
   - Voice cloning uploader (already created: `voice-clone-uploader.tsx`)
   - Voice library/management interface
   - Integration with voice selector

4. **Model**: Minimax Voice Cloning
   - Input: Audio file (10s - 5min, MP3/M4A/WAV)
   - Output: `voice_id` string
   - Use with Speech-02-Turbo for custom voices

**Reference**: See `REPLICATE_IMPLEMENTATION_GUIDE.md` for complete Phase 2 implementation details.

---

## Troubleshooting

### Issue: "Voice generation service is not configured"

**Solution**: Make sure `REPLICATE_API_TOKEN` is set in your `.env` file.

```bash
# Check if .env file exists
ls -la .env

# If not, create it
cp .env.example .env

# Add your token
echo "REPLICATE_API_TOKEN=your_token_here" >> .env
```

### Issue: Dev server shows cached errors

**Solution**: Clear Next.js cache and restart:

```bash
rm -rf .next
npm run dev
```

### Issue: Styles not loading correctly

**Solution**: Check that all CSS imports are present in `app/layout.tsx`:

```tsx
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/carousel/styles.css';
import "./globals.css";
```

### Issue: API requests fail with CORS errors

**Solution**: Make sure you're calling the API from the same domain (localhost:3000 → localhost:3000). The API routes are server-side and don't have CORS issues when called from the same Next.js app.

---

## Testing

### Manual Testing Checklist

- [ ] Homepage loads without errors
- [ ] Demo page loads at `/demo`
- [ ] Can enter text in the generator
- [ ] Character counter updates correctly
- [ ] Emotion selector works
- [ ] Speed slider functions (0.5x - 2.0x)
- [ ] Pitch slider functions (-12 to +12)
- [ ] Volume slider functions (0 - 10)
- [ ] Generate button is enabled with valid text
- [ ] Generate button is disabled when text is empty
- [ ] Generate button is disabled when text exceeds 10,000 characters
- [ ] Progress indicator shows during generation
- [ ] Audio player appears with generated audio
- [ ] Can play generated audio
- [ ] Can download generated audio
- [ ] Error notifications show for failed generations

### API Testing with curl

Test the voice generation API:

```bash
curl -X POST http://localhost:3000/api/voices/generate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, this is a test of the voice generation system.",
    "voiceId": "Wise_Woman",
    "emotion": "happy",
    "speed": 1.0
  }'
```

Health check:

```bash
curl http://localhost:3000/api/voices/generate
```

---

## Production Deployment

### Environment Variables

Make sure to set these in your production environment:

```env
REPLICATE_API_TOKEN=your_production_token
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Recommended Platforms

- **Vercel**: Optimal for Next.js (zero config)
- **Netlify**: Good alternative with edge functions
- **Railway**: Easy deployment with built-in PostgreSQL (for Phase 2)
- **Render**: Simple deployment with database options

### Build Command

```bash
npm run build
```

### Start Command

```bash
npm start
```

---

## Cost Estimation

### Minimax Pricing (Approximate)

- **Speech-02-Turbo**: ~$0.10 per 1,000 characters
- **Voice Cloning**: ~$0.20 per clone training

### Monthly Cost Examples

| Plan | Characters/Month | Clones | API Cost | Markup (3x) | Total Price |
|------|-----------------|--------|----------|-------------|-------------|
| **Free** | 5,000 | 0 | $0.50 | - | Free |
| **Starter** | 10,000 | 1 | $1.20 | - | $0 (promo) |
| **Pro** | 100,000 | 5 | $11.00 | 3x | $29/mo |
| **Enterprise** | 1,000,000+ | Unlimited | $100+ | 2-3x | Custom |

**Note**: Prices are estimates. Check Replicate pricing for current rates.

---

## Resources

### Documentation

- [Replicate API Docs](https://replicate.com/docs)
- [Minimax Speech-02-Turbo](https://replicate.com/minimax/speech-02-turbo)
- [Minimax Voice Cloning](https://replicate.com/minimax/voice-cloning)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Mantine UI](https://mantine.dev/)

### Implementation Guide

See `REPLICATE_IMPLEMENTATION_GUIDE.md` for:
- Complete model specifications
- Database schemas
- API endpoint designs
- Frontend component specs
- Security considerations
- Performance optimization
- Monitoring & analytics

### Support

- **Replicate Discord**: https://discord.gg/replicate
- **Replicate Support**: support@replicate.com
- **GitHub Issues**: Create issues in project repo

---

## License

[Your License Here]

---

## Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Replicate](https://replicate.com/)
- [Minimax AI](https://www.minimaxi.com/)
- [Mantine UI](https://mantine.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
