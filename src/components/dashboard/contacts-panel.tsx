import Image from "next/image";
import { Plus } from "lucide-react";
import type { ContactSection } from "@/types/dashboard";

type ContactsPanelProps = {
  title: string;
  sections: ContactSection[];
  selectedName: string;
};

export function ContactsPanel({ title, sections, selectedName }: ContactsPanelProps) {
  return (
    <section className="rounded-[30px] bg-[#f4f5ef] p-4 sm:p-5 xl:min-h-[730px]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-3xl font-semibold tracking-tight text-[#21231d]">{title}</h2>
      </div>
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
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[#dedfd5] bg-white text-[#464940]"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[290px] space-y-1 overflow-y-auto pr-1 no-scrollbar">
              {section.contacts.map((contact) => (
                <button
                  key={contact.id}
                  type="button"
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
