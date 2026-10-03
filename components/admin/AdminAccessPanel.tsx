"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { addAdminUser, removeAdminUser } from "@/app/admin/actions";

type AdminRecord = {
  email: string;
  role: "admin" | "super_admin";
  created_at: string;
};

export function AdminAccessPanel({ admins }: { admins: AdminRecord[] }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busyEmail, setBusyEmail] = useState("");
  const router = useRouter();

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusyEmail("add");
    const result = await addAdminUser(email);
    setMessage(result.message);
    setBusyEmail("");
    if (result.ok) {
      setEmail("");
      router.refresh();
    }
  }

  async function handleRemove(targetEmail: string) {
    if (!window.confirm(`Remove admin access for ${targetEmail}?`)) return;
    setBusyEmail(targetEmail);
    const result = await removeAdminUser(targetEmail);
    setMessage(result.message);
    setBusyEmail("");
    if (result.ok) router.refresh();
  }

  return (
    <section
      className="admin-section window access-section"
      id="access-control"
    >
      <div className="admin-section-title">
        <span>06</span>
        <div>
          <h2>Admin access</h2>
          <p>Only superadmins can change this allowlist.</p>
        </div>
      </div>
      <form className="add-admin-form" onSubmit={handleAdd}>
        <label className="admin-field">
          <span>New admin email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="teammate@example.com"
          />
        </label>
        <button
          className="retro-button primary-button"
          disabled={busyEmail === "add"}
        >
          {busyEmail === "add" ? "Adding…" : "Add admin"}
        </button>
      </form>
      {message && (
        <p className="form-message" role="status">
          {message}
        </p>
      )}
      <div className="admin-user-list">
        {admins.map((admin) => (
          <div className="admin-user-row" key={admin.email}>
            <span>
              <strong>{admin.email}</strong>
              <small>{admin.role.replace("_", " ")}</small>
            </span>
            {admin.role !== "super_admin" && (
              <button
                type="button"
                className="remove-button"
                disabled={busyEmail === admin.email}
                onClick={() => handleRemove(admin.email)}
              >
                {busyEmail === admin.email ? "Removing…" : "Remove"}
              </button>
            )}
          </div>
        ))}
      </div>
      <p className="admin-help">
        Adding an email grants dashboard access to that Google account; it does
        not send an invitation. Removing an email revokes dashboard access but
        does not delete the person&apos;s Supabase Auth account. Only
        superadmins can change this list.
      </p>
    </section>
  );
}
