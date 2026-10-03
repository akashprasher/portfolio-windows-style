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
      "We couldn't complete sign-in. Please try again, or contact the site owner if this continues.",
    admin_email_missing:
      "We couldn't verify this account for sign-in. Please try another account or contact the site owner.",
    admin_not_allowlisted:
      "This account doesn't have access to the admin area. Contact the site owner if you think this is a mistake.",
    admin_setup_required:
      "Admin sign-in is temporarily unavailable. Please try again later or contact the site owner.",
    admin_check_failed:
      "Admin sign-in is temporarily unavailable. Please try again later or contact the site owner.",
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
