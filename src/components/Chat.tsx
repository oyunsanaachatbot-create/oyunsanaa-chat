'use client';
/* eslint-disable */

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
  IconButton,
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
  MdSend,
  MdAttachFile,
  MdClose,
} from 'react-icons/md';

const Bg = '/img/chat/bg-image.png';
const BRAND = '#1F6FB2';

type ChatMessage = { id: string; role: 'user' | 'assistant'; content: string };

export default function Chat() {
  const [model, setModel] = useState<OpenAIModel>('gpt-4o');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // image attachment
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const maxLen = useMemo(() => 2000, []);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgIcon = useColorModeValue(
    'linear-gradient(180deg, #FBFBFF 0%, #CACAFF 100%)',
    'whiteAlpha.200',
  );
  const buttonBg = useColorModeValue('white', 'whiteAlpha.100');
  const gray = useColorModeValue('gray.500', 'whiteAlpha.700');
  const buttonShadow = useColorModeValue('14px 27px 45px rgba(112, 144, 176, 0.2)', 'none');
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue({ color: 'gray.500' }, { color: 'whiteAlpha.600' });
  const assistantBg = useColorModeValue('gray.50', 'whiteAlpha.100');
  const userBg = useColorModeValue('white', 'whiteAlpha.100');

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages.length, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [messages.length, loading]);

  useEffect(() => {
    // cleanup old preview url
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

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

  const pickImage = () => {
    if (loading) return;
    fileRef.current?.click();
  };

  const onFileChange = (file: File | null) => {
    if (!file) return;

    // only images
    if (!file.type.startsWith('image/')) return;

    // optional size limit (5MB)
    const maxMB = 5;
    if (file.size > maxMB * 1024 * 1024) {
      alert(`Зураг хэт том байна (${maxMB}MB-с бага байгаарай).`);
      return;
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const send = async () => {
    const trimmed = input.trim();

    // allow: text OR image
    const hasText = !!trimmed;
    const hasImage = !!imageFile;

    if ((!hasText && !hasImage) || loading) return;
    if (hasText && trimmed.length > maxLen) return;

    const userId = crypto.randomUUID();
    const assistantId = crypto.randomUUID();

    // Show what user sent (simple)
    const userContent =
      hasText && hasImage
        ? `${trimmed}\n\n[Зураг хавсаргасан]`
        : hasImage
          ? `[Зураг хавсаргасан]`
          : trimmed;

    setMessages((p) => [
      ...p,
      { id: userId, role: 'user', content: userContent },
      { id: assistantId, role: 'assistant', content: '' },
    ]);

    setInput('');
    setLoading(true);

    try {
      let res: Response;

      if (hasImage) {
        // FormData mode (text + image)
        const fd = new FormData();
        fd.append('model', model);
        fd.append('inputCode', trimmed || '');
        fd.append('image', imageFile as File);

        res = await fetch('/api/chatAPI', {
          method: 'POST',
          body: fd,
        });
      } else {
        // JSON mode (text only)
        res = await fetch('/api/chatAPI', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inputCode: trimmed, model }),
        });
      }

      // once request is in flight, clear image UI
      if (hasImage) clearImage();

      if (!res.ok) {
        const t = await res.text().catch(() => '');
        setMessages((p) =>
          p.map((m) =>
            m.id === assistantId ? { ...m, content: `API error: ${t || res.status}` } : m,
          ),
        );
        return;
      }
      if (!res.body) return;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value || new Uint8Array(), { stream: true });
        setMessages((p) => p.map((m) => (m.id === assistantId ? { ...m, content: acc } : m)));
      }
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <Flex direction="column" h="100dvh" w="100%" position="relative">
      <Img
        src={Bg}
        position="absolute"
        w={{ base: '220px', md: '350px' }}
        left="50%"
        top="45%"
        transform="translate(-50%, -50%)"
        opacity={0.1}
        pointerEvents="none"
      />

      {/* Top controls */}
      (/* ... танай дээрх Top controls хэсэг өөрчлөхгүй хэвээр ... */) && null

      {/* --- Top controls (unchanged, just pasted back) --- */}
      <Flex direction="column" w="100%" flexShrink={0} zIndex={2} pt="14px">
        <Flex mx="auto" w="max-content" mb="12px" borderRadius="60px" gap="10px">
          <Flex
            cursor="pointer"
            transition="0.2s"
            justify="center"
            align="center"
            bg={model === 'gpt-3.5-turbo' ? buttonBg : 'transparent'}
            w={{ base: '150px', md: '174px' }}
            h="56px"
            boxShadow={model === 'gpt-3.5-turbo' ? buttonShadow : 'none'}
            borderRadius="14px"
            color={textColor}
            fontSize="15px"
            fontWeight="700"
            onClick={() => setModel('gpt-3.5-turbo')}
            border="1px solid"
            borderColor={model === 'gpt-3.5-turbo' ? BRAND : borderColor}
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
            transition="0.2s"
            justify="center"
            align="center"
            bg={model === 'gpt-4o' ? buttonBg : 'transparent'}
            w={{ base: '150px', md: '164px' }}
            h="56px"
            boxShadow={model === 'gpt-4o' ? buttonShadow : 'none'}
            borderRadius="14px"
            color={textColor}
            fontSize="15px"
            fontWeight="700"
            onClick={() => setModel('gpt-4o')}
            border="1px solid"
            borderColor={model === 'gpt-4o' ? BRAND : borderColor}
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
                .
              </Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex>

      {/* Messages */}
      <Flex
        ref={scrollRef}
        direction="column"
        flex="1"
        minH="0"
        overflowY="auto"
        px={{ base: '10px', md: '0px' }}
      >
        <Flex
          direction="column"
          mx="auto"
          w="100%"
          maxW="1000px"
          px={{ base: '10px', md: '0px' }}
          py="12px"
          gap="12px"
        >
          {messages.length === 0 ? (
            <Flex direction="column" align="center" justify="center" mt="24px" opacity={0.95}>
              <Text color={textColor} fontWeight="800" fontSize="lg">
                Сайн уу? 🙂
              </Text>
              <Text color={gray} fontSize="sm" textAlign="center" mt="6px" maxW="520px">
                Сэтгэлийн туслагч Oyunsanaa байна. Танид юугаар туслах уу?
              </Text>
            </Flex>
          ) : (
            messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <Flex key={m.id} w="100%" align="flex-start" mb="2px">
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
                    role="group"
                    direction="column"
                    p="14px 16px"
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="18px"
                    w="100%"
                    bg={isUser ? userBg : assistantBg}
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

                    {/* small cute actions (hover on desktop) */}
                    <Flex
                      mt="8px"
                      justify="flex-end"
                      gap="6px"
                      opacity={0}
                      transition="opacity 0.15s ease"
                      _groupHover={{ opacity: 1 }}
                      sx={{ '@media (hover: none)': { opacity: 1 } }}
                    >
                      {isUser && (
                        <Tooltip label="Засах" hasArrow>
                          <Button
                            variant="ghost"
                            minW="28px"
                            w="28px"
                            h="28px"
                            p="0"
                            borderRadius="999px"
                            onClick={() => setInput(m.content)}
                            _hover={{ bg: 'rgba(31,111,178,0.08)', color: BRAND }}
                            _active={{ bg: 'rgba(31,111,178,0.14)' }}
                          >
                            <Icon as={MdEdit} boxSize="14px" color={gray} />
                          </Button>
                        </Tooltip>
                      )}

                      <Tooltip label="Хуулах" hasArrow>
                        <Button
                          variant="ghost"
                          minW="28px"
                          w="28px"
                          h="28px"
                          p="0"
                          borderRadius="999px"
                          onClick={() => copyToClipboard(m.content)}
                          _hover={{ bg: 'rgba(31,111,178,0.08)', color: BRAND }}
                          _active={{ bg: 'rgba(31,111,178,0.14)' }}
                        >
                          <Icon as={MdContentCopy} boxSize="14px" color={gray} />
                        </Button>
                      </Tooltip>
                    </Flex>
                  </Flex>
                </Flex>
              );
            })
          )}
        </Flex>
      </Flex>

      {/* Input */}
      <Box
        position="sticky"
        bottom="0"
        zIndex={3}
        borderTop="1px solid"
        borderColor={borderColor}
        bg={useColorModeValue('white', 'navy.900')}
        px={{ base: '10px', md: '10px' }}
        pt="10px"
        pb="calc(env(safe-area-inset-bottom) + 12px)"
      >
        <Flex w="100%" maxW="1000px" mx="auto" direction="column" gap="8px">
          {/* image preview row */}
          {imagePreview && (
            <Flex
              align="center"
              justify="space-between"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="14px"
              p="8px"
              bg={useColorModeValue('gray.50', 'whiteAlpha.50')}
            >
              <Flex align="center" gap="10px" minW={0}>
                <Box
                  w="44px"
                  h="44px"
                  borderRadius="12px"
                  overflow="hidden"
                  border="1px solid"
                  borderColor={borderColor}
                  flexShrink={0}
                >
                  <Img src={imagePreview} w="100%" h="100%" objectFit="cover" alt="attachment" />
                </Box>

                <Box minW={0}>
                  <Text fontSize="sm" fontWeight="700" color={textColor} noOfLines={1}>
                    Зураг хавсаргасан
                  </Text>
                  <Text fontSize="xs" color={gray} noOfLines={1}>
                    {imageFile?.name}
                  </Text>
                </Box>
              </Flex>

              <IconButton
                aria-label="remove image"
                icon={<Icon as={MdClose} />}
                variant="ghost"
                size="sm"
                borderRadius="999px"
                onClick={clearImage}
              />
            </Flex>
          )}

          <Flex w="100%" gap="10px" align="center">
            {/* hidden file input */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => onFileChange(e.target.files?.[0] || null)}
            />

            {/* attach button */}
            <Tooltip label="Зураг хавсаргах" hasArrow>
              <IconButton
                aria-label="attach"
                icon={<Icon as={MdAttachFile} />}
                onClick={pickImage}
                isDisabled={loading}
                variant="ghost"
                borderRadius="14px"
                h="52px"
                w="52px"
                _hover={{ bg: 'rgba(31,111,178,0.08)', color: BRAND }}
                _active={{ bg: 'rgba(31,111,178,0.14)' }}
              />
            </Tooltip>

            {/* text input */}
            <Input
              ref={inputRef}
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
              placeholder="Мессежээ бичээрэй..."
              isDisabled={loading}
            />

            {/* send button (arrow icon) */}
            <Tooltip label="Илгээх" hasArrow>
              <IconButton
                aria-label="send"
                icon={<Icon as={MdSend} />}
                onClick={send}
                isLoading={loading}
                borderRadius="14px"
                h="52px"
                w="52px"
                bg={BRAND}
                color="white"
                _hover={{ opacity: 0.92 }}
                _active={{ opacity: 0.86 }}
              />
            </Tooltip>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}
