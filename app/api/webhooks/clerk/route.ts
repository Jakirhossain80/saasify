// FILE: app/api/webhooks/clerk/route.ts
import { headers } from "next/headers";
import { Webhook } from "svix";
import { ensureUserFromClerk } from "@/server/services/users.service";

type ClerkWebhookEventType = "user.created" | "user.updated" | "user.deleted";

type ClerkUserData = {
  id: string;
  email_addresses?: Array<{ email_address: string }>;
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string | null;
};

type ClerkWebhookEvent = {
  type: ClerkWebhookEventType;
  data: ClerkUserData;
};

function getPrimaryEmail(data: ClerkUserData): string | null {
  const email = data.email_addresses?.[0]?.email_address ?? null;
  return email && email.trim().length > 0 ? email : null;
}

function getFullName(data: ClerkUserData): string {
  const first = data.first_name?.trim() ?? "";
  const last = data.last_name?.trim() ?? "";
  return [first, last].filter(Boolean).join(" ").trim();
}

export async function POST(req: Request): Promise<Response> {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("Missing CLERK_WEBHOOK_SECRET", { status: 500 });
  }

  const hdrs = await headers();
  const svixId = hdrs.get("svix-id");
  const svixTimestamp = hdrs.get("svix-timestamp");
  const svixSignature = hdrs.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(secret);

  let event: ClerkWebhookEvent;
  try {
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch {
    return new Response("Invalid signature", { status: 401 });
  }

  if (event.type === "user.created" || event.type === "user.updated") {
    const email = getPrimaryEmail(event.data);
    if (!email) {
      return new Response("No email on Clerk user", { status: 400 });
    }

    const name = getFullName(event.data);
    const imageUrl = event.data.image_url ?? "";

    await ensureUserFromClerk({
      clerkUserId: event.data.id,
      email,
      name,
      imageUrl,
    });
  }

  // For user.deleted: you can mark user as deactivated later (V2).
  return new Response("OK", { status: 200 });
}
