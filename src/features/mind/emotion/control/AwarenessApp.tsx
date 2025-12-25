"use client";

/* eslint-disable */
import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Heading,
  Icon,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useBreakpointValue,
  Divider,
  Tag,
} from "@chakra-ui/react";
import { MessageCircle, Sparkles } from "lucide-react";

type Lang = "mn" | "en" | "ru" | "ja" | "ko";

const COPY: Record<
  Lang,
  {
    appTitle: string;
    pillTop: string;
    pillSection: string;
    intro: string;
    chat: string;
    items: { title: string; body: string[] }[];
  }
> = {
  mn: {
    appTitle: "Сэтгэл дотроо юу болж\nбайгааг мэдэрч суръя",
    pillTop: "Миний сэтгэлзүй",
    pillSection: "сэтгэл хөдлөл",
    intro:
      "Өөрийн дотоод хөдөлгөөнийг ажиглах, нэрлэх, ойлгох дадлыг эндээс эхлүүлнэ.",
    chat: "Чат",
    items: [
      {
        title: "Мэдрэхүй гэж юу вэ?",
        body: [
          "Мэдрэхүй гэдэг нь бие, сэтгэл хоёрын дохиог “анзаарах” чадвар.",
          "Жишээ нь: цээж давчдах, хоолой зангирах, гэдэс базлах, догдлох гэх мэт.",
          "Анзаарах тусам чи өөрийгөө илүү ойлгож эхэлдэг.",
        ],
      },
      {
        title: "Ямар ямар мэдрэмжүүд байдаг вэ?",
        body: [
          "Суурь мэдрэмжүүд: баяр, гуниг, уур, айдас, жигшил, гайхшрал.",
          "Нарийн мэдрэмжүүд: түгшүүр, гомдол, ичгүүр, гэмшил, атаархал, ганцаардал гэх мэт.",
          "Нэг дор хэд хэдэн мэдрэмж давхар байж болно — энэ нь хэвийн.",
        ],
      },
      {
        title: "Юуг ойлгох ёстой вэ?",
        body: [
          "Мэдрэмж бол “мэдээ” — муу хүн гэсэн үг биш.",
          "Мэдрэмж бүрийн цаана хэрэгцээ байдаг (аюулгүй байдал, хүндлэл, амралт, хайр гэх мэт).",
          "Бодит баримт ба тайлбарыг салгаж сурах нь чамайг тайван болгоно.",
        ],
      },
      {
        title: "Юуг эзэмших сурах вэ?",
        body: [
          "1) Ажиглах: яг одоо биед юу мэдрэгдэж байна?",
          "2) Нэрлэх: энэ нь уур уу, айдас уу, гуниг уу?",
          "3) Зөөлөн асуух: энэ мэдрэмж надад юуг хэлээд байна?",
          "4) Бага алхам: нэг жижиг үйлдэл (ус уух, алхах, бичих).",
        ],
      },
      {
        title: "Хэрхэн дадал болгох вэ?",
        body: [
          "Өдөрт 2 минут: “Одоо би юу мэдэрч байна?” гэж өөрөөсөө асуу.",
          "Нэрлээд бич: “Би … мэдэрч байна, учир нь … хэрэгтэй байна.”",
          "Дараа нь л шийдвэр гарга: эхлээд тайвшир, дараа нь үйлд.",
        ],
      },
    ],
  },
  en: {
    appTitle: "Learn to notice\nwhat's happening inside",
    pillTop: "My psychology",
    pillSection: "emotions",
    intro:
      "Start here to practice observing, naming, and understanding your inner experience.",
    chat: "Chat",
    items: [
      {
        title: "What is interoception?",
        body: [
          "Interoception is your ability to notice signals from your body and mind.",
          "Examples: tight chest, lump in throat, butterflies, restlessness.",
          "The more you notice, the more clearly you understand yourself.",
        ],
      },
      {
        title: "What kinds of feelings exist?",
        body: [
          "Core emotions: joy, sadness, anger, fear, disgust, surprise.",
          "Nuanced emotions: anxiety, shame, guilt, jealousy, loneliness, etc.",
          "Multiple emotions can appear at the same time — that’s normal.",
        ],
      },
      {
        title: "What should I understand?",
        body: [
          "Emotions are information — not a verdict about you.",
          "Every emotion points to a need (safety, respect, rest, connection, etc.).",
          "Separating facts from interpretations reduces overwhelm.",
        ],
      },
      {
        title: "What skills should I build?",
        body: [
          "1) Notice: what do I feel in my body right now?",
          "2) Name: is it anger, fear, sadness, or something else?",
          "3) Ask gently: what is this emotion trying to tell me?",
          "4) Take a tiny step: water, walk, write, breathe.",
        ],
      },
      {
        title: "How do I make it a habit?",
        body: [
          "2 minutes a day: ask “What do I feel right now?”",
          "Name it and write: “I feel … because I need …”",
          "Decide later: regulate first, act second.",
        ],
      },
    ],
  },
  ru: {
    appTitle: "Учусь замечать,\nчто происходит внутри",
    pillTop: "Моя психология",
    pillSection: "эмоции",
    intro:
      "Здесь начинается практика наблюдения, называния и понимания внутреннего состояния.",
    chat: "Чат",
    items: [
      {
        title: "Что такое интероцепция?",
        body: [
          "Интероцепция — способность замечать сигналы тела и психики.",
          "Примеры: сдавленность в груди, ком в горле, напряжение, дрожь.",
          "Чем лучше замечаешь — тем лучше понимаешь себя.",
        ],
      },
      {
        title: "Какие бывают чувства?",
        body: [
          "Базовые эмоции: радость, грусть, злость, страх, отвращение, удивление.",
          "Тонкие эмоции: тревога, стыд, вина, зависть, одиночество и т.д.",
          "Несколько эмоций одновременно — это нормально.",
        ],
      },
      {
        title: "Что важно понять?",
        body: [
          "Эмоции — это информация, а не приговор.",
          "За каждой эмоцией стоит потребность (безопасность, уважение, отдых, близость).",
          "Отделяй факты от интерпретаций — так становится спокойнее.",
        ],
      },
      {
        title: "Чему учиться?",
        body: [
          "1) Наблюдать: что я ощущаю в теле прямо сейчас?",
          "2) Называть: это злость, страх, грусть?",
          "3) Мягко спросить: что эта эмоция мне сообщает?",
          "4) Маленький шаг: вода, прогулка, запись, дыхание.",
        ],
      },
      {
        title: "Как сделать привычкой?",
        body: [
          "2 минуты в день: вопрос “Что я сейчас чувствую?”",
          "Назови и запиши: “Я чувствую … потому что мне нужно …”",
          "Решения — позже: сначала стабилизация, потом действие.",
        ],
      },
    ],
  },
  ja: {
    appTitle: "心の中で起きていることに\n気づく練習",
    pillTop: "わたしの心理",
    pillSection: "感情",
    intro:
      "内側の体験を観察し、名前をつけ、理解する練習をここから始めます。",
    chat: "チャット",
    items: [
      {
        title: "内受容感覚（インターセプション）とは？",
        body: [
          "身体や心のサインに気づく力です。",
          "例：胸の締めつけ、喉のつかえ、そわそわ、緊張。",
          "気づけるほど、自分の理解が深まります。",
        ],
      },
      {
        title: "どんな感情がある？",
        body: [
          "基本：喜び、悲しみ、怒り、恐れ、嫌悪、驚き。",
          "繊細：不安、恥、罪悪感、嫉妬、孤独など。",
          "同時に複数の感情が出ても正常です。",
        ],
      },
      {
        title: "理解すべきこと",
        body: [
          "感情は情報であって、あなたへの判決ではありません。",
          "感情の裏にはニーズ（安全、尊重、休息、つながり等）があります。",
          "事実と解釈を分けると落ち着きます。",
        ],
      },
      {
        title: "身につけるスキル",
        body: [
          "1) 気づく：今、体のどこに何を感じる？",
          "2) 名づける：怒り？恐れ？悲しみ？",
          "3) 優しく問う：この感情は何を伝えている？",
          "4) 小さく行動：水、散歩、書く、呼吸。",
        ],
      },
      {
        title: "習慣化するには？",
        body: [
          "毎日2分：「今、何を感じてる？」",
          "名づけて書く：「…を感じる。なぜなら…が必要。」",
          "決めるのは後：整える→行動の順。",
        ],
      },
    ],
  },
  ko: {
    appTitle: "내 안에서 일어나는 일을\n느끼고 알아차리기",
    pillTop: "나의 심리",
    pillSection: "감정",
    intro:
      "내면 경험을 관찰하고, 이름 붙이고, 이해하는 연습을 여기서 시작해요.",
    chat: "채팅",
    items: [
      {
        title: "내수용감각(인터로셉션)이란?",
        body: [
          "몸과 마음의 신호를 알아차리는 능력이에요.",
          "예: 가슴 답답함, 목의 뭉침, 긴장, 초조함.",
          "알아차릴수록 나를 더 잘 이해하게 돼요.",
        ],
      },
      {
        title: "감정에는 어떤 것들이 있나요?",
        body: [
          "기본 감정: 기쁨, 슬픔, 분노, 두려움, 혐오, 놀람.",
          "섬세한 감정: 불안, 수치심, 죄책감, 질투, 외로움 등.",
          "여러 감정이 동시에 나타나는 건 정상이에요.",
        ],
      },
      {
        title: "무엇을 이해해야 하나요?",
        body: [
          "감정은 정보이지, 나에 대한 판결이 아니에요.",
          "모든 감정 뒤엔 욕구(안전, 존중, 휴식, 연결 등)가 있어요.",
          "사실과 해석을 분리하면 훨씬 차분해져요.",
        ],
      },
      {
        title: "어떤 기술을 익혀야 하나요?",
        body: [
          "1) 관찰: 지금 몸에서 무엇이 느껴지지?",
          "2) 이름 붙이기: 분노? 두려움? 슬픔?",
          "3) 부드럽게 묻기: 이 감정이 말하는 건 뭐지?",
          "4) 작은 행동: 물, 산책, 기록, 호흡.",
        ],
      },
      {
        title: "어떻게 습관으로 만들까요?",
        body: [
          "하루 2분: “지금 나는 무엇을 느끼지?”",
          "이름 붙여 쓰기: “나는 …을 느낀다. 왜냐하면 …이 필요해서.”",
          "결정은 나중에: 안정 → 행동 순서.",
        ],
      },
    ],
  },
};

