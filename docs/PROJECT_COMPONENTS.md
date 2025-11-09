# Project Lifecycle Components Documentation

**Date:** 2025-11-09
**Purpose:** Complete documentation for project lifecycle UI components
**Design:** VoiceCraft Brutalist Design System

---

## 📦 Component Library

Location: `/components/project/`

All components follow the VoiceCraft brutalist design:
- Black borders (2px or 4px)
- Yellow (#EAB308) primary accent
- Bold, uppercase typography
- Sharp shadows (4px 4px 0 #000)
- High contrast (black/white/yellow)

---

## Components

### 1. EstimateCard

**Purpose:** Display AI estimate with acceptance/rejection flow
**User Type:** User (Project Owner)
**Location:** Project detail view, `/dashboard/projects/[id]`

**Props:**
```typescript
interface EstimateCardProps {
  projectId: string
  status: "pending" | "waiting" | "accepted" | "rejected"
  estimate?: {
    estimatedCost: number
    estimatedDuration: number
    breakdown?: {
      editing?: number
      mixing?: number
      mastering?: number
      [key: string]: number | undefined
    }
    assumptions?: string[]
  }
  userCredits: number
  onGetEstimate?: (request: string) => Promise<void>
  onAcceptEstimate?: () => Promise<void>
  onRejectEstimate?: (reason?: string) => Promise<void>
  loading?: boolean
}
```

**States:**

1. **pending** - Show "Get Estimate" button
   - Opens dialog for user to enter detailed request
   - Min 10 characters, max 5000 characters required

2. **waiting** - Show estimate with Accept/Reject buttons
   - Display cost in dollars and credits
   - Show duration in hours
   - Display breakdown if available
   - Display assumptions if available
   - Check user credit balance
   - Warning if insufficient credits
   - Accept reserves credits
   - Reject returns to draft

3. **accepted** - Show confirmed estimate
   - Green success state
   - Display cost and duration
   - Show credits reserved
   - Read-only view

**Example:**
```tsx
<EstimateCard
  projectId="proj_123"
  status="waiting"
  estimate={{
    estimatedCost: 450.00,
    estimatedDuration: 7.5,
    breakdown: {
      editing: 4.0,
      mixing: 2.0,
      mastering: 1.5,
    },
    assumptions: [
      "Standard editing required",
      "Professional mastering",
    ],
  }}
  userCredits={100000} // $1000
  onAcceptEstimate={async () => {
    await fetch(`/api/projects/${projectId}/estimate/accept`, {
      method: 'POST',
    })
  }}
  onRejectEstimate={async (reason) => {
    await fetch(`/api/projects/${projectId}/estimate/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  }}
/>
```

**API Connections:**
- `POST /api/projects/[id]/estimate` - Get estimate with user request
- `POST /api/projects/[id]/estimate/accept` - Accept and reserve credits
- `POST /api/projects/[id]/estimate/reject` - Reject and return to draft

---

### 2. CreditBalanceCard

**Purpose:** Display user's credit balance with warnings
**User Type:** User, Specialist, Admin
**Location:** Dashboard, Project views

**Props:**
```typescript
interface CreditBalanceCardProps {
  credits: number
  onAddCredits?: () => void
  onViewTransactions?: () => void
  recentTransactions?: {
    id: string
    type: "PROJECT_RESERVATION" | "PROJECT_COMPLETION" | "PROJECT_REFUND" | "CREDIT_PURCHASE"
    amount: number
    description: string
    createdAt: string
  }[]
  compact?: boolean
}
```

**Variants:**

1. **compact** - Sidebar/header version
   - Smaller display
   - Shows balance and warning badge
   - Add credits button

2. **full** - Dashboard version
   - Large balance display
   - Recent transactions list (max 5)
   - Warning states (low/critical)
   - Both action buttons

**Balance States:**
- **Normal:** credits >= 10000 ($100)
- **Low:** credits < 10000 ($100) - Orange warning
- **Critical:** credits < 1000 ($10) - Red alert

**Example:**
```tsx
{/* Compact version */}
<CreditBalanceCard
  credits={50000} // $500
  onAddCredits={() => router.push('/credits/purchase')}
  compact={true}
