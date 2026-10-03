import { PortfolioPage } from "@/components/portfolio/PortfolioPage";
import { getPortfolioData } from "@/lib/data/get-portfolio";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getPortfolioData();
  return <PortfolioPage data={data} />;
}
