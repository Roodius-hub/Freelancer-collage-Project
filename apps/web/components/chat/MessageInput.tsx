
"use client";

import { useState, FormEvent } from "react";

interface Props {
  onSend: (text: string) => Promise<void>;
  disabled?: boolean;
}

export default function MessageInput({
  onSend,
  disabled = false,
}: Props) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const message = text.trim();

    if (!message || sending || disabled) return;

    try {
      setSending(true);
      await onSend(message);
      setText("");
    } catch (error) {
      console.error("Message sending failed:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 border-t p-4"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a message..."
        disabled={disabled || sending}
        className="flex-1 rounded-full border px-4 py-3 outline-none focus:border-blue-500"
      />

      <button
        type="submit"
        disabled={!text.trim() || sending || disabled}
        className="rounded-full bg-blue-600 px-6 py-3 text-white disabled:opacity-50"
      >
        {sending ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
