# 🗄️ VoiceCraft Database

**Last Updated:** 2025-11-09

Complete reference for VoiceCraft's database schema, migrations, and data management.

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [Schema Diagram](#schema-diagram)
3. [Models](#models)
4. [Relationships](#relationships)
5. [Indexes](#indexes)
6. [Migrations](#migrations)
7. [Seeding Data](#seeding-data)
8. [Common Queries](#common-queries)
9. [Best Practices](#best-practices)

---

## Overview

**Database:** PostgreSQL
**ORM:** Prisma
**Provider:** Neon or Vercel Postgres
**Schema File:** `/prisma/schema.prisma`

### Quick Stats

- **Models:** 10
- **Junction Tables:** 1 (ProjectAudio)
- **External Integrations:** Stripe, Replicate
- **Total Indexes:** 30+

### Key Design Principles

1. **User-Centric** - All resources belong to users
2. **Soft Deletes** - Cascade deletions with `onDelete: Cascade`
3. **Audit Trail** - `createdAt` and `updatedAt` on all models
4. **Flexible Metadata** - JSON fields for extensibility
5. **Performance-First** - Strategic indexes on common queries

---

## Schema Diagram

```
┌──────────┐
│   User   │ ─────┐
└──────────┘      │
     │            │
     ├─────┬──────┼─────┬──────┬──────┐
     │     │      │     │      │      │
     ↓     ↓      ↓     ↓      ↓      ↓
┌─────────┐   ┌────────┐   ┌─────────┐
│  Voice  │   │  Audio │   │ Project │ ───┐
└─────────┘   └────────┘   └─────────┘    │
     │            │              │         │
     │            │              │         ↓
     ↓            │              │    ┌──────────────┐
┌──────────────┐ │              └────│ProjectAudio │
│VoiceGen      │ │                   └──────────────┘
└──────────────┘ │
                 │
                 └─────────┐
                           ↓
┌────────────┐    ┌────────────┐
│ExpertProfile│←──│  Project   │
└────────────┘    └────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────┐
│Subscription  │  │  UsageLog    │  │VoiceTemp.│
└──────────────┘  └──────────────┘  └──────────┘
```

---

## Models

### User

**Purpose:** Core user authentication and profile

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  emailVerified DateTime?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  subscriptions Subscription[]
  voices        Voice[]
  generations   VoiceGeneration[]
  usage         UsageLog[]
  audios        Audio[]
  projects      Project[]
  expertProfile ExpertProfile?
}
```

**Fields:**
- `id` - CUID identifier (collision-resistant)
- `email` - Unique email address (for authentication)
- `name` - Display name (optional)
- `image` - Avatar URL (optional)
- `emailVerified` - Email verification timestamp (NextAuth.js)

**Relationships:**
- **1:n** → Subscription (billing)
- **1:n** → Voice (cloned voices)
- **1:n** → VoiceGeneration (synthesis jobs)
- **1:n** → UsageLog (usage tracking)
- **1:n** → Audio (audio files)
- **1:n** → Project (audio projects)
- **1:1** → ExpertProfile (expert marketplace)

**Indexes:** None needed (email is unique)

---

### Voice

**Purpose:** User's cloned or custom voices

```prisma
model Voice {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  name        String
  description String?
  language    String   @default("en-US")
  accent      String?
  gender      String?  // male, female, neutral
  ageGroup    String?  // child, young adult, adult, senior
  style       String?  // professional, conversational, dramatic

  voiceId     String?  @unique // Replicate voice ID

  sampleAudioUrl String?
  model       String?  // minimax-2.6-turbo, kokoro-82m, xtts-v2

  isPublic    Boolean  @default(false)
  isCloned    Boolean  @default(false)
  isVerified  Boolean  @default(false)

  status      String   @default("active") // active, processing, failed

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  generations VoiceGeneration[]
  audios      Audio[]

  @@index([userId])
  @@index([isPublic])
  @@index([voiceId])
}
```

**Fields:**
- `voiceId` - Replicate's voice identifier (returned after cloning)
- `sampleAudioUrl` - Training audio sample (Vercel Blob URL)
- `model` - AI model used for cloning
- `isCloned` - Whether this is a cloned voice vs. preset
- `isPublic` - Allow other users to use this voice
- `status` - Voice lifecycle state

**Status Values:**
- `active` - Ready to use
- `processing` - Voice cloning in progress
- `failed` - Cloning failed

**Indexes:**
- `userId` - Find user's voices
- `isPublic` - Find public voice marketplace
- `voiceId` - Lookup by Replicate ID

**Cascade:** Deleting user deletes all their voices

---

### VoiceGeneration

**Purpose:** Track all voice synthesis jobs

```prisma
model VoiceGeneration {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  voiceId         String
  voice           Voice    @relation(fields: [voiceId], references: [id], onDelete: Cascade)

  // Input
  text            String   @db.Text
  language        String   @default("en-US")

  // Output
  audioUrl        String?
  duration        Float?   // seconds
  fileSize        Int?     // bytes
  format          String   @default("mp3")

  // Settings
  speed           Float    @default(1.0)
  pitch           Float    @default(1.0)
  emotion         String?
  emphasis        Json?

  // Status
  status          String   @default("pending")
  errorMessage    String?

  // Cost
  characterCount  Int
  cost            Float?

  createdAt       DateTime @default(now())
  completedAt     DateTime?

  @@index([userId])
  @@index([voiceId])
  @@index([status])
  @@index([createdAt])
}
```

**Fields:**
- `text` - Input text to synthesize (up to 10,000 characters)
- `audioUrl` - Generated audio file URL (Replicate-hosted)
- `emphasis` - JSON object with word-level emphasis
- `characterCount` - For cost calculation
- `cost` - Credits or dollars charged

**Status Values:**
- `pending` - Queued for generation
- `processing` - AI model is running
- `completed` - Audio ready
- `failed` - Generation error

**Indexes:**
- `userId` - User's generation history
- `voiceId` - Generations per voice
- `status` - Find pending/processing jobs
- `createdAt` - Chronological queries

---

### Subscription

**Purpose:** User's billing plan and limits

```prisma
model Subscription {
  id                String    @id @default(cuid())
  userId            String
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Plan details
  plan              String    // free, starter, pro, enterprise
  status            String    @default("active")

  // Stripe integration
  stripeCustomerId      String?   @unique
  stripeSubscriptionId  String?   @unique
  stripePriceId         String?
  stripeCurrentPeriodEnd DateTime?

  // Limits
  monthlyCharacterLimit Int       @default(10000)
  monthlyVoiceClones    Int       @default(1)
  allowCustomVoices     Boolean   @default(false)
  allowCommercialUse    Boolean   @default(false)

  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  cancelledAt       DateTime?

  @@index([userId])
  @@index([stripeCustomerId])
  @@index([stripeSubscriptionId])
}
```

**Plan Tiers:**

| Plan | Character Limit | Voice Clones | Custom Voices | Commercial |
|------|----------------|--------------|---------------|------------|
| free | 10,000/month | 1 | ❌ | ❌ |
| starter | 50,000/month | 5 | ✅ | ❌ |
| pro | 200,000/month | 20 | ✅ | ✅ |
| enterprise | Unlimited | Unlimited | ✅ | ✅ |

**Status Values:**
- `active` - Subscription is current
- `cancelled` - Cancelled but still active until period end
- `expired` - Subscription ended
- `past_due` - Payment failed

**Indexes:**
- `userId` - Find user's subscription
- `stripeCustomerId` - Webhook lookups
- `stripeSubscriptionId` - Webhook lookups

---

### UsageLog

**Purpose:** Track all user actions for analytics and rate limiting

```prisma
model UsageLog {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  action          String   // generate_voice, clone_voice, download_audio
  characterCount  Int?
  cost            Float?

  metadata        Json?

  createdAt       DateTime @default(now())

  @@index([userId])
  @@index([action])
  @@index([createdAt])
}
```

**Action Types:**
- `generate_voice` - Voice synthesis
- `clone_voice` - Voice cloning started
- `download_audio` - Audio file download
- `create_project` - New project created
- `assign_expert` - Expert assigned to project

**Indexes:**
- `userId` - User's usage history
- `action` - Filter by action type
- `createdAt` - Time-based queries (rate limiting)

---

### VoiceTemplate

**Purpose:** Pre-built system voices available to all users

```prisma
model VoiceTemplate {
  id          String   @id @default(cuid())

  name        String
  description String?
  language    String
  accent      String?
  gender      String
  ageGroup    String
  style       String

  sampleAudioUrl String

  isFeatured  Boolean  @default(false)
  isPremium   Boolean  @default(false)

  usageCount  Int      @default(0)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([language])
  @@index([isFeatured])
}
```

**Examples:**
- "Wise Woman" - English, Female, Adult, Professional
- "Energetic Youth" - English, Male, Young Adult, Conversational
- "News Anchor" - English, Neutral, Adult, Formal

**Indexes:**
- `language` - Filter by language
- `isFeatured` - Homepage display

---

### Audio

**Purpose:** Generated or uploaded audio files

```prisma
model Audio {
  id             String   @id @default(cuid())
  userId         String
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // File details
  filename       String
  audioUrl       String   // Vercel Blob URL
  duration       Float?
  fileSize       Int?
  format         String   @default("mp3")

  // Generation details
  voiceId        String?
  voice          Voice?   @relation(fields: [voiceId], references: [id], onDelete: SetNull)
  text           String?  @db.Text
  metadata       Json?

  // Upload details
  uploadSource   String?  // "upload", "generate", "import"

  // Organization
  tags           String[]
  description    String?

  status         String   @default("ready")

  // Relations
  projectAudios  ProjectAudio[]

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([userId])
  @@index([voiceId])
  @@index([status])
  @@index([createdAt])
}
```

**Fields:**
- `audioUrl` - Vercel Blob storage URL
- `text` - Original text (if generated)
- `metadata` - JSON with generation settings
- `uploadSource` - How audio was created
- `tags` - Array of categorization tags

**Upload Sources:**
- `upload` - User uploaded file
- `generate` - AI-generated from text
- `import` - Imported from external source

**Status Values:**
- `ready` - Available for use
- `processing` - Upload/generation in progress
- `failed` - Error occurred

**Indexes:**
- `userId` - User's audio library
- `voiceId` - Audios per voice
- `status` - Find ready audios
- `createdAt` - Recent audios

---

### Project

**Purpose:** Organize audios for expert assignment and AI estimation

```prisma
model Project {
  id                String   @id @default(cuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Details
  name              String
  description       String?  @db.Text
  status            String   @default("draft")

  // AI Estimation
  estimatedCost     Float?
  estimatedDuration Float?
  estimationData    Json?

  // Expert assignment
  expertId          String?
  expert            ExpertProfile? @relation(fields: [expertId], references: [id], onDelete: SetNull)
  instructions      String?  @db.Text
  deadline          DateTime?

  // Metadata
  priority          String   @default("medium")
  tags              String[]

  // Relations
  projectAudios     ProjectAudio[]

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  completedAt       DateTime?

  @@index([userId])
  @@index([expertId])
  @@index([status])
  @@index([createdAt])
}
```

**Status Lifecycle:**

```
draft → estimating → ready → in_progress → completed
  ↓                    ↓                        ↓
cancelled         cancelled               cancelled
```

**Status Values:**
- `draft` - Creating project, adding audios
- `estimating` - AI generating estimates
- `ready` - Ready for expert assignment
- `in_progress` - Expert working on project
- `completed` - Work delivered
- `cancelled` - Project abandoned

**Priority Values:**
- `low` - No rush
- `medium` - Normal priority
- `high` - Important
- `urgent` - ASAP

**Indexes:**
- `userId` - User's projects
- `expertId` - Projects assigned to expert
- `status` - Filter by lifecycle stage
- `createdAt` - Recent projects

---

### ProjectAudio

**Purpose:** Many-to-many relationship between Projects and Audios

```prisma
model ProjectAudio {
  id         String   @id @default(cuid())
  projectId  String
  project    Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  audioId    String
  audio      Audio    @relation(fields: [audioId], references: [id], onDelete: Cascade)

  order      Int      @default(0)
  status     String   @default("pending")
  notes      String?  @db.Text

  createdAt  DateTime @default(now())

  @@unique([projectId, audioId])
  @@index([projectId])
  @@index([audioId])
}
```

**Fields:**
- `order` - Sequence number in project (for playback order)
- `status` - Processing status for this specific audio
- `notes` - Expert's notes about this audio

**Status Values:**
- `pending` - Not yet processed
- `in_progress` - Expert working on it
- `completed` - This audio is done

**Unique Constraint:** Same audio can't be added twice to same project

**Indexes:**
- `projectId` - Get project's audios
- `audioId` - Find projects using this audio

---

### ExpertProfile

**Purpose:** Expert users who accept project assignments

```prisma
model ExpertProfile {
  id             String   @id @default(cuid())
  userId         String   @unique
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Details
  specialization String[]
  bio            String?  @db.Text
  hourlyRate     Float?

  // Availability
  isAvailable    Boolean  @default(true)
  timezone       String?
  workingHours   Json?

  // Metrics
  rating         Float?   @default(0)
  completedJobs  Int      @default(0)
  averageTurnaround Float?

  // Relations
  projects       Project[]

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([userId])
  @@index([isAvailable])
}
```

**Specializations:**
- `voice-over` - Voice acting
- `audio-editing` - Post-production editing
- `translation` - Multi-language work
- `sound-design` - Audio effects
- `mixing-mastering` - Final audio polish

**Working Hours JSON Example:**
```json
{
  "monday": { "start": "09:00", "end": "17:00" },
  "tuesday": { "start": "09:00", "end": "17:00" },
  "wednesday": "off",
  "timezone": "America/New_York"
}
```

**Indexes:**
- `userId` - Find expert profile for user
- `isAvailable` - Filter available experts

---

## Relationships

### User Relationships

```typescript
User 1 ───── n Voice
     1 ───── n VoiceGeneration
     1 ───── n Audio
     1 ───── n Project
     1 ───── n Subscription
     1 ───── n UsageLog
     1 ───── 1 ExpertProfile
```

### Voice Relationships

```typescript
Voice 1 ───── n VoiceGeneration
      1 ───── n Audio
```

### Project Relationships

```typescript
Project 1 ───── n ProjectAudio ───── n Audio
        n ───── 1 ExpertProfile
```

### Cascade Deletions

**When User is deleted:**
- ✅ All Voices deleted
- ✅ All VoiceGenerations deleted
- ✅ All Audios deleted
- ✅ All Projects deleted
- ✅ All Subscriptions deleted
- ✅ All UsageLogs deleted
- ✅ ExpertProfile deleted (if exists)

**When Voice is deleted:**
- ✅ All VoiceGenerations deleted
- ⚠️ Audios set voiceId to null (SetNull)

**When Project is deleted:**
- ✅ All ProjectAudio entries deleted
- ⚠️ Audios remain (not deleted)

---

## Indexes

### Performance-Critical Indexes

```prisma
// User lookups
User.email (unique)

// Voice queries
Voice.userId
Voice.isPublic
Voice.voiceId (unique)

// Generation tracking
VoiceGeneration.userId
VoiceGeneration.voiceId
VoiceGeneration.status
VoiceGeneration.createdAt

// Audio library
Audio.userId
Audio.voiceId
Audio.status
Audio.createdAt

// Project management
Project.userId
Project.expertId
Project.status
Project.createdAt

// Subscriptions
Subscription.userId
Subscription.stripeCustomerId (unique)
Subscription.stripeSubscriptionId (unique)

// Usage tracking
UsageLog.userId
UsageLog.action
UsageLog.createdAt

// Experts
ExpertProfile.userId (unique)
ExpertProfile.isAvailable

// Junction table
ProjectAudio.projectId
ProjectAudio.audioId
ProjectAudio.[projectId, audioId] (unique)

// Templates
VoiceTemplate.language
VoiceTemplate.isFeatured
```

### Missing Indexes to Consider

**For future optimization:**

```prisma
// Composite indexes for common queries
@@index([userId, status]) // on Voice, Audio, Project
@@index([userId, createdAt]) // on VoiceGeneration, Audio

// Full-text search
@@index([name], type: FullText) // on Voice, Project

// Range queries
@@index([createdAt, status]) // on VoiceGeneration
```

---

## Migrations

### Development Workflow

```bash
# 1. Edit schema.prisma

# 2. Create migration
npx prisma migrate dev --name add_voice_emotions

# 3. Prisma generates SQL and applies it
# Migration created: prisma/migrations/20250109_add_voice_emotions/

# 4. Regenerate Prisma Client
npx prisma generate
```

### Production Deployment

```bash
# 1. In CI/CD pipeline, apply migrations
npx prisma migrate deploy

# 2. Generate Prisma Client for production
npx prisma generate
```

### Common Migration Commands

```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# View migration status
npx prisma migrate status

# Resolve migration conflicts
npx prisma migrate resolve --applied "20250109_migration_name"

# Create migration without applying
npx prisma migrate dev --create-only

# Apply specific migration
npx prisma migrate deploy
```

### Schema Push (Development Only)

```bash
# Quick schema changes without migration history
npx prisma db push

# ⚠️ Only use in development!
# ⚠️ Does NOT create migration files
# ⚠️ Can cause data loss
```

---

## Seeding Data

### Seed Script

**File:** `/prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create voice templates
  const templates = await prisma.voiceTemplate.createMany({
    data: [
      {
        name: 'Wise Woman',
        language: 'en-US',
        gender: 'female',
        ageGroup: 'adult',
        style: 'professional',
        sampleAudioUrl: 'https://example.com/wise-woman.mp3',
        isFeatured: true,
      },
      {
        name: 'Energetic Youth',
        language: 'en-US',
        gender: 'male',
        ageGroup: 'young adult',
        style: 'conversational',
        sampleAudioUrl: 'https://example.com/energetic-youth.mp3',
        isFeatured: true,
      },
      // ... more templates
    ],
  })

  console.log(`Created ${templates.count} voice templates`)

  // Create test user
  const user = await prisma.user.create({
    data: {
      email: 'demo@voicecraft.com',
      name: 'Demo User',
      emailVerified: new Date(),
      subscriptions: {
        create: {
          plan: 'pro',
          status: 'active',
          monthlyCharacterLimit: 200000,
          monthlyVoiceClones: 20,
          allowCustomVoices: true,
          allowCommercialUse: true,
        },
      },
    },
  })

  console.log(`Created demo user: ${user.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### Run Seed

```bash
npx prisma db seed
```

### Package.json Config

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

---

## Common Queries

### User Queries

```typescript
// Get user with subscription
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
  include: { subscriptions: true },
})

// Check subscription limits
const subscription = await prisma.subscription.findFirst({
  where: { userId, status: 'active' },
})

// Track usage this month
const usage = await prisma.usageLog.aggregate({
  where: {
    userId,
    action: 'generate_voice',
    createdAt: {
      gte: startOfMonth,
      lte: endOfMonth,
    },
  },
  _sum: { characterCount: true },
})
```

### Voice Queries

```typescript
// Get user's voices
const voices = await prisma.voice.findMany({
  where: { userId },
  orderBy: { createdAt: 'desc' },
})

// Get public voices
const publicVoices = await prisma.voice.findMany({
  where: { isPublic: true, status: 'active' },
  include: {
    user: {
      select: { name: true, image: true },
    },
  },
})

// Get voice with generation stats
const voice = await prisma.voice.findUnique({
  where: { id: voiceId },
  include: {
    _count: {
      select: { generations: true },
    },
  },
})
```

### Generation Queries

```typescript
// Recent generations
const generations = await prisma.voiceGeneration.findMany({
  where: { userId },
  include: { voice: true },
  orderBy: { createdAt: 'desc' },
  take: 20,
})

// Pending generations
const pending = await prisma.voiceGeneration.findMany({
  where: {
    status: { in: ['pending', 'processing'] },
  },
})

// Generation history with cost
const history = await prisma.voiceGeneration.findMany({
  where: { userId },
  select: {
    id: true,
    text: true,
    audioUrl: true,
    cost: true,
    characterCount: true,
    createdAt: true,
    voice: {
      select: { name: true },
    },
  },
})
```

### Audio Queries

```typescript
// User's audio library
const audios = await prisma.audio.findMany({
  where: { userId },
  include: {
    voice: {
      select: { name: true },
    },
  },
  orderBy: { createdAt: 'desc' },
})

// Search audios by tags
const tagged = await prisma.audio.findMany({
  where: {
    userId,
    tags: { hasSome: ['podcast', 'narration'] },
  },
})

// Get audio with projects
const audio = await prisma.audio.findUnique({
  where: { id: audioId },
  include: {
    projectAudios: {
      include: { project: true },
    },
  },
})
```

### Project Queries

```typescript
// User's projects with audio count
const projects = await prisma.project.findMany({
  where: { userId },
  include: {
    _count: {
      select: { projectAudios: true },
    },
    expert: {
      select: { user: { select: { name: true } } },
    },
  },
  orderBy: { createdAt: 'desc' },
})

// Project with all audios
const project = await prisma.project.findUnique({
  where: { id: projectId },
  include: {
    projectAudios: {
      include: { audio: true },
      orderBy: { order: 'asc' },
    },
  },
})

// Projects by status (Kanban board)
const kanban = await prisma.project.groupBy({
  by: ['status'],
  where: { userId },
  _count: true,
})
```

### Expert Queries

```typescript
// Available experts
const experts = await prisma.expertProfile.findMany({
  where: { isAvailable: true },
  include: {
    user: {
      select: { name: true, image: true },
    },
    _count: {
      select: { projects: true },
    },
  },
  orderBy: { rating: 'desc' },
})

// Expert's projects
const expertProjects = await prisma.project.findMany({
  where: { expertId },
  include: {
    user: {
      select: { name: true, email: true },
    },
    _count: {
      select: { projectAudios: true },
    },
  },
})
```

---

## Best Practices

### 1. Always Use Prisma Client Singleton

```typescript
// ✅ Good - lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 2. Select Only Needed Fields

```typescript
// ❌ Bad - fetches all fields
const user = await prisma.user.findUnique({ where: { id } })

// ✅ Good - select specific fields
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, name: true, email: true },
})
```

### 3. Use Include for Related Data

```typescript
// ❌ Bad - N+1 query problem
const voices = await prisma.voice.findMany()
for (const voice of voices) {
  const user = await prisma.user.findUnique({ where: { id: voice.userId } })
}

// ✅ Good - single query
const voices = await prisma.voice.findMany({
  include: { user: true },
})
```

### 4. Handle Errors Gracefully

```typescript
try {
  const user = await prisma.user.create({ data })
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // Unique constraint violation
      throw new Error('Email already exists')
    }
  }
  throw error
}
```

### 5. Use Transactions for Related Operations

```typescript
const result = await prisma.$transaction([
  prisma.audio.create({ data: audioData }),
  prisma.projectAudio.create({ data: { projectId, audioId } }),
  prisma.usageLog.create({ data: { userId, action: 'create_audio' } }),
])
```

### 6. Add Indexes for Common Queries

```prisma
// If you often query by status and userId together
@@index([userId, status])
```

### 7. Use Soft Deletes for Audit Trail

```prisma
model Audio {
  deletedAt DateTime?

  @@index([deletedAt])
}

// Query only non-deleted
const audios = await prisma.audio.findMany({
  where: { deletedAt: null },
})
```

### 8. Validate Data Before Database

```typescript
import { z } from 'zod'

const CreateVoiceSchema = z.object({
  name: z.string().min(1).max(100),
  language: z.string().length(5),
  // ...
})

const data = CreateVoiceSchema.parse(input) // Throws if invalid
await prisma.voice.create({ data })
```

### 9. Use Pagination for Large Lists

```typescript
const audios = await prisma.audio.findMany({
  take: 20,
  skip: page * 20,
  orderBy: { createdAt: 'desc' },
})
```

### 10. Monitor Query Performance

```typescript
// Enable query logging in development
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],
})
```

---

## Related Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - System design overview
- [API.md](API.md) - API endpoints using these models
- [DEVELOPMENT.md](DEVELOPMENT.md) - Local development setup

---

**Questions?** See [CONTRIBUTING.md](CONTRIBUTING.md) for how to get help.
