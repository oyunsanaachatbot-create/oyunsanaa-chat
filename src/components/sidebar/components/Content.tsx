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

import { supabase } from '@/lib/supabase/browser';
import { usePathname } from 'next/navigation';

interface SidebarContentProps extends PropsWithChildren {
  setApiKey?: (key: string) => void;
  onClose?: () => void;
  [x: string]: any;
}

type UserMini = { name: string; email: string } | null;

export default function SidebarContent(props: SidebarContentProps) {
  const { setApiKey, onClose } = props;
  const pathname = usePathname();
  const isGuest = pathname?.startsWith('/guest');

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
      const fallback = email ? email.split('@')[0] : 'Oyunsanaa';
      const name =
        (u.user_metadata?.full_name as string) ||
        (u.user_metadata?.name as string) ||
        fallback;

      setUser({ name, email });
    };

    load();
    const { data: sub } = supabase.auth.onAuthStateChange(load);

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const goRegister = () => {
    window.location.href = '/register?next=/chat';
  };

  const doLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login?next=/chat';
  };

  return (
    <Flex direction="column" height="100%" pt="20px" pb="26px" borderRadius="30px" maxW="285px" px="20px">
      <Brand />

      <Stack direction="column" mb="auto" mt="8px">
        <Box ps="0px">
          <Links onClose={onClose} />
        </Box>
      </Stack>

      <APIModal setApiKey={setApiKey} sidebar />

      <Flex mt="8px" justifyContent="center" alignItems="center" boxShadow={shadowPillBar} borderRadius="30px" p="14px">
        <NextAvatar h="34px" w="34px" src={avatar4} me="10px" />

        <Text color={textColor} fontSize="xs" fontWeight="600" me="10px" noOfLines={1} maxW="120px">
          {user?.name ?? 'Oyunsanaa'}
        </Text>

        <Menu>
          <MenuButton
            as={Button}
            variant="transparent"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="full"
            w="34px"
            h="34px"
            p="0"
            minW="34px"
            me="10px"
            color={iconColor}
          >
            <Icon as={MdOutlineSettings} w="18px" h="18px" />
          </MenuButton>

          <MenuList ms="-20px" py="18px" ps="20px" pe="20px" w="246px" borderRadius="16px" boxShadow={shadow} bg={bgColor}>
            <Box mb="18px">
              <Text fontWeight="700" fontSize="sm" color={textColor}>
                👋 Hey, {user?.name ?? 'sain uu'}
              </Text>
              <Text fontSize="xs" opacity={0.75} color={textColor}>
                {user?.email ?? 'Not signed in'}
              </Text>
            </Box>

            {[['Profile Settings', MdOutlineManageAccounts],
              ['History', LuHistory],
              ['Usage', RoundedChart],
              ['My Plan', IoMdPerson]].map(([label, IconCmp]: any) => (
              <Box key={label} mb="20px">
                <Flex align="center" cursor="not-allowed">
                  <Icon as={IconCmp} w="24px" h="24px" color={gray} me="12px" opacity={0.4} />
                  <Text color={gray} fontSize="sm" opacity={0.4}>{label}</Text>
                  <Link ms="auto" isExternal href="https://horizon-ui.com/ai-template">
                    <Badge colorScheme="brand" borderRadius="25px" px="8px">PRO</Badge>
                  </Link>
                </Flex>
              </Box>
            ))}
          </MenuList>
        </Menu>

        {isGuest ? (
          <Button
            onClick={goRegister}
            variant="transparent"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="full"
            w="34px"
            h="34px"
            minW="34px"
            title="Бүртгүүлэх"
          >
            <Icon as={IoMdPerson} w="16px" h="16px" />
          </Button>
        ) : (
          <Button
            onClick={doLogout}
            variant="transparent"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="full"
            w="34px"
            h="34px"
            minW="34px"
            title="Log out"
            isDisabled={!user}
            opacity={!user ? 0.6 : 1}
          >
            <Icon as={FiLogOut} w="16px" h="16px" />
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
