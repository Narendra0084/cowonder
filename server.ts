import { createApp } from './server/src/app';
import { connectDB } from './server/src/config/db';
import { createServer as createViteServer } from 'vite';
import express from 'express';
import path from 'path';

async function startServer() {
  await connectDB();
  const app = createApp();
  const port = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[Wander Waves] Travel server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('[Wander Waves] Failed to start server:', err);
  process.exit(1);
});
