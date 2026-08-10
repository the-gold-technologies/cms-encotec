# **encotec CMS (Content Management System)**

A high-performance, custom-built, premium Content Management Dashboard built with Next.js 14, Prisma, PostgreSQL, Tailwind CSS, and NextAuth.

**Live CMS Dashboard:** [https://cms-encotec.tgtpartner.com](https://cms-encotec.tgtpartner.com)  
**Live Website:** [https://encotec-six.vercel.app](https://encotec-six.vercel.app)

---

[![Status: Active](https://img.shields.io/badge/Status-Active-brightgreen.svg)]()
[![Node.js](https://img.shields.io/badge/Node.js-18.x-blue.svg)]()
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)]()
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-38B2AC.svg)]()
[![Prisma](https://img.shields.io/badge/Prisma-ORM-5A67D8.svg)]()

<br />

Welcome to **encotec CMS** — a dedicated portal designed to securely and dynamically manage the Encotec digital footprint. This centralized portal offers a seamless, fast, and responsive UI for managing dynamic page sections, services details, SEO parameters, and direct client enquiries without touching code.

---

## 📑 Table of Contents

- [Core Principles & Features](#-core-principles--features)
- [System Architecture](#-system-architecture)
- [Folder Structure](#-folder-structure)
- [Developer Setup](#-developer-setup)
- [Production Deployment](#-production-deployment)
- [Design Language](#-design-language)

---

## ✨ Core Principles & Features

encotec CMS bridges the gap between static site generation and dynamic database-driven views by exposing real-time API integrations that feed the main website's serverless pre-renderer.

| Feature Area             | Capabilities                                                                            |
| :----------------------- | :-------------------------------------------------------------------------------------- |
| **Modular Page Control** | Section-based layout mapping for rapid edits to Home, About, Services, and Careers.     |
| **SEO & Meta Engine**    | Page-by-page title, description, canonical link, social tags, and custom schema markup. |
| **Sitemap & Robots**     | Dynamic robots.txt rules editing and custom/auto sitemap generator link mappings.       |
| **Enquiry & Lead CRM**   | Unified dashboard tracing direct form submissions, CRM integrations, and notifications. |
| **Asset Lifecycle O&M**  | Core CMS widgets to update capacity stats, locations, services data, and team profiles. |

---

## 🚀 System Architecture

Built for Speed, Security, and Scale.

- **Frontend**: `Next.js 14 (App Router)` running `React 18` and `NextAuth` for authentication.
- **Database Engine**: `PostgreSQL` managed via `Prisma ORM` schema migrations.
- **Styling & Layout**: `Tailwind CSS`, paired with `Framer Motion` and `Lucide React` icons.

---

## 📂 Folder Structure

The repository is modularly segmented:

```text
encotec-cms/
├── prisma/                    # Schema models, seed scripts, and migrations
├── public/                    # Root static assets and images
├── src/
│   ├── app/                   # Next.js App Router folders
│   │   ├── api/               # API endpoints (GET, POST, PUT, DELETE)
│   │   ├── components/        # Layout components (Sidebar, TopNav)
│   │   ├── seo/               # Sitemap & Robots management forms
│   │   └── static-pages/      # Dynamic section controls for Encotec pages
│   ├── components/            # Reusable core elements (Inputs, Uploaders, Modals)
│   └── lib/                   # Integrations (Prisma client database instance)
├── .env                       # Local secrets (Database URLs, NextAuth configuration)
├── next.config.mjs            # Application compilation configuration
└── README.md                  # Project documentation (You are here!)
```

---

## 💻 Developer Setup

Follow the steps below to initialize and serve the CMS locally.

### 1. Requirements

Ensure the target machine has the following dependencies initialized:

- **Node.js** (v18.0.0 or later)
- **npm** (v9.0.0 or later)
- **PostgreSQL**

### 2. Install Dependencies

Clone this repository and hydrate the application:

```bash
git clone <repository-url>
cd encotec-cms
npm install
```

### 3. Environment Allocation

Generate a secure `.env` file at the root of `encotec-cms/`:

```env
# Database Connection
DATABASE_URL="" # PostgreSQL connection string
DIRECT_URL=""   # PostgreSQL direct connection string

# Cloudinary configuration
CLOUDINARY_URL="" # Cloudinary URL API key/secret

# NextAuth configuration
AUTH_SECRET=""      # A random 32-character secret key
NEXTAUTH_URL="http://localhost:3000"
ALLOWED_ORIGINS="*"

# Website URL for sitemap fallback
NEXT_PUBLIC_WEBSITE_URL="" # Live frontend website domain

```

### 4. Database Syncing

Sync the schema structure with the database and seed the default admin credentials and section parameters:

```bash
# Push schema structure into the database
npx prisma db push

# Seed the database
node prisma/seed.js
```

### 5. Run the Application

Start the development server:

```bash
npm run dev
```

The dashboard is now running at `http://localhost:3000`.

---

## 🚀 Production Deployment

When deploying to production, configure these environment variables in your hosting provider's settings:

- **`NEXTAUTH_URL`**: Your production CMS URL (e.g. `https://cms.yourdomain.com`).
- **`AUTH_TRUST_HOST`**: Set this to `true` (Mandatory for NextAuth v5 to trust custom domains).
- **`NEXT_PUBLIC_WEBSITE_URL`**: Your production frontend website URL (e.g. `https://yourdomain.com`).

---

## 🎨 Design Language

The application relies on maintaining the high-fidelity corporate engineering identity of Encotec:

- **Corporate Slate Backgrounds**: Clean, modern dark grids simulating a high-tech engineering workstation.
- **Accents**: Brand-pink accents (`#a0004f`) used sparingly for primary status states, CTAs, highlight badges, and hover animations.
- **Transitions**: Low-friction Framer Motion transitions for smooth sidebar interactions.

---

<p align="center">
  <b>© 2026 Encotec Engineering</b><br>
  Strictly Private and Confidential Codebase.
</p>
