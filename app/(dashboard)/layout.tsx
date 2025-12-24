'use client';

import type { ReactNode } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';

import routes from '@/routes';
import Sidebar from '@/components/sidebar/Sidebar';
import Navbar from '@/components/navbar/NavbarAdmin';
import Footer from '@/components/footer/FooterAdmin';
import { getActiveRoute, getActiveNavbar } from '@/utils/navigation';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Chat дээр Navbar/Footer нуух (Sidebar бол үлдээнэ)
  const isChat = pathname?.startsWith('/chat');

  return (
    <Flex minH="100dvh" w="100%">
      {/* Sidebar */}
      <Box display={{ base: 'none', xl: 'block' }} w="290px" flexShrink={0}>
        <Sidebar routes={routes ?? []} />
      </Box>

      {/* Main column */}
      <Flex direction="column" flex="1" minW="0" minH="100dvh">
        {!isChat && (
          <Box position="sticky" top="0" zIndex={10}>
            <Navbar
              logoText="oyunsanaa"
              brandText={getActiveRoute(routes, pathname)}
              secondary={getActiveNavbar(routes, pathname)}
            />
          </Box>
        )}

        {/* Content (энэ хэсэг chat-ийн sticky input, scroll-ыг эвдэхгүй) */}
        <Box flex="1" minH="0">
          {children}
        </Box>

        {!isChat && <Footer />}
      </Flex>
    </Flex>
  );
}
