'use client';
/* eslint-disable */

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  Img,
  Input,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  MdAutoAwesome,
  MdPerson,
  MdContentCopy,
  MdEdit,
} from 'react-icons/md';

type OpenAIModel = 'gpt-4o' | 'gpt-4o-mini';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const Bg = '/img/chat/bg-image.png';

// ✅ танай brand өнгө
const BRAND = '#1F6FB2';

export default function ChatPage() {
  const [model, setModel] = useState<OpenAIModel>('gpt-4o');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // theme colors
  const pageBg = useColorModeValue('white', 'navy.900');
  const textColor = useColorModeValue('navy.800', 'white');
  const subtleText = useColorModeValue('gray.500', 'whiteAlpha.600');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputBg = useColorModeValue('white', 'whiteAlpha.50');
  const assistantBubbleBg = useColorModeValue('gray.50', 'whiteAlpha.100');
  const userBubbleBg = useColorModeValue('white', 'whiteAlpha.100');

  const maxLen = useMemo(() => 2000, []);

  useEffect(() => {
    // ✅ messages нэмэгдэхэд хамгийн доор очих (jump багасгах)
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, loading]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    if (trimmed.length > maxLen) {
      alert(`Хэт урт байна (${trimmed.length}/${maxLen}). Богиносгоорой.`);
      return;
    }

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    };

    const assistantId = crypto.randomUUID();

    // ✅ нэг удаад update хийх (UI “үсрэх” багасна)
    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: assistantId, role: 'assistant', content: '' },
    ]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // ✅ хамгийн стандарт: messages + model
        body: JSON.stringify({
          model,
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => '');
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: `API error (${res.status}): ${t || 'Error'}` }
              : m,
          ),
        );
        return;
      }

      // ✅ streaming text (Next route.ts дээр stream буцаана)
      const data = res.body;
      if (!data) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: 'Empty response.' } : m,
          ),
        );
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let acc = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: acc } : m)),
        );
      }
    } catch (e) {
      setMessages((prev) =>
        prev.map((m) =>
          m.role === 'assistant' && m.content === ''
            ? { ...m, content: 'Network error. Please try again.' }
            : m,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      minH="100dvh"
      direction="column"
      bg={pageBg}
      overflow="hidden"
      position="relative"
    >
      <Img
        src={Bg}
        position="absolute"
        w={{ base: '220px', md: '320px' }}
        left="50%"
        top="46%"
        transform="translate(-50%, -50%)"
        opacity={0.12}
        pointerEvents="none"
      />

      {/* ✅ Top bar (хүсвэл model toggle-оо энд үлдээнэ) */}
      <Flex
        w="100%"
        maxW="1000px"
        mx="auto"
        px={{ base: 3, md: 6 }}
        pt={{ base: 4, md: 6 }}
        pb="10px"
        zIndex={1}
        align="center"
        justify="space-between"
        gap="12px"
      >
        <Text fontWeight="800" color={textColor}>
          oyunsanaa chat
        </Text>

        <Flex gap="8px">
          <Button
            size="sm"
            variant="outline"
            borderColor={model === 'gpt-4o' ? BRAND : borderColor}
            color={model === 'gpt-4o' ? BRAND : subtleText}
            onClick={() => setModel('gpt-4o')}
          >
            GPT-4o
          </Button>
          <Button
            size="sm"
            variant="outline"
            borderColor={model === 'gpt-4o-mini' ? BRAND : borderColor}
            color={model === 'gpt-4o-mini' ? BRAND : subtleText}
            onClick={() => setModel('gpt-4o-mini')}
          >
            4o-mini
          </Button>
        </Flex>
      </Flex>

      {/* ✅ Messages scroller */}
      <Box
        ref={scrollerRef}
        flex="1"
        overflowY="auto"
        zIndex={1}
        px={{ base: 3, md: 6 }}
        pt="8px"
        pb="110px" // ✅ input fixed өндөр + safe-area
      >
        {messages.length === 0 && (
          <Flex
            direction="column"
            align="center"
            justify="center"
            mt={{ base: 10, md: 16 }}
            color={subtleText}
            gap="8px"
          >
            <Text fontWeight="700" color={textColor}>
              Сайн уу 👋
            </Text>
            <Text fontSize="sm" textAlign="center" maxW="520px">
              Доор мессежээ бичээд Enter дар. (Shift+Enter = шинэ мөр)
            </Text>
          </Flex>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <Flex
              key={msg.id}
              w="100%"
              justify={isUser ? 'flex-end' : 'flex-start'}
              mb="12px"
            >
              <Flex maxW={{ base: '100%', md: '80%' }} gap="10px" align="flex-end">
                {!isUser && (
                  <Flex
                    h="36px"
                    w="36px"
                    minW="36px"
                    borderRadius="full"
                    align="center"
                    justify="center"
                    bg={BRAND}
                  >
                    <Icon as={MdAutoAwesome} color="white" boxSize="18px" />
                  </Flex>
                )}

                <Box
                  border="1px solid"
                  borderColor={borderColor}
                  bg={isUser ? userBubbleBg : assistantBubbleBg}
                  borderRadius="16px"
                  px="14px"
                  py="12px"
                  boxShadow="sm"
                  w="fit-content"
                  maxW="100%"
                >
                  <Text
                    color={textColor}
                    fontSize={{ base: 'sm', md: 'md' }}
                    lineHeight={{ base: '22px', md: '24px' }}
                    whiteSpace="pre-wrap"
                    wordBreak="break-word"
                  >
                    {msg.content}
                  </Text>

                  <Flex mt="8px" gap="10px" justify="flex-end" opacity={0.9}>
                    {isUser && (
                      <Tooltip label="Edit" hasArrow>
                        <Box
                          cursor="pointer"
                          onClick={() => setInput(msg.content)}
                        >
                          <Icon as={MdEdit} boxSize="18px" color={subtleText} />
                        </Box>
                      </Tooltip>
                    )}
                    <Tooltip label="Copy" hasArrow>
                      <Box
                        cursor="pointer"
                        onClick={() => copyToClipboard(msg.content)}
                      >
                        <Icon as={MdContentCopy} boxSize="18px" color={subtleText} />
                      </Box>
                    </Tooltip>
                  </Flex>
                </Box>

                {isUser && (
                  <Flex
                    h="36px"
                    w="36px"
                    minW="36px"
                    borderRadius="full"
                    align="center"
                    justify="center"
                    border="1px solid"
                    borderColor={borderColor}
                    bg="transparent"
                  >
                    <Icon as={MdPerson} color={BRAND} boxSize="18px" />
                  </Flex>
                )}
              </Flex>
            </Flex>
          );
        })}

        <Box ref={bottomRef} />
      </Box>

      {/* ✅ Fixed input bar (стандарт) */}
      <Box
        position="fixed"
        left="0"
        right="0"
        bottom="0"
        zIndex={50}
        borderTop="1px solid"
        borderColor={borderColor}
        bg={pageBg}
      >
        <Flex
          w="100%"
          maxW="1000px"
          mx="auto"
          px={{ base: 3, md: 6 }}
          pt="12px"
          pb="calc(env(safe-area-inset-bottom) + 12px)"
          gap="10px"
          align="center"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            bg={inputBg}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="14px"              // ✅ pill биш → стандарт, зөв харагдана
            h="52px"
            flex="1"                         // ✅ урт-нарийхан асуудлыг бүрэн арилгана
            px="14px"
            fontSize="sm"
            color={textColor}
            _placeholder={{ color: subtleText }}
            placeholder="Мессеж бичих..."
            isDisabled={loading}
          />

          <Button
            h="52px"
            px={{ base: 5, md: 7 }}
            borderRadius="14px"
            bg={BRAND}
            color="white"
            _hover={{ opacity: 0.92 }}
            _active={{ opacity: 0.88 }}
            isLoading={loading}
            onClick={sendMessage}
          >
            Илгээх
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}
