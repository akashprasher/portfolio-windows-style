import { defaultPortfolioData, isPortfolioData } from "./portfolio";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getPortfolioData() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return defaultPortfolioData;

  const { data, error } = await supabase
    .from("portfolio_content")
    .select("data")
    .eq("id", "main")
    .maybeSingle();

  if (error || !data || !isPortfolioData(data.data))
    return defaultPortfolioData;
  return data.data;
}
