# VoiceCraft Component Inventory & Requirements

## Current Component Status

### ✅ **Existing Components**

#### Marketing Components (Not needed for dashboard)
- **Blog**: blog-grid, blog-card
- **Cards**: feature-card, pricing-card, stat-card, testimonial-card
- **Layout**: footer, header
- **Sections**: cta, faq, features, hero, pricing, stats, testimonials

#### Base UI Components
- **button** ✅ - Brutalist styled button (primary, secondary, outline, ghost variants)
- **card** ✅ - Card component (default, ghost, gradient, elevated, outlined variants)
- **container** ✅ - Layout container
- **illustration** ✅ - Illustration component
- **input** ✅ - Text input component
- **typography** ✅ - Text component with variants (h1-h4, body, caption, lead)

#### VoiceCraft-Specific Components
- **audio-player** ✅ - Complete audio player with waveform, controls, download
- **generation-progress** ✅ - Multi-step progress indicator for voice generation
- **voice-clone-uploader** ✅ - File upload component for voice samples
- **voice-generator** ✅ - Complete voice generation interface with controls
- **voice-selector** ✅ - Grid/list selector for voices with filters
- **waveform** ✅ - Waveform visualization component

---

## 🔨 **Components Needed for Dashboard**

### 1. `/dashboard` (Home Page)
**Requirements from user flow:**
- Summary cards showing stats (total audios, total voices, total projects, credits)
- Recent audios table
- Quick action buttons

**✅ Components Available:**
- `stat-card` - Can be used for summary stats
- `button` - For quick actions
- `card` - For grouping content

**❌ Components Missing:**
- **AudiosTable** - Table component for recent audios
  - Should show: filename, duration, voice used, created date, status
  - Actions: play, download, delete

---

### 2. `/dashboard/audios` (Audio Library)
**Requirements from user flow:**
- File manager style DataTable with columns: filename, duration, voice, created, status, actions
- Generate audio dialog (text input, voice selector, settings)
- Upload audio dialog (file upload, metadata)
- Inline audio player
- Pagination, sorting, filtering

**✅ Components Available:**
- `audio-player` - For inline playback
- `voice-generator` - Can be adapted into a dialog
- `voice-clone-uploader` - Can be repurposed for audio upload
- `button` - For actions

**❌ Components Missing:**
- **AudioDataTable** - Shadcn DataTable styled with brutalist design
  - Columns: checkbox, filename, duration, voice, created, status, actions
  - Features: sorting, filtering, pagination, row selection
- **GenerateAudioDialog** - Dialog wrapper around voice generation
  - Text input (max 10,000 chars)
  - Voice selector dropdown
  - Emotion, speed, pitch, volume controls
  - Generate button
- **UploadAudioDialog** - Dialog for uploading audio files
  - Drag-drop file upload
  - File metadata inputs (name, description, tags)
  - Upload button with progress
- **AudioTableActions** - Dropdown menu for row actions
  - Play, Download, Delete, Add to Project

---

### 3. `/dashboard/voices` (Voice Library)
**Requirements from user flow:**
- Voice cards grid showing cloned voices
- Clone voice dialog (upload sample, settings)
- Delete confirmation dialog
- Preview audio playback

**✅ Components Available:**
- `voice-selector` - Can display voices in grid
- `voice-clone-uploader` - File upload for voice samples
- `audio-player` - For preview playback
- `card` - For voice cards

**❌ Components Missing:**
- **VoiceCard** - Individual voice card component
  - Voice name, language, gender
  - Preview button, delete button, favorite toggle
  - Status indicator (processing, ready, failed)
- **CloneVoiceDialog** - Complete voice cloning workflow
  - File upload (voice-clone-uploader)
  - Voice settings (name, description, language, gender)
  - Advanced settings (noise reduction, volume normalization)
  - Clone button with progress
- **DeleteVoiceDialog** - Confirmation dialog
  - Warning about deletions
  - Confirm/Cancel buttons

---

### 4. `/dashboard/projects` (Project Management)
**Requirements from user flow:**
- Kanban board with 5 columns: Draft, Estimating, Ready, In Progress, Completed
- Project cards showing name, status, audio count, expert assigned, deadline
- Shadcn Sheet drawer for project details
- Drag-drop functionality
- Add project dialog
- Assign to expert dialog

