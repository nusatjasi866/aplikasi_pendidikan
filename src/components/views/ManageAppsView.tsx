import React, { useState } from 'react';
import {
  Pencil,
  PlusCircle,
  Search,
  Trash2,
} from 'lucide-react';
import {
  filterApps,
  type AppRecord,
  type CategoryRecord,
} from '../../shared/portalLogic';
import { AppVectorIcon } from '../Emblems';

interface ManageAppsViewProps {
  apps: AppRecord[];
  categories: CategoryRecord[];
  onAddNew: () => void;
  onEditApp: (app: AppRecord) => void;
  onDeleteApp: (app: AppRecord) => Promise<void>;
  onToggleStatus: (app: AppRecord) => Promise<void>;
}

export function ManageAppsView({
  apps,
  categories,
  onAddNew,
  onEditApp,
  onDeleteApp,
  onToggleStatus,
}: ManageAppsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [confirmDeleteApp, setConfirmDeleteApp] = useState<AppRecord | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  const filtered = filterApps(apps, { searchQuery, categoryId });

  const totalVisits = apps.reduce((sum, a) => sum + a.visitCount, 0);
  const activeCount = apps.filter((a) => a.status === 'active').length;
  const maintenanceCount = apps.length - activeCount;

  const handleConfirmDelete = async () => {
    if (!confirmDeleteApp) return;
    setDeleting(true);
    try {
      await onDeleteApp(confirmDeleteApp);
      setConfirmDeleteApp(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header + Summary Metrics */}
      <div className="bg-white/95 rounded-2xl p-5 shadow-sm border border-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Manajemen Data Aplikasi
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Kelola daftar aplikasi, perbarui tautan URL, atur status layanan,
            dan pantau statistik akses.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0B74F2] to-[#005CE6] hover:from-[#0964D3] hover:to-[#004CC2] text-white text-sm font-bold shadow-sm transition-all self-start md:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Aplikasi</span>
        </button>
      </div>

      {/* 4-column Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white/95 rounded-2xl p-4 border border-white shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Total Aplikasi</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
            {apps.length}
          </p>
        </div>
        <div className="bg-white/95 rounded-2xl p-4 border border-white shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Layanan Aktif</p>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1 tabular-nums">
            {activeCount}
          </p>
        </div>
        <div className="bg-white/95 rounded-2xl p-4 border border-white shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Pemeliharaan</p>
          <p className="text-2xl font-extrabold text-amber-700 mt-1 tabular-nums">
            {maintenanceCount}
          </p>
        </div>
        <div className="bg-white/95 rounded-2xl p-4 border border-white shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Total Akses</p>
          <p className="text-2xl font-extrabold text-blue-700 mt-1 tabular-nums">
            {totalVisits.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Search & Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white/95 rounded-2xl p-4 border border-white shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama aplikasi atau URL..."
            aria-label="Cari data aplikasi"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          aria-label="Filter kategori tabel"
          className="sm:w-60 px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Semua Kategori ({apps.length})</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Data Table */}
      <div className="bg-white/95 rounded-2xl border border-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-xs font-bold text-slate-600">
                <th className="py-3 px-4">Aplikasi</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Jenjang</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Akses</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-slate-500 text-sm"
                  >
                    Tidak ada data aplikasi yang cocok.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => {
                  const catName =
                    categories.find((c) => c.id === app.categoryId)?.name ??
                    app.badgeLabel;
                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-sky-50/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3 min-w-[220px]">
                          <AppVectorIcon
                            iconKey={app.iconKey}
                            className="w-9 h-9 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate">
                              {app.title}
                            </div>
                            <div className="text-xs text-slate-500 truncate max-w-[260px]">
                              {app.url}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                        {catName}
                      </td>
                      <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                        {app.level}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onToggleStatus(app)}
                          aria-label={`Ubah status ${app.title}`}
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                            app.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                          }`}
                        >
                          {app.status === 'active' ? 'Aktif' : 'Pemeliharaan'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right font-mono-tabular text-slate-700 whitespace-nowrap">
                        {app.visitCount.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onEditApp(app)}
                            aria-label={`Edit ${app.title}`}
                            className="p-2 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteApp(app)}
                            aria-label={`Hapus ${app.title}`}
                            className="p-2 rounded-lg text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {confirmDeleteApp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/55 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3
              id="delete-confirm-title"
              className="text-lg font-extrabold text-slate-900"
            >
              Hapus Aplikasi?
            </h3>
            <p className="text-sm text-slate-600">
              Anda yakin ingin menghapus{' '}
              <span className="font-bold text-slate-900">
                {confirmDeleteApp.title}
              </span>{' '}
              dari portal? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteApp(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors cursor-pointer"
              >
                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
