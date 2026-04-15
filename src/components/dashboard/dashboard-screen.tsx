"use client";

import Image from "next/image";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ContactsPanel } from "@/components/dashboard/contacts-panel";
import { LeftRail } from "@/components/dashboard/left-rail";
import { MainPanel } from "@/components/dashboard/main-panel";
import { RightPanel } from "@/components/dashboard/right-panel";
import type { Contact, DashboardData, SelectedContact } from "@/types/dashboard";

type DashboardScreenProps = {
  data: DashboardData;
  authUser: {
    name: string;
    role: string;
    avatar: string;
  };
};

type SearchScope = "all" | "name" | "role";

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

export function DashboardScreen({ data, authUser }: DashboardScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchScope, setSearchScope] = useState<SearchScope>("all");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [headerMessage, setHeaderMessage] = useState("Interactive mode active");
  const [selectedContactOverride, setSelectedContactOverride] = useState<SelectedContact | null>(null);
  const [fallbackContacts, setFallbackContacts] = useState<Record<number, Contact[]>>({});
  const [activeRailId, setActiveRailId] = useState(
    data.railItems.find((item) => item.active)?.id ?? data.railItems[0]?.id ?? 0,
  );
  const selectedContact = selectedContactOverride ?? data.selectedContact;

  const visibleSections = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return data.contactSections.map((section) => {
      const localFallback = fallbackContacts[section.id] ?? [];
      let contacts = [...localFallback, ...section.contacts];

      if (normalizedQuery) {
        contacts = contacts.filter((contact) => {
          const byName = contact.name.toLowerCase().includes(normalizedQuery);
          const byRole = contact.role.toLowerCase().includes(normalizedQuery);

          if (searchScope === "name") {
            return byName;
          }

          if (searchScope === "role") {
            return byRole;
          }

          return byName || byRole;
        });
      }

      contacts.sort((first, second) => {
        const comparator = first.name.localeCompare(second.name);
        return sortDirection === "asc" ? comparator : comparator * -1;
      });

      return {
        ...section,
        contacts,
        count: contacts.length,
      };
    });
  }, [data.contactSections, fallbackContacts, searchQuery, searchScope, sortDirection]);

  const railItems = useMemo(
    () => data.railItems.map((item) => ({ ...item, active: item.id === activeRailId })),
    [activeRailId, data.railItems],
  );

  const cycleSearchScope = () => {
    setSearchScope((current) => {
      const next = current === "all" ? "name" : current === "name" ? "role" : "all";
      setHeaderMessage(`Search scope: ${next}`);
      return next;
    });
  };

  const toggleSortDirection = () => {
    setSortDirection((current) => {
      const next = current === "asc" ? "desc" : "asc";
      setHeaderMessage(`Sort direction: ${next}`);
      return next;
    });
  };

  const handleRailSelect = (itemId: number) => {
    setActiveRailId(itemId);
    setHeaderMessage(`Rail item ${itemId} selected`);
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContactOverride(toSelectedContact(contact));
    setHeaderMessage(`${contact.name} selected`);
  };

  const handleContactCreate = ({
    contact,
    sectionId,
    fallback,
    warning,
  }: {
    contact: Contact;
    sectionId: number;
    fallback: boolean;
    warning?: string;
  }) => {
    setSelectedContactOverride(toSelectedContact(contact));

    if (fallback) {
      setFallbackContacts((current) => {
        const existing = current[sectionId] ?? [];
        return {
          ...current,
          [sectionId]: [contact, ...existing.filter((item) => item.id !== contact.id)],
        };
      });
      setHeaderMessage(warning ?? "Contact added locally");
      return;
    }

    setHeaderMessage(`${contact.name} created`);
  };

  return (
    <div className="min-h-screen bg-[#b5b5b0] p-2 sm:p-4 md:p-6">
      <div className="mx-auto max-w-[1680px] rounded-[34px] border border-[#aeb0a6] bg-[#e8e9e1] p-3 sm:p-4 lg:p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.62),0_22px_70px_rgba(48,50,37,0.25)]">
        <header className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full items-center gap-2 lg:max-w-[930px]">
            <div className="flex h-12 w-full items-center gap-3 rounded-2xl border border-[#d9dbd1] bg-[#f4f5ef] px-4 text-[#787b72] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
              <Search className="h-4 w-4" />
              <input
                placeholder={data.searchPlaceholder}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-full flex-1 bg-transparent text-sm font-medium text-[#2b2d25] outline-none placeholder:text-[#9ca094]"
              />
              <button
                type="button"
                onClick={cycleSearchScope}
                title={`Search scope: ${searchScope}`}
                aria-label={`Search scope: ${searchScope}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#dfe0d6] bg-[#f8f8f4] text-[#666960]"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="flex h-12 items-center gap-2 rounded-2xl border border-[#dbddd2] bg-[#f7f8f3] px-3">
              <Image
                src={authUser.avatar}
                alt={authUser.name}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-[#282a22]">{authUser.name}</p>
                <p className="text-xs text-[#81847a]">{authUser.role}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleSortDirection}
              title={`Sort direction: ${sortDirection}`}
              aria-label={`Sort direction: ${sortDirection}`}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#dbddd2] bg-[#f7f8f3] text-[#565950]"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
            <SignOutButton />
          </div>
        </header>

        <div className="mb-4 rounded-2xl border border-[#d9dbd1] bg-[#f4f5ef] px-4 py-2 text-xs font-semibold tracking-[0.06em] text-[#6b6e65]">
          {headerMessage}
        </div>

        <div className="grid gap-4 xl:grid-cols-[68px_295px_minmax(0,1fr)_330px] lg:grid-cols-[68px_295px_minmax(0,1fr)]">
          <LeftRail
            brand={data.brand}
            items={railItems}
            activeItemId={activeRailId}
            onSelect={handleRailSelect}
          />
          <ContactsPanel
            title={data.contactsTitle}
            sections={visibleSections}
            selectedName={selectedContact?.name ?? ""}
            onContactSelect={handleContactSelect}
            onContactCreate={handleContactCreate}
          />
          <MainPanel
            key={selectedContact?.name ?? "no-contact"}
            toolbarIcons={data.mainToolbarIcons}
            selectedContact={selectedContact}
            analytics={data.analytics}
            dealMetrics={data.dealMetrics}
            property={data.property}
          />
          <RightPanel
            className="lg:col-span-3 xl:col-span-1"
            config={data.rightPanel}
            tasks={data.tasks}
            messages={data.chat.messages}
            attachments={data.chat.attachments}
          />
        </div>
      </div>
    </div>
  );
}
