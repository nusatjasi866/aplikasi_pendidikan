import React from 'react';
import {
  BookOpen,
  Building2,
  Database,
  GraduationCap,
  LayoutGrid,
  Settings,
  Users,
} from 'lucide-react';
import type {
  AccentColor,
  CategoryIconKey,
  IconKey,
} from '../shared/portalLogic';

export const ACCENT_THEMES: Record<
  AccentColor,
  {
    badgeBg: string;
    badgeText: string;
    arrowBg: string;
    arrowHover: string;
    ring: string;
    label: string;
  }
> = {
  blue: {
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    arrowBg: 'bg-[#0B74F2]',
    arrowHover: 'hover:bg-[#085EC6]',
    ring: 'ring-blue-500/30',
    label: 'Biru',
  },
  purple: {
    badgeBg: 'bg-violet-50',
    badgeText: 'text-violet-700',
    arrowBg: 'bg-[#8B3DFF]',
    arrowHover: 'hover:bg-[#7326E6]',
    ring: 'ring-violet-500/30',
    label: 'Ungu',
  },
  pink: {
    badgeBg: 'bg-pink-50',
    badgeText: 'text-pink-700',
    arrowBg: 'bg-[#E93B81]',
    arrowHover: 'hover:bg-[#D1286C]',
    ring: 'ring-pink-500/30',
    label: 'Merah Muda',
  },
  emerald: {
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    arrowBg: 'bg-[#0EA56B]',
    arrowHover: 'hover:bg-[#0B8958]',
    ring: 'ring-emerald-500/30',
    label: 'Hijau',
  },
  orange: {
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-700',
    arrowBg: 'bg-[#F97316]',
    arrowHover: 'hover:bg-[#EA580C]',
    ring: 'ring-orange-500/30',
    label: 'Oranye',
  },
  teal: {
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-800',
    arrowBg: 'bg-[#0891B2]',
    arrowHover: 'hover:bg-[#0E7490]',
    ring: 'ring-cyan-500/30',
    label: 'Teal',
  },
};

