"use client";

/* eslint-disable */
import React from "react";
import Link from "next/link";
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Heading,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Divider,
  Tag,
  Button,
  useBreakpointValue,
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
      "Мэдрэхүй гэдэг нь бие, сэтгэл дотор болж буй дохиог анзаарах чадвар юм. (амьсгал, зүрхний цохилт, булчин чангарах, хоолой зангирах, гэдэс базлах гэх мэт).",
      "Энэ чадвар нэмэгдэх тусам чи мэдрэмжээ “таах” биш, “унших” болж, өөрийгөө буруутгах нь багасдаг.",
      "Анзаарах → нэрлэх → ойлгох → тайвшруулах гэсэн дарааллын хамгийн эхний алхам нь мэдрэхүй.",
    ],
  },
  {
    id: "types",
    title: "Ямар ямар мэдрэмжүүд байдаг вэ?",
    paragraphs: [
      "Суурь мэдрэмжүүд: баяр, гуниг, уур, айдас, жигшил, гайхшрал.",
      "Нарийн (холимог) мэдрэмжүүд: түгшүүр, гомдол, ичгүүр, гэмшил, атаархал, ганцаардал, сэтгэл дундуур байдал гэх мэт.",
      "Нэг дор 2–3 мэдрэмж зэрэг оршиж болно. “ууртай мөртлөө айж байна” гэх мэт — энэ хэвийн.",
    ],
  },
  {
    id: "understand",
    title: "Юуг ойлгох ёстой вэ?",
    paragraphs: [
      "Мэдрэмж бол мэдээлэл — шийтгэл биш. “Би муу хүн” гэсэн дүгнэлт биш, “надад хэрэгцээ байна” гэсэн дохио.",
      "Мэдрэмжийн цаана хэрэгцээ байдаг: аюулгүй байдал, хүндлэл, тайван орчин, амралт, дэмжлэг, ойр байдал, хил хязгаар гэх мэт.",
      "Баримт ба тайлбарыг салгаж чадвал сэтгэл “саарал манан” болох нь багасдаг.",
    ],
  },
  {
    id: "skills",
    title: "Юуг эзэмших сурах вэ?",
    paragraphs: [
      "1) Биеэ скан хийх: “Биед хаана юу мэдрэгдэж байна?” (цээж, хоолой, гэдэс, мөр, эрүү…).",
      "2) Нэрлэх: “Энэ юу вэ?” (уур, айдас, гуниг, түгшүүр…). Нэрлэж чадвал мэдрэмж удирдахад амархан болдог.",
      "3) Зөөлөн асуух: “Энэ мэдрэмж надад юуг хэлэх гээд байна?” “Би яг юу хэрэгтэй байна?”",
      "4) Жижиг алхам: ус, удаан амьсгал, богино алхалт, бичих — жижиг үйлдлүүд мэдрэлийн системийг тайвшруулдаг.",
    ],
  },
  {
    id: "habit",
    title: "Хэрхэн дадал болгох вэ?",
    paragraphs: [
      "Өдөрт 2 минут: “Одоо би юу мэдэрч байна?” гэж 1–2 удаа өөрөөсөө асуу.",
      "Бичих загвар: “Би … мэдэрч байна. Учир нь … хэрэгтэй байна. Одоо би … гэж жижиг алхам хийнэ.”",
      "Сэтгэл хүчтэй үед шийдвэрийг түр азна: эхлээд тайвшир → дараа нь хариу үйлдэл. Энэ бол өөрийгөө хамгаалах ухаалаг арга.",
    ],
  },
];

