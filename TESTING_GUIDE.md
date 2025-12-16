# Testing Guide - AI Matching Integration

## Overview
This guide will help you test the complete AI matching feature integration, from adding films to viewing matched festivals.

## Prerequisites

### 1. Environment Setup
Ensure your `.env` file has the correct values:
```env
NEXT_PUBLIC_API_URL=https://filmly-backend.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://ybyfvuthvbritmfdyuab.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### 2. Backend Setup
- FilmlyBackend must be deployed and running at `https://filmly-backend.vercel.app`
- Database should have some festival events (events table in Supabase)
- Gemini AI API key must be configured in backend

### 3. Authentication
You need to be logged in as a filmmaker to access the AI matching features.

## Pages to Test

### Page 1: Login (`/login`)
**Purpose**: Authenticate to access protected routes

**Test Steps**:
1. Navigate to `/login`
2. Enter valid credentials
3. Click "Sign In"
4. Should redirect to filmmaker dashboard (`/films`)
5. Verify `access_token` is stored in localStorage (DevTools → Application → Local Storage)

**Expected Result**: Successfully logged in and redirected to dashboard

---

### Page 2: Add Film (`/films/add`)
**Purpose**: Create a film for AI matching

**Test Steps**:
1. Navigate to `/films/add` (or click "Add Film" from matching page)
2. Fill in the form with **minimum required fields**:
   - **Title**: "My Indie Film"
   - **Production Country**: Select any country
   - **Duration**: 90 (minutes)
   - **Genre**: Select a genre
   - **Language**: "English" ⚠️ REQUIRED for AI matching
   - **Theme**: "A story about love and loss in a small town" ⚠️ REQUIRED for AI matching
   - **Synopsis**: Optional but recommended

3. **Important**: For AI matching to work, you MUST provide:
   - Language
   - Theme (or Synopsis)

4. Click "Submit to Ai" (not "Submit" which is for festival submissions)
5. Wait for the mock submission to complete (2-5 seconds)

**Expected Result**:
- Film is saved to localStorage
- Shows loading spinner with "Running AI matching — this is a mockup"
- Redirects to `/films/matching` with filmId and title in URL

**Alternative**: Use "Save Draft" to save without AI matching

---

### Page 3: Project & AI Matching (`/films/matching`)
**Purpose**: Main page for AI-powered festival matching

**Test Steps**:

#### 3A. View Your Films
1. Navigate to `/films/matching`
2. Should see "Your Projects" section with a table
3. Films should load from backend API (or localStorage as fallback)
4. Each film shows:
   - Film initials icon
   - Film title
   - "Edit" button
   - "AI matching" button

**Expected Result**:
- Films are displayed correctly
- No errors in console
- If no films: Shows empty state with "Add Film" button

#### 3B. Edit a Film
1. Click "Edit" button on any film
2. Should redirect to `/films/edit/[id]`
3. Form is pre-filled with film data
4. Modify the **Theme** or **Language** field
5. Click "Save Changes"
6. Should redirect back to `/films/matching`

**Expected Result**:
- Film details loaded correctly
- Changes are saved
- Returns to matching page

#### 3C. Run AI Matching
1. Back on `/films/matching`, click "AI matching" on a film
2. **If film is missing theme or language**:
   - Should show alert: "Film needs a theme or description for AI matching..."
   - Fix by editing the film first
3. **If film has both theme and language**:
   - Shows loading spinner: "AI matching in progress..."
   - Makes API call to: `${BACKEND_URL}/api/ai/match-festivals?theme=...&language=...`
   - Wait 2-10 seconds for AI analysis
   - Results appear in "AI Matching Results" section below

**Expected Result**:
- Loading state appears
- API call succeeds (check Network tab)
- Results display with festival cards
- No errors in console

**Debug Tips**:
- Open DevTools → Network tab
- Filter by "match-festivals"
- Check the request URL and response
- Response should contain `matches` array with festival data

---

### Page 4: AI Matching Results (same page, below)
**Purpose**: Display matched festivals with scores

**Test Steps**:
1. After running AI matching, scroll down to see results
2. Should see heading: "Matches for '[Film Title]'"
3. Shows count: "Found X matching festivals"
4. Grid displays festival cards with:
   - Festival name
   - Match score (0-100%)
   - Location (country)
   - Deadline (days remaining)
   - **Match Reasons** (AI-generated):
     - Theme compatibility
     - Language support
     - Deadline urgency
   - "View Details" button

5. Try pagination controls (Prev/Next) if more than 10 results
6. Click "View Details" on any festival

**Expected Result**:
- Results display correctly
- Match scores are shown as percentages
- Match reasons are visible
- Pagination works
- "View Details" navigates to festival detail page

**Sample Match Reasons**:
- "Excellent thematic alignment"
- "Language supported by festival"
- "15 days until deadline"

---

### Page 5: Festival Detail (`/films/festival/[id]`)
**Purpose**: View detailed information about a matched festival

**Test Steps**:
1. Click "View Details" from matching results
2. Should navigate to `/films/festival/[eventId]`
3. Page displays:
   - Festival name and description
   - About section
   - Theme
   - Location, dates, language, duration, deadline
   - Contact email
   - Submission deadlines (regular and late)
   - Past winners (if available)
   - "Submit Your Film" button