/>

{/* Full version */}
<CreditBalanceCard
  credits={50000}
  onAddCredits={() => router.push('/credits/purchase')}
  onViewTransactions={() => router.push('/credits/history')}
  recentTransactions={[
    {
      id: "txn_1",
      type: "PROJECT_RESERVATION",
      amount: -45000,
      description: "Reserved for Podcast Editing",
      createdAt: "2025-01-09T10:00:00Z",
    },
  ]}
/>
```

**API Connections:**
- `GET /api/user/credits` - Get current balance
- `GET /api/user/credits/transactions` - Get transaction history

---

### 3. ProjectStatusBadge

**Purpose:** Visual status indicator with tooltip
**User Type:** All
**Location:** Project cards, project detail, tables

**Props:**
```typescript
type ProjectStatus =
  | "draft"
  | "estimating"
  | "waiting_for_estimate_accept"
  | "waiting_for_assignment"
  | "assigned"
  | "in_review"
  | "completed"
  | "refunded"
  | "cancelled"

interface ProjectStatusBadgeProps {
  status: ProjectStatus
  showTooltip?: boolean
  className?: string
}
```

**Status Colors:**
| Status | Color | Icon |
|--------|-------|------|
| draft | Gray | RiDraftLine |
| estimating | Purple | RiLoader4Line (spinning) |
| waiting_for_estimate_accept | Yellow | RiTimeLine |
| waiting_for_assignment | Orange | RiUserAddLine |
| assigned | Blue | RiUserFollowLine |
| in_review | Cyan | RiEyeLine |
| completed | Green | RiCheckboxCircleLine |
| refunded | Red | RiRefund2Line |
| cancelled | Gray | RiCloseCircleLine |

**Example:**
```tsx
<ProjectStatusBadge
  status="in_review"
  showTooltip={true}
/>

{/* Get status config for custom use */}
import { getStatusConfig, getStatusColor } from "@/components/project"

const config = getStatusConfig("completed")
// Returns: { label, variant, icon, description, color }
```

**Helper Functions:**
- `getStatusConfig(status)` - Get complete config for a status
- `getStatusColor(status)` - Get Tailwind color classes for Kanban

---

### 4. WorkReviewCard

**Purpose:** Review submitted work and approve/request changes
**User Type:** User (Project Owner)
**Location:** Project detail view when status is `in_review`

**Props:**
```typescript
interface SubmittedWork {
  audioIds: string[]
  audios?: {
    id: string
    filename: string
    audioUrl: string
    duration?: number
  }[]
  notes?: string
  submittedAt: string
}

