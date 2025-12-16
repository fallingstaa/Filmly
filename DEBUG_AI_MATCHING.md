# Debugging AI Matching API Response

## Issue

You're getting:
- ✅ API call returns **200 OK**
- ❌ But alert shows: "Failed to perform AI matching. Please try again."

This means the API is working but there's an issue with the response format or parsing.

## How to Debug

### Step 1: Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Try "Submit to Ai" again
4. Look for these console logs:

```
Calling AI matching API: http://localhost:3000/api/ai/match-festivals?...
AI API response status: 200 OK
AI API raw response: {...}
AI matching results (parsed): {...}
```

### Step 2: What to Look For

#### A. Check Raw Response
Look at the "AI API raw response" log. It should be JSON like:
```json
{
  "userInput": {...},
  "totalFestivals": 10,
  "compatibleMatches": 5,
  "matches": [...]
}
```

**If you see HTML instead of JSON**:
- Your backend is returning an error page
- Check backend logs for errors
- Backend might not be running properly

**If you see empty response `{}`**:
- No festivals in database
- Or all festivals have expired deadlines

#### B. Check for Parse Errors
If you see:
```
Failed to parse AI API response as JSON: ...
```

This means the backend returned invalid JSON. Possible causes:
- Backend crashed mid-response
- CORS error
- Backend returning HTML error page

#### C. Check for Data Issues
If parsing succeeded, check:
```javascript
AI matching results (parsed): {
  matches: [],  // Empty array!
  message: "No active festivals found with open deadlines"
}
```

This means **no festivals in your database** with deadlines in the future.

### Step 3: Check Backend Logs

In your backend terminal (port 3000), you should see:
```
Found X festivals with open deadlines
User theme: "..."
User language: "English"
Calculating AI theme matches for all festivals...
```

**If you see**:
```
Found 0 festivals with open deadlines
```

This means your database has no events with `deadline > now()`.

### Step 4: Check Database

Your backend uses Supabase. Check:

1. Go to your Supabase dashboard
2. Open **Table Editor**
3. Select the `event` table
4. Check if you have any events
5. Check the `deadline` column - are any dates in the future?

**Common issue**: All test festivals have deadlines in the past!

## Solutions

### Solution 1: Add Test Festivals with Future Deadlines

You can run a seed script or manually add festivals via Supabase:

1. Go to Supabase → Table Editor → `event` table
2. Click "Insert" → "Insert row"
3. Add test data:
   - **title**: "Test Festival 2025"
   - **description**: "A festival for independent films"
   - **language**: "English"
   - **location**: "USA"
   - **deadline**: "2025-12-31" (future date!)
   - **genre**: ["Drama", "Comedy"]
   - **dates**: "2025-06-01 to 2025-06-10"

### Solution 2: Update Backend Seed Script

Check if your backend has a seed script:
```bash
cd FilmlyBackend
# Look for seed script
cat src/lib/db/seed-festivals.ts
```

Update festival deadlines to future dates, then run:
```bash
npx tsx src/lib/db/seed-festivals.ts
```

### Solution 3: Disable Deadline Filter (Testing Only)

For testing, you could temporarily remove the deadline filter in your backend:

**File**: `FilmlyBackend/src/app/api/ai/match-festivals/route.ts`

Change:
```typescript
const allEvents = await db
  .select()
  .from(event)
  .where(gt(event.deadline, now));  // Remove this line for testing
```

To:
```typescript
const allEvents = await db
  .select()
  .from(event);
```

⚠️ **Remember to add it back** after testing!

## Expected Console Output (Success)

When working correctly, you should see:

```
Calling AI matching API: http://localhost:3000/api/ai/match-festivals?theme=...&language=English
AI API response status: 200 OK
AI API raw response: {"userInput":{"theme":"...","language":"English"},"totalFestivals":5,"compatibleMatches":3,"matches":[{"eventId":1,"eventTitle":"Sundance Film Festival","matchScore":85,...}]}
AI matching results (parsed): {userInput: {…}, totalFestivals: 5, compatibleMatches: 3, matches: Array(3)}
```

Then the page should redirect to `/films/matching` with results.

## Common Errors & Fixes

### Error: "Invalid response from AI API - not valid JSON"
**Cause**: Backend returned HTML or malformed response
**Fix**:
- Check backend is running properly
- Check backend logs for errors
- Try restarting backend

### Error: No matches but API succeeds
**Cause**: No festivals in database with open deadlines
**Fix**: Add test festivals with future deadlines (see Solution 1)

### Error: CORS error in console
**Cause**: Backend not allowing requests from localhost:3001
**Fix**: Check backend CORS settings in `FilmlyBackend/middleware.ts` or API route

### Error: "Failed to fetch"
**Cause**: Backend not running or wrong URL
**Fix**:
- Verify backend is running on port 3000
- Check `.env` has `NEXT_PUBLIC_API_URL=http://localhost:3000`
- Restart frontend dev server after .env change

## Testing Checklist

- [ ] Backend running on port 3000
- [ ] Frontend running on port 3001
- [ ] Console shows "Calling AI matching API: http://localhost:3000/..."
- [ ] Console shows "AI API response status: 200 OK"
- [ ] Console shows raw JSON response (not HTML)
- [ ] Console shows parsed data with matches array
- [ ] Backend logs show "Found X festivals with open deadlines" where X > 0
- [ ] Database has events with deadlines in the future
- [ ] No errors in browser console
- [ ] No errors in backend terminal

## Quick Test Command

Run this in your browser console to test the API directly:

```javascript
fetch('http://localhost:3000/api/ai/match-festivals?theme=test&language=English')
  .then(r => r.text())
  .then(text => {
    console.log('Raw response:', text);
    try {
      const json = JSON.parse(text);
      console.log('Parsed JSON:', json);
    } catch(e) {
      console.error('Not valid JSON!');
    }
  });
```

This will show you exactly what the API is returning.

## Next Steps

After debugging, please share:
1. What you see in "AI API raw response"
2. Any errors in the console
3. Backend terminal logs
4. How many events are in your database with future deadlines

This will help identify the exact issue!
