# 🏗️ VoiceCraft Architecture

**Last Updated:** 2025-11-09

This document describes the system architecture, design patterns, and core concepts of VoiceCraft.

---

## 📑 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Layers](#architecture-layers)
3. [Core Concepts](#core-concepts)
4. [Data Flow](#data-flow)
5. [External Services](#external-services)
6. [Authentication & Authorization](#authentication--authorization)
7. [File Storage Strategy](#file-storage-strategy)
8. [Async Job Processing](#async-job-processing)
9. [Error Handling](#error-handling)
10. [Performance Optimization](#performance-optimization)

---

## System Overview

VoiceCraft is a full-stack AI voice synthesis platform built with a modern, scalable architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                         │
│  Next.js 16 App Router · React Server Components · shadcn/ui │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      API Route Layer                          │
│      Next.js API Routes · Zod Validation · Type Safety       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Business Logic                           │
│         Service Layer · Domain Models · Use Cases            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                             │
│          Prisma ORM · PostgreSQL · Type Generation           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    External Services                          │
│  Replicate · OpenAI · Vercel Blob · Stripe · Email Service   │
└─────────────────────────────────────────────────────────────┘
```

### Design Philosophy

1. **Type Safety First** - Zero `any` types, full TypeScript strict mode
2. **Server-First Architecture** - Leverage React Server Components for data fetching
3. **Progressive Enhancement** - Client components only when needed for interactivity
4. **API-Driven** - All operations through validated API routes
5. **Async by Default** - Non-blocking operations for AI services
6. **Fail Gracefully** - Comprehensive error handling with user-friendly messages

---

## Architecture Layers

### 1. Frontend Layer

**Technology:** Next.js 16 App Router, React 19, shadcn/ui

**Components:**
- **Server Components** (Default) - Data fetching, static rendering
- **Client Components** (`"use client"`) - Interactivity, state management
- **UI Components** - Reusable shadcn/ui primitives with Brutalist design

**Patterns:**

```typescript
// ✅ Server Component - Direct data access
export default async function AudiosPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const response = await fetch(`${baseUrl}/api/audios`, {
    cache: 'no-store',
  })
  const data = await response.json()

  return <AudioList audios={data.audios} />
}

// ✅ Client Component - Interactivity
"use client"
export function AudioPlayer({ audioUrl }: Props) {
  const [playing, setPlaying] = useState(false)
  // Interactive logic
}
```

### 2. API Route Layer

**Technology:** Next.js API Routes, Zod validation

**Responsibilities:**
- Request validation with Zod schemas
- Authentication & authorization checks
- Business logic orchestration
- Response formatting
- Error handling

**Standard API Pattern:**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// 1. Define Zod schema
const CreateSchema = z.object({
  field: z.string().min(1),
  optional: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // 2. Parse and validate
    const body = await request.json()
    const data = CreateSchema.parse(body)

    // 3. Authenticate (TODO: implement)
    const userId = 'temp-user-id'

    // 4. Business logic
    const result = await prisma.model.create({
      data: { ...data, userId }
    })

    // 5. Return success
    return NextResponse.json({ success: true, result })

  } catch (error) {
    // 6. Handle errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation failed',
        details: error.issues
      }, { status: 400 })
    }

    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}
```

### 3. Data Layer

**Technology:** Prisma ORM, PostgreSQL

**Database Structure:**
- **Users** - Authentication, profiles, subscriptions
- **Voices** - Cloned voice metadata and Replicate integration
- **VoiceGenerations** - Track all voice synthesis jobs
- **Audios** - Generated and uploaded audio files
- **Projects** - Organize audios, get estimates, assign experts
- **Subscriptions** - Stripe integration for billing
- **ExpertProfiles** - Marketplace for human audio editors

**Key Relationships:**

```prisma
User ─┬─> Voice (1:n)
      ├─> VoiceGeneration (1:n)
      ├─> Audio (1:n)
      ├─> Project (1:n)
      ├─> Subscription (1:1)
      └─> ExpertProfile (1:1)

Project ─┬─> ProjectAudio (1:n) ─> Audio
         └─> ExpertProfile (n:1)

Voice ─> VoiceGeneration (1:n)
```

See [DATABASE.md](DATABASE.md) for complete schema details.

---

## Core Concepts

### Voice Cloning & Generation

VoiceCraft uses a two-step process for custom voice creation:

#### 1. Voice Cloning (Training)

```
User Upload → Vercel Blob → Replicate Training → Voice Model → Database
```

**Process:**
1. User uploads 10+ seconds of clean audio samples
2. Audio stored in Vercel Blob with public access
3. Replicate API creates voice clone (async job)
4. Voice metadata saved to `Voice` table with status tracking
5. Webhook updates status when training completes

**Model:** Replicate voice cloning models (TBD based on provider)

**Database Records:**
```typescript
Voice {
  id: string           // Database ID
  userId: string       // Owner
  voiceId: string?     // Replicate voice_id
  name: string         // Display name
  status: VoiceStatus  // pending | training | active | failed
  sampleAudioUrl: string
  language: string
  gender: string
  isCloned: true
}
```

#### 2. Voice Generation (Synthesis)

```
Text Input → API Validation → Replicate Generation → Audio URL → Database
```

**Process:**
1. User provides text + voice selection (preset or custom)
2. API validates character limits and voice ownership
3. Replicate Minimax Speech-02-Turbo generates audio
4. Returns audio URL (Replicate-hosted)
5. Optionally creates `VoiceGeneration` record for tracking

**API Endpoint:** `/api/voices/generate`

**Model Configuration:**
- **Model:** `minimax/speech-02-turbo`
- **Version:** `e2e8812b45eefa93b20990418480fe628ddce470f9b72909a175d65e288ff3d5`
- **Character Limit:** 10,000 per generation
- **Parameters:** emotion, speed, pitch, volume, audio format, sample rate

**Input Example:**
```typescript
{
  text: "Hello world!",
  voiceId: "Wise_Woman", // or custom voice ID
  userId: "user_123",
  emotion: "auto",
  speed: 1.0,
  pitch: 0,
  volume: 1.0,
  audioFormat: "mp3",
  sampleRate: 32000
}
```

### Project Management

Projects organize related audio files and enable AI-powered estimation and expert assignment.

#### Project Lifecycle

```
Draft → Estimating → Ready → In Progress → Completed
  ↓         ↓          ↓           ↓            ↓
Create   OpenAI   Assign    Expert    Expert
         API      Expert   Working   Delivers
```

**Status States:**
- **draft** - Initial creation, adding audios
- **estimating** - AI generating cost/time estimates
- **ready** - Estimated, ready for expert assignment
- **in_progress** - Expert actively working
- **completed** - Work finished, deliverables ready
- **cancelled** - Project abandoned

#### AI Estimation

**Endpoint:** `/api/projects/[id]/estimate`

**Process:**
1. Gather project metadata (name, description, audio list)
2. Call OpenAI API with structured prompt
3. Parse JSON response with cost and duration
4. Update project record with estimates

**OpenAI Prompt Structure:**
```typescript
const prompt = `
You are an audio production cost estimator...

Project: ${name}
Description: ${description}
Audios:
${audioList}

Return JSON:
{
  "estimatedCost": <number>,
  "estimatedDuration": <number>,
  "breakdown": {...}
}
`
```

### Credit System

Users purchase credits for voice operations:

**Credit Costs:**
- **Voice Cloning** - TBD credits per voice
- **Voice Generation** - Credits based on character count
- **Premium Features** - Variable credit cost

**Credit Flow:**
```
Purchase → Stripe → Webhook → Add Credits → User Balance
Usage → API Call → Deduct Credits → Update Balance
```

### Expert Marketplace

Connect users with professional audio editors:

**Expert Profile:**
```typescript
ExpertProfile {
  userId: string        // Links to User account
  hourlyRate: number    // USD per hour
  specialties: string[] // "voice acting", "editing", etc.
  rating: number        // 0-5 stars
  availability: string  // "available" | "busy" | "offline"
}
```

**Assignment Flow:**
1. User creates project with audios
2. Requests AI estimate (optional)
3. Browses expert profiles
4. Assigns expert to project
5. Expert completes work
6. User reviews and pays

---

## Data Flow

### Voice Generation Flow

```
┌─────────┐     ┌─────────┐     ┌──────────┐     ┌─────────┐
│ User UI │────>│ API     │────>│ Replicate│────>│ Audio   │
│         │     │ Route   │     │ API      │     │ Storage │
└─────────┘     └─────────┘     └──────────┘     └─────────┘
     ↑                │                │                │
     │                ↓                │                │
     │          ┌──────────┐           │                │
     │          │ Database │<──────────┴────────────────┘
     │          │          │
     └──────────│ Prisma   │
                └──────────┘
```

**Steps:**
1. User submits text + voice selection
2. API validates input with Zod
3. Checks voice ownership (if custom)
4. Calls Replicate API
5. Saves generation record to DB
6. Returns audio URL to user

### File Upload Flow

```
┌─────────┐     ┌─────────┐     ┌────────────┐     ┌──────────┐
│ User UI │────>│ API     │────>│ Vercel     │────>│ Database │
│ (Form)  │     │ Route   │     │ Blob       │     │          │
└─────────┘     └─────────┘     └────────────┘     └──────────┘
                      │                 │                 │
                      │                 │                 │
                      ↓                 ↓                 ↓
                 Validate         Upload File       Save Record
                 File Type        Get URL           with URL
```

**Steps:**
1. User selects audio file (50MB max)
2. API validates file type and size
3. Uploads to Vercel Blob
4. Creates `Audio` record with blob URL
5. Returns audio metadata to user

---

## External Services

### Replicate API

**Purpose:** AI voice cloning and generation

**Models Used:**
- **Minimax Speech-02-Turbo** - Voice synthesis
- **Voice Cloning Models** - Custom voice training (TBD)

**Integration:**
```typescript
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

const output = await replicate.run(
  "minimax/speech-02-turbo:e2e8812b...",
  { input: { text, voice_id, emotion, ... } }
)
```

**Environment Variables:**
- `REPLICATE_API_TOKEN` - API authentication

**Error Handling:**
- Rate limiting (429 responses)
- Model errors (validation failures)
- Network timeouts

### OpenAI API

**Purpose:** Project cost and duration estimation

**Integration:**
```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: prompt }],
  response_format: { type: "json_object" },
})
```

**Environment Variables:**
- `OPENAI_API_KEY` - API authentication

### Vercel Blob

**Purpose:** Audio file storage

**Integration:**
```typescript
import { put } from '@vercel/blob'

const blob = await put(
  `audios/${userId}/${timestamp}-${filename}`,
  file,
  { access: 'public', addRandomSuffix: true }
)
```

**Storage Structure:**
```
audios/
  {userId}/
    {timestamp}-{filename}-{random}.mp3
    {timestamp}-{filename}-{random}.wav
```

**Environment Variables:**
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob access token

**Access Control:**
- Public read access (all audio files)
- Authenticated write access (API routes only)

### Stripe

**Purpose:** Payment processing and subscription management

**Integration:** (To be implemented)

**Features:**
- Credit purchases
- Subscription billing
- Webhook handling for payment events

**Environment Variables:**
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

---

## Authentication & Authorization

**Current Status:** ⚠️ Authentication not yet implemented

**Planned Implementation:**
- NextAuth.js for authentication
- OAuth providers (Google, GitHub)
- Email/password authentication
- Session management with JWT

**Temporary Pattern:**
```typescript
// TODO: Replace with actual session
const userId = 'temp-user-id'
```

**Authorization Rules:**
- Users can only access their own resources
- Admins can access all resources
- Experts can access assigned projects

---

## File Storage Strategy

### Audio Files

**Storage Provider:** Vercel Blob

**Naming Convention:**
```
audios/{userId}/{timestamp}-{originalFilename}-{random}.{ext}
```

**File Types Supported:**
- MP3 (audio/mpeg)
- WAV (audio/wav)
- OGG (audio/ogg)
- WebM (audio/webm)

**Size Limits:**
- Upload: 50MB max
- Generation: Depends on Replicate limits

**Access Pattern:**
- All files stored with public read access
- URLs returned in API responses
- No authentication required for playback

### Voice Sample Files

**Storage:** Same Vercel Blob storage

**Purpose:**
- Training data for voice cloning
- Preview audio for voice library

**Retention:**
- Kept indefinitely while voice is active
- Deleted when voice is deleted

---

## Async Job Processing

### Voice Cloning Jobs

**Problem:** Voice cloning takes 5-30 minutes

**Solution:** Webhook-based async pattern

```
1. API creates Voice record (status: pending)
2. Starts Replicate training job
3. Returns Voice ID immediately
4. Replicate sends webhook when complete
5. Webhook handler updates Voice status
6. User polls or receives notification
```

**Database Tracking:**
```typescript
Voice {
  status: VoiceStatus // pending | training | active | failed
  createdAt: DateTime
  completedAt: DateTime?
  errorMessage: String?
}
```

### Voice Generation Jobs

**Problem:** Generation takes 5-30 seconds

**Solution:** Synchronous API with timeout

```
1. API calls Replicate
2. Waits for response (up to 60s)
3. Returns audio URL immediately
4. For longer jobs, switch to async pattern
```

**Database Tracking:**
```typescript
VoiceGeneration {
  status: GenerationStatus // processing | completed | failed
  createdAt: DateTime
  completedAt: DateTime?
}
```

---

## Error Handling

### API Error Response Format

```typescript
{
  error: string           // Human-readable message
  details?: any           // Additional context
  code?: string           // Error code for client logic
  retryAfter?: number     // Seconds to wait (rate limiting)
}
```

### Error Categories

**1. Validation Errors (400)**
```typescript
// Zod validation failed
{
  error: "Validation failed",
  details: [
    { field: "text", message: "Text is required" }
  ]
}
```

**2. Authentication Errors (401)**
```typescript
{
  error: "Unauthorized",
  details: "Please sign in to continue"
}
```

**3. Authorization Errors (403)**
```typescript
{
  error: "Forbidden",
  details: "You don't have access to this resource"
}
```

**4. Not Found Errors (404)**
```typescript
{
  error: "Not found",
  details: "Voice not found"
}
```

**5. Rate Limiting (429)**
```typescript
{
  error: "Rate limit exceeded",
  retryAfter: 60
}
```

**6. External Service Errors (502)**
```typescript
{
  error: "Service unavailable",
  details: "Voice generation service is temporarily unavailable"
}
```

**7. Internal Errors (500)**
```typescript
{
  error: "Internal server error",
  message: process.env.NODE_ENV === 'development' ? error.message : undefined
}
```

### Error Logging

**Development:**
```typescript
console.error('Detailed error:', error)
```

**Production:**
```typescript
// TODO: Integrate Sentry or similar
// - Log full error details
// - Include user context
// - Track error frequency
// - Alert on critical errors
```

---

## Performance Optimization

### Database Queries

**Optimization Strategies:**

1. **Select Only Needed Fields**
```typescript
// ❌ Bad - fetches all fields
const user = await prisma.user.findUnique({ where: { id } })

// ✅ Good - select specific fields
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, name: true, email: true }
})
```

2. **Include Related Data**
```typescript
// ❌ Bad - N+1 query problem
const voices = await prisma.voice.findMany()
for (const voice of voices) {
  const user = await prisma.user.findUnique({ where: { id: voice.userId } })
}

// ✅ Good - single query with include
const voices = await prisma.voice.findMany({
  include: { user: true }
})
```

3. **Use Pagination**
```typescript
const audios = await prisma.audio.findMany({
  take: 20,
  skip: page * 20,
  orderBy: { createdAt: 'desc' }
})
```

4. **Add Database Indexes**
```prisma
model Voice {
  userId String
  status VoiceStatus

  @@index([userId])
  @@index([status])
  @@index([userId, status])
}
```

### Caching Strategy

**Server Components:**
```typescript
// Revalidate every 60 seconds
const response = await fetch(url, {
  next: { revalidate: 60 }
})

// Never cache (always fresh)
const response = await fetch(url, {
  cache: 'no-store'
})
```

**API Routes:**
```typescript
// TODO: Implement Redis caching for:
// - User credit balances
// - Voice library listings
// - Project listings
```

### Code Splitting

**Automatic (Next.js App Router):**
- Each page automatically code-split
- Shared components bundled separately
- Dynamic imports for heavy components

**Manual Dynamic Imports:**
```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false
})
```

### Image Optimization

**Always Use Next.js Image:**
```typescript
import Image from 'next/image'

<Image
  src="/avatar.jpg"
  alt="User avatar"
  width={40}
  height={40}
  priority={false} // Only for above-fold images
/>
```

### Bundle Size

**Monitor Bundle:**
```bash
ANALYZE=true npm run build
```

**Keep Bundle Small:**
- Tree-shake unused code
- Use barrel exports carefully
- Lazy load heavy dependencies
- Use server components when possible

---

## Future Architecture Improvements

### 1. Background Job Queue

**Problem:** Long-running tasks block API responses

**Solution:** Redis-based job queue (BullMQ)

```typescript
import { Queue } from 'bullmq'

const voiceQueue = new Queue('voice-cloning', {
  connection: { host: 'localhost', port: 6379 }
})

await voiceQueue.add('clone-voice', {
  userId,
  audioUrl,
  voiceName
})
```

### 2. Real-time Updates

**Problem:** Users must poll for job status

**Solution:** WebSocket or Server-Sent Events

```typescript
// Server
const stream = new ReadableStream({
  start(controller) {
    // Send updates
  }
})

// Client
const eventSource = new EventSource('/api/voices/status')
eventSource.onmessage = (event) => {
  const status = JSON.parse(event.data)
}
```

### 3. CDN for Audio Files

**Problem:** Vercel Blob may be slow for global users

**Solution:** CloudFront or Cloudflare CDN

```typescript
const cdnUrl = `https://cdn.voicecraft.com/audios/${filename}`
```

### 4. Rate Limiting

**Problem:** No protection against abuse

**Solution:** Redis-based rate limiter

```typescript
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10s')
})

const { success } = await ratelimit.limit(userId)
if (!success) {
  return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
}
```

### 5. Analytics & Monitoring

**Implement:**
- Sentry for error tracking
- Vercel Analytics for performance
- PostHog for user behavior
- Custom dashboards for business metrics

---

## Related Documentation

- [DATABASE.md](DATABASE.md) - Detailed schema and migrations
- [API.md](API.md) - API endpoints reference
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment guide
- [DEVELOPMENT.md](DEVELOPMENT.md) - Local development workflow

---

**Questions?** See [CONTRIBUTING.md](CONTRIBUTING.md) for how to get help.