interface WorkReviewCardProps {
  projectId: string
  submittedWork: SubmittedWork
  expertName: string
  expertRating?: number
  onApprove: (rating: number, feedback?: string) => Promise<void>
  onRequestChanges: (feedback: string) => Promise<void>
  loading?: boolean
}
```

**Features:**
- Display expert's submission notes
- Audio player for each submitted file
- Approve button with 5-star rating
- Request changes button with feedback textarea
- Validation (rating 1-5 required, feedback min 10 chars)

**Example:**
```tsx
<WorkReviewCard
  projectId="proj_123"
  submittedWork={{
    audioIds: ["aud_1", "aud_2"],
    audios: [
      {
        id: "aud_1",
        filename: "episode-1-final.mp3",
        audioUrl: "https://blob.voicecraft.com/...",
        duration: 1800,
      },
    ],
    notes: "Applied noise reduction and mastering as requested",
    submittedAt: "2025-01-15T10:00:00Z",
  }}
  expertName="John Doe"
  expertRating={4.8}
  onApprove={async (rating, feedback) => {
    await fetch(`/api/projects/${projectId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ rating, feedback }),
    })
  }}
  onRequestChanges={async (feedback) => {
    await fetch(`/api/projects/${projectId}/request-changes`, {
      method: 'POST',
      body: JSON.stringify({ feedback }),
    })
  }}
/>
```

**API Connections:**
- `POST /api/projects/[id]/approve` - Approve work with rating
- `POST /api/projects/[id]/request-changes` - Request revisions

---

## 🎨 Design Guidelines

### Colors
```css
Primary Yellow: #EAB308
Black: #000000
White: #FFFFFF

Status Colors:
- Gray:   #94A3B8 (draft, cancelled)
- Purple: #A855F7 (estimating)
- Yellow: #EAB308 (waiting estimate accept)
- Orange: #FB923C (waiting assignment)
- Blue:   #3B82F6 (assigned)
- Cyan:   #06B6D4 (in_review)
- Green:  #22C55E (completed)
- Red:    #EF4444 (refunded)
```

### Typography
```css
Font: System font stack
Headings: Bold, uppercase
Body: Regular, sentence case
Labels: Bold, uppercase, small
```

### Borders
```css
Standard: 2px solid black
Emphasis: 4px solid black
Dashed: 2px dashed black (empty states)
```

### Shadows
```css
Card hover: 4px 4px 0 0 #000
Button active: None (flat on press)
```

---

## 📋 Usage Patterns

### Project Detail Page Flow

```tsx
import {
  EstimateCard,
  CreditBalanceCard,
  ProjectStatusBadge,
  WorkReviewCard,
} from "@/components/project"

export function ProjectDetail({ project, user }) {
  return (
    <div className="space-y-6">
      {/* Status Badge */}
      <ProjectStatusBadge status={project.status} />

      {/* Credit Balance (compact) */}
      <CreditBalanceCard credits={user.credits} compact={true} />

      {/* Show appropriate card based on status */}
      {project.status === "draft" && (
        <EstimateCard
          projectId={project.id}
          status="pending"
          userCredits={user.credits}
          onGetEstimate={handleGetEstimate}
        />
      )}

      {project.status === "waiting_for_estimate_accept" && (
        <EstimateCard
          projectId={project.id}
          status="waiting"
          estimate={project.estimationData}
          userCredits={user.credits}
          onAcceptEstimate={handleAccept}
          onRejectEstimate={handleReject}
        />
      )}

      {project.status === "in_review" && (
        <WorkReviewCard
          projectId={project.id}
          submittedWork={project.submittedWork}
          expertName={project.expert.user.name}
          expertRating={project.expert.rating}
          onApprove={handleApprove}
          onRequestChanges={handleRequestChanges}
        />
      )}
    </div>
  )
}
```

---

## 🔌 API Integration

All components connect to the project lifecycle API endpoints:

```typescript
// Get estimate
POST /api/projects/[id]/estimate
Body: { request: string }
Response: { project, estimationData }

// Accept estimate
POST /api/projects/[id]/estimate/accept
Response: { project, creditsReserved }

// Reject estimate
POST /api/projects/[id]/estimate/reject
Body: { reason?: string }
Response: { project }

// Approve work
POST /api/projects/[id]/approve
Body: { rating: number, feedback?: string }
Response: { project, paymentCredits, expertNewRating }

// Request changes
POST /api/projects/[id]/request-changes
Body: { feedback: string }
Response: { project, feedback }
```

---

## ✅ Testing Checklist

### EstimateCard
- [ ] Pending state shows request dialog
- [ ] Request validation (10-5000 chars)
- [ ] Waiting state shows full estimate
- [ ] Breakdown displays correctly
- [ ] Credit balance check works
- [ ] Insufficient credits warning shows
- [ ] Accept reserves credits
- [ ] Reject returns to draft
- [ ] Loading states work

### CreditBalanceCard
- [ ] Compact version displays correctly
- [ ] Full version shows transactions
- [ ] Low balance warning (< $100)
- [ ] Critical balance alert (< $10)
- [ ] Transaction types formatted correctly
- [ ] Buttons navigate correctly

### ProjectStatusBadge
- [ ] All 9 statuses display with correct colors
- [ ] Icons show correctly
- [ ] Estimating status animates
- [ ] Tooltips appear on hover
- [ ] Can disable tooltips

### WorkReviewCard
- [ ] Submitted audios list correctly
- [ ] Audio players work
- [ ] Expert notes display
- [ ] Rating stars work (1-5)
- [ ] Approve validation works
- [ ] Request changes validation (min 10 chars)
- [ ] Dialogs open/close correctly
- [ ] Loading states work

---

---

### 5. WorkSubmissionCard

**Purpose:** Specialist interface for submitting completed work
**User Type:** Specialist
**Location:** `/specialist/projects/[id]` when status is "assigned"

**Props:**
```typescript
interface WorkSubmissionCardProps {
  projectId: string
  projectName: string
  projectDescription?: string
  existingAudios: ProjectAudio[]
  onSubmit: (audioIds: string[], notes?: string) => Promise<void>
  loading?: boolean
}

interface ProjectAudio {
  id: string
  filename: string
  audioUrl: string
  duration?: number
}
```

**Features:**
- Upload multiple audio files via file input
- Auto-upload to /api/audios/upload
- Select/deselect audios for submission
- Remove newly uploaded audios
- Audio player for each file
- Optional submission notes textarea
- Validation (at least 1 audio required)
- Confirmation dialog before submission

**Example:**
```tsx
<WorkSubmissionCard
  projectId="proj_123"
  projectName="Podcast Editing Project"
  projectDescription="Edit 3 podcast episodes"
  existingAudios={[
    { id: "aud_1", filename: "episode-1.mp3", audioUrl: "..." }
  ]}
  onSubmit={async (audioIds, notes) => {
    await fetch(`/api/projects/${projectId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ audioIds, notes }),
    })
  }}
