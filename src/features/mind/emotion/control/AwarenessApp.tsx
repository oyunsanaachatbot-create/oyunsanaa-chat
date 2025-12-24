'use client';

import React, { useMemo, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Badge,
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
import { Sparkles } from 'lucide-react';

type Lang = 'mn' | 'en' | 'ru' | 'ja' | 'ko';

type Section = {
  id: string;
  title: string;
  paragraphs: string[];
};

const CONTENT: Record<
  Lang,
  {
    tag: string;
    h1a: string;
    h1b: string;
    intro: string;
    sections: Section[];
  }
> = {
  mn: {
    tag: 'Сэтгэл хөдөл',
    h1a: 'Сэтгэл дотроо юу болж',
    h1b: 'байгааг мэдэрч суръя',
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
        paragraphs: [
          'Мэдрэмжүүдийг баяр, гуниг, айдас, уур гэсэн үндсэн бүлгүүдэд хуваадаг.',
          'Эдгээр нь олон нарийн өнгө аястай.',
        ],
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

  // UI-ийн орчуулгууд (хаанаас lang авахыг дараа нь холбоно)
  en: { tag: 'Emotions', h1a: 'Learn to notice', h1b: 'what’s happening inside', intro: 'Start observing, naming, and understanding your inner state.', sections: [] },
  ru: { tag: 'Эмоции', h1a: 'Учимся замечать', h1b: 'что происходит внутри', intro: 'Начните наблюдать, называть и понимать своё состояние.', sections: [] },
  ja: { tag: '感情', h1a: '心の中で起きていることに', h1b: '気づく練習をしよう', intro: '内面を観察し、名前をつけ、理解する習慣を始めます。', sections: [] },
  ko: { tag: '감정', h1a: '내 안에서 무엇이 일어나는지', h1b: '느끼는 법을 배워요', intro: '관찰하고 이름 붙이고 이해하는 습관을 시작합니다.', sections: [] },
};

function getLangFromUrl(): Lang {
  if (typeof window === 'undefined') return 'mn';
  const p = new URLSearchParams(window.location.search);
  const raw = (p.get('lang') || 'mn').toLowerCase();
  if (raw === 'en' || raw === 'ru' || raw === 'ja' || raw === 'ko' || raw === 'mn') return raw;
  return 'mn';
}

export default function AwarenessApp() {
  const lang = useMemo(() => getLangFromUrl(), []);
  const t = CONTENT[lang];

  // ✅ Theme-тэй чинь нийцсэн “glass card”
  const cardBg = useColorModeValue('white', 'rgba(255,255,255,0.06)');
  const borderCol = useColorModeValue('gray.200', 'whiteAlpha.200');
  const titleText = useColorModeValue('navy.900', 'gray.50');
  const softText = useColorModeValue('gray.600', 'gray.300');
  const panelText = useColorModeValue('gray.700', 'gray.200');

  const [openIndex, setOpenIndex] = useState<number | number[]>(-1);

  // ✅ MN хувилбаргүй хэлнүүдэд fallback (одоохондоо)
  const sections = t.sections.length ? t.sections : CONTENT.mn.sections;

  return (
    <Flex justify="center" w="full" px={{ base: 4, md: 6 }} py={{ base: 6, md: 8 }}>
      <Box
        w="full"
        maxW="3xl"
        bg={cardBg}
        border="1px solid"
        borderColor={borderCol}
        borderRadius="24px"
        boxShadow={useColorModeValue('0 18px 60px rgba(0,0,0,.08)', '0 18px 60px rgba(0,0,0,.28)')}
        backdropFilter="blur(18px)"
        p={{ base: 5, md: 6 }}
      >
        {/* Intro */}
        <VStack align="start" spacing={3}>
          <Badge
            px={3}
            py={1}
            borderRadius="999px"
            variant="subtle"
            bg={useColorModeValue('brand.50', 'rgba(31,111,178,0.16)')}
            color={useColorModeValue('brand.700', 'brand.100')}
            display="inline-flex"
            alignItems="center"
            gap={2}
            fontSize="xs"
          >
            <Sparkles size={14} />
            {t.tag}
          </Badge>

          <Text fontSize={{ base: '28px', md: '38px' }} fontWeight="400" color={titleText} lineHeight="1.15">
            {t.h1a}
            <br />
            {t.h1b}
          </Text>

          <Text fontSize="sm" color={softText} lineHeight="1.75">
            {t.intro}
          </Text>
        </VStack>

        <Divider my={5} opacity={useColorModeValue(0.6, 0.18)} />

        {/* Accordion */}
        <Accordion allowToggle index={openIndex} onChange={(idx) => setOpenIndex(idx as any)} reduceMotion>
          {sections.map((item, idx) => (
            <AccordionItem
              key={item.id}
              border="1px solid"
              borderColor={borderCol}
              borderRadius="16px"
              overflow="hidden"
              mb={3}
              bg={useColorModeValue('gray.50', 'rgba(255,255,255,0.04)')}
            >
              <h2>
                <AccordionButton px={4} py={3} _hover={{ bg: useColorModeValue('gray.100', 'rgba(255,255,255,0.06)') }}>
                  <HStack spacing={3} flex="1" textAlign="left" minW={0}>
                    <Box
                      w="28px"
                      h="28px"
                      borderRadius="999px"
                      bg={useColorModeValue('brand.50', 'rgba(31,111,178,0.14)')}
                      border="1px solid"
                      borderColor={useColorModeValue('brand.100', 'rgba(31,111,178,0.25)')}
                      display="grid"
                      placeItems="center"
                      flex="0 0 auto"
                    >
                      <Text fontSize="xs" fontWeight="800" color={useColorModeValue('brand.700', 'brand.200')}>
                        {idx + 1}
                      </Text>
                    </Box>

                    <Text fontSize="sm" fontWeight="700" color={titleText} noOfLines={1}>
                      {item.title}
                    </Text>
                  </HStack>

                  <AccordionIcon />
                </AccordionButton>
              </h2>

              <AccordionPanel px={4} pb={4} pt={2}>
                <VStack align="start" spacing={2}>
                  {item.paragraphs.map((p, i) => (
                    <Text key={i} fontSize="sm" color={panelText} lineHeight="1.8">
                      {p}
                    </Text>
                  ))}
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>

        <Text mt={4} fontSize="xs" color={softText}>
          lang: <b>{lang}</b> (URL дээр `?lang=mn|en|ru|ja|ko`)
        </Text>
      </Box>
    </Flex>
  );
}
