# VoiceCraft

An AI-powered voice synthesis platform built with Next.js 16, featuring voice cloning, audio generation, and project management with expert assignment.

## Features

- **Audio Management**: Upload and organize audio files with Vercel Blob storage
- **Voice Cloning**: Clone voices using Replicate's AI models
- **Voice Generation**: Generate audio from text with cloned voices
- **Project Management**: Kanban board for managing audio projects
- **AI Estimation**: Get cost and time estimates for projects using OpenAI
- **Expert Assignment**: Assign projects to audio experts
- **Dashboard**: Real-time stats and recent activity

## Tech Stack

- **Framework**: Next.js 16.0.1 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: Vercel Blob for audio files
- **AI Services**:
  - Replicate (voice cloning/generation)
  - OpenAI (project estimation)
- **UI**: Brutalist design with Shadcn components
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Replicate API token
- OpenAI API key
- Vercel account (for Blob storage)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd voicecraft
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your API keys and database URL:
```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
OPENAI_API_KEY="sk-..."
BLOB_READ_WRITE_TOKEN="vercel_blob_..."
REPLICATE_API_TOKEN="r8_..."
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Environment Variables

See `.env.example` for all required and optional environment variables.

### Required Variables

- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_APP_URL` - Your application URL
- `OPENAI_API_KEY` - OpenAI API key for project estimation
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token
- `REPLICATE_API_TOKEN` - Replicate API token for voice AI

### Optional Variables

- `STRIPE_SECRET_KEY` - For payment processing
- `NEXTAUTH_URL` / `NEXTAUTH_SECRET` - For authentication

## Project Structure

```
voicecraft/
├── app/
│   ├── api/              # API routes
│   │   ├── audios/       # Audio management
│   │   ├── voices/       # Voice management
│   │   └── projects/     # Project management
│   ├── dashboard/        # Dashboard pages
│   │   ├── audios/       # Audio library
│   │   ├── voices/       # Voice library
│   │   └── projects/     # Project kanban
│   └── page.tsx          # Landing page
├── components/
│   └── ui/               # Shadcn UI components
├── lib/
│   └── prisma.ts         # Prisma client
└── prisma/
    └── schema.prisma     # Database schema
```

## API Routes

### Audios
- `GET /api/audios` - List audios with pagination
- `POST /api/audios/upload` - Upload audio file
- `GET /api/audios/[id]` - Get audio details
- `PATCH /api/audios/[id]` - Update audio metadata
- `DELETE /api/audios/[id]` - Delete audio

### Voices
- `GET /api/voices` - List voices with pagination

### Projects
- `GET /api/projects` - List projects with pagination
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project details
- `PATCH /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project
- `POST /api/projects/[id]/estimate` - Get AI estimation
- `POST /api/projects/[id]/assign` - Assign expert
- `POST /api/projects/[id]/audios` - Add audios to project

## Development

### Database Migrations

After changing the Prisma schema:
```bash
npx prisma generate
npx prisma db push
```

### Build

```bash
npm run build
```

### Type Checking

```bash
npx tsc --noEmit
```

## Deploy on Vercel

1. Push your code to GitHub
2. Import the project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

The database should be set up with Vercel Postgres or Neon.

## License

MIT