/>
```

**API Connections:**
- POST /api/audios/upload - Upload new audio files
- POST /api/projects/[id]/submit - Submit work with audio IDs

---

### 6. SpecialistProjectCard

**Purpose:** Compact project card for specialist dashboard
**User Type:** Specialist
**Location:** Specialist dashboard and projects list

**Props:**
```typescript
interface SpecialistProjectCardProps {
  id: string
  name: string
  description?: string
  status: ProjectStatus
  clientName: string
  estimatedDuration?: number
  estimatedCost?: number
  deadline?: string
  audioCount: number
  assignedAt?: string
  onClick?: () => void
}
```

**Features:**
- Client name display
- Duration and payment info
- Deadline with urgent badge (< 24h)
- Status-based action buttons
- Click to view details

**Example:**
```tsx
<SpecialistProjectCard
  id="proj_123"
  name="Podcast Editing"
  status="assigned"
  clientName="John Doe"
  estimatedDuration={5}
  estimatedCost={250}
  deadline="2025-01-15T10:00:00Z"
  audioCount={3}
  onClick={() => router.push(`/specialist/projects/${id}`)}
/>
```

---

### 7. RefundDialog

**Purpose:** Admin interface for refunding projects
**User Type:** Admin
**Location:** Admin project management pages

**Props:**
```typescript
interface RefundDialogProps {
  projectId: string
  projectName: string
  clientName: string
  reservedCredits: number
  onRefund: (reason: string) => Promise<void>
  loading?: boolean
  trigger?: React.ReactNode
}
```

**Features:**
- Warning about irreversible action
- Display refund amount in dollars and credits
- Required reason field (min 20 characters)
- Confirmation dialog
- Custom trigger button support

**Example:**
```tsx
<RefundDialog
  projectId="proj_123"
  projectName="Podcast Editing"
  clientName="John Doe"
  reservedCredits={45000} // $450
  onRefund={async (reason) => {
    await fetch(`/api/projects/${projectId}/refund`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  }}
/>
```

**API Connections:**
- POST /api/projects/[id]/refund - Refund project and return credits

---

### 8. ReEstimateDialog

**Purpose:** Admin interface for re-estimating projects
**User Type:** Admin
**Location:** Admin project management pages

**Props:**
```typescript
interface ReEstimateDialogProps {
  projectId: string
  projectName: string
  clientName: string
  currentEstimate?: {
    cost: number
    duration: number
  }
  onReEstimate: (reason: string) => Promise<void>
  loading?: boolean
  trigger?: React.ReactNode
}
```

**Features:**
- Display current estimate
- Warning about status change
- Required reason field (min 20 characters)
- Confirmation dialog
- Custom trigger button support

**Example:**
```tsx
<ReEstimateDialog
  projectId="proj_123"
  projectName="Podcast Editing"
  clientName="John Doe"
  currentEstimate={{ cost: 450, duration: 7.5 }}
  onReEstimate={async (reason) => {
    await fetch(`/api/projects/${projectId}/re-estimate`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  }}
/>
```

**API Connections:**
- POST /api/projects/[id]/re-estimate - Generate new estimate

---

### 9. ProjectDataTable

**Purpose:** Comprehensive data table for admin project management
**User Type:** Admin
**Location:** `/admin/projects`

**Props:**
```typescript
interface ProjectDataTableProps {
  projects: ProjectTableRow[]
  onViewProject: (projectId: string) => void
  onAssignExpert?: (projectId: string) => void
  onRefund: (projectId: string, reason: string) => Promise<void>
  onReEstimate: (projectId: string, reason: string) => Promise<void>
  loading?: boolean
}

interface ProjectTableRow {
  id: string
  name: string
  status: ProjectStatus
  clientName: string
  clientEmail: string
  expertName?: string
  estimatedCost?: number
  actualCost?: number
  createdAt: string
  assignedAt?: string
  completedAt?: string
  priority: "low" | "medium" | "high" | "urgent"
}
```

**Features:**
- Search by project name, client, or expert
- Filter by status and priority
- Sortable columns
- Row actions dropdown menu
- Inline RefundDialog and ReEstimateDialog
- Priority badges
- Status badges
- Click row to view details

**Example:**
```tsx
<ProjectDataTable
  projects={allProjects}
  onViewProject={(id) => router.push(`/dashboard/projects`)}
  onAssignExpert={(id) => openAssignDialog(id)}
  onRefund={async (id, reason) => {
    await refundProject(id, reason)
  }}
  onReEstimate={async (id, reason) => {
    await reEstimateProject(id, reason)
  }}
/>
```

---

## 🏗️ Dashboard Implementations

### User Dashboard

**Location:** `/dashboard/projects`
**Status:** ✅ Complete

**Features:**
- 7-column Kanban board
- EstimateCard for draft/waiting states
- WorkReviewCard for in_review state
- All API handlers connected
- Loading states
- Error handling

### Specialist Dashboard

**Location:** `/specialist`
**Status:** ✅ Complete

**Pages:**
- `/specialist` - Dashboard with stats
- `/specialist/projects` - Project list with filters
- `/specialist/projects/[id]` - Project detail with WorkSubmissionCard

**Features:**
- Active/completed project counts
- Earnings tracking
- Rating display
- Project filtering by status
- Audio submission workflow

### Admin Dashboard

**Location:** `/admin`
**Status:** ✅ Complete

**Pages:**
- `/admin` - Dashboard with platform stats
- `/admin/projects` - ProjectDataTable with full management
- `/admin/users` - Placeholder for user management
- `/admin/specialists` - Placeholder for specialist management
- `/admin/financials` - Placeholder for financial reports

**Features:**
- Platform-wide statistics
- Project management with refund/re-estimate
- Quick action navigation
- Export functionality (placeholder)

---

## 📝 Next Steps

1. ✅ All Phase 1 components created
2. ✅ Update `/dashboard/projects` to use new components
3. ✅ Create Specialist dashboard components
4. ✅ Create Admin dashboard components
5. ⏳ Implement specialist API endpoints
6. ⏳ Implement admin API endpoints
7. ⏳ Add messaging system
8. ⏳ Integrate Stripe for credit purchases
9. ⏳ Complete user/specialist/financial management pages

---

**Document Version:** 2.0
**Last Updated:** 2025-11-09 (Phase 1, 2, 3 complete)
