
import ChatPage from "../(dashboard)/chat/page";

export default function GuestPage() {
  // @ts-expect-error - existing page reuse
  return <ChatPage guest />;
}