export default function AwarenessApp() {
  /**
   * 🎨 ЗОРИЛГО: яг доод зураг шиг “цэнхэр, амьд blue-glass”
   * Saаруулдаг overlay-ийг болиулахын тулд:
   * - pageBg-г “saturated blue” болгосон
   * - shell/card-ийг grey биш, blue-tint шилэн болгосон
   */

  // brand: #1F6FB2 (31,111,178) + support: #3E6F96 (62,111,150)

  // ✅ Илүү “амьд” цэнхэр background (сааралжихгүй)
  const pageBg =
    "radial-gradient(900px 520px at 25% 5%, rgba(31,111,178,0.55) 0%, rgba(31,111,178,0.20) 55%, rgba(10,24,36,0.10) 100%), linear-gradient(180deg, rgba(10,24,36,0.28) 0%, rgba(10,24,36,0.18) 100%)";

  // ✅ Гол container (blue glass) — grey биш
  const shellBg = "rgba(34, 74, 110, 0.52)";
  const shellBorder = "rgba(255,255,255,0.12)";

  // ✅ Cards — grey биш, blue-ish glass
  const cardBg = "rgba(255,255,255,0.09)";
  const cardBorder = "rgba(255,255,255,0.14)";

  // Text
  const textMain = "rgba(255,255,255,0.94)";
  const textSub = "rgba(255,255,255,0.72)";

  // Accent
  const accent = "rgba(31,111,178,0.95)";
  const pillBg = "rgba(255,255,255,0.10)";
  const pillBorder = "rgba(255,255,255,0.14)";

  const radius = useBreakpointValue({ base: "18px", md: "24px" });
  const pad = useBreakpointValue({ base: 5, md: 7 });

  return (
    <Box
      minH="calc(100dvh - 80px)"
      px={{ base: 4, md: 6 }}
      py={{ base: 6, md: 10 }}
      bg={pageBg}
      // ✅ parent нь override хийдэг бол энэ тусална
      sx={{ backgroundBlendMode: "normal" }}
    >
      <Flex justify="center">
        <Box
          w="full"
          maxW="980px"
          bg={shellBg}
          border="1px solid"
          borderColor={shellBorder}
          borderRadius={radius}
          boxShadow="0 25px 80px rgba(0,0,0,0.40)"
          overflow="hidden"
          backdropFilter="blur(10px)"
        >
          {/* Top row */}
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
                bg={pillBg}
                border="1px solid"
                borderColor={pillBorder}
              >
                <Icon as={Sparkles} boxSize={4} color={accent} />
                <Text fontSize="sm" color={textMain} fontWeight="700">
                  Миний сэтгэлзүй
                </Text>
              </HStack>

              <HStack
                spacing={2}
                px={3}
                py={1.5}
                borderRadius="999px"
                bg={pillBg}
                border="1px solid"
                borderColor={pillBorder}
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
              bg={pillBg}
              border="1px solid"
              borderColor={pillBorder}
              color={textMain}
              _hover={{ bg: "rgba(255,255,255,0.14)" }}
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
              whiteSpace="pre-line"
            >
              Сэтгэл дотроо юу болж{"\n"}байгааг мэдэрч суръя
            </Heading>

            <Text mt={3} fontSize={{ base: "sm", md: "md" }} color={textSub} maxW="74ch">
              Өөрийн дотоод хөдөлгөөнийг ажиглах, нэрлэх, ойлгох дадлыг эндээс эхлүүлнэ.
            </Text>

            <Divider my={{ base: 5, md: 6 }} borderColor="rgba(255,255,255,0.10)" />

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
                      _hover={{ bg: "rgba(255,255,255,0.08)" }}
                    >
                      <HStack w="full" spacing={3} align="center">
                        <Tag
                          size="sm"
                          borderRadius="999px"
                          bg="rgba(255,255,255,0.10)"
                          border="1px solid rgba(255,255,255,0.14)"
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

                        <Box
                          w="28px"
                          h="28px"
                          borderRadius="999px"
                          display="grid"
                          placeItems="center"
                          bg="rgba(255,255,255,0.10)"
                          border="1px solid rgba(255,255,255,0.14)"
                        >
                          <Text fontSize="sm" color={textMain} fontWeight="900">
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

            <Text mt={6} fontSize="xs" color="rgba(255,255,255,0.50)">
              oyunsanaa · Awareness
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
