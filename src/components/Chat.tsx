'use client';
/* eslint-disable */

import { OpenAIModel } from '@/types/types';
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Img,
  Text,
  Textarea,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MdAttachFile,
  MdAutoAwesome,
  MdClose,
  MdContentCopy,
  MdEdit,
  MdPerson,
  MdSend,
} from 'react-icons/md';

const Bg = '/img/chat/bg-image.png';
const BRAND = '#1F6FB2';

type ChatMessage = { id: string; role: 'user' | 'assistant'; content: string };

export default function Chat() {
  const [model] = useState<OpenAIModel>('gpt-4o');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // attachment
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const maxLen = useMemo(() => 4000, []);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // input autosize control
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const textColor = useColorModeValue('navy.800', 'white');
  const subText = useColorModeValue('gray.500', 'whiteAlpha.700');
  const pageBg = useColorModeValue('white', 'navy.900');

  const userBubbleBg = useColorModeValue('white', 'whiteAlpha.100');
  const assistantTextBg = 'transparent';

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages.length, loading]);

  useEffect(() => {
    // cleanup preview url
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
    if (!file.type.startsWith('image/')) return;

    // size limit 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('Зураг хэт том байна (5MB-с бага байгаарай).');
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

  // Textarea autosize (SDK style)
  const autosize = () => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = '0px';
    const next = Math.min(el.scrollHeight, 140); // max ~6 lines
    el.style.height = `${next}px`;
  };

  useEffect(() => {
    autosize();
  }, [input]);

  const send = async () => {
    const trimmed = input.trim();
    const hasText = !!trimmed;
    const hasImage = !!imageFile;

    if ((!hasText && !hasImage) || loading) return;
    if (hasText && trimmed.length > maxLen) return;

    const userId = crypto.randomUUID();
    const assistantId = crypto.randomUUID();

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

      // image -> FormData, text only -> JSON
      if (hasImage) {
        const fd = new FormData();
        fd.append('model', model);
        fd.append('inputCode', trimmed || '');
        fd.append('image', imageFile as File);

        res = await fetch('/api/chatAPI', { method: 'POST', body: fd });
      } else {
        res = await fetch('/api/chatAPI', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inputCode: trimmed, model }),
        });
      }

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
      setTimeout(() => taRef.current?.focus(), 0);
    }
  };

  return (
    <Flex direction="column" h="100dvh" w="100%" bg={pageBg}>
      {/* background mark */}
      <Img
        src={Bg}
        position="fixed"
        w={{ base: '220px', md: '350px' }}
        left="50%"
        top="45%"
        transform="translate(-50%, -50%)"
        opacity={0.06}
        pointerEvents="none"
        zIndex={0}
      />

      {/* Messages area */}
      <Flex
        ref={scrollRef}
        direction="column"
        flex="1"
        minH="0"
        overflowY="auto"
        zIndex={1}
        px={{ base: '14px', md: '0px' }}
        pt="18px"
        pb="18px"
      >
        <Flex direction="column" mx="auto" w="100%" maxW="920px" gap="14px">
          {messages.length === 0 ? (
            <Flex direction="column" align="center" justify="center" mt="18px">
              <Text color={textColor} fontWeight="800" fontSize="lg">
                Сайн уу? 🙂
              </Text>
              <Text color={subText} fontSize="sm" textAlign="center" mt="6px" maxW="520px">
                Сэтгэлийн туслагч Oyunsanaa байна. Юугаар туслах вэ?
              </Text>
            </Flex>
          ) : (
            messages.map((m) => {
              const isUser = m.role === 'user';

              return (
                <Flex
                  key={m.id}
                  w="100%"
                  justify={isUser ? 'flex-end' : 'flex-start'}
                  align="flex-start"
                  gap="10px"
                >
                  {/* assistant avatar (left only) */}
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

                  {/* message body */}
                  <Flex
                    role="group"
                    direction="column"
                    maxW={isUser ? '720px' : '860px'}
                    w="100%"
                    bg={isUser ? userBubbleBg : assistantTextBg}
                    border={isUser ? '1px solid' : 'none'}
                    borderColor={isUser ? borderColor : 'transparent'}
                    borderRadius={isUser ? '18px' : '0px'}
                    px={isUser ? '14px' : '0px'}
                    py={isUser ? '12px' : '0px'}
                  >
                    <Text
                      color={textColor}
                      fontWeight={isUser ? '600' : '500'}
                      fontSize={{ base: 'sm', md: 'md' }}
                      lineHeight={{ base: '22px', md: '24px' }}
                      whiteSpace="pre-wrap"
                      wordBreak="break-word"
                    >
                      {m.content}
                    </Text>

                    {/* small actions (SDK-like) */}
                    <Flex
                      mt={isUser ? '8px' : '6px'}
                      justify={isUser ? 'flex-end' : 'flex-start'}
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
                            onClick={() => {
                              setInput(m.content);
                              setTimeout(() => taRef.current?.focus(), 0);
                            }}
                            _hover={{ bg: 'rgba(31,111,178,0.08)', color: BRAND }}
                            _active={{ bg: 'rgba(31,111,178,0.14)' }}
                          >
                            <Icon as={MdEdit} boxSize="14px" color={subText} />
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
                          <Icon as={MdContentCopy} boxSize="14px" color={subText} />
                        </Button>
                      </Tooltip>
                    </Flex>
                  </Flex>

                  {/* user avatar (right) */}
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
            })
          )}
        </Flex>
      </Flex>

      {/* Composer (SDK style) */}
      <Box
        position="sticky"
        bottom="0"
        zIndex={2}
        borderTop="1px solid"
        borderColor={borderColor}
        bg={pageBg}
        pb="calc(env(safe-area-inset-bottom) + 12px)"
      >
        <Flex w="100%" maxW="920px" mx="auto" px={{ base: '14px', md: '0px' }} py="12px" direction="column" gap="10px">
          {/* attachment preview (standard: above input) */}
          {imagePreview && (
            <Flex
              align="center"
              justify="space-between"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="16px"
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
                  <Text fontSize="xs" color={subText} noOfLines={1}>
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

          <Flex
            border="1px solid"
            borderColor={borderColor}
            borderRadius="18px"
            px="10px"
            py="10px"
            align="flex-end"
            gap="8px"
            bg={useColorModeValue('white', 'whiteAlpha.50')}
          >
            {/* hidden file input */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => onFileChange(e.target.files?.[0] || null)}
            />

            <Tooltip label="Зураг хавсаргах" hasArrow>
              <IconButton
                aria-label="attach"
                icon={<Icon as={MdAttachFile} />}
                onClick={pickImage}
                isDisabled={loading}
                variant="ghost"
                borderRadius="14px"
                h="40px"
                w="40px"
                _hover={{ bg: 'rgba(31,111,178,0.08)', color: BRAND }}
                _active={{ bg: 'rgba(31,111,178,0.14)' }}
              />
            </Tooltip>

            {/* textarea (autosize + scroll after max) */}
            <Textarea
              ref={taRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Мессеж бичээрэй…"
              resize="none"
              rows={1}
              minH="40px"
              maxH="140px"
              overflowY="auto"
              border="none"
              px="6px"
              py="8px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              _placeholder={{ color: subText }}
              _focus={{ boxShadow: 'none' }}
              isDisabled={loading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />

            <Tooltip label="Илгээх" hasArrow>
              <IconButton
                aria-label="send"
                icon={<Icon as={MdSend} />}
                onClick={send}
                isLoading={loading}
                borderRadius="14px"
                h="40px"
                w="40px"
                bg={BRAND}
                color="white"
                _hover={{ opacity: 0.92 }}
                _active={{ opacity: 0.86 }}
              />
            </Tooltip>
          </Flex>

          <Text fontSize="xs" color={subText} textAlign="center">
            Enter = илгээх · Shift+Enter = шинэ мөр
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}
