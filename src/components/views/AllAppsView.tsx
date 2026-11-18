import React, { useState } from 'react';
import {
  ArrowRight,
  LayoutGrid,
  List,
  Search,
  Star,
} from 'lucide-react';
import {
  filterApps,
  sortApps,
  type AppRecord,
  type AppSortKey,
  type CategoryRecord,
  type EducationLevel,
} from '../../shared/portalLogic';
import { AppCard } from '../AppCard';
import { ACCENT_THEMES, AppVectorIcon } from '../Emblems';

interface AllAppsViewProps {
  apps: AppRecord[];
  categories: CategoryRecord[];
  onSelectApp: (app: AppRecord) => void;
}

const LEVELS: (EducationLevel | 'all')[] = [
  'all',
  'Semua',
  'TK',
  'SD',
  'SMP',
  'SMA/SMK',
  'PTK/GTK',
  'Manajemen',
];

export function AllAppsView({
  apps,
  categories,
  onSelectApp,
}: AllAppsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [level, setLevel] = useState<EducationLevel | 'all'>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<AppSortKey>('order');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = sortApps(
    filterApps(apps, {
      searchQuery,
      categoryId,
      level,
      onlyFavorites,
    }),
    sortBy,
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/90 rounded-2xl p-5 shadow-sm border border-white">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Direktori Semua Aplikasi
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Telusuri seluruh {apps.length} layanan pendidikan berdasarkan
            jenjang, kategori, dan popularitas akses.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setOnlyFavorites((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              onlyFavorites
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                onlyFavorites ? 'fill-amber-400 text-amber-500' : ''
              }`}
            />
            <span>Favorit</span>
          </button>

          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              aria-label="Tampilan grid"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Tampilan daftar"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white/90 rounded-2xl p-4 shadow-sm border border-white">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau URL..."
            aria-label="Cari di direktori aplikasi"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          aria-label="Filter kategori"
          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as EducationLevel | 'all')}
          aria-label="Filter jenjang"
          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {LEVELS.map((lv) => (
            <option key={lv} value={lv}>
              {lv === 'all' ? 'Semua Jenjang' : `Jenjang: ${lv}`}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as AppSortKey)}
          aria-label="Urutkan aplikasi"
          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="order">Urutan Bawaan</option>
          <option value="title">Nama (A - Z)</option>
          <option value="visits">Paling Sering Diakses</option>
          <option value="recent">Terbaru Diperbarui</option>
        </select>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="bg-white/90 rounded-2xl p-10 text-center border border-white shadow-sm">
          <p className="text-base font-bold text-slate-800">
            Tidak ada aplikasi yang sesuai filter
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Ubah kata kunci pencarian atau pilih ulang kategori dan jenjang.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filtered.map((app) => (
            <AppCard key={app.id} app={app} onSelect={onSelectApp} />
          ))}
        </div>
      ) : (
        <div className="bg-white/95 rounded-2xl border border-white shadow-sm divide-y divide-slate-100 overflow-hidden">
          {filtered.map((app) => {
            const theme = ACCENT_THEMES[app.accentColor] ?? ACCENT_THEMES.blue;
            return (
              <button
                key={app.id}
                type="button"
                onClick={() => onSelectApp(app)}
                className="w-full flex items-center justify-between gap-4 p-4 hover:bg-sky-50/50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <AppVectorIcon
                    iconKey={app.iconKey}
                    className="w-10 h-10 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 truncate">
                        {app.title}
                      </span>
                      {app.isFavorite && (
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 truncate">
                      {app.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${theme.badgeBg} ${theme.badgeText}`}
                  >
                    {app.badgeLabel}
                  </span>
                  <span className="hidden md:inline text-xs font-mono-tabular text-slate-500">
                    {app.visitCount}x
                  </span>
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white ${theme.arrowBg}`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
