import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import pool from './config/db';

import authRoutes from './routes/auth.routes';
import propertyRoutes from './routes/property.routes';
import bookingRoutes from './routes/booking.routes';
import adminRoutes from './routes/admin.routes';
import chatbotRoutes from './routes/chatbot.routes';
import { checkAIConnection } from './controllers/chatbot.controller';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:4200', 'https://houserental-theta.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:4200', 'https://houserental-theta.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.set('io', io);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-tenant', (tenantId) => {
    socket.join(`tenant-${tenantId}`);
    console.log(`Tenant ${tenantId} joined room`);
  });

  socket.on('join-owner', (ownerId) => {
    socket.join(`owner-${ownerId}`);
    console.log(`Owner ${ownerId} joined room`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  let dbMessage = '';
  
  try {
    const conn = await pool.getConnection();
    dbStatus = 'connected';
    dbMessage = 'MySQL database is connected';
    conn.release();
  } catch (err: any) {
    dbMessage = err.message;
  }

  res.json({
    status: 'ok',
    message: 'House Rental API is running',
    server: {
      port: PORT,
      uptime: process.uptime().toFixed(2) + ' seconds'
    },
    database: {
      status: dbStatus,
      message: dbMessage,
      name: process.env.DB_NAME || 'house_rental'
    },
    websocket: {
      status: 'active',
      message: 'Socket.io enabled for real-time updates'
    },
    endpoints: {
      auth: ['POST /api/auth/register', 'POST /api/auth/login'],
      properties: ['GET /api/properties', 'POST /api/properties', 'GET /api/properties/:id'],
      bookings: ['POST /api/bookings', 'GET /api/bookings/tenant/:id', 'GET /api/bookings/owner/:id'],
      admin: ['GET /api/admin/users', 'GET /api/admin/stats', 'GET /api/admin/properties']
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chatbot', chatbotRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

httpServer.listen(PORT, async () => {
  console.log('\n========================================');
  console.log('   HOUSE RENTAL API SERVER');
  console.log('========================================\n');
  console.log(`Server running on: http://localhost:${PORT}`);
  console.log(`WebSocket enabled: http://localhost:${PORT}`);
  console.log(`\nAPI Health Check: http://localhost:${PORT}/api/health`);
  console.log('\n----------------------------------------');
  console.log('API Endpoints:');
  console.log('----------------------------------------');
  console.log('Auth:       POST /api/auth/register');
  console.log('            POST /api/auth/login');
  console.log('Properties: GET  /api/properties');
  console.log('            POST /api/properties');
  console.log('Bookings:   POST /api/bookings');
  console.log('            GET  /api/bookings/tenant/:id');
  console.log('            GET  /api/bookings/owner/:id');
  console.log('Admin:      GET  /api/admin/users');
  console.log('            GET  /api/admin/stats');
  console.log('Chatbot:    POST /api/chatbot/chat');
  console.log('            GET  /api/chatbot/stats');
  console.log('----------------------------------------\n');
  
  await checkAIConnection();
});

export { io };
