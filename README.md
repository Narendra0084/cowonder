# Co Wonder — Modern Premium Travel Booking Agency Platform

A modern, trustworthy travel agency platform engineered for genuine holiday planning, enquiry management, and customer conversions. Built with a full-stack architecture featuring a responsive web client with modern hero slider and an Express + Node.js REST API.

---

## 1. Core Customer Journey

```
Landing Page
  → Explore Destinations (Kashmir, Dubai, Bali, Kerala, Goa, Rajasthan)
  → View Tour Package (Itinerary, Inclusions/Exclusions, Pricing)
  → Submit Enquiry ("LET'S PLAN YOUR TRIP." modal with human reference TRV-2026-XXXX)
  → WhatsApp / Phone Conversation (pre-filled deep link)
  → Travel Agent Reviews & Issues Quote
  → Client Views Quote & Makes Advance/Full Payment
  → Instant Backend Verification (Direct UPI / NetBanking / Cards)
  → Booking Confirmation & Printable Voucher (CW-2026-XXXXX)
  → Trip Journey & Dedicated On-Ground Concierge
  → Verified Customer Review Submission & Admin Moderation
```


---

## 2. Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Motion (Framer Motion), Three.js (3D Interactive Rotating Globe with spatial pin markers).
- **Backend:** Node.js, Express 4, MongoDB, Mongoose, REST API.
- **Architecture:** Clean separation of client (`src/`) and server (`server/src/controllers/`, `server/src/models/`, `server/src/routes/`, `server/src/services/`).

---

## 3. REST API Documentation

All routes are mounted under `/api`:

| Method | Endpoint | Description | Payload / Query |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/enquiries` | Submit client travel enquiry | `{ name, phone, destination, packageId?, travelDate, travellers, message? }` |
| `GET` | `/api/enquiries` | Fetch all logged enquiries (Admin) | None |
| `GET` | `/api/enquiries/:ref`| Retrieve quote & enquiry status by reference | `TRV-2026-XXXX` |
| `PATCH`| `/api/enquiries/:ref`| Update enquiry status or attach approved quote | `{ status, quotedAmount, quoteNotes, quoteValidUntil }` |
| `GET` | `/api/destinations` | List curated travel destinations | None |
| `GET` | `/api/packages` | List tour packages | None |
| `GET` | `/api/packages/:slug`| Get single tour package by slug or ID | Package slug |
| `POST` | `/api/packages` | Create new tour package (Admin) | Full package schema |
| `PUT` | `/api/packages/:id` | Update tour package (Admin) | Update fields |
| `DELETE`| `/api/packages/:id` | Delete tour package (Admin) | None |
| `GET` | `/api/reviews` | Get verified customer reviews | `?all=true` for admin moderation |
| `POST` | `/api/reviews` | Submit new review (enters pending status) | `{ customerName, packageTitle, rating, review, photo?, bookingId? }` |
| `PATCH`| `/api/reviews/:id` | Approve or reject review | `{ status: 'approved' \| 'rejected' }` |
| `POST` | `/api/contact` | Submit contact form into enquiry desk | `{ name, phone, email?, subject?, message }` |
| `POST` | `/api/payments/create-order` | Create payment order | `{ amount, currency?, enquiryReference? }` |
| `POST` | `/api/payments/verify` | Server-authoritative payment verification | `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, enquiryReference, amount, customer, package, travelDate, travellers }` |
| `GET` | `/api/bookings` | Fetch confirmed bookings | None |

---

## 4. Getting Started Locally

### Prerequisites
- Node.js 18+ installed
- (Optional) Local MongoDB or MongoDB Atlas URI. If omitted, the server runs in memory-buffered persistence mode automatically.

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd <project-folder>

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Running the Development Server
```bash
# Starts Express server with Vite middleware on port 3000
npm run dev
```
Visit `http://localhost:3000` in your browser.

---

## 5. MongoDB Setup

1. To connect a MongoDB instance, set the `MONGODB_URI` variable in your `.env`:
   ```bash
   MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/wanderwaves?retryWrites=true&w=majority"
   ```
2. If `MONGODB_URI` is blank or unreachable, the server falls back to memory persistence seeded with curated travel data.

---

## 6. Payment Architecture (Razorpay)

Payment verification is executed strictly on the backend:
1. Client calls `POST /api/payments/create-order` to generate order metadata.
2. After the payment interface completes, the client submits transaction identifiers to `POST /api/payments/verify`.
3. The server computes the HMAC-SHA256 signature using `RAZORPAY_KEY_SECRET`:
   ```typescript
   const expectedSignature = crypto
     .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
     .update(order_id + '|' + payment_id)
     .digest('hex');
   ```
4. Only upon successful verification does the server instantiate an official `Booking` entity (`BK-2026-XXXXX`), transition the enquiry status to `confirmed`, and return the verified booking payload.

---

## 7. Production Build

```bash
# Build frontend assets
npm run build

# Start production server
npm run start
```
The server will bind to `process.env.PORT` or default to port `3000`.
