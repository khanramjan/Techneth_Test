import { NextResponse } from "next/server";
import { insertContactToSupabase } from "@/lib/dashboard-data";
import type { Contact } from "@/types/dashboard";

export const runtime = "nodejs";

type CreateContactBody = {
  name?: string;
  role?: string;
  email?: string;
  phone?: string;
  sectionId?: number;
};

const rolePool = [
  "Manager",
  "Broker",
  "Analyst",
  "Investor",
  "Consultant",
  "Advisor",
  "Coordinator",
];

const locationPool = [
  "New York, USA",
  "Austin, USA",
  "Seattle, USA",
  "Chicago, USA",
  "Boston, USA",
  "Denver, USA",
  "San Diego, USA",
];

const emailDomains = ["mail.com", "estatehq.com", "propertynow.com", "contacthub.io"];

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }

  return "Could not store contact in Supabase.";
}

function isMissingContactsTableError(message: string) {
  const normalized = message.toLowerCase();
  return normalized.includes("schema cache")
    || normalized.includes("could not find the table")
    || normalized.includes("relation \"public.contacts\" does not exist");
}

function hashValue(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function chooseFromPool(pool: string[], seed: number) {
  return pool[Math.abs(seed) % pool.length];
}

function aliasFromName(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, ".");
}

function buildPhone(seed: number) {
  const area = String((seed % 900) + 100);
  const prefix = String(((seed * 7) % 900) + 100);
  const line = String(((seed * 97) % 9000) + 1000);

  return `(${area}) ${prefix}-${line}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateContactBody;
    const name = body.name?.trim() ?? "";

    if (!name) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 },
      );
    }

    const sectionId = body.sectionId ?? 1;
    const seed = hashValue(`${name}-${sectionId}-${Date.now()}`);
    const alias = aliasFromName(name);
    const generatedRole = body.role?.trim() || chooseFromPool(rolePool, seed);
    const providedEmail = body.email?.trim() ?? "";
    const providedPhone = body.phone?.trim() ?? "";

    const newContact: Contact = {
      id: 0,
      name,
      role: generatedRole,
      avatar: `https://i.pravatar.cc/64?u=${encodeURIComponent(`${alias}-${sectionId}-${seed}`)}`,
      email: providedEmail || `${alias}@${chooseFromPool(emailDomains, seed)}`,
      phone: providedPhone || buildPhone(seed),
      location: chooseFromPool(locationPool, seed),
    };

    try {
      const inserted = await insertContactToSupabase({
        name: newContact.name,
        role: newContact.role,
        avatar: newContact.avatar,
        email: newContact.email ?? null,
        phone: newContact.phone ?? null,
        location: newContact.location ?? null,
        section_id: sectionId,
      });

      return NextResponse.json({
        contact: {
          ...newContact,
          id: Number(inserted.id),
        },
        sectionId,
        fallback: false,
      });
    } catch (error) {
      console.error("Supabase contact insert error:", error);
      const message = getErrorMessage(error);

      if (isMissingContactsTableError(message)) {
        return NextResponse.json({
          contact: {
            ...newContact,
            id: -Date.now(),
          },
          sectionId,
          fallback: true,
          warning: "Supabase contacts table is unavailable. Contact was added locally.",
        });
      }

      return NextResponse.json(
        { error: message },
        { status: 500 },
      );
    }
  } catch (error) {
    const message = getErrorMessage(error);
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
