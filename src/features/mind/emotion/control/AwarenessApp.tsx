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
  Link,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Brain, MessageCircle, Sparkles, Check } from 'lucide-react';

type Section = { id: string; title: string; paragraphs: string[] };

// ✅ брэнд өнгөө CSS variable-оос авна (fallback #1F6FB2)
const BRAND = 'var(--brand, #1F6FB2)';

export default function AwarenessApp() {
  const sections: Section[] = useMemo(
    () => [
      {
        id: 'what',
        title: 'Мэдрэхүй гэж юу вэ?',
        paragraphs: [
          'Бид өдөрт олон зуун жижиг сэтгэгдэл, мэдрэмжийг мэдэрдэг ч ихэнхийг нь анзааралгүй өнгөрөөдөг.',
          '“Зүгээр дээ” гэж өнгөрөөх биш, “Одоо би түгшиж байна”, “Уурлаж байна” гэх мэтээр өөртөө тодорхой хэлж сурах нь чухал.',
        ],
      },
      {
        id: 'types',
        title: 'Ямар ямар мэдрэмжүүд байдаг вэ?',
        paragraphs: [
          'Сэтгэл судлалд мэдрэмжүүдийг ерөнхий нь баяр, гуниг, айдас, уур гэсэн үндсэн бүлгүүдэд хуваадаг.',
          'Энэ хэсэгт та өөрийн өдөр тутам мэдэрдэг зүйлсийг эдгээр бүлэгтэй холбож эхэлнэ.',
        ],
      },
      {
        id: 'understand',
        title: 'Юуг ойлгох ёстой вэ?',
        paragraphs: [
          'Мэдрэмж бол бодит байдлын тушаал биш, харин анхааруулга, мэдээлэл юм.',
          'Мэдрэмжээ уншиж сурвал реакц биш, сонголт хийх чадвар нэмэгдэнэ.',
        ],
      },
      {
        id: 'skills',
        title: 'Юуг эзэмшиж сурах вэ?',
        paragraphs: [
          'Эхний ур чадвар бол ажиглалт — юу болж байгааг шүүлтгүйгээр анзаарах.',
          'Дараагийнх нь нэршил — мэдрэмжээ ерөнхий биш, илүү тодорхой нэрлэх.',
          'Гурав дахь нь өөртөө эелдэг хандах: өөрийгөө буруутгахын оронд ойлгож хүлээн зөвшөөрөх дадал.',
        ],
      },
      {
        id: 'habits',
        title: 'Хэрхэн дадал болгох вэ?',
        paragraphs: [
          'Өдөрт 2–3 удаа 1 минут зав гаргаад “Одоо би юу мэдэрч байна?” гэж өөрөөсөө асуугаарай.',
          'Богино тэмдэглэл хэлбэрээр тэмдэглэвэл дадал илүү хурдан тогтоно.',
        ],
      },
    ],
    []
  );

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const pageBg = useColorModeValue('#F7FAFF', '#0A0F1A');
  const cardBg = useColorModeValue('rgba(255,255,255,0.72)', 'rgba(17,25,40,0.55)');
  const border = useColorModeValue('rgba(0,0,0,0.08)', 'rgba(255,255,255,0.12)');
  const textSub = useColorModeValue('blackAlpha.700', 'whiteAlpha.700');
  const pillBg = useColorModeValue('rgba(31,111,178,0.10)', 'rgba(31,111,178,0.18)');

  return (
    <Box minH="100vh" bg={pageBg} position="relative" overflow="hidden" px={{ base: 4, md: 6 }} py={{ base: 6, md: 8 }}>
      {/* Soft blobs */}
      <Box position="absolute" top="-180px" left="-220px" w="520px" h="520px" borderRadius="999px" bg={BRAND} opacity={0.12} filter="blur(44px)" />
      <Box position="absolute" top="-160px" right="-240px" w="560px" h="560px" borderRadius="999px" bg={BRAND} opacity={0.10} filter="blur(48px)" />

      <Box maxW="720px" mx="auto">
        {/* Local top row (page-level). Not the big Horizon header */}
        <Flex align="center" justify="space-between" mb={4}>
          <HStack spacing={2}>
            <Box w="34px" h="34px" borderRadius="999px" border="1px solid" borderColor={border} bg={cardBg} display="flex" alignItems="center" justifyContent="center">
              <Icon as={Brain as any} boxSize="18px" color={BRAND} />
            </Box>
            <Text fontWeight="700" fontSize="sm" color={useColorModeValue('blackAlpha.800', 'whiteAlpha.900')}>
              Миний сэтгэлзүй
            </Text>
          </HStack>

          <Link as={NextLink} href="/" _hover={{ textDecoration: 'none' }}>
            <Button size="sm" variant="outline" borderColor={border} bg={cardBg} leftIcon={<Icon as={MessageCircle as any} boxSize="16px" color={BRAND} />}>
              Чат
            </Button>
          </Link>
        </Flex>

        <Box borderRadius="24px" border="1px solid" borderColor={border} bg={cardBg} backdropFilter="blur(16px)" p={{ base: 5, md: 6 }}>
          <Stack spacing={5}>
            <Badge
              w="fit-content"
              px={3}
              py={1.5}
              borderRadius="999px"
              bg={pillBg}
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
              <Heading size="lg" fontWeight="800" letterSpacing="-0.6px" color={useColorModeValue('blackAlpha.900', 'whiteAlpha.900')}>
                Сэтгэл дотроо юу болж
                <br /> байгааг мэдэрч суръя
              </Heading>
              <Text mt={2} fontSize="sm" color={textSub} lineHeight="1.7">
                Өөрийн дотоод хөдөлгөөнийг ажиглаж, нэрлэж, ойлгох дадлыг эндээс эхлүүлнэ.
              </Text>
            </Box>

            <Stack spacing={3}>
              {sections.map((s, idx) => {
                const isOpen = openIndex === idx;

                return (
                  <Box key={s.id} borderRadius="18px" border="1px solid" borderColor={border} bg={useColorModeValue('rgba(255,255,255,0.55)', 'rgba(255,255,255,0.06)')} overflow="hidden">
                    <Button
                      w="100%"
                      variant="ghost"
                      justifyContent="space-between"
                      px={4}
                      py={6}
                      borderRadius="0"
                      onClick={() => setOpenIndex((prev) => (prev === idx ? null : idx))}
                      _hover={{ bg: useColorModeValue('blackAlpha.50', 'whiteAlpha.100') }}
                    >
                      <HStack spacing={3}>
                        <Box
                          w="26px"
                          h="26px"
                          borderRadius="999px"
                          border="1px solid"
                          borderColor={border}
                          bg={useColorModeValue('white', 'rgba(0,0,0,0.25)')}
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
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
