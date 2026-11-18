import type {
  AccentColor,
  AppRecord,
  CategoryIconKey,
  CategoryRecord,
  CreateAppInput,
  PortalSettings,
  PortalState,
  UpdateAppInput,
} from '../shared/portalLogic';

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string>;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

async function requestJson<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(
      data.message || 'Permintaan ke server gagal.',
      res.status,
      data.errors,
    );
  }
  return data as T;
}

export const portalApi = {
  getPortalState(): Promise<PortalState> {
    return requestJson<PortalState>('/api/portal');
  },

  createApp(input: CreateAppInput): Promise<{ app: AppRecord; state: PortalState }> {
    return requestJson('/api/apps', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  updateApp(
    id: string,
    input: UpdateAppInput,
  ): Promise<{ app: AppRecord; state: PortalState }> {
    return requestJson(`/api/apps/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },

  deleteApp(id: string): Promise<{ ok: boolean; state: PortalState }> {
    return requestJson(`/api/apps/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  recordVisit(id: string): Promise<{ app: AppRecord; state: PortalState }> {
    return requestJson(`/api/apps/${encodeURIComponent(id)}/visit`, {
      method: 'POST',
    });
  },

  toggleFavorite(id: string): Promise<{ app: AppRecord; state: PortalState }> {
    return requestJson(`/api/apps/${encodeURIComponent(id)}/favorite`, {
      method: 'POST',
    });
  },

  createCategory(input: {
    name: string;
    icon: CategoryIconKey;
    color: AccentColor;
  }): Promise<{ category: CategoryRecord; state: PortalState }> {
    return requestJson('/api/categories', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  updateCategory(
    id: string,
    input: { name?: string; icon?: CategoryIconKey; color?: AccentColor },
  ): Promise<{ category: CategoryRecord; state: PortalState }> {
    return requestJson(`/api/categories/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },

  deleteCategory(id: string): Promise<{ ok: boolean; state: PortalState }> {
    return requestJson(`/api/categories/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  updateSettings(
    input: Partial<PortalSettings>,
  ): Promise<{ settings: PortalSettings; state: PortalState }> {
    return requestJson('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },

  resetSeed(): Promise<{ state: PortalState }> {
    return requestJson('/api/reset', { method: 'POST' });
  },
};
