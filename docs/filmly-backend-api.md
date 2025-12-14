# Filmly Backend API - Quick Reference

**Base URL:** `https://filmly-backend.vercel.app`

**Auth Header:** `Authorization: Bearer <access_token>`

---

## Enums

### User Roles
- `Free` - Basic user
- `Premium` - Paid subscription

### Genres
Comedy, Romance, Drama, Educational, Documentary, War, Fantasy, Action, Traditional, Western, Horror, Animation, Thriller, Adventure, Science Fiction, Musical, Cinematography, Screenplay, Youth Film, Audience Choice

### Languages
English, Khmer, Chinese, No Restriction

### Submission Status
submitted, under_review, reviewed

### Categories (for Winners)
1st, 2nd, 3rd, Comedy, Romance, Drama, Educational, Documentary, War, Fantasy, Action, Traditional, Western, Horror, Animation, Thriller, Adventure, Science Fiction, Musical, Cinematography, Screenplay, Youth Film, Audience Choice, Actor, Actress, Director

### Crew Roles
Producer, Screenwriter, Actor, Actress, Supporting Actor, Supporting Actress, Director of Photography, Editor, Music Director, Sound Designer, Production Designer, Costume Designer, Visual Effects (VFX) Supervisor, Stunt Coordinator, Assistant Director (AD), Script Supervisor, Lighting Technician, Camera Operator, Production Assistant (PA), Casting, Director, Set Designer, Choreographer, Narrator

---

## Authentication

### Sign Up
`POST /api/auth/signup`
- **Input:**
```json
{
  "email": "johndoe@example.com",
  "password": "SecurePass123!",
  "username": "johndoe"
}
```
- **Output:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "johndoe@example.com"
  },
  "session": {
    "access_token": "...",
    "refresh_token": "..."
  }
}
```

### Login
`POST /api/auth/login`
- **Input:**
```json
{
  "email": "johndoe@example.com",
  "password": "SecurePass123!"
}
```
- **Output:**
```json
{
  "profile": {
    "id": 1,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "username": "johndoe",
    "email": "johndoe@example.com",
    "description": "Independent filmmaker and storyteller",
    "role": "Premium"
  }
}
```

### Update Profile (Full)
`PUT /api/user-profile` 🔒
- **Input:**
```json
{
  "username": "johndoe_films",
  "email": "john.new@example.com",
  "description": "Award-winning filmmaker"
}
```
- **Output:**
```json
{
  "message": "Profile updated successfully",
  "profile": {
    "id": 1,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "username": "johndoe_films",
    "email": "john.new@example.com",
    "description": "Award-winning filmmaker",
    "role": "Premium"
  }
}
```

### Update Profile (Partial)
`PATCH /api/user-profile` 🔒
- **Input:**
```json
{
  "description": "Award-winning filmmaker and director"
}
```
- **Output:**
```json
{
  "message": "Profile updated successfully",
  "profile": {
    "id": 1,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "username": "johndoe",
    "email": "johndoe@example.com",
    "description": "Award-winning filmmaker and director",
    "role": "Premium"
  }
}
```

### Logout
`POST /api/auth/logout`
- **Input:** None
- **Output:**
```json
{
  "message": "Logout successful"
}
```

### Get Current User
`GET /api/auth/currentUser` 🔒
- **Input:** None
- **Output:**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "johndoe@example.com",
    "name": "John Doe",
    "email_verified": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-06-20T14:45:00Z"
  }
}
```

### Forget Password
`POST /api/auth/forgetPassword`
- **Input:**
```json
{
  "email": "johndoe@example.com"
}
```
- **Output:**
```json
{
  "message": "Password reset email sent"
}
```

---

## Films

### Get All User Films
`GET /api/films` 🔒
- **Output:** `{ films: [...], count }`

### Create Film
`POST /api/films` 🔒 (multipart/form-data)
- **Input:** 
  - `title` (required)
  - `genre` (required, JSON array)
  - `language` (required)
  - `description` (optional)
  - `duration` (optional, integer)
  - `videoFile` (optional, file)
  - `subtitleFile` (optional, file, max 5MB)
- **Output:** `{ message, film }`

### Get Film by ID
`GET /api/films/[id]`
- **Output:** `{ film }`

### Update Film (Full)
`PUT /api/films/[id]` 🔒 (owner only, multipart/form-data)
- **Input:** Same as Create + `removeVideo`, `removeSubtitle`
- **Output:** `{ message, film }`

### Update Film (Partial)
`PATCH /api/films/[id]` 🔒 (owner only, multipart/form-data)
- **Input:** Any fields from Create
- **Output:** `{ message, film }`

### Delete Film
`DELETE /api/films/[id]` 🔒 (owner only)
- **Output:** `{ message }`

---

## Film Crew

### Get Film Crew
`GET /api/films/[id]/crew`
- **Output:** `{ crew: [...], count }`

### Add Crew Member
`POST /api/films/[id]/crew` 🔒 (owner only)
- **Input:** `{ crewName, crewRole }`
- **Output:** `{ message, crew }`

### Get Crew Member
`GET /api/films/[id]/crew/[crewId]`
- **Output:** `{ crew }`

### Update Crew Member
`PUT /api/films/[id]/crew/[crewId]` 🔒 (owner only)
- **Input:** `{ crewName, crewRole }`
- **Output:** `{ message, crew }`

### Delete Crew Member
`DELETE /api/films/[id]/crew/[crewId]` 🔒 (owner only)
- **Output:** `{ message }`

---

## Film Documents

### Get Film Documents
`GET /api/films/[id]/documents`
- **Output:** `{ documents: [...], count }`

