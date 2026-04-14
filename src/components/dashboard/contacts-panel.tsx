"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Plus, UserPlus } from "lucide-react";
import { FormEvent, useMemo, useRef, useState } from "react";
import type { ContactSection } from "@/types/dashboard";
import type { Contact } from "@/types/dashboard";

type ContactsPanelProps = {
  title: string;
  sections: ContactSection[];
  selectedName: string;
  onContactSelect: (contact: Contact) => void;
};

export function ContactsPanel({
  title,
  sections,
  selectedName,
  onContactSelect,
}: ContactsPanelProps) {
  const router = useRouter();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const defaultSectionId = useMemo(
    () => (sections[0] ? String(sections[0].id) : ""),
    [sections],
  );
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [sectionId, setSectionId] = useState(defaultSectionId);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const activeSectionId = sectionId || defaultSectionId;

  const handleCreateContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    setIsSaving(true);

    const response = await fetch("/api/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        role: role.trim(),
        sectionId: activeSectionId ? Number(activeSectionId) : undefined,
      }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setError(payload?.error ?? "Could not create contact.");
      setIsSaving(false);
      return;
    }

    setName("");
    setRole("");
    setIsSaving(false);
    router.refresh();
  };

  return (
    <section className="rounded-[30px] bg-[#f4f5ef] p-4 sm:p-5 xl:min-h-[730px]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-3xl font-semibold tracking-tight text-[#21231d]">{title}</h2>
      </div>
      <form
        className="mb-4 rounded-3xl border border-[#e3e4db] bg-[#f8f8f3] p-3"
        onSubmit={handleCreateContact}
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#ece54b] text-[#343528]">
            <UserPlus className="h-4 w-4" />
          </span>
          <p className="text-sm font-semibold text-[#2a2c25]">Create contact</p>
        </div>
        <p className="mb-2 text-xs font-medium text-[#7f8277]">
          Photo, email, phone, and location are generated automatically.
        </p>
        <div className="space-y-2">
          <input
            ref={nameInputRef}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Full name"
            className="h-10 w-full rounded-xl border border-[#dcded3] bg-white px-3 text-sm text-[#2a2d25] outline-none"
          />
          <input
            value={role}
            onChange={(event) => setRole(event.target.value)}
            placeholder="Role (optional)"
            className="h-10 w-full rounded-xl border border-[#dcded3] bg-white px-3 text-sm text-[#2a2d25] outline-none"
          />
          <select
            value={activeSectionId}
            onChange={(event) => setSectionId(event.target.value)}
            className="h-10 w-full rounded-xl border border-[#dcded3] bg-white px-3 text-sm text-[#2a2d25] outline-none"
          >
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.title}
              </option>
            ))}
          </select>
          {error ? <p className="text-xs font-medium text-[#cb4d3d]">{error}</p> : null}
          <button
            type="submit"
            disabled={isSaving || !sections.length}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#23241f] text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#8a8d82]"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add contact
          </button>
        </div>
      </form>
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="rounded-3xl border border-[#e3e4db] bg-[#f8f8f3] p-3">
            <div className="mb-3 flex items-center justify-between rounded-2xl bg-[#f1f2eb] px-3 py-2">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-white px-2 text-xs font-semibold text-[#31342b]">
                  {section.count}
                </span>
                <p className="text-sm font-semibold text-[#2a2c25]">{section.title}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSectionId(String(section.id));
                  nameInputRef.current?.focus();
                }}
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[#dedfd5] bg-white text-[#464940]"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[290px] space-y-1 overflow-y-auto pr-1 no-scrollbar">
              {!section.contacts.length ? (
                <p className="rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#8f9287]">
                  No contacts yet.
                </p>
              ) : null}
              {section.contacts.map((contact) => (
                <button
                  key={contact.id}
                  type="button"
                  onClick={() => onContactSelect(contact)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left transition ${
                    contact.name === selectedName
                      ? "bg-white shadow-[0_8px_24px_rgba(56,58,40,0.1)]"
                      : "hover:bg-white/70"
                  }`}
                >
                  <Image
                    src={contact.avatar}
                    alt={contact.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#24261f]">{contact.name}</p>
                  </div>
                  <span className="text-xs text-[#8f9287]">{contact.role}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
