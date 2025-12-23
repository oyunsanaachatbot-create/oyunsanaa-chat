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
        position="abso
