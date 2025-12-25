"use client";

import Link from "next/link";
import {
  Box,
  Flex,
  SimpleGrid,
  Heading,
  Text,
  HStack,
  Button,
  Image,
  Badge,
} from "@chakra-ui/react";

type Item = {
  id: string;
  title: string;
  desc: string;
  img: string;
  href: string;
};

const ITEMS: Item[] = [
  {
    id: "awareness",
    title: "Мэдрэхүй гэж юу вэ?",
    desc: "Дотоод хөдөлгөөнөө анзаарах эхний алхам",
    img: "/images/ebook/awareness.jpg",
    href: "/dashboard/ebook/awareness",
  },
  {
    id: "rules",
    title: "Амьдралын дүрэм",
    desc: "Эргэн харах, цэгцлэх жижиг дүрмүүд",
    img: "/images/ebook/rules.jpg",
    href: "/dashboard/ebook/rules",
  },
  {
    id: "notes",
    title: "Тэмдэглэл",
    desc: "Өдөр тутмын бодол, санаа",
    img: "/dashboard/placeholder.png",
    href: "/dashboard/ebook/notes",
  },
];

export default function EbookHome() {
  const pageBg =
    "radial-gradient(1100px 650px at 20% 0%, rgba(31,111,178,0.75) 0%, rgba(31,111,178,0.28) 55%, rgba(10,24,36,0.12) 100%), linear-gradient(180deg, rgba(8,20,32,0.38) 0%, rgba(8,20,32,0.28) 100%)";

  return (
    <Box minH="100dvh" bg={pageBg} px={{ base: 4, md: 8 }} py={{ base: 10, md: 14 }}>
      <Box maxW="1180px" mx="auto">
        <Flex align="center" justify="space-between" gap={3} flexWrap="wrap">
          <HStack spacing={3}>
            <Badge
              px={3}
              py={1.5}
              borderRadius="999px"
              bg="rgba(255,255,255,0.10)"
              border="1px solid rgba(255,255,255,0.14)"
              color="rgba(255,255,255,0.88)"
            >
              EBOOK
            </Badge>
          </HStack>

          <Button
            as={Link}
            href="/dashboard/chat"
            size="sm"
            bg="rgba(255,255,255,0.10)"
            border="1px solid rgba(255,255,255,0.14)"
            color="rgba(255,255,255,0.92)"
            _hover={{ bg: "rgba(255,255,255,0.14)" }}
            borderRadius="999px"
          >
            ← Чат руу буцах
          </Button>
        </Flex>

        <Heading
          mt={{ base: 6, md: 8 }}
          fontSize={{ base: "30px", md: "44px" }}
          color="rgba(255,255,255,0.92)"
          letterSpacing="0.12em"
          textAlign="center"
          fontFamily="serif"
        >
          НОМЫН АГУУЛГА
        </Heading>

        <Text
          mt={3}
          textAlign="center"
          color="rgba(255,255,255,0.72)"
          maxW="72ch"
          mx="auto"
          fontSize={{ base: "sm", md: "md" }}
        >
          Доорх карт бүр дээр дарж тухайн сэдвийн хуудсанд орж тэмдэглэл, бодлоо бичээрэй.
        </Text>

        <SimpleGrid
          mt={{ base: 8, md: 10 }}
          columns={{ base: 1, sm: 2, lg: 4 }}
          spacing={{ base: 5, md: 6 }}
        >
          {ITEMS.map((it) => (
            <Box
              key={it.id}
              as={Link}
              href={it.href}
              bg="rgba(255,255,255,0.08)"
              border="1px solid rgba(255,255,255,0.14)"
              borderRadius="18px"
              overflow="hidden"
              boxShadow="0 18px 60px rgba(0,0,0,0.25)"
              _hover={{ transform: "translateY(-2px)", transition: "0.15s" }}
            >
              <Box p={4}>
                <Image
                  src={it.img}
                  alt={it.title}
                  borderRadius="14px"
                  w="100%"
                  h={{ base: "170px", md: "170px" }}
                  objectFit="cover"
                />
              </Box>

              <Box px={5} pb={5}>
                <Text fontWeight="800" color="rgba(255,255,255,0.92)" mt={1}>
                  {it.title}
                </Text>
                <Text fontSize="sm" color="rgba(255,255,255,0.68)" mt={1}>
                  {it.desc}
                </Text>

                <Button
                  mt={4}
                  size="sm"
                  borderRadius="999px"
                  bg="rgba(31,111,178,0.30)"
                  border="1px solid rgba(255,255,255,0.16)"
                  color="rgba(255,255,255,0.92)"
                  _hover={{ bg: "rgba(31,111,178,0.38)" }}
                >
                  Орох →
                </Button>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
