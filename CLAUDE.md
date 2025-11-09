# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 🎙️ VoiceCraft — AI Agent Development Guide

**Tech Stack:** Next.js 16.0.1 (App Router) · TypeScript · Prisma + PostgreSQL · Vercel Blob · Replicate API · OpenAI API · Stripe · shadcn/ui · Tailwind CSS

**Target:** Full-stack AI voice synthesis platform with voice cloning, audio generation, and expert marketplace

**Current State:** Core features implemented, authentication pending (uses placeholder `userId = 'temp-user-id'`)

---

## 📚 DOCUMENTATION INDEX

**For detailed information, see:**

- **[README.md](README.md)** - Quick start guide for new developers
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System design and core concepts
- **[docs/DATABASE.md](docs/DATABASE.md)** - Prisma schema and migrations
- **[docs/API.md](docs/API.md)** - API routes reference
- **[docs/ROUTES.md](docs/ROUTES.md)** - All pages and routes reference
- **[docs/USER_FLOWS.md](docs/USER_FLOWS.md)** - User journeys and workflows
- **[docs/COMPONENTS.md](docs/COMPONENTS.md)** - UI component architecture
- **[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)** - Development workflow and tools
- **[docs/TESTING.md](docs/TESTING.md)** - Testing strategy and guidelines
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Production deployment guide
- **[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)** - How to contribute

---

## 🤖 AUTONOMOUS AI AGENT MODE

**If you are Claude Code starting a new conversation, follow this protocol:**

### IMMEDIATE ACTION REQUIRED

1. ✅ Read this CLAUDE.md file (you are reading it now)
2. ✅ Check current git status and existing files
3. ✅ Review relevant documentation in `/docs` for context
4. ✅ Create TodoWrite list for your tasks
5. ✅ **BEGIN WORK IMMEDIATELY** without asking permission
6. ✅ Work sequentially until all tasks complete

### DO NOT

- ❌ Ask "shall I begin?" or "would you like me to start?"
- ❌ Request permission to install packages or create files
- ❌ Stop mid-task waiting for approval
- ❌ Skip tests or quality checks
- ❌ Commit code that doesn't build or pass type checking
- ❌ Create new documentation files without reviewing existing ones first

---

## 🏆 QUALITY STANDARDS (NON-NEGOTIABLE)

### UX/UI Excellence

- Follow Brutalist design system with shadcn/ui components
- Implement smooth transitions and micro-interactions
- Add loading states for ALL async operations
- Include empty states with helpful CTAs
- Provide clear error messages with recovery options
- Ensure mobile-first responsive design
- Add keyboard shortcuts for power users
- Implement optimistic UI updates
- Use skeleton loaders for content loading
- Add hover, focus, and active states to all interactive elements

### Code Quality

- Zero `any` types in TypeScript
- Zero `console.log` in production code
- All components properly typed
- All API routes validated with Zod
- All database queries optimized
- All images using Next.js Image component
- All forms with client-side + server-side validation
- All errors logged appropriately
- All user inputs sanitized

### Performance Targets

- First Contentful Paint <1.5s
- Largest Contentful Paint <2.5s
- Time to Interactive <3.5s
- Cumulative Layout Shift <0.1
- Database query time <100ms (p95)

---

## 🚀 DEVELOPMENT PROTOCOL

### When Working On Features

1. **Plan first** - Review relevant documentation before coding
2. **Read existing code** - Never speculate, always investigate files
3. **Write types** - Ensure TypeScript strict mode compliance
4. **Update types** - Regenerate Prisma client after schema changes
5. **Test manually** - Verify in browser before marking complete

### Investigation First

<investigate_before_answering>
Never speculate about code you have not opened. If the user references a specific file, you MUST read the file before answering. Make sure to investigate and read relevant files BEFORE answering questions about the codebase. Never make any claims about code before investigating.
</investigate_before_answering>

### Context Management

Your context window will be automatically compacted as it approaches its limit, allowing you to continue working indefinitely. Do not stop tasks early due to token budget concerns.

### Temporary Files

If you create any temporary new files, scripts, or helper files for iteration, clean up these files by removing them at the end of the task.

---

## 🛠 TECH STACK QUICK REFERENCE

### Core Framework

- **Next.js 16.0.1** - React framework with App Router
- **React 19** - UI library with Server Components
- **TypeScript 5** - Strict mode enabled

### Database

- **PostgreSQL** - Relational database (Neon or Vercel Postgres)
- **Prisma** - Type-safe ORM
- See [docs/DATABASE.md](docs/DATABASE.md)

