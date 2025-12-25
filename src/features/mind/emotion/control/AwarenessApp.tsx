"use client";

/* eslint-disable */
import React from "react";
import Link from "next/link";
import {
  Box,
  Flex,
  HStack,
  Text,
  Heading,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  useBreakpointValue,
  Divider,
  Tag,
  Button,
  VStack,
} from "@chakra-ui/react";
import { MessageCircle, Sparkles } from "lucide-react";

type Section = {
  id: string;
  title: string;
  paragraphs: string[];
};

const SECTIONS: Section[] = [
  {
    id: "what",
    title: "Мэдрэхүй гэж юу вэ?",
    paragraphs: [
      "Мэдрэхүй гэдэг нь бие дотор болж буй мэдрэмжүүдээ (амьсгал, зүрхний цохилт, булчингийн чангарал, хоолой/гэдэсний мэдрэмж гэх мэт) анзаарах чадвар.",
      "Энэ чадвар өндөр байх тусам “би одоо яагаад ингэж авирлаад байна?” гэдгээ хурдан ойлгодог — өөрийгөө буруутгах биш, өөрийгөө уншиж сурна.",
      "Мэдрэхүй бол сэтгэлзүйн “дотоод компас”. Анзаарах → нэрлэх → сонсох → тайвшруулах гэсэн дарааллын эхний алхам нь энэ.",
    ],
  },
  {
    id: "types",
    title: "Ямар ямар мэдрэмжүүд байдаг вэ?",
    paragraphs: [
      "Суурь мэдрэмжүүд: баяр, гуниг, уур, айдас, жигшил, гайхшрал.",
      "Нарийн, холимог мэдрэмжүүд: түгшүүр, гомдол, ичгүүр, гэмшил, атаархал, ганцаардал, сэтгэл дундуур байдал гэх мэт.",
      "Нэг дор 2–3 мэдрэмж зэрэг байх нь хэвийн. Жишээ нь: “ууртай мөртлөө айж байна”, “баяртай мөртлөө түгшиж байна”.",
    ],
  },
  {
    id: "understand",
    title: "Юуг ойлгох ёстой вэ?",
    paragraphs: [
      "Мэдрэмж бол мэдээлэл — “би муу хүн” гэсэн дүгнэлт биш. Энэ нь: “Надад нэг хэрэгцээ байна” гэсэн дохио.",
      "Хэрэгцээ гэдэг нь: аюулгүй байдал, хүндлэл, тайван орчин, амралт, дэмжлэг, ойр байдал, хил хязгаар, шударга байдал гэх мэт.",
      "Тайлбар (таамаг) ба баримтыг салгаж сурах нь чамайг тайвшруулна. Баримт: “тэр хариу бичээгүй.” Тайлбар: “намайг тоохоо больжээ.”",
    ],
  },
  {
    id: "skills",
    title: "Юуг эзэмших сурах вэ?",
    paragraphs: [
      "1) Анзаарах: “Биед яг хаана юу мэдрэгдэж байна?” (цээж, хоолой, гэдэс, мөр, эрүү гэх мэт)",
      "2) Нэрлэх: “Энэ мэдрэмжийн нэр нь юу вэ?” (уур, айдас, гуниг, түгшүүр…)",
      "3) Зөөлөн асуух: “Энэ мэдрэмж надад юуг хэлэх гээд байна?” “Би яг юу хэрэгтэй байгаа вэ?”",
      "4) Бага алхам: ус уух, 10 удаа удаан амьсгалах, 3 минут алхах, бодлоо бичих — жижиг зүйлс системийг тайвшруулдаг.",
    ],
  },
  {
    id: "habit",
    title: "Хэрхэн дадал болгох вэ?",
    paragraphs: [
      "Өдөрт 2 минут: “Одоо би юу мэдэрч байна?” гэдэг асуултыг 1–2 удаа өөртөө өг.",
      "Бичих загвар: “Би … мэдэрч байна. Учир нь … хэрэгтэй байна. Одоо би … гэж жижиг алхам хийнэ.”",
      "Сэтгэл хүчтэй үед шийдвэрийг хойшлуул: эхлээд тайвшир → дараа нь хариу үйлдэл. Энэ бол өөрийгөө хамгаалах ухаалаг арга.",
    ],
  },
];

