
"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

import ConversationList from "@/components/chat/ConversationList";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ConversationPage() {
  const params = useParams<{ conversationId: string }>();
  const { data: session, status } = useSession();

  const conversationId = params.conversationId;
  const currentUserId = session?.user?.id;

  if (status === "loading") {
    return <div className="p-6">Loading session...</div>;
  }

  if (!currentUserId) {
    return <div className="p-6">Please sign in to access chat.</div>;
  }

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-[#090D16] p-1">
      <div className="flex h-full min-h-0 w-full overflow-hidden
        rounded-xl border border-white/10">
    
        {/* Sidebar */}
        <div className="w-[280px] shrink-0 overflow-hidden">
          <ConversationList />
        </div>
    
        {/* Chat */}
        <div className="min-w-0 flex-1 overflow-hidden">
          <ChatWindow
            conversationId={conversationId}
            currentUserId={currentUserId}
          />
        </div>
    
      </div>
    </div>
  );
}