4. Click "Submit Your Film"
5. Should redirect to `/films/add?festivalId=[id]`

**Expected Result**:
- Festival details load from Supabase via `/api/events/[id]`
- All information displays correctly
- If festival not found: Shows fallback data or error
- "Submit Your Film" button works

---

### Page 6: Festival List (`/films/festival`)
**Purpose**: Browse all available festivals

**Test Steps**:
1. Navigate to `/films/festival` (from sidebar: "Festival")
2. Should see list of all festivals from Supabase
3. Search, filter, and sort features:
   - Search by name
   - Filter by country
   - Filter by duration (short/feature)
   - Sort by deadline or name
4. Click on any festival card to view details

**Expected Result**:
- Festivals load from `/api/events`
- Search and filters work
- Clicking a festival navigates to detail page

---

## Testing Flows

### Flow 1: Complete AI Matching Journey
```
Login → Add Film (with theme & language) → Submit to AI
  ↓
Matching Page loads with results
  ↓
Click "View Details" on top match
  ↓
Festival Detail Page
  ↓
Click "Submit Your Film"
  ↓
Add Film Page (festival submission mode)
```

### Flow 2: Edit and Re-match
```
Matching Page → Click "Edit" on a film
  ↓
Edit Page → Update theme
  ↓
Save → Back to Matching Page
  ↓
Click "AI matching" again
  ↓
New results based on updated theme
```

### Flow 3: Browse and Match
```
Festival List → Browse festivals
  ↓
Festival Detail → Learn about a festival
  ↓
Back to Matching Page → Find films that match
  ↓
Run AI matching → Compare with manual choice
```

## API Calls to Monitor

### 1. Fetch Films
- **URL**: `/api/films`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Expected**: `{ films: [...], count: N }`

### 2. AI Matching
- **URL**: `https://filmly-backend.vercel.app/api/ai/match-festivals?theme=...&language=...`
- **Method**: GET
- **Expected**:
```json
{
  "userInput": { "theme": "...", "language": "..." },
  "totalFestivals": 10,
  "compatibleMatches": 8,
  "matches": [
    {
      "eventId": 1,
      "eventTitle": "Festival Name",
      "matchScore": 85,
      "themeScore": 90,
      "languageSupported": true,
      "daysUntilDeadline": 30,
      "matchReasons": ["Excellent thematic alignment", "..."]
    }
  ]
}
```

### 3. Fetch Events
- **URL**: `/api/events`
- **Method**: GET
- **Expected**: `{ events: [...] }`

### 4. Fetch Event Detail
- **URL**: `/api/events/[id]`
- **Method**: GET
- **Expected**: `{ event: {...} }`

## Common Issues & Solutions

### Issue 1: "No films found"
**Cause**: Not authenticated or no films in database
**Solution**:
- Check if logged in (access_token in localStorage)
- Add a film via `/films/add`
- Check backend API is running

### Issue 2: "Film needs theme or language"
**Cause**: Film missing required fields for AI matching
**Solution**:
- Click "Edit" on the film
- Add a theme/description
- Add a language
- Save and try again

### Issue 3: AI matching fails
**Cause**: Backend API error or Gemini API issue
**Solution**:
- Check Network tab for error details
- Verify `NEXT_PUBLIC_API_URL` in .env
- Check backend logs for Gemini API errors
- Ensure backend has `GEMINI_API_KEY` configured

### Issue 4: No matching results
**Cause**: No festivals in database or all filtered out
**Solution**:
- Check if Supabase has festival data in `event` table
- Try different theme or language
- Check backend response in Network tab

### Issue 5: "View Details" button doesn't work
**Cause**: Missing eventId or routing issue
**Solution**:
- Check console for errors
- Verify eventId in match data
- Ensure `/films/festival/[id]` route exists

## Data Flow Diagram

```
User Action
    ↓
[Add Film Form] → localStorage/Backend
    ↓
[AI Matching Button] → Backend AI API (Gemini)
    ↓
Backend analyzes theme + language + festivals
    ↓
Returns matched festivals with scores
    ↓
[Results Display] → sessionStorage
    ↓
[View Details] → Supabase (festival data)
    ↓
[Submit to Festival] → Backend submission API
```

## Success Criteria

✅ Can login successfully
✅ Can add a film with theme and language
✅ "AI matching" button triggers loading state
✅ AI matching returns results within 10 seconds
✅ Results display with scores and reasons
✅ Can view festival details
✅ Can navigate between all pages
✅ No console errors
✅ API calls succeed (200 status)

## Performance Expectations

- Film list load: < 2 seconds
- AI matching: 2-10 seconds (depends on Gemini AI)
- Festival list load: < 2 seconds
- Festival detail load: < 1 second
- Page navigation: Instant

## Browser Compatibility

Tested on:
- Chrome/Edge (recommended)
- Firefox
- Safari

## Next Steps After Testing

If all tests pass:
1. ✅ Integration is working correctly
2. 🎉 Feature is ready for production
3. 📝 Document any edge cases found
4. 🔄 Set up monitoring for AI API calls
5. 📊 Track match quality metrics

If tests fail:
1. 🐛 Note the specific failure
2. 📋 Check the "Common Issues" section
3. 🔍 Review browser console and network logs
4. 💬 Report issues with error details
