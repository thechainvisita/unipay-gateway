import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './database/db';
import authRoutes from './routes/auth';
import checkoutRoutes from './routes/checkout';
import dashboardRoutes from './routes/dashboard';
import purchasesRoutes from './routes/purchases';
import rewardsRoutes from './routes/rewards';

dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/purchases', purchasesRoutes);
app.use('/api/rewards', rewardsRoutes);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
try {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Database: SQLite`);
  }).on('error', (err: Error) => {
    console.error('❌ Server failed to start:', err.message);
    if ((err as any).code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please stop the other process or change the PORT in .env`);
    }
    process.exit(1);
  });
} catch (err) {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
}

// Graceful shutdown
process.on('SIGINT', () => {
  if (db && typeof db.close === 'function') {
    db.close((err: Error | null) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('✅ Database connection closed');
      }
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

