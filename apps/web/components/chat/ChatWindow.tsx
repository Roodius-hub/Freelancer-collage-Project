
"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/axios";
import { ChatMessage, Conversation } from "@/Types/chat";
import { useWebSocket } from "@/context/WebSocketContext";

interface Props {
  conversationId: string;
  currentUserId: string;
}

export default function ChatWindow({
  conversationId,
  currentUserId,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversation, setConversation] =
    useState<Conversation | null>(null);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const { sendMessage, subscribe, isConnected } = useWebSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Join conversation when WebSocket is connected
  useEffect(() => {
    if (!isConnected || loading) return;
  
    sendMessage({
      type: "join_conversation",
      payload: { conversationId },
    });
  
    return () => {
      sendMessage({
        type: "leave_conversation",
        payload: { conversationId },
      });
    };
  }, [conversationId, isConnected, loading, sendMessage]);
      
    
  // Load conversation and messages
  useEffect(() => {
    const fetchChat = async () => {
      try {
        setLoading(true);
        setError("");

        const [messageResponse, conversationResponse] =
          await Promise.all([
            api.get(`/conversations/${conversationId}/messages`),
            api.get("/conversations"),  
          ]);

        setMessages(messageResponse.data.messages || []);

        const currentConversation =
          conversationResponse.data.conversations.find(
            (item: Conversation) => item.id === conversationId
          );

        setConversation(currentConversation || null);
      } catch (err) {
        console.error("Failed to load chat:", err);
        setError("Unable to load this conversation.");
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [conversationId]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Send message
  const handleSendMessage = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const messageText = text.trim();

    if (!messageText || sending) return;

    try {
      setSending(true);
      setError("");

      const response = await api.post(
        `/conversations/${conversationId}/messages`,
        { text: messageText }
      );

      setMessages((previous) => [
        ...previous,
        response.data.newMessage,
      ]);

      setText("");
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Message could not be sent. Please try again.");
    } finally {
      setSending(false);
    }
  };

  // Identify other participant
  const otherUser = conversation
    ? conversation.clientId === currentUserId
      ? conversation.freelancer
      : conversation.client
    : null;

  const initials =
    otherUser?.name
      ?.split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden
      bg-[#090D16] text-slate-100">

      {/* HEADER */}
      <header className="relative z-10 flex shrink-0 items-center
        gap-4 border-b border-white/[0.07]
        bg-[#101725] px-5 py-4">

        {/* Profile */}
        <div className="relative h-12 w-12 shrink-0">
          <div className="flex h-full w-full items-center
            justify-center overflow-hidden rounded-full
            border border-white/10 bg-blue-600
            text-base font-bold text-white">

            {otherUser?.picture ? (
              <img
                src={otherUser.picture}
                alt={otherUser.name || "User"}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          <span className="absolute bottom-0 right-0 h-3 w-3
            rounded-full border-2 border-[#101725]
            bg-emerald-500"
          />
        </div>

        {/* User details */}
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-white">
            {otherUser?.name || "Conversation"}
          </h2>

          <p className="mt-1 truncate text-xs text-slate-400">
            {conversation?.job?.title || "Project Discussion"}
          </p>
        </div>

        {/* More options */}
        <button
          type="button"
          title="More options"
          className="flex h-10 w-10 shrink-0 items-center
            justify-center rounded-full border border-white/10
            bg-white/[0.04] text-lg text-slate-400
            transition hover:bg-white/10 hover:text-white"
        >
          ⋯
        </button>
      </header>

      {/* MESSAGES AREA */}
      <main className="relative min-h-0 flex-1 overflow-y-auto
        bg-[#090D16] px-4 py-6 sm:px-6">

        <div className="relative z-10 mx-auto flex
          min-h-full max-w-4xl flex-col">

          {/* Conversation label */}
          {!loading && messages.length > 0 && (
            <div className="mb-8 flex justify-center">
              <span className="rounded-full border
                border-white/[0.08] bg-[#151D2B]
                px-4 py-1.5 text-[11px] font-medium
                tracking-wide text-slate-400">
                Conversation
              </span>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full
                border-2 border-slate-700 border-t-blue-500" />
            </div>
          ) : error && messages.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center
              justify-center text-center">

              <div className="mb-5 flex h-16 w-16 items-center
                justify-center rounded-2xl border border-white/[0.08]
                bg-[#151D2B] text-2xl">
                <span>💬</span>
              </div>

              <h3 className="text-base font-semibold text-white">
                Start a conversation
              </h3>

              <p className="mt-2 max-w-xs text-sm text-slate-400">
                Discuss project requirements, share updates
                and keep everything in one place.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {messages.map((message) => {
                const isOwnMessage =
                  message.senderId === currentUserId;

                return (
                  <div
                    key={message.id}
                    className={`flex w-full ${
                      isOwnMessage
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div className={`flex max-w-[85%] flex-col
                      sm:max-w-[70%] ${
                        isOwnMessage
                          ? "items-end"
                          : "items-start"
                      }`}>

                      {/* Sender */}
                      {!isOwnMessage && (
                        <span className="mb-1.5 ml-1 text-[11px]
                          font-medium text-slate-400">
                          {message.sender?.name || otherUser?.name}
                        </span>
                      )}

                      {/* Message bubble */}
                      <div className={`rounded-2xl px-4 py-3
                        shadow-lg ${
                          isOwnMessage
                            ? "rounded-br-md bg-blue-600 text-white"
                            : "rounded-bl-md border border-white/[0.08] bg-[#182233] text-slate-100"
                        }`}>
                        <p className="whitespace-pre-wrap break-words
                          text-sm leading-6">
                          {message.text}
                        </p>

                        <div className={`mt-1.5 text-[10px] ${
                          isOwnMessage
                            ? "text-blue-100/75"
                            : "text-slate-500"
                        }`}>
                          {formatTime(message.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* ERROR MESSAGE */}
      {error && !loading && messages.length > 0 && (
        <div className="bg-[#101725] px-5 pt-2">
          <p className="text-center text-xs text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* MESSAGE COMPOSER */}
      <footer className="relative z-10 shrink-0
        border-t border-white/[0.07] bg-[#101725]
        px-4 py-4 sm:px-6">

        <form
          onSubmit={handleSendMessage}
          className="mx-auto max-w-4xl"
        >
          <div className="flex items-center gap-3
            rounded-2xl border border-white/[0.09]
            bg-[#182233] p-2 transition
            focus-within:border-blue-500/50
            focus-within:ring-2 focus-within:ring-blue-500/10">

            <input
              type="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Write a message..."
              disabled={sending}
              className="min-w-0 flex-1 bg-transparent
                px-3 py-2.5 text-sm text-white
                outline-none placeholder:text-slate-500
                disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!text.trim() || sending}
              className="flex shrink-0 items-center gap-2
                rounded-xl bg-blue-600 px-5 py-3
                text-sm font-semibold text-white
                transition hover:bg-blue-500
                disabled:cursor-not-allowed
                disabled:bg-slate-700 disabled:text-slate-400"
            >
              {sending ? (
                <>
                  <span className="h-4 w-4 animate-spin
                    rounded-full border-2 border-white/30
                    border-t-white" />
                  Sending
                </>
              ) : (
                <>
                  Send
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M22 2 11 13"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m22 2-7 20-4-9-9-4 20-7Z"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>

          <p className="mt-3 text-center text-[11px]
            text-slate-600">
            Keep your project communication professional.
          </p>
        </form>
      </footer>
    </div>
  );
}
