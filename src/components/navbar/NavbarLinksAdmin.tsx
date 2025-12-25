'use client';
// Chakra Imports
import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchBar } from '@/components/navbar/searchBar/SearchBar';
import { SidebarResponsive } from '@/components/sidebar/Sidebar';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { MdInfoOutline } from 'react-icons/md';
import APIModal from '@/components/apiModal';
import NavLink from '../link/NavLink';
import routes from '@/routes';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

type UserMini = { email: string; name: string };

function initialsFromName(name?: string) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);

  // нэр байхгүй үед OS
  if (parts.length === 0) return 'OS';

  const a = (parts[0]?.[0] ?? 'O').toUpperCase();
  // нэг үгтэй нэр байвал 2 дахь үсгийг S гэж өгөөд OS маягийн болгоно
  const b = (parts[1]?.[0] ?? 'S').toUpperCase();
  return (a + b).slice(0, 2);
}

export default function HeaderLinks(props: { secondary: boolean; setApiKey: any }) {
  const { secondary, setApiKey } = props;
  const router = useRouter();

  const { colorMode, toggleColorMode } = useColorMode();

  const navbarIcon = useColorModeValue('gray.500', 'white');
  const menuBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '0px 41px 75px #081132',
  );
  const buttonBg = useColorModeValue('transparent', 'navy.800');
  const hoverButton = useColorModeValue({ bg: 'gray.100' }, { bg: 'whiteAlpha.100' });
  const activeButton = useColorModeValue({ bg: 'gray.200' }, { bg: 'whiteAlpha.200' });

  const [user, setUser] = useState<UserMini | null>(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      const { data } = await supabase.auth.getUser();
      const u = data.user;

      if (!alive) return;

      if (!u) {
        setUser(null);
        return;
      }

      const email = u.email ?? '';
      const name =
        (u.user_metadata?.full_name as string) ||
        (u.user_metadata?.name as string) ||
        'Oyunsanaa';

      setUser({ email, name });
    };

    load();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const initials = useMemo(() => initialsFromName(user?.name), [user?.name]);

  const logout = async () => {
  await supabase.auth.signOut();
  router.replace('/login?next=/chat');
};

  const goLogin = () => {
    router.replace('/login?next=/chat');
  };

  return (
    <Flex
      zIndex="100"
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      <SearchBar
        mb={() => (secondary ? { base: '10px', md: 'unset' } : 'unset')}
        me="10px"
        borderRadius="30px"
      />

      <SidebarResponsive routes={routes} />
      <APIModal setApiKey={setApiKey} />

      <Menu>
        <MenuButton p="0px">
          <Icon mt="6px" as={MdInfoOutline} color={navbarIcon} w="18px" h="18px" me="10px" />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="20px"
          me={{ base: '30px', md: 'unset' }}
          borderRadius="20px"
          bg={menuBg}
          border="none"
          mt="22px"
          minW={{ base: 'unset' }}
          maxW={{ base: '360px', md: 'unset' }}
        >
          <Flex flexDirection="column">
            <Link isExternal w="100%" href="https://horizon-ui.com/ai-template/">
              <Button
                variant="primary"
                py="20px"
                px="16px"
                fontSize="sm"
                borderRadius="45px"
                mb="10px"
                w="100%"
                h="54px"
              >
                Buy Horizon AI Template
              </Button>
            </Link>
            <Link isExternal w="100%" href="https://horizon-ui.com/docs-ai-template/">
              <Button
                bg={buttonBg}
                border="1px solid"
                color={textColor}
                mt={{ base: '20px', md: '0px' }}
                borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')}
                fontSize="sm"
                borderRadius="45px"
                w="100%"
                minW="44px"
                h="44px"
                _hover={hoverButton}
                _active={activeButton}
                _focus={activeButton}
              >
                See Documentation
              </Button>
            </Link>
            <Link w="100%" isExternal href="https://github.com/horizon-ui/chatgpt-ai-template">
              <Button
                w="100%"
                h="44px"
                variant="no-hover"
                color={textColor}
                fontSize="sm"
                borderRadius="45px"
                bg="transparent"
              >
                Try Free Version
              </Button>
            </Link>
          </Flex>
        </MenuList>
      </Menu>

      <Button
        variant="no-hover"
        bg="transparent"
        p="0px"
        minW="unset"
        minH="unset"
        h="18px"
        w="max-content"
        onClick={toggleColorMode}
      >
        <Icon
          me="10px"
          h="18px"
          w="18px"
          color={navbarIcon}
          as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
        />
      </Button>

      {/* User menu */}
      <Menu>
        <MenuButton p="0px" style={{ position: 'relative' }}>
          <Box
            _hover={{ cursor: 'pointer' }}
            color="white"
            bg="#11047A"
            w="40px"
            h="40px"
            borderRadius="50%"
          />
          <Center top={0} left={0} position="absolute" w="100%" h="100%">
            <Text fontSize="xs" fontWeight="bold" color="white">
              {initials}
            </Text>
          </Center>
        </MenuButton>

        <MenuList boxShadow={shadow} p="0px" mt="10px" borderRadius="20px" bg={menuBg} border="none">
          <Flex w="100%" mb="0px" flexDirection="column">
            <Text
              ps="20px"
              pt="16px"
              pb="12px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="sm"
              fontWeight="700"
              color={textColor}
            >
              👋&nbsp; {user ? `Hey, ${user.name}` : 'Hey, сайн уу'}
            </Text>
            {/* ✅ Email мөрийг бүрэн авч хаясан */}
          </Flex>

          <Flex flexDirection="column" p="10px">
            <NavLink href="/settings">
              <MenuItem
                _hover={{ bg: 'none' }}
                _focus={{ bg: 'none' }}
                color={textColor}
                borderRadius="8px"
                px="14px"
              >
                <Text fontWeight="500" fontSize="sm">
                  Profile Settings
                </Text>
              </MenuItem>
            </NavLink>

            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              color={textColor}
              borderRadius="8px"
              px="14px"
            >
              <Text fontWeight="500" fontSize="sm">
                Newsletter Settings
              </Text>
            </MenuItem>

            {user ? (
              <MenuItem
                onClick={logout}
                _hover={{ bg: 'none' }}
                _focus={{ bg: 'none' }}
                color="red.400"
                borderRadius="8px"
                px="14px"
              >
                <Text fontWeight="500" fontSize="sm">
                  Log out
                </Text>
              </MenuItem>
            ) : (
              <MenuItem
                onClick={goLogin}
                _hover={{ bg: 'none' }}
                _focus={{ bg: 'none' }}
                color={textColor}
                borderRadius="8px"
                px="14px"
              >
                <Text fontWeight="600" fontSize="sm">
                  Нэвтрэх / Бүртгүүлэх
                </Text>
              </MenuItem>
            )}
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}
