'use client';

import {
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

import avatar4 from '/public/img/avatars/avatar4.png';
import { NextAvatar } from '@/components/image/Avatar';
import APIModal from '@/components/apiModal';
import Brand from '@/components/sidebar/components/Brand';
import Links from '@/components/sidebar/components/Links';
import { RoundedChart } from '@/components/icons/Icons';
import { PropsWithChildren, useEffect, useState } from 'react';
import { IoMdPerson } from 'react-icons/io';
import { FiLogOut } from 'react-icons/fi';
import { LuHistory } from 'react-icons/lu';
import { MdOutlineManageAccounts, MdOutlineSettings } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

interface SidebarContentProps extends PropsWithChildren {
  setApiKey?: (key: string) => void;
  onClose?: () => void; // ✅ mobile drawer хаах
  [x: string]: any;
}

type UserMini = { name: string; email: string } | null;

export default function SidebarContent(props: SidebarContentProps) {
  const { setApiKey, onClose } = props;
  const router = useRouter();

  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
  const bgColor = useColorModeValue('white', 'navy.700');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(12, 44, 55, 0.18)',
  );
  const iconColor = useColorModeValue('navy.700', 'white');
  const shadowPillBar = useColorModeValue(
    '4px 17px 40px 4px rgba(112, 144, 176, 0.08)',
    'none',
  );
  const gray = useColorModeValue('gray.500', 'white');

  // ✅ user state (login хийсэн эсэх + нэр + mail)
  const [user, setUser] = useState<UserMini>(null);

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
      const fallbackName = (email ? email.split('@')[0] : 'Oyunsanaa') || 'Oyunsanaa';
      const name =
        (u.user_metadata?.full_name as string) ||
        (u.user_metadata?.name as string) ||
        fallbackName;

      setUser({ name, email });
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

  // ✅ Logout-ийн одоогийн ажиллаж байсан чиглэлийг эвдэхгүй:
  // signOut хийгээд login руу буцаана (чи “шууд нэвтрэх тсонх руу очдог” гэж хэлсэн)
  const onLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login?next=/chat');
  };

  // ✅ Login хийгдээгүй үед: logout icon дээр дарвал register руу орно
  const onRegister = () => {
    router.replace('/register?next=/chat');
  };

  return (
    <Flex
      direction="column"
      height="100%"
      pt="20px"
      pb="26px"
      borderRadius="30px"
      maxW="285px"
      px="20px"
    >
      <Brand />

      <Stack direction="column" mb="auto" mt="8px">
        <Box ps="0px" pe={{ md: '0px', '2xl': '0px' }}>
          {/* ✅ menu item дармагц mobile drawer хаагдана */}
          <Links onClose={onClose} />
        </Box>
      </Stack>

      {/* ✅ PRO карт (SidebarCard) устгасан */}
      <APIModal setApiKey={setApiKey} sidebar={true} />

      <Flex
        mt="8px"
        justifyContent="center"
        alignItems="center"
        boxShadow={shadowPillBar}
        borderRadius="30px"
        p="14px"
      >
        <NextAvatar h="34px" w="34px" src={avatar4} me="10px" />

        {/* ✅ Pill дээр зөвхөн НЭР */}
        <Text color={textColor} fontSize="xs" fontWeight="600" me="10px" noOfLines={1} maxW="120px">
          {user?.name ?? 'Oyunsanaa'}
        </Text>

        <Menu>
          <MenuButton
            as={Button}
            variant="transparent"
            aria-label=""
            border="1px solid"
            borderColor={borderColor}
            borderRadius="full"
            w="34px"
            h="34px"
            px="0px"
            p="0px"
            minW="34px"
            me="10px"
            justifyContent={'center'}
            alignItems="center"
            color={iconColor}
          >
            <Flex align="center" justifyContent="center">
              <Icon as={MdOutlineSettings} width="18px" height="18px" color="inherit" />
            </Flex>
          </MenuButton>

          <MenuList
            ms="-20px"
            py="18px"
            ps="20px"
            pe="20px"
            w="246px"
            borderRadius="16px"
            transform="translate(-19px, -62px)!important"
            border="0px"
            boxShadow={shadow}
            bg={bgColor}
          >
            {/* ✅ Dropdown дээр: Hey + mail (mail зөвхөн энд харагдана) */}
            <Box mb="18px">
              <Text fontWeight="700" fontSize="sm" color={textColor}>
                👋 Hey, {user?.name ?? 'sain uu'}
              </Text>
              <Text fontSize="xs" opacity={0.75} color={textColor} mt="4px">
                {user?.email ?? 'Not signed in'}
              </Text>
            </Box>

            <Box mb="30px">
              <Flex align="center" w="100%" cursor={'not-allowed'}>
                <Icon
                  as={MdOutlineManageAccounts}
                  width="24px"
                  height="24px"
                  color={gray}
                  me="12px"
                  opacity={'0.4'}
                />
                <Text color={gray} fontWeight="500" fontSize="sm" opacity={'0.4'}>
                  Profile Settings
                </Text>
                <Link ms="auto" isExternal href="https://horizon-ui.com/ai-template">
                  <Badge
                    display={{ base: 'flex', lg: 'none', xl: 'flex' }}
                    colorScheme="brand"
                    borderRadius="25px"
                    color="brand.500"
                    textTransform={'none'}
                    letterSpacing="0px"
                    px="8px"
                  >
                    PRO
                  </Badge>
                </Link>
              </Flex>
            </Box>

            <Box mb="30px">
              <Flex cursor={'not-allowed'} align="center">
                <Icon as={LuHistory} width="24px" height="24px" color={gray} opacity="0.4" me="12px" />
                <Text color={gray} fontWeight="500" fontSize="sm" opacity="0.4">
                  History
                </Text>
                <Link ms="auto" isExternal href="https://horizon-ui.com/ai-template">
                  <Badge
                    display={{ base: 'flex', lg: 'none', xl: 'flex' }}
                    colorScheme="brand"
                    borderRadius="25px"
                    color="brand.500"
                    textTransform={'none'}
                    letterSpacing="0px"
                    px="8px"
                  >
                    PRO
                  </Badge>
                </Link>
              </Flex>
            </Box>

            <Box mb="30px">
              <Flex cursor={'not-allowed'} align="center">
                <Icon as={RoundedChart} width="24px" height="24px" color={gray} opacity="0.4" me="12px" />
                <Text color={gray} fontWeight="500" fontSize="sm" opacity="0.4">
                  Usage
                </Text>
                <Link ms="auto" isExternal href="https://horizon-ui.com/ai-template">
                  <Badge
                    display={{ base: 'flex', lg: 'none', xl: 'flex' }}
                    colorScheme="brand"
                    borderRadius="25px"
                    color="brand.500"
                    textTransform={'none'}
                    letterSpacing="0px"
                    px="8px"
                  >
                    PRO
                  </Badge>
                </Link>
              </Flex>
            </Box>

            <Box>
              <Flex cursor={'not-allowed'} align="center">
                <Icon as={IoMdPerson} width="24px" height="24px" color={gray} opacity="0.4" me="12px" />
                <Text color={gray} fontWeight="500" fontSize="sm" opacity="0.4">
                  My Plan
                </Text>
                <Link ms="auto" isExternal href="https://horizon-ui.com/ai-template">
                  <Badge
                    display={{ base: 'flex', lg: 'none', xl: 'flex' }}
                    colorScheme="brand"
                    borderRadius="25px"
                    color="brand.500"
                    textTransform={'none'}
                    letterSpacing="0px"
                    px="8px"
                  >
                    PRO
                  </Badge>
                </Link>
              </Flex>
            </Box>
          </MenuList>
        </Menu>

        {/* ✅ ЭНД Л гол өөрчлөлт:
            - guest үед: бүртгүүлэх (register руу)
            - login үед: logout (өмнөх шигээ login руу) */}
        {user ? (
          <Button
            onClick={onLogout}
            variant="transparent"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="full"
            w="34px"
            h="34px"
            px="0px"
            minW="34px"
            justifyContent={'center'}
            alignItems="center"
            title="Log out"
          >
            <Icon as={FiLogOut} width="16px" height="16px" color="inherit" />
          </Button>
        ) : (
          <Button
            onClick={onRegister}
            variant="transparent"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="full"
            w="34px"
            h="34px"
            px="0px"
            minW="34px"
            justifyContent={'center'}
            alignItems="center"
            title="Бүртгүүлэх"
          >
            <Icon as={IoMdPerson} width="16px" height="16px" color="inherit" />
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
