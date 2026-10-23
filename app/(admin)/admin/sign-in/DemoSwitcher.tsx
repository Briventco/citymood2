import { demoSignIn } from "../auth-actions";
import { button } from "../_components/ui";

// Development builds only (the page renders it when demoMode is true, and the
// action refuses in production). Lets you test each role against the seeded users.
export function DemoSwitcher() {
  return (
    <section aria-labelledby="demo-mode" className="mt-8 border-2 border-dashed border-cm-ad-border bg-cm-paper p-4">
      <h2 id="demo-mode" className="text-[13px] font-extrabold uppercase tracking-[0.1em]">
        Demo mode: sign in as
      </h2>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {(["reporter", "editor", "admin"] as const).map((role) => (
          <form key={role} action={demoSignIn.bind(null, role)}>
            <button type="submit" className={button.outline}>
              {role[0].toUpperCase() + role.slice(1)}
            </button>
          </form>
        ))}
      </div>
      <p className="mt-2.5 text-[13px] text-cm-meta">
        Development builds only, with fake seed users. In demo mode any password works, and an email that isn’t on
        the staff list signs in as Demo Admin.
      </p>
    </section>
  );
}
