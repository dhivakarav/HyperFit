<!-- DHIVA-HEADER -->
<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24,30&height=170&section=header&text=HyperFit&fontSize=46&fontColor=ffffff&animation=fadeIn" width="100%"/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&duration=3000&pause=900&color=6C63FF&center=true&vCenter=true&width=600&lines=AI-powered%20fashion%20e-commerce%20with%203D%20customizers;by%20Dhivakar%20A%20V%20%E2%9C%A8" alt="HyperFit" />

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white) ![GitHub](https://img.shields.io/badge/by-dhivakarav-181717?style=flat-square&logo=github)

</div>

🧥 _AI-powered fashion e-commerce with 3D customizers_

---

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
