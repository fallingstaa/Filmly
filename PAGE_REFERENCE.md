# Page Reference - AI Matching Related Pages

## All Pages Related to AI Matching Feature

This document lists all frontend pages involved in the AI matching feature for easy navigation during testing.

---

## 1. Authentication Pages

### Login Page
- **URL**: `http://localhost:3000/login`
- **File**: `Filmly/app/login/page.tsx`
- **Purpose**: User authentication
- **Required**: Yes (must login to access AI matching)

### Signup Page
- **URL**: `http://localhost:3000/signup`
- **File**: `Filmly/app/signup/page.tsx`
- **Purpose**: Create new account

---

## 2. Main AI Matching Pages

### Project & AI Matching Page ⭐ MAIN PAGE
- **URL**: `http://localhost:3000/films/matching`
- **File**: `Filmly/app/(filmmaker)/films/matching/page.tsx`
- **Components**:
  - `MatchingHeaderSection` - Header with "Add Film" button
  - `MatchingTableSection` - Lists user's films with "AI matching" buttons
  - `MatchingResultsSection` - Displays AI matching results
- **Purpose**: Core AI matching interface
- **What you can do**:
  - View all your films
  - Click "AI matching" to get festival recommendations
  - View matching results with scores
  - Navigate to festival details

---

## 3. Film Management Pages

### Add Film Page
- **URL**: `http://localhost:3000/films/add`
- **File**: `Filmly/app/(filmmaker)/films/add/page.tsx`
- **Component**: `AddFilmForm`
- **Purpose**: Create new film for AI matching
- **Important Fields**:
  - Language (required for AI matching)
  - Theme/Synopsis (required for AI matching)
- **Buttons**:
  - "Submit to Ai" - For AI matching (no festivalId)
  - "Submit" - For festival submission (with festivalId)

### Edit Film Page
- **URL**: `http://localhost:3000/films/edit/[id]`
- **File**: `Filmly/app/(filmmaker)/films/edit/[id]/page.tsx`
- **Purpose**: Edit existing film details
- **Use Case**: Update theme or language before re-running AI matching

---

## 4. Festival Pages

### Festival List Page
- **URL**: `http://localhost:3000/films/festival`
- **File**: `Filmly/app/(filmmaker)/films/festival/page.tsx`
- **Component**: `FestivalSection`
- **Purpose**: Browse all available festivals
- **Features**:
  - Search festivals
  - Filter by country, duration
  - Sort by deadline or name

### Festival Detail Page
- **URL**: `http://localhost:3000/films/festival/[id]`
- **File**: `Filmly/app/(filmmaker)/films/festival/[id]/page.tsx`
- **Component**: `FestivalDetailSection`
- **Purpose**: View detailed festival information
- **Accessed from**: "View Details" button in AI matching results
- **Features**:
  - Festival description
  - Location, dates, language
  - Submission deadlines
  - "Submit Your Film" button

---

## 5. Dashboard Pages

### Filmmaker Dashboard
- **URL**: `http://localhost:3000/films`
- **File**: `Filmly/app/(filmmaker)/films/page.tsx`
- **Purpose**: Main dashboard for filmmakers
- **Contains**:
  - Welcome header
  - Stats overview
  - Analytics
  - Submissions

### Submissions Page
- **URL**: `http://localhost:3000/films/submissions`
- **File**: `Filmly/app/(filmmaker)/films/submissions/page.tsx`
- **Purpose**: View film submissions to festivals

---

## Component Reference

### Main AI Matching Components

#### MatchingTableSection ⭐ KEY COMPONENT
- **File**: `Filmly/src/view/films/sections/MatchingTableSection.tsx`
- **What it does**:
  - Fetches user's films from backend (`/api/films`)
  - Displays films in a table
  - Handles "AI matching" button click
  - Calls AI matching API: `${BACKEND_URL}/api/ai/match-festivals`
  - Stores results in sessionStorage
  - Shows loading spinner during AI processing

#### MatchingResultsSection ⭐ KEY COMPONENT
- **File**: `Filmly/src/view/films/sections/MatchingResultsSection.tsx`
- **What it does**:
  - Reads results from sessionStorage
  - Transforms backend data for display
  - Shows matched festival count
  - Passes data to grid component

#### MatchingResultsGridSection
- **File**: `Filmly/src/view/films/sections/MatchingResultsGridSection.tsx`
- **What it does**:
  - Displays festival cards in a grid
  - Shows match scores as percentages
  - Displays AI-generated match reasons
  - Pagination (10 results per page)
  - "View Details" button navigation

