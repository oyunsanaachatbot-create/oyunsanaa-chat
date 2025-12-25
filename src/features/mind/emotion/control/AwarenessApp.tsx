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
      "Мэдрэхүй гэдэг нь бие, сэтгэл дотор болж буй дохиог анзаарах чадвар юм. (амьсгал, зүрхний цохилт, хоолой зангирах, гэдэс базлах гэх мэт).",
      "Анзаарах тусам чи өөрийгөө илүү ойлгож, мэдрэмждээ “тэнэг” биш “ухаантай” хариу өгч эхэлдэг.",
    ],
  },
  {
    id: "types",
    title: "Ямар ямар мэдрэмжүүд байдаг вэ?",
    paragraphs: [
      "Суурь мэдрэмжүүд: баяр, гуниг, уур, айдас, жигшил, гайхшрал.",
      "Нарийн мэдрэмжүүд: түгшүүр, гомдол, ичгүүр, гэмшил, атаархал, ганцаардал гэх мэт.",
      "Нэг дор хэд хэдэн мэдрэмж давхар байж болно — энэ хэвийн.",
    ],
  },
  {
    id: "understand",
    title: "Юуг ойлгох ёстой вэ?",
    paragraphs: [
      "Мэдрэмж бол мэдээлэл — шийтгэл биш. “Надад хэрэгцээ байна” гэсэн дохио.",
      "Баримт ба тайлбарыг ялгах нь тайван болгодог. Баримт: “тэр хариу бичээгүй.” Тайлбар: “намайг тоохоо больжээ.”",
    ],
  },
  {
    id: "skills",
    title: "Юуг эзэмших сурах вэ?",
    paragraphs: [
      "1) Биеэ скан хийх: “Хаана юу мэдрэгдэж байна?”",
      "2) Нэрлэх: “Энэ уур уу, айдас уу, гуниг уу?”",
      "3) Зөөлөн асуух: “Надад яг юу хэрэгтэй байна?”",
      "4) Жижиг алхам: ус уух, удаан амьсгал, богино алхалт, бичих.",
    ],
  },
  {
    id: "habit",
    title: "Хэрхэн дадал болгох вэ?",
    paragraphs: [
      "Өдөрт 2 минут: “Одоо би юу мэдэрч байна?” гэж өөрөөсөө асуу.",
      "Бичих загвар: “Би … мэдэрч байна. Учир нь … хэрэгтэй байна. Одоо би … гэж жижиг алхам хийнэ.”",
      "Сэтгэл хүчтэй үед: эхлээд тайвшир → дараа нь шийд.",
    ],
  },
];

export default function AwarenessApp() {
  // ✅ Blue-glass palette (өмнөхөөсөө хэвээр)
  const pageBg =
    "radial-gradient(1100px 650px at 20% 0%, rgba(31,111,178,0.75) 0%, rgba(31,111,178,0.28) 55%, rgba(10,24,36,0.12) 100%), linear-gradient(180deg, rgba(8,20,32,0.38) 0%, rgba(8,20,32,0.28) 100%)";

  const shellBg = "rgba(34, 74, 110, 0.52)";
  const shellBorder = "rgba(255,255,255,0.12)";
  const cardBg = "rgba(255,255,255,0.09)";
  const cardBorder = "rgba(255,255,255,0.14)";

  const textMain = "rgba(255,255,255,0.94)";
  const textSub = "rgba(255,255,255,0.72)";
  const accent = "rgba(31,111,178,0.95)";
  const pillBg = "rgba(255,255,255,0.10)";
  const pillBorder = "rgba(255,255,255,0.14)";

  // ✅ Mobile дээр хэмжээс/spacing-ийг “уншихад амар” болгож тааруулсан
  const radius = useBreakpointValue({ base: "16px", md: "24px" });
  const pad = useBreakpointValue({ base: 4, md: 7 });

  // ✅ Horizon-ийн mobile header fixed тул дээрээс давхцахаас хамгаалж “extra top padding” өгнө
  // iOS safe-area-г бас тооцно
  const topSafe = "calc(env(safe-area-inset-top) + 84px)"; // 84px: дээд toolbar ойролцоо
  const pageTopPadding = useBreakpointValue({ base: topSafe, md: "40px" });

  return (
    <Box
      minH="100dvh"
      bg={pageBg}
      px={{ base: 3, md: 6 }}
      pt={pageTopPadding}
      pb={{ base: 6, md: 10 }}
    >
      <Flex justify="center">
        <Box
          w="full"
          maxW={{ base: "100%", md: "980px" }}
          bg={shellBg}
          border="1px solid"
          borderColor={shellBorder}
          borderRadius={radius}
          boxShadow={{ base: "0 18px 55px rgba(0,0,0,0.35)", md: "0 25px 80px rgba(0,0,0,0.40)" }}
          overflow="hidden"
          backdropFilter="blur(10px)"
        >
          {/* Top row — mobile дээр column болгоно */}
          <Flex
            px={{ base: 4, md: 7 }}
            py={{ base: 4, md: 6 }}
            direction={{ base: "column", md: "row" }}
            align={{ base: "stretch", md: "center" }}
            justify="space-between"
            gap={{ base: 3, md: 3 }}
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
              w={{ base: "fit-content", md: "auto" }}
              alignSelf={{ base: "flex-end", md: "auto" }}
            >
              Чат
            </Button>
          </Flex>

          {/* Content */}
          <Box px={{ base: 4, md: 7 }} pb={{ base: 5, md: 7 }}>
            <Heading
              as="h1"
              fontSize={{ base: "26px", md: "42px" }}
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

            <Divider my={{ base: 4, md: 6 }} borderColor="rgba(255,255,255,0.10)" />

            {/* Accordion — mobile дээр title 2 мөр болж болохоор spacing/lineHeight тохируулсан */}
            <Accordion allowMultiple display="grid" gap={{ base: 3, md: 3 }}>
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
                          flexShrink={0}
                        >
                          {idx + 1}
                        </Tag>

                        <Text
                          flex="1"
                          textAlign="left"
                          color={textMain}
                          fontWeight="800"
                          fontSize={{ base: "sm", md: "md" }}
                          lineHeight={{ base: "1.35", md: "1.4" }}
                          pr={2}
                        >
                          {it.title}
                        </Text>

                        <Box
                          w={{ base: "26px", md: "28px" }}
                          h={{ base: "26px", md: "28px" }}
                          borderRadius="999px"
                          display="grid"
                          placeItems="center"
                          bg="rgba(255,255,255,0.10)"
                          border="1px solid rgba(255,255,255,0.14)"
                          flexShrink={0}
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

            <Text mt={5} fontSize="xs" color="rgba(255,255,255,0.50)">
              oyunsanaa · Awareness
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
