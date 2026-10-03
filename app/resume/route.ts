import { NextResponse } from "next/server";
import { getAllowedResumeUrl } from "@/lib/data/resume-url";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return new Response("The resume redirect is not configured.", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const { data, error } = await supabase
    .from("portfolio_content")
    .select("data")
    .eq("id", "main")
    .maybeSingle();

  if (error) {
    console.error("Could not load the resume link from Supabase.", error);
    return new Response("The resume link could not be loaded.", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  if (!data) {
    return new Response("A resume link has not been published yet.", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const savedData: unknown = data.data;
  const resumeUrl =
    savedData && typeof savedData === "object" && "resumeUrl" in savedData
      ? getAllowedResumeUrl(savedData.resumeUrl)
      : null;

  if (!resumeUrl) {
    return new Response("A valid resume link has not been published yet.", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return NextResponse.redirect(resumeUrl, {
    status: 307,
    headers: { "Cache-Control": "no-store" },
  });
}
