"use client";

import { useActionState, useState } from "react";
import { UserPlus } from "lucide-react";

import { inviteUser, type InviteState } from "@/app/admin/users/actions";

const messages: Record<string, string> = {
  invite_failed: "Supabase rejected the invitation. Check the server terminal for the safe error code and message. Common causes are an existing account, an invalid secret key, or Auth email settings.",
  invite_config: "The server could not use the Supabase admin configuration. Confirm SUPABASE_SECRET_KEY is set and restart the app.",
  role_failed: "The invitation was created, but assigning the newsroom role failed. Check the server terminal before retrying.",
  invalid_input: "Enter a valid name, email address, and newsroom role.",
  forbidden: "Your account does not have permission to invite users.",
};

const initialState: InviteState = { status: "idle" };

const fieldLabel = "text-xs font-extrabold uppercase tracking-cm-caps text-cm-meta";
const fieldInput =
  "h-12 border-2 border-cm-rule bg-cm-white px-3 text-sm text-cm-black transition-colors duration-150 placeholder:text-cm-meta focus:border-cm-black focus:outline-none";

export function InviteForm({ roles }: { roles: readonly string[] }) {
  const [state, formAction, pending] = useActionState(inviteUser, initialState);

  return (
    <div className="border-2 border-cm-rule bg-cm-white p-5">
      <div className="flex items-center gap-2">
        <UserPlus className="size-5 text-cm-meta" aria-hidden="true" />
        <h2 className="font-serif text-2xl font-bold">Invite a user</h2>
      </div>

      {state.status === "success" && (
        <p role="status" className="mt-4 border-l-4 border-cm-lime bg-cm-paper px-4 py-3 text-sm">
          Invitation sent. The user must accept the email before signing in.
        </p>
      )}

      <form action={formAction} className="mt-5 grid gap-3 border-t border-cm-rule pt-5 lg:grid-cols-[1fr_1fr_180px_auto] lg:items-end">
        <label className="grid gap-1.5">
          <span className={fieldLabel}>Name</span>
          <input name="display_name" required placeholder="Full name" className={fieldInput} />
        </label>
        <label className="grid gap-1.5">
          <span className={fieldLabel}>Email</span>
          <input name="email" type="email" required placeholder="name@example.com" className={fieldInput} />
        </label>
        <label className="grid gap-1.5">
          <span className={fieldLabel}>Role</span>
          <select name="role" defaultValue="reporter" className={`${fieldInput} bg-cm-white`}>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>
        <button
          disabled={pending}
          className="flex h-12 items-center justify-center gap-2 border-2 border-cm-black bg-cm-lime px-5 text-xs font-extrabold uppercase tracking-cm-caps text-cm-black transition-colors duration-150 hover:bg-cm-black hover:text-cm-lime disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Sending…" : "Invite user"}
        </button>
      </form>

      {state.status === "error" && state.error && (
        <InviteErrorModal key={state.error} message={messages[state.error] ?? "The invitation could not be completed. Check the server terminal for details."} />
      )}
    </div>
  );
}

function InviteErrorModal({ message }: { message: string }) {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cm-black/60 p-4" role="presentation">
      <div role="dialog" aria-modal="true" aria-labelledby="invite-error-title" className="w-full max-w-lg border-t-8 border-cm-black bg-cm-white p-6">
        <p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps text-red-700">Invitation error</p>
        <h2 id="invite-error-title" className="mt-2 font-serif text-2xl font-bold">
          The invitation was not completed
        </h2>
        <p className="mt-3 text-cm-ink">{message}</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-6 flex min-h-11 w-fit items-center border-2 border-cm-black bg-cm-black px-4 text-xs font-extrabold uppercase tracking-cm-caps text-cm-white transition-colors duration-150 hover:bg-cm-white hover:text-cm-black"
        >
          Close
        </button>
      </div>
    </div>
  );
}