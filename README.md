# CATZX DIGITAL INVITATION | Bespoke Digital Wedding Invitation Platform

A modern, production-ready, database-driven **Wedding Invitation Management Platform** built with **Next.js 14**, **React**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, **Framer Motion**, and **PostgreSQL / SQLite**.

This platform is NOT a static demo website. It is an enterprise multi-tenant system where an administrator can create, customize, manage, preview, duplicate, and publish hundreds or thousands of unique digital wedding invitations from a single centralized Admin Portal without changing code or redeploying the application.

---

## 🌟 Platform Highlights

### 1. Unified Admin Portal (`/admin`)
- **Secure Authentication**: Bcrypt password hashing, signed HTTP-only JWT sessions, protected administrative routes.
- **Interactive Dashboard**: Real-time metrics for Total Invitations, Published, Draft, Total RSVPs, and Attending Guest Headcount.
- **10-Step Multi-Step Builder Wizard**:
  1. *Couple Details*: Groom & Bride names, photos, couple cover, story, family blessings.
  2. *Wedding Date & Time*: Time zone, start/end time, date (powers countdown & calendar).
  3. *Events*: Unlimited events (Haldi, Mehendi, Sangeet, Muhurtham, Reception) with dates, times, venues, icons, descriptions.
  4. *Venue & Google Maps*: Venue name, full address, city, state, country, lat/long, direct Google Maps link.
  5. *Photo Gallery*: Multiple photo uploads, captions, cover image flag.
  6. *Background Music*: Enable/disable toggle, audio URL/upload, custom song title.
  7. *Template Selection*: Visual catalog of 10 distinct luxury wedding templates.
  8. *Customization*: Primary, secondary, accent, background, and text color pickers; heading and body font selectors.
  9. *Live Device Preview*: Interactive desktop, tablet (768px), and mobile (375px) device preview frames with real-time database-driven rendering.
  10. *Publish & Share*: Custom slug editor with uniqueness validation, status toggles (`DRAFT`, `PUBLISHED`, `UNPUBLISHED`, `ARCHIVED`), link copying, and social sharing.
  - *"Save Draft"* available at every stage!
- **One-Click Duplication System**: Instantly clone template, colors, layout, and configuration into a new wedding with a fresh unique slug.
- **RSVP Management**: Complete guest attendance tracker, dietary preference breakdown (Veg, Non-Veg, Jain, Vegan), search, and **1-click CSV Export**.
- **Media Library**: Manage photography assets and copy image URLs.

---

### 2. Public Wedding Invitation Experience (`/invite/[slug]`)
Each wedding is dynamically rendered from the database using its unique URL slug:
- **Date Reveal Opening Ceremony**: Full-screen 3D wax-seal envelope opening animation powered by Framer Motion, unfolding card, couple names reveal, and Save The Date date reveal.
- **Live Countdown Timer**: Days, Hours, Minutes, Seconds ticking countdown. Displays a celebratory "Happily Ever After" message after the wedding date passes.
- **Floating Background Music Player**: Non-intrusive audio control (Music ON/OFF) with animated soundwave visualizer.
- **Events & Timeline**: Chronological event schedule with venue, address, timings, and individual *"Add to Calendar"* buttons per event.
- **Master Add to Calendar**: Generates standard RFC 5545 `.ics` calendar files (Apple Calendar, Outlook) and 1-click Google Calendar web links.
- **Venue & Google Maps**: Venue details, full address, and interactive Google Maps embed + *"Open in Google Maps"* button.
- **Photo Gallery & Lightbox**: Responsive grid with full-screen lightbox modal (next, previous, close, keyboard arrow controls).
- **Interactive RSVP**: Real-time guest response submission with meal preferences and celebratory confetti explosion.
- **Social Sharing & Dynamic OpenGraph**: 1-click WhatsApp share with pre-filled message, copy link, and dynamic social preview cards.
- **Mobile-First Design**: Fluid touch targets, zero horizontal scrolling, and fast loading across Android and iOS devices.

---

### 3. Ten Distinct Luxury Templates

