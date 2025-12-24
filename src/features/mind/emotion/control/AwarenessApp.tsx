'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box,
  Flex,
  Text,
  Badge,
  IconButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue,
  VStack,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { Brain, MessageCircle, Sparkles, X, ArrowLeft } from 'lucide-react';

type Lang = 'mn' | 'en' | 'ru' | 'ja' | 'ko';

type Section = {
  id: string;
  title: string;
  paragraphs: string[];
};

const CONTENT: Record<Lang, { brandTitle: string; chat: string; tag: string; h1a: string; h1b: string; intro: string; sections: Section[] }> =
  {
    mn: {
      brandTitle: 'Миний сэтгэлзүй',
      chat: 'Чат',
      tag: 'Сэтгэл хөдлөл',
      h1a: 'Сэтгэл дотроо юу болж',
      h1b: 'байгааг мэдэрч сурья',
      intro: 'Өөрийн дотоод хөдөлгөөнийг ажиглаж, нэрлэж, ойлгох дадлыг эндээс эхлүүлнэ.',
      sections: [
        {
          id: 'what',
          title: 'Мэдрэхүй гэж юу вэ?',
          paragraphs: [
            'Бид өдөрт олон зуун жижиг сэтгэгдэл, мэдрэмжийг мэдэрдэг ч ихэнхийг нь анзааралгүй өнгөрөөдөг.',
            '“Зүгээр дээ” гэж өнгөрөөх биш, “Одоо би түгшиж байна” гэж өөртөө тодорхой хэлж сурах нь чухал.',
          ],
        },
        {
          id: 'types',
          title: 'Ямар ямар мэдрэмжүүд байдаг вэ?',
          paragraphs: ['Мэдрэмжүүдийг баяр, гуниг, айдас, уур гэсэн үндсэн бүлгүүдэд хуваадаг.', 'Эдгээр нь олон нарийн өнгө аястай.'],
        },
        {
          id: 'understand',
          title: 'Юуг ойлгох ёстой вэ?',
          paragraphs: ['Мэдрэмж бол тушаал биш, мэдээлэл юм.', 'Тэднийг уншиж сурвал реакц биш сонголт хийдэг болно.'],
        },
        {
          id: 'skills',
          title: 'Юуг эзэмшиж сурах вэ?',
          paragraphs: [
            'Эхний ур чадвар бол ажиглалт — юу болж байгааг шүүлтгүйгээр анзаарах.',
            'Дараагийнх нь нэршил — мэдрэмжээ ерөнхий биш, илүү тодорхой нэрлэх (ж: “түгшсэн”, “гомдсон”, “ичсэн”).',
            'Гурав дахь нь өөртөө эелдэг хандах чадвар: өөрийгөө буруутгахын оронд ойлгож хүлээн зөвшөөрөх дадал.',
          ],
        },
        {
          id: 'habits',
          title: 'Хэрхэн дадал болгох вэ?',
          paragraphs: [
            'Өдөрт 2–3 удаа 1 минут зав гаргаад “Одоо би юу мэдэрч байна?” гэж өөрөөсөө асуугаарай.',
            'Мэдрэмжээ богино тэмдэглэл хэлбэрээр тэмдэглэвэл дадал нь илүү хурдан тогтоно.',
          ],
        },
      ],
    },

    // ✅ UI текстийн орчуулгууд (дараа нь lang-аа хаанаас авахыг холбоно)
    en: {
      brandTitle: 'My Psychology',
      chat: 'Chat',
      tag: 'Emotions',
      h1a: 'Let’s learn to notice',
      h1b: 'what’s happening inside',
      intro: 'Start a habit of observing, naming, and understanding your inner state.',
      sections: [
        { id: 'what', title: 'What is awareness?', paragraphs: ['We feel hundreds of small emotions each day, but many pass unnoticed.', 'Naming it clearly (“I feel anxious now”) is a key step.'] },
        { id: 'types', title: 'What emotions exist?', paragraphs: ['Often grouped into joy, sadness, fear, anger.', 'Each has many subtle shades.'] },
        { id: 'understand', title: 'What should you understand?', paragraphs: ['Emotions are information, not commands.', 'Reading them helps you choose, not react.'] },
        { id: 'skills', title: 'What skills to build?', paragraphs: ['Observe without judgment.', 'Name emotions more precisely.', 'Treat yourself kindly instead of blaming.'] },
        { id: 'habits', title: 'How to make it a habit?', paragraphs: ['Ask yourself 2–3 times: “What do I feel now?”', 'Brief notes make the habit stick faster.'] },
      ],
    },
    ru: {
      brandTitle: 'Моя психология',
      chat: 'Чат',
      tag: 'Эмоции',
      h1a: 'Учимся замечать',
      h1b: 'что происходит внутри',
      intro: 'Начните привычку наблюдать, называть и понимать своё внутреннее состояние.',
      sections: [
        { id: 'what', title: 'Что такое осознанность?', paragraphs: ['Мы испытываем сотни эмоций в день, но многие проходят незаметно.', 'Важно уметь назвать: “Сейчас я тревожусь”.'] },
        { id: 'types', title: 'Какие бывают эмоции?', paragraphs: ['Часто выделяют радость, грусть, страх, злость.', 'У каждой много оттенков.'] },
        { id: 'understand', title: 'Что важно понять?', paragraphs: ['Эмоции — это информация, а не приказ.', 'Так вы выбираете, а не реагируете.'] },
        { id: 'skills', title: 'Какие навыки развивать?', paragraphs: ['Наблюдать без оценки.', 'Называть эмоции точнее.', 'Быть к себе добрее.'] },
        { id: 'habits', title: 'Как сделать привычкой?', paragraphs: ['2–3 раза в день спросите: “Что я чувствую?”', 'Короткие заметки помогают закрепить.'] },
      ],
    },
    ja: {
      brandTitle: 'わたしの心理',
      chat: 'チャット',
      tag: '感情',
      h1a: '心の中で起きていることに',
      h1b: '気づく練習をしよう',
      intro: '内面を観察し、名前をつけ、理解する習慣をここから始めます。',
      sections: [
        { id: 'what', title: '気づきとは？', paragraphs: ['私たちは毎日たくさんの感情を感じますが、多くは見過ごしがちです。', '「今、不安だ」と言語化することが大切です。'] },
        { id: 'types', title: 'どんな感情がある？', paragraphs: ['喜び・悲しみ・恐れ・怒りなどに分類されます。', 'さらに細かなニュアンスがあります。'] },
        { id: 'understand', title: '理解すべきこと', paragraphs: ['感情は命令ではなく情報です。', '読み取れれば反応ではなく選択ができます。'] },
        { id: 'skills', title: '身につけるスキル', paragraphs: ['判断せずに観察する。', 'より具体的に名前をつける。', '自分に優しくする。'] },
        { id: 'habits', title: '習慣化するには', paragraphs: ['1分でいいので「今何を感じる？」と自分に聞く。', '短いメモが習慣化を助けます。'] },
      ],
    },
    ko: {
      brandTitle: '나의 심리',
      chat: '챗',
      tag: '감정',
      h1a: '내 안에서 무엇이 일어나는지',
      h1b: '느끼는 법을 배워요',
      intro: '내면을 관찰하고 이름 붙이고 이해하는 습관을 여기서 시작합니다.',
      sections: [
        { id: 'what', title: '자각이란?', paragraphs: ['우리는 하루에도 많은 감정을 느끼지만 대부분은 지나칩니다.', '“지금 불안해”처럼 명확히 말하는 연습이 중요해요.'] },
        { id: 'types', title: '어떤 감정이 있나?', paragraphs: ['기쁨·슬픔·두려움·분노 등으로 분류합니다.', '그 안에 많은 뉘앙스가 있어요.'] },
        { id: 'understand', title: '무엇을 이해해야 하나?', paragraphs: ['감정은 명령이 아니라 정보입니다.', '읽어내면 반응이 아니라 선택을 하게 됩니다.'] },
        { id: 'skills', title: '어떤 기술을 익힐까?', paragraphs: ['판단 없이 관찰하기.', '더 정확히 이름 붙이기.', '자기비난 대신 친절하게 대하기.'] },
        { id: 'habits', title: '습관으로 만드는 법', paragraphs: ['하루 2–3번 “지금 무엇을 느끼지?”라고 묻기.', '짧게 기록하면 더 빨리 자리잡아요.'] },
      ],
    },
  };

