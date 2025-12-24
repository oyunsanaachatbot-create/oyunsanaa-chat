// src/config/menu-items.ts
import {
  Sparkles,
  Brain,
  HeartHandshake,
  Target,
  HeartPulse,
  Coffee,
  DollarSign,
} from "lucide-react";

export type SideMenuItem = {
  label: string;
  href: string;
  isApp?: boolean; // ✅ хамгийн доод app мөрийг brand өнгөөр тодруулах
};

export type SideMenuSection = {
  id: string;
  label: string;
  icon: any; // lucide icon component
  items: SideMenuItem[];
};

export const BRAND = "#1F6FB2";

export const SIDE_MENU: SideMenuSection[] = [
  {
    id: "emotionControl",
    label: "Миний сэтгэлзүй",
    icon: Sparkles,
    items: [
      { label: "Сэтгэл хөдлөлөө мэдрэх", href: "/mind/emotion/control/awareness" },
      { label: "Бодол, хариу үйлдэл", href: "/mind/emotion/control/thoughts" },
      { label: "Хэтрүүлж бодох хэв маяг", href: "/mind/emotion/control/overthinking" },
      { label: "Стресс болон физиологийн хариу", href: "/mind/emotion/control/stress" },
      { label: "Өөрийгөө удирдах чадвар", href: "/mind/emotion/control/calm" },
      { label: "Өнөөдрийн сэтгэл санаа апп", href: "/mind/emotion/control/daily-check", isApp: true },
    ],
  },

  {
    id: "selfUnderstanding",
    label: "Өөрийгөө ойлгох",
    icon: Brain,
    items: [
      { label: "Би хэн бэ?", href: "/mind/self/identity" },
      { label: "Миний үнэт зүйл", href: "/mind/self/values" },
      { label: "Дотоод ертөнц, зан чанар", href: "/mind/self/personality" },
      { label: "Шарх, итгэл үнэмшил", href: "/mind/self/beliefs" },
      { label: "Өөрийн үнэ цэнэ", href: "/mind/self/worth" },
      { label: "Миний ертөнц · Тэмдэглэл апп", href: "/mind/ebooks", isApp: true },
    ],
  },

  {
    id: "relationships",
    label: "Харилцах ухаан",
    icon: HeartHandshake,
    items: [
      { label: "Харилцааны суурь чадвар", href: "/mind/relations/foundation" },
      { label: "Өөрийгөө илэрхийлэх", href: "/mind/relations/expression" },
      { label: "Бусдыг ойлгох ба эмпати", href: "/mind/relations/empathy" },
      { label: "Сонсох ур чадвар", href: "/mind/relations/listening" },
      { label: "Хил хязгаар тогтоох", href: "/mind/relations/boundary" },
      { label: "Эрүүл бус (токсик) харилцааг таних", href: "/mind/relations/toxic" },
      { label: "Зөрчил, маргааныг эрүүл шийдэх", href: "/mind/relations/conflict" },
      { label: "Харилцааны апп", href: "/mind/relations/foundation", isApp: true },
    ],
  },

  {
    id: "lifePurpose",
    label: "Зорилго ба утга учир",
    icon: Target,
    items: [
      { label: "Миний утга учир", href: "/mind/purpose/meaning" },
      { label: "Амьдралын том зураг", href: "/mind/purpose/vision" },
      { label: "Хүсэл мөрөөдөл", href: "/mind/purpose/dreams" },
      { label: "Зорилгын төлөвлөлт", href: "/mind/purpose/planning" },
      { label: "Хөгжлийн замнал", href: "/mind/purpose/growth-path" },
      { label: "Зорилго апп", href: "/mind/purpose/planning", isApp: true },
    ],
  },

  {
    id: "selfCare",
    label: "Өөрийгөө хайрлах",
    icon: HeartPulse, // ✅ Өөрийгөө хайрлах / Эрүүл мэнд
    items: [
      { label: "Сэтгэл санааг дэмжих", href: "/mind/self-care/emotional-support" },
      { label: "Стресс ба ядаргаа", href: "/mind/self-care/stress" },
      { label: "Өдрийн эрч хүч ба нойр", href: "/mind/self-care/energy-sleep" },
      { label: "Өнөөдрийн хооллолт", href: "/mind/self-care/nutrition" },
      { label: "Хоолны задаргаа оруулах", href: "/mind/self-care/food-log" },
      { label: "Эмчилгээ / оношлогоо зөвлөмж", href: "/mind/self-care/treatment" },
      { label: "Эрүүл мэнд апп", href: "/mind/self-care/stress", isApp: true },
    ],
  },

  {
    id: "life",
    label: "Тогтвортой амьдрал",
    icon: Coffee, // ✅ чи хүссэн: Тогтвортой амьдрал = coffee icon
    items: [
      { label: "Миний стрессийн эх үүсвэр", href: "/mind/life/stress-source" },
      { label: "Санхүүгийн сэтгэлзүй", href: "/mind/life/money-mindset" },
      { label: "Ажлын стресс ба орчин", href: "/mind/life/work-stress" },
      { label: "Шийдвэр гаргах сэтгэлзүй", href: "/mind/life/decisions" },
      { label: "Амьдралын орчин, стратеги", href: "/mind/life/environment" },
      { label: "Миний санхүү (Бүртгэл)", href: "/mind/life/finance-app" },
      { label: "Миний санхүү апп", href: "/mind/life/finance-app", isApp: true },
    ],
  },

  {
    id: "money",
    label: "Санхүү",
    icon: DollarSign, // ✅ dollar icon
    items: [
      { label: "Орлого/Зардлын бүртгэл", href: "/money/budget" },
      { label: "Зорилтот хадгаламж", href: "/money/saving" },
      { label: "Өрийн төлөвлөгөө", href: "/money/debt" },
      { label: "Санхүүгийн зуршил", href: "/money/habits" },
      { label: "Санхүү апп", href: "/money/budget", isApp: true },
    ],
  },
];
