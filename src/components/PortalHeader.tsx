import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Menu } from 'lucide-react';
import {
  formatIndonesianDateTime,
  type PortalSettings,
} from '../shared/portalLogic';
import { TutWuriEmblem } from './Emblems';

interface PortalHeaderProps {
  settings: PortalSettings;
  onOpenMobileMenu: () => void;
}

export function PortalHeader({
  settings,
  onOpenMobileMenu,
}: PortalHeaderProps) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 15000);
    return () => window.clearInterval(timer);
  }, []);

  const { dateLabel, timeLabel } = formatIndonesianDateTime(
    now,
    settings.timezone,
  );

  return (
    <header className="relative w-full overflow-hidden bg-[#082254] select-none shrink-0">
      {/* Generated Scenic Hero Backdrop */}
      <img
        src="/src/assets/images/tanimbar_hero_banner_1794987375520.jpg"
        alt="Pemandangan pesisir Kepulauan Tanimbar dan pelajar Indonesia"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-[100%_20%] pointer-events-none"
      />

      {/* Seamless left-to-right royal navy scrim so white/gold title text has high contrast */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(6,27,70,0.98) 0%, rgba(9,39,98,0.94) 36%, rgba(12,60,138,0.52) 56%, rgba(12,60,138,0.08) 76%, rgba(6,27,70,0.32) 100%)',
        }}
      />

      {/* Main Header Content */}
      <div className="relative z-10 flex flex-col justify-between min-h-[144px] sm:min-h-[164px] px-4 sm:px-7 pt-4 pb-5">
        <div className="flex items-start justify-between gap-4">
          {/* Left Identity Block */}
          <div className="flex items-center gap-3.5 sm:gap-4 max-w-2xl">
            <button
              type="button"
              onClick={onOpenMobileMenu}
              aria-label="Buka menu navigasi"
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>

            <TutWuriEmblem className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 drop-shadow-[0_3px_10px_rgba(0,0,0,0.35)]" />

            <div className="min-w-0">
              <h1 className="text-xl sm:text-[28px] lg:text-[31px] font-extrabold tracking-tight text-white leading-tight drop-shadow-sm">
                {settings.portalTitle}
              </h1>
              <p className="text-sm sm:text-[18px] font-bold text-[#FACC15] leading-snug mt-0.5 drop-shadow-sm">
                {settings.regionName}
              </p>
              <p className="text-xs sm:text-[13.5px] font-medium italic text-sky-100/95 mt-0.5 line-clamp-1">
                {settings.subtitle}
              </p>
            </div>
          </div>

          {/* Right Slogan Overlay */}
          <div className="hidden md:flex flex-col items-end text-right pt-0.5 pr-2">
            <p className="px-3 py-1 rounded-xl bg-slate-950/35 backdrop-blur-[2px] text-base lg:text-[17px] font-extrabold italic leading-tight text-white drop-shadow-[0_2px_6px_rgba(4,19,52,0.85)] max-w-[215px]">
              {settings.heroSlogan}
            </p>
          </div>
        </div>

        {/* Bottom-right Frosted Date & Time Bar */}
        <div className="flex items-center justify-end mt-3">
          <div
            className="inline-flex items-center gap-3 sm:gap-4 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/92 backdrop-blur-md text-slate-800 shadow-sm border border-white/80 text-xs sm:text-[13px] font-semibold"
            aria-label="Tanggal dan waktu saat ini"
          >
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Calendar className="w-3.5 h-3.5 text-[#0B5ED7]" />
              <span>{dateLabel}</span>
            </span>
            <span className="h-3.5 w-px bg-slate-300" aria-hidden="true" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono-tabular">
              <Clock className="w-3.5 h-3.5 text-[#0B5ED7]" />
              <span>{timeLabel}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Gold-to-Sky Curve Accent */}
      <svg
        viewBox="0 0 1440 16"
        preserveAspectRatio="none"
        className="relative z-10 block w-full h-3 -mt-2 pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="tanimbarWave" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FACC15" />
            <stop offset="35%" stopColor="#FDE047" />
            <stop offset="70%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
        </defs>
        <path
          d="M0 10 Q420 0 860 10 T1440 6 L1440 16 L0 16 Z"
          fill="#E8F2FE"
        />
        <path
          d="M0 10 Q420 0 860 10 T1440 6"
          fill="none"
          stroke="url(#tanimbarWave)"
          strokeWidth="3.5"
        />
      </svg>
    </header>
  );
}
