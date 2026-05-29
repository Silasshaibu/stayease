# StayEase — Hotel Booking Platform
## Project Progress & Continuation Guide

> Last updated: 2026-05-17
> Status: **Phase 1 — Full MVP code scaffolded. Ready for env setup, migration, and deployment.**

---

## What Has Been Built

### Monorepo Structure
```
hotel.swade-art.com/
├── apps/
│   ├── api/                        ✅ NestJS backend (port 4000)
│   │   ├── prisma/schema.prisma    ✅ Full 16-table schema
│   │   ├── src/                    ✅ All modules
│   │   ├── .env.example            ✅
│   │   ├── Dockerfile              ✅
│   │   ├── nest-cli.json           ✅
│   │   ├── railway.json            ✅
│   │   ├── tsconfig.json           ✅
│   │   └── package.json            ✅
│   └── web/                        ✅ Next.js 14 frontend (port 3000)
│       ├── src/                    ✅ All pages + components
│       ├── .env.example            ✅
│       ├── next.config.js          ✅
│       ├── tailwind.config.ts      ✅
│       ├── postcss.config.js       ✅
│       ├── tsconfig.json           ✅
│       ├── vercel.json             ✅
│       └── package.json            ✅
├── package.json                    ✅ Yarn workspaces root
└── README.md                       ✅ Full deployment guide
```

---

## Backend — NestJS (`apps/api`)

### Files Written
| File | Status | Description |
|------|--------|-------------|
| `src/main.ts` | ✅ Done | Bootstrap, CORS, ValidationPipe, Swagger |
| `src/app.module.ts` | ✅ Done | Root module wiring all 10 feature modules |
| `prisma/schema.prisma` | ✅ Done | Full 16-table PostgreSQL schema |
| `src/prisma/prisma.service.ts` | ✅ Done | Global Prisma client |
| `src/prisma/prisma.module.ts` | ✅ Done | Global @Global() module |
| `src/common/decorators/roles.decorator.ts` | ✅ Done | `@Roles()` decorator |
| `src/common/decorators/current-user.decorator.ts` | ✅ Done | `@CurrentUser()` decorator |
| `src/auth/dto/register.dto.ts` | ✅ Done | Register DTO with validation |
| `src/auth/dto/login.dto.ts` | ✅ Done | Login DTO |
| `src/auth/strategies/jwt.strategy.ts` | ✅ Done | Passport JWT strategy |
| `src/auth/guards/jwt-auth.guard.ts` | ✅ Done | JWT auth guard |
| `src/auth/guards/roles.guard.ts` | ✅ Done | Role-based access guard |
| `src/auth/auth.service.ts` | ✅ Done | Register, login, getMe, sign token |
| `src/auth/auth.controller.ts` | ✅ Done | POST /auth/register, /login, GET /auth/me |
| `src/auth/auth.module.ts` | ✅ Done | Module + JwtModule async registration |
| `src/users/dto/update-user.dto.ts` | ✅ Done | Update profile DTO |
| `src/users/users.service.ts` | ✅ Done | Profile, wishlist, notifications, wallet |
| `src/users/users.controller.ts` | ✅ Done | GET/PUT profile, wishlist CRUD, notifications |
| `src/users/users.module.ts` | ✅ Done | |
| `src/hotels/dto/hotel.dto.ts` | ✅ Done | CreateHotelDto, UpdateHotelDto, HotelPolicyDto |
| `src/hotels/hotels.service.ts` | ✅ Done | CRUD, featured, owner hotels, policy upsert |
| `src/hotels/hotels.controller.ts` | ✅ Done | Public + owner-protected routes |
| `src/hotels/hotels.module.ts` | ✅ Done | |
| `src/rooms/dto/room.dto.ts` | ✅ Done | CreateRoomDto, UpdateRoomDto, UpdateInventoryDto |
| `src/rooms/rooms.service.ts` | ✅ Done | CRUD, availability check, inventory management |
| `src/rooms/rooms.controller.ts` | ✅ Done | Public + owner-protected routes |
| `src/rooms/rooms.module.ts` | ✅ Done | |
| `src/bookings/dto/booking.dto.ts` | ✅ Done | CreateBookingDto with coupon support |
| `src/bookings/bookings.service.ts` | ✅ Done | Create (with pricing), find, cancel, hotel bookings |
| `src/bookings/bookings.controller.ts` | ✅ Done | Guest + owner booking routes |
| `src/bookings/bookings.module.ts` | ✅ Done | |
| `src/payments/payments.service.ts` | ✅ Done | Stripe Checkout, webhook, refund |
| `src/payments/payments.controller.ts` | ✅ Done | Initialize, webhook, refund endpoints |
| `src/payments/payments.module.ts` | ✅ Done | |
| `src/search/search.service.ts` | ✅ Done | Destination search, filters, sort, suggestions |
| `src/search/search.controller.ts` | ✅ Done | GET /search, GET /search/suggestions |
| `src/search/search.module.ts` | ✅ Done | |
| `src/reviews/dto/review.dto.ts` | ✅ Done | CreateReviewDto |
| `src/reviews/reviews.service.ts` | ✅ Done | Create, getByHotel (with avg rating), myReviews |
| `src/reviews/reviews.controller.ts` | ✅ Done | |
| `src/reviews/reviews.module.ts` | ✅ Done | |
| `src/pricing/dto/pricing.dto.ts` | ✅ Done | CreatePricingRuleDto |
| `src/pricing/pricing.service.ts` | ✅ Done | Season/date pricing rules, effective price calc |
| `src/pricing/pricing.controller.ts` | ✅ Done | |
| `src/pricing/pricing.module.ts` | ✅ Done | |
| `src/notifications/notifications.service.ts` | ✅ Done | send(), sendToMany() |
| `src/notifications/notifications.module.ts` | ✅ Done | Exported for use by other modules |
| `src/admin/admin.service.ts` | ✅ Done | Stats, users, hotel approvals, bookings, revenue |
| `src/admin/admin.controller.ts` | ✅ Done | Full admin API (ADMIN role only) |
| `src/admin/admin.module.ts` | ✅ Done | |

