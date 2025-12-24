'use client';

import type { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      minH="100dvh"
      overflow="hidden"
      // Sidebar/Footer байхгүй учраас chat stable болно
    >
      {children}
    </Box>
  );
}
