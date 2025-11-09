# Project Lifecycle Comparison: VoiceCraft vs ReelMatic

**Date:** 2025-11-09
**Purpose:** Identify gaps and missing features in VoiceCraft project lifecycle compared to ReelMatic

---

## Executive Summary

VoiceCraft has **basic project management** with estimation and assignment capabilities, but is missing several critical workflow features that ReelMatic has implemented, particularly around:
- ✅ **Estimate acceptance workflow** - User must explicitly accept/reject estimates
- ✅ **Credit reservation system** - Reserve credits when estimate is accepted
- ✅ **Work submission and review** - Executor submits work, user reviews
- ✅ **Re-estimation flow** - Handle scope changes mid-project
- ✅ **Refund system** - Issue refunds for cancelled/failed projects

---

## Status Flow Comparison

### VoiceCraft Current Status Flow

```
DRAFT → ESTIMATING → READY → IN_PROGRESS → COMPLETED
                              ↓
                          CANCELLED
```

**Status Values:**
- `draft` - Initial state
- `estimating` - AI generating estimate
- `ready` - Estimate complete, ready to assign
- `in_progress` - Assigned to expert, work in progress
- `completed` - Work finished
- `cancelled` - Project cancelled

### ReelMatic Status Flow (More Complete)

```
DRAFT → ESTIMATING → WAITING_FOR_ESTIMATE_ACCEPT → ESTIMATE_ACCEPTED
                              ↓                            ↓
                            DRAFT                  WAITING_FOR_ASSIGNMENT
                                                           ↓
                                                       ASSIGNED
                                                           ↓
                                                      IN_REVIEW
                                                    ↙    ↓    ↘
                                            ASSIGNED COMPLETED REFUNDED
                                                           ↓
                                                      CANCELLED
```

**Status Values:**
- `DRAFT` - Initial state, no request yet
- `ESTIMATING` - AI generating estimate
- `WAITING_FOR_ESTIMATE_ACCEPT` - **⚠️ MISSING IN VOICECRAFT** - Estimate ready, waiting for user acceptance
- `ESTIMATE_ACCEPTED` - **⚠️ MISSING IN VOICECRAFT** - User accepted estimate
- `WAITING_FOR_ASSIGNMENT` - **⚠️ MISSING IN VOICECRAFT** - Waiting for admin to assign
- `ASSIGNED` - **⚠️ MISSING IN VOICECRAFT** - Assigned to executor
- `IN_REVIEW` - **⚠️ MISSING IN VOICECRAFT** - Work submitted for review
- `COMPLETED` - Project completed
- `CANCELLED` - Project cancelled
- `REFUNDED` - **⚠️ MISSING IN VOICECRAFT** - Refund issued

---

## API Endpoints Comparison

