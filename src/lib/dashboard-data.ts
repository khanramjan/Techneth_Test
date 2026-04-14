import { promises as fs } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { Contact, DashboardData, SelectedContact } from "@/types/dashboard";

const dashboardFilePath = path.join(process.cwd(), "src", "data", "dashboard.json");
const CONTACTS_TABLE = "contacts";

type ContactRow = {
  id: number;
  name: string;
  role: string;
  avatar: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  section_id: number;
  created_at: string;
};

type ContactInsert = Omit<ContactRow, "id" | "created_at">;

function aliasFromName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, ".");
}

function toSelectedContact(contact: Contact): SelectedContact {
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

function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing Supabase service role configuration.");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function mapRowToContact(row: ContactRow): Contact {
  return {
    id: Number(row.id),
    name: row.name,
    role: row.role,
    avatar: row.avatar,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    location: row.location ?? undefined,
  };
}

export async function listContactsFromSupabase() {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from(CONTACTS_TABLE)
    .select("id, name, role, avatar, email, phone, location, section_id, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as ContactRow[];
}

export async function insertContactToSupabase(contact: ContactInsert) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from(CONTACTS_TABLE)
    .insert(contact)
    .select("id, name, role, avatar, email, phone, location, section_id, created_at")
    .single();

  if (error) {
    throw error;
  }

  return data as ContactRow;
}

export async function readDashboardData() {
  const raw = await fs.readFile(dashboardFilePath, "utf8");
  const baseData = JSON.parse(raw) as DashboardData;

  try {
    const rows = await listContactsFromSupabase();

    if (!rows.length) {
      baseData.contactSections = baseData.contactSections.map((section) => ({
        ...section,
        contacts: [],
        count: 0,
      }));
      baseData.selectedContact = null;
      return baseData;
    }

    const sectionContacts = new Map<number, Contact[]>();
    rows.forEach((row) => {
      const existing = sectionContacts.get(row.section_id) ?? [];
      existing.push(mapRowToContact(row));
      sectionContacts.set(row.section_id, existing);
    });

    baseData.contactSections = baseData.contactSections.map((section) => {
      const contacts = sectionContacts.get(section.id) ?? [];
      return {
        ...section,
        contacts,
        count: contacts.length,
      };
    });

    const fallbackContact = baseData.contactSections
      .flatMap((section) => section.contacts)
      .at(0);
    baseData.selectedContact = fallbackContact ? toSelectedContact(fallbackContact) : null;
  } catch {
  }

  return baseData;
}

export async function writeDashboardData(data: DashboardData) {
  await fs.writeFile(dashboardFilePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}
