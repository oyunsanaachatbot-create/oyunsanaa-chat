// src/config/menu.config.ts
import {
  Sparkles,
  Brain,
  HeartHandshake,
  Target,
  HeartPulse,
  Coffee,
} from "lucide-react";

/**
 * Sidebar-д харагдах MENU-н ЦЭВЭР data
 * - UI logic байхгүй
 * - Supabase, routes, template-тэй холбогдохгүй
 */

export type MenuItem = {
  id: string;
  label: string;
  href: string;
  isApp?: boolean; // ✅ хамгийн доорх app-ууд
};

export type MenuGroup = {
  id: string;
  label: string;
  icon: any;
  items: MenuItem[];
};

export const MENU_CONFIG: MenuGroup[] = [
  {
    id: "emotionControl",
    label: "Миний сэтгэлзүй",
    icon: Sparkles,
    items: [
      { id: "awareness", label: "Сэтгэл хөдлөлөө мэдрэх", href: "/mind/emotion/control/awareness" },
      { id: "thoughts", label: "Бодол, хариу үйлдэл", href: "/mind/emotion/control/thoughts" },
      { id: "overthinking", label: "Хэтрүүлж бодох хэв маяг", href: "/mind/emotion/control/overthinking" },
      { id: "stress", label: "Стресс болон физиологийн хариу", href: "/mind/emotion/control/stress" },
      { id: "calm", label: "Өөрийгөө удирдах чадвар", href: "/mind/emotion/control/calm" },

      // ✅ APP (brand өнгөтэй)
      {
        id: "daily-check",
        label: "Өнөөдрийн сэтгэл санаа апп",
        href: "/mind/emotion/control/daily-check",
        isApp: true,
      },
    ],
  },

  {
    id: "selfUnderstanding",
    label: "Өөрийгөө ойлгох",
    icon: Brain,
    items: [
      { id: "identity", label: "Би хэн бэ?", href: "/mind/self/identity" },
      { id: "values", label: "Миний үнэт зүйл", href: "/mind/self/values" },
      { id: "personality", label: "Дотоод ертөнц, зан чанар", href: "/mind/self/personality" },
      { id: "beliefs", label: "Шарх, итгэл үнэмшил", href: "/mind/self/beliefs" },
      { id: "worth", label: "Өөрийн үнэ цэнэ", href: "/mind/self/worth" },

      {
        id: "ebooks",
        label: "Миний ертөнц · Тэмдэглэл апп",
        href: "/mind/ebooks",
        isApp: true,
      },
    ],
  },

  {
    id: "relationships",
    label: "Харилцах ухаан",
    icon: HeartHandshake,
    items: [
      { id: "foundation", label: "Харилцааны суурь чадвар", href: "/mind/relations/foundation" },
      { id: "expression", label: "Өөрийгөө илэрхийлэх", href: "/mind/relations/expression" },
      { id: "empathy", label: "Бусдыг ойлгох ба эмпати", href: "/mind/relations/empathy" },
      { id: "listening", label: "Сонсох ур чадвар", href: "/mind/relations/listening" },
      { id: "boundary", label: "Хил хязгаар тогтоох", href: "/mind/relations/boundary" },
      { id: "toxic", label: "Эрүүл бус харилцааг таних", href: "/mind/relations/toxic" },
      { id: "conflict", label: "Зөрчил, маргааныг эрүүл шийдэх", href: "/mind/relations/conflict" },

      {
        id: "relations-app",
        label: "Харилцааны апп",
        href: "/mind/relations/app",
        isApp: true,
      },
    ],
  },

  {
    id: "lifePurpose",
    label: "Зорилго ба утга учир",
    icon: Target,
    items: [
      { id: "meaning", label: "Миний утга учир", href: "/mind/purpose/meaning" },
      { id: "vision", label: "Амьдралын том зураг", href: "/mind/purpose/vision" },
      { id: "dreams", label: "Хүсэл мөрөөдөл", href: "/mind/purpose/dreams" },
      { id: "planning", label: "Зорилгын төлөвлөлт", href: "/mind/purpose/planning" },
      { id: "growth", label: "Хөгжлийн замнал", href: "/mind/purpose/growth-path" },

      {
        id: "purpose-app",
        label: "Зорилго апп",
        href: "/mind/purpose/app",
        isApp: true,
      },
    ],
  },

  {
    id: "selfCare",
    label: "Өөрийгөө хайрлах",
    icon: HeartPulse,
    items: [
      { id: "support", label: "Сэтгэл санааг дэмжих", href: "/mind/self-care/emotional-support" },
      { id: "stress", label: "Стресс ба ядаргаа", href: "/mind/self-care/stress" },
      { id: "sleep", label: "Өдрийн эрч хүч ба нойр", href: "/mind/self-care/energy-sleep" },
      { id: "nutrition", label: "Өнөөдрийн хооллолт", href: "/mind/self-care/nutrition" },
      { id: "food", label: "Хоолны задаргаа оруулах", href: "/mind/self-care/food-log" },
      { id: "treatment", label: "Эмчилгээ / оношлогоо зөвлөмж", href: "/mind/self-care/treatment" },

      {
        id: "health-app",
        label: "Эрүүл мэнд апп",
        href: "/mind/self-care/app",
        isApp: true,
      },
    ],
  },

  {
    id: "life",
    label: "Тогтвортой амьдрал",
    icon: Coffee,
    items: [
      { id: "stress-source", label: "Миний стрессийн эх үүсвэр", href: "/mind/life/stress-source" },
      { id: "money", label: "Санхүүгийн сэтгэлзүй", href: "/mind/life/money-mindset" },
      { id: "work", label: "Ажлын стресс ба орчин", href: "/mind/life/work-stress" },
      { id: "decisions", label: "Шийдвэр гаргах сэтгэлзүй", href: "/mind/life/decisions" },
      { id: "environment", label: "Амьдралын орчин, стратеги", href: "/mind/life/environment" },
      { id: "finance", label: "Миний санхүү (Бүртгэл)", href: "/mind/life/finance-app" },

      {
        id: "finance-app",
        label: "Миний санхүү апп",
        href: "/mind/life/app",
        isApp: true,
      },
    ],
  },
];
