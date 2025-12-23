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
                key={msg.id}
                w="100%"
                justify={isUser ? 'flex-end' : 'flex-start'}
                mb="12px"
              >
                <Flex
                  maxW={{ base: '92%', md: '75%' }}
                  align="flex-start"
                  gap="10px"
                >
                  {/* left icon */}
                  {!isUser && (
                    <Flex
                      borderRadius="full"
                      justify="center"
                      align="center"
                      bg="linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)"
                      h="40px"
                      w="40px"
                      minW="40px"
                      mt="2px"
                    >
                      <Icon as={MdAutoAwesome} width="20px" height="20px" color="white" />
                    </Flex>
                  )}

                  {/* bubble */}
                  <Flex
                    direction="column"
                    p="16px 18px"
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="16px"
                    bg={isUser ? buttonBg : 'transparent'}
                    position="relative"
                  >
                    <Text
                      color={textColor}
                      fontWeight="600"
                      fontSize={{ base: 'sm', md: 'md' }}
                      lineHeight={{ base: '24px', md: '26px' }}
                      whiteSpace="pre-wrap"
                      wordBreak="break-word"
                    >
                      {msg.content}
                    </Text>

                    {/* actions */}
                    <Flex mt="10px" gap="10px" justify="flex-end">
                      {isUser && (
                        <Tooltip label="Edit" hasArrow>
                          <Box
                            cursor="pointer"
                            onClick={() => setInputCode(msg.content)}
                            opacity={0.85}
                            _hover={{ opacity: 1 }}
                          >
                            <Icon as={MdEdit} width="18px" height="18px" color={gray} />
                          </Box>
                        </Tooltip>
                      )}

                      <Tooltip label="Copy" hasArrow>
                        <Box
                          cursor="pointer"
                          onClick={() => copyToClipboard(msg.content)}
                          opacity={0.85}
                          _hover={{ opacity: 1 }}
                        >
                          <Icon
                            as={MdContentCopy}
                            width="18px"
                            height="18px"
                            color={gray}
                          />
                        </Box>
                      </Tooltip>
                    </Flex>
                  </Flex>

                  {/* right icon */}
                  {isUser && (
                    <Flex
                      borderRadius="full"
                      justify="center"
                      align="center"
                      bg="transparent"
                      border="1px solid"
                      borderColor={borderColor}
                      h="40px"
                      w="40px"
                      minW="40px"
                      mt="2px"
                    >
                      <Icon as={MdPerson} width="20px" height="20px" color={brandColor} />
                    </Flex>
                  )}
                </Flex>
              </Flex>
            );
          })}

          {/* scroll anchor */}
          <Box ref={bottomRef} />
        </Flex>

        {/* ✅ Sticky Input (доор алга болохгүй) */}
        <Flex
          position="sticky"
          bottom="0"
          zIndex={5}
          bg={useColorModeValue('white', 'navy.900')}
          borderTop="1px solid"
          borderColor={borderColor}
          px={{ base: '6px', md: '10px' }}
          py="12px"
        >
          <Flex w="100%" ms={{ base: '0px', xl: '60px' }}>
            <Input
              value={inputCode} // ✅ controlled => submit дараа хоосорно
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
              py="20px"
              px="16px"
              fontSize="sm"
              borderRadius="45px"
              ms="auto"
              w={{ base: '160px', md: '210px' }}
              h="54px"
              _hover={{
                boxShadow:
                  '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
                bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
                _disabled: {
                  bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
                },
              }}
              onClick={() => !loading && sendMessage()}
              isLoading={loading}
            >
              Submit
            </Button>
          </Flex>
        </Flex>

        <Flex
          justify="center"
          mt="20px"
          direction={{ base: 'column', md: 'row' }}
          alignItems="center"
        >
          <Text fontSize="xs" textAlign="center" color={gray}>
            Free Research Preview. ChatGPT may produce inaccurate information about
            people, places, or facts.
          </Text>
          <Link href="https://help.openai.com/en/articles/6825453-chatgpt-release-notes">
            <Text
              fontSize="xs"
              color={textColor}
              fontWeight="500"
              textDecoration="underline"
            >
              ChatGPT May 12 Version
            </Text>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
}
