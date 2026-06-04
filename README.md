# HyperFit — Performance Meets Luxury

AI-powered fashion e-commerce platform. Bold, futuristic, performance-meets-luxury.

**Live demo:** https://hyper-fit1.netlify.app

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS v4 |
| Animations | Framer Motion |
| State | Zustand (cart/UI), Redux Toolkit (global) |
| Database | PostgreSQL + Redis |
| ORM | Prisma |
| Auth | NextAuth.js (Google OAuth + Email OTP) |
| Payments | Stripe + Razorpay + Apple Pay |
| Media | Cloudinary |
| 3D | Three.js + React Three Fiber |
| Search | Algolia |
| Email | Resend |

## Monorepo Structure

```
hyperfit/
├── apps/
│   ├── web/          # Main store — localhost:3000
│   └── admin/        # Admin dashboard — localhost:3001
└── packages/
    ├── db/           # Prisma schema + client
    └── ui/           # Component library
```

## Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 15+
- Redis 7+

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example apps/web/.env.local
cp .env.example apps/admin/.env.local
# Edit both files with your credentials

# 3. Set up database
pnpm db:migrate
pnpm db:seed

# 4. Start dev servers
pnpm dev
```

## Key Commands

```bash
pnpm dev              # Start all apps in dev mode
pnpm build            # Build all apps
pnpm db:migrate       # Run Prisma migrations
pnpm db:seed          # Seed database with sample data
pnpm db:studio        # Open Prisma Studio
pnpm type-check       # TypeScript check across all packages
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, collections, trending |
| `/shop` | All products with filters |
| `/shop/[category]` | Category-filtered shop |
| `/product/[slug]` | Product detail (ISR, 60s) |
| `/customize/shoes` | 3D Shoe Builder |
| `/customize/tshirts` | T-Shirt Studio |
| `/customize/pants` | Pants Designer |
| `/cart` | Cart page |
| `/checkout` | Multi-step checkout |
| `/account` | User dashboard |
| `/admin` | Admin dashboard (role-protected) |

## Design System

```css
--hyper-black:       #0a0a0a
--hyper-white:       #f8f8f8
--hyper-accent:      #e8ff47   /* electric lime */
--hyper-accent-alt:  #ff3c3c   /* red — alerts */
--hyper-gray-dark:   #1c1c1c
--hyper-gray-mid:    #444444
--hyper-muted:       #888888
```

Typography: **Bebas Neue** (display) + **DM Sans** (body)

## Deployment

### Docker
```bash
docker compose up -d
```

### Vercel
```bash
vercel --prod
```

Set all environment variables from `.env.example` in your Vercel project settings.
