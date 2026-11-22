
"use client";

import { ChatMessage } from "@/types/chat";

interface Props {
  message: ChatMessage;
  currentUserId: string;
}

export default function MessageBubble({
  message,
  currentUserId,
}: Props) {
  const isOwnMessage = message.senderId === currentUserId;

  return (
    <div className={`mb-5 flex ${
      isOwnMessage ? "justify-end" : "justify-start"
    }`}>

      <div className={`max-w-[75%] sm:max-w-[65%] ${
        isOwnMessage ? "items-end" : "items-start"
      } flex flex-col`}>

        <div className={`rounded-2xl px-4 py-3 shadow-sm
          backdrop-blur-xl ${
            isOwnMessage
              ? "rounded-br-sm border border-blue-500/20 bg-blue-600/90 text-white shadow-blue-500/10"
              : "rounded-bl-sm border border-white/80 bg-white/65 text-slate-700 shadow-slate-300/20"
          }`}>

          <p className="whitespace-pre-wrap break-words text-sm leading-6">
            {message.text}
          </p>

        </div>

        <span className="mt-1.5 px-1 text-[10px] font-medium text-slate-400">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

      </div>
    </div>
  );
}
