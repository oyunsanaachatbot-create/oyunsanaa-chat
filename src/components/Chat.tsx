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
  MdThumbDownOffAlt,
  MdThumbUpOffAlt,
} from 'react-icons/md';
import { createClient } from '@supabase/supabase-js';

const Bg = '/img/chat/bg-image.png';
const BRAND = '#1F6FB2';

// ✅ Supabase client (browser)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
};

export default function Chat() {
  const [model] = useState<OpenAIModel>('gpt-4o');

  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // attachment
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(''); // objectURL

  // copied hint
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const maxLen = useMemo(() => 4000, []);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const textColor = useColorModeValue('navy.800', 'white');
  const subText = useColorModeValue('gray.500', 'whiteAlpha.700');
  const safePageBg = useColorModeValue('white', 'navy.900');
  const composerBg = useColorModeValue('white', 'whiteAlpha.50');
  const hintBg = useColorModeValue('blackAlpha.800', 'whiteAlpha.200');

  // ✅ Header-ээс болоод эхний мессеж даруулахгүй padding
  // Танай header өндөр өөр байж магадгүй тул арай generous тавилаа.
  const TOP_SAFE = { base: '120px', md: '24px' };

  // ✅ Fixed composer өндөр (approx) — доод хэсэгт messages дарагдахгүй
  const BOTTOM_SAFE = { base: '140px', md: '120px' };

  // keep focus
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

  // autosize
  const autosize = () => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = '0px';
    const next = Math.min(el.scrollHeight, 140);
    el.style.height = `${next}px`;
  };
  useEffect(() => autosize(), [input]);

  // cleanup objectURL
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showCopied = (id: string) => {
    setCopiedId(id);
    window.setTimeout(() => setCopiedId((p) => (p === id ? null : p)), 900);
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showCopied(id);
    } catch {}
  };

  const clearComposer = () => {
    setImageFile(null);
    setImagePreview('');
    const el = document.getElementById('oy-attach-input') as HTMLInputElement | null;
    if (el) el.value = '';
  };

  const removeComposer = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    clearComposer();
  };

  const onFileChange = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) return;

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const ActionBtn = (props: { icon: any; aria: string; onClick: () => void }) => (
    <IconButton
      aria-label={props.aria}
      icon={<Icon as={props.icon} boxSize="14px" />}
      variant="ghost"
      size="sm"
      borderRadius="999px"
      h="28px"
      w="28px"
      minW="28px"
      onClick={props.onClick}
      _hover={{ bg: 'rgba(31,111,178,0.10)' }}
      _active={{ bg: 'rgba(31,111,178,0.16)' }}
    />
  );

  // ✅ 1) Chat id автоматаар ол/үүсгэнэ
  // ✅ 2) History ачаална
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        setMessages([
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: 'Нэвтрээгүй байна (session алга). Дахин login хийнэ үү.',
          },
        ]);
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) {
        setMessages([
          { id: crypto.randomUUID(), role: 'assistant', content: 'User олдсонгүй. Дахин login хийнэ үү.' },
        ]);
        return;
      }

      // хамгийн сүүлийн chat-аа олно
      const { data: lastChat } = await supabase
        .from('chats')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    let cid: string | null = lastChat?.id ?? null;

     if (!cid) {
  const { data: newChat, error: chatErr } = await supabase
    .from('chats')
    .insert({ user_id: user.id, title: 'New chat' })
    .select('id')
    .single();

  if (chatErr || !newChat?.id) {
    setMessages([
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Chat үүсгэж чадсангүй: ${chatErr?.message || ''}`,
      },
    ]);
    return;
  }

  cid = newChat.id;
}

// 🔥 ЭНД cid 100% string болсон
setChatId(cid);

      // history ачаална
      const { data: rows } = await supabase
        .from('messages')
        .select('id, role, content, created_at')
        .eq('chat_id', cid)
        .order('created_at', { ascending: true })
        .limit(200);

      const mapped: ChatMessage[] = (rows || [])
        .filter((r: any) => r.role === 'user' || r.role === 'assistant')
        .map((r: any) => ({
          id: r.id,
          role: r.role,
          content: r.content || '',
        }));

      setMessages(mapped);
    })();
  }, []);

  const send = async () => {
    const trimmed = input.trim();
    const hasText = !!trimmed;
    const hasImage = !!imageFile;

    if (loading) return;
    if (!hasText && !hasImage) return;
    if (hasText && trimmed.length > maxLen) return;

    if (!chatId) {
      setMessages((p) => [
        ...p,
        { id: crypto.randomUUID(), role: 'assistant', content: 'Chat ID бэлэн биш байна. Дахин оролдоно уу.' },
      ]);
      return;
    }

    // ✅ session token (401 засна)
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) {
      setMessages((p) => [
        ...p,
        { id: crypto.randomUUID(), role: 'assistant', content: 'Нэвтрээгүй байна (token алга). Дахин login хийнэ үү.' },
      ]);
      return;
    }

    const userId = crypto.randomUUID();
    const assistantId = crypto.randomUUID();

    const messageImageUrl = hasImage ? imagePreview : undefined;

    setMessages((p) => [
      ...p,
      { id: userId, role: 'user', content: trimmed || '', imageUrl: messageImageUrl },
      { id: assistantId, role: 'assistant', content: '' },
    ]);

    if (hasImage) clearComposer();

    setInput('');
    setLoading(true);

    try {
      let res: Response;

      if (hasImage) {
        const fd = new FormData();
        fd.append('model', model);
        fd.append('inputCode', trimmed || '');
        fd.append('chat_id', chatId);            // ✅ chat_id явуулна
        fd.append('image', imageFile as File);

        res = await fetch('/api/chatAPI', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,   // ✅ token явуулна (401 арилна)
          },
          body: fd,
        });
      } else {
        res = await fetch('/api/chatAPI', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,   // ✅ token явуулна (401 арилна)
          },
          body: JSON.stringify({
            chat_id: chatId,                    // ✅ chat_id явуулна
            inputCode: trimmed,
            model,
          }),
        });
      }

      if (!res.ok) {
        const t = await res.text().catch(() => '');
        setMessages((p) =>
          p.map((m) =>
            m.id === assistantId ? { ...m, content: `API error: ${t || res.status}` } : m
          )
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
    <Flex direction="column" h="100dvh" w="100%" bg={safePageBg}>
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

      {/* ✅ Scroll area */}
      <Flex
        ref={scrollRef}
        direction="column"
        flex="1"
        minH="0"
        overflowY="auto"
        zIndex={1}
        px={{ base: '14px', md: '0px' }}
        pt={TOP_SAFE}          // ✅ header дор орохгүй
        pb={BOTTOM_SAFE}       // ✅ fixed composer дээр даруулахгүй
        scrollPaddingTop="140px"
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
                <Flex key={m.id} w="100%" justify={isUser ? 'flex-end' : 'flex-start'} align="flex-start" gap="10px">
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
                    {!!m.imageUrl && (
                      <Box
                        alignSelf={isUser ? 'flex-end' : 'flex-start'}
                        mb="8px"
                        borderRadius="16px"
                        overflow="hidden"
                        border="1px solid"
                        borderColor={borderColor}
                        maxW="260px"
                      >
                        <Img src={m.imageUrl} w="100%" h="auto" objectFit="cover" alt="sent image" />
                      </Box>
                    )}

                    {!!m.content && (
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
                    )}

                    <Flex
                      mt="6px"
                      justify={isUser ? 'flex-end' : 'flex-start'}
                      gap="6px"
                      opacity={0}
                      transition="opacity 0.15s ease"
                      _groupHover={{ opacity: 1 }}
                      sx={{ '@media (hover: none)': { opacity: 1 } }}
                      align="center"
                    >
                      {isUser ? (
                        <>
                          <ActionBtn
                            icon={MdEdit}
                            aria="edit"
                            onClick={() => {
                              setInput(m.content || '');
                              taRef.current?.focus();
                            }}
                          />
                          <ActionBtn icon={MdContentCopy} aria="copy" onClick={() => copyToClipboard(m.content || '', m.id)} />
                        </>
                      ) : (
                        <>
                          <ActionBtn icon={MdContentCopy} aria="copy" onClick={() => copyToClipboard(m.content || '', m.id)} />
                          <ActionBtn icon={MdThumbUpOffAlt} aria="like" onClick={() => console.log('like', m.id)} />
                          <ActionBtn icon={MdThumbDownOffAlt} aria="dislike" onClick={() => console.log('dislike', m.id)} />
                        </>
                      )}

                      {copiedId === m.id && (
                        <Box px="8px" py="3px" borderRadius="999px" bg={hintBg} color="white" fontSize="xs" lineHeight="1">
                          Хууллаа
                        </Box>
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
            })
          )}
        </Flex>
      </Flex>

      {/* ✅ Composer fixed (савлахгүй) */}
      <Box
        position="fixed"
        left="0"
        right="0"
        bottom="0"
        zIndex={20}
        borderTop="1px solid"
        borderColor={borderColor}
        bg={safePageBg}
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
            onMouseDown={() => taRef.current?.focus()}
          >
            <input
              id="oy-attach-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => onFileChange(e.target.files?.[0] || null)}
            />

            <Box as="label" htmlFor="oy-attach-input" m="0" cursor={loading ? 'not-allowed' : 'pointer'}>
              <IconButton
                aria-label="attach"
                icon={<Icon as={MdAttachFile} boxSize="18px" />}
                isDisabled={loading}
                variant="ghost"
                borderRadius="14px"
                h="40px"
                w="40px"
                pointerEvents="none"
              />
            </Box>

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
                  icon={<Icon as={MdClose} boxSize="12px" />}
                  size="xs"
                  variant="solid"
                  position="absolute"
                  top="4px"
                  right="4px"
                  h="20px"
                  w="20px"
                  minW="20px"
                  p="0"
                  borderRadius="999px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  onClick={removeComposer}
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
              icon={<Icon as={MdSend} boxSize="18px" />}
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