### UI & Styling

- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Brutalist design component library
- **Lucide React** - Icons
- See [docs/COMPONENTS.md](docs/COMPONENTS.md)

### External Services

- **Replicate API** - AI voice cloning and generation
- **OpenAI API** - Project cost estimation
- **Vercel Blob** - Audio file storage
- **Stripe** - Payments and subscriptions
- See [docs/API.md](docs/API.md)

---

## 📦 PROJECT STRUCTURE

```
voicecraft/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Protected dashboard routes
│   │   ├── audios/        # Audio library
│   │   ├── voices/        # Voice library
│   │   └── projects/      # Project kanban board
│   ├── api/               # API routes (see below for details)
│   │   ├── audios/        # Audio management
│   │   ├── voices/        # Voice cloning & generation
│   │   └── projects/      # Project & expert assignment
│   ├── about/             # About page
│   ├── blog/              # Blog section
│   ├── contact/           # Contact page
│   ├── demo/              # Demo/showcase
│   ├── features/          # Features page
│   ├── pricing/           # Pricing plans
│   └── [terms/privacy/etc] # Legal pages
├── components/
│   └── ui/                # shadcn/ui primitives (Button, Dialog, etc.)
├── lib/
│   ├── prisma.ts          # Prisma client singleton
│   ├── utils.ts           # Utility functions
│   └── mantine-theme.ts   # Mantine UI theme config
├── prisma/
│   └── schema.prisma      # Database schema (11 models)
├── docs/                  # Comprehensive documentation
│   ├── ARCHITECTURE.md    # System design & patterns
│   ├── DATABASE.md        # Schema reference
│   └── API.md             # API routes reference
└── public/
    └── images/            # Static images
```

### Database Models (Prisma)

**Core entities:**
- `User` - User accounts (relates to everything)
- `Voice` - Cloned voices (has `voiceId` from Replicate)
- `Audio` - Generated or uploaded audio files
- `Project` - Audio projects for organization
- `ProjectAudio` - Junction table (many-to-many Project ↔ Audio)

**Supporting entities:**
- `VoiceGeneration` - Tracks voice synthesis jobs
- `VoiceTemplate` - Pre-built system voices
- `ExpertProfile` - Expert users for project assignment
- `Subscription` - User subscription plans (Stripe)
- `UsageLog` - Usage tracking and rate limiting

**Key relationships:**
```
User (1) ──→ (many) Voice
User (1) ──→ (many) Audio
User (1) ──→ (many) Project
Voice (1) ──→ (many) Audio (via voiceId)
Project (many) ↔ (many) Audio (via ProjectAudio)
User (1) ──→ (0-1) ExpertProfile
ExpertProfile (1) ──→ (many) Project (assignments)
```

---

## ⚡ CRITICAL COMMANDS

### Development
```bash
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Production build (validates TypeScript & builds)
npm run start        # Start production server
npm run lint         # Run ESLint
npx tsc --noEmit     # TypeScript validation without emitting files
```

### Database (Prisma)
```bash
npx prisma generate       # Generate Prisma Client (REQUIRED after schema changes)
npx prisma studio         # Open Prisma Studio GUI at http://localhost:5555
npx prisma db push        # Push schema changes to DB without migration
npx prisma migrate dev    # Create and apply migration (production workflow)
npx prisma migrate deploy # Deploy migrations in production
```

**IMPORTANT:** After any change to `prisma/schema.prisma`:
1. Run `npx prisma generate` to regenerate types
2. Restart TypeScript server in your editor
3. Only then will TypeScript recognize new models/fields

### Testing & Validation
```bash
npx tsc --noEmit     # TypeScript type checking
npm run build        # Validates types + builds Next.js
```

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for complete command reference.

---

## 🎯 CORE CONCEPTS

### Voice Cloning & Generation

VoiceCraft enables users to:
1. **Clone Voices** - Upload audio samples to create custom voice clones via Replicate API
   - Uses Minimax Voice Cloning model (`minimax/voice-cloning`)
   - Supports models: `minimax-2.6-turbo`, `minimax-2.6-hd`, `speech-02-turbo`, `speech-02-hd`
   - Returns a `voice_id` that can be used for generation
   - Voice cloning is **async** - creates record with `status: 'processing'` first
2. **Generate Audio** - Convert text to speech using cloned or template voices
   - Uses the `voice_id` from cloned voices
   - Generates audio files uploaded to Vercel Blob storage
