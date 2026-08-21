import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  const user = session.user as unknown as { name?: string; email?: string; image?: string; role?: string; id?: string };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">Google account data via Auth.js</p>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {user.image ? <img src={user.image} alt={user.name ?? "avatar"} className="h-16 w-16 rounded-full" /> : null}
          <p>
            <span className="font-medium">Name:</span> {user.name ?? "—"}
          </p>
          <p>
            <span className="font-medium">Email:</span> {user.email ?? "—"}
          </p>
          <p>
            <span className="font-medium">Role:</span> {user.role ?? "USER"}
          </p>
          <p>
            <span className="font-medium">ID:</span> {user.id ?? "—"}
          </p>
        </CardContent>
      </Card>
      <p className="mt-6 text-xs text-muted-foreground">Favorites and reviews will appear here in Phase 5.</p>
    </div>
  );
}
