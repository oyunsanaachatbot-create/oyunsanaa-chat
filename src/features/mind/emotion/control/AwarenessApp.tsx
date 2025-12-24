'use client';

import { useMemo, useState } from 'react';
import NextLink from 'next/link';
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Brain, MessageCircle, Sparkles, Check } from 'lucide-react';

type Section = { id: string; title: string; paragraphs: string[] };

export default function AwarenessApp() {
  const brand = '#1F6FB2';

  const cardBg = useColorModeValue('rgba(255,255,255,0.75)', 'rgba(17,25,40,0.45)');
  const cardBorder = useColorModeValue('rgba(31,111,178,0.18)', 'rgba(255,255,255,0.12)');
  const subtleText = useColorModeValue('blackAlpha.700', 'whiteAlpha.700');
  const panelBg = useColorModeValue('blackAlpha.50', 'whiteAlpha.100');
  const itemBorder = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');

  const sections: Section[] = useMemo(
    () => [
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
          'Сэтгэл судлалд мэдрэмжүүдийг ерөнхий нь баяр, гуниг, айдас, уур гэсэн үндсэн бүлгүүдэд хуваадаг.',
          'Энэ хэсэгт та өдөр тутам мэдэрдэг зүйлсээ эдгээр бүлэгтэй холбоож эхэлнэ.',
        ],
      },
      {
        id: 'understand',
        title: 'Юуг ойлгох ёстой вэ?',
        paragraphs: [
          'Мэдрэмж гэдэг нь бодит байдлын тушаал биш, харин анхааруулга, мэдээлэл юм.',
          'Мэдрэмжээ ойлгож эхлэхэд реакц маягийн огцом хариу биш, сонголт хийх чадвар нэмэгдэнэ.',
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

  return (
    <Box
      minH="100vh"
      px={{ base: 4, md: 6 }}
      py={{ base: 6, md: 8 }}
      position="relative"
      overflow="hidden"
    >
      {/* soft background */}
      <Box
        position="absolute"
        inset={0}
        zIndex={-1}
        bgGradient={useColorModeValue(
          'linear(to-br, #F6FAFF 0%, #EAF3FF 40%, #FFFFFF 100%)',
          'linear(to-br, #0B1220 0%, #101B2B 45%, #0A0F1A 100%)'
        )}
      />
      <Box
        position="absolute"
        top="-220px"
        left="-200px"
        w="520px"
        h="520px"
        borderRadius="999px"
        bg={brand}
        opacity={useColorModeValue(0.10, 0.16)}
        filter="blur(40px)"
        zIndex={-1}
      />
      <Box
        position="absolute"
        top="-160px"
        right="-220px"
        w="560px"
        h="560px"
        borderRadius="999px"
        bg={brand}
        opacity={useColorModeValue(0.08, 0.14)}
        filter="blur(44px)"
        zIndex={-1}
      />

      <Box maxW="3xl" mx="auto">
        {/* header */}
        <Flex align="center" justify="space-between" mb={6}>
          <Flex align="center" gap={2}>
            <Box
              w="34px"
              h="34px"
              borderRadius="999px"
              border="1px solid"
              borderColor={itemBorder}
              bg={panelBg}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={Brain as any} boxSize="18px" color={brand} />
            </Box>
            <Text fontWeight="700" fontSize="sm" opacity={0.85}>
              Миний сэтгэлзүй
            </Text>
          </Flex>

          <Link
            as={NextLink}
            href="/"
            display="inline-flex"
            alignItems="center"
            gap={2}
            px={3}
            py={2}
            borderRadius="999px"
            border="1px solid"
            borderColor={itemBorder}
            bg={panelBg}
            _hover={{ textDecoration: 'none', opacity: 0.95 }}
          >
            <Icon as={MessageCircle as any} boxSize="16px" color={brand} />
            <Text fontSize="xs" opacity={0.8}>
              Чат
            </Text>
          </Link>
        </Flex>

        {/* main card */}
        <Box
          borderRadius="24px"
          border="1px solid"
          borderColor={cardBorder}
          bg={cardBg}
          backdropFilter="blur(16px)"
          boxShadow={useColorModeValue('0 18px 60px rgba(0,0,0,0.08)', '0 18px 60px rgba(0,0,0,0.35)')}
          p={{ base: 5, md: 6 }}
        >
          <Stack spacing={5}>
            <Flex align="center" gap={2}>
              <Badge
                display="inline-flex"
                alignItems="center"
                gap={2}
                px={3}
                py={1.5}
                borderRadius="999px"
                bg={panelBg}
                border="1px solid"
                borderColor={itemBorder}
                color={brand}
                textTransform="none"
                fontWeight="700"
              >
                <Icon as={Sparkles as any} boxSize="14px" />
                Сэтгэл хөдлөл
              </Badge>
            </Flex>

            <Box>
              <Heading size="lg" fontWeight="600" letterSpacing="-0.3px">
                Сэтгэл дотроо юу болж
                <br /> байгааг мэдэрч сурья
              </Heading>
              <Text mt={2} fontSize="sm" color={subtleText} lineHeight="1.7">
                Өөрийн дотоод хөдөлгөөнийг ажиглаж, нэрлэж, ойлгох дадлыг эндээс эхлүүлнэ.
              </Text>
            </Box>

            {/* accordion-ish list */}
            <Stack spacing={3}>
              {sections.map((s, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <Box
                    key={s.id}
                    borderRadius="18px"
                    border="1px solid"
                    borderColor={itemBorder}
                    bg={panelBg}
                    overflow="hidden"
                  >
                    <Button
                      onClick={() => setOpenIndex((prev) => (prev === idx ? null : idx))}
                      w="100%"
                      justifyContent="space-between"
                      variant="ghost"
                      px={4}
                      py={6}
                      borderRadius="0"
                      _hover={{ bg: useColorModeValue('blackAlpha.50', 'whiteAlpha.100') }}
                    >
                      <Flex align="center" gap={3}>
                        <Box
                          w="26px"
                          h="26px"
                          borderRadius="999px"
                          border="1px solid"
                          borderColor={itemBorder}
                          bg={useColorModeValue('white', 'blackAlpha.300')}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontSize="12px"
                          fontWeight="800"
                          color={brand}
                        >
                          {idx + 1}
                        </Box>
                        <Text fontSize="sm" fontWeight="700" textAlign="left">
                          {s.title}
                        </Text>
                      </Flex>

                      <Icon as={Check as any} boxSize="16px" color={brand} />
                    </Button>

                    {isOpen ? (
                      <Box px={4} pb={4} pt={1} borderTop="1px solid" borderColor={itemBorder}>
                        <Stack spacing={2}>
                          {s.paragraphs.map((p, i) => (
                            <Text key={i} fontSize="sm" color={subtleText} lineHeight="1.75">
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
