'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import { ChakraProvider, Box, Portal, Flex, useDisclosure, ColorModeScript } from '@chakra-ui/react';
import theme from '@/theme/theme';
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
  const { onOpen } = useDisclosure();

  useEffect(() => {
    const initialKey = localStorage.getItem('apiKey');
    if (initialKey?.includes('sk-') && apiKey !== initialKey) setApiKey(initialKey);
  }, [apiKey]);

  const isAuthPage = pathname?.includes('register') || pathname?.includes('sign-in');

  return (
    <html lang="en" suppressHydrationWarning>
      <body id="root">
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={(theme as any).config?.initialColorMode} />
          <AppWrappers>
            {isAuthPage ? (
              children
            ) : (
              // ✅ Root container: нэг л дэлгэц, body scroll үгүй
              <Flex w="100%" h="100vh" overflow="hidden">
                {/* Sidebar */}
                <Box w={{ base: '0px', xl: '290px' }} flexShrink={0}>
                  <Sidebar setApiKey={setApiKey} routes={routes} />
                </Box>

                {/* Right area */}
                <Flex direction="column" flex="1" minW={0} position="relative">
                  {/* Navbar */}
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

                  {/* ✅ Only this scrolls */}
                  <Box
                    pt={{ base: '60px', md: '100px' }}
                    flex="1"
                    minH={0}
                    overflowY="auto"
                    overflowX="hidden"
                    sx={{ WebkitOverflowScrolling: 'touch' }}
                  >
                    <Box mx="auto" p={{ base: '20px', md: '30px' }} pe="20px" pt="50px">
                      {children}
                    </Box>
                    <Footer />
                  </Box>
                </Flex>
              </Flex>
            )}
          </AppWrappers>
        </ChakraProvider>
      </body>
    </html>
  );
}
