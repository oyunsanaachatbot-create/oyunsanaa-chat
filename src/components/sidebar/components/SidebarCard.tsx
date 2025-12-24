'use client';
/* eslint-disable */

// chakra imports
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
  const activeColor = useColorModeValue('navy.700', 'white');
  const inactiveColor = useColorModeValue('gray.500', 'gray.500');
  const activeIcon = useColorModeValue('brand.500', 'white');
  const gray = useColorModeValue('gray.500', 'gray.500');

  const { routes } = props;

  // active match
  const activeRoute = useCallback(
    (routePath: string) => {
      if (!routePath) return false;
      return pathname?.includes(routePath.toLowerCase());
    },
    [pathname],
  );

  // build href (layout + path OR plain path)
  const getHref = (route: any) => {
    return route.layout ? route.layout + route.path : route.path;
  };

  // Accordion children (leaf list)
  const createAccordionLinks = (routes: IRoute[]) => {
    return routes.map((route: IRoute, key: number) => {
      const href = getHref(route);
      const isActive = activeRoute(route.path?.toLowerCase?.() || '');

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
            color={route.disabled ? gray : activeIcon}
          />

          {/* ✅ Leaf items are clickable */}
          <NavLink href={href} styles={{ width: '100%' }}>
            <Text
              color={route.disabled ? gray : isActive ? activeColor : inactiveColor}
              fontWeight={isActive ? 'bold' : 'normal'}
              fontSize="sm"
              opacity={route.disabled ? 0.6 : 1}
            >
              {route.name}
            </Text>
          </NavLink>
        </ListItem>
      );
    });
  };

  // Main tree
  const createLinks = (routes: IRoute[]) => {
    return routes.map((route, key) => {
      if (route.invisible) return null;

      // GROUP (collapse)
      if (route.collapse) {
        return (
          <Accordion defaultIndex={0} allowToggle key={key}>
            <AccordionItem border="none" mb="14px">
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
                <Flex align="center" justifyContent="space-between" w="100%">
                  <HStack
                    spacing={
                      activeRoute(route.path?.toLowerCase?.() || '')
                        ? '22px'
                        : '26px'
                    }
                  >
                    <Flex w="100%" alignItems="center" justifyContent="center">
                      {route.icon ? (
                        <Box
                          color={
                            route.disabled
                              ? gray
                              : activeRoute(route.path?.toLowerCase?.() || '')
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
                          route.disabled
                            ? gray
                            : activeRoute(route.path?.toLowerCase?.() || '')
                              ? activeColor
                              : 'gray.500'
                        }
                        fontWeight="500"
                        letterSpacing="0px"
                        fontSize="sm"
                        opacity={route.disabled ? 0.75 : 1}
                      >
                        {route.name}
                      </Text>
                    </Flex>
                  </HStack>

                  <AccordionIcon
                    ms="auto"
                    color={route.disabled ? gray : 'gray.500'}
                  />
                </Flex>
              </AccordionButton>

              <AccordionPanel py="0px" ps={'8px'}>
                <List>
                  {/* ✅ Group children: if route has icon -> use bullet style; else use normal */}
                  {route.icon && route.items
                    ? createLinks(route.items as any)
                    : route.items
                      ? createAccordionLinks(route.items as any)
                      : null}
                </List>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        );
      }

      // LEAF (non-collapse) => clickable NavLink
      const href = getHref(route);
      const isActive = activeRoute(route.path?.toLowerCase?.() || '');

      return (
        <div key={key}>
          {route.icon ? (
            <Flex
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
                spacing={isActive ? '22px' : '26px'}
              >
                <NavLink href={href} styles={{ width: '100%' }}>
                  <Flex w="100%" alignItems="center" justifyContent="center">
                    <Box
                      color={
                        route.disabled
                          ? gray
                          : isActive
                            ? activeIcon
                            : inactiveColor
                      }
                      me="12px"
                      mt="6px"
                      opacity={route.disabled ? 0.6 : 1}
                    >
                      {route.icon}
                    </Box>
                    <Text
                      me="auto"
                      color={
                        route.disabled
                          ? gray
                          : isActive
                            ? activeColor
                            : 'gray.500'
                      }
                      fontWeight="500"
                      letterSpacing="0px"
                      fontSize="sm"
                      opacity={route.disabled ? 0.6 : 1}
                    >
                      {route.name}
                    </Text>
                  </Flex>
                </NavLink>
              </HStack>
            </Flex>
          ) : (
            <ListItem ms={0} opacity={route.disabled ? 0.6 : 1}>
              <Flex ps="32px" alignItems="center" mb="8px">
                <Text
                  color={
                    route.disabled
                      ? gray
                      : isActive
                        ? activeColor
                        : inactiveColor
                  }
                  fontWeight="500"
                  fontSize="xs"
                >
                  {route.name}
                </Text>
              </Flex>
            </ListItem>
          )}
        </div>
      );
    });
  };

  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;
