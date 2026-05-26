import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import http from 'http';
import path from 'path';

dotenv.config();

import authRoutes from './routes/auth';
import casesRoutes from './routes/cases';
import adminRoutes from './routes/admin';
import fieldRoutes from './routes/field';
import donationRoutes from './routes/donations';
import impactRoutes from './routes/impact';
import notificationRoutes from './routes/notifications';
import aiRoutes from './routes/ai';
import { sysLog } from './services/logger';

const app = express();
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('https://')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/cases', casesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/field', fieldRoutes);
app.use('/api/donate', donationRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: '✅ Kafaale Qaad API Online', timestamp: new Date().toISOString(), version: '2.0.0' });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  sysLog.error('Unhandled error', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

server.listen(PORT, () => {
  console.log(`🚀 Kafaale API running → http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 AI Assistant: http://localhost:${PORT}/api/ai/chat`);
});

export default app;