function pickLang(): Lang {
  if (typeof window === "undefined") return "mn";
  const saved = (window.localStorage.getItem("oy_lang") || "").toLowerCase();
  if (saved === "mn" || saved === "en" || saved === "ru" || saved === "ja" || saved === "ko")
    return saved;

  const nav = (navigator.language || "").toLowerCase();
  if (nav.startsWith("ru")) return "ru";
  if (nav.startsWith("ja")) return "ja";
  if (nav.startsWith("ko")) return "ko";
  if (nav.startsWith("en")) return "en";
  return "mn";
}

export default function AwarenessApp() {
  const [lang, setLang] = useState<Lang>(() => pickLang());
  const t = useMemo(() => COPY[lang], [lang]);

  // ✅ Гол зорилго: Day mode дээр ч цэнхэр background/кардууд яг адилхан гарах
  // Тиймээс useColorModeValue ашиглахгүй — тогтмол өнгө тавьж байна.
  const pageBg = "linear-gradient(180deg, rgba(31,111,178,0.35) 0%, rgba(10,24,36,0.55) 100%)";
  const shellBg = "rgba(22, 45, 62, 0.55)";
  const shellBorder = "rgba(255,255,255,0.12)";
  const cardBg = "rgba(255,255,255,0.08)";
  const cardBorder = "rgba(255,255,255,0.14)";
  const textMain = "rgba(255,255,255,0.92)";
  const textSub = "rgba(255,255,255,0.72)";

  const radius = useBreakpointValue({ base: "18px", md: "24px" });
  const pad = useBreakpointValue({ base: 5, md: 7 });

  const setLanguage = (next: Lang) => {
    setLang(next);
    try {
      window.localStorage.setItem("oy_lang", next);
    } catch {}
  };

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
          boxShadow="0 25px 80px rgba(0,0,0,0.45)"
          overflow="hidden"
        >
          <Flex
            px={{ base: 5, md: 7 }}
            py={{ base: 5, md: 6 }}
            align="center"
            justify="space-between"
          >
            <HStack spacing={3}>
              <HStack
                spacing={2}
                px={3}
                py={1.5}
                borderRadius="999px"
                bg="rgba(255,255,255,0.08)"
                border="1px solid rgba(255,255,255,0.12)"
              >
                <Icon as={Sparkles} boxSize={4} color="rgba(255,255,255,0.85)" />
                <Text fontSize="sm" color={textMain} fontWeight="600">
                  {t.pillTop}
                </Text>
              </HStack>

              <HStack
                spacing={2}
                px={3}
                py={1.5}
                borderRadius="999px"
                bg="rgba(255,255,255,0.08)"
                border="1px solid rgba(255,255,255,0.12)"
              >
                <Text fontSize="sm" color={textMain} fontWeight="600">
                  {t.pillSection}
                </Text>
              </HStack>
            </HStack>

            <HStack spacing={2}>
              {/* Language quick switch (optional) */}
              <HStack
                spacing={1}
                px={2}
                py={1}
                borderRadius="999px"
                bg="rgba(255,255,255,0.06)"
                border="1px solid rgba(255,255,255,0.10)"
              >
                {(["mn", "en", "ru", "ja", "ko"] as Lang[]).map((k) => (
                  <Button
                    key={k}
                    size="xs"
                    variant="ghost"
                    onClick={() => setLanguage(k)}
                    px={2}
                    h="26px"
                    borderRadius="999px"
                    bg={lang === k ? "rgba(31,111,178,0.35)" : "transparent"}
                    _hover={{ bg: "rgba(255,255,255,0.10)" }}
                    color={textMain}
                    fontWeight={lang === k ? "700" : "600"}
                  >
                    {k.toUpperCase()}
                  </Button>
                ))}
              </HStack>

              <Button
                as={Link}
                href="/dashboard/chat"
                size="sm"
                leftIcon={<Icon as={MessageCircle} boxSize={4} />}
                bg="rgba(255,255,255,0.08)"
                border="1px solid rgba(255,255,255,0.16)"
                color={textMain}
                _hover={{ bg: "rgba(255,255,255,0.12)" }}
                borderRadius="999px"
              >
                {t.chat}
              </Button>
            </HStack>
          </Flex>

          <Box px={{ base: 5, md: 7 }} pb={{ base: 6, md: 7 }}>
            <Heading
              as="h1"
              fontSize={{ base: "28px", md: "42px" }}
              lineHeight={{ base: "1.15", md: "1.1" }}
              color={textMain}
              whiteSpace="pre-line"
              letterSpacing="-0.02em"
            >
              {t.appTitle}
            </Heading>

            <Text mt={3} fontSize={{ base: "sm", md: "md" }} color={textSub} maxW="72ch">
              {t.intro}
            </Text>

            <Divider my={{ base: 5, md: 6 }} borderColor="rgba(255,255,255,0.10)" />

            <Accordion allowMultiple display="grid" gap={3}>
              {t.items.map((it, idx) => (
                <AccordionItem
                  key={it.title}
                  border="1px solid"
                  borderColor={cardBorder}
                  borderRadius="16px"
                  bg={cardBg}
                  overflow="hidden"
                >
                  <h2>
                    <AccordionButton px={pad} py={{ base: 4, md: 5 }} _hover={{ bg: "rgba(255,255,255,0.08)" }}>
                      <HStack w="full" spacing={3} align="center">
                        <Tag
                          size="sm"
                          borderRadius="999px"
                          bg="rgba(255,255,255,0.10)"
                          border="1px solid rgba(255,255,255,0.14)"
                          color={textMain}
                          fontWeight="700"
                        >
                          {idx + 1}
                        </Tag>

                        <Text flex="1" textAlign="left" color={textMain} fontWeight="700" fontSize={{ base: "sm", md: "md" }}>
                          {it.title}
                        </Text>

                        <AccordionIcon color="rgba(255,255,255,0.8)" />
                      </HStack>
                    </AccordionButton>
                  </h2>

                  <AccordionPanel px={pad} pb={{ base: 5, md: 6 }} pt={0}>
                    <VStack align="start" spacing={2.5}>
                      {it.body.map((p, i) => (
                        <Text key={i} color={textSub} fontSize={{ base: "sm", md: "md" }} lineHeight="1.65">
                          {p}
                        </Text>
                      ))}
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>

            <Text mt={6} fontSize="xs" color="rgba(255,255,255,0.55)">
              {/* жижиг footer */}
              oyunsanaa · Awareness
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
