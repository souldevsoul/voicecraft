# VoiceCraft - Complete User Flows & Technical Specifications

## Table of Contents
1. [Dashboard Pages Overview](#dashboard-pages-overview)
2. [User Flow: Dashboard Home](#user-flow-dashboard-home)
3. [User Flow: Audio Management](#user-flow-audio-management)
4. [User Flow: Voice Cloning](#user-flow-voice-cloning)
5. [User Flow: Project Management](#user-flow-project-management)
6. [Replicate Models & Parameters](#replicate-models--parameters)
7. [Vercel Blob Storage](#vercel-blob-storage)
8. [Database Schema](#database-schema)
9. [API Endpoints](#api-endpoints)

---

## Dashboard Pages Overview

### `/dashboard` - Dashboard Home
- **Summary cards**: Total audios, total voices, total projects, credits remaining
- **Recent audios**: Last 5-10 generated audios with play buttons
- **Quick actions**: "Generate Audio", "Clone Voice", "Create Project"
- **Credits display**: Prominent credits counter with "Add Credits" button
- **Shadcn components**: Card, Button, Badge, Table (for recent audios)

### `/dashboard/audios` - Audio Library
- **Layout**: File manager style using Shadcn Table/DataTable
- **Features**:
  - List view with columns: Preview, Name, Voice Used, Duration, Date, Actions
  - Play/pause inline audio player
  - Search & filter (by voice, date range)
  - Bulk select for adding to projects
  - "Generate New" button
  - "Upload Audio" button (for user-uploaded files)
- **Actions per audio**:
  - Play/pause
  - Download
  - Add to project
  - Rename
  - Delete
- **Shadcn components**: DataTable, Dialog (for generate form), DropdownMenu, Badge

### `/dashboard/voices` - Voice Library
- **Layout**: Grid or list view of cloned voices
- **Features**:
  - Voice cards showing: Voice name, Sample audio player, Clone date, Usage count
  - "Clone New Voice" button
  - Search voices by name
  - Delete voice (with confirmation)
- **Voice card**:
  - Name & description
  - Preview audio player (the sample used for cloning)
  - "Use for Generation" button → redirects to /audios with voice pre-selected
  - Edit metadata (name, description)
  - Delete
- **Shadcn components**: Card, Dialog (for clone form), AlertDialog (delete confirm), Button

### `/dashboard/projects` - Project Management
- **Layout**: Kanban board (Shadcn Sortable or custom) OR DataTable with status badges
- **Columns** (Kanban):
  1. **Draft** - Projects being created
  2. **Ready for Estimation** - Projects with audios but not estimated
  3. **Estimated** - AI estimated, ready to assign
  4. **Assigned** - Assigned to expert, in review
  5. **Completed** - Expert finished review
- **Project card** (in kanban):
  - Project name
  - Number of audios badge
  - Status badge
  - Assigned expert avatar (if assigned)
  - Click opens Shadcn Drawer
- **Actions**:
  - "Create New Project" button
  - Filter by status
  - Search projects
- **Shadcn components**: Sheet (Drawer), Card, Badge, Button, Tabs

---

## User Flow: Dashboard Home

```
User lands on /dashboard
├─> Sees summary cards (4 cards in grid)
│   ├─> Total Audios: 127
│   ├─> Cloned Voices: 5
│   ├─> Active Projects: 3
│   └─> Credits: 2,450
├─> Recent Audios table (last 10)
│   ├─> Columns: Preview (play button), Name, Voice, Duration, Date
│   └─> Click "View All" → /dashboard/audios
└─> Quick Actions buttons
    ├─> "Generate Audio" → Opens dialog with TTS form
    ├─> "Clone Voice" → /dashboard/voices (opens clone dialog)
    └─> "Create Project" → /dashboard/projects/new
```

### Technical Implementation
- **Components**: StatsCard, RecentAudiosTable, QuickActionButtons
- **API Calls**:
  - `GET /api/stats` → { totalAudios, totalVoices, totalProjects, credits }
  - `GET /api/audios?limit=10&sort=createdAt:desc` → Recent audios
- **State**: React Query for data fetching, audio player state

---

## User Flow: Audio Management

### Flow 1: Generate Audio

```
User clicks "Generate Audio" (from dashboard or /dashboard/audios)
├─> Shadcn Dialog opens with form
├─> User fills form:
│   ├─> Text input (max 10,000 chars) with character counter
│   ├─> Voice selector (dropdown or combobox)
│   │   ├─> Shows preset voices (Wise_Woman, etc.)
│   │   └─> Shows user's cloned voices (with custom badge)
│   ├─> Advanced settings (Accordion):
│   │   ├─> Emotion (auto, happy, sad, angry, calm, etc.)
│   │   ├─> Speed slider (0.5x - 2.0x)
│   │   ├─> Pitch slider (-12 to +12 semitones)
│   │   ├─> Audio format (mp3, wav, flac)
│   │   └─> Sample rate (16k, 24k, 32k, 44.1k)
│   └─> Name (optional, auto-generated if empty)
├─> User clicks "Generate"
├─> API call to POST /api/voices/generate
│   ├─> Shows loading state (Progress bar or spinner)
│   └─> Uses Replicate minimax/speech-02-turbo
├─> Replicate returns audio URL
├─> API uploads to Vercel Blob
├─> Saves to database with Blob URL
├─> Shows success toast
└─> Audio appears in table with play button
```

**Form Validation (Zod)**:
```typescript
{
  text: string (1-10000 chars),
  voiceId: string (preset or cloned voice ID),
  name?: string,
  emotion?: enum,
  speed?: number (0.5-2.0),
  pitch?: number (-12 to 12),
  audioFormat?: enum (mp3, wav, flac),
  sampleRate?: enum (16000, 24000, 32000, 44100)
}
```

### Flow 2: Upload Audio

```
User clicks "Upload Audio" in /dashboard/audios
├─> Shadcn Dialog opens with dropzone
├─> User drags/selects audio file
│   ├─> Accepts: .mp3, .wav, .m4a, .flac
│   └─> Max size: 50MB
├─> File uploads to Vercel Blob
├─> Shows upload progress
├─> User adds metadata:
│   ├─> Name (required)
│   ├─> Description (optional)
│   └─> Tags (optional)
├─> Saves to database
│   ├─> audioUrl: Vercel Blob URL
│   ├─> source: "upload"
│   └─> userId, name, metadata
└─> Audio appears in table
```

### Flow 3: Add Audio to Project

```
User selects audio(s) from table (checkbox)
├─> "Add to Project" button appears in toolbar
├─> User clicks "Add to Project"
├─> Shadcn Combobox/Select opens
│   ├─> Lists user's projects (draft or estimated status only)
│   └─> "Create New Project" option
├─> User selects project
├─> API call: POST /api/projects/[id]/audios
│   └─> Body: { audioIds: [...] }
└─> Shows success toast
```

---

## User Flow: Voice Cloning

### Flow: Clone Voice from Audio Sample

```
User navigates to /dashboard/voices
├─> Clicks "Clone New Voice" button
├─> Shadcn Dialog opens with clone form
├─> User fills form:
│   ├─> Upload audio sample (Dropzone)
│   │   ├─> Accepts: .mp3, .wav, .m4a
│   │   ├─> Min duration: 10 seconds
│   │   ├─> Max duration: 5 minutes
│   │   └─> Max size: 20MB
│   ├─> Voice name (required)
│   ├─> Description (optional)
│   └─> Advanced options (Accordion):
│       ├─> Enable noise reduction (checkbox)
│       ├─> Enable volume normalization (checkbox)
│       └─> Target model (speech-02-turbo or speech-02-hd)
├─> User clicks "Clone Voice"
├─> File uploads to Vercel Blob first
├─> API call: POST /api/voices/clone
│   ├─> Body: { name, description, audioFileUrl (Blob), model, noise_reduction, volume_normalization }
│   ├─> Shows loading state (can take 30-60 seconds)
│   └─> Status changes: uploading → processing → ready
├─> Replicate voice-cloning model processes
│   ├─> Returns: { voice_id, preview_audio_url }
│   └─> API saves to database
├─> Database record:
│   ├─> voiceId: Replicate voice_id
│   ├─> sampleAudioUrl: Vercel Blob URL
│   ├─> status: "active"
│   └─> model: "speech-02-turbo"
├─> Shows success toast with preview audio player
└─> Voice appears in voices table
```

**Important**: The cloned voice's `voice_id` from Replicate is stored in database and used for all future TTS generations.

---

## User Flow: Project Management

### Flow 1: Create Project

```
User clicks "Create New Project"
├─> Shadcn Dialog opens with project form
├─> User fills form:
│   ├─> Project name (required)
│   ├─> Description (optional, textarea)
│   └─> Initial audios (optional, multi-select from existing audios)
├─> User clicks "Create Project"
├─> API call: POST /api/projects
│   └─> Body: { name, description, audioIds?: [...] }
├─> Database creates:
│   ├─> Project record (status: "draft")
│   └─> ProjectAudio junction records
├─> Project card appears in "Draft" column
└─> Redirects to project drawer OR /dashboard/projects
```

### Flow 2: Add Audios to Project

```
User opens project (clicks card in kanban)
├─> Shadcn Sheet (drawer) slides from right
├─> Drawer shows:
│   ├─> Project name & description (editable)
│   ├─> Status badge
│   ├─> List of audios (with play buttons, reorderable)
│   └─> "Add More Audios" button
├─> User clicks "Add More Audios"
├─> Combobox shows available audios (not already in project)
├─> User selects audio(s)
├─> API call: POST /api/projects/[id]/audios
├─> Audios added to project
└─> Drawer updates with new audios
```

### Flow 3: Get AI Estimation

```
User has project with audios (status: "draft")
├─> User clicks "Get Estimation" button in drawer
├─> API call: POST /api/projects/[id]/estimate
│   ├─> Backend calls OpenAI API
│   ├─> Sends project data:
│   │   ├─> Project name & description
│   │   ├─> Number of audios
│   │   ├─> Total duration of all audios
│   │   ├─> Audio metadata (voices used, text content?)
│   │   └─> User's instructions (if any)
│   └─> OpenAI returns estimation:
│       ├─> Estimated time (minutes)
│       ├─> Complexity level (simple, medium, complex)
│       ├─> Suggested expert type (audio editor, voice director, QA specialist)
│       └─> Estimated cost ($)
├─> Estimation saves to database
├─> Project status changes: "draft" → "estimated"
├─> Drawer shows estimation results:
│   ├─> Time: "~45 minutes"
│   ├─> Complexity: Badge "Medium"
│   ├─> Suggested Expert: "Voice Director"
│   └─> Cost: "$35.00"
├─> Kanban card moves to "Estimated" column
└─> "Assign to Expert" button enabled
```

**OpenAI Prompt Example**:
```
You are an expert project estimator for audio production projects.

Given the following project:
- Name: {projectName}
- Description: {projectDescription}
- Number of audio files: {audioCount}
- Total duration: {totalDuration} minutes
- Voices used: {voicesList}

Estimate:
1. Time needed for expert review (in minutes)
2. Complexity level (simple, medium, complex)
3. Suggested expert type (audio_editor, voice_director, qa_specialist)
4. Estimated cost based on $1/minute of audio

Return JSON format:
{
  "estimatedTime": number,
  "complexity": string,
  "suggestedExpert": string,
  "estimatedCost": number
}
```

### Flow 4: Assign to Expert

```
User has estimated project
├─> User clicks "Assign to Expert" in drawer
├─> Form appears in drawer:
│   ├─> Expert selector (Combobox)
│   │   ├─> Lists available experts (from database)
│   │   └─> Shows expert specialty, rating, availability
│   └─> Instructions textarea (required)
│       └─> Placeholder: "e.g., Review these audios and check for audio quality, pacing, and pronunciation"
├─> User selects expert and enters instructions
├─> User clicks "Assign"
├─> API call: POST /api/projects/[id]/assign
│   └─> Body: { expertId, instructions }
├─> Database updates:
│   ├─> expertId saved
│   ├─> instructions saved
│   ├─> status: "estimated" → "assigned"
│   └─> assignedAt timestamp
├─> Email sent to expert (optional)
├─> Project card moves to "Assigned" column
└─> Drawer shows expert info and status
```

### Flow 5: View Project in Kanban

```
User in /dashboard/projects
├─> Sees kanban board with 5 columns:
│   ├─> Draft (gray)
│   ├─> Ready for Estimation (blue)
│   ├─> Estimated (yellow)
│   ├─> Assigned (purple)
│   └─> Completed (green)
├─> Each column has project cards
├─> Project card shows:
│   ├─> Project name
│   ├─> Audio count badge (e.g., "12 audios")
│   ├─> Status badge
│   ├─> Assigned expert avatar (if assigned)
│   └─> Last updated timestamp
├─> User can:
│   ├─> Drag-drop cards between columns (changes status)
│   ├─> Click card to open drawer
│   └─> Use filters (search, status, expert)
└─> Click card opens drawer with full details
```

### Flow 6: Project Drawer Details

```
User clicks project card
├─> Shadcn Sheet (drawer) opens from right
├─> Drawer sections:
│   ├─> Header:
│   │   ├─> Project name (editable inline)
│   │   ├─> Status badge
│   │   └─> Close button
│   ├─> Metadata section:
│   │   ├─> Description (editable)
│   │   ├─> Created date
│   │   ├─> Last updated
│   │   └─> Audio count
│   ├─> Estimation section (if estimated):
│   │   ├─> Estimated time
│   │   ├─> Complexity badge
│   │   ├─> Suggested expert
│   │   └─> Estimated cost
│   ├─> Assignment section (if assigned):
│   │   ├─> Expert name & avatar
│   │   ├─> Instructions (read-only)
│   │   ├─> Assigned date
│   │   └─> Expected completion date
│   ├─> Audios list (scrollable):
│   │   ├─> Each audio card:
│   │   │   ├─> Play/pause button
│   │   │   ├─> Audio name
│   │   │   ├─> Duration
│   │   │   ├─> Voice used badge
│   │   │   └─> Remove from project (X)
│   │   ├─> Reorder (drag handle)
│   │   └─> "Add More Audios" button
│   └─> Actions section:
│       ├─> "Get Estimation" (if draft)
│       ├─> "Assign to Expert" (if estimated)
│       ├─> "Mark as Complete" (if assigned)
│       ├─> "Edit Project"
│       └─> "Delete Project" (red, with confirmation)
└─> Drawer actions update in real-time
```

---

## Replicate Models & Parameters

### Model 1: Voice Cloning - `minimax/voice-cloning`

**Version ID**: `fff8a670880f066d3742838515a88f7f0a3ae40a4f2e06dae0f7f70ba63582d7`

**Purpose**: Clone a voice from audio sample to get a `voice_id` for TTS

**API Call**:
```typescript
const output = await replicate.run(
  "minimax/voice-cloning:fff8a670880f066d3742838515a88f7f0a3ae40a4f2e06dae0f7f70ba63582d7",
  {
    input: {
      voice_file: string,              // REQUIRED: URL to audio file (Vercel Blob URL)
      model?: "speech-02-turbo" | "speech-02-hd" | "speech-2.6-turbo" | "speech-2.6-hd",
                                       // DEFAULT: "speech-02-turbo"
      accuracy?: number,               // DEFAULT: 0.7, RANGE: 0-1
      need_noise_reduction?: boolean,  // DEFAULT: false
      need_volume_normalization?: boolean // DEFAULT: false
    }
  }
);

// Output format:
{
  voice_id: string,           // Use this for TTS generation
  preview_audio_url: string   // Preview of cloned voice
}
```

**What to send**:
1. Upload user's audio file to Vercel Blob first
2. Get Blob URL
3. Pass Blob URL as `voice_file`
4. Receive `voice_id` back
5. Save `voice_id` to database in Voice table

---

### Model 2: Text-to-Speech - `minimax/speech-02-turbo`

**Version ID**: `e2e8812b45eefa93b20990418480fe628ddce470f9b72909a175d65e288ff3d5`

**Purpose**: Generate speech from text using preset or cloned voice

**API Call**:
```typescript
const output = await replicate.run(
  "minimax/speech-02-turbo:e2e8812b45eefa93b20990418480fe628ddce470f9b72909a175d65e288ff3d5",
  {
    input: {
      text: string,                    // REQUIRED: Max 10,000 chars
                                       // Can include pause markers: <#0.5#>

      voice_id?: string,               // DEFAULT: "Wise_Woman"
                                       // Can be preset voice OR cloned voice_id

      emotion?: "auto" | "happy" | "sad" | "angry" | "fearful" |
                "disgusted" | "surprised" | "calm" | "fluent" | "neutral",
                                       // DEFAULT: "auto"

      pitch?: number,                  // DEFAULT: 0, RANGE: -12 to +12 (semitones)

      speed?: number,                  // DEFAULT: 1.0, RANGE: 0.5 to 2.0

      volume?: number,                 // DEFAULT: 1.0, RANGE: 0 to 10

      audio_format?: "mp3" | "wav" | "flac" | "pcm",
                                       // DEFAULT: "mp3"

      sample_rate?: 8000 | 16000 | 22050 | 24000 | 32000 | 44100,
                                       // DEFAULT: 32000

      bitrate?: 64000 | 128000 | 192000 | 256000,
                                       // DEFAULT: 128000 (MP3 only)

      channel?: "mono" | "stereo",     // DEFAULT: "mono"

      language_boost?: "Automatic" | "en-US" | "en-GB" | "en-AU" | "zh-CN" |
                       "ja-JP" | "ko-KR" | "es-ES" | "fr-FR" | "de-DE" |
                       "pt-BR" | "hi-IN" | ...,
                                       // DEFAULT: "Automatic"

      subtitle_enable?: boolean,       // DEFAULT: false
                                       // Returns timestamps for sentences

      english_normalization?: boolean  // DEFAULT: false
                                       // Better number/date reading for English
    }
  }
);

// Output: URL to generated audio file
```

**What to send for PRESET voice**:
```typescript
{
  text: "Hello, this is a test audio.",
  voice_id: "Wise_Woman",  // Or any preset voice
  emotion: "happy",
  speed: 1.1,
  audio_format: "mp3"
}
```

**What to send for CLONED voice**:
```typescript
{
  text: "Hello, this is my custom voice.",
  voice_id: "abc123xyz",  // voice_id from database (from voice cloning)
  emotion: "auto",
  pitch: 0,
  speed: 1.0,
  audio_format: "mp3",
  sample_rate: 32000
}
```

**Complete flow**:
1. User enters text
2. Selects voice (preset OR cloned)
3. If cloned voice selected:
   - Look up `voiceId` from database (Voice table)
   - Use that as `voice_id` parameter
4. Call Replicate API
5. Receive audio URL
6. Upload to Vercel Blob for permanent storage
7. Save to database with Blob URL

---

## Vercel Blob Storage

### When to use Blob:

1. **Voice cloning samples** - User uploads audio → Upload to Blob → Use Blob URL for Replicate
2. **Generated audio files** - Replicate returns temporary URL → Download → Upload to Blob → Save permanent Blob URL
3. **User-uploaded audio files** - Direct upload to Blob → Save Blob URL

### Upload Flow:

```typescript
import { put } from '@vercel/blob';

// Upload file to Vercel Blob
const blob = await put(filename, fileContent, {
  access: 'public',
  addRandomSuffix: true
});

// blob.url is the permanent URL
// Save blob.url to database
```

### File naming convention:
- Voice samples: `voices/{userId}/{voiceId}/sample.mp3`
- Generated audios: `audios/{userId}/{audioId}/audio.mp3`
- Uploaded audios: `uploads/{userId}/{timestamp}-{filename}`

---

## Database Schema

### Updated Prisma Schema:

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  credits       Int      @default(0)

  voices        Voice[]
  audios        Audio[]
  projects      Project[]
  expertProjects Project[] @relation("ExpertProjects")

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@map("users")
}

model Voice {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  name        String
  description String?

  // Replicate voice_id from cloning
  voiceId     String?  @unique

  // Vercel Blob URL of sample audio
  sampleAudioUrl String?

  // Model used for cloning
  model       String?  // "speech-02-turbo", "speech-02-hd"

  isCloned    Boolean  @default(false)
  status      String   @default("active") // active, processing, failed

  // Usage tracking
  usageCount  Int      @default(0)

  audios      Audio[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
  @@index([voiceId])
  @@map("voices")
}

model Audio {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  name            String
  description     String?

  // Vercel Blob URL (permanent storage)
  audioUrl        String

  // Audio metadata
  duration        Float?   // in seconds
  fileSize        Int?     // in bytes
  format          String?  // mp3, wav, flac

  // Generation details
  voiceId         String?
  voice           Voice?   @relation(fields: [voiceId], references: [id], onDelete: SetNull)

  textContent     String?  // Original text used for generation

  // Source tracking
  source          String   // "generated", "uploaded", "imported"

  // Replicate metadata (if generated)
  replicateId     String?
  generationParams Json?   // { emotion, pitch, speed, etc. }

  // Project associations
  projectAudios   ProjectAudio[]

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([userId])
  @@index([voiceId])
  @@index([source])
  @@index([createdAt])
  @@map("audios")
}

model Project {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  name        String
  description String?

  // AI Estimation (from OpenAI)
  estimatedTime     Int?      // in minutes
  estimatedCost     Float?    // in USD
  complexityLevel   String?   // "simple", "medium", "complex"
  suggestedExpert   String?   // "audio_editor", "voice_director", "qa_specialist"
  estimationData    Json?     // Full OpenAI response

  // Expert Assignment
  expertId          String?
  expert            User?     @relation("ExpertProjects", fields: [expertId], references: [id], onDelete: SetNull)
  instructions      String?
  assignedAt        DateTime?

  // Status tracking
  status      String   @default("draft")
  // Statuses: "draft", "ready_for_estimation", "estimated", "assigned", "in_review", "completed", "archived"

  completedAt DateTime?

  // Project-Audio associations
  audios      ProjectAudio[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
  @@index([expertId])
  @@index([status])
  @@index([createdAt])
  @@map("projects")
}

model ProjectAudio {
  id        String   @id @default(cuid())

  projectId String
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  audioId   String
  audio     Audio    @relation(fields: [audioId], references: [id], onDelete: Cascade)

  // Ordering within project
  order     Int      @default(0)

  // Expert feedback/notes (optional)
  notes     String?
  reviewed  Boolean  @default(false)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([projectId, audioId])
  @@index([projectId])
  @@index([audioId])
  @@map("project_audios")
}

// Optional: Expert profile if experts are users with special role
model ExpertProfile {
  id          String   @id @default(cuid())
  userId      String   @unique

  specialty   String   // "audio_editor", "voice_director", "qa_specialist"
  bio         String?
  rating      Float    @default(5.0)
  reviewCount Int      @default(0)
  isAvailable Boolean  @default(true)
  hourlyRate  Float?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("expert_profiles")
}
```

---

## API Endpoints

### Audio Endpoints

#### `POST /api/audios/generate`
Generate audio from text using Replicate TTS
```typescript
Body: {
  text: string,
  voiceId?: string,        // Preset or cloned voice ID
  name?: string,
  emotion?: string,
  speed?: number,
  pitch?: number,
  audioFormat?: string,
  sampleRate?: number
}
Response: {
  success: true,
  audio: Audio
}
```

#### `POST /api/audios/upload`
Upload audio file to Vercel Blob
```typescript
Body: FormData {
  file: File,
  name: string,
  description?: string
}
Response: {
  success: true,
  audio: Audio
}
```

#### `GET /api/audios`
List user's audios with filters
```typescript
Query: {
  page?: number,
  limit?: number,
  voiceId?: string,
  source?: string,
  search?: string,
  sortBy?: "createdAt" | "name" | "duration",
  sortOrder?: "asc" | "desc"
}
Response: {
  success: true,
  audios: Audio[],
  pagination: { ... }
}
```

#### `GET /api/audios/[id]`
Get single audio
```typescript
Response: {
  success: true,
  audio: Audio & { voice: Voice | null }
}
```

#### `PATCH /api/audios/[id]`
Update audio metadata
```typescript
Body: {
  name?: string,
  description?: string
}
```

#### `DELETE /api/audios/[id]`
Delete audio (and Blob file)

---

### Voice Endpoints (Already created, just documenting)

#### `POST /api/voices/clone`
Clone voice from audio sample

#### `GET /api/voices/my-clones`
List user's cloned voices

#### `GET /api/voices/clone/[id]`
Get single voice

#### `PATCH /api/voices/clone/[id]`
Update voice metadata

#### `DELETE /api/voices/clone/[id]`
Delete voice

---

### Project Endpoints

#### `POST /api/projects`
Create new project
```typescript
Body: {
  name: string,
  description?: string,
  audioIds?: string[]
}
Response: {
  success: true,
  project: Project
}
```

#### `GET /api/projects`
List user's projects (for kanban)
```typescript
Query: {
  status?: string,
  expertId?: string,
  search?: string
}
Response: {
  success: true,
  projects: Project[]
}
```

#### `GET /api/projects/[id]`
Get single project with audios
```typescript
Response: {
  success: true,
  project: Project & {
    audios: (ProjectAudio & { audio: Audio })[]
  }
}
```

#### `PATCH /api/projects/[id]`
Update project metadata
```typescript
Body: {
  name?: string,
  description?: string,
  status?: string
}
```

#### `DELETE /api/projects/[id]`
Delete project

#### `POST /api/projects/[id]/audios`
Add audios to project
```typescript
Body: {
  audioIds: string[]
}
Response: {
  success: true,
  projectAudios: ProjectAudio[]
}
```

#### `DELETE /api/projects/[id]/audios/[audioId]`
Remove audio from project

#### `PATCH /api/projects/[id]/audios/reorder`
Reorder audios in project
```typescript
Body: {
  audioIds: string[]  // In new order
}
```

#### `POST /api/projects/[id]/estimate`
Get AI estimation via OpenAI
```typescript
Response: {
  success: true,
  estimation: {
    estimatedTime: number,
    estimatedCost: number,
    complexity: string,
    suggestedExpert: string
  }
}
```

#### `POST /api/projects/[id]/assign`
Assign project to expert
```typescript
Body: {
  expertId: string,
  instructions: string
}
Response: {
  success: true,
  project: Project
}
```

---

### Stats Endpoint

#### `GET /api/stats`
Get dashboard summary stats
```typescript
Response: {
  success: true,
  stats: {
    totalAudios: number,
    totalVoices: number,
    totalProjects: number,
    credits: number,
    projectsByStatus: {
      draft: number,
      estimated: number,
      assigned: number,
      completed: number
    }
  }
}
```

---

## UI Component Strategy (Shadcn + Brand Styling)

### Brutalist Design Tokens:
- **Primary**: Black (#000000)
- **Accent**: Yellow (#EAB308 / yellow-400)
- **Background**: White (#FFFFFF)
- **Borders**: 4px solid black
- **Shadows**: 8px 8px 0 0 #000 (brutalist-shadow)
- **Typography**: Bold, uppercase headings, heavy weights

### Shadcn Components to Use:

**Dashboard Home**:
- Card (for stats)
- Table (for recent audios)
- Button (for quick actions)
- Badge (for status indicators)

**Audio Library**:
- DataTable (with sorting, filtering)
- Dialog (for generate/upload forms)
- DropdownMenu (for row actions)
- Select/Combobox (for voice selector)
- Slider (for pitch/speed controls)
- Accordion (for advanced settings)

**Voice Library**:
- Card (for voice cards)
- Dialog (for clone form)
- AlertDialog (for delete confirmation)
- Progress (for cloning progress)

**Projects**:
- Sheet/Drawer (for project details)
- Card (for kanban cards)
- Badge (for status)
- Tabs (for different project views)
- Sortable (for drag-drop reordering)

**Audio Players**:
- Custom component with play/pause, progress bar, volume
- Use HTML5 Audio API
- Styled with brutalist design

---

## Next Steps

1. ✅ Fix all TypeScript build errors
2. ✅ Review existing components in `/components`
3. ✅ Identify missing components for dashboard pages
4. Create Audio management system (`/dashboard/audios`)
5. Create Project management system (`/dashboard/projects`)
6. Integrate OpenAI estimation API
7. Build Kanban board with Shadcn
8. Implement Vercel Blob storage
9. Add audio player components
10. Testing & polish

---

**Last Updated**: 2025-01-09
**Status**: Ready for implementation