3. **Manage Audio** - Organize, download, and manage generated audio files
   - Stored in PostgreSQL with Vercel Blob URLs
   - Supports upload, generate, and import sources

**Key Implementation Details:**
- Voice cloning: `POST /api/voices/clone` → creates Voice with status → calls Replicate → updates with `voiceId`
- Audio generation: Uses voice's `voiceId` to generate speech
- All audio files uploaded to Vercel Blob with public access

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#core-concepts) for details.

### Project Management

Projects allow users to:
1. **Organize Audios** - Group related audio files via `ProjectAudio` junction table
2. **Get AI Estimates** - Use OpenAI to estimate project cost and duration
3. **Assign Experts** - Send projects to human audio experts (via `ExpertProfile`) for professional editing

See [docs/USER_FLOWS.md](docs/USER_FLOWS.md) for complete user journeys.

### Subscription & Credits (Planned)

**Note:** Subscription system is defined in schema but not yet implemented in business logic.

Users will be able to:
- **Free Tier** - Limited voice generations per month
- **Paid Plans** - Increased limits and premium features via Stripe
- **Credit System** - Pay-as-you-go for voice cloning and generation

---

## 🔒 SECURITY BEST PRACTICES

- NEVER commit `.env` or secrets
- Always validate input with Zod schemas
- Use parameterized queries (Prisma handles this)
- Implement CSRF protection on mutations
- Rate limit API routes
- Sanitize user content before display
- Use signed URLs for private audio assets
- Implement proper authentication checks
- Verify webhook signatures

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md#security) for complete guidelines.

---

## 📋 CODE PATTERNS

### Server Components (Default)

Server components fetch data directly using the App Router pattern:

```typescript
// ✅ Server Component - fetch data directly from API route
export default async function AudiosPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const response = await fetch(`${baseUrl}/api/audios`, {
    cache: 'no-store', // Disable caching for real-time data
  })
  const audios = await response.json()
  return <AudioList audios={audios} />
}
```

**Note:** Server components in this project fetch from API routes (not directly from Prisma) to maintain consistent data access patterns and enable proper error handling.

### Client Components (When Needed)

```typescript
// ✅ Client Component - for interactivity
"use client"
import { useState } from 'react'

export function AudioPlayer({ audioUrl }: Props) {
  const [playing, setPlaying] = useState(false)
  // Interactive logic here
}
```

### API Routes with Validation

Standard pattern used throughout the codebase:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// 1. Define Zod schema for validation
const AudioSchema = z.object({
  filename: z.string().min(1),
  audioUrl: z.string().url(),
  tags: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    // 2. Parse and validate request body
    const body = await request.json()
    const data = AudioSchema.parse(body)

    // 3. Get userId (currently placeholder, auth pending)
    const userId = 'temp-user-id' // TODO: Get from session

    // 4. Perform database operation
    const audio = await prisma.audio.create({
      data: { ...data, userId }
    })

    // 5. Return success response
    return NextResponse.json({ success: true, audio })

  } catch (error) {
    // 6. Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation failed',
        details: error.issues.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      }, { status: 400 })
    }

    // 7. Handle generic errors
    console.error('API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
```

### File Upload Pattern (Vercel Blob)

```typescript
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  // Upload to Vercel Blob
  const blob = await put(
    `audios/${userId}/${Date.now()}-${filename}`,
    file,
    { access: 'public', addRandomSuffix: true }
  )

  // Save URL to database
  await prisma.audio.create({
    data: { audioUrl: blob.url, userId, filename }
  })
}
```

### Replicate API Integration Pattern

```typescript
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

// Create DB record first with 'processing' status
const voice = await prisma.voice.create({
  data: { userId, name, status: 'processing' }
})

try {
  // Run async Replicate job
  const output = await replicate.run(
    `minimax/voice-cloning:${VERSION}`,
    { input: { voice_file: audioUrl } }
  )

  // Update with result
  await prisma.voice.update({
    where: { id: voice.id },
    data: { voiceId: output.voice_id, status: 'active' }
  })
} catch (error) {
  // Mark as failed on error
  await prisma.voice.update({
    where: { id: voice.id },
    data: { status: 'failed' }
  })
  throw error
}
```

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md#code-standards) for complete patterns.

---

## 🚨 COMMON ISSUES & TROUBLESHOOTING

### Prisma Client Not Generated
**Error:** `Cannot find module '@prisma/client'` or `Property 'audio' does not exist on type 'PrismaClient'`

**Solution:**
```bash
npx prisma generate
```

### Type Errors After Schema Change
**Error:** TypeScript doesn't recognize new Prisma models or fields

**Solution:**
```bash
npx prisma generate              # Regenerate Prisma Client types
# Then restart TypeScript server in your IDE:
# VSCode: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Build Errors
**Error:** Build fails or stale cache issues