#### MatchingHeaderSection
- **File**: `Filmly/src/view/films/sections/MatchingHeaderSection.tsx`
- **What it does**:
  - Shows "AI Matching" title
  - "Add Film" button

#### AddFilmForm
- **File**: `Filmly/src/view/films/add/AddFilmForm.tsx`
- **What it does**:
  - Film creation form
  - Validates required fields for AI matching
  - "Submit to Ai" triggers AI matching flow
  - Saves to localStorage/backend

---

## API Routes (Frontend Proxies)

### Events API
- **URL**: `/api/events`
- **File**: `Filmly/app/api/events/route.ts`
- **Proxies to**: Supabase `event` table
- **Used by**: Festival list page

### Event Detail API
- **URL**: `/api/events/[id]`
- **File**: `Filmly/app/api/events/[id]/route.ts`
- **Proxies to**: Supabase `event` table
- **Used by**: Festival detail page

### Films API
- **URL**: `/api/films`
- **File**: `Filmly/app/api/films/route.ts`
- **Proxies to**: FilmlyBackend `/api/films`
- **Used by**: MatchingTableSection to fetch films

---

## Backend API Endpoints (Direct Calls)

### AI Matching API ⭐ MAIN AI ENDPOINT
- **URL**: `https://filmly-backend.vercel.app/api/ai/match-festivals`
- **File**: `FilmlyBackend/src/app/api/ai/match-festivals/route.ts`
- **Method**: GET
- **Params**: `?theme={text}&language={language}`
- **Returns**: Matched festivals with AI scores
- **Used by**: MatchingTableSection

---

## Navigation Flow

```
Login (/login)
  ↓
Filmmaker Dashboard (/films)
  ↓
Sidebar: "Project and Ai matching"
  ↓
Project & AI Matching Page (/films/matching) ⭐
  ↓
  ├─→ "Add Film" button → Add Film Page (/films/add)
  │                         ↓
  │                     "Submit to Ai"
  │                         ↓
  │                     Back to Matching Page (with results)
  │
  ├─→ "Edit" button → Edit Film Page (/films/edit/[id])
  │                     ↓
  │                 "Save Changes"
  │                     ↓
  │                 Back to Matching Page
  │
  └─→ "AI matching" button → AI processing → Results appear below
                                ↓
                            "View Details"
                                ↓
                        Festival Detail (/films/festival/[id])
                                ↓
                        "Submit Your Film"
                                ↓
                        Add Film Page (festival mode)
```

---

## Layout Structure

### Filmmaker Layout
- **File**: `Filmly/app/(filmmaker)/layout.tsx`
- **Applies to**: All `/films/*` routes
- **Contains**:
  - Sidebar navigation
  - Navigation items:
    - Dashboard (`/films`)
    - My Submission (`/films/submissions`)
    - **Project and Ai matching** (`/films/matching`) ⭐
    - Festival (`/films/festival`)
    - Subscription (`/films/billing`)

---

## Testing Checklist

Use this checklist when testing:

- [ ] Can access `/films/matching`
- [ ] Films load in the table
- [ ] "AI matching" button works
- [ ] Loading spinner appears
- [ ] Results display below
- [ ] Match scores shown as percentages
- [ ] Match reasons are visible
- [ ] "View Details" navigates to festival
- [ ] Can edit films and re-run matching
- [ ] Can add new films for matching
- [ ] No console errors
- [ ] API calls succeed in Network tab

---

## Quick Test URLs

For quick access during testing:

1. **Start here**: http://localhost:3000/films/matching
2. **Add film**: http://localhost:3000/films/add
3. **View festivals**: http://localhost:3000/films/festival
4. **Login**: http://localhost:3000/login

---

## File Locations Summary

**Main Pages**:
- `app/(filmmaker)/films/matching/page.tsx` - AI matching page
- `app/(filmmaker)/films/add/page.tsx` - Add film
- `app/(filmmaker)/films/edit/[id]/page.tsx` - Edit film
- `app/(filmmaker)/films/festival/[id]/page.tsx` - Festival detail

**Main Components**:
- `src/view/films/sections/MatchingTableSection.tsx` - Film list with AI button
- `src/view/films/sections/MatchingResultsSection.tsx` - Results manager
- `src/view/films/sections/MatchingResultsGridSection.tsx` - Results display
- `src/view/films/add/AddFilmForm.tsx` - Film form

**API Proxies**:
- `app/api/films/route.ts` - Films proxy
- `app/api/events/route.ts` - Events proxy
- `app/api/events/[id]/route.ts` - Event detail proxy
