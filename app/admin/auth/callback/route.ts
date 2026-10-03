import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const supabase = await createSupabaseServerClient();

  if (!code || !supabase) {
    return NextResponse.redirect(
      new URL("/admin/login?error=auth_callback_failed", url.origin),
    );
  }

  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    return NextResponse.redirect(
      new URL("/admin/login?error=auth_callback_failed", url.origin),
    );
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.redirect(
      new URL("/admin/login?error=auth_callback_failed", url.origin),
    );
  }
  if (!user.email) {
    return NextResponse.redirect(
      new URL("/admin/login?error=admin_email_missing", url.origin),
    );
  }

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("role")
    .eq("email", user.email.toLowerCase())
    .maybeSingle();

  if (adminError) {
    const setupIncomplete =
      adminError.code === "PGRST205" || adminError.code === "42P01";
    return NextResponse.redirect(
      new URL(
        `/admin/login?error=${setupIncomplete ? "admin_setup_required" : "admin_check_failed"}`,
        url.origin,
      ),
    );
  }

  if (!admin || (admin.role !== "admin" && admin.role !== "super_admin")) {
    return NextResponse.redirect(
      new URL("/admin/login?error=admin_not_allowlisted", url.origin),
    );
  }

  return NextResponse.redirect(new URL("/admin", url.origin));
}
