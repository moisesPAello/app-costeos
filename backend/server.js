const express = require('express');
const path = require('path');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const reportsRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de todas las peticiones
app.use((req, res, next) => {
  console.log(`\n${new Date().toLocaleTimeString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/reports', reportsRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Ruta no encontrada' 
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Error interno del servidor',
    message: err.message 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('\x1b[32m%s\x1b[0m', '╔════════════════════════════════════════════════════╗');
  console.log('\x1b[32m%s\x1b[0m', '║                                                    ║');
  console.log('\x1b[32m%s\x1b[0m', '║     ✅ Costeos & Ingeniería - Backend API         ║');
  console.log('\x1b[32m%s\x1b[0m', '║                                                    ║');
  console.log('\x1b[32m%s\x1b[0m', '╚════════════════════════════════════════════════════╝');
  console.log('\x1b[36m%s\x1b[0m', `\n🌐 Servidor: http://localhost:${PORT}`);
  console.log('\x1b[36m%s\x1b[0m', `📂 Frontend: ${path.join(__dirname, '../frontend')}`);
  console.log('\x1b[36m%s\x1b[0m', `⏰ Iniciado: ${new Date().toLocaleString('es-ES')}\n`);
  console.log('\x1b[33m%s\x1b[0m', '📡 Endpoints disponibles:');
  console.log('\x1b[90m%s\x1b[0m', '   POST /api/auth/login');
  console.log('\x1b[90m%s\x1b[0m', '   POST /api/auth/register');
  console.log('\x1b[90m%s\x1b[0m', '   POST /api/auth/logout');
  console.log('\x1b[90m%s\x1b[0m', '   POST /api/upload');
  console.log('\x1b[90m%s\x1b[0m', '   DELETE /api/upload/:filename');
  console.log('\x1b[90m%s\x1b[0m', '   POST /api/reports/generate');
  console.log('\x1b[90m%s\x1b[0m', '   POST /api/reports/summary');
  console.log('\x1b[90m%s\x1b[0m', '   POST /api/reports/charts\n');
  console.log('\x1b[32m%s\x1b[0m', '✨ Servidor listo para recibir peticiones\n');
});

module.exports = app;
