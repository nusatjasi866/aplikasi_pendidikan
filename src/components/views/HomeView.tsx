import React from 'react';
import { Megaphone, Search, X } from 'lucide-react';
import {
  computeCategoryCounts,
  filterApps,
  type AppRecord,
  type CategoryRecord,
  type PortalSettings,
} from '../../shared/portalLogic';
import { AppCard } from '../AppCard';
import { CategoryTabIcon } from '../Emblems';

interface HomeViewProps {
  apps: AppRecord[];
  categories: CategoryRecord[];
  settings: PortalSettings;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  onSelectApp: (app: AppRecord) => void;
}

export function HomeView({
  apps,
  categories,
  settings,
  searchQuery,
  onSearchChange,
  selectedCategoryId,
  onSelectCategory,
  onSelectApp,
}: HomeViewProps) {
  const categoryTabs = computeCategoryCounts(apps, categories);
  const filteredApps = filterApps(apps, {
    searchQuery,
    categoryId: selectedCategoryId,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-5">
      {/* Optional Announcement Banner */}
      {settings.announcementEnabled && settings.announcementText && (
        <div
          role="status"
          className="max-w-5xl mx-auto flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-amber-50/95 border border-amber-200/90 text-amber-900 shadow-xs text-xs sm:text-sm font-medium"
        >
          <Megaphone className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="leading-snug">{settings.announcementText}</p>
        </div>
      )}

      {/* Centered Pill Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="max-w-[780px] mx-auto"
        role="search"
        aria-label="Cari aplikasi pendidikan"
      >
        <div className="flex items-center gap-2 bg-white rounded-full p-1.5 pl-4 sm:pl-5 shadow-[0_6px_24px_rgba(12,42,96,0.08)] border border-white">
          <Search className="w-5 h-5 text-blue-600 shrink-0" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari aplikasi... (misal: Dapodik, Verval, GTK, Nilai, dll)"
            aria-label="Cari aplikasi"
            className="w-full bg-transparent text-sm sm:text-[15px] text-slate-800 placeholder:text-slate-400 focus:outline-none py-1.5"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Bersihkan kata kunci pencarian"
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#0B74F2] to-[#005CE6] hover:from-[#0964D3] hover:to-[#004CC2] text-white text-sm font-bold shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            Cari
          </button>
        </div>
      </form>

      {/* Category Filter Pills Row */}
      <div
        className="flex flex-wrap items-center justify-center gap-2.5"
        role="tablist"
        aria-label="Filter kategori aplikasi"
      >
        {categoryTabs.map((tab) => {
          const isActive = selectedCategoryId === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectCategory(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#007BFF] to-[#005CE6] text-white shadow-[0_6px_16px_rgba(0,104,230,0.34)]'
                  : 'bg-white/90 hover:bg-white text-slate-700 shadow-[0_2px_10px_rgba(12,42,96,0.05)] border border-white hover:border-sky-200'
              }`}
            >
              <CategoryTabIcon
                icon={tab.icon}
                className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#0B74F2]'}`}
              />
              <span>
                {tab.name} ({tab.count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Application Cards Grid */}
      {filteredApps.length > 0 ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 pt-1"
          data-testid="home-apps-grid"
        >
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} onSelect={onSelectApp} />
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto text-center bg-white/90 rounded-2xl p-8 shadow-sm border border-white mt-4">
          <p className="text-base font-bold text-slate-800">
            Aplikasi tidak ditemukan
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Tidak ada aplikasi yang cocok dengan pencarian atau filter kategori
            saat ini.
          </p>
          <button
            type="button"
            onClick={() => {
              onSearchChange('');
              onSelectCategory('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Tampilkan Semua Aplikasi
          </button>
        </div>
      )}
    </div>
  );
}
