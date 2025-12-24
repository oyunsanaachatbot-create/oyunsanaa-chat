import { mode } from '@chakra-ui/theme-tools';

export const globalStyles = {
  colors: {
    brand: {
      50: '#EAF3FA',
      100: '#D6E9F5',
      200: '#ADD3EB',
      300: '#85BDE1',
      400: '#5CA7D7',
      500: '#1F6FB2', // BRAND
      600: '#18598F',
      700: '#12436C',
      800: '#0C2D48',
      900: '#061725',
    },

    // хуучин SDK-д хэрэглэгдэж байсан өнгө — secondary accent болгож үлдээлээ
    brandAlt: {
      500: '#3E6F96',
    },

    navy: {
      50: '#E9EFFA',
      100: '#C7D6F2',
      200: '#A6BEEA',
      300: '#7F9BDA',
      400: '#5B7AC8',
      500: '#3C5AAE',
      600: '#2D468B',
      700: '#223667',
      800: '#182646',
      900: '#0F1B36', // ⬅️ DARK суурь (хар биш deep blue)
    },

    gray: {
      50: '#FFFFFF',
      100: '#FAFCFE',
      200: '#F1F5F9',
      300: '#E2E8F0',
      400: '#CBD5E1',
      500: '#94A3B8',
      600: '#64748B',
      700: '#334155',
      800: '#1F2A44',
      900: '#141C2E',
    },
  },

  styles: {
    global: (props: any) => ({
      html: {
        fontFamily: 'Plus Jakarta Sans',
      },

      body: {
        overflowX: 'hidden',
        fontFamily: 'Plus Jakarta Sans',
        color: mode('navy.900', 'gray.100')(props),

        /* ⬇️ LIGHT / DARK суурь */
        bg: mode('#fdfeff', '#0F1B36')(props),

        /* ⬇️ DARK дээр “гэрэлтсэн” background */
        backgroundImage: mode(
          'none',
          `
          radial-gradient(
            900px circle at 55% 18%,
            rgba(31,111,178,0.25),
            transparent 55%
          ),
          radial-gradient(
            700px circle at 20% 80%,
            rgba(62,111,150,0.18),
            transparent 60%
          ),
          linear-gradient(
            180deg,
            #0F1B36 0%,
            #0B1530 55%,
            #081126 100%
          )
        `
        )(props),

        backgroundAttachment: 'fixed',
      },

      input: {
        color: mode('gray.700', 'gray.100')(props),
      },

      textarea: {
        color: mode('gray.700', 'gray.100')(props),
      },

      '::placeholder': {
        color: mode('gray.500', 'gray.500')(props),
      },
    }),
  },
};
