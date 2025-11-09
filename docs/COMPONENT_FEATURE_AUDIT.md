# VoiceCraft - Component & Feature Audit
**Date:** 2025-11-09
**Purpose:** Complete inventory and implementation plan for 3 user types

---

## 🎯 User Types & Roles

### 1. **User** (Project Owner)
- Create projects
- Get AI estimates
- Accept/reject estimates
- View assigned expert
- Approve work or request changes
- View completed work

### 2. **Specialist/Executor** (Audio Expert)
- View assigned projects
- Download project audios
- Upload completed voice files
- Submit work for review
- Message user in project context
- See revision requests

### 3. **Admin** (Platform Manager)
- Assign projects to specialists
- Manage users and specialists
- Re-estimate projects
- Issue refunds
- View financial reports
- Manage all orders

---

## ✅ Existing Components

### Base UI (VoiceCraft Brutalist Design)
- ✅ `Button` - All variants (primary, secondary, outline, ghost)
- ✅ `Card` - All variants (default, elevated, outlined, ghost, gradient)
- ✅ `Badge` - Status badges (default, primary, success, warning, danger)
- ✅ `Input` - Text inputs
- ✅ `Textarea` - Multiline text
- ✅ `Select` - Dropdowns
- ✅ `Dialog` - Modal dialogs
- ✅ `Sheet` - Side drawers
- ✅ `Table` - Data tables
- ✅ `AlertDialog` - Confirmations
- ✅ `Dropdown Menu` - Action menus
- ✅ `Checkbox` - Selections
- ✅ `Calendar` - Date picker
- ✅ `Separator` - Visual dividers
- ✅ `Tooltip` - Hints
- ✅ `Popover` - Floating content
- ✅ `Typography` - Text components (Heading, Text)

### VoiceCraft Specific
- ✅ `AudioPlayer` - Complete audio player with waveform
- ✅ `VoiceGenerator` - Voice generation interface
- ✅ `VoiceSelector` - Voice selection grid
- ✅ `VoiceCloneUploader` - Upload voice samples
- ✅ `Waveform` - Waveform visualization
- ✅ `GenerationProgress` - Multi-step progress

---

## 🔨 Components to Create

### Project Lifecycle Components

#### 1. **EstimateCard**
**Purpose:** Display AI estimate with breakdown
**User Type:** User
**Features:**
- Estimated cost (dollars and credits)
- Estimated duration
- Cost breakdown (editing, mixing, mastering)
- Accept/Reject buttons
- Credit balance check

**Variants:**
- `pending` - Show "Get Estimate" button
- `waiting` - Show estimate with Accept/Reject
- `accepted` - Show confirmed estimate

---

#### 2. **CreditBalanceCard**
**Purpose:** Show user's credit balance
**User Type:** User, Specialist, Admin
**Features:**
- Current balance (credits and dollars)
- Low balance warning
- Add credits button
- Recent transactions link

---

#### 3. **ProjectStatusBadge**
**Purpose:** Visual status indicator
**User Type:** All
**Features:**
- Color-coded by status
- Icon per status
- Tooltip with status description

**Status Colors:**
- `draft` - Gray
- `estimating` - Purple
- `waiting_for_estimate_accept` - Yellow
- `waiting_for_assignment` - Orange
- `assigned` - Blue
- `in_review` - Cyan
- `completed` - Green
- `refunded` - Red
- `cancelled` - Gray

---

#### 4. **ExpertCard**
**Purpose:** Display expert profile
**User Type:** User, Admin
**Features:**
- Expert name and photo
- Rating (stars)
- Completed jobs count
- Specializations
- Assign button (admin)

---

#### 5. **WorkSubmissionCard**
**Purpose:** Submit completed work
**User Type:** Specialist
**Features:**
- Audio file upload/selection
- Submission notes textarea
- Submit button
- Audio preview

---

#### 6. **WorkReviewCard**
**Purpose:** Review submitted work
**User Type:** User
**Features:**
- Submitted audios with player
- Rating stars (1-5)
- Feedback textarea
- Approve button
- Request Changes button

---

#### 7. **RevisionRequestCard**
**Purpose:** Display revision requests
**User Type:** Specialist
**Features:**
- User feedback
- Request date
- Previous submission
- Resubmit button

---

#### 8. **RefundDialog**
**Purpose:** Issue refund
**User Type:** Admin
**Features:**
- Refund reason textarea (required)
- Refund amount input (optional, defaults to reservation)
- Admin notes textarea
- Confirmation checkbox
- Issue refund button

---

#### 9. **ReEstimateDialog**
**Purpose:** Request new estimate
**User Type:** Admin
**Features:**
- New estimate input
- Reason textarea (required)
- Admin notes textarea
- Calculate additional credits
- User balance check
- Submit button

---

#### 10. **ProjectMessaging**
**Purpose:** In-context project communication
**User Type:** User, Specialist
**Features:**
- Message list (chronological)
- Message input
- Send button
- File attachments
- Read receipts
- Real-time updates (optional)

