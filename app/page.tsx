'use client';
/* eslint-disable */

import Link from '@/components/link/Link';
import { OpenAIModel } from '@/types/types';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
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
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MdAutoAwesome,
  MdBolt,
  MdContentCopy,
  MdEdit,
  MdPerson,
} from 'react-icons/md';

const Bg = '/img/chat/bg-image.png';
const BRAND = '#1F6FB2';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function Chat() {
  const [model, setModel] = useState<OpenAIModel>('gpt-4o');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const maxLen = useMemo(() => 2000, []);

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgIcon = useColorModeValue(
    'linear-gradient(180deg, #FBFBFF 0%, #CACAFF 100%)',
    'whiteAlpha.200',
  );
  const buttonBg = useColorModeValue('white', 'whiteAlpha.100');
  const gray = useColorModeValue('gray.500', 'white');
  const buttonShadow = useColorModeValue(
    '14px 27px 45px rgba(112, 144, 176, 0.2)',
    'none',
  );
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );
  const assistantBg = useColorModeValue('gray.50', 'whiteAlpha.100');
  const userBg = useColorModeValue('white', 'whiteAlpha.100');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
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

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    if (trimmed.length > maxLen) {
      alert(`Хэт урт байна (${trimmed.length}/${maxLen}).`);
      return;
    }

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    };
    const assistantId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: assistantId, role: 'assistant', content: '' },
    ]);

    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chatAPI', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputCode: trimmed, model }),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => '');
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: `API error: ${t || res.status}` }
              : m,
          ),
        );
        return;
      }

      if (!res.body) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: 'Empty response body.' } : m,
          ),
        );
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value || new Uint8Array(), { stream: true });

        // ✅ хамгаалалт: хаах маркер таарвал тасал
        if (chunk.includes('[DONE]')) break;

        acc += chunk;

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: acc } : m)),
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: 'Network error. Try again.' } : m,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex w="100%" direction="column" position="relative">
      <Img
        src={Bg}
        position="absolute"
        w={{ base: '220px', md: '350px' }}
        left="50%"
        top="45%"
        transform="translate(-50%, -50%)"
        opacity={0.12}
        pointerEvents="none"
      />

      {/* ✅ Template доторх content area-д тааруулсан wrapper */}
      <Flex
        direction="column"
        mx="auto"
        w="100%"
        maxW="1000px"
        flex="1"
        minH="0"
        height="100%"
        position="relative"
        px={{ base: '10px', md: '0px' }}
      >
        {/* ✅ 2 товч header-ийн цаагуур орохгүй байлгахын тулд top зай */}
        <Box h={{ base: '10px', md: '0px' }} />

        {/* Model / Plugins (2 button харагдана) */}
        <Flex direction="column" w="100%" mb="10px" flexShrink={0}>
          <Flex
            mx="auto"
            zIndex="2"
            w="max-content"
            mb="16px"
            borderRadius="60px"
            mt={{ base: '6px', md: '0px' }}
          >
            <Flex
              cursor="pointer"
              transition="0.3s"
              justify="center"
              align="center"
              bg={model === 'gpt-3.5-turbo' ? buttonBg : 'transparent'}
              w="174px"
              h="56px"
              boxShadow={model === 'gpt-3.5-turbo' ? buttonShadow : 'none'}
              borderRadius="14px"
              color={textColor}
              fontSize="15px"
              fontWeight="700"
              onClick={() => setModel('gpt-3.5-turbo')}
              border="1px solid"
              borderColor={model === 'gpt-3.5-turbo' ? BRAND : 'transparent'}
            >
              <Flex
                borderRadius="full"
                justify="center"
                align="center"
                bg={bgIcon}
                me="10px"
                h="34px"
                w="34px"
              >
                <Icon as={MdAutoAwesome} boxSize="18px" color={iconColor} />
              </Flex>
              GPT-3.5
            </Flex>

            <Flex
              cursor="pointer"
              transition="0.3s"
              justify="center"
              align="center"
              bg={model === 'gpt-4o' ? buttonBg : 'transparent'}
              w="164px"
              h="56px"
              boxShadow={model === 'gpt-4o' ? buttonShadow : 'none'}
              borderRadius="14px"
              color={textColor}
              fontSize="15px"
              fontWeight="700"
              onClick={() => setModel('gpt-4o')}
              border="1px solid"
              borderColor={model === 'gpt-4o' ? BRAND : 'transparent'}
            >
              <Flex
                borderRadius="full"
                justify="center"
                align="center"
                bg={bgIcon}
                me="10px"
                h="34px"
                w="34px"
              >
                <Icon as={MdBolt} boxSize="18px" color={iconColor} />
              </Flex>
              GPT-4o
            </Flex>
          </Flex>

          <Accordion color={gray} allowToggle w="100%" my="0px" mx="auto">
            <AccordionItem border="none">
              <AccordionButton
                borderBottom="0px solid"
                maxW="max-content"
                mx="auto"
                _hover={{ border: '0px solid', bg: 'none' }}
                _focus={{ border: '0px solid', bg: 'none' }}
              >
                <Box flex="1" textAlign="left">
                  <Text color={gray} fontWeight="500" fontSize="sm">
                    No plugins added
                  </Text>
                </Box>
                <AccordionIcon color={gray} />
              </AccordionButton>
              <AccordionPanel mx="auto" w="max-content" p="0px 0px 10px 0px">
                <Text color={gray} fontWeight="500" fontSize="sm" textAlign="center">
                  This is a cool text example.
                </Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Flex>

        {/* ✅ Messages = зөвхөн энэ хэсэг л scroll болох ёстой */}
        <Flex
          direction="column"
          w="100%"
          flex="1"
          minH="0"
          overflowY="auto"
          px={{ base: '4px', md: '10px' }}
          // ✅ footer + input давхцахаас хамгаалсан padding (их байхаас айх хэрэггүй)
          pb={{ base: '220px', md: '200px' }}
        >
          {messages.length === 0 ? (
            <Flex direction="column" align="center" justify="center" mt="30px" opacity={0.95}>
              <Text color={textColor} fontWeight="800" fontSize="lg" textAlign="center">
                Сайн уу? 👋
              </Text>
              <Text color={gray} fontSize="sm" textAlign="center" mt="6px" maxW="520px">
                Сэтгэлийн туслагч Oyunsanaa байна. Танд юугаар туслах уу?
              </Text>
            </Flex>
          ) : (
            messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <Flex key={m.id} w="100%" align="flex-start" mb="12px">
                  <Flex
                    borderRadius="full"
                    justify="center"
                    align="center"
                    bg={isUser ? 'transparent' : BRAND}
                    border={isUser ? '1px solid' : 'none'}
                    borderColor={isUser ? borderColor : 'transparent'}
                    me="14px"
                    h="36px"
                    minW="36px"
                    mt="2px"
                  >
                    <Icon as={isUser ? MdPerson : MdAutoAwesome} boxSize="18px" color={isUser ? BRAND : 'white'} />
                  </Flex>

                  <Flex
                    direction="column"
                    p="14px 16px"
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="18px"
                    w="100%"
                    bg={isUser ? userBg : assistantBg}
                    boxShadow={useColorModeValue('sm', 'none')}
                  >
                    <Text
                      color={textColor}
                      fontWeight="600"
                      fontSize={{ base: 'sm', md: 'md' }}
                      lineHeight={{ base: '22px', md: '24px' }}
                      whiteSpace="pre-wrap"
                      wordBreak="break-word"
                    >
                      {m.content}
                    </Text>

                    <Flex mt="10px" gap="10px" justify="flex-end" opacity={0.9}>
                      {isUser && (
                        <Tooltip label="Edit" hasArrow>
                          <Box cursor="pointer" onClick={() => setInput(m.content)}>
                            <Icon as={MdEdit} boxSize="18px" color={gray} />
                          </Box>
                        </Tooltip>
                      )}
                      <Tooltip label="Copy" hasArrow>
                        <Box cursor="pointer" onClick={() => copyToClipboard(m.content)}>
                          <Icon as={MdContentCopy} boxSize="18px" color={gray} />
                        </Box>
                      </Tooltip>
                    </Flex>
                  </Flex>
                </Flex>
              );
            })
          )}

          <Box ref={bottomRef} />
        </Flex>

        {/* ✅ INPUT BAR: content дотор доороо тогтмол (footer-ийг дарахгүйгээр) */}
        <Flex
          position="sticky"
          bottom={{ base: '0px', md: '0px' }}
          zIndex={50}
          bg={useColorModeValue('white', 'navy.900')}
          borderTop="1px solid"
          borderColor={borderColor}
          px={{ base: '10px', md: '10px' }}
          pt="12px"
          pb="calc(env(safe-area-inset-bottom) + 12px)"
        >
          <Flex w="100%" gap="10px" align="center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              minH="52px"
              h="52px"
              flex="1"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="14px"
              px="14px"
              fontSize="sm"
              fontWeight="500"
              _focus={{ borderColor: BRAND }}
              color={inputColor}
              _placeholder={placeholderColor}
              placeholder="Type your message here..."
              isDisabled={loading}
            />
            <Button
              h="52px"
              px={{ base: '18px', md: '26px' }}
              borderRadius="14px"
              bg={BRAND}
              color="white"
              _hover={{ opacity: 0.92 }}
              _active={{ opacity: 0.86 }}
              onClick={send}
              isLoading={loading}
              flexShrink={0}
            >
              Submit
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