1. **Royal Gold**: Palatial Indian royalty, shimmering gold foil accents, regal ivory cream, intricate mandala borders.
2. **Black & Gold Luxury**: Deep obsidian velvet backdrop, burnished metallic gold, high-fashion serif typography.
3. **Floral Romance**: Watercolored English roses, sage eucalyptus vines, soft rose-gold hues.
4. **Minimal Chic**: Architectural Scandinavian modernism, crisp typography, generous negative space.
5. **Pastel Dream**: Ethereal blend of soft lavender, powder blue, and peach sunsets.
6. **Traditional Indian (Vedic Vermilion)**: Auspicious vermilion red, sacred turmeric yellow, peacock motifs, shloka accents.
7. **South Indian Heritage**: Kanjivaram silk saree inspiration, banana leaf green, temple gopuram borders, sacred jasmine.
8. **Kannada Wedding (Hoysala Splendor)**: Hoysala stone carving motifs, Mysore silk royal red, sandalwood tones.
9. **Modern Editorial**: Vogue-inspired wedding magazine style, sleek black typography, cinematic framing.
10. **Premium Dark (Celestial Velvet)**: Midnight starlight aesthetic, deep sapphire blue, cosmic constellation sparkles, platinum accents.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS & Google Fonts (Cinzel, Playfair Display, Marcellus, Cormorant) |
| **Animations** | Framer Motion & GSAP |
| **ORM** | Prisma ORM v5 |
| **Database** | PostgreSQL (Supabase / Neon ready) & SQLite (Local zero-config dev) |
| **Authentication** | Bcrypt password hashing & JWT session cookies |
| **Icons & Effects** | Lucide React & Canvas-Confetti |
| **Calendar** | RFC 5545 Standard `.ics` Generator & Google Calendar API |

---

## 🗄️ Relational Database Architecture

```text
User (Admin)
  └── Invitation (slug, templateId, primaryColor, music, date, status)
        ├── Couple (groomName, brideName, photos, introduction, story, familyMessage)
        ├── Events (name, date, startTime, endTime, venueName, address, description, icon)
        ├── Venue (venueName, fullAddress, city, state, country, lat, long, googleMapsUrl)
        ├── Gallery (imageUrl, caption, sortOrder, isCover)
        ├── Rsvps (guestName, phone, email, guestsCount, attending, foodPreference, message)
        ├── Template (name, description, previewImage, configuration)
        └── Settings (section, key, value)
```

Cascading deletes ensure that deleting or archiving an invitation safely removes its associated records without leaving orphaned data.

---

## 🚀 Quick Start & Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client & Sync Database
```bash
npx prisma generate
npx prisma db push
```

### 3. Seed Sample Data
```bash
node prisma/seed.js
```
This automatically seeds:
- Administrator Account: `admin@weddingplatform.com` / `Admin@Wedding2026!`
- 10 Luxury Design Templates
- Sample Wedding 1: **Rahul & Priya** (`/invite/rahul-priya`) — Published
- Sample Wedding 2: **Arjun & Shreya** (`/invite/arjun-shreya`) — Draft

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Credentials

- **Admin Portal**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@weddingplatform.com`
- **Password**: `Admin@Wedding2026!`

*(A convenient "Auto-Fill Admin Credentials" button is provided on the login page for rapid testing)*

---

## 🌐 Sample Invitations for Verification

- **Published Wedding**: [http://localhost:3000/invite/rahul-priya](http://localhost:3000/invite/rahul-priya)
- **Draft Wedding**: [http://localhost:3000/invite/arjun-shreya](http://localhost:3000/invite/arjun-shreya)

---

## 🚢 Deploying to PostgreSQL (Supabase / Neon / Vercel)

The codebase is 100% cloud-ready. To deploy with PostgreSQL:

1. Create a database instance on [Neon](https://neon.tech) or [Supabase](https://supabase.com).
2. Copy your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require"
   ```
3. Set `DATABASE_URL` and `JWT_SECRET` in your Vercel project environment variables.
4. Use `prisma/schema.postgresql.prisma` or set `provider = "postgresql"` in `prisma/schema.prisma`.
5. Deploy to Vercel with standard `npm run build`.

---

## 🧪 Verification & E2E Testing

Run the automated verification suite:
```bash
node prisma/test-e2e.js
```
Verifies all 30 core requirements:
- Admin password hashing & verification
- Template loading
- Multi-invitation data isolation
- Dynamic wedding creation
- Duplication system with unique slug generation
- RSVP submission and guest count isolation
- `.ics` calendar generation
