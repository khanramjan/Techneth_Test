"use client";

import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronLeft,
  Paperclip,
  Plus,
  Search,
  Send,
  Share2,
} from "lucide-react";
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
    <aside className={`rounded-[30px] bg-[#f4f5ef] p-4 sm:p-5 ${className ?? ""}`}>
      <div className="mb-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            void handleActionClick("share");
          }}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#dedfd5] bg-[#f9f9f4] px-3 text-sm font-semibold text-[#3c3f36]"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
        <button
          type="button"
          onClick={() => {
            setStatusLabel("Calendar action ready");
          }}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dedfd5] bg-[#f9f9f4] text-[#484b41]"
        >
          <CalendarDays className="h-4 w-4" />
        </button>
      </div>

      <section className="rounded-2xl border border-[#e2e3da] bg-white p-3">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setNotesCollapsed((current) => !current);
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#dedfd5] bg-[#f9f9f4] text-[#5a5d54]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="rounded-lg bg-[#f2f3ed] px-2 py-1 text-xs font-semibold text-[#66695f]">
              {taskCount}
            </span>
            <h3 className="text-base font-semibold text-[#25271f]">{config.notesTitle}</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={addQuickNote}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#dedfd5] bg-[#f9f9f4] text-[#5a5d54]"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setNotesCollapsed((current) => !current);
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#dedfd5] bg-[#f9f9f4] text-[#5a5d54]"
            >
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!notesCollapsed ? (
          <div className="rounded-2xl bg-[#f7f8f2] p-2.5">
            <div className="space-y-1.5">
              {taskItems.map((task) => (
                <div key={task.id} className="grid grid-cols-[18px_minmax(0,1fr)_auto] items-start gap-2 rounded-xl bg-white px-2 py-2">
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
                  <p className={`text-xs leading-5 ${task.done ? "text-[#a0a39a]" : "text-[#45483f]"}`}>
                    {task.text}
                  </p>
                  <span className="text-[11px] font-semibold text-[#9a9d93]">{task.time}</span>
                </div>
              ))}
            </div>
            <div className="mx-auto mt-2 h-[2px] w-4 rounded-full bg-[#43463d]" />
          </div>
        ) : (
          <p className="rounded-xl bg-[#f9f9f4] px-3 py-3 text-xs font-semibold text-[#7e8178]">
            Notes are collapsed. Use the expand button above.
          </p>
        )}
      </section>

      <section className="mt-3 rounded-2xl border border-[#e2e3da] bg-white p-3">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#25271f]">
            <Search className="h-4 w-4 text-[#797d72]" />
            <h3 className="text-base font-semibold">{config.chatTitle}</h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setChatExpanded((current) => !current);
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#dedfd5] bg-[#f9f9f4] text-[#484b41]"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 rounded-2xl bg-[#f7f8f2] p-2.5">
          {chatMessages.map((message) => (
            <div key={message.id} className="space-y-1">
              <div className="inline-flex max-w-[90%] rounded-2xl bg-white px-3 py-2 text-sm font-medium text-[#303229]">
                {message.text}
              </div>
              <div className="flex items-center justify-end gap-1 text-[11px] font-semibold text-[#8f9288]">
                <Check className="h-3 w-3 text-[#d2e972]" />
                <span>{message.time}</span>
              </div>
            </div>
          ))}

          {chatExpanded ? (
            <div className="grid grid-cols-2 gap-2">
              {attachments.map((attachment) => (
                <button
                  key={attachment.id}
                  type="button"
                  onClick={() => handleAttachmentClick(attachment.title)}
                  className="rounded-xl border border-[#e1e2d9] bg-white p-2"
                >
                  <div className="h-20 rounded-md bg-[repeating-linear-gradient(0deg,#f8f8f2,#f8f8f2_6px,#eceee6_6px,#eceee6_8px)]" />
                </button>
              ))}
            </div>
          ) : null}

          <form
            className="flex items-center gap-2 rounded-xl border border-[#e1e2d8] bg-white px-2 py-2"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <input
              placeholder={config.chatInputPlaceholder}
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              className="h-8 flex-1 bg-transparent px-1 text-sm text-[#303229] outline-none placeholder:text-[#a0a39a]"
            />
            <button
              type="button"
              onClick={() => {
                setStatusLabel("Attachment action ready");
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#7c8075]"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={sendMessage}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#efe75b] text-[#3c3f33]"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>

      <p className="sr-only">{statusLabel}</p>
    </aside>
  );
}