**Database Schema Addition Needed:**
```prisma
model ProjectMessage {
  id        String   @id @default(cuid())
  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  message   String   @db.Text
  attachments Json?  // Array of file URLs
  createdAt DateTime @default(now())
  readAt    DateTime?

  @@index([projectId])
  @@index([userId])
  @@map("project_messages")
}
```

---

### Dashboard Components

#### 11. **StatsCard**
**Purpose:** Display dashboard statistics
**User Type:** All
**Features:**
- Large number display
- Label
- Icon
- Trend indicator (up/down)
- Click to filter

**Variants:**
- Total projects
- Active projects
- Total audios
- Total voices
- Credits balance
- Revenue (admin)

---

#### 12. **ProjectDataTable**
**Purpose:** Table view of projects
**User Type:** Admin
**Features:**
- Sortable columns
- Filterable by status
- Search
- Pagination
- Row actions (assign, view, refund)
- Bulk actions

**Columns:**
- Project name
- User
- Status
- Expert assigned
- Estimated cost
- Created date
- Actions

---

#### 13. **SpecialistProjectCard**
**Purpose:** Project card for specialist view
**User Type:** Specialist
**Features:**
- Project name
- User info
- Deadline countdown
- Audio count
- View details button
- Status badge

---

#### 14. **AdminFinancialCard**
**Purpose:** Financial overview
**User Type:** Admin
**Features:**
- Total revenue
- Pending payments
- Refunds issued
- Credit purchases
- Transaction graph
- Export report button

---

#### 15. **UserManagementTable**
**Purpose:** Manage users
**User Type:** Admin
**Features:**
- User list with roles
- Credit balance
- Active projects
- Joined date
- Actions (edit, suspend, grant credits)

---

#### 16. **SpecialistManagementTable**
**Purpose:** Manage specialists
**User Type:** Admin
**Features:**
- Specialist list
- Rating
- Completed jobs
- Active assignments
- Specializations
- Actions (edit, approve, suspend)

---

### Form Components

#### 17. **CreditPurchaseDialog**
**Purpose:** Purchase credits
**User Type:** User
**Features:**
- Credit packages
- Stripe integration
- Payment method selection
- Purchase button

---

#### 18. **AudioUploadDialog**
**Purpose:** Upload audio files
**User Type:** User, Specialist
**Features:**
- Drag-drop upload
- File metadata (name, tags, description)
- Project assignment (optional)
- Upload progress
- Multiple file support

---

#### 19. **CreateProjectDialog**
**Purpose:** Create new project
**User Type:** User
**Features:**
- Project name input (required)
- Description textarea
- Audio selection (from library)
- Priority selector
- Tags input
- Create button

---

#### 20. **AssignExpertDialog**
**Purpose:** Assign specialist to project
**User Type:** Admin
**Features:**
- Expert selection dropdown (with ratings)
- Instructions textarea
- Deadline calendar
- Assign button
- Expert availability indicator

---

## 📱 Pages to Create/Update

### User Dashboard

#### `/dashboard` (Home)
**Status:** Exists but basic
**Needs:**
- Stats cards (projects, audios, voices, credits)
- Recent projects list
- Quick actions (create project, generate audio)
- Credit balance prominent

---

#### `/dashboard/projects` (User View)
**Status:** Exists with basic Kanban
**Needs Update:**
- New status columns (9 total)
- Estimate acceptance UI
- Work review UI
- Messaging integration
- Credit balance check

**New Actions Per Status:**
- `draft` - Get Estimate button
- `waiting_for_estimate_accept` - Accept/Reject estimate
- `waiting_for_assignment` - View status, message admin
- `assigned` - View expert, message expert
- `in_review` - Approve/Request Changes
- `completed` - View work, download
- `refunded` - View refund details

---

#### `/dashboard/audios`
**Status:** Exists
**Needs:**
- Connect to API
- Upload functionality
- Project assignment

---

#### `/dashboard/voices`
**Status:** Exists
**Needs:**
- Connect to API
- Clone voice functionality

---

### Specialist Dashboard

#### `/specialist` (Dashboard Home)
**Status:** Doesn't exist
**Create New:**
- Active assignments count
- Deadline warnings
- Earnings this month
- Rating overview
- Quick access to assigned projects

---

#### `/specialist/projects`
**Status:** Doesn't exist
**Create New:**
- List of assigned projects
- Filter by status (assigned, in_review)
- Project cards with:
  - User info
  - Deadline
  - Audio count
  - View details button

---

#### `/specialist/projects/[id]`
**Status:** Doesn't exist
**Create New:**
- Project details
- User's request/instructions
- All project audios (download)
- Upload completed work
- Submit button
- Messaging with user
- Revision history (if any)

---

#### `/specialist/earnings`
**Status:** Doesn't exist
**Create New:**
- Total earnings
- Completed jobs
- Average rating
- Transaction history
- Withdraw button (if applicable)

---

### Admin Dashboard

#### `/admin` (Dashboard Home)
**Status:** Doesn't exist
**Create New:**
- Platform stats:
  - Total users
  - Active specialists
  - Total projects
  - Revenue
  - Credits in circulation
