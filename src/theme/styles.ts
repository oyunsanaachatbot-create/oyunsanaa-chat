import { mode } from '@chakra-ui/theme-tools';

export const globalStyles = {
  colors: {
    // ✅ oyunsanaa brand = #1F6FB2
    brand: {
      50: '#EAF2FA',
      100: '#D2E4F4',
      200: '#A6C9EA',
      300: '#7AAEE0',
      400: '#4E93D6',
      500: '#1F6FB2', // main
      600: '#1A5E97',
      700: '#154D7C',
      800: '#103C61',
      900: '#0B2B46',
    },

    // ✅ scheme variations (components ашигладаг бол таараад явна)
    brandScheme: {
      50: '#EAF2FA',
      100: '#D2E4F4',
      200: '#A6C9EA',
      300: '#7AAEE0',
      400: '#4E93D6',
      500: '#1F6FB2',
      600: '#1A5E97',
      700: '#154D7C',
      800: '#103C61',
      900: '#0B2B46',
    },

    brandTabs: {
      50: '#EAF2FA',
      100: '#D2E4F4',
      200: '#A6C9EA',
      300: '#7AAEE0',
      400: '#4E93D6',
      500: '#1F6FB2',
      600: '#1A5E97',
      700: '#154D7C',
      800: '#103C61',
      900: '#0B2B46',
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

    red: {
      100: '#FEEFEE',
      500: '#EE5D50',
      600: '#E31A1A',
    },

    blue: {
      50: '#EFF4FB',
      500: '#3965FF',
    },

    orange: {
      100: '#FFF6DA',
      500: '#FFB547',
    },

    green: {
      100: '#E6FAF5',
      500: '#01B574',
    },

    white: {
      50: '#ffffff',
      100: '#ffffff',
      200: '#ffffff',
      300: '#ffffff',
      400: '#ffffff',
      500: '#ffffff',
      600: '#ffffff',
      700: '#ffffff',
      800: '#ffffff',
      900: '#ffffff',
    },

    // ✅ navy-гаа хадгалж байгаа (dark-ийн үндсэн өнгөнүүд)
    navy: {
      50: '#d0dcfb',
      100: '#aac0fe',
      200: '#a3b9f8',
      300: '#728fea',
      400: '#3652ba',
      500: '#1b3bbb',
      600: '#24388a',
      700: '#1B254B',
      800: '#111c44',
      900: '#0b1437',
    },

    gray: {
      100: '#FAFCFE',
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

        // ✅ Light
        bg: mode('#fdfeff', undefined)(props),

        // ✅ Dark: premium glow + gradient (brand #1F6FB2-оор)
        ...(mode(
          {},
          {
            backgroundImage: `
              radial-gradient(900px 600px at 50% 28%, rgba(31,111,178,.58) 0%, rgba(31,111,178,.22) 32%, rgba(0,0,0,0) 70%),
              radial-gradient(700px 480px at 20% 15%, rgba(255,255,255,.08) 0%, rgba(0,0,0,0) 60%),
              linear-gradient(180deg, #071426 0%, #050B16 62%, #040812 100%)
            `,
            backgroundAttachment: 'fixed',
            color: 'whiteAlpha.900',
          }
        )(props)),
      },

      // ✅ Input text өнгө (dark дээр харагддаг болгоно)
      input: {
        color: mode('gray.700', 'whiteAlpha.900')(props),
      },

      // ✅ Placeholder-ууд dark дээр бүдгэрч харагдахгүй байлгах жижиг tweak
      'input::placeholder, textarea::placeholder': {
        color: mode('gray.400', 'whiteAlpha.600')(props),
      },
    }),
  },
};
