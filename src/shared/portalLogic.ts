export type AccentColor =
  | 'blue'
  | 'purple'
  | 'pink'
  | 'emerald'
  | 'orange'
  | 'teal';

export type AppStatus = 'active' | 'maintenance';

export type EducationLevel =
  | 'Semua'
  | 'TK'
  | 'SD'
  | 'SMP'
  | 'SMA/SMK'
  | 'PTK/GTK'
  | 'Manajemen';

export type IconKey =
  | 'clipboard-list'
  | 'book-open'
  | 'abc-blocks'
  | 'user-circle'
  | 'user-check'
  | 'info-circle'
  | 'grad-cap'
  | 'school-building'
  | 'pen-book'
  | 'chart-up'
  | 'doc-check'
  | 'id-card'
  | 'dapodik-cube'
  | 'arkas-a'
  | 'rapor-bars'
  | 'pmm-star'
  | 'erapor-monitor'
  | 'anbk-laptop'
  | 'simpkb-crest'
  | 'shield-check'
  | 'database-sync'
  | 'layers-grid';

export type CategoryIconKey =
  | 'grid'
  | 'grad-cap'
  | 'database'
  | 'users'
  | 'book-open'
  | 'building'
  | 'settings';

export type TimezoneOption = 'WIT' | 'WITA' | 'WIB';

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  icon: CategoryIconKey;
  color: AccentColor;
  order: number;
}

export interface AppRecord {
  id: string;
  title: string;
  description: string;
  url: string;
  categoryId: string;
  badgeLabel: string;
  accentColor: AccentColor;
  iconKey: IconKey;
  level: EducationLevel;
  status: AppStatus;
  isFavorite: boolean;
  visitCount: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface PortalSettings {
  portalTitle: string;
  regionName: string;
  subtitle: string;
  heroSlogan: string;
  timezone: TimezoneOption;
  announcementEnabled: boolean;
  announcementText: string;
  supportPhone: string;
  supportEmail: string;
  officeAddress: string;
}

export interface PortalState {
  apps: AppRecord[];
  categories: CategoryRecord[];
  settings: PortalSettings;
}

export interface CreateAppInput {
  title: string;
  description: string;
  url: string;
  categoryId: string;
  badgeLabel?: string;
  accentColor: AccentColor;
  iconKey: IconKey;
  level: EducationLevel;
  status?: AppStatus;
  isFavorite?: boolean;
}

export interface UpdateAppInput extends Partial<CreateAppInput> {}

export interface AppFilterOptions {
  searchQuery?: string;
  categoryId?: string; // 'all' or category id
  level?: EducationLevel | 'all';
  status?: AppStatus | 'all';
  onlyFavorites?: boolean;
}

export interface CategoryTabSummary {
  id: string;
  name: string;
  icon: CategoryIconKey;
  count: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function normalizeSearch(value: string): string {
  return value.trim().toLowerCase();
}

export function filterApps(
  apps: AppRecord[],
  options: AppFilterOptions = {},
): AppRecord[] {
  const query = normalizeSearch(options.searchQuery ?? '');
  const categoryId = options.categoryId ?? 'all';
  const level = options.level ?? 'all';
  const status = options.status ?? 'all';
  const onlyFavorites = options.onlyFavorites ?? false;

  return apps
    .filter((app) => {
      if (categoryId !== 'all' && app.categoryId !== categoryId) {
        return false;
      }
      if (level !== 'all' && app.level !== level) {
        return false;
      }
      if (status !== 'all' && app.status !== status) {
        return false;
      }
      if (onlyFavorites && !app.isFavorite) {
        return false;
      }
      if (query.length > 0) {
        const haystack = [
          app.title,
          app.description,
          app.badgeLabel,
          app.level,
          app.url,
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(query);
      }
      return true;
    })
    .slice()
    .sort((a, b) => a.order - b.order);
}

export type AppSortKey = 'order' | 'title' | 'visits' | 'recent';

export function sortApps(apps: AppRecord[], sortBy: AppSortKey): AppRecord[] {
  const copy = apps.slice();
  switch (sortBy) {
    case 'title':
      return copy.sort((a, b) => a.title.localeCompare(b.title, 'id'));
    case 'visits':
      return copy.sort((a, b) => b.visitCount - a.visitCount || a.order - b.order);
    case 'recent':
      return copy.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    case 'order':
    default:
      return copy.sort((a, b) => a.order - b.order);
  }
}

export function computeCategoryCounts(
  apps: AppRecord[],
  categories: CategoryRecord[],
): CategoryTabSummary[] {
  const countsByCategory = new Map<string, number>();
  for (const app of apps) {
    countsByCategory.set(
      app.categoryId,
      (countsByCategory.get(app.categoryId) ?? 0) + 1,
    );
  }

  const sortedCategories = categories.slice().sort((a, b) => a.order - b.order);

  return [
    {
      id: 'all',
      name: 'Semua',
      icon: 'grid',
      count: apps.length,
    },
    ...sortedCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      count: countsByCategory.get(cat.id) ?? 0,
    })),
  ];
}

export function isValidHttpUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateAppInput(
  input: Partial<CreateAppInput>,
  validCategoryIds?: string[],
): ValidationResult {
  const errors: Record<string, string> = {};

  const title = (input.title ?? '').trim();
  if (title.length < 2) {
    errors.title = 'Nama aplikasi minimal 2 karakter.';
  } else if (title.length > 60) {
    errors.title = 'Nama aplikasi maksimal 60 karakter.';
  }

  const description = (input.description ?? '').trim();
  if (description.length < 8) {
    errors.description = 'Deskripsi singkat minimal 8 karakter.';
  } else if (description.length > 160) {
    errors.description = 'Deskripsi singkat maksimal 160 karakter.';
  }

  const url = (input.url ?? '').trim();
  if (!isValidHttpUrl(url)) {
    errors.url = 'URL harus diawali http:// atau https:// yang valid.';
  }

  const categoryId = (input.categoryId ?? '').trim();
  if (!categoryId) {
    errors.categoryId = 'Pilih salah satu kategori.';
  } else if (validCategoryIds && !validCategoryIds.includes(categoryId)) {
    errors.categoryId = 'Kategori yang dipilih tidak ditemukan.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCategoryInput(name: string): ValidationResult {
  const errors: Record<string, string> = {};
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    errors.name = 'Nama kategori minimal 2 karakter.';
  } else if (trimmed.length > 35) {
    errors.name = 'Nama kategori maksimal 35 karakter.';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

const INDONESIAN_DAYS = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
];

const INDONESIAN_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

export function formatIndonesianDateTime(
  date: Date,
  timezone: TimezoneOption = 'WIT',
): { dateLabel: string; timeLabel: string } {
  const ianaZone =
    timezone === 'WIT'
      ? 'Asia/Jayapura'
      : timezone === 'WITA'
        ? 'Asia/Makassar'
        : 'Asia/Jakarta';

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: ianaZone,
    weekday: 'short',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const getPart = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? '';

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const dayIdx = weekdayMap[getPart('weekday')] ?? 0;
  const monthIdx = Math.max(0, Number(getPart('month')) - 1);
  const dayNum = Number(getPart('day'));
  const year = getPart('year');
  const hour = getPart('hour').padStart(2, '0');
  const minute = getPart('minute').padStart(2, '0');

  return {
    dateLabel: `${INDONESIAN_DAYS[dayIdx]}, ${dayNum} ${INDONESIAN_MONTHS[monthIdx]} ${year}`,
    timeLabel: `${hour}:${minute} ${timezone}`,
  };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
