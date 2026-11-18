import React, { useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import type { PortalSettings, TimezoneOption } from '../../shared/portalLogic';

interface SettingsViewProps {
  settings: PortalSettings;
  onSaveSettings: (next: Partial<PortalSettings>) => Promise<void>;
  onResetSeed: () => Promise<void>;
}

export function SettingsView({
  settings,
  onSaveSettings,
  onResetSeed,
}: SettingsViewProps) {
  const [form, setForm] = useState<PortalSettings>({ ...settings });
  const [saving, setSaving] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSaveSettings(form);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmReset = async () => {
    setResetting(true);
    try {
      await onResetSeed();
      setConfirmReset(false);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="bg-white/95 rounded-2xl p-5 shadow-sm border border-white">
        <h2 className="text-xl font-extrabold text-slate-900">
          Pengaturan Portal
        </h2>
        <p className="text-sm text-slate-600 mt-0.5">
          Sesuaikan identitas daerah, zona waktu tampilan jam, pengumuman
          penting, dan kontak layanan Dinas Pendidikan.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white/95 rounded-2xl p-6 shadow-sm border border-white space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="set-title"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Judul Utama Portal
            </label>
            <input
              id="set-title"
              type="text"
              value={form.portalTitle}
              onChange={(e) =>
                setForm((p) => ({ ...p, portalTitle: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="set-region"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Nama Kabupaten / Instansi
            </label>
            <input
              id="set-region"
              type="text"
              value={form.regionName}
              onChange={(e) =>
                setForm((p) => ({ ...p, regionName: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="set-subtitle"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Subjudul Layanan
            </label>
            <input
              id="set-subtitle"
              type="text"
              value={form.subtitle}
              onChange={(e) =>
                setForm((p) => ({ ...p, subtitle: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="set-slogan"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Slogan Hero Banner
            </label>
            <input
              id="set-slogan"
              type="text"
              value={form.heroSlogan}
              onChange={(e) =>
                setForm((p) => ({ ...p, heroSlogan: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="set-timezone"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Zona Waktu Header
            </label>
            <select
              id="set-timezone"
              value={form.timezone}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  timezone: e.target.value as TimezoneOption,
                }))
              }
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="WIT">WIT (Waktu Indonesia Timur)</option>
              <option value="WITA">WITA (Waktu Indonesia Tengah)</option>
              <option value="WIB">WIB (Waktu Indonesia Barat)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="set-phone"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Telepon Helpdesk
            </label>
            <input
              id="set-phone"
              type="text"
              value={form.supportPhone}
              onChange={(e) =>
                setForm((p) => ({ ...p, supportPhone: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="set-email"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Email Layanan Teknis
            </label>
            <input
              id="set-email"
              type="email"
              value={form.supportEmail}
              onChange={(e) =>
                setForm((p) => ({ ...p, supportEmail: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="set-address"
            className="block text-xs font-bold text-slate-700 mb-1.5"
          >
            Alamat Kantor Dinas Pendidikan
          </label>
          <input
            id="set-address"
            type="text"
            value={form.officeAddress}
            onChange={(e) =>
              setForm((p) => ({ ...p, officeAddress: e.target.value }))
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Announcement Toggle */}
        <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 space-y-3">
          <label className="inline-flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.announcementEnabled}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  announcementEnabled: e.target.checked,
                }))
              }
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-bold text-slate-800">
              Tampilkan Banner Pengumuman di Halaman Beranda
            </span>
          </label>

          <textarea
            rows={2}
            value={form.announcementText}
            onChange={(e) =>
              setForm((p) => ({ ...p, announcementText: e.target.value }))
            }
            aria-label="Isi teks pengumuman"
            placeholder="Tulis informasi penting untuk sekolah dan PTK..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset ke Data Awal</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#0B74F2] to-[#005CE6] hover:from-[#0964D3] hover:to-[#004CC2] shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
          </button>
        </div>
      </form>

      {confirmReset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/55 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-dialog-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3
              id="reset-dialog-title"
              className="text-lg font-extrabold text-slate-900"
            >
              Reset Portal ke Data Awal?
            </h3>
            <p className="text-sm text-slate-600">
              Semua aplikasi tambahan, perubahan kategori, dan pengaturan akan
              dikembalikan ke konfigurasi standar 24 aplikasi Pendidikan
              Tanimbar.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                disabled={resetting}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                disabled={resetting}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
              >
                {resetting ? 'Mereset...' : 'Ya, Reset Data'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
