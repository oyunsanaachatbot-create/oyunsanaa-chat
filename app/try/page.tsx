// app/try/page.tsx
'use client';

import ChatUI from '@/components/ChatUI'; // танай жинхэнэ чатны component-ын нэр/замыг тавина

export default function TryPage() {
  return <ChatUI mode="guest" />; // mode байхгүй бол зүгээр <ChatUI />
}
