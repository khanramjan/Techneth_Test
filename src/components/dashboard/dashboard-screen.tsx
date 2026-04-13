import Image from "next/image";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ContactsPanel } from "@/components/dashboard/contacts-panel";
import { LeftRail } from "@/components/dashboard/left-rail";
import { MainPanel } from "@/components/dashboard/main-panel";
import { RightPanel } from "@/components/dashboard/right-panel";
import type { DashboardData } from "@/types/dashboard";

type DashboardScreenProps = {
  data: DashboardData;
  userEmail: string;
};

export function DashboardScreen({ data, userEmail }: DashboardScreenProps) {
  const userSubtitle = userEmail
    ? `${data.currentUser.role} · ${userEmail}`
    : data.currentUser.role;

  return (
    <div className="min-h-screen bg-[#b5b5b0] p-2 sm:p-4 md:p-6">
      <div className="mx-auto max-w-[1680px] rounded-[34px] border border-[#aeb0a6] bg-[#e8e9e1] p-3 sm:p-4 lg:p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.62),0_22px_70px_rgba(48,50,37,0.25)]">
        <header className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full items-center gap-2 lg:max-w-[930px]">
            <div className="flex h-12 w-full items-center gap-3 rounded-2xl border border-[#d9dbd1] bg-[#f4f5ef] px-4 text-[#787b72] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
              <Search className="h-4 w-4" />
              <input
                placeholder={data.searchPlaceholder}
                className="h-full flex-1 bg-transparent text-sm font-medium text-[#2b2d25] outline-none placeholder:text-[#9ca094]"
              />
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#dfe0d6] bg-[#f8f8f4] text-[#666960]"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="flex h-12 items-center gap-2 rounded-2xl border border-[#dbddd2] bg-[#f7f8f3] px-3">
              <Image
                src={data.currentUser.avatar}
                alt={data.currentUser.name}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-[#282a22]">{data.currentUser.name}</p>
                <p className="text-xs text-[#81847a]">{userSubtitle}</p>
              </div>
            </div>
            <button
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#dbddd2] bg-[#f7f8f3] text-[#565950]"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
            <SignOutButton />
          </div>
        </header>

        <div className="grid gap-4 xl:grid-cols-[68px_295px_minmax(0,1fr)_330px] lg:grid-cols-[68px_295px_minmax(0,1fr)]">
          <LeftRail brand={data.brand} items={data.railItems} />
          <ContactsPanel
            sections={data.contactSections}
            selectedName={data.selectedContact.name}
          />
          <MainPanel
            selectedContact={data.selectedContact}
            analytics={data.analytics}
            dealMetrics={data.dealMetrics}
            property={data.property}
          />
          <RightPanel
            className="lg:col-span-3 xl:col-span-1"
            tasks={data.tasks}
            messages={data.chat.messages}
            attachments={data.chat.attachments}
          />
        </div>
      </div>
    </div>
  );
}
