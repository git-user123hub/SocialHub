# SocialHub (Full-Stack Social Media Application)

A full-stack social media application inspired by Instagram, built with **Next.js**, **Supabase**, and **PostgreSQL**. The application supports user authentication, media posts, social interactions, instant search, profile customization, real-time notifications, responsive design, and automated database maintenance.

---

## Live Demo

- **Repository:** [https://github.com/git-user123hub/SocialHub]

## Tech Stack

- **Frontend & Framework:** Next.js (App Router, Server Actions), React, Tailwind CSS
- **Backend & Database:** Supabase, PostgreSQL, PostgreSQL Client (`postgres`)
- **Authentication & Storage:** Supabase Auth, Supabase Storage
- **Database Automation:** PostgreSQL `pg_cron` extension, PostgreSQL Trigger Functions (`AFTER INSERT` / `AFTER DELETE`)
- **Deployment:** Vercel

## Key Features

### Authentication & Security

- **User Authentication:** Secure sign-up, login, and session management powered by Supabase Auth.
- **Protected Routes:** Server-side session validation to protect authenticated views and actions.

### User Profiles & Account Management

- **Profile Customization:** Users can view and edit their profile details, username, and bio.
- **Avatar Management:** Users can upload a new profile picture or remove their existing avatar directly inside the edit profile view, reverting cleanly to a default placeholder when removed.
- **Account Deletion:** Users can permanently delete their account, automatically removing their profile data, posts, likes, comments, and associated records.

### Posts, Search & Social Interactions

- **Media Posts:** Create, view, edit, and delete image posts backed by Supabase Storage and PostgreSQL.
- **Instant Search & Live Counter:** Real-time search-as-you-type filtering that dynamically updates matching results alongside a live result count.
- **Engagement Features:** Interactive post likes, comment likes, nested comments, user follow/unfollow, and post save/unsave functionality.

### Notifications System

- **Real-Time Activity Alerts:** Notifies users of new post likes, comment likes, comments, and followers.
- **Category Filtering:** Filter notifications seamlessly by _All_, _Followers_, _Likes_, _Comments_, and _Posts_.
- **Auto-Read on Scroll:** Uses an Intersection Observer to automatically mark notifications as read once they become visible on screen.
- **Bulk Action:** Includes a **Mark All as Read** button to clear all unread notifications in one click.
- **Unread Indicators:** Displays real-time red indicator dots on the sidebar navigation icon and next to individual unread notification cards.

### UI & User Experience

- **Theme Toggle:** Users can switch seamlessly between light and dark modes across the application.
- **Responsive Design:** Tested across desktop and mobile devices to ensure feeds, modals, and profile grids adapt smoothly to different screen sizes.

### Backend Reliability & Automation

- **Transactional Database Operations:** Integrated the PostgreSQL client within Next.js Server Actions to execute reliable, atomic multi-table queries (`BEGIN` / `COMMIT` / `ROLLBACK`), preventing partial data corruption during network failures or interruptions.
- **Scheduled Orphan Media Cleanup (`pg_cron`):** Configured a recurring PostgreSQL cron job in Supabase that checks the storage bucket every 24 hours against database records, automatically removing unreferenced media files caused by failed uploads or deleted content.
- **Automated Notification Retention (`pg_cron`):** Implemented a scheduled `pg_cron` maintenance job that purges notification records older than 15 days, keeping database tables lean and maintaining fast query performance without impacting user write latency.
- **Supabase Trigger Functions & Realtime:** Created PostgreSQL trigger functions (`AFTER INSERT` / `AFTER DELETE`) to handle notification creation and deletion while users are offline, paired with authenticated Supabase Realtime channel subscriptions inside `useEffect` for instant updates when online.

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm
- A Supabase project with Authentication, Storage, and `pg_cron` enabled

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/git-user123hub/SocialHub.git
   cd SocialHub
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the root directory and add your Supabase and PostgreSQL credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_secret_key
   DATABASE_URL=your_postgresql_connection_string
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## Database Maintenance (`pg_cron`)

This project includes two scheduled PostgreSQL jobs configured via Supabase (`Integrations > Cron > Jobs`):

1. **24-Hour Orphan File Cleanup:** Compares files stored in Supabase Storage buckets against active URLs in the database and deletes orphaned files after 24 hours.
2. **15-Day Notification Retention:** Runs daily to delete rows in the `notifications` table older than 15 days (`created_at < NOW() - INTERVAL '15 days'`).

---

## Planned Future Features

Here are the features planned for future updates:

1. **Real-Time Private Chat**
2. **Video Posts**
3. **User Statuses** _(UI components are nearly complete in the codebase; pending finalization and integration)_

---

## Acknowledgments

- Built with [Next.js](https://nextjs.org) and [Supabase](https://supabase.com)
- Icons provided by [Heroicons](https://heroicons.com/) _(swap with your actual icon library)_
