'use client';
/* eslint-disable */

import Link from '@/components/link/Link';
import { ChatBody, OpenAIModel } from '@/types/types';
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
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MdAutoAwesome,
  MdBolt,
  MdEdit,
  MdPerson,
  MdContentCopy,
} from 'react-icons/md';

// ✅ public asset path (Next дээр найдвартай)
// /public/img/chat/bg-image.png гэж байвал:
const Bg = '/img/chat/bg-image.png';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function Chat() {
  // ✅ model + messages
  const [model, setModel] = useState<OpenAIModel>('gpt-4o');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputCode, setInputCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // auto scroll
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, loading]);

  // colors
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgIcon = useColorModeValue(
    'linear-gradient(180deg, #FBFBFF 0%, #CACAFF 100%)',
    'whiteAlpha.200',
  );
  const brandColor = useColorModeValue('brand.500', 'white');
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

  const maxCodeLength = useMemo(() => 700, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  };

  const sendMessage = async () => {
    const trimmed = inputCode.trim();

    // ✅ "hi" явуулаад input дээр үлдэхгүй (controlled + clear)
    if (!trimmed) return;

    if (trimmed.length > maxCodeLength) {
      alert(
        `Please enter less than ${maxCodeLength} characters. You are currently at ${trimmed.length} characters.`,
      );
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    };

    // ✅ UI дээр шууд нэмээд input-оо хоосолно
    setMessages((prev) => [...prev, userMessage]);
    setInputCode('');
    setLoading(true);

    // ✅ assistant placeholder
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '' },
    ]);

    // ✅ API key-г client талаас авахгүй. Зөвхөн server env.
    const body: ChatBody = {
      inputCode: userMessage.content,
      model,
      // apiKey: байхгүй
    };

    let response: Response;
    try {
      response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (e) {
      setLoading(false);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: 'Network error. Please try again.' }
            : m,
        ),
      );
      return;
    }

    if (!response.ok) {
      const t = await response.text().catch(() => '');
      setLoading(false);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: `API error (${response.status}): ${t || 'Error'}` }
            : m,
        ),
      );
      return;
    }

    const data = response.body;
    if (!data) {
      setLoading(false);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: 'Empty response body.' } : m,
        ),
      );
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let acc = '';

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value);
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: acc } : m)),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      w="100%"
      pt={{ base: '70px', md: '0px' }}
      direction="column"
      position="relative"
    >
      <Img
        src={Bg}
        position="absolute"
        w="350px"
        left="50%"
        top="50%"
        transform="translate(-50%, -50%)"
        opacity={0.9}
      />

      <Flex
        direction="column"
        mx="auto"
        w={{ base: '100%', md: '100%', xl: '100%' }}
        minH={{ base: '75vh', '2xl': '85vh' }}
        maxW="1000px"
      >
        {/* Model Change */}
        <Flex direction="column" w="100%" mb="12px">
          <Flex
            mx="auto"
            zIndex="2"
            w="max-content"
            mb="20px"
            borderRadius="60px"
          >
            <Flex
              cursor="pointer"
              transition="0.3s"
              justify="center"
              align="center"
              bg={model === 'gpt-4o' ? buttonBg : 'transparent'}
              w="174px"
              h="70px"
              boxShadow={model === 'gpt-4o' ? buttonShadow : 'none'}
              borderRadius="14px"
              color={textColor}
              fontSize="18px"
              fontWeight="700"
              onClick={() => setModel('gpt-4o')}
            >
              <Flex
                borderRadius="full"
                justify="center"
                align="center"
                bg={bgIcon}
                me="10px"
                h="39px"
                w="39px"
              >
                <Icon
                  as={MdAutoAwesome}
                  width="20px"
                  height="20px"
                  color={iconColor}
                />
              </Flex>
              GPT-4o
            </Flex>

            <Flex
              cursor="pointer"
              transition="0.3s"
              justify="center"
              align="center"
              bg={model === 'gpt-3.5-turbo' ? buttonBg : 'transparent'}
              w="164px"
              h="70px"
              boxShadow={model === 'gpt-3.5-turbo' ? buttonShadow : 'none'}
              borderRadius="14px"
              color={textColor}
              fontSize="18px"
              fontWeight="700"
              onClick={() => setModel('gpt-3.5-turbo')}
            >
              <Flex
                borderRadius="full"
                justify="center"
                align="center"
                bg={bgIcon}
                me="10px"
                h="39px"
                w="39px"
              >
                <Icon as={MdBolt} width="20px" height="20px" color={iconColor} />
              </Flex>
              GPT-3.5
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
                <Text
                  color={gray}
                  fontWeight="500"
                  fontSize="sm"
                  textAlign="center"
                >
                  This is a cool text example.
                </Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Flex>

        {/* ✅ Chat Area (scrollable) */}
        <Flex
          direction="column"
          w="100%"
          mx="auto"
          flex="1"
          overflowY="auto"
          px={{ base: '6px', md: '10px' }}
          pb="110px" // input sticky-д зай
        >
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
return (
  <Flex
    w="100%"
    minH="100dvh"
    direction="column"
    position="relative"
    overflow="hidden"
    pt={{ base: '70px', md: '0px' }}
  >
    {/* BG */}
    <Img
      src={Bg}
      position="absolute"
      w="350px"
      left="50%"
      top="50%"
      transform="translate(-50%, -50%)"
      opacity={0.9}
      pointerEvents="none"
    />

    {/* Main container */}
    <Flex
      direction="column"
      mx="auto"
      w="100%"
      flex="1"
      maxW="1000px"
      position="relative"
      zIndex={1}
      px={{ base: 2, md: 0 }}
    >
      {/* Model Change (header хэсэг) */}
      <Flex direction="column" w="100%" mb="12px">
        {/* ... (ТАНЫ Model selector + Accordion хэвээр) ... */}
      </Flex>

      {/* ✅ Messages: зөвхөн энэ хэсэг scroll хийнэ */}
      <Flex
        direction="column"
        w="100%"
        flex="1"
        overflowY="auto"
        px={{ base: '6px', md: '10px' }}
        pb="130px" // fixed input + safe-area зай
      >
        {messages.map(/* ... яг хэвээр ... */)}
        <Box ref={bottomRef} />

        {/* ✅ Доорхи "Free Research Preview" ийг footer маягаар messages дотор үлдээнэ (хүсвэл бүр устгаж болно) */}
        <Flex
          justify="center"
          mt="16px"
          direction={{ base: 'column', md: 'row' }}
          alignItems="center"
          gap="6px"
          opacity={0.8}
        >
          <Text fontSize="xs" textAlign="center" color={gray}>
            Free Research Preview. ChatGPT may produce inaccurate information about people, places, or facts.
          </Text>
          <Link href="https://help.openai.com/en/articles/6825453-chatgpt-release-notes">
            <Text fontSize="xs" color={textColor} fontWeight="500" textDecoration="underline">
              ChatGPT May 12 Version
            </Text>
          </Link>
        </Flex>
      </Flex>
    </Flex>

    {/* ✅ Input: үргэлж ёроолд FIXED (desktop + mobile keyboard safe) */}
    <Flex
      position="fixed"
      left="0"
      right="0"
      bottom="0"
      zIndex={50}
      bg={useColorModeValue('white', 'navy.900')}
      borderTop="1px solid"
      borderColor={borderColor}
      px={{ base: '10px', md: '16px' }}
      pt="12px"
      pb="calc(env(safe-area-inset-bottom) + 12px)"
    >
      <Flex w="100%" maxW="1000px" mx="auto">
        <Input
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (!loading) sendMessage();
            }
          }}
          minH="54px"
          h="54px"
          border="1px solid"
          borderColor={borderColor}
          borderRadius="45px"
          p="15px 20px"
          me="10px"
          fontSize="sm"
          fontWeight="500"
          _focus={{ borderColor: 'none' }}
          color={inputColor}
          _placeholder={placeholderColor}
          placeholder="Type your message here..."
          isDisabled={loading}
        />

        <Button
          variant="primary"
          px="16px"
          fontSize="sm"
          borderRadius="45px"
          w={{ base: '140px', md: '210px' }}
          h="54px"
          onClick={() => !loading && sendMessage()}
          isLoading={loading}
        >
          Submit
        </Button>
      </Flex>
    </Flex>
  </Flex>
);
        
