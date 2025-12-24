'use client';

import { useMemo, useState } from 'react';
import NextLink from 'next/link';
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Brain, MessageCircle, Sparkles, Check, Search, X, ArrowLeft } from 'lucide-react';

type Section = { id: string; title: string; paragraphs: string[] };

const BRAND = 'var(--brand, #1F6FB2)';

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
      'Гурав дахь нь өөртөө эелдэг хандах: өөрийгөө буруутгахын оронд ойлгож хүлээн зөвшөөрөх дадал.',
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
];

export default function AwarenessApp() {
  const [q, setQ] = useState('');
  const [openId, setOpenId] = useState<string | null>('what');

  const pageBg = useColorModeValue('#F6FAFF', '#0A0F1A');
  const cardBg = useColorModeValue('rgba(255,255,255,0.72)', 'rgba(17,25,40,0.55)');
  const border = useColorModeValue('rgba(0,0,0,0.08)', 'rgba(255,255,255,0.12)');
  const textSub = useColorModeValue('blackAlpha.700', 'whiteAlpha.700');

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return SECTIONS;
    return SECTIONS.filter((s) => (s.title + ' ' + s.paragraphs.join(' ')).toLowerCase().includes(query));
  }, [q]);

  return (
    <Box minH="100vh" bg={pageBg} px={{ base: 4, md: 6 }} py={{ base: 5, md: 6 }}>
      <Box maxW="3xl" mx="auto">
        {/* жижиг header (Horizon-ийн том header-ийг орлохгүй, давхардахгүй) */}
        <Flex align="center" justify="space-between" mb={4}>
          <HStack spacing={2}>
            <Box
              w="34px"
              h="34px"
              borderRadius="999px"
              border="1px solid"
              borderColor={border}
              bg={cardBg}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={Brain as any} boxSize="18px" color={BRAND} />
            </Box>
            <Text fontWeight="700" fontSize="sm" opacity={0.85}>
              Миний сэтгэлзүй
            </Text>
          </HStack>

          <HStack spacing={2}>
            <Button
              as={NextLink}
              href="/"
              size="sm"
              variant="outline"
              borderColor={border}
              bg={cardBg}
              leftIcon={<Icon as={MessageCircle as any} boxSize="16px" color={BRAND} />}
            >
              Чат
            </Button>

            {/* page-level back (чиний хүссэн сум/Х-тэй адил) */}
            <Button
              size="sm"
              variant="outline"
              borderColor={border}
              bg={cardBg}
              onClick={() => history.back()}
              leftIcon={<Icon as={ArrowLeft as any} boxSize="16px" color={BRAND} />}
            >
              Буцах
            </Button>
          </HStack>
        </Flex>

        {/* card */}
        <Box borderRadius="24px" border="1px solid" borderColor={border} bg={cardBg} backdropFilter="blur(16px)" p={{ base: 5, md: 6 }}>
          <Stack spacing={5}>
            <Badge
              w="fit-content"
              px={3}
              py={1.5}
              borderRadius="999px"
              bg={useColorModeValue('rgba(31,111,178,0.10)', 'rgba(31,111,178,0.18)')}
              color={BRAND}
              textTransform="none"
              fontWeight="800"
              display="inline-flex"
              alignItems="center"
              gap={2}
            >
              <Icon as={Sparkles as any} boxSize="14px" />
              Сэтгэл хөдлөл
            </Badge>

            <Box>
              <Heading size="lg" fontWeight="800" letterSpacing="-0.6px">
                Сэтгэл дотроо юу болж
                <br /> байгааг мэдэрч суръя
              </Heading>
              <Text mt={2} fontSize="sm" color={textSub} lineHeight="1.7">
                Өөрийн дотоод хөдөлгөөнийг ажиглаж, нэрлэж, ойлгох дадлыг эндээс эхлүүлнэ.
              </Text>
            </Box>

            {/* search */}
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={Search as any} boxSize="16px" color={BRAND} opacity={0.9} />
              </InputLeftElement>
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Хайх... (ж: түгш, уур, айдас)"
                bg={useColorModeValue('whiteAlpha.700', 'whiteAlpha.100')}
                borderColor={border}
              />
              {q ? (
                <InputRightElement>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => setQ('')}
                    aria-label="clear"
                    borderRadius="999px"
                  >
                    <Icon as={X as any} boxSize="14px" />
                  </Button>
                </InputRightElement>
              ) : null}
            </InputGroup>

            {/* accordion list (inline expand) */}
            <Stack spacing={3}>
              {filtered.map((s, idx) => {
                const isOpen = openId === s.id;

                return (
                  <Box key={s.id} borderRadius="18px" border="1px solid" borderColor={border} overflow="hidden">
                    <Button
                      w="100%"
                      variant="ghost"
                      justifyContent="space-between"
                      px={4}
                      py={6}
                      borderRadius="0"
                      onClick={() => setOpenId((prev) => (prev === s.id ? null : s.id))}
                      _hover={{ bg: useColorModeValue('blackAlpha.50', 'whiteAlpha.100') }}
                    >
                      <HStack spacing={3}>
                        <Box
                          w="26px"
                          h="26px"
                          borderRadius="999px"
                          border="1px solid"
                          borderColor={border}
                          bg={useColorModeValue('white', 'blackAlpha.300')}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontSize="12px"
                          fontWeight="900"
                          color={BRAND}
                        >
                          {idx + 1}
                        </Box>
                        <Text fontSize="sm" fontWeight="800" textAlign="left">
                          {s.title}
                        </Text>
                      </HStack>
                      <Icon as={Check as any} boxSize="16px" color={BRAND} opacity={0.9} />
                    </Button>

                    {isOpen ? (
                      <Box px={4} pb={4} pt={1} borderTop="1px solid" borderColor={border}>
                        <Stack spacing={2}>
                          {s.paragraphs.map((p, i) => (
                            <Text key={i} fontSize="sm" color={textSub} lineHeight="1.75">
                              {p}
                            </Text>
                          ))}
                        </Stack>
                      </Box>
                    ) : null}
                  </Box>
                );
              })}

              {q && filtered.length === 0 ? (
                <Box borderRadius="18px" border="1px solid" borderColor={border} p={4} color={textSub} fontSize="sm">
                  Олдсонгүй. Өөр үгээр хайгаад үзээрэй.
                </Box>
              ) : null}
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
