import {
  ArrowUpRight,
  Check,
  Link2,
  MessageCircle,
  Plus,
  Search,
  Send,
  Share2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type {
  ChatAttachment,
  ChatMessage,
  NoteTask,
  RightPanelConfig,
} from "@/types/dashboard";

type RightPanelProps = {
  config: RightPanelConfig;
  tasks: NoteTask[];
  messages: ChatMessage[];
  attachments: ChatAttachment[];
  className?: string;
};

const actionIconMap: Record<string, LucideIcon> = {
  share: Share2,
  plus: Plus,
  "arrow-up-right": ArrowUpRight,
};

export function RightPanel({
  config,
  tasks,
  messages,
  attachments,
  className,
}: RightPanelProps) {
  return (
    <aside className={`space-y-4 ${className ?? ""}`}>
      <div className="rounded-[30px] bg-[#f4f5ef] p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.actions.map((action) => {
              const Icon = actionIconMap[action.icon] ?? Share2;

              if (action.label) {
                return (
                  <button
                    key={action.id}
                    type="button"
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#dedfd5] bg-[#f9f9f4] px-3 text-sm font-semibold text-[#3c3f36]"
                  >
                    <Icon className="h-4 w-4" />
                    {action.label}
                  </button>
                );
              }

              return (
                <button
                  key={action.id}
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dedfd5] bg-[#f9f9f4] text-[#484b41]"
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-[#e2e3da] bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#25271f]">{config.notesTitle}</h3>
            <span className="rounded-lg bg-[#f2f3ed] px-2 py-1 text-xs font-semibold text-[#66695f]">
              {tasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="grid grid-cols-[20px_minmax(0,1fr)_auto] items-start gap-2 rounded-xl bg-[#f9f9f4] px-2 py-2"
              >
                <span
                  className={`mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-sm border ${
                    task.done
                      ? "border-[#e8e04d] bg-[#efe75a] text-[#45472f]"
                      : "border-[#d8dacf] bg-white text-transparent"
                  }`}
                >
                  <Check className="h-3 w-3" />
                </span>
                <p className="text-xs leading-5 text-[#606359]">{task.text}</p>
                <span className="text-[11px] font-semibold text-[#9a9d93]">{task.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[30px] bg-[#f4f5ef] p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-[#25271f]">{config.chatTitle}</h3>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#dedfd5] bg-[#f9f9f4] text-[#484b41]"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 rounded-2xl border border-[#e2e3da] bg-white p-3">
          {messages.map((message) => (
            <div key={message.id} className="space-y-1">
              <div className="inline-flex max-w-[90%] rounded-2xl bg-[#f4f5ef] px-3 py-2 text-sm font-medium text-[#303229]">
                {message.text}
              </div>
              <p className="text-right text-[11px] font-semibold text-[#8f9288]">{message.time}</p>
            </div>
          ))}

          <div className="grid grid-cols-2 gap-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="rounded-xl border border-[#e1e2d9] bg-[#f9f9f4] p-2"
              >
                <div className="mb-2 h-20 rounded-lg bg-[repeating-linear-gradient(0deg,#f8f8f2,#f8f8f2_6px,#eceee6_6px,#eceee6_8px)]" />
                <p className="truncate text-xs font-semibold text-[#5f6258]">{attachment.title}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#e1e2d8] bg-[#f9f9f4] px-3 py-2">
            <Search className="h-4 w-4 text-[#8d9085]" />
            <input
              placeholder={config.chatInputPlaceholder}
              className="h-8 flex-1 bg-transparent text-sm text-[#303229] outline-none placeholder:text-[#a0a39a]"
            />
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#efe75b] text-[#3c3f33]"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-[#8d9085]">
          <Link2 className="h-3.5 w-3.5" />
          <MessageCircle className="h-3.5 w-3.5" />
          <span>{config.statusLabel}</span>
        </div>
      </div>
    </aside>
  );
}
