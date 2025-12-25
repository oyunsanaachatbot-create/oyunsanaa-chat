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

/* --------- CONTENT --------- */
const SECTIONS = [
  {
    id: "what",
    title: "Мэдрэхүй гэж юу вэ?",
    paragraphs: [
      "Мэдрэхүй гэдэг нь бие, сэтгэл дотор болж буй дохиог анзаарах чадвар юм.",
      "Анзаарах тусам бид мэдрэмждээ илүү ухаалгаар хариу өгч сурдаг.",
    ],
  },
  {
    id: "types",
    title: "Ямар ямар мэдрэмжүүд байдаг вэ?",
    paragraphs: [
      "Суурь мэдрэмжүүд: баяр, гуниг, уур, айдас, жигшил, гайхшрал.",
      "Нарийн мэдрэмжүүд: түгшүүр, гомдол, ичгүүр, гэмшил гэх мэт.",
    ],
  },
  {
    id: "understand",
    title: "Юуг ойлгох ёстой вэ?",
    paragraphs: [
      "Мэдрэмж бол мэдээлэл — шийтгэл биш.",
      "Баримт ба тайлбарыг ялгаж сурвал сэтгэл амархан тайвширдаг.",
    ],
  },
  {
    id: "skills",
    title: "Юуг эзэмших сурах вэ?",
    paragraphs: [
      "Биеэ скан хийх",
      "Мэдрэмжээ нэрлэх",
      "Өөрөөсөө зөөлөн асуух",
      "Жижиг алхам хийх",
    ],
  },
  {
    id: "habit",
    title: "Хэрхэн дадал болгох вэ?",
    paragraphs: [
      "Өдөрт 2 минут анзаарах дадал",
      "Бичих, амьсгалах, зогсоод мэдрэх",
    ],
  },
];

export default function AwarenessApp() {
  /* --------- STYLE SYSTEM (BATLAGDSAN) --------- */
  const pageBg =
    "radial-gradient(1100px 650px at 20% 0%, rgba(31,111,178,0.75) 0%, rgba(31,111,178,0.28) 55%, rgba(10,24,36,0.12) 100%), linear-gradient(180deg, rgba(8,20,32,0.38) 0%, rgba(8,20,32,0.28) 100%)";

  const shellBg = "rgba(34, 74, 110, 0.52)";
  const shellBorder = "rgba(255,255,255,0.12)";
  const cardBg = "rgba(255,255,255,0.09)";
  const cardBorder = "rgba(255,255,255,0.14)";
  const textMain = "rgba(255,255,255,0.94)";
  const textSub = "rgba(255,255,255,0.72)";
  const pillBg = "rgba(255,255,255,0.10)";
  const pillBorder = "rgba(255,255,255,0.14)";
  const accent = "rgba(31,111,178,0.95)";

  const radius = useBreakpointValue({ base: "16px", md: "24px" });
  const pad = useBreakpointValue({ base: 4, md: 7 });

  return (
    <Box minH="100dvh" bg={pageBg} px={{ base: 3, md: 6 }} py={{ base: 8, md: 10 }}>
      <Flex justify="center">
        <Box
          w="full"
          maxW="980px"
          bg={shellBg}
          border="1px solid"
          borderColor={shellBorder}
          borderRadius={radius}
          backdropFilter="blur(10px)"
        >
          {/* Header */}
          <Flex p={{ base: 4, md: 6 }} justify="space-between" align="center">
            <HStack spacing={2}>
              <HStack px={3} py={1.5} bg={pillBg} border="1px solid" borderColor={pillBorder} borderRadius="999px">
                <Icon as={Sparkles} color={accent} boxSize={4} />
                <Text color={textMain} fontWeight="700">Миний сэтгэлзүй</Text>
              </HStack>
              <HStack px={3} py={1.5} bg={pillBg} border="1px solid" borderColor={pillBorder} borderRadius="999px">
                <Text color={textMain} fontWeight="700">Сэтгэл хөдлөл</Text>
              </HStack>
            </HStack>

            <Button
              as={Link}
              href="/dashboard/chat"
              size="sm"
              bg={pillBg}
              border="1px solid"
              borderColor={pillBorder}
              color={textMain}
              borderRadius="999px"
            >
              Чат
            </Button>
          </Flex>

          {/* Content */}
          <Box px={{ base: 4, md: 6 }} pb={{ base: 5, md: 7 }}>
            <Heading color={textMain} fontSize={{ base: "26px", md: "40px" }}>
              Сэтгэл дотроо юу болж
              <br /> байгааг мэдэрч суръя
            </Heading>

            <Text mt={3} color={textSub}>
              Өөрийн дотоод хөдөлгөөнийг ажиглаж, ойлгож эхлэх орон зай.
            </Text>

            <Divider my={5} borderColor="rgba(255,255,255,0.10)" />

            <Accordion allowMultiple>
              {SECTIONS.map((s, i) => (
                <AccordionItem key={s.id} bg={cardBg} border="1px solid" borderColor={cardBorder} borderRadius="14px" mb={3}>
                  <AccordionButton px={pad}>
                    <HStack w="full" justify="space-between">
                      <Text color={textMain} fontWeight="700">{i + 1}. {s.title}</Text>
                      <Text color={textMain}>✓</Text>
                    </HStack>
                  </AccordionButton>
                  <AccordionPanel>
                    {s.paragraphs.map((p, idx) => (
                      <Text key={idx} color={textSub} mb={2}>{p}</Text>
                    ))}
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
