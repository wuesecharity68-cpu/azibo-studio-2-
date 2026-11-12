# AZIBO STUDIO

AZIBO STUDIO is an AI video creation platform built with Next.js, Firebase, Paystack, and modern web technologies.

The platform allows users to create AI-generated videos from text prompts across multiple creative categories:

- Animal videos
- Realistic human videos
- 3D videos
- Anime videos
- Text-to-video generation

AZIBO STUDIO is actively under development and is being prepared for production use.

---

## Tech Stack

- Frontend: Next.js 16 App Router, React 19, TypeScript
- Styling: Tailwind CSS v4
- UI: Radix UI, Lucide Icons, shadcn/ui components
- Backend: Next.js API routes
- Database: Firebase Firestore
- Authentication: Firebase Authentication
- Payments: Paystack
- State/Data: TanStack Query and Firebase listeners
- Analytics: Vercel Analytics and application analytics
- Charts: Recharts
- Animation: Framer Motion

---

## Project Structure

```text
/app
  /api
    /generate
    /generate/status
    /health
    /paystack
      /initialize
      /webhook
    /track-visit

  /auth
    /login
    /signup

  /admin
    /analytics
    /ai-providers
    /credit-packages
    /settings
    /testimonials
    /users

  /animal-videos
    - Animal AI video generation interface

  /human-videos
    - Realistic human AI video generation interface

  /3d-anime-videos
    - 3D and anime AI video generation interface

  /dashboard
    - User dashboard

    /settings
      - User account settings

  /pricing
    - Subscription and payment interface

  /support
    - Support/contact interface

  /page.tsx
    - Homepage

/lib
  /firebase.ts
    - Firebase client initialization

  /firebase-admin.server.ts
    - Firebase Admin SDK server configuration

  /auth-utils.ts
    - Authentication and authorization utilities

  /credits-utils.ts
    - Credit/unit management and transactions

  /video-generator-config.ts
    - AI video generator configuration

  /video-generators
    - AI video provider integrations

/components
  /ui
    - UI components

  /sections
    - Homepage sections

  /ProtectedRoute.tsx
    - Protected route wrapper

  /DemoModal.tsx
    - Product demonstration modal

  /ToastDisplay.tsx
    - Toast notification display