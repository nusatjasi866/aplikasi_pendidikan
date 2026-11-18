import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import type { AppRecord } from '../shared/portalLogic';
import { ACCENT_THEMES, AppVectorIcon } from './Emblems';

interface AppCardProps {
  app: AppRecord;
  onSelect: (app: AppRecord) => void;
}

export function AppCard({ app, onSelect }: AppCardProps) {
  const theme = ACCENT_THEMES[app.accentColor] ?? ACCENT_THEMES.blue;

  return (
    <button
      type="button"
      onClick={() => onSelect(app)}
      aria-label={`Buka aplikasi ${app.title}`}
      className="group relative flex flex-col justify-between text-left w-full rounded-[18px] bg-white/95 hover:bg-white p-3.5 shadow-[0_4px_18px_rgba(12,42,96,0.06)] hover:shadow-[0_12px_28px_rgba(12,42,96,0.13)] border border-white hover:border-sky-200/80 transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
    >
      {/* Subtle maintenance corner indicator */}
      {app.status === 'maintenance' && (
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
          Pemeliharaan
        </span>
      )}

      {/* Top Row: Icon + Title + Description */}
      <div className="flex items-start gap-2.5">
        <div className="shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-105">
          <AppVectorIcon iconKey={app.iconKey} className="w-11 h-11" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[14.5px] font-bold text-slate-900 leading-tight line-clamp-2">
            {app.title}
          </h3>
          <p className="text-[12px] text-slate-600 leading-[1.38] line-clamp-2 mt-1">
            {app.description}
          </p>
        </div>
      </div>

      {/* Bottom Row: Category Badge + Circular Arrow Button */}
      <div className="flex items-center justify-between gap-2 mt-3.5 pt-0.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold truncate ${theme.badgeBg} ${theme.badgeText}`}
          >
            {app.badgeLabel}
          </span>
          {app.isFavorite && (
            <Star
              className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0"
              aria-hidden="true"
            />
          )}
        </div>

        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white shadow-sm shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 ${theme.arrowBg} ${theme.arrowHover}`}
          aria-hidden="true"
        >
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </span>
      </div>
    </button>
  );
}
