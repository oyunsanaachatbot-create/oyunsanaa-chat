'use client';

import React, { ReactNode } from 'react';
import { Box, Portal, useDisclosure } from '@chakra-ui/react';
import routes from '@/routes';
import Sidebar from '@/components/sidebar/Sidebar';
import Footer from '@/components/footer/FooterAdmin';
import Navbar from '@/components/navbar/NavbarAdmin';
import { getActiveRoute, getActiveNavbar } from '@/utils/navigation';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { onOpen } = useDisclosure();

  const hideFooter = pathname?.startsWith('/chat');

  return (
    <Box>
      {/* ✅ setApiKey бүү дамжуул (SideBar чинь ихэнхдээ хэрэглэхгүй, алдаа үүсгэдэг) */}
      <Sidebar routes={routes ?? []} />

      <Box
        pt={{ base: '60px', md: '100px' }}
        float="right"
        minH="100dvh"
        h="100dvh"
        overflow="hidden"
        position="relative"
        w={{ base: '100%', xl: 'calc(100% - 290px)' }}
        maxW={{ base: '100%', xl: 'calc(100% - 290px)' }}
      >
        <Portal>
          <Box>
            <Navbar
              onOpen={onOpen}
              logoText={'oyunsanaa'}
              brandText={getActiveRoute(routes, pathname)}
              secondary={getActiveNavbar(routes, pathname)}
            />
          </Box>
        </Portal>

        {/* ✅ ганц scroll энд */}
        <Box
          mx="auto"
          p={{ base: '20px', md: '30px' }}
          pe="20px"
          pt="50px"
          h="calc(100dvh - 80px)"
          overflowY="auto"
        >
          {children}

          {!hideFooter && (
            <Box>
              <Footer />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
