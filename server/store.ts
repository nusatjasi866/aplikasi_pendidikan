import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {
  slugify,
  validateAppInput,
  validateCategoryInput,
  type AppRecord,
  type CategoryIconKey,
  type CategoryRecord,
  type CreateAppInput,
  type AccentColor,
  type PortalSettings,
  type PortalState,
  type UpdateAppInput,
} from '../src/shared/portalLogic';
import { createSeedState } from './seedData';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'portal-db.json');

export class ValidationError extends Error {
  errors: Record<string, string>;
  constructor(message: string, errors: Record<string, string> = {}) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readDb(): PortalState {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE)) {
    const initial = createSeedState();
    writeDb(initial);
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as PortalState;
    if (!parsed || !Array.isArray(parsed.apps) || !Array.isArray(parsed.categories)) {
      const reset = createSeedState();
      writeDb(reset);
      return reset;
    }
    return parsed;
  } catch {
    const reset = createSeedState();
    writeDb(reset);
    return reset;
  }
}

function writeDb(state: PortalState): void {
  ensureDataDir();
  const tmpFile = `${DB_FILE}.${process.pid}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(state, null, 2), 'utf-8');
  fs.renameSync(tmpFile, DB_FILE);
}

export function getPortalState(): PortalState {
  const state = readDb();
  return {
    apps: state.apps.slice().sort((a, b) => a.order - b.order),
    categories: state.categories.slice().sort((a, b) => a.order - b.order),
    settings: state.settings,
  };
}

export function createApp(input: CreateAppInput): AppRecord {
  const state = readDb();
  const validCatIds = state.categories.map((c) => c.id);
  const check = validateAppInput(input, validCatIds);
  if (!check.valid) {
    throw new ValidationError('Data aplikasi tidak valid.', check.errors);
  }

  const category = state.categories.find((c) => c.id === input.categoryId)!;
  const maxOrder = state.apps.reduce((max, item) => Math.max(max, item.order), 0);
  const now = new Date().toISOString();

  const baseSlug = slugify(input.title) || 'app';
  const uniqueSuffix = crypto.randomUUID().slice(0, 6);

  const newApp: AppRecord = {
    id: `${baseSlug}-${uniqueSuffix}`,
    title: input.title.trim(),
    description: input.description.trim(),
    url: input.url.trim(),
    categoryId: category.id,
    badgeLabel: (input.badgeLabel ?? '').trim() || category.name,
    accentColor: input.accentColor || category.color || 'blue',
    iconKey: input.iconKey || 'clipboard-list',
    level: input.level || 'Semua',
    status: input.status || 'active',
    isFavorite: Boolean(input.isFavorite),
    visitCount: 0,
    order: maxOrder + 1,
    createdAt: now,
    updatedAt: now,
  };

  state.apps.push(newApp);
  writeDb(state);
  return newApp;
}

export function updateApp(id: string, input: UpdateAppInput): AppRecord {
  const state = readDb();
  const index = state.apps.findIndex((a) => a.id === id);
  if (index === -1) {
    throw new NotFoundError('Aplikasi tidak ditemukan.');
  }

  const existing = state.apps[index];
  const merged: CreateAppInput = {
    title: input.title ?? existing.title,
    description: input.description ?? existing.description,
    url: input.url ?? existing.url,
    categoryId: input.categoryId ?? existing.categoryId,
    badgeLabel: input.badgeLabel ?? existing.badgeLabel,
    accentColor: input.accentColor ?? existing.accentColor,
    iconKey: input.iconKey ?? existing.iconKey,
    level: input.level ?? existing.level,
    status: input.status ?? existing.status,
    isFavorite: input.isFavorite ?? existing.isFavorite,
  };

  const validCatIds = state.categories.map((c) => c.id);
  const check = validateAppInput(merged, validCatIds);
  if (!check.valid) {
    throw new ValidationError('Perubahan data aplikasi tidak valid.', check.errors);
  }

  const category = state.categories.find((c) => c.id === merged.categoryId)!;

  const updated: AppRecord = {
    ...existing,
    title: merged.title.trim(),
    description: merged.description.trim(),
    url: merged.url.trim(),
    categoryId: category.id,
    badgeLabel: (merged.badgeLabel ?? '').trim() || category.name,
    accentColor: merged.accentColor,
    iconKey: merged.iconKey,
    level: merged.level,
    status: merged.status ?? 'active',
    isFavorite: Boolean(merged.isFavorite),
    updatedAt: new Date().toISOString(),
  };

  state.apps[index] = updated;
  writeDb(state);
  return updated;
}

export function deleteApp(id: string): void {
  const state = readDb();
  const before = state.apps.length;
  state.apps = state.apps.filter((a) => a.id !== id);
  if (state.apps.length === before) {
    throw new NotFoundError('Aplikasi tidak ditemukan.');
  }
  writeDb(state);
}

export function incrementAppVisit(id: string): AppRecord {
  const state = readDb();
  const app = state.apps.find((a) => a.id === id);
  if (!app) {
    throw new NotFoundError('Aplikasi tidak ditemukan.');
  }
  app.visitCount += 1;
  app.updatedAt = new Date().toISOString();
  writeDb(state);
  return app;
}

export function toggleAppFavorite(id: string): AppRecord {
  const state = readDb();
  const app = state.apps.find((a) => a.id === id);
  if (!app) {
    throw new NotFoundError('Aplikasi tidak ditemukan.');
  }
  app.isFavorite = !app.isFavorite;
  app.updatedAt = new Date().toISOString();
  writeDb(state);
  return app;
}

export function createCategory(input: {
  name: string;
  icon: CategoryIconKey;
  color: AccentColor;
}): CategoryRecord {
  const state = readDb();
  const check = validateCategoryInput(input.name);
  if (!check.valid) {
    throw new ValidationError('Nama kategori tidak valid.', check.errors);
  }

  const baseSlug = slugify(input.name) || 'kategori';
  const duplicate = state.categories.find(
    (c) => c.slug === baseSlug || c.name.toLowerCase() === input.name.trim().toLowerCase(),
  );
  if (duplicate) {
    throw new ValidationError('Kategori dengan nama tersebut sudah ada.', {
      name: 'Kategori sudah terdaftar.',
    });
  }

  const maxOrder = state.categories.reduce((max, c) => Math.max(max, c.order), 0);
  const newCategory: CategoryRecord = {
    id: `${baseSlug}-${crypto.randomUUID().slice(0, 4)}`,
    name: input.name.trim(),
    slug: baseSlug,
    icon: input.icon || 'grid',
    color: input.color || 'blue',
    order: maxOrder + 1,
  };

  state.categories.push(newCategory);
  writeDb(state);
  return newCategory;
}

export function updateCategory(
  id: string,
  input: { name?: string; icon?: CategoryIconKey; color?: AccentColor },
): CategoryRecord {
  const state = readDb();
  const cat = state.categories.find((c) => c.id === id);
  if (!cat) {
    throw new NotFoundError('Kategori tidak ditemukan.');
  }
  const nextName = input.name ?? cat.name;
  const check = validateCategoryInput(nextName);
  if (!check.valid) {
    throw new ValidationError('Nama kategori tidak valid.', check.errors);
  }
  cat.name = nextName.trim();
  cat.slug = slugify(cat.name) || cat.slug;
  if (input.icon) cat.icon = input.icon;
  if (input.color) cat.color = input.color;

  writeDb(state);
  return cat;
}

export function deleteCategory(id: string): void {
  const state = readDb();
  if (state.categories.length <= 1) {
    throw new ValidationError('Minimal harus ada 1 kategori aktif.');
  }
  const inUse = state.apps.some((a) => a.categoryId === id);
  if (inUse) {
    throw new ValidationError(
      'Kategori masih digunakan oleh aplikasi. Pindahkan aplikasi terlebih dahulu.',
    );
  }
  const before = state.categories.length;
  state.categories = state.categories.filter((c) => c.id !== id);
  if (state.categories.length === before) {
    throw new NotFoundError('Kategori tidak ditemukan.');
  }
  writeDb(state);
}

export function updateSettings(input: Partial<PortalSettings>): PortalSettings {
  const state = readDb();
  const next: PortalSettings = {
    ...state.settings,
    portalTitle: (input.portalTitle ?? state.settings.portalTitle).trim() || state.settings.portalTitle,
    regionName: (input.regionName ?? state.settings.regionName).trim() || state.settings.regionName,
    subtitle: (input.subtitle ?? state.settings.subtitle).trim() || state.settings.subtitle,
    heroSlogan: (input.heroSlogan ?? state.settings.heroSlogan).trim() || state.settings.heroSlogan,
    timezone: input.timezone ?? state.settings.timezone,
    announcementEnabled:
      typeof input.announcementEnabled === 'boolean'
        ? input.announcementEnabled
        : state.settings.announcementEnabled,
    announcementText:
      (input.announcementText ?? state.settings.announcementText).trim(),
    supportPhone:
      (input.supportPhone ?? state.settings.supportPhone).trim() ||
      state.settings.supportPhone,
    supportEmail:
      (input.supportEmail ?? state.settings.supportEmail).trim() ||
      state.settings.supportEmail,
    officeAddress:
      (input.officeAddress ?? state.settings.officeAddress).trim() ||
      state.settings.officeAddress,
  };
  state.settings = next;
  writeDb(state);
  return next;
}

export function resetPortalToSeed(): PortalState {
  const seeded = createSeedState();
  writeDb(seeded);
  return seeded;
}
