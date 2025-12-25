'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
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
  VStack,
  HStack,
} from '@chakra-ui/react';
import { Brain, MessageCircle, Sparkles, Check } from 'lucide-react';

type Lang = 'mn' | 'en' | 'ru' | 'ja' | 'ko';

type Section = { id: string; title: string; paragraphs: string[] };

const SECTIONS: Section[] = [
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
    paragraphs: ['Өдөрт 2–3 удаа 1 минут зав гаргаад “Одоо би юу мэдэрч байна?” гэж өөрөөсөө асуугаарай.', 'Мэдрэмжээ богино тэмдэглэл хэлбэрээр тэмдэглэвэл дадал нь илүү хурдан тогтоно.'],
  },
];

function getLangFromUrl(): Lang {
  if (typeof window === 'undefined') return 'mn';
  const p = new URLSearchParams(window.location.search);
  const raw = (p.get('lang') || 'mn').toLowerCase();
  if (raw === 'en' || raw === 'ru' || raw === 'ja' || raw === 'ko' || raw === 'mn') return raw as Lang;
  return 'mn';
}

export default function AwarenessApp() {
  const lang = useMemo(() => getLangFromUrl(), []);
  const [openIndex, setOpenIndex] = useState<number | number[]>(-1);

  // ✅ Чиний хүссэн өнгө
  const BRAND = '#1F6FB2';
  const ALT = '#3E6F96';

  // ✅ Яг screenshot шиг фон (force)
  const PAGE_BG = `
    radial-gradient(900px 520px at 20% 15%, rgba(62,111,150,.28), transparent 60%),
    radial-gradient(900px 520px at 85% 25%, rgba(62,111,150,.18), transparent 62%),
    linear-gradient(135deg, #2a4663 0%, #335b7a 100%)
  `;

  // ✅ Яг screenshot шиг card/accordion өнгөнүүд (force)
  const CARD_BG = 'rgba(255,255,255,0.10)';
  const CARD_BORDER = 'rgba(255,255,255,0.16)';
  const ITEM_BG = 'rgba(255,255,255,0.08)';
  const ITEM_HOVER = 'rgba(255,255,255,0.10)';
  const ITEM_TOP_BORDER = 'rgba(255,255,255,0.10)';

  return (
    <Box
      minH="100vh"
      bgImage={PAGE_BG}
      bgAttachment="fixed"
      color="white"
      sx={{ '--brand': BRAND, '--brandRgb': '31,111,178', '--brandAlt': ALT } as any}
      px={{ base: 4, md: 6 }}
      py={{ base: 6, md: 8 }}
    >
      <Flex justify="center">
        <Box
          w="full"
          maxW="3xl"
          borderRadius="24px"
          border="1px solid"
          borderColor={CARD_BORDER}
          bg={CARD_BG}
          backdropFilter="blur(18px)"
          boxShadow="0 18px 60px rgba(0,0,0,.35)"
          p={{ base: 5, md: 6 }}
        >
          {/* Header */}
          <Flex align="center" justify="space-between" gap={3} mb={5}>
            <HStack spacing={2} minW={0}>
              <Box
                w="28px"
                h="28px"
                borderRadius="999px"
                display="grid"
                placeItems="center"
                border="1px solid"
                borderColor="rgba(62,111,150,.45)"
                bg="rgba(62,111,150,.18)"
              >
                <Brain size={16} color="var(--brand)" />
              </Box>

              <Text fontSize="sm" fontWeight="600" color="whiteAlpha.900" noOfLines={1}>
                Миний сэтгэлзүй
              </Text>
            </HStack>

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
              borderColor="rgba(255,255,255,0.18)"
              bg="rgba(255,255,255,0.10)"
              _hover={{ bg: 'rgba(255,255,255,0.16)' }}
            >
              <MessageCircle size={16} color="var(--brand)" />
              <Text fontSize="xs" color="whiteAlpha.900">
                Чат
              </Text>
            </Box>
          </Flex>

          {/* Intro */}
          <VStack align="start" spacing={3} mb={5}>
            <Badge
              px={3}
              py={1}
              borderRadius="999px"
              border="1px solid"
              borderColor="rgba(62,111,150,.35)"
              bg="rgba(62,111,150,.15)"
              color="var(--brand)"
              display="inline-flex"
              alignItems="center"
              gap={2}
              fontSize="xs"
              letterSpacing="0.14em"
              textTransform="uppercase"
            >
              <Sparkles size={14} />
              Сэтгэл хөдөл
            </Badge>

            <Text fontSize={{ base: '28px', md: '40px' }} fontWeight="300" lineHeight="1.15" color="whiteAlpha.900">
              Сэтгэл дотроо юу болж
              <br />
              байгааг мэдэрч суръя
            </Text>

            <Text fontSize="sm" color="whiteAlpha.700" lineHeight="1.75">
              Өөрийн дотоод хөдөлгөөнийг ажиглаж, нэрлэж, ойлгох дадлыг эндээс эхлүүлнэ.
            </Text>
          </VStack>

          {/* Accordion */}
          <Accordion allowToggle index={openIndex} onChange={(idx) => setOpenIndex(idx as any)} reduceMotion>
            {SECTIONS.map((item, idx) => (
              <AccordionItem
                key={item.id}
                border="1px solid"
                borderColor={CARD_BORDER}
                borderRadius="16px"
                overflow="hidden"
                mb={3}
                bg={ITEM_BG}
              >
                <h2>
                  <AccordionButton px={4} py={3} _hover={{ bg: ITEM_HOVER }}>
                    <HStack spacing={3} flex="1" textAlign="left" minW={0}>
                      <Box
                        w="28px"
                        h="28px"
                        borderRadius="999px"
                        border="1px solid"
                        borderColor="rgba(62,111,150,.45)"
                        bg="rgba(62,111,150,.18)"
                        display="grid"
                        placeItems="center"
                        flex="0 0 auto"
                      >
                        <Text fontSize="xs" fontWeight="800" color="var(--brand)">
                          {idx + 1}
                        </Text>
                      </Box>

                      <Text fontSize="sm" fontWeight="600" color="whiteAlpha.900" noOfLines={1}>
                        {item.title}
                      </Text>
                    </HStack>

                    <Box display="inline-flex" alignItems="center" gap={2}>
                      <Check size={16} color="var(--brand)" />
                      <AccordionIcon />
                    </Box>
                  </AccordionButton>
                </h2>

                <AccordionPanel px={4} pb={4} pt={2} borderTop="1px solid" borderColor={ITEM_TOP_BORDER}>
                  <VStack align="start" spacing={2}>
                    {item.paragraphs.map((p, i) => (
                      <Text key={i} fontSize="sm" color="whiteAlpha.800" lineHeight="1.75">
                        {p}
                      </Text>
                    ))}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>

          <Text mt={4} fontSize="xs" color="whiteAlpha.700">
            lang: <b>{lang}</b> (URL дээр `?lang=mn|en|ru|ja|ko`)
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
