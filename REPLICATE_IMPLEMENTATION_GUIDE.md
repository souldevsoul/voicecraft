# VoiceCraft - Replicate Implementation Guide
## Updated: November 2025

## Overview
This guide outlines the implementation plan for VoiceCraft using Replicate's voice synthesis and cloning models, with the latest and most popular options as of November 2025.

---

## 🏆 Top Models by Popularity (Run Count)

Based on current Replicate usage data:

1. **Kokoro-82M** - 56.7M+ runs ⭐ MOST POPULAR
2. **Minimax Speech-02-Turbo** - 5.1M+ runs
3. **XTTS-v2** - 4.4M+ runs
4. **RVC Voice Cloning** - 1.2M+ runs
5. **Minimax Speech-02-HD** - 971K+ runs
6. **Suno Bark** - 302K+ runs
7. **Tortoise TTS** - 172K+ runs

---

## 🆕 Recommended Model Stack (2025)

### Option A: Highest Quality + Most Popular

#### 1. Primary TTS: **Kokoro-82M** ⭐ MOST USED
- **Model**: `jaaari/kokoro-82m`
- **Version ID**: `f559560eb822dc509045f3921a1921234918b91739db4bf3daab2169b71c7a13`
- **Run Count**: 56,758,564+ (BY FAR the most popular)
- **Created**: January 29, 2025
- **Best For**: Production applications, highest quality, proven at scale
- **Base**: StyleTTS2 (82M parameters)

**Features**:
- Extremely high quality natural speech
- Multiple voices (af_bella, af_sarah, am_adam, etc.)
- Speed control (0.1x - 5.0x)
- Automatic long text splitting
- Lightweight and fast
- Battle-tested with 56M+ runs

**Input Parameters**:
```javascript
{
  text: string,              // Text input (automatically splits long text)
  voice: string,             // Default: "af_bella" (multiple voices available)
  speed: number              // 0.1 - 5.0 (default: 1.0)
}
```

**Pros**:
- ✅ Most popular model by far (56M+ runs vs 5M next closest)
- ✅ Proven reliability at massive scale
- ✅ Simple API, easy to use
- ✅ Fast inference
- ✅ Great quality

**Cons**:
- ❌ No built-in emotion control
- ❌ No voice cloning (preset voices only)
- ❌ Fewer parameters than emotion control

**Use When**: You want the most battle-tested, popular, simple TTS solution

---

### Option B: Latest Technology + Most Features

#### 1. Primary TTS: **Minimax Speech 2.6 Turbo** 🆕 NEWEST
- **Model**: `minimax/speech-2.6-turbo`
- **Version ID**: `24c0b2d2819faa5ce6eff09fc136c625e6e8c90e6f8a1cca75845f26fe9e1c4e`
- **Run Count**: 2,513+ (newly released)
- **Created**: November 7, 2025 (LATEST VERSION)
- **Best For**: Real-time applications with advanced features

