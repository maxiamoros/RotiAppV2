const express = require('express');
const { login, logout } = require('../controllers/auth.controller');

const router = express.Router();

// Acepta /login, /auth/login y /api/auth/login para ser resiliente ante cualquier reescritura de Vercel
router.post(['/login', '/auth/login', '/api/auth/login'], login);
router.post(['/logout', '/auth/logout', '/api/auth/logout'], logout);

module.exports = router;
