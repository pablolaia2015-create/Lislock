# Deployment & Migration Guide

## 1. Source Code & Configuration
This repository contains the complete Next.js frontend and backend.
- `package.json` contains all exact dependencies.
- Config files (`next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `eslint.config.mjs`) are included in the root.

## 2. Environment Variables
A complete `.env.example` file has been provided in the root of this directory. It lists all the external services and configuration needed.
- `MONGODB_URI`: Connection string to your new MongoDB instance.
- `MONGODB_DB`, `MONGODB_DB_PT`: Database names for environments.
- `GCS_*` and `GOOGLE_APPLICATION_CREDENTIALS`: Keys for Google Cloud Storage (used for uploading/serving images).
- `GOOGLE_MAPS_API_KEY`: API key for Google Maps distance calculations.
- `TWILIO_*`: Credentials for Twilio SMS/WhatsApp integration.
- `ADMIN_*`: Credentials and secrets for the custom built-in admin dashboard authentication.

## 3. Database Schema (MongoDB)
The application uses the following main collections:
- `bookings`: For booking appointments.
- `supplies`: For the inventory/store items.
- `contacts`: For the contact form submissions.
- `reviews`: For customer reviews.
- `categories`, `categoriesStore`: For managing supply categories.
- `english`: English test questions (based on the code).

There are no rigid schemas enforced at the MongoDB database level (no Mongoose used, only the raw `mongodb` driver), but the expected TypeScript types are structured in the code (e.g., `src/types/bookings.ts` and `src/lib/store/types.ts`).

### Schema Examples
**Booking Schema:**
```typescript
import type { ObjectId } from "mongodb";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
  _id?: ObjectId;
  serviceDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  durationMinutes: number;
  status: BookingStatus;
}
```

**Supply Schema:**
```typescript
export type Supply = {
  _id: string;
  name: string;
  description: string;
  category: string;
  serviceSlug: string;
  photos: string[];
  storeEntries: {
    storeName: string;
    link: string;
    price: number;
    inventory: {
      size: string;
      qty: number;
      _id: string;
    }[];
  }[];
  sellingPrice: number;
  itemSlug: string;
};
```

## 4. Deployment Instructions
Currently, the app relies on the standard Next.js build process. There is no Dockerfile or CI/CD pipelines (GitHub Actions) configured in the codebase.

**To deploy manually:**
1. Clone the repository to your server/hosting provider.
2. Run `npm install` to install dependencies.
3. Configure your `.env` file based on `.env.example`.
4. Run `npm run build` to compile the Next.js application.
5. Run `npm run start` to start the production server (it defaults to port 8080 according to `package.json`).

*Recommended platforms*: Vercel (easiest for Next.js), Render, or Google Cloud Run (you can easily add a standard Next.js Dockerfile for Cloud Run).

## 5. Other Critical Services
- **Image Storage**: Google Cloud Storage. You will need to create a bucket and provide a service account JSON key (`GOOGLE_APPLICATION_CREDENTIALS`).
- **Notifications**: Twilio.
- **Maps**: Google Maps Platform (Distance Matrix API).
- **Authentication**: Built-in (no external service like Clerk/Auth0 needed). JWT secrets and admin credentials are set purely via environment variables.
