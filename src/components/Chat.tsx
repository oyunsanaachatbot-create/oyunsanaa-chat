'use client';
/* eslint-disable */

import { OpenAIModel } from '@/types/types';
import {
  Box,
  Flex,
  Icon,
  IconButton,
  Img,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
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

  const toast = useToast();
  const maxLen = useMemo(() => 4000, []);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const textColor = useColorModeValue('navy.800', 'white');
  const subText = useColorModeValue('gray.500', 'whiteAlpha.700');
  const pageBg = useColorModeValue('white', 'navy.900');
  const composerBg = useColorModeValue('white', 'whiteAlpha.50');

  // always keep input focus when ready (fix "mouse click to activate")
  useEffect(() => {
    if (loading) return;
    const t = window.setTimeout(() => taRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [loading, messages.length]);

  // scroll bottom
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages.length, loading]);

  // autosize textarea
  const autosize = () => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = '0px';
    const next = Math.min(el.scrollHeight, 140);
    el.style.height = `${next}px`;
  };
  useEffect(() => autosize(), [input]);

  // cleanup preview url
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Хууллаа', status: 'success', duration: 1100, position: 'top' });
    } catch {
      toast({ title: 'Хуулах үед алдаа гарлаа', status: 'error', duration: 1500, position: 'top' });
    }
  };

  const onFileChange = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Зураг хэт том байна (5MB-с бага).', status: 'warning', duration: 1600, position: 'top' });
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
    const el = document.getElementById('oy-attach-input') as HTMLInputElement | null;
    if (el) el.value = '';
  };

  const send = async () => {
    const trimmed = input.trim();
    const hasText = !!trimmed;
    const hasImage = !!imageFile;

    if (loading) return;
    if (!hasText && !hasImage) return;
    if (hasText && trimmed.length > maxLen) return;

    const userId = crypto.randomUUID();
    const assistantId = crypto.randomUUID();

    const userContent =
      hasText && hasImage ? `${trimmed}\n\n[Зураг хавсаргасан]` : hasImage ? `[Зураг хавсаргасан]` : trimmed;

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
          p.map((m) => (m.id === assistantId ? { ...m, content: `API error: ${t || res.status}` } : m)),
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
      taRef.current?.focus();
    }
  };

  return (
    <Flex direction="column" h="100dvh" w="100%" bg={pageBg}>
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

      {/* Messages */}
      <Flex
        ref={scrollRef}
        direction="column"
        flex="1"
        minH="0"
        overflowY="auto"
        zIndex={1}
        px={{ base: '14px', md: '0px' }}
        pt={{ base: '90px', md: '18px' }}
        pb="18px"
      >
        <Flex direction="column" mx="auto" w="100%" maxW="920px" gap="14px">
          {messages.length === 0 ? (
            <Flex direction="column" align="center" justify="center" mt="18px">
              <Text color={textColor} fontWeight="900" fontSize={{ base: 'lg', md: 'xl' }}>
                Сайн уу, Oyunsanaa энд байна 🙂
              </Text>
              <Text color={subText} fontSize={{ base: 'sm', md: 'md' }} textAlign="center" mt="6px" maxW="560px">
                Юу мэдэрч байгаагаа 1 өгүүлбэрээр хэлээд эхлээрэй. Би тайвнаар, ойлгомжтойгоор тусална.
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

                  {/* clean, no box */}
                  <Flex role="group" direction="column" maxW="860px" w="100%">
                    <Text
                      color={textColor}
                      fontWeight={isUser ? '700' : '500'}
                      fontSize={{ base: 'sm', md: 'md' }}
                      lineHeight={{ base: '22px', md: '24px' }}
                      whiteSpace="pre-wrap"
                      wordBreak="break-word"
                      textAlign={isUser ? 'right' : 'left'}
                    >
                      {m.content}
                    </Text>

                    <Flex
                      mt="6px"
                      justify={isUser ? 'flex-end' : 'flex-start'}
                      gap="6px"
                      opacity={0}
                      transition="opacity 0.15s ease"
                      _groupHover={{ opacity: 1 }}
                      sx={{ '@media (hover: none)': { opacity: 1 } }}
                    >
                      {isUser && (
                        <IconButton
                          aria-label="edit"
                          icon={<Icon as={MdEdit} />}
                          variant="ghost"
                          size="sm"
                          borderRadius="999px"
                          onClick={() => {
                            setInput(m.content);
                            taRef.current?.focus();
                          }}
                        />
                      )}
                      <IconButton
                        aria-label="copy"
                        icon={<Icon as={MdContentCopy} />}
                        variant="ghost"
                        size="sm"
                        borderRadius="999px"
                        onClick={() => copyToClipboard(m.content)}
                      />
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
            })
          )}
        </Flex>
      </Flex>

      {/* Composer */}
      <Box
        position="sticky"
        bottom="0"
        zIndex={2}
        borderTop="1px solid"
        borderColor={borderColor}
        bg={pageBg}
        pb="calc(env(safe-area-inset-bottom) + 12px)"
      >
        <Flex w="100%" maxW="920px" mx="auto" px={{ base: '14px', md: '0px' }} py="12px">
          <Flex
            w="100%"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="18px"
            px="10px"
            py="10px"
            align="flex-end"
            gap="8px"
            bg={composerBg}
            onMouseDown={() => taRef.current?.focus()} // anywhere in composer focuses input
          >
            {/* hidden input */}
            <input
              id="oy-attach-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => onFileChange(e.target.files?.[0] || null)}
            />

            {/* attach (label is reliable) */}
            <Box as="label" htmlFor="oy-attach-input" m="0" cursor={loading ? 'not-allowed' : 'pointer'}>
              <IconButton
                aria-label="attach"
                icon={<Icon as={MdAttachFile} />}
                isDisabled={loading}
                variant="ghost"
                borderRadius="14px"
                h="40px"
                w="40px"
                pointerEvents="none"
              />
            </Box>

            {/* preview inside composer (standard) */}
            {imagePreview && (
              <Box
                position="relative"
                w="44px"
                h="44px"
                flexShrink={0}
                borderRadius="12px"
                overflow="hidden"
                border="1px solid"
                borderColor={borderColor}
              >
                <Img src={imagePreview} w="100%" h="100%" objectFit="cover" alt="attachment" />
                <IconButton
                  aria-label="remove image"
                  icon={<Icon as={MdClose} />}
                  size="xs"
                  variant="solid"
                  position="absolute"
                  top="4px"
                  right="4px"
                  borderRadius="999px"
                  onClick={clearImage}
                />
              </Box>
            )}

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
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}
