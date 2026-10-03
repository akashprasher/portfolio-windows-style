"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/supabase/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isPortfolioData, type PortfolioData } from "@/lib/data/portfolio";
import { isAllowedResumeUrl } from "@/lib/data/resume-url";

export async function startAdminGoogleOAuth(): Promise<
  { ok: false; message: string } | { ok: true; url: string }
> {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase)
      return {
        ok: false,
        message: "Supabase is not configured on this deployment.",
      };

    const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const requestHost =
      process.env.NODE_ENV === "development"
        ? (await headers()).get("host")
        : null;
    const isLocalDevelopmentHost =
      requestHost &&
      /^(localhost|127\.0\.0\.1|\[::1\])(?::\d{1,5})?$/i.test(requestHost);
    const siteUrl = isLocalDevelopmentHost
      ? `http://${requestHost}`
      : configuredSiteUrl;

    if (!siteUrl) {
      return {
        ok: false,
        message: "Set NEXT_PUBLIC_SITE_URL to the deployed website origin.",
      };
    }

    let siteOrigin: string;
    try {
      const parsedSiteUrl = new URL(siteUrl);
      if (
        (parsedSiteUrl.protocol !== "https:" &&
          parsedSiteUrl.protocol !== "http:") ||
        parsedSiteUrl.username ||
        parsedSiteUrl.password
      ) {
        throw new Error("Invalid site URL");
      }
      siteOrigin = parsedSiteUrl.origin;
    } catch {
      return {
        ok: false,
        message: "NEXT_PUBLIC_SITE_URL must be a valid HTTP or HTTPS origin.",
      };
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: new URL("/admin/auth/callback", siteOrigin).toString(),
      },
    });
    if (error || !data.url)
      return {
        ok: false,
        message:
          "Could not start Google sign-in. Check the Supabase Google provider configuration.",
      };
    return { ok: true, url: data.url };
  } catch {
    return {
      ok: false,
      message: "Admin authentication is not configured yet.",
    };
  }
}

export async function savePortfolioData(data: PortfolioData) {
  const context = await getAdminContext();
  if (!context)
    return {
      ok: false,
      message: "You are not authorized to update this portfolio.",
    };
  if (!data || typeof data !== "object")
    return { ok: false, message: "The submitted portfolio data is invalid." };
  if (
    typeof data.resumeUrl === "string" &&
    !isAllowedResumeUrl(data.resumeUrl)
  ) {
    return {
      ok: false,
      message:
        "Use an HTTPS sharing link from Google Docs/Drive or Microsoft OneDrive/SharePoint.",
    };
  }
  if (!isPortfolioData(data))
    return { ok: false, message: "The submitted portfolio data is invalid." };

  const { error } = await context.supabase.from("portfolio_content").upsert({
    id: "main",
    data,
    updated_at: new Date().toISOString(),
  });
  if (error) return { ok: false, message: `Save failed: ${error.message}` };

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/resume");
  return {
    ok: true,
    message: "Saved. The public portfolio now has the latest content.",
  };
}

export async function signOutAdmin() {
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  revalidatePath("/admin");
  redirect("/admin/login");
}

export async function listAdminUsers() {
  const context = await getAdminContext();
  if (!context || context.role !== "super_admin")
    return { ok: false as const, admins: [] };

  const adminClient = createSupabaseAdminClient();
  const { data, error } = await adminClient
    .from("admin_users")
    .select("email, role, created_at")
    .order("created_at", { ascending: true });
  if (error) return { ok: false as const, admins: [] };
  return { ok: true as const, admins: data ?? [] };
}

export async function addAdminUser(emailInput: string) {
  const context = await getAdminContext();
  if (!context || context.role !== "super_admin")
    return { ok: false, message: "Only a superadmin can add administrators." };
  const email = emailInput.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { ok: false, message: "Enter a valid email address." };

  const adminClient = createSupabaseAdminClient();
  const { data: existing } = await adminClient
    .from("admin_users")
    .select("role")
    .eq("email", email)
    .maybeSingle();
  if (existing?.role === "super_admin")
    return { ok: false, message: "This email is already a superadmin." };
  if (existing?.role === "admin")
    return { ok: false, message: "This email already has admin access." };

  const { error } = await adminClient
    .from("admin_users")
    .insert({ email, role: "admin" });
  if (error)
    return {
      ok: false,
      message: `Could not add administrator: ${error.message}`,
    };

  revalidatePath("/admin");
  return {
    ok: true,
    message: `${email} is now allowlisted. They can sign in with Google using this email address.`,
  };
}

export async function removeAdminUser(emailInput: string) {
  const context = await getAdminContext();
  if (!context || context.role !== "super_admin")
    return {
      ok: false,
      message: "Only a superadmin can remove administrators.",
    };
  const email = emailInput.trim().toLowerCase();
  if (email === context.user.email?.toLowerCase())
    return { ok: false, message: "You cannot remove your own account here." };

  const adminClient = createSupabaseAdminClient();
  const { data: target } = await adminClient
    .from("admin_users")
    .select("role")
    .eq("email", email)
    .maybeSingle();
  if (!target) return { ok: false, message: "Administrator not found." };
  if (target.role === "super_admin")
    return {
      ok: false,
      message: "Superadmin accounts cannot be removed from this screen.",
    };

  const { error } = await adminClient
    .from("admin_users")
    .delete()
    .eq("email", email);
  if (error)
    return {
      ok: false,
      message: `Could not remove administrator: ${error.message}`,
    };
  revalidatePath("/admin");
  return { ok: true, message: `${email} no longer has admin access.` };
}
