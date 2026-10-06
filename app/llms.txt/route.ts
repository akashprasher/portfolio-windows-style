import { getPortfolioData } from "@/lib/data/get-portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getPortfolioData();
  const website = "https://www.akashprasher.com";
  const experience = data.experience
    .map(
      (job) =>
        `- ${job.role} at ${job.company} (${job.dates}; ${job.location})`,
    )
    .join("\n");
  const projects = data.projects
    .map((project) => {
      const link = project.url ? `: ${project.url}` : "";
      return `- ${project.name} — ${project.description}${link}`;
    })
    .join("\n");

  const content = `# ${data.profile.name}

> ${data.profile.title} based in ${data.profile.location}.

${data.profile.intro}

## About

${data.profile.bio}

${data.profile.secondBio}

## Experience

${experience}

## Projects

${projects}

## Skills

${data.skills.join(", ")}

## Education

- ${data.education.degree} in ${data.education.program}, ${data.education.school} (${data.education.dates})

## Contact

- Website: ${website}
- Email: ${data.profile.email}
${data.resumeUrl ? `- Resume: ${website}/resume\n` : ""}`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
