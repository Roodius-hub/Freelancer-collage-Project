
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import api from "@/lib/axios";
import { Conversation } from "@/Types/chat";

export default function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { data: session, status } = useSession();
  const pathname = usePathname();

  const currentUserId = session?.user?.id;

  useEffect(() => {
    if (status === "loading") return;

    if (!currentUserId) {
      setLoading(false);
      return;
    }

    const fetchConversations = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/conversations");

        setConversations(
          response.data.conversations || []
        );
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
        setError("Unable to load conversations.");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentUserId, status]);

  const getInitials = (name?: string | null) => {
    return (
      name
        ?.split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "?"
    );
  };

  const getOtherUser = (conversation: Conversation) => {
    return conversation.clientId === currentUserId
      ? conversation.freelancer
      : conversation.client;
  };

  const formatTime = (date?: string) => {
    if (!date) return "";

    const messageDate = new Date(date);

    if (Number.isNaN(messageDate.getTime())) return "";

    const today = new Date();

    const isToday =
      messageDate.toDateString() === today.toDateString();

    if (isToday) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return messageDate.toLocaleDateString([], {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <aside className="flex h-full min-h-0 w-full flex-col
      overflow-hidden border-r border-white/[0.08]
      bg-[#080B12] text-white">

      {/* SIDEBAR HEADER */}
      <div className="flex h-[76px] shrink-0 items-center
        border-b border-white/[0.08] bg-[#0D111B] px-5">

        <div>
          <h2 className="text-xl font-semibold tracking-tight
            text-white">
            Messages
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Your project conversations
          </p>
        </div>

        <div className="ml-auto flex h-8 min-w-8 items-center
          justify-center rounded-full border border-white/[0.08]
          bg-[#171F2D] px-2 text-xs font-medium text-slate-300">
          {conversations.length}
        </div>
      </div>

      {/* CONVERSATION LIST */}
      <div className="min-h-0 flex-1 overflow-y-auto
        bg-[#080B12] p-2">

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full
              border-2 border-slate-700 border-t-blue-500" />
          </div>
        ) : error ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center
            justify-center px-5 py-16 text-center">

            <div className="mb-4 flex h-14 w-14 items-center
              justify-center rounded-2xl border border-white/[0.08]
              bg-[#141B28] text-2xl">
              💬
            </div>

            <h3 className="text-sm font-semibold text-white">
              No conversations yet
            </h3>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Once a bid is accepted, your project conversations
              will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {conversations.map((conversation) => {
              const otherUser = getOtherUser(conversation);
              const latestMessage = conversation.messages?.[0];

              const isActive =
                pathname === `/chat/${conversation.id}`;

              return (
                <Link
                  key={conversation.id}
                  href={`/chat/${conversation.id}`}
                  className={`group relative flex items-center
                    gap-3 overflow-hidden rounded-xl p-3
                    transition-all duration-200 ${
                      isActive
                        ? "border border-blue-500/20 bg-[#17243A]"
                        : "border border-transparent hover:border-white/[0.06] hover:bg-[#131B29]"
                    }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute bottom-3 left-0
                      top-3 w-[3px] rounded-r-full bg-blue-500" />
                  )}

                  {/* PROFILE IMAGE */}
                  <div className="relative h-12 w-12 shrink-0">
                    <div className="flex h-full w-full
                      items-center justify-center overflow-hidden
                      rounded-full border border-white/10
                      bg-gradient-to-br from-blue-500 to-indigo-700
                      text-sm font-bold text-white">

                      {otherUser?.picture ? (
                        <img
                          src={otherUser.picture}
                          alt={otherUser.name || "User"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        getInitials(otherUser?.name)
                      )}
                    </div>
                  </div>

                  {/* USER AND MESSAGE DETAILS */}
                  <div className="min-w-0 flex-1">

                    {/* Name and time */}
                    <div className="flex items-center
                      justify-between gap-2">

                      <h3 className={`truncate text-sm font-semibold ${
                        isActive
                          ? "text-white"
                          : "text-slate-200 group-hover:text-white"
                      }`}>
                        {otherUser?.name || "Unknown User"}
                      </h3>

                      <span className="shrink-0 text-[10px]
                        text-slate-500">
                        {formatTime(
                          latestMessage?.createdAt ||
                          conversation.updatedAt
                        )}
                      </span>
                    </div>

                    {/* Project title */}
                    <p className="mt-1 truncate text-xs
                      text-slate-400">
                      {conversation.job?.title ||
                        "Project Discussion"}
                    </p>

                    {/* Latest message */}
                    <p className={`mt-1 truncate text-xs ${
                      isActive
                        ? "text-blue-300"
                        : "text-slate-500"
                    }`}>
                      {latestMessage
                        ? `${
                            latestMessage.senderId === currentUserId
                              ? "You: "
                              : ""
                          }${latestMessage.text}`
                        : "Start a conversation"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* SIDEBAR FOOTER */}
      <div className="shrink-0 border-t border-white/[0.07]
        bg-[#0D111B] px-4 py-3">

        <p className="text-center text-[10px]
          tracking-wide text-slate-600">
          FREELANCER MESSAGING
        </p>
      </div>
    </aside>
  );
}
