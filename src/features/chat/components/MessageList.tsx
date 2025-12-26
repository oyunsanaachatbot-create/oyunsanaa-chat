'use client';
/* eslint-disable */

import { ChatMessage } from '../useChat';
import { Box, Flex, Icon, IconButton, Text, useColorModeValue } from '@chakra-ui/react';
import { MdAutoAwesome, MdContentCopy, MdEdit, MdPerson } from 'react-icons/md';

const BRAND = '#1F6FB2';

export function MessageList(props: {
  messages: ChatMessage[];
  onCopy: (id: string, text: string) => void;
  onEditUser: (text: string) => void;
}) {
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const textColor = useColorModeValue('navy.800', 'white');
  const subText = useColorModeValue('gray.500', 'whiteAlpha.700');

  const Action = (p: { icon: any; aria: string; onClick: () => void }) => (
    <IconButton
      aria-label={p.aria}
      icon={<Icon as={p.icon} boxSize="14px" />}
      size="sm"
      variant="ghost"
      h="28px"
      w="28px"
      minW="28px"
      borderRadius="999px"
      opacity={0.25}                 // ✅ бүдэг
      _hover={{ opacity: 0.9, bg: 'blackAlpha.50' }}
      _active={{ opacity: 0.9 }}
      onClick={p.onClick}
    />
  );

  if (props.messages.length === 0) {
    return (
      <Flex direction="column" align="center" justify="center" pt="20px" pb="40px">
        <Text color={textColor} fontWeight="900" fontSize={{ base: 'lg', md: 'xl' }}>
          Сайн уу, Oyunsanaa энд байна 🙂
        </Text>
        <Text color={subText} fontSize={{ base: 'sm', md: 'md' }} textAlign="center" mt="6px" maxW="560px">
          Юу мэдэрч байгаагаа 1 өгүүлбэрээр хэлээд эхлээрэй. Би тайвнаар, ойлгомжтойгоор тусална.
        </Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="14px">
      {props.messages.map((m) => {
        const isUser = m.role === 'user';

        return (
          <Flex key={m.id} justify={isUser ? 'flex-end' : 'flex-start'} align="flex-start" gap="10px">
            {!isUser && (
              <Flex
                borderRadius="full"
                justify="center"
                align="center"
                bg={BRAND}
                h="34px"
                minW="34px"
                mt="2px"
                flexShrink={0}
              >
                <Icon as={MdAutoAwesome} boxSize="16px" color="white" />
              </Flex>
            )}

            <Flex role="group" direction="column" maxW="860px" w="100%">
              <Box
                border="1px solid"
                borderColor={borderColor}
                borderRadius="16px"
                px="14px"
                py="10px"
                bg={isUser ? 'blackAlpha.50' : 'transparent'}
                alignSelf={isUser ? 'flex-end' : 'flex-start'}
              >
                <Text
                  color={textColor}
                  fontWeight={isUser ? '700' : '500'}
                  fontSize={{ base: 'sm', md: 'md' }}
                  lineHeight={{ base: '22px', md: '24px' }}
                  whiteSpace="pre-wrap"
                  wordBreak="break-word"
                >
                  {m.content}
                </Text>
              </Box>

              <Flex
                mt="6px"
                justify={isUser ? 'flex-end' : 'flex-start'}
                gap="6px"
                opacity={0}
                transition="opacity 0.15s ease"
                _groupHover={{ opacity: 1 }}
                sx={{ '@media (hover: none)': { opacity: 1 } }}
              >
                {isUser ? (
                  <>
                    <Action icon={MdEdit} aria="edit" onClick={() => props.onEditUser(m.content || '')} />
                    <Action icon={MdContentCopy} aria="copy" onClick={() => props.onCopy(m.id, m.content || '')} />
                  </>
                ) : (
                  <Action icon={MdContentCopy} aria="copy" onClick={() => props.onCopy(m.id, m.content || '')} />
                )}
              </Flex>
            </Flex>

            {isUser && (
              <Flex
                borderRadius="full"
                justify="center"
                align="center"
                border="1px solid"
                borderColor={borderColor}
                h="34px"
                minW="34px"
                mt="2px"
                flexShrink={0}
              >
                <Icon as={MdPerson} boxSize="16px" color={BRAND} />
              </Flex>
            )}
          </Flex>
        );
      })}
    </Flex>
  );
}
