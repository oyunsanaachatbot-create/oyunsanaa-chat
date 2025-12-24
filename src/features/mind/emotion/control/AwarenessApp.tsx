'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Brain, MessageCircle, Sparkles, Check, ArrowLeft, X, Search } from 'lucide-react';

type Section = { id: string; title: string; paragraphs: string[] };

const SECTIONS: Section[] = [
  {
    id: 'what',
    title: 'Мэдрэхүй гэж юу вэ?',
    paragraphs: [
      'Бид өдөрт олон зуун жижиг сэтгэгдэл, мэдрэмжийг мэдэрдэг ч ихэнхийг нь анзааралгүй өнгөрөөдөг.',
      '“Зүгээр дээ” гэж өнгөрөөх биш, “Одоо би түгшиж байна” гэж өөртөө тодорхой хэлж сурах нь чухал.',
    ],
  },
  {
    id: 'types',
    title: 'Ямар ямар мэдрэмжүүд байдаг вэ?',
    paragraphs: [
      'Мэдрэмжүүдийг баяр, гуниг, айдас, уур гэсэн үндсэн бүлгүүдэд хуваадаг.',
      'Эдгээр нь олон нарийн өнгө аястай.',
    ],
  },
  {
    id: 'understand',
    title: 'Юуг ойлгох ёстой вэ?',
    paragraphs: [
      'Мэдрэмж бол тушаал биш, мэдээлэл юм.',
      'Тэднийг уншиж сурвал реакц биш сонголт хийдэг болно.',
    ],
  },
  {
    id: 'skills',
    title: 'Юуг эзэмшиж сурах вэ?',
    paragraphs: [
      'Эхний ур чадвар бол ажиглалт — юу болж байгааг шүүлтгүйгээр анзаарах.',
      'Дараагийнх нь нэршил — мэдрэмжээ ерөнхий биш, илүү тодорхой нэрлэх (ж: “түгшсэн”, “гомдсон”, “ичсэн”).',
      'Гурав дахь нь өөртөө эелдэг хандах чадвар: өөрийгөө буруутгахын оронд ойлгож хүлээн зөвшөөрөх дадал.',
    ],
  },
  {
    id: 'habits',
    title: 'Хэрхэн дадал болгох вэ?',
    paragraphs: [
      'Өдөрт 2–3 удаа 1 минут зав гаргаад “Одоо би юу мэдэрч байна?” гэж өөрөөсөө асуугаарай.',
      'Мэдрэмжээ богино тэмдэглэл хэлбэрээр тэмдэглэвэл дадал нь илүү хурдан тогтоно.',
    ],
  },
];

export default function AwarenessApp() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [q, setQ] = useState('');

  const toggleIndex = (idx: number) => setOpenIndex((prev) => (prev === idx ? null : idx));

  // ✅ хайлтын үр дүн — title + paragraphs дотор таарвал гаргана
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return SECTIONS;

    return SECTIONS.filter((s) => {
      const hay = (s.title + ' ' + s.paragraphs.join(' ')).toLowerCase();
      return hay.includes(query);
    });
  }, [q]);

  return (
    <div className="min-h-screen relative overflow-hidden text-white" style={{ ['--brand' as any]: 'var(--brand)' }}>
      {/* Background (өөрчлөхгүй) */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(900px 520px at 20% 15%, rgba(62,111,150,.28), transparent 60%),
            radial-gradient(900px 520px at 85% 25%, rgba(62,111,150,.18), transparent 62%),
            linear-gradient(135deg, #2a4663 0%, #335b7a 100%)
          `,
        }}
      />

      <main className="relative z-10 px-4 py-8 flex justify-center">
        <div className="w-full max-w-3xl rounded-3xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,.35)] px-5 py-6 space-y-6">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <span
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border"
                style={{ background: 'rgba(62,111,150,.18)', borderColor: 'rgba(62,111,150,.45)' }}
              >
                <Brain size={16} style={{ color: 'var(--brand)' }} />
              </span>
              <span className="font-medium">Миний сэтгэлзүй</span>
            </div>

            {/* ✅ баруун тал — Chat + Back/Close */}
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/80 hover:bg-white/20 transition"
              >
                <MessageCircle size={14} style={{ color: 'var(--brand)' }} />
                Чат
              </Link>

              {/* Back (хэрвээ хүсвэл X болгож болно) */}
              <button
                type="button"
                onClick={() => history.back()}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition"
                aria-label="Back"
              >
                <ArrowLeft size={16} style={{ color: 'var(--brand)' }} />
              </button>

              {/* Close (optional) */}
              <button
                type="button"
                onClick={() => history.back()}
                className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition"
                aria-label="Close"
              >
                <X size={16} style={{ color: 'var(--brand)' }} />
              </button>
            </div>
          </div>

          {/* ✅ Search bar (header-ээс доош, контент дээр төвлөрсөн) */}
          <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3 py-2">
            <Search size={16} className="opacity-80" style={{ color: 'var(--brand)' }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Хайх... (ж: түгш, уур, айдас)"
              className="w-full bg-transparent outline-none text-sm placeholder:text-white/40"
            />
            {q ? (
              <button
                type="button"
                onClick={() => setQ('')}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/10 hover:bg-white/20 transition"
                aria-label="Clear search"
              >
                <X size={14} className="opacity-80" />
              </button>
            ) : null}
          </div>

          {/* Intro */}
          <section className="space-y-3">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs tracking-widest uppercase"
              style={{
                color: 'var(--brand)',
                background: 'rgba(62,111,150,.15)',
                borderColor: 'rgba(62,111,150,.35)',
              }}
            >
              <Sparkles size={14} />
              Сэтгэл хөдлөл
            </div>

            <h1 className="text-2xl sm:text-3xl font-light tracking-wide">
              Сэтгэл дотроо юу болж
              <br /> байгааг мэдэрч сурья
            </h1>

            <p className="text-white/75 text-sm leading-relaxed">
              Өөрийн дотоод хөдөлгөөнийг ажиглаж, нэрлэж, ойлгох дадлыг эндээс эхлүүлнэ.
            </p>

            {/* хайлтын статистик */}
            {q ? (
              <p className="text-white/60 text-xs">
                “{q}” — {filtered.length} хэсэг олдлоо
              </p>
            ) : null}
          </section>

          {/* Accordion (хоосон цонх биш — доороо текст нээгдэнэ) */}
          <section className="space-y-3">
            {filtered.map((item, idx) => {
              // ⚠️ filtered ашиглаж байгаа тул idx нь “харагдаж буй жагсаалтын” индекс
              const isOpen = openIndex === idx;

              return (
                <div key={item.id} className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl overflow-hidden">
                  <button
                    onClick={() => toggleIndex(idx)}
                    className="flex w-full justify-between px-4 py-3 text-left text-sm hover:bg-white/10 transition"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs"
                        style={{
                          background: 'rgba(62,111,150,.18)',
                          borderColor: 'rgba(62,111,150,.45)',
                          color: 'var(--brand)',
                        }}
                      >
                        {idx + 1}
                      </span>
                      {item.title}
                    </span>

                    <Check size={14} style={{ color: 'var(--brand)' }} />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-2 space-y-2 border-t border-white/10 text-white/80 text-sm leading-relaxed">
                      {item.paragraphs.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {q && filtered.length === 0 ? (
              <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4 text-white/70 text-sm">
                Олдсонгүй. Өөр үгээр хайгаад үзээрэй (ж: “айдас”, “уур”, “түгш”).
              </div>
            ) : null}
          </section>
        </div>
      </main>
    </div>
  );
}
