'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Recovery линкээр орж ирэхэд session URL-аас тогтох ёстой
  useEffect(() => {
    let alive = true;
    const run = async () => {
      // URL дээрх token-оос session үүссэн эсэхийг шалгана
      const { data } = await supabase.auth.getSession();
      if (!alive) return;

      if (!data.session) {
        setMsg('Recovery session олдсонгүй. Reset линкээ дахин нээгээрэй.');
      }
      setReady(true);
    };
    run();
    return () => {
      alive = false;
    };
  }, []);

  const onSet = async () => {
    setLoading(true);
    setMsg(null);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg('Нууц үг амжилттай солигдлоо ✅');
    // хүсвэл chat руу буцаана
    setTimeout(() => router.replace('/chat'), 600);
  };

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 16 }}>
      <h2>Нууц үг солих</h2>

      {!ready ? (
        <div>Loading...</div>
      ) : (
        <>
          <label style={{ display: 'block', marginTop: 12 }}>Шинэ нууц үг</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid rgba(0,0,0,0.2)' }}
          />

          <button
            onClick={onSet}
            disabled={loading || password.length < 6}
            style={{
              width: '100%',
              marginTop: 12,
              padding: 10,
              borderRadius: 10,
              border: '1px solid rgba(0,0,0,0.15)',
              cursor: 'pointer',
            }}
          >
            {loading ? 'Түр хүлээнэ үү...' : 'Солих'}
          </button>

          {msg && <div style={{ marginTop: 10, opacity: 0.85 }}>{msg}</div>}
        </>
      )}
    </div>
  );
}
