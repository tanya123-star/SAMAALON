import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();
  const role = (session?.user as unknown as { role?: string })?.role;
  if (!session) redirect("/api/auth/signin");
  if (role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">403 — Forbidden</h1>
        <p className="mt-2 text-sm text-muted-foreground">Admin only. Your role: {role ?? "USER"}.</p>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Protected — role ADMIN verified server-side (Phase 4). CRUD for beaches/accommodations/blogs will be Phase 7.</p>
      <div className="mt-6 rounded-lg border p-4 text-sm">
        <p>Logged in as: {session.user?.email}</p>
        <p>Role: {role}</p>
      </div>
    </div>
  );
}
