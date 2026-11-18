import React from 'react';
import {
  Database,
  FolderKanban,
  HelpCircle,
  Home,
  LayoutGrid,
  PlusCircle,
  Settings,
  X,
} from 'lucide-react';
import { TanimbarMapGraphic } from './Emblems';

export type NavPageId =
  | 'home'
  | 'all-apps'
  | 'manage-apps'
  | 'add-app'
  | 'categories'
  | 'settings'
  | 'help';

interface SidebarProps {
  activePage: NavPageId;
  onNavigate: (page: NavPageId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: {
  id: NavPageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'home', label: 'Beranda', icon: Home },
  { id: 'all-apps', label: 'Semua Aplikasi', icon: LayoutGrid },
  { id: 'manage-apps', label: 'Data Aplikasi', icon: Database },
  { id: 'add-app', label: 'Tambah Aplikasi', icon: PlusCircle },
  { id: 'categories', label: 'Kategori', icon: FolderKanban },
  { id: 'settings', label: 'Pengaturan', icon: Settings },
  { id: 'help', label: 'Bantuan', icon: HelpCircle },
];

export function Sidebar({
  activePage,
  onNavigate,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const handleSelect = (page: NavPageId) => {
    onNavigate(page);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col justify-between h-full w-full bg-gradient-to-b from-[#071D49] via-[#092862] to-[#061A42] text-white">
      <div className="pt-4 px-3">
        {/* Mobile drawer header */}
        <div className="flex items-center justify-between lg:hidden pb-3 mb-3 border-b border-white/10 px-1">
          <span className="text-sm font-bold text-[#FACC15]">Menu Navigasi</span>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Tutup menu navigasi"
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav aria-label="Navigasi Utama" className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-150 whitespace-nowrap text-left cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#0082FF] to-[#005CE6] text-white shadow-[0_6px_18px_rgba(0,115,255,0.42)]'
                    : 'text-sky-100/85 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon
                  className={`w-[18px] h-[18px] shrink-0 ${
                    isActive ? 'text-white' : 'text-sky-200/80'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Tanimbar Archipelago Graphic */}
      <div className="mt-6">
        <TanimbarMapGraphic />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside className="hidden lg:flex w-[220px] shrink-0 flex-col border-r border-blue-950/40 bg-[#071D49]">
        <div className="sticky top-0 h-[calc(100vh-164px)] min-h-[540px] max-h-[820px] flex flex-col">
          {navContent}
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-[260px] max-w-[82vw] h-full shadow-2xl">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