function getLangFromUrl(): Lang {
  if (typeof window === 'undefined') return 'mn';
  const p = new URLSearchParams(window.location.search);
  const raw = (p.get('lang') || 'mn').toLowerCase();
  if (raw === 'en' || raw === 'ru' || raw === 'ja' || raw === 'ko' || raw === 'mn') return raw;
  return 'mn';
}

export default function AwarenessApp() {
  const router = useRouter();

  // ✅ glass + brand look
  const cardBg = useColorModeValue('rgba(255,255,255,0.70)', 'rgba(10,15,25,0.55)');
  const borderCol = useColorModeValue('rgba(0,0,0,0.08)', 'rgba(255,255,255,0.12)');
  const softText = useColorModeValue('gray.600', 'whiteAlpha.700');
  const titleText = useColorModeValue('gray.900', 'white');
  const panelText = useColorModeValue('gray.700', 'whiteAlpha.800');

  const lang = useMemo(() => getLangFromUrl(), []);
  const t = CONTENT[lang];

  const [openIndex, setOpenIndex] = useState<number | number[]>(-1);

  return (
    <Box
      minH="100vh"
      px={{ base: 4, md: 6 }}
      py={{ base: 6, md: 8 }}
      // ✅ brand color (memory: #1F6FB2)
      sx={{ '--brand': '#1F6FB2' } as any}
      bgGradient="linear(135deg, rgba(31,111,178,0.14) 0%, rgba(0,0,0,0) 40%), radial-gradient(900px 520px at 20% 15%, rgba(31,111,178,.22), transparent 60%), radial-gradient(900px 520px at 85% 25%, rgba(31,111,178,.14), transparent 62%)"
    >
      <Flex justify="center">
        <Box
          w="full"
          maxW="3xl"
          border="1px solid"
          borderColor={borderCol}
          bg={cardBg}
          backdropFilter="blur(18px)"
          borderRadius="24px"
          boxShadow="0 18px 60px rgba(0,0,0,.25)"
          p={{ base: 4, md: 5 }}
        >
          {/* Header */}
          <Flex align="center" justify="space-between" gap={3} mb={4}>
            <HStack spacing={2} minW={0}>
              <Box
                w="32px"
                h="32px"
                borderRadius="999px"
                display="grid"
                placeItems="center"
                border="1px solid"
                borderColor={borderCol}
                bg={useColorModeValue('rgba(31,111,178,.10)', 'rgba(31,111,178,.16)')}
              >
                <Brain size={16} color="var(--brand)" />
              </Box>

              <Text fontSize="sm" fontWeight="600" color={softText} noOfLines={1}>
                {t.brandTitle}
              </Text>
            </HStack>

            <HStack spacing={2}>
              {/* ✅ жижиг X / back (дээд bar дээр) */}
              <IconButton
                aria-label="Back"
                size="sm"
                variant="ghost"
                onClick={() => router.back()}
                icon={<ArrowLeft size={18} color="var(--brand)" />}
              />
              <IconButton
                aria-label="Close"
                size="sm"
                variant="ghost"
                onClick={() => router.push('/')}
                icon={<X size={18} color="var(--brand)" />}
              />

              <Box
                as={Link}
                href="/"
                display="inline-flex"
                alignItems="center"
                gap={2}
                px={3}
                py={2}
                borderRadius="999px"
                border="1px solid"
                borderColor={borderCol}
                bg={useColorModeValue('rgba(255,255,255,0.55)', 'rgba(255,255,255,0.06)')}
                _hover={{ opacity: 0.92 }}
              >
                <MessageCircle size={16} color="var(--brand)" />
                <Text fontSize="xs" fontWeight="600" color={softText}>
                  {t.chat}
                </Text>
              </Box>
            </HStack>
          </Flex>

          {/* Intro */}
          <VStack align="start" spacing={3} mb={4}>
            <Badge
              px={3}
              py={1}
              borderRadius="999px"
              variant="outline"
              borderColor={useColorModeValue('rgba(31,111,178,.28)', 'rgba(31,111,178,.35)')}
              color="var(--brand)"
              bg={useColorModeValue('rgba(31,111,178,.08)', 'rgba(31,111,178,.10)')}
              letterSpacing="0.18em"
              fontSize="10px"
              textTransform="uppercase"
              display="inline-flex"
              alignItems="center"
              gap={2}
            >
              <Sparkles size={14} />
              {t.tag}
            </Badge>

            <Text fontSize={{ base: '22px', md: '28px' }} fontWeight="300" color={titleText} lineHeight="1.2">
              {t.h1a}
              <br />
              {t.h1b}
            </Text>

            <Text fontSize="sm" color={softText} lineHeight="1.7">
              {t.intro}
            </Text>
          </VStack>

          <Divider opacity={useColorModeValue(0.25, 0.12)} my={4} />

          {/* Accordion (5 items) */}
          <Accordion
            allowToggle
            index={openIndex}
            onChange={(idx) => setOpenIndex(idx as any)}
            reduceMotion
          >
            {t.sections.map((item, idx) => (
              <AccordionItem
                key={item.id}
                border="1px solid"
                borderColor={borderCol}
                borderRadius="18px"
                overflow="hidden"
                mb={3}
              >
                <h2>
                  <AccordionButton
                    px={4}
                    py={3}
                    _hover={{ bg: useColorModeValue('rgba(0,0,0,0.03)', 'rgba(255,255,255,0.06)') }}
                  >
                    <HStack spacing={3} flex="1" textAlign="left" minW={0}>
                      <Box
                        w="26px"
                        h="26px"
                        borderRadius="999px"
                        border="1px solid"
                        borderColor={useColorModeValue('rgba(31,111,178,.32)', 'rgba(31,111,178,.35)')}
                        bg={useColorModeValue('rgba(31,111,178,.08)', 'rgba(31,111,178,.10)')}
                        display="grid"
                        placeItems="center"
                        flex="0 0 auto"
                      >
                        <Text fontSize="xs" fontWeight="700" color="var(--brand)">
                          {idx + 1}
                        </Text>
                      </Box>

                      <Text fontSize="sm" fontWeight="600" color={titleText} noOfLines={1}>
                        {item.title}
                      </Text>
                    </HStack>

                    <AccordionIcon />
                  </AccordionButton>
                </h2>

                <AccordionPanel px={4} pb={4} pt={2}>
                  <VStack align="start" spacing={2}>
                    {item.paragraphs.map((p, i) => (
                      <Text key={i} fontSize="sm" color={panelText} lineHeight="1.75">
                        {p}
                      </Text>
                    ))}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>

          {/* жижиг хэл солих hint (optional) */}
          <Text mt={4} fontSize="xs" color={softText}>
            lang: <b>{lang}</b> (URL дээр `?lang=mn|en|ru|ja|ko` гэж өгөөд шалгаж болно)
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
