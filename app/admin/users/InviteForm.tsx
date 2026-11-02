"use client";

import { useActionState, useState } from "react";

import { inviteUser, type InviteState } from "@/app/admin/users/actions";

const messages: Record<string, string> = {
  invite_failed: "Supabase rejected the invitation. Check the server terminal for the safe error code and message. Common causes are an existing account, an invalid secret key, or Auth email settings.",
  invite_config: "The server could not use the Supabase admin configuration. Confirm SUPABASE_SECRET_KEY is set and restart the app.",
  role_failed: "The invitation was created, but assigning the newsroom role failed. Check the server terminal before retrying.",
  invalid_input: "Enter a valid name, email address, and newsroom role.",
  forbidden: "Your account does not have permission to invite users.",
};

const initialState: InviteState = { status: "idle" };

export function InviteForm({ roles }: { roles: readonly string[] }) {
  const [state, formAction, pending] = useActionState(inviteUser, initialState);

  return <>
    {state.status === "success" && <p role="status" className="mt-5 border-l-4 border-cm-lime bg-cm-paper px-4 py-3">Invitation sent. The user must accept the email before signing in.</p>}
    <form action={formAction} className="mt-8 grid gap-3 border-y border-cm-rule py-5 lg:grid-cols-[1fr_1fr_180px_auto] lg:items-end">
      <label className="grid gap-2 font-bold">Name<input name="display_name" required className="h-11 border border-cm-black px-3" /></label>
      <label className="grid gap-2 font-bold">Email<input name="email" type="email" required className="h-11 border border-cm-black px-3" /></label>
      <label className="grid gap-2 font-bold">Role<select name="role" defaultValue="reporter" className="h-11 border border-cm-black bg-cm-white px-3">{roles.map((role) => <option key={role} value={role}>{role}</option>)}</select></label>
      <button disabled={pending} className="min-h-11 bg-cm-black px-4 font-bold text-cm-white disabled:opacity-60">{pending ? "Sending…" : "Invite user"}</button>
    </form>
    {state.status === "error" && state.error && <InviteErrorModal key={state.error} message={messages[state.error] ?? "The invitation could not be completed. Check the server terminal for details."} />}
  </>;
}

function InviteErrorModal({ message }: { message: string }) {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-cm-black/60 p-4" role="presentation">
    <div role="dialog" aria-modal="true" aria-labelledby="invite-error-title" className="w-full max-w-lg border-t-8 border-cm-black bg-cm-white p-6">
      <p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps text-red-700">Invitation error</p>
      <h2 id="invite-error-title" className="mt-2 font-serif text-2xl font-bold">The invitation was not completed</h2>
      <p className="mt-3 text-cm-ink">{message}</p>
      <button type="button" onClick={() => setOpen(false)} className="mt-6 min-h-11 bg-cm-black px-4 font-bold text-cm-white">Close</button>
    </div>
  </div>;
}