**Solution:**
```bash
rm -rf .next                     # Clean Next.js build cache
rm -rf node_modules/.cache       # Clean build caches
npm run build                    # Rebuild from scratch
```

### Database Connection Issues
**Error:** `Can't reach database server` or connection timeout

**Solution:**
1. Check `DATABASE_URL` in `.env` is correct
2. Ensure PostgreSQL is running (if local)
3. Check network access (if remote database like Neon/Vercel)
4. Verify SSL settings in connection string

### Vercel Blob Upload Fails
**Error:** `Unauthorized` or blob upload errors

**Solution:**
1. Check `BLOB_READ_WRITE_TOKEN` is set in `.env`
2. Verify token has write permissions
3. Check file size (max 50MB as per code validation)

### Replicate API Issues
**Error:** Voice cloning fails or times out

**Solution:**
1. Verify `REPLICATE_API_TOKEN` is set and valid
2. Check Replicate API status: https://replicate.com/status
3. Verify audio file is accessible (public URL required)
4. Check voice record status in database (might be stuck in 'processing')

### TypeScript Strict Mode Errors
This project uses `strict: true` in tsconfig.json. Common fixes:

```typescript
// ❌ Bad - using 'any'
const data: any = await fetch(url)

// ✅ Good - proper typing
const response = await fetch(url)
const data: AudioResponse = await response.json()

// ❌ Bad - implicit any
function process(data) { }

// ✅ Good - explicit types
function process(data: Audio[]): void { }
```

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md#troubleshooting) for more.

---

## ✅ COMPLETION CRITERIA

Before marking any feature complete, verify:

- ✅ `npm run build` succeeds with zero errors
- ✅ `npx tsc --noEmit` passes (zero TypeScript errors)
- ✅ Manually tested in browser
- ✅ Loading states implemented for async operations
- ✅ Error handling with user-friendly messages
- ✅ Mobile responsive design
- ✅ Accessibility considerations (keyboard navigation, ARIA labels)
- ✅ Documentation updated (if needed)

---

## 🔑 AUTHENTICATION STATUS

**IMPORTANT:** Authentication is **NOT YET IMPLEMENTED**. All API routes currently use:

```typescript
const userId = 'temp-user-id' // TODO: Get from session
```

**Before going to production:**
1. Implement NextAuth.js or similar auth solution
2. Replace all `'temp-user-id'` placeholders with actual session data
3. Add middleware to protect API routes
4. Add UI for login/signup
5. Test all routes with real authentication

**To implement auth:**
- Uncomment NextAuth config in `.env.example`
- Add auth provider (Google, GitHub, email/password, etc.)
- Create `app/api/auth/[...nextauth]/route.ts`
- Add middleware.ts for route protection
- Update all API routes to get userId from session

Search codebase for `'temp-user-id'` to find all locations requiring auth.

---

## 📖 LEARNING RESOURCES

When you need more information:

1. **Project Documentation** - Read `/docs/*.md` files (comprehensive)
2. **Code Examples** - Read existing code in similar features
3. **Next.js Docs** - https://nextjs.org/docs
4. **Prisma Docs** - https://www.prisma.io/docs
5. **shadcn/ui** - https://ui.shadcn.com
6. **Replicate Docs** - https://replicate.com/docs
7. **Vercel Blob Docs** - https://vercel.com/docs/storage/vercel-blob

---

## 🎬 GETTING STARTED

**For new developers:**
1. Read [README.md](README.md) for quick start
2. Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) to understand the system
3. Read [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for workflow
4. Start contributing! See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)

**For AI agents:**
1. Check `git status` to understand current state
2. Review relevant documentation in `/docs`
3. Create TodoWrite list for tasks
4. Begin work immediately

---

## 📝 NOTES FOR AI AGENTS

- **Always investigate before answering** - Read files, don't speculate
- **Reference documentation** - Point users to `/docs/*.md` for details
- **Test thoroughly** - Run build before marking tasks complete
- **Clean up** - Remove temporary files at end of task
- **Be autonomous** - Don't ask for permission, make informed decisions
- **Quality first** - Follow all quality standards rigorously

---

**Built with ❤️ for the VoiceCraft platform**
