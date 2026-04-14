import { NextResponse } from "next/server";
import { readDashboardData, writeDashboardData } from "@/lib/dashboard-data";
import type { Contact, DashboardData, SelectedContact } from "@/types/dashboard";

export const runtime = "nodejs";

type CreateContactBody = {
  name?: string;
  role?: string;
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

function buildSelectedContact(contact: Contact): SelectedContact {
  const alias = aliasFromName(contact.name);

  return {
    name: contact.name,
    role: contact.role,
    avatar: contact.avatar,
    meta: [
      { id: 1, icon: "phone", label: "Phone number", value: contact.phone ?? "(555) 000-0000" },
      { id: 2, icon: "mail", label: "Email", value: contact.email ?? `${alias}@mail.com` },
      { id: 3, icon: "map", label: "Location", value: contact.location ?? "New York, USA" },
      { id: 4, icon: "briefcase", label: "Specialty", value: contact.role },
    ],
    tabs: ["Analytics", "General", "Summary"],
    quickActions: ["phone", "video", "message-circle", "briefcase"],
  };
}

function nextContactId(data: DashboardData) {
  const ids = data.contactSections.flatMap((section) =>
    section.contacts.map((contact) => contact.id),
  );

  return ids.length ? Math.max(...ids) + 1 : 1;
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

    const data = await readDashboardData();

    if (!data.contactSections.length) {
      return NextResponse.json(
        { error: "No contact sections configured." },
        { status: 400 },
      );
    }

    const id = nextContactId(data);
    const seed = hashValue(`${name}-${id}-${Date.now()}`);
    const alias = aliasFromName(name);
    const generatedRole = body.role?.trim() || chooseFromPool(rolePool, seed);

    const newContact: Contact = {
      id,
      name,
      role: generatedRole,
      avatar: `https://i.pravatar.cc/64?u=${encodeURIComponent(`${alias}-${id}-${seed}`)}`,
      email: `${alias}@${chooseFromPool(emailDomains, seed)}`,
      phone: buildPhone(seed),
      location: chooseFromPool(locationPool, seed),
    };

    const targetSection =
      data.contactSections.find((section) => section.id === body.sectionId) ??
      data.contactSections[0];

    targetSection.contacts.unshift(newContact);

    data.contactSections = data.contactSections.map((section) => ({
      ...section,
      count: section.contacts.length,
    }));

    data.selectedContact = buildSelectedContact(newContact);

    await writeDashboardData(data);

    return NextResponse.json({ contact: newContact });
  } catch {
    return NextResponse.json(
      { error: "Could not store contact in JSON." },
      { status: 500 },
    );
  }
}
