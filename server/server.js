const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const leadsRouter = require('./routes/leads');
const adminRouter = require('./routes/admin');
const contentRouter = require('./routes/content');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS for Vite frontend and Vercel production origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'https://inexserv.vercel.app'];

const corsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      allowedOrigins.includes('*') ||
      origin.endsWith('.vercel.app') ||
      origin.includes('localhost')
    ) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy violation: Origin '${origin}' is not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Standard Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: { status: 'API Server is healthy', timestamp: new Date().toISOString() }
  });
});

// Mount Routes
app.use('/api/content', contentRouter);
app.use('/api/auth', authRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/admin', adminRouter);

// Handle 404 Route Not Found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route '${req.originalUrl}' not found`
  });
});

// Central 4-argument Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);

  const statusCode = err.statusCode || err.status || 500;
  const errorMessage = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    error: errorMessage
  });
});

if (process.env.NODE_ENV !== 'production' || !module.parent) {
  app.listen(PORT, () => {
    console.log(`🚀 CRM Backend Server running on http://localhost:${PORT}`);
    console.log(`🔒 Allowed CORS Origins: ${allowedOrigins.join(', ')}`);
  });
}

module.exports = app;
