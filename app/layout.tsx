'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import { Box, Portal, useDisclosure, Flex } from '@chakra-ui/react';
import routes from '@/routes';
import Sidebar from '@/components/sidebar/Sidebar';
import Footer from '@/components/footer/FooterAdmin';
import Navbar from '@/components/navbar/NavbarAdmin';
import { getActiveRoute, getActiveNavbar } from '@/utils/navigation';
import { usePathname } from 'next/navigation';
import '@/styles/App.css';
import '@/styles/Contact.css';
import '@/styles/Plugins.css';
import '@/styles/MiniCalendar.css';
import AppWrappers from './AppWrappers';

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [apiKey, setApiKey] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const initialKey = localStorage.getItem('apiKey');
    if (initialKey?.includes('sk-') && apiKey !== initialKey) {
      setApiKey(initialKey);
    }
  }, [apiKey]);

  const isAuthPage =
    pathname?.includes('register') || pathname?.includes('sign-in');

  return (
    <html lang="en">
      <body id="root">
        <AppWrappers>
          {isAuthPage ? (
            children
          ) : (
            // ✅ хамгийн чухал: root container нь 100vh + overflow hidden
            <Flex w="100%" h="100vh" overflow="hidden">
              <Sidebar setApiKey={setApiKey} routes={routes} />

              {/* ✅ Right content area: sidebar-тай мөргөлдөхгүй, дангаараа scroll */}
              <Flex
                direction="column"
                w={{ base: '100%', xl: 'calc(100% - 290px)' }}
                maxW={{ base: '100%', xl: 'calc(100% - 290px)' }}
                ms={{ base: 0, xl: '290px' }} // ✅ float биш, margin-left
                position="relative"
                minH="0"
              >
                {/* Navbar Portal хэвээр */}
                <Portal>
                  <Box>
                    <Navbar
                      setApiKey={setApiKey}
                      onOpen={onOpen}
                      logoText={'Horizon UI Dashboard PRO'}
                      brandText={getActiveRoute(routes, pathname)}
                      secondary={getActiveNavbar(routes, pathname)}
                    />
                  </Box>
                </Portal>

                {/* ✅ Scroll container (Navbar-ийн зайг pt-ээр өгнө) */}
                <Box
                  pt={{ base: '60px', md: '100px' }}
                  flex="1"
                  minH="0"
                  overflowY="auto"
                  overflowX="hidden"
                  // iOS дээр scroll жигд болгоно
                  sx={{ WebkitOverflowScrolling: 'touch' }}
                >
                  {/* Content */}
                  <Box
                    mx="auto"
                    p={{ base: '20px', md: '30px' }}
                    pe="20px"
                    pt="50px"
                    minH="0"
                  >
                    {children}
                  </Box>

                  {/* Footer */}
                  <Box>
                    <Footer />
                  </Box>
                </Box>
              </Flex>
            </Flex>
          )}
        </AppWrappers>
      </body>
    </html>
  );
}
