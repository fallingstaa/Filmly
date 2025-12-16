# AI Matching Integration - Project & AI Matching Tab

## Overview
This document describes the integration of the AI-powered festival matching feature that connects films to suitable festivals using Gemini AI.

## Architecture

### Backend API
- **Base URL**: `https://filmly-backend.vercel.app` (configured in `.env` as `NEXT_PUBLIC_API_URL`)
- **Endpoint**: `/api/ai/match-festivals`
- **Method**: GET
- **Parameters**:
  - `theme`: The film's theme/description
  - `language`: The film's language

### Frontend Flow
1. User navigates to `/films/matching` (Project & AI Matching page)
2. System fetches user's films from backend API (`/api/films`)
3. User clicks "AI matching" button on a film
4. Frontend calls backend AI matching API with film's theme and language
5. Results are stored in sessionStorage and displayed on the same page

## Components Updated

### 1. MatchingTableSection (`src/view/films/sections/MatchingTableSection.tsx`)
**Changes**:
- Added `fetchFilmsFromBackend()` function to fetch real films from backend
- Updated `handleAiMatch()` to call the real AI matching API
- Added validation for theme and language before matching
- Stores results in sessionStorage for display
- Added loading states and error handling

### 2. MatchingResultsSection (`src/view/films/sections/MatchingResultsSection.tsx`)
**Changes**:
- Reads AI matching results from sessionStorage
- Transforms backend response to display format
- Shows match count and film title
- Displays empty state when no results available

### 3. MatchingResultsGridSection (`src/view/films/sections/MatchingResultsGridSection.tsx`)
**Changes**:
- Updated Match type to support optional fields and new AI data
- Added display for match reasons from AI
- Shows days until deadline
- Uses eventId for navigation to festival details

### 4. MatchingPage (`app/(filmmaker)/films/matching/page.tsx`)
**Changes**:
- Updated layout with better spacing
- Added descriptive text for "Your Projects" section
- Clarified the purpose of AI matching

## AI Matching Logic (Backend)

The backend uses Gemini AI to calculate festival matches based on three factors:

1. **Theme Similarity (60% weight)**: AI compares film theme with festival description
2. **Language Support (30% weight)**: Checks if festival accepts the film's language
3. **Deadline Urgency (10% weight)**: Prioritizes festivals with approaching deadlines

### Match Scoring
- **0-20**: Completely incompatible
- **21-40**: Minimal thematic connection
- **41-60**: Some thematic overlap
- **61-80**: Strong thematic compatibility
- **81-100**: Excellent thematic match

## Data Flow

```
User Film Data (from /api/films)
    ↓
AI Matching Request
    theme: film.description or film.theme
    language: film.language
    ↓
Backend AI Processing (Gemini AI)
    ↓
Match Results (sorted by score)
    - eventId
    - eventTitle
    - eventDescription
    - matchScore
    - themeScore
    - languageSupported
    - daysUntilDeadline
    - matchReasons[]
    ↓
Display in UI
```

## Usage

### Prerequisites
1. User must be authenticated (access_token in localStorage)
2. Film must have:
   - A theme or description
   - A language specified

### Steps to Use
1. Navigate to "Project and Ai matching" from sidebar
2. Your films are automatically loaded
3. Click "AI matching" on any film
4. Wait for AI analysis (displays loading spinner)
5. View matching festivals with scores and reasons
6. Click "View Details" to see full festival information

## Error Handling

- **No Access Token**: Falls back to localStorage films
- **No Theme/Language**: Shows alert to user
- **API Failure**: Shows error alert and logs to console
- **No Results**: Displays helpful empty state message

## Environment Variables

Required in `.env`:
```
NEXT_PUBLIC_API_URL=https://filmly-backend.vercel.app
```

## Testing

To test the integration:
1. Add a film with theme and language via `/films/add`
2. Go to `/films/matching`
3. Click "AI matching" on the film
4. Verify results display with:
   - Festival names
   - Match scores
   - Match reasons
   - Location and deadline
   - Working "View Details" button

## Future Enhancements

- Add ability to filter results by score threshold
- Show match reasons in expandable sections
- Add direct submission to festivals from matching results
- Cache matching results for recent searches
- Add comparison view for multiple films
