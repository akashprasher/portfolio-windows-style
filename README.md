# Akash.OS portfolio

Retro-OS styled portfolio built with Next.js App Router. Content is represented once in `lib/data/portfolio.ts`, rendered by reusable sections in `components/portfolio/`, and can be edited from the protected dashboard.

## Routes and structure

- `/` — public portfolio.
- `/resume` — redirects to the published Google Docs/Drive or Microsoft OneDrive/SharePoint resume link.
- `/admin/login` — allowlisted email sign-in link.
- `/admin` — authenticated portfolio editor; superadmins also manage the admin allowlist.
- `app/admin/actions.ts` — server actions for login, content save, and admin management.
- `supabase/migrations/` — schema and Row Level Security policies.
- `lib/data/portfolio.ts` — types and local fallback content.
- `lib/data/resume-url.ts` — validates approved resume document hosts.
- `components/portfolio/` — public site sections.
- `components/admin/` — login form, content editor, and access panel.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Without Supabase credentials, `/` renders the local portfolio fallback and `/admin/login` displays setup instructions. Supabase is required for sign-in and saved edits.

## Supabase setup

1. Create a Supabase project and apply `supabase/migrations/20261003000000_portfolio_admin.sql` in the SQL Editor. This creates the empty `portfolio_content` and `admin_users` tables; there is no need to create a portfolio row first.
2. Before signing in, bootstrap the first superadmin by running this in the SQL Editor with the email address you will use with Google:

   ```sql
   insert into public.admin_users (email, role)
   values (lower('your-email@example.com'), 'super_admin');
   ```

   You do not need to create a Supabase Auth user first. Google OAuth creates the Auth user at their first sign-in; the `admin_users` row is what grants dashboard access.
3. Copy the Project URL, publishable key, and secret key to `.env.local` using `.env.example` as a template. **Never expose the secret key to the browser or commit it.** Set `NEXT_PUBLIC_SITE_URL` to the deployed app origin. During local development, the OAuth callback automatically uses the local request origin (for example, `http://localhost:3000`).
4. Create a Google OAuth web client in Google Cloud. Add your site origin (for example, `http://localhost:3000`) as an authorized JavaScript origin. Add the Supabase Auth callback URL shown in **Authentication → Providers → Google** as an authorized redirect URI in Google Cloud, then enter the Google client ID and secret in that Supabase provider and enable it.
5. In Supabase **Authentication → URL Configuration**, set the production Site URL and add both the local and deployed callbacks to Redirect URLs, for example `http://localhost:3000/admin/auth/callback` and `https://your-domain.example/admin/auth/callback`. Use a local URL matching the port you run Next.js on.
6. Visit `/admin/login` and sign in with the superadmin's Google account. A superadmin can add or remove regular admins from **Admin access**. Adding an email updates the allowlist but does not send an invitation; the new admin must sign in with Google using that same email address.

The portfolio table is publicly readable. Database writes require an authenticated JWT whose email is in `admin_users`; server actions independently check the role. Allowlist rows are not writable through the public client. Only a superadmin can add or remove regular admin rows through the admin panel; the first superadmin is bootstrapped in SQL. The panel does not promote or remove superadmins. Keep at least one superadmin row.

Set **Resume document URL** in the admin Profile section to a public Google Docs/Drive or Microsoft OneDrive/SharePoint sharing link, then click **Save & publish**. The URL is stored as `resumeUrl` inside the existing `portfolio_content.data` JSON record, so no extra table or schema migration is needed. The header/footer resume links appear once a link is set. `/resume` redirects to that saved link; it returns a not-found response if no valid resume link has been published.

After editing, click **Save & publish**; the public `/` route is revalidated and reads the latest database content. If no content row exists yet, the local starter data is shown until the first save.
