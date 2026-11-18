import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import {
  createApp,
  createCategory,
  deleteApp,
  deleteCategory,
  getPortalState,
  incrementAppVisit,
  NotFoundError,
  resetPortalToSeed,
  toggleAppFavorite,
  updateApp,
  updateCategory,
  updateSettings,
  ValidationError,
} from './server/store';

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
  });

  app.get('/api/portal', (_req, res) => {
    res.json(getPortalState());
  });

  app.post('/api/apps', (req, res, next) => {
    try {
      const created = createApp(req.body ?? {});
      res.status(201).json({ app: created, state: getPortalState() });
    } catch (err) {
      next(err);
    }
  });

  app.put('/api/apps/:id', (req, res, next) => {
    try {
      const updated = updateApp(req.params.id, req.body ?? {});
      res.json({ app: updated, state: getPortalState() });
    } catch (err) {
      next(err);
    }
  });

  app.delete('/api/apps/:id', (req, res, next) => {
    try {
      deleteApp(req.params.id);
      res.json({ ok: true, state: getPortalState() });
    } catch (err) {
      next(err);
    }
  });

  app.post('/api/apps/:id/visit', (req, res, next) => {
    try {
      const updated = incrementAppVisit(req.params.id);
      res.json({ app: updated, state: getPortalState() });
    } catch (err) {
      next(err);
    }
  });

  app.post('/api/apps/:id/favorite', (req, res, next) => {
    try {
      const updated = toggleAppFavorite(req.params.id);
      res.json({ app: updated, state: getPortalState() });
    } catch (err) {
      next(err);
    }
  });

  app.post('/api/categories', (req, res, next) => {
    try {
      const created = createCategory(req.body ?? {});
      res.status(201).json({ category: created, state: getPortalState() });
    } catch (err) {
      next(err);
    }
  });

  app.put('/api/categories/:id', (req, res, next) => {
    try {
      const updated = updateCategory(req.params.id, req.body ?? {});
      res.json({ category: updated, state: getPortalState() });
    } catch (err) {
      next(err);
    }
  });

  app.delete('/api/categories/:id', (req, res, next) => {
    try {
      deleteCategory(req.params.id);
      res.json({ ok: true, state: getPortalState() });
    } catch (err) {
      next(err);
    }
  });

  app.put('/api/settings', (req, res, next) => {
    try {
      const settings = updateSettings(req.body ?? {});
      res.json({ settings, state: getPortalState() });
    } catch (err) {
      next(err);
    }
  });

  app.post('/api/reset', (_req, res, next) => {
    try {
      const state = resetPortalToSeed();
      res.json({ state });
    } catch (err) {
      next(err);
    }
  });

  // Error handler for API routes
  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      if (err instanceof ValidationError) {
        res.status(400).json({ message: err.message, errors: err.errors });
        return;
      }
      if (err instanceof NotFoundError) {
        res.status(404).json({ message: err.message });
        return;
      }
      console.error('Server error:', err);
      res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    },
  );

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portal Aplikasi Pendidikan Tanimbar running on port ${PORT}`);
  });
}

startServer();
