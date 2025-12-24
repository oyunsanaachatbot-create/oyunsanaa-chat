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
  Link as ChakraLink,
  List,
  ListItem,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { MENU_CONFIG } from '@/config/menu.config';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function Links() {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement | null>(null);

  const brand = '#1F6FB2';

  const activeText = useColorModeValue('navy.700', 'white');
  const inactiveText = useColorModeValue('gray.600', 'gray.400');
  const divider = useColorModeValue('gray.200', 'whiteAlpha.200');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');
  const activeBg = useColorModeValue('gray.100', 'whiteAlpha.200');

  // ✅ бүгд хаалттай эхэлнэ
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const setFromChakra = (v: number | number[]) => {
    const arr = Array.isArray(v) ? v : [v];
    setOpenIndexes(arr.filter((n) => typeof n === 'number'));
  };

  // ✅ sidebar/menu хэсгээс гадуур дарвал бүгд хаах
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const el = rootRef.current;
      const target = e.target as Node | null;
      if (!el || !target) return;

      if (!el.contains(target)) setOpenIndexes([]);
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const openSet = useMemo(() => new Set(openIndexes), [openIndexes]);

  return (
    <Box ref={rootRef} w="100%">
      <Accordion allowMultiple index={openIndexes} onChange={setFromChakra}>
        {MENU_CONFIG.map((group, idx) => {
          const GroupIcon = group.icon;
          const isOpen = openSet.has(idx);

          return (
            <AccordionItem key={group.id} border="none" pb="8px">
              <AccordionButton
                px="12px"
                py="10px"
                borderRadius="12px"
                _hover={{ bg: hoverBg }}
                _focus={{ boxShadow: 'none' }}
              >
                <Flex w="100%" align="center" justify="space-between">
                  <HStack spacing="10px">
                    <Box color={brand} opacity={isOpen ? 1 : 0.9}>
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
                      <ListItem key={`${group.id}-${item.id}`}>
                        <ChakraLink
                          as={NextLink}
                          href={item.href}
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          px="10px"
                          py="8px"
                          borderRadius="10px"
                          textDecoration="none"
                          _hover={{ textDecoration: 'none', bg: hoverBg }}
                          bg={isActive ? activeBg : 'transparent'}
                        >
                          <Text
                            fontSize="sm"
                            fontWeight={isActive || item.isApp ? '700' : '500'}
                            color={
                              item.isApp ? brand : isActive ? activeText : inactiveText
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
                        </ChakraLink>
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
