import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { clerkUserToDbUser } from "@/lib/user";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("WEBHOOK_SECRET is not set");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Verify against the raw body, re-serialising JSON can break the signature
  const body = await req.text();

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const eventType = evt.type;

  // Create or update the user in our database
  if (eventType === "user.created" || eventType === "user.updated") {
    const {
      id,
      email_addresses,
      primary_email_address_id,
      image_url,
      username,
      first_name,
      last_name,
    } = evt.data;

    const email =
      email_addresses.find((e) => e.id === primary_email_address_id)
        ?.email_address ?? email_addresses[0]?.email_address;

    const values = clerkUserToDbUser({
      id,
      firstName: first_name,
      lastName: last_name,
      username,
      imageUrl: image_url,
      email,
    });

    const user = await db.user.upsert({
      where: { userId: id },
      update: values,
      create: { userId: id, ...values, bio: "", portfolioWebsite: "" },
    });

    return NextResponse.json({ message: "OK", user });
  }

  // delete user from our database
  if (eventType === "user.deleted") {
    const { id } = evt.data;
    if (id) await db.user.deleteMany({ where: { userId: id } });

    return NextResponse.json({ message: "OK" });
  }

  return new Response("", { status: 200 });
}
