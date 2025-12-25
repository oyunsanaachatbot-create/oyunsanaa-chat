"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./ebook.module.css";

const BRAND = "#1F6FB2";
const STORAGE_KEY = "oyun_ebook_notes_notes_v1";

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  includeInBook: boolean;
  imageUrl?: string;
  imageCaption?: string;
};

function safeJsonParse<T>(s: string | null, fallback: T): T {
  try {
    const v = JSON.parse(s || "");
    return (v ?? fallback) as T;
  } catch {
    return fallback;
  }
}

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [includeInBook, setIncludeInBook] = useState(true);

  // load
  useEffect(() => {
    if (typeof window === "undefined") return;
    const list = safeJsonParse<Note[]>(window.localStorage.getItem(STORAGE_KEY), []);
    setNotes(Array.isArray(list) ? list : []);
  }, []);

  // persist
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const sorted = useMemo(() => {
    return [...notes].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [notes]);

  const canSave = content.trim().length > 0;

  function addNote() {
    if (!canSave) return;

    const n: Note = {
      id: uid(),
      title: title.trim() || "(гарчиггүй)",
      content: content.trim(),
      createdAt: Date.now(),
      includeInBook,
    };

    setNotes((prev) => [n, ...prev]);
    setTitle("");
    setContent("");
    setIncludeInBook(true);
  }

  function removeNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  function toggleInclude(id: string) {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, includeInBook: !n.includeInBook } : n))
    );
  }

  return (
    <main className={styles.ebookBody} style={{ ["--brand" as any]: BRAND }}>
      <div className={styles.container}>
        {/* topbar */}
        <div className={styles.topbar}>
          <Link href="/mind/ebooks" className={styles.pill}>
            ← Буцах
          </Link>

          <div className={styles.brandDot} aria-hidden />
          <span className={styles.brandText}>Ebook</span>
        </div>

        <h1 className={styles.mainTitle}>Тэмдэглэл</h1>
        <p className={styles.subtitle}>
          Өдөр тутмын бодол, санаагаа энд бичээд хадгал. “Номонд оруулах” асаалттай бол
          Preview дээр хуудас тоологдоно.
        </p>

        {/* Editor card */}
        <div
          className={styles.categoryCard}
          style={{
            display: "block",
            padding: 18,
            textDecoration: "none",
          }}
        >
          <div style={{ display: "grid", gap: 10 }}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Гарчиг (заавал биш)"
              style={{
                width: "100%",
                borderRadius: 12,
                padding: "12px 12px",
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.92)",
                outline: "none",
              }}
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Энд тэмдэглэлээ бичээрэй…"
              rows={7}
              style={{
                width: "100%",
                borderRadius: 12,
                padding: "12px 12px",
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.92)",
                outline: "none",
                lineHeight: 1.7,
                resize: "vertical",
              }}
            />

            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <label
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                <input
                  type="checkbox"
                  checked={includeInBook}
                  onChange={(e) => setIncludeInBook(e.target.checked)}
                />
                Номонд оруулах
              </label>

              <button
                onClick={addNote}
                disabled={!canSave}
                style={{
                  borderRadius: 999,
                  padding: "10px 14px",
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: canSave ? "rgba(31,111,178,0.32)" : "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.92)",
                  cursor: canSave ? "pointer" : "not-allowed",
                }}
              >
                Хадгалах
              </button>
            </div>
          </div>
        </div>

        {/* List */}
        <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
          {sorted.length === 0 ? (
            <div style={{ color: "rgba(255,255,255,0.75)", padding: 8 }}>
              Одоогоор тэмдэглэл алга. Дээрээс эхний тэмдэглэлээ бичээрэй.
            </div>
          ) : (
            sorted.map((n) => (
              <div
                key={n.id}
                className={styles.categoryCard}
                style={{
                  display: "block",
                  padding: 18,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{ margin: 0 }}>{n.title || "(гарчиггүй)"}</h4>

                    <div className={styles.categorySub} style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>
                      {n.content}
                    </div>

                    <div
                      style={{
                        marginTop: 10,
                        display: "flex",
                        gap: 10,
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <button
                        onClick={() => toggleInclude(n.id)}
                        style={{
                          borderRadius: 999,
                          padding: "8px 12px",
                          border: "1px solid rgba(255,255,255,0.16)",
                          background: "rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.9)",
                          cursor: "pointer",
                        }}
                      >
                        {n.includeInBook ? "✓ Номонд орно" : "Номонд оруулах"}
                      </button>

                      <span style={{ color: "rgba(255,255,255,0.60)", fontSize: 12 }}>
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeNote(n.id)}
                    style={{
                      borderRadius: 999,
                      padding: "8px 12px",
                      border: "1px solid rgba(255,255,255,0.16)",
                      background: "rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.85)",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    Устгах
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: 16, color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
          oyunsanaa · ebooks/notes (localStorage: {STORAGE_KEY})
        </div>
      </div>
    </main>
  );
}
