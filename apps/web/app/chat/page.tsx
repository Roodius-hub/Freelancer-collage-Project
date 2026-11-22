
import ConversationList from "@/components/chat/ConversationList";

export default function ChatPage() {
  return (
    <main className="mx-auto h-[calc(100vh-80px)] max-w-7xl overflow-hidden rounded-xl border">
      <ConversationList />
    </main>
  );
}
