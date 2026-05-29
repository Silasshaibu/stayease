# StayEase — Hotel Booking Platform

Booking.com / Airbnb-style hotel booking platform.

## Stack

| Layer    | Technology                      | Host     |
|----------|---------------------------------|----------|
| Frontend | Next.js 14, TypeScript, Tailwind | Vercel   |
| Backend  | NestJS, Prisma ORM              | Railway  |
| Database | PostgreSQL                      | Neon     |
| Payments | Stripe Checkout                 | —        |

---

## Project Structure

```
hotel.swade-art.com/
├── apps/
│   ├── api/          # NestJS backend → Railway
│   │   ├── prisma/schema.prisma
│   │   └── src/
│   │       ├── auth/
│   │       ├── users/
│   │       ├── hotels/
│   │       ├── rooms/
│   │       ├── bookings/
│   │       ├── payments/
│   │       ├── search/
│   │       ├── reviews/
│   │       ├── pricing/
│   │       ├── notifications/
│   │       └── admin/
│   └── web/          # Next.js frontend → Vercel
│       └── src/app/
│           ├── page.tsx           (Home)
│           ├── search/            (Search results)
│           ├── hotels/[id]/       (Hotel detail)
│           ├── checkout/          (Booking + payment)
│           ├── login/ register/
│           ├── promotions/
│           ├── dashboard/         (Guest dashboard)
│           ├── owner/             (Hotel owner)
│           └── admin/             (Admin panel)
└── package.json      # Yarn workspaces
```

---

## Local Development

```bash
# 1. Install dependencies
yarn install

# 2. Copy and fill env files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# 3. Push schema to Neon
cd apps/api && npx prisma migrate dev --name init

# 4. Start both servers
yarn dev
```

- API: http://localhost:4000/api
- Swagger: http://localhost:4000/api/docs
- Web: http://localhost:3000

---

## Deployment

### 1. Neon (Database)

1. Create project at https://neon.tech
2. Copy the **Connection string** (pooled)
3. Set it as `DATABASE_URL` in Railway env vars
4. Run migrations: `npx prisma migrate deploy`

### 2. Railway (API)

1. Create a new Railway project
2. Connect this repo and set **Root Directory** to `apps/api`
3. Add env vars from `apps/api/.env.example`
4. Railway auto-detects the Dockerfile and deploys

### 3. Vercel (Frontend)

1. Import this repo at https://vercel.com/new
2. Set **Root Directory** to `apps/web`
3. Add env vars from `apps/web/.env.example`
4. Set `NEXT_PUBLIC_API_URL` to your Railway API URL

### 4. Stripe Webhooks

1. In Stripe Dashboard → Webhooks, add endpoint:
   `https://your-api.railway.app/api/payments/webhook`
2. Select event: `checkout.session.completed`
3. Copy the webhook secret → `STRIPE_WEBHOOK_SECRET` in Railway

---

## MVP Features

- Hotel listings with search (destination, dates, guests, filters)
- Room inventory & availability checking
- Booking engine with coupon support
- Stripe Checkout payment flow + webhook confirmation
- Guest dashboard (bookings, wishlist, reviews, profile)
- Hotel owner dashboard (properties, rooms, reservations, payouts)
- Admin dashboard (users, hotel approvals, bookings, revenue)
- JWT authentication with role-based access (GUEST / HOTEL_OWNER / ADMIN)
- Real-time notifications

---

## Revenue Model

| Source                | Rate  |
|-----------------------|-------|
| Booking commission    | 15%   |
| Service fee (guest)   | 5%    |
| Featured listing      | TBD   |
| Subscription plans    | TBD   |
