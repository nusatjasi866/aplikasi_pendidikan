import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeCategoryCounts,
  filterApps,
  formatIndonesianDateTime,
  sortApps,
  validateAppInput,
  validateCategoryInput,
  type AppRecord,
  type CategoryRecord,
} from './portalLogic';

const sampleCategories: CategoryRecord[] = [
  {
    id: 'pembelajaran',
    name: 'Pembelajaran',
    slug: 'pembelajaran',
    icon: 'grad-cap',
    color: 'blue',
    order: 1,
  },
  {
    id: 'data-verval',
    name: 'Data & Verval',
    slug: 'data-verval',
    icon: 'database',
    color: 'purple',
    order: 2,
  },
];

const sampleApps: AppRecord[] = [
  {
    id: 'app-1',
    title: 'Daftar Nilai SMP',
    description: 'Input dan kelola nilai siswa jenjang SMP',
    url: 'https://nilai.tanimbar.go.id/smp',
    categoryId: 'pembelajaran',
    badgeLabel: 'Pembelajaran',
    accentColor: 'blue',
    iconKey: 'clipboard-list',
    level: 'SMP',
    status: 'active',
    isFavorite: true,
    visitCount: 42,
    order: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  },
  {
    id: 'app-2',
    title: 'Dapodik',
    description: 'Data Pokok Pendidikan Satuan Pendidikan',
    url: 'https://dapo.kemdikbud.go.id',
    categoryId: 'data-verval',
    badgeLabel: 'Data & Verval',
    accentColor: 'blue',
    iconKey: 'dapodik-cube',
    level: 'Semua',
    status: 'maintenance',
    isFavorite: false,
    visitCount: 120,
    order: 2,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-05T00:00:00.000Z',
  },
];

test('filterApps filters by category, search query, level, status, and favorites', () => {
  assert.equal(filterApps(sampleApps, { categoryId: 'all' }).length, 2);
  assert.equal(
    filterApps(sampleApps, { categoryId: 'pembelajaran' }).map((a) => a.id)[0],
    'app-1',
  );
  assert.equal(
    filterApps(sampleApps, { searchQuery: 'dapodik' }).map((a) => a.id)[0],
    'app-2',
  );
  assert.equal(
    filterApps(sampleApps, { onlyFavorites: true }).map((a) => a.id)[0],
    'app-1',
  );
  assert.equal(
    filterApps(sampleApps, { status: 'maintenance' }).map((a) => a.id)[0],
    'app-2',
  );
});

test('computeCategoryCounts returns accurate total and per-category counts', () => {
  const tabs = computeCategoryCounts(sampleApps, sampleCategories);
  assert.equal(tabs.length, 3);
  assert.deepEqual(tabs[0], {
    id: 'all',
    name: 'Semua',
    icon: 'grid',
    count: 2,
  });
  assert.equal(tabs[1].count, 1);
  assert.equal(tabs[2].count, 1);
});

test('sortApps sorts by visits and title cleanly', () => {
  assert.equal(sortApps(sampleApps, 'visits')[0].id, 'app-2');
  assert.equal(sortApps(sampleApps, 'title')[0].id, 'app-1');
});

test('validateAppInput enforces required fields and http/https URLs', () => {
  const invalid = validateAppInput(
    {
      title: 'A',
      description: 'Short',
      url: 'ftp://bad.example.com',
      categoryId: 'unknown',
    },
    ['pembelajaran'],
  );
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.title);
  assert.ok(invalid.errors.description);
  assert.ok(invalid.errors.url);
  assert.ok(invalid.errors.categoryId);

  const valid = validateAppInput(
    {
      title: 'SiMenulis Tanimbar',
      description: 'Platform literasi digital peserta didik dan guru.',
      url: 'https://simenulis.tanimbar.go.id',
      categoryId: 'pembelajaran',
    },
    ['pembelajaran'],
  );
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});

test('validateCategoryInput rejects too short names', () => {
  assert.equal(validateCategoryInput('X').valid, false);
  assert.equal(validateCategoryInput('Kurikulum').valid, true);
});

test('formatIndonesianDateTime formats WIT (UTC+9) accurately', () => {
  // 2026-11-18T05:27:00Z = 14:27 WIT (UTC+9) on Wednesday (Rabu)
  const utcDate = new Date('2026-11-18T05:27:00.000Z');
  const formatted = formatIndonesianDateTime(utcDate, 'WIT');
  assert.equal(formatted.dateLabel, 'Rabu, 18 Nov 2026');
  assert.equal(formatted.timeLabel, '14:27 WIT');
});
