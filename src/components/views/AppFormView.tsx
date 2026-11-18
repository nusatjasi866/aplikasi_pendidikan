import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import {
  validateAppInput,
  type AccentColor,
  type AppRecord,
  type AppStatus,
  type CategoryRecord,
  type CreateAppInput,
  type EducationLevel,
  type IconKey,
} from '../../shared/portalLogic';
import { AppCard } from '../AppCard';
import { ACCENT_THEMES, AppVectorIcon } from '../Emblems';

interface AppFormViewProps {
  categories: CategoryRecord[];
  initialApp?: AppRecord | null;
  onSubmit: (input: CreateAppInput, existingId?: string) => Promise<void>;
  onCancel: () => void;
}

const ICON_OPTIONS: { key: IconKey; label: string }[] = [
  { key: 'clipboard-list', label: 'Daftar Nilai' },
  { key: 'book-open', label: 'Buku / Materi' },
  { key: 'abc-blocks', label: 'Balok TK' },
  { key: 'user-circle', label: 'Akun PTK' },
  { key: 'user-check', label: 'Verval PTK' },
  { key: 'info-circle', label: 'Info GTK' },
  { key: 'grad-cap', label: 'Wisuda / Siswa' },
  { key: 'school-building', label: 'Gedung Sekolah' },
  { key: 'pen-book', label: 'Literasi' },
  { key: 'chart-up', label: 'Grafik Kinerja' },
  { key: 'doc-check', label: 'Validasi Berkas' },
  { key: 'id-card', label: 'Kartu Identitas' },
  { key: 'dapodik-cube', label: 'Dapodik' },
  { key: 'arkas-a', label: 'Anggaran' },
  { key: 'rapor-bars', label: 'Rapor Mutu' },
  { key: 'pmm-star', label: 'Merdeka Mengajar' },
  { key: 'erapor-monitor', label: 'e-Rapor' },
  { key: 'anbk-laptop', label: 'Asesmen Laptop' },
  { key: 'simpkb-crest', label: 'SIMPKB' },
  { key: 'shield-check', label: 'Verifikasi Ijazah' },
  { key: 'database-sync', label: 'Basis Data' },
  { key: 'layers-grid', label: 'Manajemen' },
];

const ACCENT_KEYS: AccentColor[] = [
  'blue',
  'purple',
  'pink',
  'emerald',
  'orange',
  'teal',
];

const LEVELS: EducationLevel[] = [
  'Semua',
  'TK',
  'SD',
  'SMP',
  'SMA/SMK',
  'PTK/GTK',
  'Manajemen',
];

