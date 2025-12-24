'use client';
/* eslint-disable */

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  HStack,
  Text,
  List,
  Icon,
  ListItem,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaCircle } from 'react-icons/fa';
import NavLink from '@/components/link/NavLink';
import { IRoute } from '@/types/navigation';
import { PropsWithChildren, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface SidebarLinksProps extends PropsWithChildren {
  routes: IRoute[];
}

export function SidebarLinks(props: SidebarLinksProps) {
  const pathname = usePathname();

  // ✅ Хуучин theme-ийн өнгөнүүдийг ХӨНДӨХГҮЙ (яг хэвээр)
  let activeColor = useColorModeValue('navy.700', 'white');
  let inactiveColor = useColorModeValue('gray.500', 'gray.500');
  let activeIcon = useColorModeValue('brand.500', 'white');
  let gray = useColorModeValue('gray.500', 'gray.500');

  const { routes } = props;

  const activeRoute = useCallback(
    (routeName: string) => pathname?.includes(routeName),
    [pathname],
  );

  // ✅ Leaf link render (route.collapse биш)
  const renderLeaf = (route: IRoute, key: number) => {
    const href = route.layout ? route.layout + route.path : route.path;

    return (
      <Flex
        key={key}
        align="center"
        justifyContent="space-between"
        w="100%"
        maxW="100%"
        ps="17px"
        mb="0px"
      >
        <HStack
          w="100%"
          mb="14px"
          spacing={activeRoute(route.path.toLowerCase()) ? '22px' : '26px'}
        >
          <NavLink href={href} styles={{ width: '100%' }}>
            <Flex w="100%" alignItems="center" justifyContent="center">
              {route.icon ? (
                <Box
                  color={
                    activeRoute(route.path.toLowerCase())
                      ? activeIcon
                      : inactiveColor
                  }
                  me="12px"
                  mt="6px"
                >
                  {route.icon}
                </Box>
              ) : null}

              <Text
                me="auto"
                color={
                  activeRoute(route.path.toLowerCase()) ? activeColor : 'gray.500'
                }
                fontWeight="500"
                letterSpacing="0px"
                fontSize="sm"
              >
                {route.name}
              </Text>
            </Flex>
          </NavLink>
        </HStack>
      </Flex>
    );
  };

  // ✅ Secondary accordion links (bullet style) — одоогийн style-г хэвээр үлдээв
  const createAccordionLinks = (routes: IRoute[]) => {
    return routes.map((route: IRoute, key: number) => {
      return (
        <ListItem
          ms="28px"
          display="flex"
          alignItems="center"
          mb="10px"
          key={key}
        >
          <Icon
            w="6px"
            h="6px"
            me="8px"
            as={FaCircle}
            color={activeIcon}
          />
          <Text
            color={
              activeRoute(route.path.toLowerCase()) ? activeColor : inactiveColor
            }
            fontWeight={activeRoute(route.path.toLowerCase()) ? 'bold' : 'normal'}
            fontSize="sm"
          >
            {route.name}
          </Text>
        </ListItem>
      );
    });
  };

  // ✅ Main createLinks — PRO / хориглолтуудгүйгээр цэвэр
  const createLinks = (routes: IRoute[]) => {
    return routes.map((route, key) => {
      if (route.invisible) return null;

      if (route.collapse) {
        return (
          <Accordion defaultIndex={0} allowToggle key={key}>
            <Flex w="100%" justifyContent={'space-between'}>
              <AccordionItem border="none" mb="14px" key={key}>
                <AccordionButton
                  display="flex"
                  alignItems="center"
                  mb="4px"
                  justifyContent="center"
                  _hover={{ bg: 'unset' }}
                  _focus={{ boxShadow: 'none' }}
                  borderRadius="8px"
                  w="100%"
                  py="0px"
                  ms={0}
                >
                  {route.icon ? (
                    <Flex align="center" justifyContent="space-between" w="100%">
                      <HStack
                        spacing={
                          activeRoute(route.path.toLowerCase()) ? '22px' : '26px'
                        }
                      >
                        <Flex w="100%" alignItems="center" justifyContent="center">
                          <Box
                            color={
                              activeRoute(route.path.toLowerCase())
                                ? activeIcon
                                : inactiveColor
                            }
                            me="12px"
                            mt="6px"
                          >
                            {route.icon}
                          </Box>
                          <Text
                            me="auto"
                            color={
                              activeRoute(route.path.toLowerCase())
                                ? activeColor
                                : gray
                            }
                            fontWeight="500"
                            letterSpacing="0px"
                            fontSize="sm"
                          >
                            {route.name}
                          </Text>
                        </Flex>
                      </HStack>
                      <AccordionIcon ms="auto" color={'gray.500'} />
                    </Flex>
                  ) : (
                    <Flex pt="0px" pb="10px" alignItems="center" w="100%">
                      <HStack
                        spacing={
                          activeRoute(route.path.toLowerCase()) ? '22px' : '26px'
                        }
                        ps="32px"
                      >
                        <Text me="auto" fontWeight="500" letterSpacing="0px" fontSize="sm">
                          {route.name}
                        </Text>
                      </HStack>
                      <AccordionIcon ms="auto" color={'gray.500'} />
                    </Flex>
                  )}
                </AccordionButton>

                <AccordionPanel py="0px" ps={'8px'}>
                  <List>
                    {route.items
                      ? route.icon
                        ? createLinks(route.items) // nested groups
                        : createAccordionLinks(route.items) // bullet-style
                      : null}
                  </List>
                </AccordionPanel>
              </AccordionItem>

              {/* ✅ PRO badge, horizon link бүрэн устгасан */}
            </Flex>
          </Accordion>
        );
      }

      // leaf
      if (route.icon || route.name) {
        return renderLeaf(route, key);
      }

      return null;
    });
  };

  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;
