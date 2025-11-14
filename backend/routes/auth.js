const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

/**
 * POST /api/auth/login
 * Autenticación básica de usuario
 */
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar entrada
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Usuario y contraseña son requeridos'
      });
    }

    // Leer usuarios desde JSON local
    const usersPath = path.join(__dirname, '../data/users.json');
    
    if (!fs.existsSync(usersPath)) {
      return res.status(500).json({
        success: false,
        error: 'Base de datos de usuarios no encontrada'
      });
    }

    const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    const user = usersData.users.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales incorrectas'
      });
    }

    // Login exitoso (sin JWT para simplicidad académica)
    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        role: user.role
      },
      message: 'Login exitoso'
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: 'Error al procesar login'
    });
  }
});

/**
 * POST /api/auth/logout
 * Cerrar sesión (placeholder para consistencia)
 */
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Sesión cerrada exitosamente'
  });
});

module.exports = router;
