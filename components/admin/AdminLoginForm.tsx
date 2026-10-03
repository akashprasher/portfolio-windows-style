"use client";

import { useState } from "react";
import Link from "next/link";
import { startAdminGoogleOAuth } from "@/app/admin/actions";

export function AdminLoginForm({
  configured,
  callbackMessage,
}: {
  configured: boolean;
  callbackMessage?: string;
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleGoogleSignIn() {
    setBusy(true);
    setMessage("");
    try {
      const result = await startAdminGoogleOAuth();
      if (!result.ok) {
        setMessage(result.message);
        setBusy(false);
        return;
      }
      window.location.assign(result.url);
    } catch {
      setMessage("Google sign-in could not be started. Please try again.");
      setBusy(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="window admin-login-window">
        <div className="window-bar">
          <div className="window-title">
            <span className="window-file-icon">▧</span>
            <span>admin_auth.exe</span>
          </div>
          <div className="window-controls" aria-hidden="true">
            <span>_</span>
            <span>□</span>
            <span>×</span>
          </div>
        </div>
        <div className="admin-login-content">
          <span className="eyebrow">AKASH.OS · PRIVATE AREA</span>
          <h1>Administrator sign in</h1>
          <p>
            Continue with the Google account added to the administrator
            allowlist.
          </p>
          {callbackMessage && (
            <div className="admin-notice error-notice" role="alert">
              {callbackMessage}
            </div>
          )}
          {!configured ? (
            <div className="admin-notice error-notice">
              Supabase is not configured. Add the required keys from{" "}
              <code>.env.example</code> first.
            </div>
          ) : (
            <div className="admin-form">
              <button
                className="retro-button primary-button"
                type="button"
                disabled={busy}
                onClick={handleGoogleSignIn}
              >
                {busy ? "Connecting to Google…" : "Continue with Google ↗"}
              </button>
              {message && (
                <p className="form-message" role="status">
                  {message}
                </p>
              )}
            </div>
          )}
          <Link className="text-link admin-back-link" href="/">
            ← BACK TO PORTFOLIO
          </Link>
        </div>
      </section>
    </main>
  );
}
