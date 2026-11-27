
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  HomeIcon,
  Upload,
  MessageCircle,
  ChevronRight,
  X,
  FolderKanban
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useWebSocket } from "@/context/WebSocketContext";
import Logosvg from "@/public/logo";
import UserMenu from "@/lib/Usermenu";
import api from "@/lib/axios";
import { Conversation } from "@/types/chat";
import { NotificationButton } from "../notifications/NotificationButton";

export function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [showMessages, setShowMessages] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const { subscribe, isConnected } = useWebSocket();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentUserId = session?.user?.id;
  const userRole = session?.user?.role;

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      setLoadingMessages(true);

      const response = await api.get("/conversations");

      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && currentUserId) {
      fetchConversations();
    }
  }, [status, currentUserId]);

  // Listen for real-time message notifications
  useEffect(() => {
    if (status !== "authenticated") return;

    const unsubscribe = subscribe((event) => {
      if (event.type === "message_notification") {
        console.log("New message notification:", event.payload);

        // Refresh conversations with the latest backend data
        fetchConversations();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [status, subscribe]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowMessages(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getOtherUser = (conversation: Conversation) => {
    return conversation.clientId === currentUserId
      ? conversation.freelancer
      : conversation.client;
  };

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

  const formatTime = (date?: string) => {
    if (!date) return "";

    const messageDate = new Date(date);

    if (Number.isNaN(messageDate.getTime())) return "";

    const today = new Date();

    if (messageDate.toDateString() === today.toDateString()) {
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

  // Count conversations with an unread latest message.
  // This is a conversation count, not a total unread-message count.
  const unreadCount = conversations.filter((conversation) => {
    const latestMessage = conversation.messages?.[0];

    return (
      latestMessage &&
      latestMessage.senderId !== currentUserId &&
      !latestMessage.isRead
    );
  }).length;

  if (status === "loading") return null;

  return (
    <nav className="bgfixed top-0 left-0 w-full z-50 bg-black border-b border-[#1f1f1f]">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between p-[0.5]">

        {/* LOGO */}
        <div
          className="flex cursor-pointer items-center"
          onClick={() => router.push("/")}
        >
          <Logosvg className="scale-75" />
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3">

          {/* POST JOB */}
          {userRole === "CLIENT" && (
            <button
              type="button"
              onClick={() => router.push("/postjob")}
              className="flex items-center gap-2 rounded-lg
                border border-[#2a2a2a] bg-[#1a1a1a]
                px-4 py-2 text-xs text-white transition
                hover:bg-[#6366F1]"
            >
              <Upload className="size-4" />
              Post Job
            </button>
          )}
          {/* MY POSTED JOBS */}
          {userRole === "CLIENT" && (
            <button
              type="button"
              onClick={() => router.push("/client/jobs")}
              className="flex items-center gap-2 rounded-lg
      border border-[#2a2a2a] bg-[#1a1a1a]
      px-4 py-2 text-xs text-white transition
      hover:bg-[#6366F1]"
            >
              <FolderKanban className="size-4" />
              My Posted Jobs
            </button>
          )}
          {/* HOME */}
          {/* <button
            type="button"
            onClick={() => router.push("/")}
            className="flex items-center gap-2 rounded-lg
              border border-[#2a2a2a] bg-[#1a1a1a]
              px-4 py-2 text-xs text-white transition
              hover:bg-[#6366F1]"
          >
            <HomeIcon className="size-4" />
            Home
          </button> */}

          {/* JOBS */}
          {/* <button
            type="button"
            onClick={() => router.push("/jobs")}
            className="flex items-center gap-2 rounded-lg
              border border-[#2a2a2a] bg-[#1a1a1a]
              px-4 py-2 text-xs text-white transition
              hover:bg-[#6366F1]"
          >
            <Briefcase className="size-4" />
            Jobs
          </button> */}

          {/* MESSAGES DROPDOWN */}
          <div className="relative" ref={dropdownRef}>

            <button
              type="button"
              onClick={() => {
                setShowMessages((previous) => !previous);
                if (!showMessages) fetchConversations();
              }}
              className={`relative flex items-center gap-2
                rounded-lg border px-4 py-2 text-xs
                transition ${showMessages
                  ? "border-blue-500/40 bg-blue-600/20 text-blue-400"
                  : "border-[#2a2a2a] bg-[#1a1a1a] text-white hover:bg-[#262626]"
                }`}
            >

              <MessageCircle className="size-4" />
              Messages
              {isConnected ? (
                <span className="h-2 w-2 rounded-full bg-green-500" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-red-500" />
              )}
              {unreadCount > 0 && (
                <span className="absolute -right-2 -top-2
                  flex h-5 min-w-5 items-center justify-center
                  rounded-full border-2 border-black
                  bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* DROPDOWN */}
            {showMessages && (
              <div className="absolute right-0 top-full z-[100]
                mt-3 w-[360px] overflow-hidden rounded-xl
                border border-white/10 bg-[#0D111B]
                shadow-2xl shadow-black/50">

                {/* Dropdown Header */}
                <div className="flex items-center justify-between
                  border-b border-white/[0.08] px-4 py-4">

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Messages
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Your recent conversations
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowMessages(false)}
                    className="rounded-lg p-2 text-slate-400
                      transition hover:bg-white/10 hover:text-white"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {/* Conversations */}
                <div className="max-h-[380px] overflow-y-auto p-2">

                  {loadingMessages ? (
                    <div className="flex h-32 items-center
                      justify-center">
                      <div className="h-6 w-6 animate-spin
                        rounded-full border-2 border-slate-700
                        border-t-blue-500" />
                    </div>
                  ) : conversations.length === 0 ? (
                    <div className="flex flex-col items-center
                      justify-center px-4 py-10 text-center">

                      <MessageCircle className="mb-3 size-9
                        text-slate-600" />

                      <p className="text-sm font-medium text-white">
                        No conversations yet
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Your accepted project conversations
                        will appear here.
                      </p>
                    </div>
                  ) : (
                    conversations.slice(0, 6).map((conversation) => {
                      const otherUser = getOtherUser(conversation);
                      const latestMessage = conversation.messages?.[0];

                      const isUnread =
                        latestMessage &&
                        latestMessage.senderId !== currentUserId &&
                        !latestMessage.isRead;

                      return (
                        <button
                          type="button"
                          key={conversation.id}
                          onClick={() => {
                            setShowMessages(false);
                            router.push(`/chat/${conversation.id}`);
                          }}
                          className="flex w-full items-center gap-3
                            rounded-lg p-3 text-left transition
                            hover:bg-white/[0.06]"
                        >

                          {/* Profile */}
                          <div className="relative h-11 w-11 shrink-0">
                            <div className="flex h-full w-full
                              items-center justify-center
                              overflow-hidden rounded-full
                              border border-white/10
                              bg-gradient-to-br from-blue-500
                              to-indigo-700 text-xs font-bold text-white">

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

                            {isUnread && (
                              <span className="absolute -right-0.5
                                -top-0.5 h-3 w-3 rounded-full
                                border-2 border-[#0D111B]
                                bg-blue-500" />
                            )}
                          </div>

                          {/* Details */}
                          <div className="min-w-0 flex-1">

                            <div className="flex items-center
                              justify-between gap-2">

                              <p className="truncate text-sm
                                font-semibold text-slate-100">
                                {otherUser?.name || "Unknown User"}
                              </p>

                              <span className="shrink-0 text-[10px]
                                text-slate-500">
                                {formatTime(
                                  latestMessage?.createdAt ||
                                  conversation.updatedAt
                                )}
                              </span>
                            </div>

                            <p className="mt-1 truncate text-[11px]
                              text-slate-400">
                              {conversation.job?.title ||
                                "Project Discussion"}
                            </p>

                            <p className={`mt-1 truncate text-xs ${isUnread
                                ? "font-medium text-white"
                                : "text-slate-500"
                              }`}>
                              {latestMessage
                                ? `${latestMessage.senderId === currentUserId
                                  ? "You: "
                                  : ""
                                }${latestMessage.text}`
                                : "Start a conversation"}
                            </p>
                          </div>

                          <ChevronRight className="size-4
                            shrink-0 text-slate-600" />
                        </button>
                      );
                    })
                  )}
                </div>

                {/* View All */}
                <div className="border-t border-white/[0.08] p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMessages(false);
                      router.push("/chat");
                    }}
                    className="w-full rounded-lg py-3 text-center
                      text-xs font-semibold text-blue-400
                      transition hover:bg-blue-500/10 hover:text-blue-300"
                  >
                    View all messages
                    <ChevronRight className="ml-1 inline size-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* NOTIFICATIONS */}
          <NotificationButton />

          {/* USER MENU */}
          <div className="cursor-pointer text-sm">
            <UserMenu />
          </div>

        </div>
      </div>
    </nav>
  );
}
