'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

// энд чинь хуучин login UI component-оо import хийнэ
// import LoginForm from '@/components/auth/LoginForm';

export default function LoginClient() {
  const sp = useSearchParams();

  const next = useMemo(() => sp.get('next') || '/chat', [sp]);

  // LoginForm руу next дамжуулах бол:
  // return <LoginForm next={next} />;

  return (
    <div style={{ padding: 24 }}>
      {/* энд existing login UI-гаа render хий */}
      Login UI here. next = {next}
    </div>
  );
}