### Upload Document
`POST /api/films/[id]/documents` 🔒 (owner only, multipart/form-data)
- **Input:** `document` (file, PDF/DOC/DOCX/TXT, max 20MB)
- **Output:** `{ message, document }`

### Get Document
`GET /api/films/[id]/documents/[documentId]`
- **Output:** `{ document }`

### Update Document
`PUT /api/films/[id]/documents/[documentId]` 🔒 (owner only, multipart/form-data)
- **Input:** `document` (file)
- **Output:** `{ message, document }`

### Delete Document
`DELETE /api/films/[id]/documents/[documentId]` 🔒 (owner only)
- **Output:** `{ message }`

---

## Events

### Get All Events
`GET /api/events?my=true&limit=10&offset=0`
- **Query Params:** `my` (boolean), `limit`, `offset`
- **Output:** `{ events: [...], count }`

### Create Event
`POST /api/events` 🔒 (Premium only)
- **Input:** `{ title, genre (array), language, deadline, description?, duration?, location?, previousDeadline? }`
- **Output:** `{ message, event }`

### Get Event by ID
`GET /api/events/[id]`
- **Output:** `{ event }`

### Update Event (Full)
`PUT /api/events/[id]` 🔒 (Premium owner only)
- **Input:** Same as Create
- **Output:** `{ message, event }`

### Update Event (Partial)
`PATCH /api/events/[id]` 🔒 (Premium owner only)
- **Input:** Any fields from Create
- **Output:** `{ message, event }`

### Delete Event
`DELETE /api/events/[id]` 🔒 (Premium owner only)
- **Output:** `{ message }`

---

## Event Images

### Get Event Images
`GET /api/events/[id]/images`
- **Output:** `{ images: [...], count }`

### Upload Image
`POST /api/events/[id]/images` 🔒 (Premium owner only, multipart/form-data)
- **Input:** `image` (file, JPEG/PNG/GIF/WebP, max 10MB)
- **Output:** `{ message, image }`

### Get Image
`GET /api/events/[id]/images/[imageId]`
- **Output:** `{ image }`

### Delete Image
`DELETE /api/events/[id]/images/[imageId]` 🔒 (Premium owner only)
- **Output:** `{ message }`

---

## Event Submissions

### Get Event Submissions
`GET /api/events/[id]/submissions`
- **Output:** `{ event, submissions: [...], count, isEventOwner }`
- **Note:** Event owners see full details, public sees limited info

---

## Event Winners

### Get Winners
`GET /api/events/[id]/winners`
- **Output:** `{ winners: [...], count }`

### Add Winner
`POST /api/events/[id]/winners` 🔒 (owner only)
- **Input:** `{ eventFilmSubmissionId, category, filmCrewId? }`
- **Output:** `{ message, winner }`

### Get Winner
`GET /api/events/[id]/winners/[winnerId]`
- **Output:** Winner details

### Update Winner
`PATCH /api/events/[id]/winners/[winnerId]` 🔒 (owner only)
- **Input:** `{ eventFilmSubmissionId?, category?, filmCrewId? }`
- **Output:** `{ message, winner }`

### Delete Winner
`DELETE /api/events/[id]/winners/[winnerId]` 🔒 (owner only)
- **Output:** `{ message }`

---

## Submissions

### Get User Submissions
`GET /api/submissions` 🔒
- **Output:** `{ myFilmSubmissions: [...], myEventSubmissions: [...], totalCount }`

### Submit Film to Event
`POST /api/submissions` 🔒
- **Input:** `{ eventId, filmId }`
- **Output:** `{ message, submission }`

### Get Submission
`GET /api/submissions/[id]` 🔒 (film or event owner)
- **Output:** `{ submission: { id, eventId, filmId, submissionStatus, event, film } }`

### Update Submission Status
`PATCH /api/submissions/[id]` 🔒 (Premium event owner only)
- **Input:** `{ submissionStatus: "submitted" | "under_review" | "reviewed" }`
- **Output:** `{ message, submission }`

### Delete Submission
`DELETE /api/submissions/[id]` 🔒 (film owner only)
- **Output:** `{ message }`

---

## Comments

### Get Comments
`GET /api/submissions/[id]/comments` 🔒 (film or event owner)
- **Output:** `{ submissionId, comments: [...], totalComments, userRole }`

### Add Comment
`POST /api/submissions/[id]/comments` 🔒 (Premium event owner only)
- **Input:** `{ comment }`
- **Output:** `{ message, comment }`

### Update Comment
`PATCH /api/submissions/[id]/comments/[commentId]` 🔒 (Premium owner who created it)
- **Input:** `{ comment }`
- **Output:** `{ message, comment }`

### Delete Comment
`DELETE /api/submissions/[id]/comments/[commentId]` 🔒 (Premium owner who created it)
- **Output:** `{ message }`

---

## Payment

### Create Checkout
`POST /api/checkout`
- **Input:** `{ products?, productPriceId?, customerId?, customerEmail?, customerName?, metadata? }`
- **Output:** `{ checkoutId, checkoutUrl, localCheckoutUrl }`

### Display Checkout
`GET /api/checkout?id=[checkoutId]`
- Redirects to Polar checkout page

### Payment Success
`GET /api/payment-success?checkout_id=[checkoutId]`
- **Output:** `{ success, message, checkoutId, customerEmail }`

### Webhook
`POST /api/webhooks/polar`
- Handles Polar webhooks (order.created, subscription.created, etc.)
- **Output:** `{ received: true }`

---

## Legend
- 🔒 = Requires authentication
- (owner only) = Must own the resource
- (Premium only) = Requires Premium subscription
- multipart/form-data = Use FormData for file uploads

## HTTP Status Codes
- `200` OK
- `201` Created
- `400` Bad Request
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `500` Server Error

---

**Last Updated:** December 2024
