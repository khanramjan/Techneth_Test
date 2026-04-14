"use client";

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
import { useMemo, useState } from "react";
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
  const [taskItems, setTaskItems] = useState(tasks);
  const [chatMessages, setChatMessages] = useState(messages);
  const [chatInput, setChatInput] = useState("");
  const [statusLabel, setStatusLabel] = useState(config.statusLabel);
  const [notesCollapsed, setNotesCollapsed] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(true);
  const [nextTaskId, setNextTaskId] = useState(() =>
    tasks.length ? Math.max(...tasks.map((task) => task.id)) + 1 : 1,
  );
  const [nextMessageId, setNextMessageId] = useState(() =>
    messages.length ? Math.max(...messages.map((message) => message.id)) + 1 : 1,
  );
  const taskCount = useMemo(() => taskItems.length, [taskItems]);

  const addQuickNote = () => {
    const noteId = nextTaskId;
    setNextTaskId((current) => current + 1);

    setTaskItems((current) => [
      {
        id: noteId,
        text: "Follow up with newly added lead",
        time: "Now",
        done: false,
      },
      ...current,
    ]);
    setStatusLabel("Quick note created");
  };

  const handleActionClick = async (icon: string) => {
    if (icon === "share") {
      try {
        const currentUrl = window.location.href;

        if (navigator.share) {
          await navigator.share({
            title: "Techneth Dashboard",
            url: currentUrl,
          });
          setStatusLabel("Dashboard link shared");
          return;
        }

        await navigator.clipboard.writeText(currentUrl);
        setStatusLabel("Dashboard link copied");
        return;
      } catch {
        setStatusLabel("Share cancelled");
        return;
      }
    }

    if (icon === "plus") {
      addQuickNote();
      return;
    }

    if (icon === "arrow-up-right") {
      setNotesCollapsed((current) => {
        const next = !current;
        setStatusLabel(next ? "Notes collapsed" : "Notes expanded");
        return next;
      });
      return;
    }
  };

  const toggleTask = (taskId: number) => {
    setTaskItems((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              done: !task.done,
            }
          : task,
      ),
    );
  };

  const sendMessage = () => {
    const normalizedInput = chatInput.trim();

    if (!normalizedInput) {
      setStatusLabel("Write a message first");
      return;
    }

    const messageId = nextMessageId;
    setNextMessageId((current) => current + 1);

    setChatMessages((current) => [
      ...current,
      {
        id: messageId,
        sender: "You",
        text: normalizedInput,
        time: "Now",
        mine: true,
      },
    ]);
    setChatInput("");
    setStatusLabel("Message sent");
  };

  const handleAttachmentClick = (title: string) => {
    setChatInput(`Regarding ${title}: `);
    setStatusLabel(`${title} linked to message`);
  };

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
                    onClick={() => {
                      void handleActionClick(action.icon);
                    }}
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
                  onClick={() => {
                    void handleActionClick(action.icon);
                  }}
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
              {taskCount}
            </span>
          </div>
          {!notesCollapsed ? (
            <div className="space-y-3">
              {taskItems.map((task) => (
                <div
                  key={task.id}
                  className="grid grid-cols-[20px_minmax(0,1fr)_auto] items-start gap-2 rounded-xl bg-[#f9f9f4] px-2 py-2"
                >
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className={`mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-sm border ${
                      task.done
                        ? "border-[#e8e04d] bg-[#efe75a] text-[#45472f]"
                        : "border-[#d8dacf] bg-white text-transparent"
                    }`}
                  >
                    <Check className="h-3 w-3" />
                  </button>
                  <p className="text-xs leading-5 text-[#606359]">{task.text}</p>
                  <span className="text-[11px] font-semibold text-[#9a9d93]">{task.time}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-[#f9f9f4] px-3 py-3 text-xs font-semibold text-[#7e8178]">
              Notes are collapsed. Use the expand button above.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-[30px] bg-[#f4f5ef] p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-[#25271f]">{config.chatTitle}</h3>
          <button
            type="button"
            onClick={() => {
              setChatExpanded((current) => {
                const next = !current;
                setStatusLabel(next ? "Chat expanded" : "Chat collapsed");
                return next;
              });
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#dedfd5] bg-[#f9f9f4] text-[#484b41]"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 rounded-2xl border border-[#e2e3da] bg-white p-3">
          {chatMessages.map((message) => (
            <div key={message.id} className="space-y-1">
              <div
                className={`inline-flex max-w-[90%] rounded-2xl px-3 py-2 text-sm font-medium ${
                  message.mine
                    ? "ml-auto bg-[#efe75b] text-[#2f3229]"
                    : "bg-[#f4f5ef] text-[#303229]"
                }`}
              >
                {message.text}
              </div>
              <p className="text-right text-[11px] font-semibold text-[#8f9288]">{message.time}</p>
            </div>
          ))}

          {chatExpanded ? (
            <div className="grid grid-cols-2 gap-2">
              {attachments.map((attachment) => (
                <button
                  key={attachment.id}
                  type="button"
                  onClick={() => handleAttachmentClick(attachment.title)}
                  className="rounded-xl border border-[#e1e2d9] bg-[#f9f9f4] p-2 text-left"
                >
                  <div className="mb-2 h-20 rounded-lg bg-[repeating-linear-gradient(0deg,#f8f8f2,#f8f8f2_6px,#eceee6_6px,#eceee6_8px)]" />
                  <p className="truncate text-xs font-semibold text-[#5f6258]">{attachment.title}</p>
                </button>
              ))}
            </div>
          ) : null}

          <form
            className="flex items-center gap-2 rounded-xl border border-[#e1e2d8] bg-[#f9f9f4] px-3 py-2"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <Search className="h-4 w-4 text-[#8d9085]" />
            <input
              placeholder={config.chatInputPlaceholder}
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              className="h-8 flex-1 bg-transparent text-sm text-[#303229] outline-none placeholder:text-[#a0a39a]"
            />
            <button
              type="button"
              onClick={sendMessage}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#efe75b] text-[#3c3f33]"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-[#8d9085]">
          <Link2 className="h-3.5 w-3.5" />
          <MessageCircle className="h-3.5 w-3.5" />
          <span>{statusLabel}</span>
        </div>
      </div>
    </aside>
  );
}
