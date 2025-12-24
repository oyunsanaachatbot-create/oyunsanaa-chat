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
import { MdAutoAwesome, MdBolt, MdContentCopy, MdEdit, MdPerson } from 'react-icons/md';
import { OpenAIModel } from '@/types/types';

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

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const maxLen = 2000;

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const textColor = useColorModeValue('navy.700', 'white');
  const gray = useColorModeValue('gray.500', 'whiteAlpha.700');
  const assistantBg = useColorModeValue('gray.50', 'whiteAlpha.100');
  const userBg = useColorModeValue('white', 'whiteAlpha.100');

  // ✅ only ONE scroll container
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages.length, loading]);

  // ✅ keep focus
  useEffect(() => {
    inputRef.current?.focus();
  }, [loading]);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    if (trimmed.length > maxLen) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    };
    const assistantId = crypto.randomUUID();

    setMessages((p) => [...p, userMsg, { id: assistantId, role: 'assistant', content: '' }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chatAPI', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputCode: trimmed, model }),
      });

      if (!res.body) return;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value || new Uint8Array(), { stream: true });
        setMessages((p) =>
          p.map((m) => (m.id === assistantId ? { ...m, content: acc } : m)),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex direction="column" h="100dvh" position="relative">
      {/* background */}
      <Img
        src={Bg}
        position="absolute"
        inset="0"
        m="auto"
        w="320px"
        opacity={0.08}
        pointerEvents="none"
      />

      {/* HEADER / MODEL SELECT */}
      <Flex gap="10px" p="16px" zIndex={1}>
        <Button
          variant={model === 'gpt-3.5-turbo' ? 'solid' : 'outline'}
          onClick={() => setModel('gpt-3.5-turbo')}
        >
          <Icon as={MdAutoAwesome} mr="6px" /> GPT-3.5
        </Button>
        <Button
          variant={model === 'gpt-4o' ? 'solid' : 'outline'}
          onClick={() => setModel('gpt-4o')}
        >
          <Icon as={MdBolt} mr="6px" /> GPT-4o
        </Button>
      </Flex>

      {/* MESSAGES (ONLY SCROLL AREA) */}
      <Flex
        ref={listRef}
        direction="column"
        flex="1"
        overflowY="auto"
        px="16px"
        gap="12px"
      >
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <Flex key={m.id} gap="12px">
              <Icon
                as={isUser ? MdPerson : MdAutoAwesome}
                color={isUser ? BRAND : 'white'}
              />
              <Box
                bg={isUser ? userBg : assistantBg}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="16px"
                p="12px"
                w="100%"
              >
                <Text whiteSpace="pre-wrap">{m.content}</Text>
              </Box>
            </Flex>
          );
        })}
      </Flex>

      {/* INPUT (NOT FIXED — FLEX SAFE) */}
      <Box
        borderTop="1px solid"
        borderColor={borderColor}
        p="12px"
        bg={useColorModeValue('white', 'navy.900')}
      >
        <Flex gap="8px">
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
            placeholder="Мессежээ бичээрэй…"
            isDisabled={loading}
          />
          <Button bg={BRAND} color="white" onClick={send} isLoading={loading}>
            Илгээх
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}
