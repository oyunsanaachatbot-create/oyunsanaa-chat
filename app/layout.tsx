// app/layout.tsx
import type { ReactNode } from 'react';
import AppWrappers from './AppWrappers';

export const metadata = {
  title: 'oyunsanaa',
  description: 'oyunsanaa app',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body id="root">
        <AppWrappers>{children}</AppWrappers>
      </body>
    </html>
  );
}