export default function AwarenessApp() {
  // ✅ Илүү гэгээлэг, brand tint-тэй day-friendly palette
  // Brand: #1F6FB2 (31,111,178)
  const pageBg =
    "linear-gradient(180deg, rgba(31,111,178,0.10) 0%, rgba(31,111,178,0.18) 55%, rgba(255,255,255,0.00) 100%)";

  const shellBg = "rgba(255,255,255,0.70)";
  const shellBorder = "rgba(31,111,178,0.22)";

  const cardBg = "rgba(255,255,255,0.78)";
  const cardBorder = "rgba(31,111,178,0.18)";

  const textMain = "#0F2A44";
  const textSub = "rgba(15,42,68,0.72)";

  const radius = useBreakpointValue({ base: "18px", md: "24px" });
  const pad = useBreakpointValue({ base: 5, md: 7 });

  return (
    <Box
      minH="calc(100dvh - 80px)"
      px={{ base: 4, md: 6 }}
      py={{ base: 6, md: 10 }}
      bg={pageBg}
    >
      <Flex justify="center">
        <Box
          w="full"
          maxW="980px"
          bg={shellBg}
          border="1px solid"
          borderColor={shellBorder}
          borderRadius={radius}
          boxShadow="0 25px 80px rgba(0,0,0,0.15)"
          overflow="hidden"
        >
          {/* Top row (pills + chat) */}
          <Flex
            px={{ base: 5, md: 7 }}
            py={{ base: 5, md: 6 }}
            align="center"
            justify="space-between"
            gap={3}
          >
            <HStack spacing={3} flexWrap="wrap">
              <HStack
                spacing={2}
                px={3}
                py={1.5}
                borderRadius="999px"
                bg="rgba(31,111,178,0.10)"
                border="1px solid rgba(31,111,178,0.20)"
              >
                <Icon as={Sparkles} boxSize={4} color="rgba(31,111,178,0.95)" />
                <Text fontSize="sm" color={textMain} fontWeight="700">
                  Миний сэтгэлзүй
                </Text>
              </HStack>

              <HStack
                spacing={2}
                px={3}
                py={1.5}
                borderRadius="999px"
                bg="rgba(31,111,178,0.08)"
                border="1px solid rgba(31,111,178,0.18)"
              >
                <Text fontSize="sm" color={textMain} fontWeight="700" textTransform="uppercase">
                  сэтгэл хөдлөл
                </Text>
              </HStack>
            </HStack>

            <Button
              as={Link}
              href="/dashboard/chat"
              size="sm"
              leftIcon={<Icon as={MessageCircle} boxSize={4} />}
              bg="rgba(31,111,178,0.10)"
              border="1px solid rgba(31,111,178,0.22)"
              color={textMain}
              _hover={{ bg: "rgba(31,111,178,0.14)" }}
              borderRadius="999px"
              flexShrink={0}
            >
              Чат
            </Button>
          </Flex>

          {/* Title + subtitle */}
          <Box px={{ base: 5, md: 7 }} pb={{ base: 6, md: 7 }}>
            <Heading
              as="h1"
              fontSize={{ base: "28px", md: "42px" }}
              lineHeight={{ base: "1.15", md: "1.1" }}
              color={textMain}
              letterSpacing="-0.02em"
            >
              Сэтгэл дотроо юу болж
              <br />
              байгааг мэдэрч суръя
            </Heading>

            <Text mt={3} fontSize={{ base: "sm", md: "md" }} color={textSub} maxW="74ch">
              Өөрийн дотоод хөдөлгөөнийг ажиглах, нэрлэх, ойлгох дадлыг эндээс эхлүүлнэ.
            </Text>

            <Divider my={{ base: 5, md: 6 }} borderColor="rgba(31,111,178,0.16)" />

            {/* Accordion */}
            <Accordion allowMultiple display="grid" gap={3}>
              {SECTIONS.map((it, idx) => (
                <AccordionItem
                  key={it.id}
                  border="1px solid"
                  borderColor={cardBorder}
                  borderRadius="16px"
                  bg={cardBg}
                  overflow="hidden"
                >
                  <h2>
                    <AccordionButton
                      px={pad}
                      py={{ base: 4, md: 5 }}
                      _hover={{ bg: "rgba(31,111,178,0.06)" }}
                    >
                      <HStack w="full" spacing={3} align="center">
                        <Tag
                          size="sm"
                          borderRadius="999px"
                          bg="rgba(31,111,178,0.10)"
                          border="1px solid rgba(31,111,178,0.18)"
                          color={textMain}
                          fontWeight="800"
                        >
                          {idx + 1}
                        </Tag>

                        <Text
                          flex="1"
                          textAlign="left"
                          color={textMain}
                          fontWeight="800"
                          fontSize={{ base: "sm", md: "md" }}
                        >
                          {it.title}
                        </Text>

                        {/* screenshot шиг баруун талд ✓ */}
                        <Box
                          w="26px"
                          h="26px"
                          borderRadius="999px"
                          display="grid"
                          placeItems="center"
                          bg="rgba(31,111,178,0.10)"
                          border="1px solid rgba(31,111,178,0.18)"
                        >
                          <Text fontSize="sm" color="rgba(31,111,178,0.95)" fontWeight="900">
                            ✓
                          </Text>
                        </Box>
                      </HStack>
                    </AccordionButton>
                  </h2>

                  <AccordionPanel px={pad} pb={{ base: 5, md: 6 }} pt={0}>
                    <VStack align="start" spacing={2.5}>
                      {it.paragraphs.map((p, i) => (
                        <Text
                          key={i}
                          color={textSub}
                          fontSize={{ base: "sm", md: "md" }}
                          lineHeight="1.7"
                        >
                          {p}
                        </Text>
                      ))}
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>

            <Text mt={6} fontSize="xs" color="rgba(15,42,68,0.45)">
              oyunsanaa · Awareness
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
