// src/routes.tsx
import { IRoute } from '@/types/navigation';
import { Icon } from '@chakra-ui/react';
import {
  FaRegStar,
  FaBrain,
  FaHandshake,
  FaBullseye,
  FaHeartPulse,
  FaMugHot,
  FaDollarSign,
} from 'react-icons/fa';
export const routes: IRoute[] = [
  {
    name: 'Миний сэтгэлзүй',
    path: '/mind/emotion/control',
    collapse: true,
    icon: <Icon as={FaRegStar} w="18px" h="18px" />,
    items: [
      { name: 'Сэтгэл хөдлөлөө мэдрэх', path: '/mind/emotion/control/awareness' },
      { name: 'Бодол, хариу үйлдэл', path: '/mind/emotion/control/thoughts' },
      { name: 'Хэтрүүлж бодох хэв маяг', path: '/mind/emotion/control/overthinking' },
      { name: 'Стресс болон физиологийн хариу', path: '/mind/emotion/control/stress' },
      { name: 'Өөрийгөө удирдах чадвар', path: '/mind/emotion/control/calm' },
      { name: 'Өнөөдрийн сэтгэл санаа апп', path: '/mind/emotion/control/daily-check', isApp: true },
    ],
  },

  {
    name: 'Өөрийгөө ойлгох',
    path: '/mind/self',
    collapse: true,
    icon: <Icon as={FaBrain} w="18px" h="18px" />,
    items: [
      { name: 'Би хэн бэ?', path: '/mind/self/identity' },
      { name: 'Миний үнэт зүйл', path: '/mind/self/values' },
      { name: 'Дотоод ертөнц, зан чанар', path: '/mind/self/personality' },
      { name: 'Шарх, итгэл үнэмшил', path: '/mind/self/beliefs' },
      { name: 'Өөрийн үнэ цэнэ', path: '/mind/self/worth' },
      { name: 'Миний ертөнц · Тэмдэглэл апп', path: '/mind/ebooks', isApp: true },
    ],
  },

  {
    name: 'Харилцах ухаан',
    path: '/mind/relations',
    collapse: true,
    icon: <Icon as={FaHandshake} w="18px" h="18px" />,
    items: [
      { name: 'Харилцааны суурь чадвар', path: '/mind/relations/foundation' },
      { name: 'Өөрийгөө илэрхийлэх', path: '/mind/relations/expression' },
      { name: 'Бусдыг ойлгох ба эмпати', path: '/mind/relations/empathy' },
      { name: 'Сонсох ур чадвар', path: '/mind/relations/listening' },
      { name: 'Хил хязгаар тогтоох', path: '/mind/relations/boundary' },
      { name: 'Эрүүл бус харилцааг таних', path: '/mind/relations/toxic' },
      { name: 'Зөрчил маргааныг эрүүл шийдэх', path: '/mind/relations/conflict' },
      { name: 'Харилцааны апп', path: '/mind/relations/foundation', isApp: true },
    ],
  },

  {
    name: 'Зорилго ба утга учир',
    path: '/mind/purpose',
    collapse: true,
    icon: <Icon as={FaBullseye} w="18px" h="18px" />,
    items: [
      { name: 'Миний утга учир', path: '/mind/purpose/meaning' },
      { name: 'Амьдралын том зураг', path: '/mind/purpose/vision' },
      { name: 'Хүсэл мөрөөдөл', path: '/mind/purpose/dreams' },
      { name: 'Зорилгын төлөвлөлт', path: '/mind/purpose/planning' },
      { name: 'Хөгжлийн замнал', path: '/mind/purpose/growth-path' },
      { name: 'Зорилго апп', path: '/mind/purpose/planning', isApp: true },
    ],
  },

  {
    name: 'Өөрийгөө хайрлах',
    path: '/mind/self-care',
    collapse: true,
    icon: <Icon as={FaHeartPulse} w="18px" h="18px" />,
    items: [
      { name: 'Сэтгэл санааг дэмжих', path: '/mind/self-care/emotional-support' },
      { name: 'Стресс ба ядаргаа', path: '/mind/self-care/stress' },
      { name: 'Өдрийн эрч хүч ба нойр', path: '/mind/self-care/energy-sleep' },
      { name: 'Өнөөдрийн хооллолт', path: '/mind/self-care/nutrition' },
      { name: 'Хоолны задаргаа', path: '/mind/self-care/food-log' },
      { name: 'Эмчилгээ зөвлөмж', path: '/mind/self-care/treatment' },
      { name: 'Эрүүл мэнд апп', path: '/mind/self-care/stress', isApp: true },
    ],
  },

  {
    name: 'Тогтвортой амьдрал',
    path: '/mind/life',
    collapse: true,
    icon: <Icon as={FaCoffee} w="18px" h="18px" />,
    items: [
      { name: 'Миний стрессийн эх үүсвэр', path: '/mind/life/stress-source' },
      { name: 'Санхүүгийн сэтгэлзүй', path: '/mind/life/money-mindset' },
      { name: 'Ажлын стресс ба орчин', path: '/mind/life/work-stress' },
      { name: 'Шийдвэр гаргах сэтгэлзүй', path: '/mind/life/decisions' },
      { name: 'Амьдралын орчин, стратеги', path: '/mind/life/environment' },
      { name: 'Миний санхүү', path: '/mind/life/finance-app', isApp: true },
    ],
  },

  {
    name: 'Санхүү',
    path: '/money',
    collapse: true,
    icon: <Icon as={FaDollarSign} w="18px" h="18px" />,
    items: [
      { name: 'Орлого / Зардал', path: '/money/budget' },
      { name: 'Хадгаламж', path: '/money/saving' },
      { name: 'Өр төлөвлөгөө', path: '/money/debt' },
      { name: 'Санхүүгийн зуршил', path: '/money/habits' },
      { name: 'Санхүү апп', path: '/money/budget', isApp: true },
    ],
  },
];
