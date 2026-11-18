import React, { useState } from 'react';
import { FolderPlus, Pencil, Save, Trash2, X } from 'lucide-react';
import {
  validateCategoryInput,
  type AccentColor,
  type AppRecord,
  type CategoryIconKey,
  type CategoryRecord,
} from '../../shared/portalLogic';
import { ACCENT_THEMES, CategoryTabIcon } from '../Emblems';

interface CategoriesViewProps {
  apps: AppRecord[];
  categories: CategoryRecord[];
  onCreateCategory: (input: {
    name: string;
    icon: CategoryIconKey;
    color: AccentColor;
  }) => Promise<void>;
  onUpdateCategory: (
    id: string,
    input: { name: string; icon: CategoryIconKey; color: AccentColor },
  ) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onOpenCategoryInHome: (categoryId: string) => void;
}

const CAT_ICONS: { key: CategoryIconKey; label: string }[] = [
  { key: 'grad-cap', label: 'Pembelajaran' },
  { key: 'database', label: 'Basis Data' },
  { key: 'users', label: 'PTK / GTK' },
  { key: 'book-open', label: 'Siswa / Buku' },
  { key: 'building', label: 'Sarana' },
  { key: 'settings', label: 'Lainnya' },
  { key: 'grid', label: 'Umum' },
];

const ACCENT_COLORS: AccentColor[] = [
  'blue',
  'purple',
  'pink',
  'emerald',
  'orange',
  'teal',
];

export function CategoriesView({
  apps,
  categories,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  onOpenCategoryInHome,
}: CategoriesViewProps) {
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState<CategoryIconKey>('grad-cap');
  const [newColor, setNewColor] = useState<AccentColor>('blue');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState<CategoryIconKey>('grid');
  const [editColor, setEditColor] = useState<AccentColor>('blue');
  const [actionError, setActionError] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setActionError('');
    const check = validateCategoryInput(newName);
    if (!check.valid) {
      setFormError(check.errors.name);
      return;
    }

    setSubmitting(true);
    try {
      await onCreateCategory({
        name: newName.trim(),
        icon: newIcon,
        color: newColor,
      });
      setNewName('');
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : 'Gagal menambah kategori.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (cat: CategoryRecord) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditIcon(cat.icon);
    setEditColor(cat.color);
    setActionError('');
  };

  const handleSaveEdit = async (id: string) => {
    const check = validateCategoryInput(editName);
    if (!check.valid) {
      setActionError(check.errors.name);
      return;
    }
    try {
      await onUpdateCategory(id, {
        name: editName.trim(),
        icon: editIcon,
        color: editColor,
      });
      setEditingId(null);
      setActionError('');
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Gagal memperbarui kategori.',
      );
    }
  };

  const handleDelete = async (cat: CategoryRecord) => {
    setActionError('');
    try {
      await onDeleteCategory(cat.id);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Gagal menghapus kategori.',
      );
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white/95 rounded-2xl p-5 shadow-sm border border-white">
        <h2 className="text-xl font-extrabold text-slate-900">
          Kelola Kategori Portal
        </h2>
        <p className="text-sm text-slate-600 mt-0.5">
          Atur kelompok layanan yang tampil pada tab filter di halaman Beranda.
        </p>
      </div>

      {actionError && (
        <div
          role="alert"
          className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm font-medium text-rose-800"
        >
          {actionError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Category List */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {categories.map((cat) => {
            const count = apps.filter((a) => a.categoryId === cat.id).length;
            const theme = ACCENT_THEMES[cat.color] ?? ACCENT_THEMES.blue;
            const isEditing = editingId === cat.id;

            return (
              <div
                key={cat.id}
                className="bg-white/95 rounded-2xl p-4 shadow-sm border border-white flex flex-col justify-between gap-3"
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      aria-label="Edit nama kategori"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={editIcon}
                        onChange={(e) =>
                          setEditIcon(e.target.value as CategoryIconKey)
                        }
                        aria-label="Edit ikon kategori"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                      >
                        {CAT_ICONS.map((ic) => (
                          <option key={ic.key} value={ic.key}>
                            {ic.label}
                          </option>
                        ))}
                      </select>
                      <select
                        value={editColor}
                        onChange={(e) =>
                          setEditColor(e.target.value as AccentColor)
                        }
                        aria-label="Edit warna kategori"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                      >
                        {ACCENT_COLORS.map((c) => (
                          <option key={c} value={c}>
                            {ACCENT_THEMES[c].label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Batal</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(cat.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Simpan</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${theme.badgeBg} ${theme.badgeText}`}
                        >
                          <CategoryTabIcon icon={cat.icon} className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900 truncate">
                            {cat.name}
                          </h3>
                          <p className="text-xs text-slate-500 tabular-nums">
                            {count} aplikasi terdaftar
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => startEdit(cat)}
                          aria-label={`Edit kategori ${cat.name}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat)}
                          aria-label={`Hapus kategori ${cat.name}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenCategoryInHome(cat.id)}
                      className="text-left text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline pt-1 cursor-pointer"
                    >
                      Lihat di Beranda →
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Category Form */}
        <form
          onSubmit={handleAdd}
          noValidate
          className="bg-white/95 rounded-2xl p-5 shadow-sm border border-white space-y-4"
        >
          <div className="flex items-center gap-2 text-slate-900">
            <FolderPlus className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-extrabold">Tambah Kategori Baru</h3>
          </div>

          <div>
            <label
              htmlFor="new-category-name"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Nama Kategori
            </label>
            <input
              id="new-category-name"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Misal: Kurikulum Merdeka"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formError && (
              <p className="text-xs text-rose-600 font-medium mt-1">
                {formError}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="new-category-icon"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Ikon
              </label>
              <select
                id="new-category-icon"
                value={newIcon}
                onChange={(e) =>
                  setNewIcon(e.target.value as CategoryIconKey)
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
              >
                {CAT_ICONS.map((ic) => (
                  <option key={ic.key} value={ic.key}>
                    {ic.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="new-category-color"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Warna
              </label>
              <select
                id="new-category-color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value as AccentColor)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
              >
                {ACCENT_COLORS.map((c) => (
                  <option key={c} value={c}>
                    {ACCENT_THEMES[c].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#0B74F2] to-[#005CE6] hover:from-[#0964D3] hover:to-[#004CC2] shadow-sm transition-all cursor-pointer"
          >
            {submitting ? 'Menambahkan...' : 'Tambah Kategori'}
          </button>
        </form>
      </div>
    </div>
  );
}