---

### Database Schema Tables (Prisma — Neon PostgreSQL)
| Table | Description |
|-------|-------------|
| `users` | All user roles (GUEST / HOTEL_OWNER / ADMIN), profile, verification |
| `wallets` | Per-user credits/refund balance |
| `hotels` | Hotel listings with status workflow (PENDING → APPROVED) |
| `hotel_images` | Multiple images per hotel, isPrimary flag |
| `hotel_policies` | Cancellation, pets, smoking, children policies |
| `rooms` | Room listings with pricing, capacity, bed type |
| `room_images` | Images per room |
| `room_inventory` | Per-date availability counts + block flags |
| `pricing_rules` | Season/date-based price multipliers per room |
| `coupons` | Discount codes (% or fixed), usage limits, expiry |
| `bookings` | Full booking with nights, subtotal, discount, service fee |
| `payments` | Stripe payment record per booking |
| `payouts` | Hotel owner earnings records |
| `reviews` | Hotel reviews (1 per guest per hotel) |
| `wishlist_items` | Saved hotels per user |
| `notifications` | In-app notification records |

---

## Frontend — Next.js 14 (`apps/web`)

### Configuration Files
| File | Status | Description |
|------|--------|-------------|
| `package.json` | ✅ Done | Next.js 14, Zustand, React Query, Stripe, date-fns |
| `tsconfig.json` | ✅ Done | Strict mode, `@/*` path alias |
| `tailwind.config.ts` | ✅ Done | Custom primary (blue) + accent (amber) colors |
| `postcss.config.js` | ✅ Done | |
| `next.config.js` | ✅ Done | Remote image domains |
| `vercel.json` | ✅ Done | Vercel deployment config |
| `src/app/globals.css` | ✅ Done | Tailwind directives + Inter font |
| `src/app/layout.tsx` | ✅ Done | Root layout with metadata |
| `src/app/providers.tsx` | ✅ Done | React Query + react-hot-toast |
| `src/types/index.ts` | ✅ Done | All TypeScript interfaces (User, Hotel, Room, Booking…) |
| `src/services/api.ts` | ✅ Done | Axios instance + all API call wrappers |
| `src/store/auth.store.ts` | ✅ Done | Zustand auth (persisted, JWT in localStorage) |
| `src/store/booking.store.ts` | ✅ Done | Zustand booking state (hotel, room, dates, guests) |

