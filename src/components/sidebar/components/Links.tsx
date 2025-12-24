'use client';
/* eslint-disable */

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Flex,
  HStack,
  Icon,
  List,
  ListItem,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MENU_CONFIG } from '@/config/menu.config';
import { useEffect, useRef, useState } from 'react';

export default function Links() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const brand = '#1F6FB2';

  const activeText = useColorModeValue('navy.700', 'white');
  const inactiveText = useColorModeValue('gray.600', 'gray.400');
  const divider = useColorModeValue('gray.200', 'whiteAlpha.200');

  // ✅ зөвхөн эхний group нээлттэй
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);

  // ✅ sidebar-ийн хоосон газар дарвал бүгд хаагдана
  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;

      // Sidebar menu дотор click болсон эсэх
      const clickedInside = el.contains(e.target as Node);
      if (!clickedInside) return;

      // AccordionButton эсвэл link дээр дарсан бол хаахгүй (toggle эсвэл nav хийх ёстой)
      const target = e.target as HTMLElement;
      const isHeaderClick = !!target.closest('[data-acc-btn="1"]');
      const isLinkClick = !!target.closest('a');

      if (!isHeaderClick && !isLinkClick) {
        setOpenIndexes([]); // бүгд хаах
      }
    };

    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, []);

  return (
    <Box ref={containerRef}>
      <Accordion
        allowMultiple
        index={openIndexes}
        onChange={(v) => setOpenIndexes(Array.isArray(v) ? v : [v])}
      >
        {MENU_CONFIG.map((group, idx) => {
          const GroupIcon = group.icon;

          return (
            <AccordionItem key={group.id} border="none" pb="8px">
              <AccordionButton
                data-acc-btn="1"
                px="12px"
                py="10px"
                borderRadius="12px"
                _hover={{ bg: useColorModeValue('gray.50', 'whiteAlpha.100') }}
                _focus={{ boxShadow: 'none' }}
              >
                <Flex w="100%" align="center" justify="space-between">
                  <HStack spacing="10px">
                    <Box color={brand}>
                      <Icon as={GroupIcon} w="18px" h="18px" />
                    </Box>
                    <Text fontWeight="700" fontSize="sm" color={activeText}>
                      {group.label}
                    </Text>
                  </HStack>
                  <AccordionIcon />
                </Flex>
              </AccordionButton>

              <AccordionPanel px="0px" pt="8px" pb="6px">
                <List
                  spacing="6px"
                  borderLeft="1px solid"
                  borderColor={divider}
                  ms="18px"
                  ps="12px"
                >
                  {group.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      pathname?.startsWith(item.href + '/');

                    return (
                      <ListItem key={item.id}>
                        <Box
                          as={Link}
                          href={item.href}
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          px="10px"
                          py="8px"
                          borderRadius="10px"
                          textDecoration="none"
                          _hover={{
                            textDecoration: 'none',
                            bg: useColorModeValue('gray.50', 'whiteAlpha.100'),
                          }}
                          bg={
                            isActive
                              ? useColorModeValue('gray.100', 'whiteAlpha.200')
                              : 'transparent'
                          }
                        >
                          <Text
                            fontSize="sm"
                            fontWeight={isActive || item.isApp ? '700' : '500'}
                            color={
                              item.isApp
                                ? brand
                                : isActive
                                ? activeText
                                : inactiveText
                            }
                          >
                            {item.label}
                          </Text>

                          {item.isApp ? (
                            <Badge
                              borderRadius="999px"
                              px="8px"
                              py="2px"
                              fontSize="10px"
                              bg={brand}
                              color="white"
                              textTransform="none"
                            >
                              APP
                            </Badge>
                          ) : null}
                        </Box>
                      </ListItem>
                    );
                  })}
                </List>
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Box>
  );
}
