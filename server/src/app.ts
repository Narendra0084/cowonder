import express, { Express } from 'express';
import apiRoutes from './routes/api.routes';

export const createApp = (): Express => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Mount API router
  app.use('/api', apiRoutes);

  // Health check route
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'Co Wonder Travel Agency API',
    });
  });

  return app;
};
