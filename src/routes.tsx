// src/routes.tsx (log дээр /src/routes.tsx гэж гарсан байсан) 
// ✅ Зөвхөн чиний Mind menu

import { Icon } from './lib/chakra';
import { IRoute } from './types/navigation';

import {
  MdOutlinePsychology,
  MdAutoAwesome,
  MdFavorite,
  MdFlag,
  MdHealthAndSafety,
  MdCoffee,
} from 'react-icons/md';

const routes: IRoute[] = [
  {
    name: 'Оюун ухаан',
    path: '/mind',
    icon: (
      <Icon
        as={MdOutlinePsychology}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    collapse: true,
    items: [
      {
        name: 'Миний сэтгэлзүй',
        layout: '/mind',
        path: '/emotion',
        icon: (
          <Icon as={MdAutoAwesome} width="18px" height="18px" color="inherit" />
        ),
        collapse: true,
        items: [
          { name: 'Сэтгэл хөдлөлөө мэдрэх', layout: '/mind', path: '/emotion/control/awareness' },
          { name: 'Бодол, хариу үйлдэл', layout: '/mind', path: '/emotion/control/thoughts' },
          { name: 'Хэтрүүлж бодох хэв маяг', layout: '/mind', path: '/emotion/control/overthinking' },
          { name: 'Стресс болон физиологийн хариу', layout: '/mind', path: '/emotion/control/stress' },
          { name: 'Өөрийгөө удирдах чадвар', layout: '/mind', path: '/emotion/control/calm' },
          { name: 'Өнөөдрийн сэтгэл санаа апп', layout: '/mind', path: '/emotion/control/daily-check' },
        ],
      },

      {
        name: 'Өөрийгөө ойлгох',
        layout: '/mind',
        path: '/self',
        icon: (
          <Icon
            as={MdOutlinePsychology}
            width="18px"
            height="18px"
            color="inherit"
          />
        ),
        collapse: true,
        items: [
          { name: 'Би хэн бэ?', layout: '/mind', path: '/self/identity' },
          { name: 'Миний үнэт зүйл', layout: '/mind', path: '/self/values' },
          { name: 'Дотоод ертөнц, зан чанар', layout: '/mind', path: '/self/personality' },
          { name: 'Шарх, итгэл үнэмшил', layout: '/mind', path: '/self/beliefs' },
          { name: 'Өөрийн үнэ цэнэ', layout: '/mind', path: '/self/worth' },
          { name: 'Миний ертөнц · Тэмдэглэл апп', layout: '/mind', path: '/ebooks' },
        ],
      },

      {
        name: 'Харилцах ухаан',
        layout: '/mind',
        path: '/relations',
        icon: (
          <Icon as={MdFavorite} width="18px" height="18px" color="inherit" />
        ),
        collapse: true,
        items: [
          { name: 'Харилцааны суурь чадвар', layout: '/mind', path: '/relations/foundation' },
          { name: 'Өөрийгөө илэрхийлэх', layout: '/mind', path: '/relations/expression' },
          { name: 'Бусдыг ойлгох ба эмпати', layout: '/mind', path: '/relations/empathy' },
          { name: 'Сонсох ур чадвар', layout: '/mind', path: '/relations/listening' },
          { name: 'Хил хязгаар тогтоох', layout: '/mind', path: '/relations/boundary' },
          { name: 'Эрүүл бус (токсик) харилцааг таних', layout: '/mind', path: '/relations/toxic' },
          { name: 'Зөрчил, маргааныг эрүүл шийдэх', layout: '/mind', path: '/relations/conflict' },
          { name: 'Харилцааны апп', layout: '/mind', path: '/relations/app' },
        ],
      },

      {
        name: 'Зорилго ба утга учир',
        layout: '/mind',
        path: '/purpose',
        icon: <Icon as={MdFlag} width="18px" height="18px" color="inherit" />,
        collapse: true,
        items: [
          { name: 'Миний утга учир', layout: '/mind', path: '/purpose/meaning' },
          { name: 'Амьдралын том зураг', layout: '/mind', path: '/purpose/vision' },
          { name: 'Хүсэл мөрөөдөл', layout: '/mind', path: '/purpose/dreams' },
          { name: 'Зорилгын төлөвлөлт', layout: '/mind', path: '/purpose/planning' },
          { name: 'Хөгжлийн замнал', layout: '/mind', path: '/purpose/growth-path' },
          { name: 'Зорилго апп', layout: '/mind', path: '/purpose/app' },
        ],
      },

      {
        name: 'Өөрийгөө хайрлах',
        layout: '/mind',
        path: '/self-care',
        icon: (
          <Icon
            as={MdHealthAndSafety}
            width="18px"
            height="18px"
            color="inherit"
          />
        ),
        collapse: true,
        items: [
          { name: 'Сэтгэл санааг дэмжих', layout: '/mind', path: '/self-care/emotional-support' },
          { name: 'Стресс ба ядаргаа', layout: '/mind', path: '/self-care/stress' },
          { name: 'Өдрийн эрч хүч ба нойр', layout: '/mind', path: '/self-care/energy-sleep' },
          { name: 'Өнөөдрийн хооллолт', layout: '/mind', path: '/self-care/nutrition' },
          { name: 'Хоолны задаргаа оруулах', layout: '/mind', path: '/self-care/food-log' },
          { name: 'Эмчилгээ / оношлогоо зөвлөмж', layout: '/mind', path: '/self-care/treatment' },
          { name: 'Эрүүл мэнд апп', layout: '/mind', path: '/self-care/app' },
        ],
      },

      {
        name: 'Тогтвортой амьдрал',
        layout: '/mind',
        path: '/life',
        icon: (
          <Icon as={MdCoffee} width="18px" height="18px" color="inherit" />
        ),
        collapse: true,
        items: [
          { name: 'Миний стрессийн эх үүсвэр', layout: '/mind', path: '/life/stress-source' },
          { name: 'Санхүүгийн сэтгэлзүй', layout: '/mind', path: '/life/money-mindset' },
          { name: 'Ажлын стресс ба орчин', layout: '/mind', path: '/life/work-stress' },
          { name: 'Шийдвэр гаргах сэтгэлзүй', layout: '/mind', path: '/life/decisions' },
          { name: 'Амьдралын орчин, стратеги', layout: '/mind', path: '/life/environment' },
          { name: 'Миний санхүү (Бүртгэл)', layout: '/mind', path: '/life/finance-app' },
          { name: 'Миний санхүү апп', layout: '/mind', path: '/life/app' },
        ],
      },
    ],
  },
];

export default routes;
