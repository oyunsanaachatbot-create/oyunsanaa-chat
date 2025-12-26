'use client';
/* eslint-disable */

import { Box, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Flex, IconButton, Text, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdHistory, MdAdd } from 'react-icons/md';
import { Composer } from '@/features/chat/components/Composer';
import { MessageList } from '@/features/chat/components/MessageList';
import { useChat } from '@/features/chat/useChat';

const BRAND = '#1F6FB2';

export default function Chat() {
  const pageBg = useColorModeValue('white', 'navy.900');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  const {
    messages,
    loading,
    recentOpen,
    setRecentOpen,
    recent,
    recentLoading,
    init,
    createNewChat,
    openChat,
    sendMessage,
  } = useChat();

  const [draftForEdit, setDraftForEdit] = useState<string>('');

  useEffect(() => {
    init();
  }, [init]);

  const onCopy = async (_id: string, text: string) => {
    try { await navigator.clipboard.writeText(text); } catch {}
  };

  return (
    <Flex direction="column" h="100dvh" bg={pageBg} overflow="hidden">
      {/* ✅ Minimal top controls (history + new chat). Like SDK. */}
      <Flex
        w="100%"
        borderBottom="1px solid"
        borderColor={borderColor}
        px={{ base: '14px', md: '0px' }}
        py="10px"
        justify="center"
      >
        <Flex w="100%" maxW="920px" justify="space-between" align="center">
          <Flex gap="8px">
            <IconButton
              aria-label="history"
              icon={<MdHistory />}
              onClick={() => setRecentOpen(true)}
              variant="ghost"
              color={BRAND}
            />
          </Flex>

          <IconButton
            aria-label="new chat"
            icon={<MdAdd />}
            onClick={() => createNewChat()}
            variant="solid"
            bg={BRAND}
            color="white"
            _hover={{ opacity: 0.92 }}
          />
        </Flex>
      </Flex>

      {/* ✅ Scroll messages */}
      <Flex flex="1" minH="0" overflowY="auto" px={{ base: '14px', md: '0px' }} pt="14px" pb="14px">
        <Flex w="100%" maxW="920px" mx="auto">
          <MessageList
            messages={messages}
            onCopy={onCopy}
            onEditUser={(text) => setDraftForEdit(text)}
          />
        </Flex>
      </Flex>

      <Composer
        loading={loading}
        initialText={draftForEdit}
        onSend={async (t) => {
          setDraftForEdit('');
          await sendMessage(t);
        }}
      />

      {/* ✅ History drawer */}
      <Drawer isOpen={recentOpen} placement="left" onClose={() => setRecentOpen(false)}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Chat history</DrawerHeader>
          <DrawerBody>
            {recentLoading ? (
              <Text opacity={0.7}>Loading…</Text>
            ) : recent.length === 0 ? (
              <Text opacity={0.7}>History хоосон байна.</Text>
            ) : (
              <Flex direction="column" gap="10px">
                {recent.map((c) => (
                  <Box
                    key={c.id}
                    p="10px"
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="12px"
                    cursor="pointer"
                    _hover={{ bg: 'blackAlpha.50' }}
                    onClick={async () => {
                      await openChat(c.id);
                      setRecentOpen(false);
                    }}
                  >
                    <Text fontWeight="700" noOfLines={1}>{c.title}</Text>
                    <Text fontSize="xs" opacity={0.65}>{new Date(c.created_at).toLocaleString()}</Text>
                  </Box>
                ))}
              </Flex>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}
