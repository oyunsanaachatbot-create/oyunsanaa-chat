'use client';
/* eslint-disable */

import { Box, Flex, Icon, IconButton, Textarea, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { MdSend } from 'react-icons/md';

const BRAND = '#1F6FB2';

export function Composer(props: {
  loading: boolean;
  onSend: (text: string) => Promise<void>;
  initialText?: string;
}) {
  const [input, setInput] = useState(props.initialText || '');
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const textColor = useColorModeValue('navy.800', 'white');
  const subText = useColorModeValue('gray.500', 'whiteAlpha.700');
  const composerBg = useColorModeValue('white', 'whiteAlpha.50');
  const pageBg = useColorModeValue('white', 'navy.900');

  useEffect(() => {
    if (!props.loading) taRef.current?.focus();
  }, [props.loading]);

  const sendNow = async () => {
    const t = input.trim();
    if (!t) return;
    setInput('');
    await props.onSend(t);
    taRef.current?.focus();
  };

  return (
    <Box position="sticky" bottom="0" zIndex={5} borderTop="1px solid" borderColor={borderColor} bg={pageBg} pb="calc(env(safe-area-inset-bottom) + 12px)">
      <Flex w="100%" maxW="920px" mx="auto" px={{ base: '14px', md: '0px' }} py="12px">
        <Flex
          w="100%"
          border="1px solid"
          borderColor={borderColor}
          borderRadius="18px"
          px="10px"
          py="10px"
          align="flex-end"
          gap="8px"
          bg={composerBg}
        >
          <Textarea
            ref={taRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Мессеж бичээрэй…"
            resize="none"
            rows={1}
            minH="40px"
            maxH="140px"
            overflowY="auto"
            border="none"
            px="6px"
            py="8px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            _placeholder={{ color: subText }}
            _focus={{ boxShadow: 'none' }}
            isDisabled={props.loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendNow();
              }
            }}
          />

          <IconButton
            aria-label="send"
            icon={<Icon as={MdSend} boxSize="18px" />}
            onClick={sendNow}
            isLoading={props.loading}
            borderRadius="14px"
            h="40px"
            w="40px"
            bg={BRAND}
            color="white"
            _hover={{ opacity: 0.92 }}
            _active={{ opacity: 0.86 }}
          />
        </Flex>
      </Flex>
    </Box>
  );
}