**✅ Components Available:**
- `card` - For project cards
- `button` - For actions
- `audio-player` - For audio playback in drawer

**❌ Components Missing:**
- **ProjectKanbanBoard** - Full Kanban implementation
  - 5 status columns
  - Drag-drop between columns
  - Column headers with counts
  - Empty states
- **ProjectCard** - Card component for Kanban
  - Project name, status badge
  - Audio count, expert avatar
  - Deadline, priority indicator
  - Click to open drawer
- **ProjectDetailsDrawer** - Shadcn Sheet component
  - Project info section
  - Audio list with playback
  - Expert assignment section
  - Instructions textarea
  - Status change controls
- **CreateProjectDialog** - Dialog for new projects
  - Project name input
  - Audio selection (checkboxes from audio library)
  - Initial instructions
  - Get AI estimation button
- **AssignExpertDialog** - Dialog for assigning experts
  - Expert selection dropdown
  - Instructions textarea
  - Deadline picker
  - Assign button
- **AudioList** - Reusable list component
  - Show audios in project
  - Play inline, remove from project
  - Reorder audios

---

## 📦 **Shadcn Components to Install**

Based on the requirements above, we need to install these Shadcn components:

1. **Dialog** - For all modal dialogs
2. **Sheet** - For project details drawer
3. **Table** - For DataTable implementation
4. **AlertDialog** - For delete confirmations
5. **Dropdown Menu** - For action menus
6. **Select** - For dropdowns (voice selection, expert selection)
7. **Textarea** - For text inputs (instructions, descriptions)
8. **Badge** - For status indicators
9. **Checkbox** - For row selection in tables
10. **Calendar** - For deadline picker
11. **Popover** - For additional controls
12. **Separator** - For visual separation
13. **Tooltip** - For helpful hints

---

## 🎨 **Styling Strategy**

All Shadcn components need to be styled with the brutalist design system:

**Colors:**
- Black: `#000000`
- White: `#FFFFFF`
- Yellow: `#EAB308` (primary accent)

**Borders:**
- Width: `2px` or `4px`
- Color: Black (`#000000`)
- Style: Solid

**Typography:**
- Font: System font stack
- Weight: Bold for headings, uppercase for labels
- Line height: Tight for impact

**Shadows:**
- Use offset shadows instead of blur
- Example: `4px 4px 0 #000000`

**Effects:**
- No blur, no gradients (except for yellow gradient)
- Sharp corners or minimal rounding
- High contrast

---

## 📋 **Implementation Priority**

### Phase 1: Core Dashboard Components
1. Install Shadcn components (Dialog, Table, Sheet, etc.)
2. Create AudioDataTable component
3. Create GenerateAudioDialog component
4. Create UploadAudioDialog component
5. Build `/dashboard/audios` page

### Phase 2: Voice Management
1. Create VoiceCard component
2. Create CloneVoiceDialog component
3. Create DeleteVoiceDialog component
4. Build `/dashboard/voices` page

### Phase 3: Project Management
1. Create ProjectKanbanBoard component
2. Create ProjectCard component
3. Create ProjectDetailsDrawer component
4. Create CreateProjectDialog component
5. Create AssignExpertDialog component
6. Build `/dashboard/projects` page

### Phase 4: Dashboard Home
1. Create AudiosTable component (recent audios)
2. Assemble summary cards
3. Build `/dashboard` page

---

## 🔄 **Component Reusability**

Some components can be shared across pages:

- **AudioPlayer** - Used in audios page, voices page (preview), projects drawer
- **VoiceSelector** - Used in voice generator dialog, voice selection for audios
- **Card** - Used everywhere for grouping
- **Button** - Used everywhere for actions
- **Badge** - Used for status indicators across all pages

---

## Next Steps

1. ✅ All TypeScript errors fixed
2. 🔄 Component inventory complete
3. ⏳ Install Shadcn components
4. ⏳ Update Prisma schema with Audio, Project models
5. ⏳ Create Audio & Project APIs
6. ⏳ Build dashboard pages following priority order