- Recent activity
- Pending assignments
- Financial overview

---

#### `/admin/projects`
**Status:** Doesn't exist
**Create New:**
- All projects table
- Filters (status, user, specialist, date range)
- Search
- Quick actions:
  - Assign expert
  - Re-estimate
  - Refund
  - View details

---

#### `/admin/users`
**Status:** Doesn't exist
**Create New:**
- User management table
- Add/edit users
- Grant credits
- View user projects
- Suspend/activate

---

#### `/admin/specialists`
**Status:** Doesn't exist
**Create New:**
- Specialist management table
- Approve new specialists
- Edit specializations
- View specialist projects
- Performance metrics

---

#### `/admin/financials`
**Status:** Doesn't exist
**Create New:**
- Revenue dashboard
- Credit transactions
- Refunds issued
- Specialist payments
- Export reports
- Charts/graphs

---

## 🗂️ API Endpoints Status

### Already Implemented ✅
- `POST /api/projects/[id]/estimate` - Get estimate
- `POST /api/projects/[id]/estimate/accept` - Accept estimate
- `POST /api/projects/[id]/estimate/reject` - Reject estimate
- `POST /api/projects/[id]/assign` - Assign expert
- `POST /api/projects/[id]/submit` - Submit work
- `POST /api/projects/[id]/approve` - Approve work
- `POST /api/projects/[id]/request-changes` - Request changes
- `POST /api/projects/[id]/re-estimate` - Re-estimate
- `POST /api/projects/[id]/refund` - Issue refund

### Need to Create 🔨
- `GET /api/specialist/projects` - Get specialist's assigned projects
- `GET /api/specialist/earnings` - Get specialist earnings
- `GET /api/admin/users` - List users
- `POST /api/admin/users/[id]/credits` - Grant credits
- `GET /api/admin/specialists` - List specialists
- `POST /api/admin/specialists/[id]/approve` - Approve specialist
- `GET /api/admin/financials` - Financial reports
- `POST /api/projects/[id]/messages` - Send message
- `GET /api/projects/[id]/messages` - Get messages
- `POST /api/credits/purchase` - Purchase credits (Stripe)

---

## 📋 Implementation Priority

### Phase 1: User Project Lifecycle ⚡ (HIGHEST)
1. Update `ProjectStatusBadge` with new statuses
2. Create `EstimateCard` component
3. Create `CreditBalanceCard` component
4. Update `/dashboard/projects` with estimate acceptance
5. Create `WorkReviewCard` component
6. Add approve/request changes UI

**Why First:** Core functionality for users to complete full project cycle

---

### Phase 2: Specialist Dashboard 🎯
1. Create `/specialist` pages structure
2. Create `SpecialistProjectCard` component
3. Create `WorkSubmissionCard` component
4. Create `/specialist/projects` list page
5. Create `/specialist/projects/[id]` detail page
6. Add work submission functionality

**Why Second:** Specialists need to complete work for users

---

### Phase 3: Messaging 💬
1. Add ProjectMessage model to Prisma
2. Create `ProjectMessaging` component
3. Create messaging API endpoints
4. Integrate messaging into project detail views

**Why Third:** Enables communication between users and specialists

---

### Phase 4: Admin Dashboard 👑
1. Create `/admin` pages structure
2. Create `ProjectDataTable` component
3. Create `UserManagementTable` component
4. Create `SpecialistManagementTable` component
5. Create `RefundDialog` and `ReEstimateDialog` components
6. Create admin API endpoints
7. Create `/admin/financials` page

**Why Fourth:** Admin features can wait until core flows work

---

### Phase 5: Credits & Payments 💳
1. Create `CreditPurchaseDialog` component
2. Integrate Stripe
3. Create credit purchase API
4. Add credit top-up flow

**Why Last:** Can use manual credit grants initially

---

## 🎨 Design System Checklist

All components must follow VoiceCraft Brutalist design:

- ✅ Black borders (2px or 4px)
- ✅ Yellow (#EAB308) primary accent
- ✅ Bold, uppercase typography
- ✅ Sharp shadows (4px 4px 0 #000)
- ✅ High contrast (black/white/yellow only)
- ✅ No blur effects
- ✅ No gradients (except yellow gradient variant)

---

## 📊 Component Documentation Template

Each component should be documented with:

```markdown
## ComponentName

**Purpose:** What this component does
**User Type:** Who uses it
**Location:** Where it's used
**Props:**
- `prop1`: type - description
- `prop2`: type - description

**Example:**
```tsx
<ComponentName prop1="value" prop2={true} />
```

**API Connection:**
- Endpoint used
- Request/response structure
```

---

## Next Steps

1. ✅ Complete this audit
2. ⏳ Create Phase 1 components
3. ⏳ Update `/dashboard/projects` with new lifecycle
4. ⏳ Create specialist dashboard
5. ⏳ Add messaging
6. ⏳ Create admin dashboard
7. ⏳ Add Stripe integration

---

**Document Version:** 1.0
**Last Updated:** 2025-11-09
