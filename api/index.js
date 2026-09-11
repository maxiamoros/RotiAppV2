const express = require('express');
const cors = require('cors');
require('dotenv').config();

const chatRoutes = require('./routes/chat.routes');
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const uploadRoutes = require('./routes/upload.routes');
const configRoutes = require('./routes/config.routes');
const categoriasRoutes = require('./routes/categorias.routes');
const insumosRoutes = require('./routes/insumos.routes');
const productosRoutes = require('./routes/productos.routes');
const ventasRoutes = require('./routes/ventas.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de CORS amplia para Vercel
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint de verificación de salud y base de datos
app.get('/api/db-check', async (req, res) => {
  try {
    const prisma = require('./prisma');
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({
      status: 'ok',
      message: 'Conexión a la base de datos de Supabase exitosa',
      database_url_configured: !!process.env.DATABASE_URL
    });
  } catch (error) {
    console.error('Error en /api/db-check:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Fallo la conexión a la base de datos',
      error: error.message,
      database_url_configured: !!process.env.DATABASE_URL
    });
  }
});

// Configuración de Rutas de la API
app.use('/api/ia', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/config', configRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/insumos', insumosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/upload', uploadRoutes);

// Manejador 404 para endpoints de la API desconcidos
app.use('/api/(.*)', (req, res) => {
  return res.status(404).json({ error: `Ruta de API no encontrada: ${req.method} ${req.originalUrl}` });
});

// Middleware Global de Error - Asegura que NUNCA se devuelva HTML o respuestas vacías
app.use((err, req, res, next) => {
  console.error('Unhandled API Server Error:', err);
  if (res.headersSent) {
    return next(err);
  }
  return res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor en Vercel Serverless Function'
  });
});

// Exportación para Serverless Function de Vercel
module.exports = app;

// Servidor local si se ejecuta con node api/index.js
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`);
  });
}
