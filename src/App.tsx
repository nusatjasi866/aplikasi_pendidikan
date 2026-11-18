import React, { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import {
  type AccentColor,
  type AppRecord,
  type CategoryIconKey,
  type CreateAppInput,
  type PortalSettings,
  type PortalState,
} from './shared/portalLogic';
import { portalApi } from './services/portalApi';
import { PortalHeader } from './components/PortalHeader';
import { Sidebar, type NavPageId } from './components/Sidebar';
import { AppLaunchModal } from './components/AppLaunchModal';
import { HomeView } from './components/views/HomeView';
import { AllAppsView } from './components/views/AllAppsView';
import { ManageAppsView } from './components/views/ManageAppsView';
import { AppFormView } from './components/views/AppFormView';
import { CategoriesView } from './components/views/CategoriesView';
import { SettingsView } from './components/views/SettingsView';
import { HelpView } from './components/views/HelpView';

export default function App() {
  const [portal, setPortal] = useState<PortalState | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [activePage, setActivePage] = useState<NavPageId>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [homeCategoryId, setHomeCategoryId] = useState('all');

  const [selectedApp, setSelectedApp] = useState<AppRecord | null>(null);
  const [editingApp, setEditingApp] = useState<AppRecord | null>(null);

  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const showToast = useCallback(
    (type: 'success' | 'error', text: string) => {
      setToast({ type, text });
      window.setTimeout(() => {
        setToast((curr) => (curr?.text === text ? null : curr));
      }, 3200);
    },
    [],
  );

  const fetchPortal = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await portalApi.getPortalState();
      setPortal(data);
    } catch (err) {
      setLoadError(
        err instanceof Error
          ? err.message
          : 'Gagal memuat data portal dari server.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortal();
  }, [fetchPortal]);

  const handleSelectApp = async (app: AppRecord) => {
    setSelectedApp(app);
    try {
      const { app: updatedApp, state } = await portalApi.recordVisit(app.id);
      setPortal(state);
      setSelectedApp((prev) => (prev?.id === updatedApp.id ? updatedApp : prev));
    } catch {
      // Visit counter failure is non-blocking
    }
  };

  const handleToggleFavorite = async (app: AppRecord) => {
    const { app: updatedApp, state } = await portalApi.toggleFavorite(app.id);
    setPortal(state);
    setSelectedApp((prev) => (prev?.id === updatedApp.id ? updatedApp : prev));
    showToast(
      'success',
      updatedApp.isFavorite
        ? `${updatedApp.title} ditambahkan ke favorit.`
        : `${updatedApp.title} dihapus dari favorit.`,
    );
  };

  const handleSaveApp = async (
    input: CreateAppInput,
    existingId?: string,
  ) => {
    if (existingId) {
      const { app: updatedApp, state } = await portalApi.updateApp(
        existingId,
        input,
      );
      setPortal(state);
      setEditingApp(null);
      setActivePage('manage-apps');
      showToast('success', `Perubahan pada ${updatedApp.title} berhasil disimpan.`);
    } else {
      const { app: createdApp, state } = await portalApi.createApp(input);
      setPortal(state);
      setActivePage('home');
      setHomeCategoryId('all');
      setHomeSearchQuery('');
      showToast('success', `${createdApp.title} berhasil ditambahkan ke portal.`);
    }
  };

  const handleDeleteApp = async (app: AppRecord) => {
    const { state } = await portalApi.deleteApp(app.id);
    setPortal(state);
    if (selectedApp?.id === app.id) {
      setSelectedApp(null);
    }
    showToast('success', `${app.title} telah dihapus.`);
  };

  const handleToggleStatus = async (app: AppRecord) => {
    const nextStatus = app.status === 'active' ? 'maintenance' : 'active';
    const { state } = await portalApi.updateApp(app.id, { status: nextStatus });
    setPortal(state);
    showToast(
      'success',
      `Status ${app.title} diubah menjadi ${
        nextStatus === 'active' ? 'Aktif' : 'Pemeliharaan'
      }.`,
    );
  };

  const handleCreateCategory = async (input: {
    name: string;
    icon: CategoryIconKey;
    color: AccentColor;
  }) => {
    const { category, state } = await portalApi.createCategory(input);
    setPortal(state);
    showToast('success', `Kategori "${category.name}" berhasil ditambahkan.`);
  };

  const handleUpdateCategory = async (
    id: string,
    input: { name: string; icon: CategoryIconKey; color: AccentColor },
  ) => {
    const { category, state } = await portalApi.updateCategory(id, input);
    setPortal(state);
    showToast('success', `Kategori "${category.name}" diperbarui.`);
  };

  const handleDeleteCategory = async (id: string) => {
    const { state } = await portalApi.deleteCategory(id);
    setPortal(state);
    if (homeCategoryId === id) {
      setHomeCategoryId('all');
    }
    showToast('success', 'Kategori berhasil dihapus.');
  };

  const handleSaveSettings = async (next: Partial<PortalSettings>) => {
    const { state } = await portalApi.updateSettings(next);
    setPortal(state);
    showToast('success', 'Pengaturan portal berhasil disimpan.');
  };

  const handleResetSeed = async () => {
    const { state } = await portalApi.resetSeed();
    setPortal(state);
    setHomeCategoryId('all');
    setHomeSearchQuery('');
    showToast('success', 'Data portal berhasil dikembalikan ke pengaturan awal.');
  };

  const handleNavigate = (page: NavPageId) => {
    if (page !== 'add-app') {
      setEditingApp(null);
    }
    setActivePage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#E8F2FE]">
        <div className="h-40 bg-[#082254] animate-pulse" />
        <div className="flex flex-1">
          <div className="hidden lg:block w-[224px] bg-[#071D49]" />
          <div className="flex-1 p-6 max-w-[1440px] mx-auto w-full space-y-5">
            <div className="h-12 max-w-2xl mx-auto rounded-full bg-white/80 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-36 rounded-2xl bg-white/80 animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadError || !portal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E8F2FE] p-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-md text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
          <h1 className="text-lg font-extrabold text-slate-900">
            Gagal Memuat Portal
          </h1>
          <p className="text-sm text-slate-600">{loadError}</p>
          <button
            type="button"
            onClick={fetchPortal}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#E8F2FE] via-[#F2F7FF] to-[#DDEBFD]">
      <PortalHeader
        settings={portal.settings}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />

      <div className="flex flex-1 min-h-0">
        <Sidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-7">
          <div className="max-w-[1400px] mx-auto">
            {activePage === 'home' && (
              <HomeView
                apps={portal.apps}
                categories={portal.categories}
                settings={portal.settings}
                searchQuery={homeSearchQuery}
                onSearchChange={setHomeSearchQuery}
                selectedCategoryId={homeCategoryId}
                onSelectCategory={setHomeCategoryId}
                onSelectApp={handleSelectApp}
              />
            )}

            {activePage === 'all-apps' && (
              <AllAppsView
                apps={portal.apps}
                categories={portal.categories}
                onSelectApp={handleSelectApp}
              />
            )}

            {activePage === 'manage-apps' && (
              <ManageAppsView
                apps={portal.apps}
                categories={portal.categories}
                onAddNew={() => {
                  setEditingApp(null);
                  setActivePage('add-app');
                }}
                onEditApp={(app) => {
                  setEditingApp(app);
                  setActivePage('add-app');
                }}
                onDeleteApp={handleDeleteApp}
                onToggleStatus={handleToggleStatus}
              />
            )}

            {activePage === 'add-app' && (
              <AppFormView
                key={editingApp?.id ?? 'new'}
                categories={portal.categories}
                initialApp={editingApp}
                onSubmit={handleSaveApp}
                onCancel={() => {
                  setEditingApp(null);
                  setActivePage(editingApp ? 'manage-apps' : 'home');
                }}
              />
            )}

            {activePage === 'categories' && (
              <CategoriesView
                apps={portal.apps}
                categories={portal.categories}
                onCreateCategory={handleCreateCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
                onOpenCategoryInHome={(catId) => {
                  setHomeCategoryId(catId);
                  setHomeSearchQuery('');
                  setActivePage('home');
                }}
              />
            )}

            {activePage === 'settings' && (
              <SettingsView
                key={JSON.stringify(portal.settings)}
                settings={portal.settings}
                onSaveSettings={handleSaveSettings}
                onResetSeed={handleResetSeed}
              />
            )}

            {activePage === 'help' && <HelpView settings={portal.settings} />}
          </div>
        </main>
      </div>

      {/* App Launch & Quick Info Modal */}
      <AppLaunchModal
        app={selectedApp}
        categories={portal.categories}
        onClose={() => setSelectedApp(null)}
        onToggleFavorite={handleToggleFavorite}
        onEdit={(app) => {
          setEditingApp(app);
          setActivePage('add-app');
        }}
      />

      {/* Non-intrusive Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold ${
            toast.type === 'success'
              ? 'bg-slate-900 text-white border-slate-800'
              : 'bg-rose-700 text-white border-rose-600'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-200 shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}
    </div>
  );
}
