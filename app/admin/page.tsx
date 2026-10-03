import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminAccessPanel } from "@/components/admin/AdminAccessPanel";
import { PortfolioEditor } from "@/components/admin/PortfolioEditor";
import { ThemeToggle } from "@/components/portfolio/ThemeToggle";
import { getPortfolioData } from "@/lib/data/get-portfolio";
import { getAdminContext } from "@/lib/supabase/auth";
import { listAdminUsers, signOutAdmin } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const admin = await getAdminContext();
  if (!admin) redirect("/admin/login");

  const portfolio = await getPortfolioData();
  const adminList =
    admin.role === "super_admin" ? await listAdminUsers() : null;

  return (
    <main className="admin-dashboard">
      <header className="admin-topbar">
        <Link className="brand" href="/">
          <span className="brand-mark">AP</span>
          <span>
            AKASH.OS <small>CONTENT CONTROL PANEL</small>
          </span>
        </Link>
        <div className="admin-account">
          <span className="admin-role-badge">
            {admin.role.replace("_", " ")}
          </span>
          <span>{admin.user.email}</span>
          <ThemeToggle />
          <form action={signOutAdmin}>
            <button className="retro-button" type="submit">
              Sign out ↗
            </button>
          </form>
        </div>
      </header>
      <div className="admin-layout">
        <aside className="admin-sidebar window">
          <div className="window-bar">
            <div className="window-title">
              <span className="window-file-icon">▧</span>
              <span>content_index</span>
            </div>
            <div className="window-controls" aria-hidden="true">
              <span>_</span>
              <span>□</span>
              <span>×</span>
            </div>
          </div>
          <div className="admin-nav">
            <a href="#profile-editor">
              <span>01</span> Profile
            </a>
            <a href="#experience-editor">
              <span>02</span> Experience
            </a>
            <a href="#projects-editor">
              <span>03</span> Projects
            </a>
            <a href="#skills-editor">
              <span>04</span> Skills
            </a>
            <a href="#education-editor">
              <span>05</span> Education
            </a>
            {admin.role === "super_admin" && (
              <a href="#access-control">
                <span>06</span> Admin access
              </a>
            )}
          </div>
          <div className="sidebar-foot">
            <span className="status-dot" /> AUTHENTICATED
          </div>
        </aside>
        <div className="admin-main">
          <PortfolioEditor initialData={portfolio} />
          {admin.role === "super_admin" && adminList?.ok && (
            <AdminAccessPanel admins={adminList.admins} />
          )}
          {admin.role === "super_admin" && !adminList?.ok && (
            <div className="admin-notice error-notice">
              Could not load the admin allowlist. Verify the server service-role
              key.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
