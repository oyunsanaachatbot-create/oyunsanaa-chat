// src/components/SideMenu.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, X } from "lucide-react";
import { SIDE_MENU, BRAND } from "@/config/menu-items";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SideMenu({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const [openSection, setOpenSection] = React.useState<string | null>(null);

  // ✅ menu хаалттай үед section state-аа цэвэрлэж болно (хүсвэл)
  React.useEffect(() => {
    if (!isOpen) setOpenSection(null);
  }, [isOpen]);

  // ✅ ESC дарвал хаагдана
  React.useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <button
          aria-label="Close menu backdrop"
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 40,
          }}
        />
      )}

      {/* Drawer */}
      <aside
        aria-hidden={!isOpen}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: 320,
          transform: isOpen ? "translateX(0)" : "translateX(-105%)",
          transition: "transform 220ms ease",
          zIndex: 50,
          background: "var(--chakra-colors-chakra-body-bg, #0B1220)", // ✅ existing theme-г хүндэлж fallback өгсөн
          borderRight: "1px solid rgba(255,255,255,0.08)",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 14px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: BRAND,
                boxShadow: `0 0 0 4px rgba(31,111,178,0.20)`,
              }}
            />
            <div style={{ fontWeight: 700, letterSpacing: 0.2 }}>Меню</div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{
              width: 36,
              height: 36,
              display: "grid",
              placeItems: "center",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Sections */}
        <nav style={{ padding: 10 }}>
          {SIDE_MENU.map((sec) => {
            const Icon = sec.icon;
            const expanded = openSection === sec.id;

            return (
              <div
                key={sec.id}
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14,
                  marginBottom: 10,
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                {/* Section header */}
                <button
                  onClick={() => toggleSection(sec.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    padding: "12px 12px",
                    background: "transparent",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        width: 34,
                        height: 34,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 12,
                        border: "1px solid rgba(255,255,255,0.10)",
                        background: "rgba(255,255,255,0.04)",
                      }}
                    >
                      <Icon size={18} />
                    </span>
                    <span style={{ fontWeight: 650 }}>{sec.label}</span>
                  </div>

                  <span
                    style={{
                      display: "grid",
                      placeItems: "center",
                      width: 34,
                      height: 34,
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.10)",
                      background: "rgba(255,255,255,0.04)",
                      transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 180ms ease",
                    }}
                  >
                    <ChevronDown size={18} />
                  </span>
                </button>

                {/* Items */}
                {expanded && (
                  <div style={{ padding: "4px 8px 10px 8px" }}>
                    {sec.items.map((it, idx) => {
                      const active = pathname === it.href;
                      const isApp = !!it.isApp;

                      return (
                        <Link
                          key={`${sec.id}-${idx}`}
                          href={it.href}
                          onClick={onClose} // ✅ item дармагц menu хаагдана (хүсвэл remove хийж болно)
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px 10px",
                            borderRadius: 12,
                            textDecoration: "none",
                            marginTop: 6,
                            border: active
                              ? `1px solid rgba(31,111,178,0.55)`
                              : "1px solid rgba(255,255,255,0.08)",
                            background: active
                              ? "rgba(31,111,178,0.10)"
                              : "rgba(255,255,255,0.02)",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 14,
                              lineHeight: 1.2,
                              color: isApp ? BRAND : "inherit",
                              fontWeight: isApp ? 700 : 520,
                            }}
                          >
                            {it.label}
                          </span>

                          {isApp && (
                            <span
                              style={{
                                fontSize: 12,
                                color: BRAND,
                                border: `1px solid rgba(31,111,178,0.45)`,
                                background: "rgba(31,111,178,0.10)",
                                padding: "3px 8px",
                                borderRadius: 999,
                                fontWeight: 700,
                              }}
                            >
                              APP
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
