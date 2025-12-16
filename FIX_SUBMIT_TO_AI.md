# Fix: "Submit to Ai" Now Calls Real AI API

## What Was Wrong

Previously, clicking "Submit to Ai" in the AddFilmForm was using a **mock implementation** that:
- ❌ Created fake festival matches in localStorage
- ❌ Did NOT call the real AI matching API
- ❌ Just redirected to matching page with mock data

## What Was Fixed

Now "Submit to Ai" properly:
- ✅ Validates theme/synopsis and language are present
- ✅ Saves the film to localStorage
- ✅ **Calls the REAL AI matching API**: `GET /api/ai/match-festivals?theme=...&language=...`
- ✅ Waits for Gemini AI analysis
- ✅ Stores real results in sessionStorage
- ✅ Redirects to matching page with real AI results

## Files Changed

### 1. `AddFilmForm.tsx` (src/view/films/add/AddFilmForm.tsx)
- Replaced mock `submitToAi()` function with real API call
- Added proper validation for required fields
- Added error handling and console logging
- Now uses `fetch()` to call backend AI API

### 2. `.env` (Filmly/.env)
- Changed `NEXT_PUBLIC_API_URL` from deployed backend to local:
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:3000
  ```

### 3. `MatchingTableSection.tsx` (src/view/films/sections/MatchingTableSection.tsx)
- Updated default fallback URL to `http://localhost:3000`
- Added console logging for debugging

## How to Test

### Step 1: Restart Frontend Dev Server
**IMPORTANT**: You MUST restart the Next.js dev server to pick up the .env changes!

```bash
# Stop the current dev server (Ctrl+C)
# Then restart:
npm run dev
```

The frontend should now run on **http://localhost:3001**

### Step 2: Verify Backend is Running
Make sure your backend is running on **http://localhost:3000**

### Step 3: Test the Flow

1. **Navigate to**: http://localhost:3001/films/add

2. **Fill in the form** with MINIMUM required fields:
   - **Title**: "Test Film"
   - **Language**: "English" ⚠️ REQUIRED
   - **Theme**: "A dramatic story about..." ⚠️ REQUIRED
   - (Other fields optional)

3. **Click "Submit to Ai"**

4. **Watch the browser console** (F12 → Console tab):
   ```
   Calling AI matching API: http://localhost:3000/api/ai/match-festivals?theme=...&language=...
   AI matching results: {...}
   ```

5. **Watch the Network tab** (F12 → Network):
   - You should see: `GET /api/ai/match-festivals?theme=...&language=...`
   - Status: 200 OK
   - Response: JSON with matches array

6. **After 2-10 seconds**: Should redirect to `/films/matching` with real AI results

## What You Should See in Network Tab

### Before Fix (Wrong):
```
GET /films/add 200
GET /films/matching?filmId=tmp-123&title=Test 200
(No AI API call!)
```

### After Fix (Correct):
```
GET /films/add 200
GET /api/ai/match-festivals?theme=A%20dramatic%20story...&language=English 200
GET /films/matching?filmId=tmp-123&title=Test 200
```

## What Backend Should Log

Your backend (on port 3000) should log:
```
Found X festivals with open deadlines
User theme: "A dramatic story..."
User language: "English"
Calculating AI theme matches for all festivals...
```

## Expected AI Response Format

```json
{
  "userInput": {
    "theme": "A dramatic story...",
    "language": "English"
  },
  "totalFestivals": 10,
  "compatibleMatches": 8,
  "matches": [
    {
      "eventId": 1,
      "eventTitle": "Sundance Film Festival",
      "eventDescription": "...",
      "eventLanguage": "English",
      "eventLocation": "USA",
      "eventDeadline": "2025-12-25T00:00:00.000Z",
      "daysUntilDeadline": 30,
      "matchScore": 85,
      "themeScore": 90,
      "languageSupported": true,
      "deadlineScore": 80,
      "matchReasons": [
        "Excellent thematic alignment",
        "Language supported by festival",
        "30 days until deadline"
      ]
    }
    // ... more matches
  ]
}
```

## Troubleshooting

### Issue: Still seeing mock data
**Solution**: Restart the Next.js dev server! Environment variables are only loaded on startup.

### Issue: API call to wrong URL
**Solution**:
1. Check `.env` has `NEXT_PUBLIC_API_URL=http://localhost:3000`
2. Restart dev server
3. Check browser console for the actual URL being called

### Issue: "Failed to fetch"
**Solution**:
1. Make sure backend is running on port 3000
2. Check for CORS errors in console
3. Verify backend has `/api/ai/match-festivals` endpoint

### Issue: No results showing
**Solution**:
1. Check Network tab - did API call succeed?
2. Check Console - any errors?
3. Check sessionStorage (F12 → Application → Session Storage) for `ai_matching_results`

## Testing Checklist

- [ ] Restarted frontend dev server
- [ ] Backend running on port 3000
- [ ] Frontend running on port 3001
- [ ] Filled in Title, Language, and Theme in form
- [ ] Clicked "Submit to Ai"
- [ ] Saw console log: "Calling AI matching API: ..."
- [ ] Saw Network request to `/api/ai/match-festivals`
- [ ] Got 200 response with matches
- [ ] Redirected to `/films/matching`
- [ ] Real AI results displayed (not mock data)
- [ ] Match scores are real from Gemini AI
- [ ] Match reasons make sense

## Comparison: Two Ways to Get AI Matches

### Way 1: "Submit to Ai" Button (New Film)
```
Add Film Form → Fill details → "Submit to Ai"
    ↓
Saves to localStorage
    ↓
Calls AI API immediately
    ↓
Shows results
```

### Way 2: "AI matching" Button (Existing Film)
```
Matching Page → "AI matching" button
    ↓
Calls AI API with existing film data
    ↓
Shows results
```

Both now use the **REAL AI API**! 🎉
