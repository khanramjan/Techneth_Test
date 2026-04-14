"use client";

import Image from "next/image";
import {
  BriefcaseBusiness,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Redo2,
  RotateCcw,
  Undo2,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import type {
  AnalyticsData,
  DealMetric,
  SelectedContact,
} from "@/types/dashboard";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";

type MainPanelProps = {
  toolbarIcons: string[];
  selectedContact: SelectedContact | null;
  analytics: AnalyticsData;
  dealMetrics: DealMetric[];
  property: {
    title: string;
    image: string;
  };
};

const metaIconMap: Record<string, LucideIcon> = {
  phone: Phone,
  mail: Mail,
  map: MapPin,
  briefcase: BriefcaseBusiness,
};

const actionIconMap: Record<string, LucideIcon> = {
  undo: Undo2,
  redo: Redo2,
  "rotate-ccw": RotateCcw,
  phone: Phone,
  video: Video,
  "message-circle": MessageCircle,
  briefcase: BriefcaseBusiness,
};

const rangeOptions = ["Last weeks", "Last month", "Last quarter"];

function metaValue(selectedContact: SelectedContact | null, icon: string) {
  return selectedContact?.meta.find((item) => item.icon === icon)?.value ?? "";
}

function normalizeTabLabel(tab: string) {
  return tab.trim().toLowerCase();
}

export function MainPanel({
  toolbarIcons,
  selectedContact,
  analytics,
  dealMetrics,
  property,
}: MainPanelProps) {
  const hasSelectedContact = Boolean(selectedContact);
  const activeTabs = selectedContact?.tabs?.length
    ? selectedContact.tabs
    : ["Analytics", "General", "Summary"];
  const initialRangeIndex = Math.max(rangeOptions.indexOf(analytics.range), 0);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [rangeIndex, setRangeIndex] = useState(initialRangeIndex);
  const [actionMessage, setActionMessage] = useState("Interactive actions enabled");
  const selectedPhone = useMemo(() => metaValue(selectedContact, "phone"), [selectedContact]);
  const selectedEmail = useMemo(() => metaValue(selectedContact, "mail"), [selectedContact]);
  const selectedLocation = useMemo(() => metaValue(selectedContact, "map"), [selectedContact]);

  const activeTab = activeTabs[activeTabIndex] ?? activeTabs[0] ?? "Analytics";
  const isAnalyticsTab = normalizeTabLabel(activeTab) === "analytics";
  const currentRange = rangeOptions[rangeIndex] ?? analytics.range;

  const handleToolbarAction = (icon: string) => {
    if (icon === "undo") {
      setActiveTabIndex((current) => Math.max(current - 1, 0));
      setActionMessage("Moved tab selection backward");
      return;
    }

    if (icon === "redo") {
      setActiveTabIndex((current) => Math.min(current + 1, activeTabs.length - 1));
      setActionMessage("Moved tab selection forward");
      return;
    }

    if (icon === "rotate-ccw") {
      setActiveTabIndex(0);
      setRangeIndex(Math.max(rangeOptions.indexOf(analytics.range), 0));
      setActionMessage("Reset panel actions");
      return;
    }

    setActionMessage(`Toolbar action ${icon} triggered`);
  };

  const handleQuickAction = (icon: string) => {
    if (!selectedContact) {
      setActionMessage("Select a contact first");
      return;
    }

    if (icon === "phone") {
      const digits = selectedPhone.replace(/[^\d+]/g, "");
      if (digits) {
        window.open(`tel:${digits}`, "_self");
        setActionMessage(`Calling ${selectedContact.name}`);
      }
      return;
    }

    if (icon === "video") {
      window.open("https://meet.google.com/new", "_blank", "noopener,noreferrer");
      setActionMessage(`Starting video for ${selectedContact.name}`);
      return;
    }

    if (icon === "message-circle") {
      if (selectedEmail) {
        window.open(`mailto:${selectedEmail}`, "_self");
        setActionMessage(`Opening email composer for ${selectedContact.name}`);
      }
      return;
    }

    if (icon === "briefcase") {
      const summaryIndex = activeTabs.findIndex((tab) => {
        const normalizedTab = normalizeTabLabel(tab);
        return normalizedTab === "summary" || normalizedTab === "summaray";
      });
      setActiveTabIndex(summaryIndex >= 0 ? summaryIndex : 0);
      setActionMessage("Switched to summary tab");
      return;
    }

    setActionMessage(`Quick action ${icon} triggered`);
  };

  const cycleRange = () => {
    setRangeIndex((current) => {
      const next = (current + 1) % rangeOptions.length;
      setActionMessage(`Analytics range: ${rangeOptions[next]}`);
      return next;
    });
  };

  return (
    <main className="rounded-[30px] bg-[#f4f5ef] p-4 sm:p-5 xl:min-h-[730px]">
      <div className="mb-4 flex items-center gap-2">
        {toolbarIcons.map((icon, index) => {
          const Icon = actionIconMap[icon] ?? Undo2;

          return (
            <button
              key={`${icon}-${index}`}
              type="button"
              onClick={() => handleToolbarAction(icon)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dedfd5] bg-[#f9f9f4] text-[#464940]"
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>

      <div className="mb-4 rounded-xl border border-[#dfe0d6] bg-[#f8f8f3] px-3 py-2 text-xs font-semibold text-[#70746a]">
        {actionMessage}
      </div>

      <div className="rounded-3xl border border-[#e1e2d9] bg-[#f8f8f3] p-3 sm:p-4">
        {hasSelectedContact && selectedContact ? (
          <div className="grid gap-3 xl:grid-cols-[258px_minmax(0,1fr)]">
            <div className="rounded-3xl bg-white p-3 shadow-[0_14px_34px_rgba(63,66,49,0.12)]">
              <Image
                src={selectedContact.avatar}
                alt={selectedContact.name}
                width={320}
                height={320}
                className="h-56 w-full rounded-2xl object-cover"
              />
              <div className="mt-3 flex items-center justify-center gap-2">
                {selectedContact.quickActions.map((icon, index) => {
                  const Icon = actionIconMap[icon] ?? Phone;

                  return (
                    <button
                      key={`${icon}-${index}`}
                      type="button"
                      onClick={() => handleQuickAction(icon)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#e1e2d8] bg-[#f7f7f2] text-[#43463d]"
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-3xl bg-white px-4 py-5 shadow-[0_14px_34px_rgba(63,66,49,0.12)]">
                <p className="text-[34px] leading-none font-semibold tracking-tight text-[#25271f]">
                  {selectedContact.name}
                </p>
                <p className="mt-1 text-sm font-medium text-[#8a8d83]">{selectedContact.role}</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {selectedContact.meta.map((meta) => {
                    const Icon = metaIconMap[meta.icon] ?? BriefcaseBusiness;

                    return (
                      <div
                        key={meta.id}
                        className="rounded-2xl border border-[#e2e3d9] bg-[#f8f8f3] p-3"
                      >
                        <p className="mb-1 flex items-center gap-2 text-xs font-semibold text-[#76796e]">
                          <Icon className="h-3.5 w-3.5" />
                          {meta.label}
                        </p>
                        <p className="text-sm font-semibold text-[#262820]">{meta.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white p-1.5">
                {activeTabs.map((tab, index) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTabIndex(index);
                      setActionMessage(`Switched to ${tab} tab`);
                    }}
                    className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      index === activeTabIndex
                        ? "bg-[#f4f5ef] text-[#24261f]"
                        : "text-[#8a8d83] hover:text-[#2f312a]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-white px-6 py-14 text-center shadow-[0_14px_34px_rgba(63,66,49,0.12)]">
            <p className="text-2xl font-semibold tracking-tight text-[#25271f]">No contacts yet</p>
            <p className="mt-2 text-sm font-medium text-[#8a8d83]">
              Create a contact from the contacts panel to populate this section.
            </p>
          </div>
        )}

        <div className="mt-4 rounded-3xl border border-[#e1e2d9] bg-white p-3 sm:p-4">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#7f8277]">{analytics.averageScoreLabel}</p>
              <div className="flex items-end gap-2">
                <p className="text-[56px] leading-none font-semibold tracking-tight text-[#25271f]">
                  {analytics.averageScore}
                </p>
                <span className="mb-2 rounded-lg bg-[#cef27e] px-2 py-1 text-xs font-bold text-[#325118]">
                  {analytics.delta}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={cycleRange}
              className="ml-auto h-10 rounded-xl border border-[#e1e2d8] bg-[#f8f8f3] px-3 text-sm font-semibold text-[#55584f]"
            >
              {currentRange}
            </button>
          </div>
          {isAnalyticsTab ? (
            <AnalyticsCharts
              series={analytics.series}
              scoreTrendLabel={analytics.scoreTrendLabel}
              scoreTrendBadge={analytics.scoreTrendBadge}
              dealBarsLabel={analytics.dealBarsLabel}
            />
          ) : (
            <div className="rounded-2xl border border-[#e4e5dc] bg-[#f9f9f4] p-4">
              <p className="text-sm font-semibold text-[#2c2e27]">{activeTab} view</p>
              <p className="mt-2 text-sm text-[#72766b]">
                {(() => {
                  const normalizedTab = normalizeTabLabel(activeTab);

                  if (normalizedTab === "general") {
                    return `Location: ${selectedLocation || "Not available"} · Email: ${selectedEmail || "Not available"}`;
                  }

                  if (normalizedTab === "summary" || normalizedTab === "summaray") {
                    return `${selectedContact?.name ?? "Contact"} summary is active. Use toolbar buttons to navigate.`;
                  }

                  return `Current tab: ${activeTab}`;
                })()}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {dealMetrics.map((metric) => (
          <article key={metric.id} className="rounded-3xl border border-[#e1e2d9] bg-[#f8f8f3] p-4">
            <p className="text-sm font-semibold text-[#73766b]">{metric.label}</p>
            <p className="mt-1 text-[56px] leading-none font-semibold tracking-tight text-[#25271f]">
              {metric.value}
            </p>
            <div className="mt-3 h-5 rounded-lg bg-[#eceee5] p-0.5">
              <div
                className="h-full rounded-md"
                style={{ width: `${metric.progress}%`, backgroundColor: metric.accent }}
              />
            </div>
            <span className="mt-2 inline-block rounded-md bg-[#e6e7de] px-2 py-1 text-xs font-bold text-[#52554a]">
              {metric.delta}
            </span>
          </article>
        ))}
      </div>

      <article className="mt-4 overflow-hidden rounded-3xl border border-[#e1e2d8] bg-white">
        <div className="grid gap-0 md:grid-cols-[240px_minmax(0,1fr)]">
          <Image
            src={property.image}
            alt={property.title}
            width={480}
            height={260}
            className="h-44 w-full object-cover"
          />
          <div className="p-4 sm:p-5">
            <p className="text-3xl font-semibold leading-tight tracking-tight text-[#2d2f27]">
              {property.title}
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
