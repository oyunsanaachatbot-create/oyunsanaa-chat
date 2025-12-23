'use client';
/*eslint-disable*/

import Link from '@/components/link/Link';
import MessageBoxChat from '@/components/MessageBox';
import { ChatBody, OpenAIModel } from '@/types/types';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Icon,
  Img,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { MdAutoAwesome, MdBolt, MdEdit, MdPerson } from 'react-icons/md';

// ✅ public asset path
const Bg = '/img/chat/bg-image.png';

// ✅ brand
const BRAND = '#1F6FB2';

export default function Chat(props: { apiKeyApp: string }) {
  const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
  const [loading, setLoading] = useState<boolean>(false);

  // ✅ scroll anchor
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // colors
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgIcon = useColorModeValue(
    'linear-gradient(180deg, #FBFBFF 0%, #CACAFF 100%)',
    'whiteAlpha.200',
  );
  const brandColor = useColorModeValue('brand.500', 'white');
  const buttonBg = useColorModeValue('white', 'whiteAlpha.100');
  const gray = useColorModeValue('gray.500', 'white');
  const buttonShadow = useColorModeValue(
    '14px 27px 45px rgba(112, 144, 176, 0.2)',
    'none',
  );
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );

  // ✅ output нэмэгдэхэд доош гүйлгэнэ
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [outputCode, loading]);

  const handleChange = (e: any) => {
    setInputCode(e.target.value);
  };

  const handleTranslate = async () => {
    // ⚠️ Танай одоогийн урсгал localStorage apiKey шаарддаг.
    // Хэрвээ та Vercel ENV ашиглах бол энэ хэсгийг дараа нь цэвэрлэж болно.
    let apiKey = localStorage.getItem('apiKey');

    setInputOnSubmit(inputCode);

    const maxCodeLength = 700;

    if (!apiKey?.includes('sk-')) {
      alert('Please enter an API key.');
      return;
    }
    if (!inputCode) {
      alert('Please enter your message.');
      return;
    }
    if (inputCode.length > maxCodeLength) {
      alert(
        `Please enter less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`,
      );
      return;
    }

    setOutputCode('');
    setLoading(true);

    const controller = new AbortController();
    const body: ChatBody = {
      inputCode,
      model,
      apiKey,
    };

    // ✅ route чинь /api/chatAPI байгаа тул үүнийг хэвээр үлдээлээ
    const response = await fetch('/api/chatAPI', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setLoading(false);
      alert('API error. Check API key or server logs.');
      return;
    }

    const data = response.body;
    if (!data) {
      setLoading(false);
      alert('Empty response body');
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value || new Uint8Array());
      setOutputCode((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  return (
    <Flex w="100%" direction="column" position="relative">
      {/* bg */}
      <Img
        src={Bg}
        position="absolute"
        w={{ base: '220px', md: '350px' }}
        left="50%"
        top="45%"
        transform="translate(-50%, -50%)"
        opacity={0.12}
        pointerEvents="none"
      />

      {/* ✅ MAIN CONTENT BOX (sidebar эвдэхгүй, дотороо зөв layout) */}
      <Flex
        direction="column"
        mx="auto"
        w="100%"
        maxW="1000px"
        // ✅ template-ийн main content өндөр дээр ажиллахын тулд:
        flex="1"
        minH="0"
        position="relative"
        px={{ base: '10px', md: '0px' }}
      >
        {/* Model Change */}
        <Flex direction="column" w="100%" mb="10px">
          <Flex mx="auto" zIndex="2" w="max-content" mb="16px" borderRadius="60px">
            <Flex
              cursor="pointer"
              transition="0.3s"
              justify="center"
              align="center"
              bg={model === 'gpt-3.5-turbo' ? buttonBg : 'transparent'}
              w="174px"
              h="64px"
              boxShadow={model === 'gpt-3.5-turbo' ? buttonShadow : 'none'}
              borderRadius="14px"
              color={textColor}
              fontSize="16px"
              fontWeight="700"
              onClick={() => setModel('gpt-3.5-turbo')}
              border="1px solid"
              borderColor={model === 'gpt-3.5-turbo' ? BRAND : 'transparent'}
            >
              <Flex
                borderRadius="full"
                justify="center"
                align="center"
                bg={bgIcon}
                me="10px"
                h="36px"
                w="36px"
              >
                <Icon as={MdAutoAwesome} boxSize="18px" color={iconColor} />
              </Flex>
              GPT-3.5
            </Flex>

            <Flex
              cursor="pointer"
              transition="0.3s"
              justify="center"
              align="center"
              bg={model === 'gpt-4' ? buttonBg : 'transparent'}
              w="164px"
              h="64px"
              boxShadow={model === 'gpt-4' ? buttonShadow : 'none'}
              borderRadius="14px"
              color={textColor}
              fontSize="16px"
              fontWeight="700"
              onClick={() => setModel('gpt-4')}
              border="1px solid"
              borderColor={model === 'gpt-4' ? BRAND : 'transparent'}
            >
              <Flex
                borderRadius="full"
                justify="center"
                align="center"
                bg={bgIcon}
                me="10px"
                h="36px"
                w="36px"
              >
                <Icon as={MdBolt} boxSize="18px" color={iconColor} />
              </Flex>
              GPT-4
            </Flex>
          </Flex>

          <Accordion color={gray} allowToggle w="100%" my="0px" mx="auto">
            <AccordionItem border="none">
              <AccordionButton
                borderBottom="0px solid"
                maxW="max-content"
                mx="auto"
                _hover={{ border: '0px solid', bg: 'none' }}
                _focus={{ border: '0px solid', bg: 'none' }}
              >
                <Box flex="1" textAlign="left">
                  <Text color={gray} fontWeight="500" fontSize="sm">
                    No plugins added
                  </Text>
                </Box>
                <AccordionIcon color={gray} />
              </AccordionButton>
              <AccordionPanel mx="auto" w="max-content" p="0px 0px 10px 0px">
                <Text color={gray} fontWeight="500" fontSize="sm" textAlign="center">
                  This is a cool text example.
                </Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Flex>

        {/* ✅ MESSAGES SCROLLER (чат стандарт) */}
        <Flex
          direction="column"
          w="100%"
          flex="1"
          minH="0"
          overflowY="auto"
          px={{ base: '4px', md: '10px' }}
          // ✅ input bar overlay болох тул доор padding өгнө
          pb="120px"
        >
          {/* show only when there is output (танай хуучин логик) */}
          {outputCode ? (
            <>
              {/* user bubble */}
              <Flex w="100%" align="flex-start" mb="12px">
                <Flex
                  borderRadius="full"
                  justify="center"
                  align="center"
                  bg="transparent"
                  border="1px solid"
                  borderColor={borderColor}
                  me="14px"
                  h="36px"
                  minH="36px"
                  minW="36px"
                  mt="2px"
                >
                  <Icon as={MdPerson} boxSize="18px" color={BRAND} />
                </Flex>

                <Flex
                  p="14px 16px"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="18px"
                  w="100%"
                  bg={useColorModeValue('white', 'whiteAlpha.100')}
                  boxShadow={useColorModeValue('sm', 'none')}
                >
                  <Text
                    color={textColor}
                    fontWeight="600"
                    fontSize={{ base: 'sm', md: 'md' }}
                    lineHeight={{ base: '22px', md: '24px' }}
                    whiteSpace="pre-wrap"
                    wordBreak="break-word"
                  >
                    {inputOnSubmit}
                  </Text>
                  <Icon
                    cursor="pointer"
                    as={MdEdit}
                    ms="auto"
                    boxSize="18px"
                    color={gray}
                    onClick={() => setInputCode(inputOnSubmit)}
                  />
                </Flex>
              </Flex>

              {/* assistant bubble */}
              <Flex w="100%" align="flex-start" mb="12px">
                <Flex
                  borderRadius="full"
                  justify="center"
                  align="center"
                  bg={BRAND}
                  me="14px"
                  h="36px"
                  minH="36px"
                  minW="36px"
                  mt="2px"
                >
                  <Icon as={MdAutoAwesome} boxSize="18px" color="white" />
                </Flex>

                <Box w="100%">
                  {/* MessageBoxChat хэвээр ашиглая */}
                  <MessageBoxChat output={outputCode} />
                </Box>
              </Flex>

              <Box ref={bottomRef} />
            </>
          ) : (
            <Flex
              direction="column"
              align="center"
              justify="center"
              mt="30px"
              opacity={0.9}
            >
              <Text color={textColor} fontWeight="700">
                Сайн уу 👋
              </Text>
              <Text color={gray} fontSize="sm" textAlign="center" mt="6px" maxW="520px">
                Доор мессежээ бичээд “Submit” дар. (Enter = илгээх болгож хүсвэл дараа тохируулна)
              </Text>
            </Flex>
          )}
        </Flex>

        {/* ✅ INPUT BAR: template дотороо доор тогтмол (sticky биш, absolute) */}
        <Flex
          position="absolute"
          left="0"
          right="0"
          bottom="0"
          zIndex={5}
          bg={useColorModeValue('white', 'navy.900')}
          borderTop="1px solid"
          borderColor={borderColor}
          px={{ base: '10px', md: '10px' }}
          pt="12px"
          pb="calc(env(safe-area-inset-bottom) + 12px)"
        >
          <Flex w="100%" gap="10px" align="center">
            <Input
              value={inputCode}
              onChange={handleChange}
              minH="52px"
              h="52px"
              flex="1" // ✅ урт-нарийхан асуудал алга
              border="1px solid"
              borderColor={borderColor}
              borderRadius="14px" // ✅ стандарт look (pill биш)
              px="14px"
              fontSize="sm"
              fontWeight="500"
              _focus={{ borderColor: BRAND }}
              color={inputColor}
              _placeholder={placeholderColor}
              placeholder="Type your message here..."
              isDisabled={loading}
            />

            <Button
              h="52px"
              px={{ base: '18px', md: '26px' }}
              borderRadius="14px"
              bg={BRAND}
              color="white"
              _hover={{ opacity: 0.92 }}
              _active={{ opacity: 0.86 }}
              onClick={handleTranslate}
              isLoading={loading}
              flexShrink={0}
            >
              Submit
            </Button>
          </Flex>
        </Flex>

        {/* ✅ энэ notice чатаас доош түлхээд байсан — одоо scroller дотор биш тул зай “үсрэхгүй”.
            Хүсэхгүй бол бүр устгаарай. */}
        <Flex
          justify="center"
          mt="14px"
          direction={{ base: 'column', md: 'row' }}
          alignItems="center"
          display="none" // ✅ default: нуучихлаа (та хүсвэл show болго)
        >
          <Text fontSize="xs" textAlign="center" color={gray}>
            Free Research Preview. ChatGPT may produce inaccurate information about
            people, places, or facts.
          </Text>
          <Link href="https://help.openai.com/en/articles/6825453-chatgpt-release-notes">
            <Text
              fontSize="xs"
              color={textColor}
              fontWeight="500"
              textDecoration="underline"
            >
              ChatGPT May 12 Version
            </Text>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
}
