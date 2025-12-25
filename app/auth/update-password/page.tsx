'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

const BRAND = '#1F6FB2';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  // Зарим тохиолдолд link-ээр ирэхэд session үүсээгүй байж болно.
  // Тэгэхээр энэ page өөрөө байх нь хамгийн чухал.
  useEffect(() => {
    // optional: энд ямар нэг шалгалт хийх шаардлагагүй, UI гаргаад updateUser л хийхэд хангалттай.
  }, []);

  const onUpdate = async () => {
    setErr(null);
    setOk(null);

    if (!pw1 || pw1.length < 6) return setErr('Нууц үг хамгийн багадаа 6 тэмдэгт байг.');
    if (pw1 !== pw2) return setErr('Нууц үг 2 талдаа адил биш байна.');

    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pw1 });
      if (error) throw error;

      setOk('Амжилттай шинэчиллээ ✅ Одоо login хийнэ.');
      // шинэ нууц үг тавигдсаны дараа login руу явуулчих
      setTimeout(() => router.replace('/login'), 600);
    } catch (e: any) {
      setErr(e?.message || 'Алдаа гарлаа');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0b1a2a', color: 'white' }}>
      <div style={{ width: 'min(520px, 92vw)', borderRadius: 18, padding: 22, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
        <h2 style={{ margin: 0, marginBottom: 14 }}>Шинэ нууц үг</h2>

        <label style={{ display: 'block', opacity: 0.9, marginBottom: 6 }}>New password</label>
        <input value={pw1} onChange={(e) => setPw1(e.target.value)} style={inputStyle} type="password" />

        <label style={{ display: 'block', opacity: 0.9, margin: '12px 0 6px' }}>Repeat password</label>
        <input value={pw2} onChange={(e) => setPw2(e.target.value)} style={inputStyle} type="password" />

        {err && <div style={{ marginTop: 10, color: '#ffb4b4', fontSize: 13 }}>{err}</div>}
        {ok && <div style={{ marginTop: 10, color: '#b7ffcf', fontSize: 13 }}>{ok}</div>}

        <button onClick={onUpdate} disabled={busy} style={{ ...btnStyle, marginTop: 14, background: BRAND }}>
          {busy ? '...' : 'Нууц үг шинэчлэх'}
        </button>

        <button onClick={() => router.replace('/login')} style={{ ...btnStyle, marginTop: 10, background: 'transparent' }}>
          Login руу буцах
        </button>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 12px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.18)',
  background: 'rgba(0,0,0,0.18)',
  color: 'white',
  outline: 'none',
};

const btnStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.18)',
  color: 'white',
  fontWeight: 700,
  cursor: 'pointer',
};