export function AppFormView({
  categories,
  initialApp,
  onSubmit,
  onCancel,
}: AppFormViewProps) {
  const isEditing = Boolean(initialApp);
  const defaultCategoryId = initialApp?.categoryId ?? categories[0]?.id ?? '';

  const [title, setTitle] = useState(initialApp?.title ?? '');
  const [description, setDescription] = useState(initialApp?.description ?? '');
  const [url, setUrl] = useState(initialApp?.url ?? 'https://');
  const [categoryId, setCategoryId] = useState(defaultCategoryId);
  const [badgeLabel, setBadgeLabel] = useState(initialApp?.badgeLabel ?? '');
  const [accentColor, setAccentColor] = useState<AccentColor>(
    initialApp?.accentColor ?? 'blue',
  );
  const [iconKey, setIconKey] = useState<IconKey>(
    initialApp?.iconKey ?? 'clipboard-list',
  );
  const [level, setLevel] = useState<EducationLevel>(
    initialApp?.level ?? 'Semua',
  );
  const [status, setStatus] = useState<AppStatus>(
    initialApp?.status ?? 'active',
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedCategoryName =
    categories.find((c) => c.id === categoryId)?.name ?? 'Kategori';

  const previewApp: AppRecord = {
    id: initialApp?.id ?? 'preview',
    title: title.trim() || 'Nama Aplikasi Baru',
    description:
      description.trim() ||
      'Deskripsi singkat layanan aplikasi pendidikan Kabupaten Kepulauan Tanimbar.',
    url: url.trim() || 'https://pendidikan.tanimbar.go.id',
    categoryId,
    badgeLabel: badgeLabel.trim() || selectedCategoryName,
    accentColor,
    iconKey,
    level,
    status,
    isFavorite: initialApp?.isFavorite ?? false,
    visitCount: initialApp?.visitCount ?? 0,
    order: initialApp?.order ?? 99,
    createdAt: initialApp?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    const check = validateAppInput(
      {
        title,
        description,
        url,
        categoryId,
      },
      categories.map((c) => c.id),
    );

    if (!check.valid) {
      setErrors(check.errors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      await onSubmit(
        {
          title: title.trim(),
          description: description.trim(),
          url: url.trim(),
          categoryId,
          badgeLabel: badgeLabel.trim() || selectedCategoryName,
          accentColor,
          iconKey,
          level,
          status,
        },
        initialApp?.id,
      );
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Gagal menyimpan aplikasi.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white/95 rounded-2xl p-5 shadow-sm border border-white flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {isEditing
              ? `Edit Aplikasi: ${initialApp?.title}`
              : 'Tambah Aplikasi Baru'}
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Lengkapi informasi layanan pendidikan yang akan ditampilkan di
            portal utama.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Form Column */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="lg:col-span-2 bg-white/95 rounded-2xl p-6 shadow-sm border border-white space-y-4"
        >
          {serverError && (
            <div
              role="alert"
              className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-800 font-medium"
            >
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="app-title"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Nama Aplikasi <span className="text-rose-600">*</span>
              </label>
              <input
                id="app-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Misal: SiAbsen Tanimbar"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="text-xs text-rose-600 font-medium mt-1">
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="app-url"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                URL Tujuan <span className="text-rose-600">*</span>
              </label>
              <input
                id="app-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://contoh.tanimbar.go.id"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono-tabular focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.url && (
                <p className="text-xs text-rose-600 font-medium mt-1">
                  {errors.url}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="app-description"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Deskripsi Singkat <span className="text-rose-600">*</span>
            </label>
            <textarea
              id="app-description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan fungsi singkat aplikasi ini bagi sekolah, guru, atau siswa..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="text-xs text-rose-600 font-medium mt-1">
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="app-category"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Kategori <span className="text-rose-600">*</span>
              </label>
              <select
                id="app-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-xs text-rose-600 font-medium mt-1">
                  {errors.categoryId}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="app-badge"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Label Kartu (Opsional)
              </label>
              <input
                id="app-badge"
                type="text"
                value={badgeLabel}
                onChange={(e) => setBadgeLabel(e.target.value)}
                placeholder={selectedCategoryName}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="app-level"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Jenjang
              </label>
              <select
                id="app-level"
                value={level}
                onChange={(e) => setLevel(e.target.value as EducationLevel)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {LEVELS.map((lv) => (
                  <option key={lv} value={lv}>
                    {lv}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="app-status"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Status Layanan
              </label>
              <select
                id="app-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as AppStatus)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Aktif</option>
                <option value="maintenance">Pemeliharaan</option>
              </select>
            </div>
          </div>

          {/* Accent Color Picker */}
          <div>
            <span className="block text-xs font-bold text-slate-700 mb-2">
              Warna Aksen Kartu
            </span>
            <div className="flex flex-wrap gap-2">
              {ACCENT_KEYS.map((color) => {
                const t = ACCENT_THEMES[color];
                const selected = accentColor === color;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setAccentColor(color)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      selected
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${t.arrowBg}`} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Icon Picker */}
          <div>
            <span className="block text-xs font-bold text-slate-700 mb-2">
              Pilih Ikon Aplikasi
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
              {ICON_OPTIONS.map((opt) => {
                const selected = iconKey === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setIconKey(opt.key)}
                    title={opt.label}
                    aria-label={`Ikon ${opt.label}`}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all cursor-pointer ${
                      selected
                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <AppVectorIcon iconKey={opt.key} className="w-8 h-8" />
                    <span className="text-[10px] font-semibold text-slate-600 truncate w-full text-center">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#0B74F2] to-[#005CE6] hover:from-[#0964D3] hover:to-[#004CC2] shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>
                {submitting
                  ? 'Menyimpan...'
                  : isEditing
                    ? 'Simpan Perubahan'
                    : 'Simpan Aplikasi'}
              </span>
            </button>
          </div>
        </form>

        {/* Live Card Preview Column */}
        <div className="bg-gradient-to-br from-[#DCEBFE] to-[#EDF5FF] rounded-2xl p-5 border border-white shadow-sm space-y-3">
          <p className="text-xs font-extrabold text-slate-700">
            Pratinjau Kartu Portal
          </p>
          <div className="pointer-events-none">
            <AppCard app={previewApp} onSelect={() => {}} />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Kartu ini akan langsung muncul di halaman{' '}
            <span className="font-semibold text-slate-800">Beranda</span> dan
            terhitung otomatis pada tab kategori{' '}
            <span className="font-semibold text-slate-800">
              {selectedCategoryName}
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
