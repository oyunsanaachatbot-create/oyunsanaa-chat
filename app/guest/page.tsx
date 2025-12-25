import { redirect } from 'next/navigation';

export default function GuestPage() {
  // ✅ Чиний бүтэн чат яг аль route дээр гардаг вэ — тэрийг энд тавина.
  // Ихэнхдээ /chat байдаг.
  redirect('/chat?mode=guest');
}