### Components
| File | Status | Description |
|------|--------|-------------|
| `src/components/ui/Button.tsx` | ✅ Done | 5 variants, sizes, loading spinner |
| `src/components/ui/Input.tsx` | ✅ Done | Label + error message forwardRef input |
| `src/components/ui/Card.tsx` | ✅ Done | Base card wrapper |
| `src/components/ui/StarRating.tsx` | ✅ Done | Star display (sm/md) |
| `src/components/layout/Navbar.tsx` | ✅ Done | Sticky nav, user dropdown, owner/admin links |
| `src/components/layout/Footer.tsx` | ✅ Done | Links footer |
| `src/components/hotels/HotelCard.tsx` | ✅ Done | Hotel card with image, rating, price, wishlist btn |
| `src/components/hotels/SearchBar.tsx` | ✅ Done | Destination + check-in/out + guests (full & compact) |
| `src/components/hotels/FeaturedHotels.tsx` | ✅ Done | Client component fetching featured hotels |

### Pages
| Route | File | Status | Description |
|-------|------|--------|-------------|
| `/` | `app/page.tsx` | ✅ Done | Home: hero search, destinations, featured, why us |
| `/search` | `app/search/page.tsx` | ✅ Done | Search results with sort + star filters |
| `/hotels/[id]` | `app/hotels/[id]/page.tsx` | ✅ Done | Hotel detail: images, rooms, reviews, date sidebar |
| `/checkout` | `app/checkout/page.tsx` | ✅ Done | Booking form → Stripe redirect |
| `/login` | `app/login/page.tsx` | ✅ Done | Login form (RHF + Zod) |
| `/register` | `app/register/page.tsx` | ✅ Done | Register form (RHF + Zod) |
| `/promotions` | `app/promotions/page.tsx` | ✅ Done | Deals & offers page + coupon CTA |
| **Guest Dashboard** | | | |
| `/dashboard` | `app/dashboard/page.tsx` | ✅ Done | My bookings list with status badges |
| `/dashboard` | `app/dashboard/layout.tsx` | ✅ Done | Sidebar nav layout with auth guard |
| `/dashboard/wishlist` | `app/dashboard/wishlist/page.tsx` | ✅ Done | Saved hotels with remove |
| `/dashboard/reviews` | `app/dashboard/reviews/page.tsx` | ✅ Done | Reviews I've written |
| `/dashboard/profile` | `app/dashboard/profile/page.tsx` | ✅ Done | Edit profile form |
| `/dashboard/notifications` | `app/dashboard/notifications/page.tsx` | ✅ Done | Notification list with mark-all-read |
| **Hotel Owner Dashboard** | | | |
| `/owner` | `app/owner/page.tsx` | ✅ Done | Overview: stats cards + recent hotels |
| `/owner` | `app/owner/layout.tsx` | ✅ Done | Sidebar nav + role guard (HOTEL_OWNER or ADMIN) |
| `/owner/properties` | `app/owner/properties/page.tsx` | ✅ Done | Hotel CRUD with inline form |
| `/owner/rooms` | `app/owner/rooms/page.tsx` | ✅ Done | Per-hotel room management with add/delete |
| `/owner/bookings` | `app/owner/bookings/page.tsx` | ✅ Done | Reservation table per hotel |
| `/owner/payouts` | `app/owner/payouts/page.tsx` | ✅ Done | Earnings overview with commission info |
| `/owner/reviews` | `app/owner/reviews/page.tsx` | ✅ Done | Guest reviews per hotel |
| **Admin Dashboard** | | | |
| `/admin` | `app/admin/page.tsx` | ✅ Done | Platform stats cards |
| `/admin` | `app/admin/layout.tsx` | ✅ Done | Sidebar nav + ADMIN role guard |
| `/admin/users` | `app/admin/users/page.tsx` | ✅ Done | User table with inline role changer |
| `/admin/hotels` | `app/admin/hotels/page.tsx` | ✅ Done | Pending hotel approvals (approve / reject) |
| `/admin/bookings` | `app/admin/bookings/page.tsx` | ✅ Done | All platform bookings table |
| `/admin/payments` | `app/admin/payments/page.tsx` | ✅ Done | Revenue stats + paid transactions table |

