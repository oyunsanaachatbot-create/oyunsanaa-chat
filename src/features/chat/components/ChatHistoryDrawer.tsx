'use client';
/* eslint-disable */

import { Box, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Text, useColorModeValue } from '@chakra-ui/react';

export function ChatHistoryDrawer(props: {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  chats: { id: string; title: string; created_at: string }[];
  onPick: (chatId: string) => void;
}) {
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  return (
    <Drawer isOpen={props.isOpen} placement="left" onClose={props.onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">Chat history</DrawerHeader>
        <DrawerBody>
          {props.loading ? (
            <Text opacity={0.7}>Loading…</Text>
          ) : props.chats.length === 0 ? (
            <Text opacity={0.7}>History хоосон байна.</Text>
          ) : (
            <Flex direction="column" gap="10px">
              {props.chats.map((c) => (
                <Box
                  key={c.id}
                  p="10px"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="12px"
                  cursor="pointer"
                  _hover={{ bg: 'blackAlpha.50' }}
                  onClick={() => props.onPick(c.id)}
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
  );
}