export function TutWuriEmblem({ className = 'w-14 h-14' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <linearGradient id="tutBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1D6FE8" />
          <stop offset="100%" stopColor="#0A3A8A" />
        </linearGradient>
        <linearGradient id="tutGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#EAB308" />
        </linearGradient>
      </defs>
      {/* Pentagon crest */}
      <path
        d="M50 5 L92 28 L80 82 L50 95 L20 82 L8 28 Z"
        fill="url(#tutBlue)"
        stroke="#FFFFFF"
        strokeWidth="3.5"
      />
      <path
        d="M50 11 L86 31 L75 78 L50 89 L25 78 L14 31 Z"
        fill="none"
        stroke="url(#tutGold)"
        strokeWidth="1.5"
        opacity="0.9"
      />
      {/* Wings / Garuda motif */}
      <path
        d="M23 50 C23 36, 35 28, 50 38 C65 28, 77 36, 77 50 C70 46, 62 48, 50 58 C38 48, 30 46, 23 50 Z"
        fill="#FFFFFF"
      />
      <path
        d="M28 57 C34 54, 42 56, 50 66 C58 56, 66 54, 72 57 C66 66, 58 72, 50 76 C42 72, 34 66, 28 57 Z"
        fill="#E0F2FE"
      />
      {/* Central flame / book */}
      <path d="M50 22 L54 36 L50 42 L46 36 Z" fill="url(#tutGold)" />
      <circle cx="50" cy="48" r="4.5" fill="url(#tutGold)" />
      {/* Bottom ribbon */}
      <path
        d="M29 73 Q50 84 71 73"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function TanimbarMapGraphic() {
  return (
    <div className="relative px-4 pt-2 pb-5 select-none">
      {/* Subtle ocean glow */}
      <div
        className="absolute inset-x-4 top-2 bottom-10 rounded-2xl opacity-35 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(56, 189, 248, 0.28), transparent 70%)',
        }}
      />
      <svg
        viewBox="0 0 180 120"
        className="w-full h-24 mx-auto drop-shadow-[0_2px_10px_rgba(250,204,21,0.35)]"
        aria-hidden="true"
      >
        {/* Subtle coordinate arcs */}
        <circle
          cx="90"
          cy="60"
          r="52"
          fill="none"
          stroke="rgba(148, 163, 184, 0.16)"
          strokeDasharray="3 4"
        />
        <circle
          cx="90"
          cy="60"
          r="34"
          fill="none"
          stroke="rgba(148, 163, 184, 0.16)"
          strokeDasharray="2 3"
        />
        {/* Pulau Larat & Fordata (northeast) */}
        <path
          d="M120 18 L131 14 L137 22 L128 29 L118 25 Z"
          fill="#FACC15"
        />
        <path d="M139 10 L146 12 L143 18 L137 15 Z" fill="#FDE047" />
        {/* Pulau Molu & Maru */}
        <path d="M98 16 L106 13 L108 21 L99 22 Z" fill="#FACC15" />
        {/* Pulau Yamdena (main island) */}
        <path
          d="M114 31 L126 36 L123 48 L112 60 L103 75 L94 86 L82 90 L76 82 L83 68 L90 54 L99 42 L106 33 Z"
          fill="#FACC15"
        />
        {/* Pulau Seira & Sera (west) */}
        <path d="M72 64 L80 62 L78 71 L69 70 Z" fill="#FDE047" />
        <path d="M58 76 L67 74 L65 82 L56 81 Z" fill="#FDE047" />
        {/* Pulau Selaru (south) */}
        <path
          d="M54 96 L72 91 L82 96 L74 105 L56 105 L48 100 Z"
          fill="#FACC15"
        />
        {/* Small islets */}
        <circle cx="88" cy="36" r="2.2" fill="#FDE047" />
        <circle cx="67" cy="52" r="2" fill="#FDE047" />
        <circle cx="98" cy="96" r="2" fill="#FDE047" />
      </svg>

      <div className="text-center -mt-2">
        <div className="text-[13px] font-extrabold tracking-wider text-[#FACC15] leading-tight">
          TANIMBAR
        </div>
        <div className="text-[13px] font-extrabold tracking-wider text-white leading-tight">
          MAJU
        </div>
        <svg viewBox="0 0 120 12" className="w-24 h-2.5 mx-auto mt-1" aria-hidden="true">
          <path
            d="M12 7 Q60 1 108 8"
            stroke="#FACC15"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}

export function CategoryTabIcon({
  icon,
  className = 'w-4 h-4',
}: {
  icon: CategoryIconKey;
  className?: string;
}) {
  switch (icon) {
    case 'grad-cap':
      return <GraduationCap className={className} />;
    case 'database':
      return <Database className={className} />;
    case 'users':
      return <Users className={className} />;
    case 'book-open':
      return <BookOpen className={className} />;
    case 'building':
      return <Building2 className={className} />;
    case 'settings':
      return <Settings className={className} />;
    case 'grid':
    default:
      return <LayoutGrid className={className} />;
  }
}

export function AppVectorIcon({
  iconKey,
  className = 'w-12 h-12',
}: {
  iconKey: IconKey;
  className?: string;
}) {
  switch (iconKey) {
    case 'clipboard-list':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <rect x="9" y="8" width="30" height="34" rx="5" fill="#2563EB" />
          <rect x="13" y="13" width="22" height="25" rx="2.5" fill="#FFFFFF" />
          <rect x="17" y="5" width="14" height="6" rx="3" fill="#60A5FA" />
          <circle cx="18" cy="20" r="2" fill="#2563EB" />
          <rect x="22" y="18.8" width="10" height="2.4" rx="1.2" fill="#93C5FD" />
          <circle cx="18" cy="26.5" r="2" fill="#2563EB" />
          <rect x="22" y="25.3" width="10" height="2.4" rx="1.2" fill="#93C5FD" />
          <circle cx="18" cy="33" r="2" fill="#2563EB" />
          <rect x="22" y="31.8" width="8" height="2.4" rx="1.2" fill="#93C5FD" />
        </svg>
      );

    case 'book-open':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <path
            d="M6 12 C12 9, 19 10, 24 14 C29 10, 36 9, 42 12 L42 36 C36 33, 29 34, 24 38 C19 34, 12 33, 6 36 Z"
            fill="#8B3DFF"
          />
          <path
            d="M9 15 C14 13, 19 14, 23 17 L23 34 C19 31, 14 30, 9 32 Z"
            fill="#FFFFFF"
          />
          <path
            d="M39 15 C34 13, 29 14, 25 17 L25 34 C29 31, 34 30, 39 32 Z"
            fill="#F5F3FF"
          />
          <rect x="12" y="19" width="8" height="2" rx="1" fill="#A78BFA" />
          <rect x="12" y="23.5" width="7" height="2" rx="1" fill="#A78BFA" />
          <rect x="28" y="19" width="8" height="2" rx="1" fill="#A78BFA" />
          <rect x="28" y="23.5" width="7" height="2" rx="1" fill="#A78BFA" />
        </svg>
      );

    case 'abc-blocks':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <rect x="15" y="6" width="18" height="17" rx="3.5" fill="#F97316" />
          <text
            x="24"
            y="18.5"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="11"
            fontWeight="800"
          >
            A
          </text>
          <rect x="6" y="24" width="17" height="17" rx="3.5" fill="#E93B81" />
          <text
            x="14.5"
            y="36.5"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="11"
            fontWeight="800"
          >
            B
          </text>
          <rect x="25" y="24" width="17" height="17" rx="3.5" fill="#2563EB" />
          <text
            x="33.5"
            y="36.5"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="11"
            fontWeight="800"
          >
            C
          </text>
        </svg>
      );

    case 'user-circle':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <circle cx="22" cy="17" r="8" fill="#10B981" />
          <path
            d="M8 39 C8 30, 14 26, 22 26 C30 26, 36 30, 36 39 Z"
            fill="#34D399"
          />
          <circle cx="34" cy="33" r="8.5" fill="#059669" stroke="#FFFFFF" strokeWidth="2.2" />
          <path
            d="M31 33 L33.2 35.2 L37.5 30.8"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      );

    case 'user-check':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <circle cx="22" cy="16" r="8" fill="#0EA5E9" />
          <path
            d="M8 38 C8 29, 14 25, 22 25 C30 25, 36 29, 36 38 Z"
            fill="#38BDF8"
          />
          <circle cx="34" cy="33" r="8" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2" />
          <path
            d="M30.5 33 L33 35.5 L37.5 30.5"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      );

    case 'info-circle':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <circle cx="24" cy="24" r="19" fill="#0B74F2" />
          <circle cx="24" cy="15.5" r="2.7" fill="#FFFFFF" />
          <rect x="21.5" y="21" width="5" height="14" rx="2.5" fill="#FFFFFF" />
        </svg>
      );

    case 'grad-cap':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <path d="M24 9 L45 19 L24 29 L3 19 Z" fill="#8B3DFF" />
          <path
            d="M12 24 L12 34 C12 37.5, 17.5 40, 24 40 C30.5 40, 36 37.5, 36 34 L36 24 L24 30 Z"
            fill="#6D28D9"
          />
          <path d="M40 21 V34" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="40" cy="35.5" r="2.5" fill="#C4B5FD" />
        </svg>
      );

    case 'school-building':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <rect x="7" y="18" width="12" height="23" rx="2" fill="#0D9488" />
          <rect x="18" y="9" width="16" height="32" rx="2.5" fill="#06B6D4" />
          <rect x="33" y="21" width="9" height="20" rx="2" fill="#14B8A6" />
          <rect x="22" y="14" width="3.5" height="3.5" rx="0.8" fill="#FFFFFF" />
          <rect x="27.5" y="14" width="3.5" height="3.5" rx="0.8" fill="#FFFFFF" />
          <rect x="22" y="20" width="3.5" height="3.5" rx="0.8" fill="#FFFFFF" />
          <rect x="27.5" y="20" width="3.5" height="3.5" rx="0.8" fill="#FFFFFF" />
          <rect x="24" y="31" width="5" height="10" rx="1" fill="#0F766E" />
          <rect x="10.5" y="23" width="3" height="3" rx="0.6" fill="#CCFBF1" />
          <rect x="10.5" y="29" width="3" height="3" rx="0.6" fill="#CCFBF1" />
        </svg>
      );

    case 'pen-book':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <rect x="8" y="11" width="28" height="29" rx="4" fill="#F43F5E" />
          <rect x="12" y="14" width="20" height="23" rx="2" fill="#FFF1F2" />
          <path d="M22 15 V36" stroke="#FDA4AF" strokeWidth="1.5" />
          <path d="M28 11 L40 23 L35 28 L23 16 Z" fill="#EC4899" />
          <path d="M23 16 L20 21 L25 18 Z" fill="#FDE047" />
        </svg>
      );

    case 'chart-up':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <rect x="9" y="27" width="7" height="14" rx="2" fill="#FBBF24" />
          <rect x="19" y="21" width="7" height="20" rx="2" fill="#F97316" />
          <rect x="29" y="15" width="7" height="26" rx="2" fill="#2563EB" />
          <path
            d="M8 21 L18 14 L26 17 L38 7"
            stroke="#EA580C"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path d="M32 7 H39 V14" stroke="#EA580C" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );

    case 'doc-check':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <rect x="8" y="7" width="26" height="34" rx="4" fill="#10B981" />
          <rect x="12" y="11" width="18" height="26" rx="2" fill="#FFFFFF" />
          <rect x="15" y="16" width="12" height="2.4" rx="1.2" fill="#6EE7B7" />
          <rect x="15" y="21" width="10" height="2.4" rx="1.2" fill="#6EE7B7" />
          <rect x="15" y="26" width="8" height="2.4" rx="1.2" fill="#6EE7B7" />
          <circle cx="33" cy="33" r="9" fill="#059669" stroke="#FFFFFF" strokeWidth="2.2" />
          <path
            d="M29 33 L32 36 L37 30"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      );

    case 'id-card':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <rect x="5" y="11" width="38" height="26" rx="4.5" fill="#2563EB" />
          <rect x="9" y="16" width="12" height="15" rx="2.5" fill="#DBEAFE" />
          <circle cx="15" cy="21" r="2.8" fill="#2563EB" />
          <path d="M10.5 29 C10.5 26.2, 19.5 26.2, 19.5 29 Z" fill="#2563EB" />
          <rect x="25" y="18" width="13" height="3" rx="1.5" fill="#FFFFFF" />
          <rect x="25" y="24" width="10" height="2.5" rx="1.2" fill="#93C5FD" />
          <rect x="25" y="29" width="7" height="2.5" rx="1.2" fill="#93C5FD" />
        </svg>
      );

    case 'dapodik-cube':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <path d="M24 6 L41 15 L41 33 L24 42 L7 33 L7 15 Z" fill="#0EA5E9" />
          <path d="M24 6 L41 15 L24 24 L7 15 Z" fill="#38BDF8" />
          <path d="M24 24 L41 15 L41 33 L24 42 Z" fill="#0284C7" />
          <circle cx="24" cy="24" r="5.5" fill="#FACC15" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="14" cy="19" r="2.5" fill="#FFFFFF" />
          <circle cx="34" cy="19" r="2.5" fill="#FFFFFF" />
          <circle cx="24" cy="34" r="2.5" fill="#FFFFFF" />
        </svg>
      );

    case 'arkas-a':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <path d="M24 7 L40 40 H31.5 L24 23.5 L16.5 40 H8 Z" fill="#0B5ED7" />
          <path d="M16 28 H32 L29 34 H19 Z" fill="#DC2626" />
          <circle cx="24" cy="13" r="3" fill="#F97316" />
        </svg>
      );

    case 'rapor-bars':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <rect x="7" y="22" width="9" height="19" rx="2.5" fill="#10B981" />
          <rect x="19" y="14" width="9" height="27" rx="2.5" fill="#06B6D4" />
          <rect x="31" y="8" width="9" height="33" rx="2.5" fill="#0EA5E9" />
          <path
            d="M7 16 Q21 15 36 7"
            stroke="#34D399"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    case 'pmm-star':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <circle cx="24" cy="12" r="5" fill="#FACC15" />
          <path
            d="M11 21 C16 26, 20 29, 24 38 C28 29, 32 26, 37 21 C32 20, 27 22, 24 27 C21 22, 16 20, 11 21 Z"
            fill="#0B74F2"
          />
          <circle cx="24" cy="39" r="3.5" fill="#3B82F6" />
        </svg>
      );

    case 'erapor-monitor':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <path
            d="M6 11 C13 8, 19 9, 24 13 C29 9, 35 8, 42 11 L42 35 C35 32, 29 33, 24 37 C19 33, 13 32, 6 35 Z"
            fill="#1D4ED8"
          />
          <path d="M10 14 C15 12, 19 13, 23 16 V32 C19 29, 15 28, 10 30 Z" fill="#FFFFFF" />
          <path d="M38 14 C33 12, 29 13, 25 16 V32 C29 29, 33 28, 38 30 Z" fill="#EFF6FF" />
          <circle cx="31" cy="22" r="4" fill="#F97316" />
        </svg>
      );

    case 'anbk-laptop':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <rect x="9" y="10" width="30" height="21" rx="3" fill="#0EA5E9" />
          <rect x="12" y="13" width="24" height="15" rx="1.5" fill="#E0F2FE" />
          <path d="M4 34 H44 L40 39 H8 Z" fill="#0284C7" />
          <rect x="19" y="35.2" width="10" height="2" rx="1" fill="#BAE6FD" />
        </svg>
      );

    case 'simpkb-crest':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <circle cx="24" cy="24" r="19" fill="#0B5ED7" />
          <circle cx="24" cy="24" r="15.5" fill="none" stroke="#FACC15" strokeWidth="1.8" />
          <path
            d="M14 23 C17 18, 21 17, 24 21 C27 17, 31 18, 34 23 C30 23, 27 25, 24 30 C21 25, 18 23, 14 23 Z"
            fill="#FFFFFF"
          />
          <circle cx="24" cy="14.5" r="2.5" fill="#FACC15" />
        </svg>
      );

    case 'shield-check':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <path
            d="M24 6 L40 12 V24 C40 33.5, 32.5 39.5, 24 43 C15.5 39.5, 8 33.5, 8 24 V12 Z"
            fill="#2563EB"
          />
          <path
            d="M17.5 24.5 L22 29 L31 19"
            stroke="#FFFFFF"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      );

    case 'database-sync':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <ellipse cx="24" cy="13" rx="14" ry="5.5" fill="#06B6D4" />
          <path d="M10 13 V23 C10 26, 16.3 28.5, 24 28.5 C31.7 28.5, 38 26, 38 23 V13" fill="#0891B2" />
          <path d="M10 23 V34 C10 37, 16.3 39.5, 24 39.5 C31.7 39.5, 38 37, 38 34 V23" fill="#0E7490" />
          <ellipse cx="24" cy="13" rx="10" ry="3" fill="#A5F3FC" opacity="0.5" />
        </svg>
      );

    case 'layers-grid':
    default:
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <rect x="7" y="7" width="15" height="15" rx="3.5" fill="#7C3AED" />
          <rect x="26" y="7" width="15" height="15" rx="3.5" fill="#A78BFA" />
          <rect x="7" y="26" width="15" height="15" rx="3.5" fill="#8B5CF6" />
          <rect x="26" y="26" width="15" height="15" rx="3.5" fill="#6D28D9" />
        </svg>
      );
  }
}
