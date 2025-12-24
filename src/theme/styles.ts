import { mode } from '@chakra-ui/theme-tools';

export const globalStyles = {
  colors: {
    brand: {
      // BRAND = #1F6FB2
      50:  '#EAF3FA',
      100: '#D6E9F5',
      200: '#ADD3EB',
      300: '#85BDE1',
      400: '#5CA7D7',
      500: '#1F6FB2',
      600: '#18598F',
      700: '#12436C',
      800: '#0C2D48',
      900: '#061725',
    },

    // Хэрвээ чи хуучин SDK дээрээ хэрэглээд байсан #3E6F96-г “secondary/alt brand” маягаар үлдээх бол:
    brandAlt: {
      50:  '#EEF4F8',
      100: '#D7E4EE',
      200: '#AFCADB',
      300: '#86AFC8',
      400: '#5E95B5',
      500: '#3E6F96',
      600: '#335B7A',
      700: '#27465E',
      800: '#1B3142',
      900: '#0F1C26',
    },

    // Dark-ийн navy палитрыг *арай цайвар* болгож “гэрэлтэй dark” болгоно
    navy: {
      50:  '#E9EFFA',
      100: '#C7D6F2',
      200: '#A6BEEA',
      300: '#7F9BDA',
      400: '#5B7AC8',
      500: '#3C5AAE',
      600: '#2D468B',
      700: '#223667',
      800: '#182646',
      900: '#0F1B36', // <-- өмнөх #0b1437 байсан, жаахан гэрэлтэй болголоо
    },

    // “surface” өнгүүд (кардууд, input, панел) - dark дээр илүү уншигдахуйц
    gray: {
      50:  '#FFFFFF',
      100: '#FAFCFE',
      200: '#F1F5F9',
      300: '#E2E8F0',
      400: '#CBD5E1',
      500: '#94A3B8',
      600: '#64748B',
      700: '#334155',
      800: '#1F2A44', // dark surface
      900: '#141C2E', // deep surface
    },

    secondaryGray: {
      100: '#E0E5F2',
      200: '#E2E8F0',
      300: '#F4F7FE',
      400: '#E9EDF7',
      500: '#718096',
      600: '#A3AED0',
      700: '#707EAE',
      800: '#707EAE',
      900: '#1B2559',
    },
  },

  styles: {
    global: (props: any) => ({
      html: { fontFamily: 'Plus Jakarta Sans' },
      body: {
        overflowX: 'hidden',

        // ⬇️ Dark дээр bg-ийг “гэрэлтэй dark” болгох
        bg: mode('#fdfeff', 'navy.900')(props),

        // ⬇️ Dark дээр текстийг арай цайвар (уншигдахуйц) болгох
        color: mode('navy.900', 'gray.100')(props),

        fontFamily: 'Plus Jakarta Sans',
      },

      // Input текст dark дээр бүдгэрэхээс сэргийлнэ
      input: {
        color: mode('gray.700', 'gray.100')(props),
      },

      // Placeholder dark дээр
      '::placeholder': {
        color: mode('gray.500', 'gray.500')(props),
      },
    }),
  },
};
