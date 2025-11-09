# 🔌 VoiceCraft API Reference

**Last Updated:** 2025-11-09

Complete reference for all API endpoints, request/response formats, and integration patterns.

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Common Patterns](#common-patterns)
4. [Voice Endpoints](#voice-endpoints)
5. [Audio Endpoints](#audio-endpoints)
6. [Project Endpoints](#project-endpoints)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)
9. [Webhooks](#webhooks)

---

## Overview

**Base URL:** `https://voicecraft.com/api` (production) or `http://localhost:3000/api` (development)

**Protocol:** HTTPS (required in production)

**Content-Type:** `application/json` (all requests except file uploads)

### API Design Principles

1. **RESTful** - Resource-based URLs with standard HTTP methods
2. **Type-Safe** - Zod validation on all inputs
3. **Consistent** - Uniform response format across all endpoints
4. **Paginated** - All list endpoints support pagination
5. **Queryable** - Flexible filtering and sorting on collections
6. **Documented** - OpenAPI/Swagger schema (coming soon)

### HTTP Methods

| Method | Purpose | Example |
|--------|---------|---------|
| GET | Retrieve resources | Get voice list |
| POST | Create resources | Clone new voice |
| PATCH | Update resources | Update project status |
| DELETE | Remove resources | Delete audio file |

---

## Authentication

**Status:** 🚧 Not yet implemented

**Planned:** NextAuth.js with JWT tokens

### Current Behavior

All endpoints currently use a hardcoded `temp-user-id` for development:

```typescript
// TODO: Get userId from session
const userId = 'temp-user-id'
```

### Future Implementation

```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const session = await getServerSession(authOptions)
if (!session) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

const userId = session.user.id
```

### Planned Headers

```http
Authorization: Bearer {jwt_token}
```

---

## Common Patterns

### Standard Response Format

**Success Response:**

```json
{
  "success": true,
  "data": {
    // Resource data
  },
  "pagination": {
    // Optional - only for list endpoints
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "hasMore": true
  }
}
```

**Error Response:**

```json
{
  "error": "Human-readable error message",
  "details": "Additional context or field-specific errors",
  "code": "ERROR_CODE" // Optional
}
```

### Pagination

All list endpoints support pagination with these query parameters:

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `page` | number | 1 | - | Page number (1-indexed) |
| `limit` | number | 20 | 100 | Items per page |

**Example:**

```http
GET /api/audios?page=2&limit=50
```

**Response includes pagination metadata:**

```json
{
  "success": true,
  "audios": [...],
  "pagination": {
    "total": 150,
    "page": 2,
    "limit": 50,
    "totalPages": 3,
    "hasMore": true
  }
}
```

### Sorting

List endpoints support sorting:

| Parameter | Type | Description |
|-----------|------|-------------|
| `sortBy` | string | Field to sort by |
| `sortOrder` | `asc` \| `desc` | Sort direction |

**Example:**

```http
GET /api/voices?sortBy=name&sortOrder=asc
```

### Filtering

Endpoints support resource-specific filters via query parameters.

**Example:**

```http
GET /api/audios?status=ready&voiceId=clv123&tags=podcast,narration
```

---

## Voice Endpoints

### List Voices

Get user's voice library with filtering and pagination.

```http
GET /api/voices
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max 100) |
| `sortBy` | `createdAt` \| `name` \| `language` | `createdAt` | Sort field |
| `sortOrder` | `asc` \| `desc` | `desc` | Sort direction |
| `status` | `active` \| `processing` \| `failed` | - | Filter by status |
| `language` | string | - | Filter by language (e.g., `en-US`) |
| `isCloned` | boolean | - | Filter cloned vs. preset voices |

**Example Request:**

```bash
curl -X GET "https://voicecraft.com/api/voices?status=active&sortBy=name" \
  -H "Authorization: Bearer {token}"
```

**Success Response (200):**

```json
{
  "success": true,
  "voices": [
    {
      "id": "clv7x9y8z0a1b2c3d4e5f6g7",
      "userId": "user_123",
      "name": "Professional Narrator",
      "description": "Deep, authoritative voice",
      "language": "en-US",
      "gender": "male",
      "ageGroup": "adult",
      "style": "professional",
      "voiceId": "minimax_voice_abc123",
      "sampleAudioUrl": "https://blob.voicecraft.com/samples/sample.mp3",
      "model": "speech-02-turbo",
      "isPublic": false,
      "isCloned": true,
      "isVerified": true,
      "status": "active",
      "createdAt": "2025-01-09T10:30:00Z",
      "updatedAt": "2025-01-09T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "hasMore": false
  }
}
```

---

### Clone Voice

Create a new custom voice from audio samples.

```http
POST /api/voices/clone
```

**Request Body:**

```json
{
  "userId": "user_123",
  "name": "My Custom Voice",
  "description": "A warm, friendly voice",
  "audioFileUrl": "https://blob.voicecraft.com/samples/my-sample.mp3",
  "model": "speech-02-turbo",
  "accuracy": 0.7,
  "noiseReduction": false,
  "normalizeVolume": true,
  "language": "en-US",
  "gender": "female",
  "ageGroup": "adult",
  "style": "conversational"
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | string | ✅ | User ID (from session) |
| `name` | string | ✅ | Display name (max 255 chars) |
| `description` | string | ❌ | Voice description |
| `audioFileUrl` | string (URL) | ✅ | Training audio URL (10+ seconds) |
| `model` | enum | ❌ | Model: `minimax-2.6-turbo`, `speech-02-turbo`, etc. |
| `accuracy` | number (0-1) | ❌ | Voice similarity (default: 0.7) |
| `noiseReduction` | boolean | ❌ | Apply noise reduction |
| `normalizeVolume` | boolean | ❌ | Normalize audio volume |
| `language` | string | ❌ | Language code (default: `en-US`) |
| `gender` | enum | ❌ | `male`, `female`, `neutral` |
| `ageGroup` | enum | ❌ | `child`, `young adult`, `adult`, `senior` |
| `style` | string | ❌ | Voice style |

**Example Request:**

```bash
curl -X POST "https://voicecraft.com/api/voices/clone" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_123",
    "name": "My Voice",
    "audioFileUrl": "https://blob.voicecraft.com/sample.mp3",
    "model": "speech-02-turbo",
    "language": "en-US"
  }'
```

**Success Response (200):**

```json
{
  "success": true,
  "voice": {
    "id": "clv7x9y8z0a1b2c3d4e5f6g7",
    "name": "My Voice",
    "voiceId": "minimax_voice_xyz789",
    "description": null,
    "language": "en-US",
    "model": "speech-02-turbo",
    "sampleAudioUrl": "https://blob.voicecraft.com/sample.mp3",
    "createdAt": "2025-01-09T10:35:00Z"
  },
  "metadata": {
    "model": "minimax/voice-cloning",
    "version": "fff8a670880f066d...",
    "settings": {
      "accuracy": 0.7,
      "noiseReduction": false,
      "normalizeVolume": true
    }
  }
}
```

**Error Responses:**

**400 - Validation Error:**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "name",
      "message": "Voice name is required"
    }
  ]
}
```

**500 - Configuration Error:**
```json
{
  "error": "Voice cloning service is not configured"
}
```

**429 - Rate Limit:**
```json
{
  "error": "Rate limit exceeded. Please try again later.",
  "retryAfter": 120
}
```

---

### Generate Voice

Convert text to speech using a voice (preset or custom).

```http
POST /api/voices/generate
```

**Request Body:**

```json
{
  "text": "Hello, welcome to VoiceCraft!",
  "voiceId": "Wise_Woman",
  "userId": "user_123",
  "emotion": "auto",
  "speed": 1.0,
  "pitch": 0,
  "volume": 1.0,
  "audioFormat": "mp3",
  "sampleRate": 32000,
  "languageBoost": "Automatic"
}
```

**Field Descriptions:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `text` | string | ✅ | - | Text to synthesize (max 10,000 chars) |
| `voiceId` | string | ❌ | `Wise_Woman` | Preset voice or custom voice ID |
| `userId` | string | ❌ | - | For custom voice verification |
| `emotion` | enum | ❌ | `auto` | `auto`, `happy`, `sad`, `angry`, `excited`, `calm`, `serious`, `friendly` |
| `speed` | number (0.5-2.0) | ❌ | 1.0 | Playback speed |
| `pitch` | number (-12 to 12) | ❌ | 0 | Pitch adjustment (semitones) |
| `volume` | number (0-10) | ❌ | 1.0 | Volume level |
| `audioFormat` | enum | ❌ | `mp3` | `mp3`, `wav`, `flac`, `pcm` |
| `sampleRate` | number | ❌ | 32000 | 16000, 22050, 24000, 32000, 44100, 48000 |
| `languageBoost` | string | ❌ | `Automatic` | Language optimization |

**Example Request:**

```bash
curl -X POST "https://voicecraft.com/api/voices/generate" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Welcome to our platform!",
    "voiceId": "Wise_Woman",
    "emotion": "friendly",
    "speed": 1.1
  }'
```

**Success Response (200):**

```json
{
  "success": true,
  "audioUrl": "https://replicate.delivery/pbxt/abc123.mp3",
  "metadata": {
    "characterCount": 25,
    "model": "minimax/speech-02-turbo",
    "version": "e2e8812b45eefa93...",
    "isCustomVoice": false,
    "voiceName": null,
    "settings": {
      "voiceId": "Wise_Woman",
      "emotion": "friendly",
      "speed": 1.1,
      "pitch": 0,
      "volume": 1.0,
      "audioFormat": "mp3",
      "sampleRate": 32000
    }
  }
}
```

**Health Check:**

```http
GET /api/voices/generate
```

**Response:**

```json
{
  "status": "operational",
  "service": "voice-generation",
  "model": "minimax/speech-02-turbo",
  "version": "e2e8812b45eefa93...",
  "configured": true
}
```

---

## Audio Endpoints

### List Audios

Get user's audio library with advanced filtering.

```http
GET /api/audios
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max 100) |
| `sortBy` | `createdAt` \| `filename` \| `duration` \| `fileSize` | `createdAt` | Sort field |
| `sortOrder` | `asc` \| `desc` | `desc` | Sort direction |
| `status` | `ready` \| `processing` \| `failed` | - | Filter by status |
| `voiceId` | string | - | Filter by voice |
| `search` | string | - | Search in filename/description |
| `tags` | string | - | Comma-separated tags (OR search) |

**Example Request:**

```bash
curl -X GET "https://voicecraft.com/api/audios?status=ready&tags=podcast,narration&search=intro" \
  -H "Authorization: Bearer {token}"
```

**Success Response (200):**

```json
{
  "success": true,
  "audios": [
    {
      "id": "aud_abc123",
      "userId": "user_123",
      "filename": "podcast-intro.mp3",
      "audioUrl": "https://blob.voicecraft.com/audios/user_123/1704801234-podcast-intro.mp3",
      "duration": 45.5,
      "fileSize": 1024000,
      "format": "mp3",
      "voiceId": "clv_xyz789",
      "voice": {
        "id": "clv_xyz789",
        "name": "Professional Narrator",
        "language": "en-US"
      },
      "text": "Welcome to our podcast!",
      "metadata": {
        "speed": 1.0,
        "emotion": "friendly"
      },
      "uploadSource": "generate",
      "tags": ["podcast", "intro"],
      "description": "Podcast opening",
      "status": "ready",
      "projectAudios": [
        {
          "project": {
            "id": "proj_abc",
            "name": "Season 1 Episodes"
          }
        }
      ],
      "createdAt": "2025-01-09T10:00:00Z",
      "updatedAt": "2025-01-09T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "totalPages": 3,
    "hasMore": true
  }
}
```

---

### Upload Audio

Upload audio file to Vercel Blob storage.

```http
POST /api/audios/upload
```

**Content-Type:** `multipart/form-data`

**Form Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | ✅ | Audio file (max 50MB) |
| `metadata` | JSON string | ❌ | Additional metadata |

**Allowed File Types:**
- `audio/mpeg` (MP3)
- `audio/wav` (WAV)
- `audio/ogg` (OGG)
- `audio/webm` (WebM)

**Metadata JSON:**

```json
{
  "filename": "custom-name.mp3",
  "tags": ["podcast", "episode-1"],
  "description": "Episode 1 audio"
}
```

**Example Request:**

```bash
curl -X POST "https://voicecraft.com/api/audios/upload" \
  -H "Authorization: Bearer {token}" \
  -F "file=@/path/to/audio.mp3" \
  -F 'metadata={"tags":["podcast"],"description":"Episode 1"}'
```

**Success Response (200):**

```json
{
  "success": true,
  "audio": {
    "id": "aud_new123",
    "userId": "user_123",
    "filename": "audio.mp3",
    "audioUrl": "https://blob.voicecraft.com/audios/user_123/1704801500-audio-abc.mp3",
    "duration": null,
    "fileSize": 2048000,
    "format": "mp3",
    "uploadSource": "upload",
    "tags": ["podcast"],
    "description": "Episode 1",
    "status": "ready",
    "createdAt": "2025-01-09T10:05:00Z",
    "updatedAt": "2025-01-09T10:05:00Z"
  },
  "blob": {
    "url": "https://blob.voicecraft.com/audios/user_123/1704801500-audio-abc.mp3",
    "pathname": "audios/user_123/1704801500-audio-abc.mp3",
    "downloadUrl": "https://blob.voicecraft.com/audios/user_123/1704801500-audio-abc.mp3?download=1"
  }
}
```

**Error Responses:**

**400 - No file:**
```json
{
  "error": "No file provided"
}
```

**400 - Invalid file type:**
```json
{
  "error": "Invalid file type",
  "details": "File type must be one of: audio/mpeg, audio/wav, audio/ogg, audio/webm"
}
```

**400 - File too large:**
```json
{
  "error": "File too large",
  "details": "File size must be less than 50MB"
}
```

---

### Get Audio

Get single audio file details.

```http
GET /api/audios/{id}
```

**Success Response (200):**

```json
{
  "success": true,
  "audio": {
    "id": "aud_abc123",
    // ... full audio object
  }
}
```

**404 - Not Found:**

```json
{
  "error": "Audio not found"
}
```

---

### Delete Audio

Delete an audio file.

```http
DELETE /api/audios/{id}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Audio deleted successfully"
}
```

---

## Project Endpoints

### List Projects

Get user's projects with filtering for Kanban board.

```http
GET /api/projects
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max 100) |
| `sortBy` | `createdAt` \| `name` \| `deadline` \| `priority` | `createdAt` | Sort field |
| `sortOrder` | `asc` \| `desc` | `desc` | Sort direction |
| `status` | `draft` \| `estimating` \| `waiting_for_estimate_accept` \| `waiting_for_assignment` \| `assigned` \| `in_review` \| `completed` \| `refunded` \| `cancelled` | - | Filter by status |
| `expertId` | string | - | Filter by assigned expert |
| `search` | string | - | Search in name/description |

**Example Request:**

```bash
curl -X GET "https://voicecraft.com/api/projects?status=in_progress&sortBy=deadline" \
  -H "Authorization: Bearer {token}"
```

**Success Response (200):**

```json
{
  "success": true,
  "projects": [
    {
      "id": "proj_abc123",
      "userId": "user_123",
      "name": "Podcast Season 1",
      "description": "All episodes for season 1",
      "status": "assigned",
      "request": "Please edit podcast episodes with noise reduction and mastering",
      "estimatedCost": 500.00,
      "estimatedDuration": 8.5,
      "actualCost": null,
      "estimationData": {
        "breakdown": {
          "editing": 4.5,
          "mastering": 2.0,
          "mixing": 2.0
        }
      },
      "expertId": "exp_xyz789",
      "expert": {
        "id": "exp_xyz789",
        "user": {
          "name": "John Doe",
          "email": "john@example.com"
        },
        "specialization": ["audio-editing", "voice-over"],
        "rating": 4.8,
        "completedJobs": 42
      },
      "instructions": "Apply noise reduction and normalize volume",
      "deadline": "2025-01-20T00:00:00Z",
      "assignedAt": "2025-01-08T14:00:00Z",
      "submittedAt": null,
      "reviewedAt": null,
      "rating": null,
      "feedback": null,
      "priority": "high",
      "tags": ["podcast", "season-1"],
      "projectAudios": [
        {
          "id": "pa_123",
          "audioId": "aud_abc",
          "order": 0,
          "status": "completed"
        }
      ],
      "_count": {
        "projectAudios": 10
      },
      "createdAt": "2025-01-05T10:00:00Z",
      "updatedAt": "2025-01-09T10:00:00Z",
      "completedAt": null
    }
  ],
  "pagination": {
    "total": 8,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "hasMore": false
  }
}
```

---

### Create Project

Create a new project with optional audios.

```http
POST /api/projects
```

**Request Body:**

```json
{
  "name": "New Podcast",
  "description": "Audio for new podcast series",
  "audioIds": ["aud_abc123", "aud_def456"],
  "tags": ["podcast", "education"],
  "priority": "medium"
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Project name (max 200 chars) |
| `description` | string | ❌ | Project description |
| `audioIds` | string[] | ❌ | Audio IDs to add to project |
| `tags` | string[] | ❌ | Project tags |
| `priority` | enum | ❌ | `low`, `medium` (default), `high`, `urgent` |

**Example Request:**

```bash
curl -X POST "https://voicecraft.com/api/projects" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Podcast",
    "description": "Educational podcast",
    "audioIds": ["aud_abc123"],
    "priority": "high"
  }'
```

**Success Response (200):**

```json
{
  "success": true,
  "project": {
    "id": "proj_new789",
    "userId": "user_123",
    "name": "New Podcast",
    "description": "Educational podcast",
    "status": "draft",
    "priority": "high",
    "tags": [],
    "projectAudios": [
      {
        "id": "pa_new123",
        "projectId": "proj_new789",
        "audioId": "aud_abc123",
        "order": 0,
        "status": "pending",
        "audio": {
          "id": "aud_abc123",
          "filename": "intro.mp3",
          "duration": 30.0,
          "audioUrl": "https://blob.voicecraft.com/..."
        },
        "createdAt": "2025-01-09T11:00:00Z"
      }
    ],
    "createdAt": "2025-01-09T11:00:00Z",
    "updatedAt": "2025-01-09T11:00:00Z",
    "completedAt": null
  }
}
```

**Error Response:**

**400 - Invalid audio IDs:**
```json
{
  "error": "Invalid audio IDs",
  "details": "One or more audio IDs not found or do not belong to you"
}
```

---

### Get Project

Get single project with all audios.

```http
GET /api/projects/{id}
```

**Success Response (200):**

```json
{
  "success": true,
  "project": {
    // ... full project object with projectAudios
  }
}
```

---

### Request AI Estimation

Get AI-powered cost and time estimate for project.

```http
POST /api/projects/{id}/estimate
```

**Request Body:**

```json
{
  "request": "Please edit all podcast episodes, apply noise reduction, normalize volume, and master for streaming platforms",
  "model": "gpt-4"
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `request` | string | ✅ | Detailed user request (10-5000 chars) |
| `model` | string | ❌ | OpenAI model (default: gpt-4) |

**Example Request:**

```bash
curl -X POST "https://voicecraft.com/api/projects/proj_abc123/estimate" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "request": "Edit podcast episodes with noise reduction",
    "model": "gpt-4"
  }'
```

**Success Response (200):**

```json
{
  "success": true,
  "project": {
    "id": "proj_abc123",
    "estimatedCost": 450.00,
    "estimatedDuration": 7.5,
    "estimationData": {
      "breakdown": {
        "editing": 4.0,
        "mixing": 2.0,
        "mastering": 1.5
      },
      "assumptions": [
        "Standard editing required",
        "Professional mastering"
      ]
    },
    "status": "waiting_for_estimate_accept",
    "request": "Edit podcast episodes with noise reduction"
  }
}
```

**Error Responses:**

**404 - Project not found:**
```json
{
  "error": "Project not found"
}
```

**400 - No audios:**
```json
{
  "error": "Cannot estimate project without audios"
}
```

**400 - Invalid status:**
```json
{
  "error": "Cannot estimate project",
  "details": "Project must be in draft status",
  "currentStatus": "completed"
}
```

**500 - OpenAI error:**
```json
{
  "error": "Estimation failed",
  "details": "OpenAI API error: ..."
}
```

---

### Accept Estimate

Accept the AI estimate and reserve credits for the project.

```http
POST /api/projects/{id}/estimate/accept
```

**Request Body:** None

**Example Request:**

```bash
curl -X POST "https://voicecraft.com/api/projects/proj_abc123/estimate/accept" \
  -H "Authorization: Bearer {token}"
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Estimate accepted and credits reserved",
  "project": {
    "id": "proj_abc123",
    "status": "waiting_for_assignment",
    "estimatedCost": 450.00
  },
  "creditsReserved": 45000,
  "newUserBalance": 55000
}
```

**Error Responses:**

**402 - Insufficient credits:**
```json
{
  "error": "Insufficient credits",
  "creditsNeeded": 45000,
  "creditsAvailable": 10000,
  "shortfall": 35000
}
```

**400 - Invalid status:**
```json
{
  "error": "Cannot accept estimate",
  "details": "Project must be in waiting_for_estimate_accept status",
  "currentStatus": "draft"
}
```

---

### Reject Estimate

Reject the estimate and return project to draft status.

```http
POST /api/projects/{id}/estimate/reject
```

**Request Body:**

```json
{
  "reason": "Estimate too high, need to adjust scope"
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reason` | string | ❌ | Reason for rejection |

**Example Request:**

```bash
curl -X POST "https://voicecraft.com/api/projects/proj_abc123/estimate/reject" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Need to reduce scope"}'
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Estimate rejected, project returned to draft",
  "project": {
    "id": "proj_abc123",
    "status": "draft",
    "estimatedCost": 450.00
  }
}
```

---

### Assign Expert to Project

Assign an expert to work on the project. **(Admin Only)**

```http
POST /api/projects/{id}/assign
```

**Request Body:**

```json
{
  "expertId": "exp_xyz789",
  "instructions": "Please apply noise reduction and normalize volume",
  "deadline": "2025-01-20T00:00:00Z"
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `expertId` | string (CUID) | ✅ | Expert profile ID |
| `instructions` | string | ❌ | Instructions for the expert |
| `deadline` | string (ISO 8601) | ❌ | Project deadline |

**Example Request:**

```bash
curl -X POST "https://voicecraft.com/api/projects/proj_abc123/assign" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "expertId": "exp_xyz789",
    "instructions": "Apply noise reduction",
    "deadline": "2025-01-20T00:00:00Z"
  }'
```

**Success Response (200):**

```json
{
  "success": true,
  "project": {
    "id": "proj_abc123",
    "expertId": "exp_xyz789",
    "instructions": "Apply noise reduction",
    "deadline": "2025-01-20T00:00:00Z",
    "assignedAt": "2025-01-09T12:00:00Z",
    "status": "assigned"
  }
}
```

**Error Responses:**

**400 - Invalid status:**
```json
{
  "error": "Project not ready",
  "details": "Project must be in waiting_for_assignment status to assign to an expert",
  "currentStatus": "draft"
}
```

**404 - Expert not found:**
```json
{
  "error": "Expert not found",
  "details": "Expert profile does not exist"
}
```

---

### Submit Work (Specialist)

Specialist submits completed work for review.

```http
POST /api/projects/{id}/submit
```

**Request Body:**

```json
{
  "audioIds": ["aud_completed1", "aud_completed2"],
  "notes": "Applied noise reduction and mastering as requested"
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `audioIds` | string[] (CUIDs) | ✅ | Completed audio file IDs (min 1) |
| `notes` | string | ❌ | Submission notes for the user |

**Example Request:**

```bash
curl -X POST "https://voicecraft.com/api/projects/proj_abc123/submit" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "audioIds": ["aud_123", "aud_456"],
    "notes": "Work completed as requested"
  }'
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Work submitted successfully",
  "project": {
    "id": "proj_abc123",
    "status": "in_review",
    "submittedAt": "2025-01-15T10:00:00Z",
    "estimationData": {
      "submissionNotes": "Work completed as requested",
      "submittedAudioIds": ["aud_123", "aud_456"]
    }
  }
}
```

**Error Responses:**

**403 - Not authorized:**
```json
{
  "error": "Not authorized",
  "details": "This project is not assigned to you"
}
```

**400 - Invalid status:**
```json
{
  "error": "Cannot submit work",
  "details": "Project must be in assigned status",
  "currentStatus": "draft"
}
```

---

### Approve Work

User approves completed work and pays the expert.

```http
POST /api/projects/{id}/approve
```

**Request Body:**

```json
{
  "rating": 5,
  "feedback": "Excellent work, sounds professional!"
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `rating` | number (1-5) | ✅ | Quality rating |
| `feedback` | string | ❌ | Written feedback |

**Example Request:**

```bash
curl -X POST "https://voicecraft.com/api/projects/proj_abc123/approve" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "feedback": "Great work!"
  }'
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Work approved and project completed",
  "project": {
    "id": "proj_abc123",
    "status": "completed",
    "completedAt": "2025-01-16T14:00:00Z",
    "reviewedAt": "2025-01-16T14:00:00Z",
    "rating": 5,
    "feedback": "Great work!",
    "actualCost": 450.00
  },
  "paymentCredits": 45000,
  "expertNewRating": 4.85
}
```

**Error Responses:**

**400 - Invalid status:**
```json
{
  "error": "Cannot approve work",
  "details": "Project must be in in_review status",
  "currentStatus": "assigned"
}
```

**400 - No expert assigned:**
```json
{
  "error": "No expert assigned",
  "details": "Cannot approve work for a project without an assigned expert"
}
```

---

### Request Changes

User requests revisions to submitted work.

```http
POST /api/projects/{id}/request-changes
```

**Request Body:**

```json
{
  "feedback": "Please remove background noise more aggressively in the intro section"
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `feedback` | string | ✅ | Detailed revision feedback (min 10 chars) |

**Example Request:**

```bash
curl -X POST "https://voicecraft.com/api/projects/proj_abc123/request-changes" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "feedback": "Please reduce background noise more"
  }'
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Changes requested, project returned to expert",
  "project": {
    "id": "proj_abc123",
    "status": "assigned",
    "reviewedAt": "2025-01-16T10:00:00Z",
    "feedback": "Please reduce background noise more",
    "estimationData": {
      "revisionHistory": [
        {
          "requestedAt": "2025-01-16T10:00:00Z",
          "feedback": "Please reduce background noise more"
        }
      ]
    }
  },
  "feedback": "Please reduce background noise more"
}
```

**Error Responses:**

**400 - Invalid status:**
```json
{
  "error": "Cannot request changes",
  "details": "Project must be in in_review status",
  "currentStatus": "completed"
}
```

---

### Re-estimate Project (Admin)

Admin requests new estimate for scope changes. **(Admin Only)**

```http
POST /api/projects/{id}/re-estimate
```

**Request Body:**

```json
{
  "newEstimate": 600.00,
  "reason": "User requested additional mastering for multiple formats",
  "adminNotes": "Approved by project manager"
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `newEstimate` | number | ✅ | New estimated cost in dollars |
| `reason` | string | ✅ | Reason for re-estimation (min 10 chars) |
| `adminNotes` | string | ❌ | Internal admin notes |

**Example Request:**

```bash
curl -X POST "https://voicecraft.com/api/projects/proj_abc123/re-estimate" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "newEstimate": 600.00,
    "reason": "Additional work requested"
  }'
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Re-estimation created",
  "project": {
    "id": "proj_abc123",
    "estimatedCost": 600.00,
    "feedback": "Re-estimation required: Additional work requested"
  },
  "originalEstimate": 450.00,
  "newEstimate": 600.00,
  "additionalCost": 150.00,
  "additionalCredits": 15000,
  "reason": "Additional work requested",
  "userHasEnoughCredits": true
}
```

**Error Responses:**

**400 - Invalid status:**
```json
{
  "error": "Cannot re-estimate",
  "details": "Project must be in assigned or in_review status",
  "currentStatus": "draft"
}
```

---

### Issue Refund (Admin)

Admin issues refund for cancelled or failed project. **(Admin Only)**

```http
POST /api/projects/{id}/refund
```

**Request Body:**

```json
{
  "reason": "Expert unavailable, refunding user",
  "refundAmount": 450.00,
  "adminNotes": "Full refund approved by support"
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reason` | string | ✅ | Reason for refund (min 10 chars) |
| `refundAmount` | number | ❌ | Specific refund amount (defaults to reservation amount) |
| `adminNotes` | string | ❌ | Internal admin notes |

**Example Request:**

```bash
curl -X POST "https://voicecraft.com/api/projects/proj_abc123/refund" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Project cancelled by user request"
  }'
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Refund issued successfully",
  "project": {
    "id": "proj_abc123",
    "status": "refunded",
    "completedAt": "2025-01-16T15:00:00Z",
    "feedback": "Refunded: Project cancelled by user request"
  },
  "creditsRefunded": 45000,
  "newUserBalance": 100000,
  "reason": "Project cancelled by user request"
}
```

**Error Responses:**

**400 - Already refunded:**
```json
{
  "error": "Already refunded",
  "details": "This project has already been refunded"
}
```

**400 - Cannot refund completed:**
```json
{
  "error": "Cannot refund completed project",
  "details": "Completed projects cannot be refunded without admin override"
}
```

**400 - Invalid refund amount:**
```json
{
  "error": "Invalid refund amount",
  "details": "Refund amount must be greater than 0"
}
```

---

### Add Audio to Project

Add an audio file to existing project.

```http
POST /api/projects/{id}/audios
```

**Request Body:**

```json
{
  "audioId": "aud_new456",
  "order": 5
}
```

**Success Response (200):**

```json
{
  "success": true,
  "projectAudio": {
    "id": "pa_new789",
    "projectId": "proj_abc123",
    "audioId": "aud_new456",
    "order": 5,
    "status": "pending",
    "createdAt": "2025-01-09T11:30:00Z"
  }
}
```

---

### Remove Audio from Project

Remove an audio file from project.

```http
DELETE /api/projects/{id}/audios/{audioId}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Audio removed from project"
}
```

---

## Error Handling

### Standard Error Codes

| HTTP Status | Meaning | When to Use |
|-------------|---------|-------------|
| 400 | Bad Request | Validation failed, invalid input |
| 401 | Unauthorized | Missing or invalid auth token |
| 402 | Payment Required | Insufficient credits or payment needed |
| 403 | Forbidden | Valid auth but no permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists (e.g., duplicate email) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |
| 502 | Bad Gateway | External service (Replicate, OpenAI) failed |
| 503 | Service Unavailable | Service temporarily down |

### Error Response Structure

```typescript
{
  error: string           // Human-readable message
  details?: any           // Additional context
  code?: string           // Error code for client logic
  retryAfter?: number     // Seconds to wait (rate limiting)
  field?: string          // Specific field that failed (validation)
}
```

### Zod Validation Errors

When request validation fails:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "text",
      "message": "Text is required"
    },
    {
      "field": "speed",
      "message": "Number must be greater than or equal to 0.5"
    }
  ]
}
```

### External Service Errors

**Replicate API Error:**

```json
{
  "error": "Voice generation failed",
  "details": "Replicate API error: Model timeout"
}
```

**OpenAI API Error:**

```json
{
  "error": "Estimation failed",
  "details": "OpenAI API error: Rate limit exceeded"
}
```

### Error Handling Best Practices

**Client-Side:**

```typescript
try {
  const response = await fetch('/api/voices/generate', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  const result = await response.json()

  if (!response.ok) {
    // Handle error
    if (response.status === 429) {
      // Rate limited - show retry message
      const retryAfter = result.retryAfter || 60
      showToast(`Rate limited. Please try again in ${retryAfter} seconds.`)
    } else if (response.status === 400 && result.details) {
      // Validation error - show field errors
      result.details.forEach(err => {
        showFieldError(err.field, err.message)
      })
    } else {
      // Generic error
      showToast(result.error || 'Something went wrong')
    }
    return
  }

  // Success
  const audio = result.audioUrl
} catch (error) {
  // Network error
  showToast('Network error. Please check your connection.')
}
```

---

## Rate Limiting

**Status:** 🚧 Not yet implemented

**Planned Implementation:**

### Rate Limits (per user)

| Endpoint | Limit | Window |
|----------|-------|--------|
| Voice Generation | 100 requests | 1 hour |
| Voice Cloning | 10 requests | 1 day |
| Audio Upload | 50 requests | 1 hour |
| AI Estimation | 20 requests | 1 hour |
| All Other APIs | 1000 requests | 1 hour |

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 73
X-RateLimit-Reset: 1704812400
```

### 429 Response

```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 120,
  "limit": 100,
  "window": "1 hour"
}
```

---

## Webhooks

**Status:** 🚧 Not yet implemented

**Planned Use Cases:**

### 1. Voice Cloning Complete

When async voice cloning finishes:

```json
{
  "event": "voice.cloned",
  "data": {
    "voiceId": "clv_abc123",
    "status": "active",
    "createdAt": "2025-01-09T12:00:00Z"
  }
}
```

### 2. Project Status Changed

When expert updates project:

```json
{
  "event": "project.status_changed",
  "data": {
    "projectId": "proj_abc123",
    "status": "completed",
    "expertId": "exp_xyz789"
  }
}
```

### 3. Stripe Payment Events

```json
{
  "event": "payment.succeeded",
  "data": {
    "userId": "user_123",
    "amount": 50.00,
    "credits": 500000
  }
}
```

### Webhook Security

**Signature Verification:**

```typescript
import crypto from 'crypto'

function verifyWebhook(body: string, signature: string, secret: string) {
  const hmac = crypto.createHmac('sha256', secret)
  const digest = hmac.update(body).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
}
```

---

## Related Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - System design overview
- [DATABASE.md](DATABASE.md) - Database schema and models
- [DEVELOPMENT.md](DEVELOPMENT.md) - Local development setup

---

**Questions?** See [CONTRIBUTING.md](CONTRIBUTING.md) for how to get help.