---

## Deployment Stack

| Layer | Service | Config File |
|-------|---------|-------------|
| Frontend | **Vercel** | `apps/web/vercel.json` |
| Backend API | **Railway** | `apps/api/railway.json` + `apps/api/Dockerfile` |
| Database | **Neon** (PostgreSQL) | `DATABASE_URL` env var |
| Payments | **Stripe** | `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` |

---

## How to Continue — Step by Step

### Step 1 — Create Neon Database
1. Go to [console.neon.tech](https://console.neon.tech) → New Project → name it `stayease`
2. Copy the **Connection string** (pooled):
   `postgresql://user:pass@ep-xxx.neon.tech/stayease?sslmode=require`
3. Create `apps/api/.env` from `apps/api/.env.example`
4. Paste as `DATABASE_URL`

### Step 2 — Run Database Migration
```bash
cd apps/api
npm install
npx prisma migrate dev --name init
npx prisma generate
```

### Step 3 — Start the API locally
```bash
npm run dev
# API → http://localhost:4000/api
# Swagger → http://localhost:4000/api/docs
```

### Step 4 — Start the Frontend locally
```bash
cd apps/web
npm install
# Create .env.local
# NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm run dev
# Web → http://localhost:3000
```

### Step 5 — Deploy to Railway (API)
1. Push this folder to GitHub
2. New Railway project → **Deploy from GitHub repo**
3. Set **Root Directory** to `apps/api`
4. Add all env vars from `apps/api/.env.example`
5. Railway detects the `Dockerfile` and builds automatically
6. After deploy: run `npx prisma migrate deploy` via Railway CLI or shell

### Step 6 — Deploy to Vercel (Frontend)
1. [vercel.com/new](https://vercel.com/new) → Import repo
2. Set **Root Directory** to `apps/web`
3. Add env vars:
   - `NEXT_PUBLIC_API_URL` = your Railway API URL (e.g. `https://stayease-api.railway.app/api`)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_test_...`
4. Deploy

### Step 7 — Wire up Stripe Webhook
1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://your-api.railway.app/api/payments/webhook`
3. Event: `checkout.session.completed`
4. Copy the **Signing secret** → set as `STRIPE_WEBHOOK_SECRET` in Railway

---

## What Is NOT Done Yet (Phase 2 Work)

### Backend — Missing / To Improve
| Item | Priority | Notes |
|------|----------|-------|
| Password reset / forgot password | High | Fields exist, no email send yet — needs Nodemailer service wired in |
| Email verification on register | High | `isVerified` field exists, no verification email sent |
| Image upload endpoint | High | No multer/S3/R2 upload — hotel/room images must be URLs for now |
| Promote user to HOTEL_OWNER on register | Medium | Currently needs admin to change role — add a `role` field to RegisterDto or a separate `/auth/register-owner` route |
| Socket.IO real-time | Medium | Package listed but not wired — for live booking confirmations, availability updates |
| Coupon admin CRUD | Medium | Coupons table exists, no admin endpoint to create/manage coupons |
| Payout disbursement | Medium | Payout records exist, no actual bank transfer trigger |
| Refresh tokens | Low | JWT only (7d expiry), no rotation |
| Rate limiting per-route | Low | ThrottlerModule installed globally, not tuned |

### Frontend — Missing Pages
| Page | Route | Priority |
|------|-------|----------|
| Register as Hotel Owner | `/register?role=owner` or `/register-owner` | **High** — owners need a way to sign up |
| Single booking detail | `/dashboard/bookings/[id]` | High |
| Room detail page | `/rooms/[id]` | Medium |
| Leave a review (post-stay) | `/dashboard/reviews/new?hotelId=x` | Medium |
| Pricing rules manager | `/owner/pricing` | Medium |
| Inventory calendar | `/owner/rooms/[id]/calendar` | Medium |
| 404 not-found page | `app/not-found.tsx` | Low |
| Order success / payment confirmed | `/dashboard?success=1` | Medium |

### Infrastructure — Missing
| Item | Priority | Notes |
|------|----------|-------|
| Prisma seed file | Medium | Seed: 1 admin user, sample hotels, rooms — useful for demo |
| Hotel image hosting | High | Currently expects image URLs — integrate Cloudflare R2 or Cloudinary |
| `docker-compose.yml` (local dev) | Low | Not needed for Neon (cloud DB) but handy for local Redis later |
| GitHub Actions CI | Low | Lint + type-check on PR |

---

## Key Technical Decisions Made

| Decision | Rationale |
|----------|-----------|
| Monorepo (yarn workspaces) | Single repo, unified TS config, easy for Railway + Vercel to target subdirs |
| NestJS | Decorator-based, built-in DI, scales to microservices easily |
| Prisma + Neon | Type-safe queries, serverless-friendly PostgreSQL, free tier |
| Zustand (not Redux) | Lightweight, persisted auth out of the box |
| React Query | Server state caching, auto-loading/error handling |
| JWT stateless auth | Works seamlessly across Railway (API) + Vercel (frontend) domains |
| Stripe Checkout (hosted) | Fastest PCI-compliant path — no card fields on our UI |
| Service fee = 5% of subtotal | Applied at booking creation, visible to guest before payment |
| Platform commission = 15% | Stored on `hotels.commission`, deducted from hotel payouts |
| Hotel approval workflow | Hotels start `PENDING`, admin approves before going live |

---

## API Endpoint Reference

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/users/profile
PUT    /api/users/profile
GET    /api/users/wishlist
POST   /api/users/wishlist/:hotelId
DELETE /api/users/wishlist/:hotelId
GET    /api/users/notifications
PUT    /api/users/notifications/read

GET    /api/hotels/featured
GET    /api/hotels
GET    /api/hotels/:id
POST   /api/hotels              (HOTEL_OWNER)
PUT    /api/hotels/:id          (HOTEL_OWNER)
DELETE /api/hotels/:id          (HOTEL_OWNER)
PUT    /api/hotels/:id/policy   (HOTEL_OWNER)
GET    /api/hotels/owner/my     (HOTEL_OWNER)

GET    /api/rooms/hotel/:hotelId
GET    /api/rooms/:id
GET    /api/rooms/:id/availability?checkIn=&checkOut=
POST   /api/rooms              (HOTEL_OWNER)
PUT    /api/rooms/:id          (HOTEL_OWNER)
DELETE /api/rooms/:id          (HOTEL_OWNER)
PUT    /api/rooms/:id/inventory (HOTEL_OWNER)

GET    /api/search?destination=&checkIn=&checkOut=&guests=&minPrice=&maxPrice=&starRating=&sortBy=
GET    /api/search/suggestions?q=

POST   /api/bookings
GET    /api/bookings/me
GET    /api/bookings/:id
PUT    /api/bookings/:id/cancel
GET    /api/bookings/hotel/:hotelId  (HOTEL_OWNER)

POST   /api/payments/initialize/:bookingId
POST   /api/payments/webhook          (Stripe — no auth)
POST   /api/payments/refund/:bookingId

GET    /api/reviews/hotel/:hotelId
POST   /api/reviews
GET    /api/reviews/me

GET    /api/pricing/hotel/:hotelId
GET    /api/pricing/effective?roomId=&checkIn=&checkOut=
POST   /api/pricing/rules       (HOTEL_OWNER)
DELETE /api/pricing/rules/:id   (HOTEL_OWNER)

GET    /api/admin/stats         (ADMIN)
GET    /api/admin/users         (ADMIN)
PUT    /api/admin/users/:id/role (ADMIN)
GET    /api/admin/hotels/pending (ADMIN)
PUT    /api/admin/hotels/:id/approve (ADMIN)
PUT    /api/admin/hotels/:id/reject  (ADMIN)
GET    /api/admin/bookings      (ADMIN)
GET    /api/admin/reports/revenue (ADMIN)
```

---

## Color Theme
- **Primary:** Blue — `primary-600` = `#2563eb`
- **Accent:** Amber — `accent-500` = `#f59e0b` (used for featured badges)
- **Background:** `slate-50`
- **Cards:** `white` with `shadow-sm border border-slate-100`
- **Font:** Inter (Google Fonts)

---

*To continue: open `hotel.swade-art.com/` in VS Code, read this file top to bottom, then pick up from the **"What Is NOT Done Yet"** section above.*
