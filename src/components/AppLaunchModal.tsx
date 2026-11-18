import React, { useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  Pencil,
  Star,
  X,
} from 'lucide-react';
import type { AppRecord, CategoryRecord } from '../shared/portalLogic';
import { ACCENT_THEMES, AppVectorIcon } from './Emblems';

interface AppLaunchModalProps {
  app: AppRecord | null;
  categories: CategoryRecord[];
  onClose: () => void;
  onToggleFavorite: (app: AppRecord) => Promise<void>;
  onEdit: (app: AppRecord) => void;
}

export function AppLaunchModal({
  app,
  categories,
  onClose,
  onToggleFavorite,
  onEdit,
}: AppLaunchModalProps) {
  const [copied, setCopied] = useState(false);
  const [favPending, setFavPending] = useState(false);

  if (!app) return null;

  const theme = ACCENT_THEMES[app.accentColor] ?? ACCENT_THEMES.blue;
  const categoryName =
    categories.find((c) => c.id === app.categoryId)?.name ?? app.badgeLabel;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(app.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback ignored if clipboard denied
    }
  };

  const handleFavorite = async () => {
    setFavPending(true);
    try {
      await onToggleFavorite(app);
    } finally {
      setFavPending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="launch-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="flex items-start justify-between gap-4 p-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4 min-w-0">
            <div className="p-2 rounded-2xl bg-slate-50 border border-slate-100 shrink-0">
              <AppVectorIcon iconKey={app.iconKey} className="w-14 h-14" />
            </div>
            <div className="min-w-0">
              <h2
                id="launch-modal-title"
                className="text-xl font-extrabold text-slate-900 truncate"
              >
                {app.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs">
                <span
                  className={`px-2.5 py-0.5 rounded-full font-semibold ${theme.badgeBg} ${theme.badgeText}`}
                >
                  {categoryName}
                </span>
                <span className="text-slate-400" aria-hidden="true">
                  ·
                </span>
                <span className="text-slate-600 font-medium">
                  Jenjang: {app.level}
                </span>
                <span className="text-slate-400" aria-hidden="true">
                  ·
                </span>
                <span
                  className={`font-semibold ${
                    app.status === 'active'
                      ? 'text-emerald-700'
                      : 'text-amber-700'
                  }`}
                >
                  {app.status === 'active' ? 'Layanan Aktif' : 'Pemeliharaan'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela aplikasi"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-700 leading-relaxed">
            {app.description}
          </p>

          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-500">
                Alamat URL Layanan
              </span>
              <span className="text-xs font-medium text-slate-500 tabular-nums">
                {app.visitCount.toLocaleString('id-ID')} kali diakses
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <code className="text-xs sm:text-sm font-mono-tabular text-blue-700 truncate">
                {app.url}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {app.status === 'maintenance' && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2.5 text-xs text-amber-800">
              Layanan ini sedang ditandai dalam status pemeliharaan oleh admin
              portal. Beberapa fitur mungkin mengalami gangguan sementara.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={favPending}
              onClick={handleFavorite}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                app.isFavorite
                  ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Star
                className={`w-4 h-4 ${
                  app.isFavorite ? 'fill-amber-400 text-amber-500' : ''
                }`}
              />
              <span>{app.isFavorite ? 'Difavoritkan' : 'Favoritkan'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(app);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Data</span>
            </button>
          </div>

          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#0B74F2] to-[#0052CC] hover:from-[#0964D3] hover:to-[#0044AD] shadow-sm transition-all"
          >
            <span>Buka Aplikasi</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
