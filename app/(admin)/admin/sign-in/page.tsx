import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { demoMode } from "@/lib/admin/backend";
import { getStaff } from "@/lib/admin/session";
import { AuthLayout } from "../_components/AuthLayout";
import { DemoSwitcher } from "./DemoSwitcher";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getStaff()) redirect("/admin/articles");
  const { next } = await searchParams;
  return (
    <AuthLayout>
      <h1 className="mb-1.5 font-serif text-[40px] leading-[1.05] font-semibold">Sign in</h1>
      <p className="mb-7 text-[17px] text-cm-ink">Use the email your editor invited.</p>
      <SignInForm next={next} />
      {demoMode && <DemoSwitcher />}
    </AuthLayout>
  );
}
