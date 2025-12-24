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

export default function Links() {
  const pathname = usePathname();

  const activeText = useColorModeValue('navy.700', 'white');
  const inactiveText = useColorModeValue('gray.600', 'gray.400');
  const groupIcon = useColorModeValue('gray.700', 'gray.200');
  const divider = useColorModeValue('gray.200', 'whiteAlpha.200');

  // ✅ brand өнгө
  const brand = '#1F6FB2';

  return (
    <Accordion allowMultiple defaultIndex={[0]}>
      {MENU_CONFIG.map((group) => {
        const GroupIcon = group.icon;

        return (
          <AccordionItem key={group.id} border="none" pb="8px">
            <AccordionButton
              px="12px"
              py="10px"
              borderRadius="12px"
              _hover={{ bg: useColorModeValue('gray.50', 'whiteAlpha.100') }}
              _focus={{ boxShadow: 'none' }}
            >
              <Flex w="100%" align="center" justify="space-between">
                <HStack spacing="10px">
                  <Box color={groupIcon}>
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
  );
}