**Features**:
- 300+ voices available
- Multilingual support (50+ languages)
- Emotional expression control
- Speed control (0.5x - 2.0x)
- Pitch adjustment (-12 to +12 semitones)
- Volume control (0 - 10)
- Multiple audio formats (MP3, WAV, FLAC, PCM)
- Sample rates: 16kHz, 22.05kHz, 24kHz, 32kHz, 44.1kHz, 48kHz
- Subtitle export with timestamps
- Pause markers (e.g., <#0.5#> for 0.5s pause)
- English normalization for numbers/dates

**Input Parameters**:
```javascript
{
  text: string,                    // Max 10,000 characters
  voice_id: string,                // Default: "Wise_Woman" or custom cloned voice
  emotion: string,                 // "auto", "happy", "sad", "angry", etc.
  speed: number,                   // 0.5 - 2.0
  pitch: number,                   // -12 to +12 semitones
  volume: number,                  // 0 - 10
  audio_format: string,            // "mp3", "wav", "flac", "pcm"
  sample_rate: number,             // 16000, 22050, 24000, 32000, 44100, 48000
  bitrate: number,                 // MP3 bitrate (default: 128000)
  channel: string,                 // "mono" or "stereo"
  language_boost: string,          // Language hint for better quality
  subtitle_enable: boolean,        // Return timestamps
  english_normalization: boolean   // Better number/date reading
}
```

**Pros**:
- ✅ Latest technology (Nov 2025)
- ✅ Most features (emotion, pitch, volume, subtitles)
- ✅ 300+ voices
- ✅ Works with voice cloning
- ✅ Real-time optimized

**Cons**:
- ❌ Newer (less battle-tested than Kokoro)
- ❌ More complex API
- ❌ May cost more

**Use When**: You need advanced features like emotion control and voice cloning

---

#### 2. Voice Cloning: **Minimax Voice Cloning**
- **Model**: `minimax/voice-cloning`
- **Version ID**: `fff8a670880f066d3742838515a88f7f0a3ae40a4f2e06dae0f7f70ba63582d7`
- **Run Count**: 19,217+
- **Best For**: Creating custom voice profiles for Minimax speech-02 and speech-2.6 models
- **Features**:
  - Quick training (seconds to minutes)
  - Works with speech-02-hd, speech-02-turbo, speech-2.6-turbo, speech-2.6-hd
  - Noise reduction option
  - Volume normalization
  - Quality validation

**Input Parameters**:
```javascript
{
  voice_file: string,                    // Audio URL (MP3, M4A, WAV)
  model: string,                         // "speech-02-turbo" or "speech-02-hd"
  accuracy: number,                      // 0-1, default 0.7
  need_noise_reduction: boolean,         // Remove background noise
  need_volume_normalization: boolean     // Normalize volume
}
```

**Requirements**:
- File format: MP3, M4A, or WAV
- Duration: 10 seconds to 5 minutes
- File size: Less than 20MB
- Quality: Clear speech, minimal background noise

**Output**: Returns a `voice_id` string to use with speech-02/speech-2.6 models

---

### Option C: Multilingual Excellence

#### 1. Primary TTS: **XTTS-v2**
- **Model**: `lucataco/xtts-v2`
- **Version ID**: `684bc3855b37866c0c65add2ff39c78f3dea3f4ff103a436465326e0f438d55e`
- **Run Count**: 4,442,070+ (3rd most popular)
- **Best For**: Multilingual voice cloning, global applications

**Features**:
- 17 languages supported
- One-shot voice cloning
- Audio cleanup option
- Works with short audio samples

**Supported Languages**:
English (en), Spanish (es), French (fr), German (de), Italian (it), Portuguese (pt), Polish (pl), Turkish (tr), Russian (ru), Dutch (nl), Czech (cs), Arabic (ar), Chinese (zh-cn), Japanese (ja), Hungarian (hu), Korean (ko), Hindi (hi)

**Input Parameters**:
```javascript
{
  text: string,              // Text to synthesize
  speaker: string,           // Audio file URL (wav, mp3, m4a, ogg, flv)
  language: string,          // Language code (e.g., "en", "es", "fr")
  cleanup_voice: boolean     // Apply denoising to speaker audio
}
```

**Pros**:
- ✅ 17 languages
- ✅ One-shot cloning (no training needed)
- ✅ 4.4M+ runs (proven)
- ✅ Audio cleanup built-in

**Cons**:
- ❌ No emotion control
- ❌ Older technology (2023)

**Use When**: You need multilingual support with voice cloning

---

## 🎯 Alternative Models

### **PlayHT Play-Dialog** (Conversational AI)
- **Model**: `playht/play-dialog`
- **Version ID**: `0d5710136b2204bb0a8b927a9e50904af22c2d238b813b7e0cdf8f17f12670f8`
- **Run Count**: 26,790+
- **Created**: January 13, 2025
- **Best For**: Natural conversational speech, dialogue systems

**Features**:
- Context-aware prosody and intonation
- Emotional expression
- Multi-turn dialogue support (2 voices)
- Temperature control for variance
- Voice conditioning control
- Supports multiple languages

**Input Parameters**:
```javascript
{
  text: string,                           // Text for speech generation
  voice: string,                          // Voice name (e.g., "Angelo")
  voice_2: string,                        // Optional second voice for dialogue
  speed: number,                          // 0.1 - 5.0
  temperature: number,                    // 0 - 2 (variance control)
  language: string,                       // Language code
  prompt: string,                         // Style guide for first voice
  prompt2: string,                        // Style guide for second voice
  turnPrefix: string,                     // Dialogue turn marker (e.g., "Voice 1:")
  turnPrefix2: string,                    // Second voice turn marker
  voice_conditioning_seconds: number,     // 1-60 seconds
  voice_conditioning_seconds_2: number,   // 1-60 seconds
  seed: number                            // For reproducibility
}
```

**Use When**: Building conversational AI, chatbots, dialogue systems

---

### **F5-TTS** (Open Source State-of-the-art)
- **Model**: `x-lance/f5-tts`
- **Version ID**: `87faf6dd7a692dd82043f662e76369cab126a2cf1937e25a9d41e0b834fd230e`
- **Run Count**: 32,144+
- **Best For**: Highest quality voice cloning, research projects

**Features**:
- State-of-the-art quality
- Reference audio cloning
- Speed control (0.1 - 3.0x)
- Automatic silence removal

**Input Parameters**:
```javascript
{
  gen_text: string,           // Text to generate
  ref_audio: string,          // Reference audio URL
  ref_text: string,           // Optional: Reference text transcript
  speed: number,              // 0.1 - 3.0
  remove_silence: boolean,    // Auto-remove silences
  custom_split_words: string  // Comma-separated custom splits
}
```

**Use When**: You need the absolute highest quality and don't mind complexity

---

### **Suno AI Bark** (Creative Audio)
- **Model**: `suno-ai/bark`
- **Run Count**: 302,026+
- **Best For**: Text-prompted generative audio with music and sound effects

**Features**:
- Speech synthesis
- Background music generation
- Sound effects
- Multiple speakers
- Multilingual

**Use When**: Creating rich audio content with music/effects, not just speech

---

### **Resemble AI Chatterbox** (Emotion Control + Cloning)
- **Model**: `resemble-ai/chatterbox`
- **Run Count**: 139,915+
- **Best For**: Expressive speech with emotion control

**Features**:
- Advanced emotion control
- Instant voice cloning from short audio
- Built-in watermarking
- Natural intonation

**Use When**: You need granular emotion control with voice cloning

---

## 📊 Model Comparison Matrix

| Model | Runs | Quality | Speed | Emotions | Voice Clone | Languages | Complexity | Cost |
|-------|------|---------|-------|----------|-------------|-----------|------------|------|
| **Kokoro-82M** | 56.7M | ⭐⭐⭐⭐⭐ | ⚡⚡⚡ | ❌ | ❌ Presets | 🌐 Multi | 🟢 Simple | 💰 Low |
| **Minimax 2.6 Turbo** | 2.5K | ⭐⭐⭐⭐ | ⚡⚡⚡ | ✅ | ✅ | 🌐🌐 50+ | 🟡 Medium | 💰💰 Med |
| **XTTS-v2** | 4.4M | ⭐⭐⭐⭐ | ⚡⚡ | ❌ | ✅ One-shot | 🌐 17 | 🟢 Simple | 💰 Low |
| **PlayHT Dialog** | 26.8K | ⭐⭐⭐⭐ | ⚡⚡ | ✅ | ✅ | 🌐 Multi | 🟡 Medium | 💰💰 Med |
| **F5-TTS** | 32.1K | ⭐⭐⭐⭐⭐ | ⚡ | ❌ | ✅ | 🌐 Multi | 🔴 Complex | 💰 Low |

---

## 🎯 Recommended Implementation Strategy

### **For VoiceCraft Production:**

#### **Phase 1: MVP (Quick Launch)**
Use **Kokoro-82M**:
- ✅ Most popular (56M+ runs = proven reliability)
- ✅ Simple API (only 3 parameters)
- ✅ Fast implementation
- ✅ Great quality
- ✅ Low cost
- ❌ No voice cloning (use preset voices)
- ❌ No emotion control

**Best for**: Getting to market fast with proven technology

#### **Phase 2: Advanced Features**
Upgrade to **Minimax Speech 2.6 Turbo + Voice Cloning**:
- ✅ Latest technology
- ✅ Emotion control
- ✅ Custom voice cloning
- ✅ 300+ voices
- ✅ Advanced parameters (pitch, volume, subtitles)

**Best for**: Differentiating with advanced features

#### **Phase 3: Multilingual Expansion**
Add **XTTS-v2** for international markets:
- ✅ 17 languages
- ✅ One-shot cloning
- ✅ 4.4M+ runs (proven)

**Best for**: Global expansion

---

## 💻 Implementation Code Examples

### Option A: Kokoro-82M (Simplest, Most Popular)

```typescript
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function generateSpeech(text: string, options = {}) {
  const output = await replicate.run(
    "jaaari/kokoro-82m:f559560eb822dc509045f3921a1921234918b91739db4bf3daab2169b71c7a13",
    {
      input: {
        text: text,
        voice: options.voice || "af_bella",  // af_bella, af_sarah, am_adam, etc.
        speed: options.speed || 1.0           // 0.1 - 5.0
      }
    }
  );

  return output; // URL to audio file
}
```

### Option B: Minimax 2.6 Turbo (Latest, Most Features)

```typescript
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function generateSpeech(text: string, options = {}) {
  const output = await replicate.run(
    "minimax/speech-2.6-turbo:24c0b2d2819faa5ce6eff09fc136c625e6e8c90e6f8a1cca75845f26fe9e1c4e",
    {
      input: {
        text: text,
        voice_id: options.voiceId || "Wise_Woman",
        emotion: options.emotion || "auto",
        speed: options.speed || 1.0,
        pitch: options.pitch || 0,
        volume: options.volume || 1.0,
        audio_format: "mp3",
        sample_rate: 32000,
        language_boost: options.language || "None",
        subtitle_enable: false,
        english_normalization: false
      }
    }
  );

  return output; // URL to audio file
}

// Voice Cloning
async function cloneVoice(audioFileUrl: string, options = {}) {
  const output = await replicate.run(
    "minimax/voice-cloning:fff8a670880f066d3742838515a88f7f0a3ae40a4f2e06dae0f7f70ba63582d7",
    {
      input: {
        voice_file: audioFileUrl,
        model: "speech-02-turbo",
        accuracy: options.accuracy || 0.7,
        need_noise_reduction: options.noiseReduction || false,
        need_volume_normalization: options.normalizeVolume || false
      }
    }
  );

  return output.voice_id;
}
```

### Option C: XTTS-v2 (Multilingual Cloning)

```typescript
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function generateSpeechWithCloning(text: string, speakerAudioUrl: string, language = "en") {
  const output = await replicate.run(
    "lucataco/xtts-v2:684bc3855b37866c0c65add2ff39c78f3dea3f4ff103a436465326e0f438d55e",
    {
      input: {
        text: text,
        speaker: speakerAudioUrl,
        language: language,        // en, es, fr, de, it, pt, pl, tr, ru, nl, cs, ar, zh-cn, ja, hu, ko, hi
        cleanup_voice: false
      }
    }
  );

  return output; // URL to audio file
}
```

---

## 🗄️ Database Schema

### Voice Clones Table
```sql
CREATE TABLE voice_clones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  voice_id VARCHAR(255) NOT NULL UNIQUE,
  model VARCHAR(50) DEFAULT 'minimax-2.6-turbo',  -- or 'kokoro-82m', 'xtts-v2'
  description TEXT,
  source_audio_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Generations Table
```sql
CREATE TABLE voice_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  voice_clone_id UUID REFERENCES voice_clones(id),
  input_text TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  duration_seconds DECIMAL(10, 2),
  character_count INTEGER,
  model_used VARCHAR(50),          -- 'kokoro-82m', 'minimax-2.6-turbo', etc.
  settings JSONB,                  -- Store speed, pitch, emotion, etc.
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 💰 Cost Estimation (Approximate)

### Per-Character Pricing

| Model | Cost per 1K chars | Notes |
|-------|-------------------|-------|
| Kokoro-82M | ~$0.05 | Most economical |
| Minimax 2.6 Turbo | ~$0.10 | Real-time optimized |
| Minimax 2.6 HD | ~$0.15 | Studio quality |
| XTTS-v2 | ~$0.08 | Multilingual |
| PlayHT Dialog | ~$0.12 | Conversational AI |
| Voice Cloning | ~$0.20 per clone | One-time cost |

### Monthly Cost Examples

| Plan | Characters | Clones | Model | API Cost | Markup (3x) | Total Price |
|------|-----------|--------|-------|----------|-------------|-------------|
| **Free** | 5,000 | 0 | Kokoro | $0.25 | - | **Free** |
| **Starter** | 10,000 | 1 | Kokoro | $0.70 | - | **$0** (promo) |
| **Pro** | 100,000 | 5 | Minimax 2.6 | $11.00 | 3x | **$29/mo** |
| **Enterprise** | 1M+ | Unlimited | Minimax 2.6 | $100+ | 2-3x | **Custom** |

---

## 🏗️ Implementation Architecture

### Phase 1: Simple TTS (Kokoro-82M)
```
User Input (Text)
    → Kokoro-82M
    → MP3 Audio Output
```

### Phase 2: Advanced TTS (Minimax 2.6 Turbo)
```
User Input (Text + Emotion + Settings)
    → Minimax Speech 2.6 Turbo
    → MP3 Audio Output with Subtitles
```

### Phase 3: Voice Cloning
```
User Audio Upload
    → Minimax Voice Cloning
    → voice_id generated
    → Store voice_id in database
    → Use voice_id with Speech 2.6 Turbo
    → Custom Voice MP3 Output
```

---

## 🎭 Available Emotions (Minimax)

- `auto` - Automatic emotion detection
- `happy` - Happy/joyful
- `sad` - Sad/melancholic
- `angry` - Angry/frustrated
- `excited` - Excited/enthusiastic
- `calm` - Calm/relaxed
- `serious` - Serious/professional
- `friendly` - Friendly/warm

---

## 🌍 Supported Languages

### Minimax Speech 2.6 (50+ languages)
Supports major world languages with language_boost parameter

### XTTS-v2 (17 languages explicitly)
English, Spanish, French, German, Italian, Portuguese, Polish, Turkish, Russian, Dutch, Czech, Arabic, Chinese, Japanese, Hungarian, Korean, Hindi

---

## 🔒 Security Considerations

1. **API Key Storage**: Never expose Replicate API key to client
2. **Rate Limiting**: Implement per-user rate limits
3. **File Upload Validation**:
   - Check file type, size, duration
   - Scan for malicious content
4. **Audio Storage**:
   - Use signed URLs with expiration
   - Implement CDN for delivery
5. **Voice Clone Ownership**:
   - Verify user owns audio for cloning
   - Implement DMCA takedown process
6. **Content Moderation**:
   - Filter inappropriate text input
   - Flag suspicious voice cloning attempts

---

## ⚡ Performance Optimization

1. **Caching**:
   - Cache generated audio for identical inputs
   - Cache voice_id lookups
   - Use CDN for audio delivery

2. **Async Processing**:
   - Queue long-running voice cloning jobs
   - Send webhook/email when complete
   - Show progress indicators

3. **Model Selection**:
   - Use Kokoro-82M for simple use cases (fastest)
   - Use Minimax 2.6 Turbo for advanced features
   - Use XTTS-v2 for multilingual

---

## 📝 Preset Voices

### Kokoro-82M
- `af_bella` - Female voice
- `af_sarah` - Female voice
- `am_adam` - Male voice
- (Additional voices available)

### Minimax
- `Wise_Woman` - Default female voice
- 300+ additional voices available via API

---

## ✅ Testing Checklist

### Voice Generation
- [ ] Generate speech with Kokoro-82M
- [ ] Generate speech with Minimax 2.6
- [ ] Test all emotion settings (Minimax)
- [ ] Test speed range (0.5x - 2.0x)
- [ ] Test pitch range (-12 to +12)
- [ ] Test multiple languages
- [ ] Test character limit (10,000)
- [ ] Test audio formats (MP3, WAV)

### Voice Cloning
- [ ] Upload valid audio file (10s-5min)
- [ ] Test noise reduction
- [ ] Test volume normalization
- [ ] Clone voice and verify voice_id
- [ ] Generate speech with cloned voice
- [ ] Test file size limit (20MB)
- [ ] Test invalid file formats

### Performance
- [ ] Measure API response times
- [ ] Test concurrent requests
- [ ] Verify audio file delivery
- [ ] Test error recovery

---

## 📚 API Endpoints

### POST /api/voices/generate
Generate speech from text

```typescript
{
  text: string,
  model?: "kokoro" | "minimax-2.6" | "xtts-v2",
  voiceId?: string,
  emotion?: string,
  speed?: number,
  pitch?: number,
  volume?: number
}
```

### POST /api/voices/clone
Clone a voice from audio file

```typescript
{
  audioFileUrl: string,
  name: string,
  model: "minimax" | "xtts-v2",
  description?: string,
  noiseReduction?: boolean,
  normalizeVolume?: boolean
}
```

### GET /api/voices/my-clones
Get all voice clones for authenticated user

### DELETE /api/voices/clone/:id
Delete a voice clone

---

## 🎯 Final Recommendations

### **Start with Kokoro-82M**
- Most popular (56.7M runs)
- Proven at scale
- Simple to implement
- Fast launch

### **Upgrade to Minimax 2.6 when you need:**
- Emotion control
- Voice cloning
- Advanced parameters
- Subtitles

### **Add XTTS-v2 for:**
- International markets
- Multilingual support
- One-shot cloning

### **Consider PlayHT Dialog for:**
- Conversational AI
- Chatbots
- Dialogue systems

---

## 📖 Resources

- [Kokoro-82M on Replicate](https://replicate.com/jaaari/kokoro-82m)
- [Minimax Speech 2.6 Turbo](https://replicate.com/minimax/speech-2.6-turbo)
- [XTTS-v2 on Replicate](https://replicate.com/lucataco/xtts-v2)
- [PlayHT Play-Dialog](https://replicate.com/playht/play-dialog)
- [Replicate API Documentation](https://replicate.com/docs)
- [Replicate Node.js SDK](https://github.com/replicate/replicate-javascript)

---

## 📞 Support

- **Replicate Discord**: https://discord.gg/replicate
- **Replicate Support**: support@replicate.com
- **GitHub Issues**: Create issues in project repo

---

**Last Updated**: November 8, 2025
**Data Source**: Replicate API (live data)
