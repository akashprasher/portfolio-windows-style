import { createSupabaseServerClient } from "./server";

export type AdminRole = "super_admin" | "admin";

export async function getAdminContext() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const { data: admin } = await supabase
    .from("admin_users")
    .select("email, role")
    .eq("email", user.email.toLowerCase())
    .maybeSingle();

  if (!admin || (admin.role !== "admin" && admin.role !== "super_admin"))
    return null;
  return { supabase, user, role: admin.role as AdminRole };
}