### ✅ VoiceCraft HAS (6 endpoints)

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/projects` | GET | List all projects | ✅ Implemented |
| `/api/projects` | POST | Create new project | ✅ Implemented |
| `/api/projects/[id]` | GET | Get project details | ✅ Implemented |
| `/api/projects/[id]` | PATCH | Update project | ✅ Implemented |
| `/api/projects/[id]` | DELETE | Delete project | ✅ Implemented |
| `/api/projects/[id]/estimate` | POST | Get AI estimation | ✅ Implemented |
| `/api/projects/[id]/assign` | POST | Assign to expert | ✅ Implemented |
| `/api/projects/[id]/audios` | POST | Add audios to project | ✅ Implemented |
| `/api/projects/[id]/audios/[audioId]` | DELETE | Remove audio from project | ✅ Implemented |

### ❌ VoiceCraft MISSING (7 critical endpoints)

| Endpoint | Method | Purpose | Priority | ReelMatic Has? |
|----------|--------|---------|----------|----------------|
| `/api/projects/[id]/estimate/accept` | POST | **Accept estimate & reserve credits** | 🔴 HIGH | ✅ Yes |
| `/api/projects/[id]/estimate/reject` | POST | **Reject estimate, return to draft** | 🟡 MEDIUM | ✅ Yes |
| `/api/projects/[id]/submit` | POST | **Executor submits work** | 🔴 HIGH | ✅ Yes |
| `/api/projects/[id]/approve` | POST | **User approves work** | 🔴 HIGH | ✅ Yes |
| `/api/projects/[id]/request-changes` | POST | **User requests revisions** | 🔴 HIGH | ✅ Yes |
| `/api/projects/[id]/re-estimate` | POST | **Admin requests new estimate** | 🟡 MEDIUM | ✅ Yes |
| `/api/projects/[id]/refund` | POST | **Issue refund** | 🟡 MEDIUM | ✅ Yes |

---

## Database Schema Comparison

### VoiceCraft Project Model

```prisma
model Project {
  id                String   @id @default(cuid())
  userId            String
  name              String
  description       String?  @db.Text
  status            String   @default("draft")

  // Estimation
  estimatedCost     Float?   // ✅ Has this
  estimatedDuration Float?   // ✅ Has this
  estimationData    Json?    // ✅ Has this

  // Assignment
  expertId          String?  // ✅ Has this
  instructions      String?  @db.Text
  deadline          DateTime?

  // Metadata
  priority          String   @default("medium")
  tags              String[]

  // MISSING:
  // ❌ actualCost (final cost after completion)
  // ❌ estimatedVideos/audios count
  // ❌ assignedAt timestamp
  // ❌ request field (user's detailed request)

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  completedAt       DateTime?
}
```

### ReelMatic Project Model (More Complete)

```prisma
model Project {
  id                String   @id @default(cuid())
  userId            String
  title             String                    // ✅ VoiceCraft uses "name"
  description       String?  @db.Text         // ✅ VoiceCraft has this
  request           String?  @db.Text         // ❌ MISSING - detailed user request
  status            String   @default("DRAFT")

  // Estimation
  estimatedCost     Int?                      // ✅ VoiceCraft has (as Float)
  actualCost        Int?                      // ❌ MISSING
  estimatedVideos   Int?                      // ❌ MISSING
  estimateBreakdown Json?                     // ✅ VoiceCraft has as "estimationData"

  // Assignment
  assignedEditorId  String?                   // ✅ VoiceCraft has as "expertId"
  assignedAt        DateTime?                 // ❌ MISSING

  // Additional fields
  // ... similar to VoiceCraft
}
```

---

## Credit System Integration

### ⚠️ CRITICAL MISSING FEATURE

ReelMatic has a **complete credit reservation and payment system**:

1. **When estimate is accepted:**
   - Check if user has enough credits
   - If not: show Stripe payment modal
   - Once credits available: create credit ledger entry
   - Deduct `estimatedCost` from user credits
   - Record transaction with type `PROJECT_RESERVATION`

2. **When project completes:**
   - Create credit ledger entry for executor payment
   - Calculate actual cost
   - Pay executor

3. **When project is refunded:**
   - Create credit ledger entry to return credits to user
   - Update status to `REFUNDED`

**VoiceCraft Status:** ❌ **NOT IMPLEMENTED**
- No credit reservation on estimate acceptance
- No credit payment on completion
- No refund system
- Subscription schema exists but not integrated with projects

---

## User Actions Comparison

### ✅ VoiceCraft User Can Do:

1. ✅ Create project
2. ✅ Get AI estimation
3. ✅ Assign expert (currently anyone can assign - should be admin only)
4. ✅ Add/remove audios
5. ✅ Update project details
6. ✅ Delete project

### ❌ VoiceCraft User CANNOT Do (but should):

1. ❌ **Accept or reject estimate** - Goes directly from estimation to ready
2. ❌ **See if they have enough credits** - No credit check
3. ❌ **Purchase credits if insufficient** - No payment integration with projects
4. ❌ **Review submitted work** - No review workflow
5. ❌ **Approve work or request changes** - No approval flow
6. ❌ **Rate executor after completion** - No rating system
7. ❌ **Request refund** - No refund flow

---

## Admin/Expert Actions Comparison

### ✅ VoiceCraft Admin Can Do:

1. ✅ View all projects
2. ✅ Assign experts

### ❌ VoiceCraft Admin CANNOT Do (but should):

1. ❌ **See unassigned projects queue** - No filter/view for `WAITING_FOR_ASSIGNMENT`
2. ❌ **Request re-estimation** - No scope change handling
3. ❌ **Issue refunds** - No refund system
4. ❌ **Manually adjust status** - Status changes are code-driven only
5. ❌ **View credit transaction log** - No credit integration

### ✅ VoiceCraft Expert Can Do:

Currently, experts are defined in schema but have no special permissions/actions.

### ❌ VoiceCraft Expert CANNOT Do (but should):

1. ❌ **View assigned projects** - No expert dashboard/view
2. ❌ **Submit work** - No submission endpoint
3. ❌ **Communicate with user** - No messaging system
4. ❌ **Upload deliverables** - No deliverable upload system

---

## Notification System

### ReelMatic Has:
- ✅ Email notifications for all status changes
- ✅ In-app notifications
- ✅ Real-time updates via WebSocket

### VoiceCraft Has:
- ❌ No notification system implemented
- ⚠️ TODOs in code: "Send notification email to expert"

---

## Missing Endpoints - Implementation Priority

### 🔴 **HIGH Priority** (Core Workflow)

These are **blocking features** for a complete project lifecycle:

1. **`POST /api/projects/[id]/estimate/accept`**
   - Accept estimate and reserve credits
   - Check credit balance
   - Create credit ledger entry
   - Status: `ready` → `waiting_for_assignment` or directly to `assigned`

2. **`POST /api/projects/[id]/submit`** (Executor action)
   - Upload deliverables
   - Status: `in_progress` → `in_review`
   - Notify user

3. **`POST /api/projects/[id]/approve`** (User action)
   - Approve work
   - Pay executor
   - Status: `in_review` → `completed`

4. **`POST /api/projects/[id]/request-changes`** (User action)
   - Request revisions
   - Status: `in_review` → `in_progress`
   - Notify executor

### 🟡 **MEDIUM Priority** (Enhanced Workflow)

5. **`POST /api/projects/[id]/estimate/reject`**
   - Reject estimate
   - Status: `waiting_for_estimate_accept` → `draft`

6. **`POST /api/projects/[id]/re-estimate`** (Admin action)
   - Request new estimate for scope changes
   - Charge additional credits if accepted

7. **`POST /api/projects/[id]/refund`** (Admin action)
   - Issue refund
   - Return credits to user
   - Status: any → `refunded`

---

## Schema Updates Needed

### Update Project Model

```prisma
model Project {
  // ... existing fields ...

  // Add these:
  request           String?  @db.Text  // Detailed user request for estimation
  actualCost        Float?              // Final actual cost (vs estimated)
  assignedAt        DateTime?           // When expert was assigned
  submittedAt       DateTime?           // When work was submitted
  reviewedAt        DateTime?           // When user reviewed work

  // Update status enum to include new states
  status String @default("draft")
  // Possible values: draft, estimating, waiting_for_estimate_accept,
  //                  estimate_accepted, waiting_for_assignment, assigned,
  //                  in_review, completed, cancelled, refunded
}
```

### Create CreditLedger Model (if not exists)

```prisma
model CreditLedger {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])

  amount      Int      // Positive for additions, negative for deductions
  type        String   // PROJECT_RESERVATION, PROJECT_COMPLETION, PROJECT_REFUND, etc.
  description String

  projectId   String?
  project     Project? @relation(fields: [projectId], references: [id])

  createdAt   DateTime @default(now())

  @@index([userId])
  @@index([projectId])
  @@index([type])
}
```

---

## Next Steps - Implementation Roadmap

### Phase 1: Estimate Acceptance Flow (1-2 days)

1. Add `WAITING_FOR_ESTIMATE_ACCEPT` status
2. Modify `/estimate` endpoint to set status to `WAITING_FOR_ESTIMATE_ACCEPT`
3. Create `/estimate/accept` endpoint with credit reservation
4. Create `/estimate/reject` endpoint
5. Add credit balance check

### Phase 2: Work Submission & Review (2-3 days)

1. Add `IN_REVIEW` status
2. Create `/submit` endpoint for executors
3. Create `/approve` endpoint for users
4. Create `/request-changes` endpoint
5. Add deliverable upload functionality

### Phase 3: Enhanced Features (2-3 days)

1. Add `/re-estimate` endpoint
2. Add `/refund` endpoint
3. Implement credit ledger system
4. Add notification emails

### Phase 4: Admin Dashboard (1-2 days)

1. Unassigned projects queue
2. Re-estimation interface
3. Refund management
4. Credit transaction logs

---

## Conclusion

VoiceCraft has the **foundation** for project management with estimation and assignment, but is missing **critical workflow features** for a complete project lifecycle:

### ✅ What Works:
- Basic project CRUD
- AI estimation with OpenAI
- Expert assignment
- Audio attachment

### ❌ What's Missing:
- **Estimate acceptance workflow** (user must accept before assignment)
- **Credit reservation system** (no payment integration)
- **Work submission and review** (no executor → user feedback loop)
- **Refund system** (no way to handle cancellations)
- **Notification system** (no emails/alerts)
- **Re-estimation** (no scope change handling)

**Recommendation:** Implement at least **Phase 1 and Phase 2** to have a minimum viable project lifecycle that matches user expectations for a freelance/project platform.

---

**Document Owner:** VoiceCraft Development Team
**Last Updated:** 2025-11-09
**Comparison Source:** ReelMatic `docs/PROJECT_LIFECYCLE.md`
