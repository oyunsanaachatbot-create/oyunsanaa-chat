'use client';
/*eslint-disable*/

import Link from '@/components/link/Link';
import MessageBoxChat from '@/components/MessageBox';
import { OpenAIModel } from '@/types/types';
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

const Bg = '/img/chat/bg-image.png';
const BRAND = '#1F6FB2';

export default function Chat() {
  const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
  const [loading, setLoading] = useState<boolean>(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [outputCode, loading]);

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgIcon = useColorModeValue(
    'linear-gradient(180deg, #FBFBFF 0%, #CACAFF 100%)',
    'whiteAlpha.200',
  );
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

  const handleTranslate = async () => {
    const trimmed = inputCode.trim();
    const maxLen = 1200;

    if (!trimmed) {
      alert('Please enter your message.');
      return;
    }
    if (trimmed.length > maxLen) {
      alert(`Too long (${trimmed.length}/${maxLen}).`);
      return;
    }

    setInputOnSubmit(trimmed);
    setOutputCode('');
    setLoading(true);

    const response = await fetch('/api/chatAPI', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputCode: trimmed,
        model, // ✅ server env key ашиглана
      }),
    });

    if (!response.ok) {
      const t = await response.text().catch(() => '');
      setLoading(false);
      alert(`API error: ${t || response.status}`);
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

      <Flex
        direction="column"
        mx="auto"
        w="100%"
        maxW="1000px"
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
              bg={model === 'gpt-4o' ? buttonBg : 'transparent'}
              w="164px"
              h="64px"
              boxShadow={model === 'gpt-4o' ? buttonShadow : 'none'}
              borderRadius="14px"
              color={textColor}
              fontSize="16px"
              fontWeight="700"
              onClick={() => setModel('gpt-4o')}
              border="1px solid"
              borderColor={model === 'gpt-4o' ? BRAND : 'transparent'}
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
              GPT-4o
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

        {/* ✅ Messages scroller */}
        <Flex
          direction="column"
          w="100%"
          flex="1"
          minH="0"
          overflowY="auto"
          px={{ base: '4px', md: '10px' }}
          pb="120px"
        >
          {outputCode ? (
            <>
              {/* user row */}
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

              {/* assistant row */}
              <Flex w="100%" align="flex-start" mb="12px">
                <Flex
                  borderRadius="full"
                  justify="center"
                  align="center"
                  bg={BRAND}
                  me="14px"
                  h="36px"
                  minW="36px"
                  mt="2px"
                >
                  <Icon as={MdAutoAwesome} boxSize="18px" color="white" />
                </Flex>

                <Box w="100%">
                  <MessageBoxChat output={outputCode} />
                </Box>
              </Flex>

              <Box ref={bottomRef} />
            </>
          ) : (
            <Flex direction="column" align="center" justify="center" mt="30px" opacity={0.9}>
              <Text color={textColor} fontWeight="700">
                Сайн уу 👋
              </Text>
              <Text color={gray} fontSize="sm" textAlign="center" mt="6px" maxW="520px">
                Доор мессежээ бичээд Submit дар.
              </Text>
            </Flex>
          )}
        </Flex>

        {/* ✅ Input bar (доор тогтмол) */}
        <Flex
          position="sticky"
          bottom="0"
          zIndex={10}
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
              onChange={(e) => setInputCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!loading) handleTranslate();
                }
              }}
              minH="52px"
              h="52px"
              flex="1"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="14px"
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
      </Flex>
    </Flex>
  );
}
