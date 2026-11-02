import type { Metadata } from "next";

import { signIn } from "@/server/auth/actions";

export const metadata: Metadata = { title: "Newsroom login | CityMood" };

const messages: Record<string, string> = {
  invalid_input: "Enter your newsroom email and password.",
  invalid_credentials: "Those credentials could not be verified.",
  account_pending: "Your newsroom account is not active yet. Contact an administrator.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = error ? messages[error] : undefined;

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-[520px] items-center px-(--cm-gutter) py-16">
      <section className="w-full border-t-[6px] border-cm-black pt-4">
        <p className="mb-3 text-cm-kicker font-extrabold uppercase tracking-cm-caps">CityMood newsroom</p>
        <h1 className="font-serif text-cm-feature font-bold">Sign in</h1>
        <p className="mt-3 text-cm-standfirst text-cm-ink">
          Use your invited newsroom account to manage CityMood stories.
        </p>
        {message && (
          <p role="alert" className="mt-6 border-l-4 border-cm-lime bg-cm-paper px-4 py-3 text-cm-ink">
            {message}
          </p>
        )}
        <form action={signIn} className="mt-8 grid gap-5">
          <label className="grid gap-2 font-bold" htmlFor="email">
            Email
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="h-12 border border-cm-black bg-cm-white px-3 text-base font-normal text-cm-black"
            />
          </label>
          <label className="grid gap-2 font-bold" htmlFor="password">
            Password
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="h-12 border border-cm-black bg-cm-white px-3 text-base font-normal text-cm-black"
            />
          </label>
          <button type="submit" className="min-h-12 bg-cm-black px-5 font-bold text-cm-white">
            Sign in to newsroom
          </button>
        </form>
      </section>
    </main>
  );
}
