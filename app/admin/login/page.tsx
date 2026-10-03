import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = { title: "Admin sign in · Akash.OS" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const callbackErrors: Record<string, string> = {
    auth_callback_failed:
      "Google sign-in did not complete. Check the Google provider and Supabase redirect URL configuration, then try again.",
    admin_email_missing:
      "Google sign-in succeeded, but Supabase did not return an email address for this account.",
    admin_not_allowlisted:
      "This Google account is not on the administrator allowlist. Ask a superadmin to add your email, or add it to public.admin_users in the Supabase SQL Editor.",
    admin_setup_required:
      "The admin tables are missing. Apply the Supabase migration, then add your first superadmin email to public.admin_users.",
    admin_check_failed:
      "Google sign-in succeeded, but admin access could not be checked. Verify the migration, Data API access, and Supabase connection.",
  };
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "";
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (publishableKey.startsWith("eyJ") ||
      publishableKey.startsWith("sb_publishable_")),
  );
  return (
    <AdminLoginForm
      configured={configured}
      callbackMessage={error ? callbackErrors[error] : undefined}
    />
  );
}
