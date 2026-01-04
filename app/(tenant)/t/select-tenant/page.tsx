// FILE: app/(tenant)/select-tenant/page.tsx
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/server/db";
import { ensureUserFromClerk, getUserByClerkId } from "@/server/services/users.service";
import { Membership } from "@/server/models/Membership";
import { Tenant } from "@/server/models/Tenant";
import TenantSwitcher, { type TenantSwitcherItem } from "@/components/tenant/TenantSwitcher";

type MembershipPopulated = {
  tenantId: {
    _id: unknown;
    name: string;
    slug: string;
    status: "active" | "suspended";
  };
  role: "tenant_admin" | "tenant_user";
  status: "active" | "invited" | "removed";
};

export default async function SelectTenantPage() {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) redirect("/sign-in");

  const clerkUser = await currentUser();
  const email =
    clerkUser?.emailAddresses?.[0]?.emailAddress?.trim() ??
    "";

  if (!email) {
    // Clerk user without email should not proceed
    redirect("/sign-in");
  }

  const name = `${clerkUser?.firstName ?? ""} ${clerkUser?.lastName ?? ""}`.trim();
  const imageUrl = clerkUser?.imageUrl ?? "";

  // Ensure internal user exists (webhook OR first-login upsert)
  await ensureUserFromClerk({
    clerkUserId,
    email,
    name,
    imageUrl,
  });

  const userDoc = await getUserByClerkId(clerkUserId);
  if (!userDoc?._id) redirect("/sign-in");

  await connectToDatabase();

  const memberships = (await Membership.find({
    userId: userDoc._id,
    status: { $ne: "removed" },
  })
    .populate({
      path: "tenantId",
      model: Tenant,
      select: { name: 1, slug: 1, status: 1 },
    })
    .select({ tenantId: 1, role: 1, status: 1 })
    .sort({ createdAt: -1 })
    .lean()
    .exec()) as unknown as MembershipPopulated[];

  const items: TenantSwitcherItem[] = memberships
    .map((m) => {
      const t = m.tenantId;
      const id = typeof t?._id === "object" ? String((t as { _id: unknown })._id) : "";
      if (!id || t.status !== "active") return null;

      return {
        tenantId: id,
        name: t.name,
        slug: t.slug,
        role: m.role,
      } satisfies TenantSwitcherItem;
    })
    .filter((x): x is TenantSwitcherItem => Boolean(x));

  // If only one active tenant, you can keep the UX here; MVP still shows selection page.
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        {items.length > 0 ? (
          <TenantSwitcher items={items} />
        ) : (
          <div className="rounded-3xl border bg-card p-6 sm:p-8">
            <h1 className="font-poppins text-2xl font-semibold sm:text-3xl">
              No tenant found
            </h1>
            <p className="mt-2 font-inter text-sm text-muted-foreground sm:text-base">
              You don’t have access to any active tenant yet. Ask a tenant admin to invite you,
              or create a tenant in the platform area (next phase).
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
