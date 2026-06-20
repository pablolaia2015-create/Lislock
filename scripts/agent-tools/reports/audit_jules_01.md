# Audit Report: Next.js 15 Baseline (Branch: auditoria-jules-01)

## Overview
This document contains an audit of the target modules: `/src/app/booking`, `/src/app/customer/bookings`, and `/src/components/booking/*`. The issues are categorized by severity.

## Findings

### 1. Silent React Hydration Mismatches
**[CRITICAL]**
- **Location:** `src/components/booking/DateTimeAvailabilityField/index.tsx`, Line 91
- **Issue:** The component directly calls `const today = new Date();` during the initial render and passes it to the `DayPicker`'s `disabled` prop. Because `new Date()` executes on the server (which might be in a different timezone or a fraction of a second different than the client), it can cause a React hydration mismatch when the client renders the component.
- **Fix:** Move the instantiation of `new Date()` inside a `useEffect` hook to ensure it only runs on the client, or use an initial state that updates post-hydration.

### 2. Memory Leaks
**[WARNING]**
- **Location:** `src/app/booking/BookingClient.tsx`, Line 152
- **Issue:** The `onFilesChange` function uses `URL.createObjectURL(f)` to generate preview URLs for uploaded photos. However, there is no cleanup mechanism (e.g., in a `useEffect` return function) to call `URL.revokeObjectURL()` if the component unmounts before the form is submitted or if the user navigates away. This leads to memory leaks in the browser.
- **Fix:** Implement a `useEffect` that iterates over the `photos` array and revokes the object URLs when the component is unmounted.

### 3. Inefficient MongoDB Regex Queries
**[WARNING]**
- **Location:** `src/app/customer/bookings/page.tsx`, Lines 77-80
- **Issue:** The query uses `$regex` with `new RegExp(..., "i")` (case-insensitive) and lacks anchoring (e.g., `^`). This forces MongoDB to perform a full collection scan because indexes cannot be efficiently used with unanchored or case-insensitive regex queries on potentially large collections.
- **Fix:** Use anchored regex (e.g., `^...$`) or exact matches where possible. If flexible phone number matching is needed, consider normalizing phone numbers at the time of insertion (e.g., strictly E.164 format) and querying against the normalized field. Also, remove the `"i"` flag if not necessary for numbers.

### 4. Unhandled API Error States
**[WARNING]**
- **Location:** `src/components/booking/DateTimeAvailabilityField/index.tsx`, Lines 60 & 75
- **Issue:** The `fetch` calls to `/api/calendar-availability` and `/api/availability` lack error handling (e.g., `.catch()` blocks). If the network request fails or the API returns a non-200 response, the component will fail silently, and the user will not be able to select a time or date, with no feedback provided.
- **Fix:** Add `.catch()` handlers or use `try/catch` within async functions to handle fetch errors gracefully, perhaps setting an error state and displaying a user-friendly message.

### 5. UI/UX: Hardcoded Strings
**[OPTIMIZATION]**
- **Location:** `src/components/booking/BookingStatusPage.tsx`, Line 159
- **Issue:** The string "Adicionar fotografias" and "(Em breve)" are hardcoded in Portuguese. While the goal was to migrate to Portuguese, it's best practice to use the translation dictionary system (`Messages`) for all strings to maintain consistency and allow for future localization.
- **Fix:** Move these strings to the translation dictionaries and pass them via props or context.

- **Location:** `src/components/booking/BookingStatusPage.tsx`, Line 24 & Line 29
- **Issue:** Hardcoded default values for `formatServiceName` ("Serviço Geral") and `formatDate` ("A definir") bypassing dictionary configurations.
- **Fix:** Remove hardcoded fallback strings and read from localized dictionaries instead.
