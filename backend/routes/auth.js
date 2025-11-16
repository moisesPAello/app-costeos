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
    console.log('\x1b[36m%s\x1b[0m', '🔐 Intento de login recibido');
    console.log('📦 Body recibido:', req.body);
    
    const { username, password } = req.body;

    // Validar entrada
    if (!username || !password) {
      console.log('\x1b[31m%s\x1b[0m', '❌ Faltan credenciales');
      return res.status(400).json({
        success: false,
        error: 'Usuario y contraseña son requeridos'
      });
    }

    // Leer usuarios desde JSON local
    const usersPath = path.join(__dirname, '../data/users.json');
    console.log('📂 Ruta de usuarios:', usersPath);
    
    if (!fs.existsSync(usersPath)) {
      console.log('\x1b[31m%s\x1b[0m', '❌ Archivo users.json no encontrado');
      return res.status(500).json({
        success: false,
        error: 'Base de datos de usuarios no encontrada'
      });
    }

    const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    console.log('👥 Usuarios cargados:', usersData.users.length);
    
    const user = usersData.users.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      console.log('\x1b[31m%s\x1b[0m', `❌ Usuario no encontrado o contraseña incorrecta: ${username}`);
      return res.status(401).json({
        success: false,
        error: 'Credenciales incorrectas'
      });
    }

    console.log('\x1b[32m%s\x1b[0m', `✅ Login exitoso: ${username}`);
    
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
    console.error('\x1b[31m%s\x1b[0m', '❌ Error en login:', error);
    res.status(500).json({
      success: false,
      error: 'Error al procesar login',
      message: error.message
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

/**
 * POST /api/auth/register
 * Registrar nuevo usuario
 */
router.post('/register', (req, res) => {
  try {
    console.log('\x1b[36m%s\x1b[0m', '📝 Intento de registro recibido');
    console.log('📦 Body recibido:', req.body);
    
    const { username, email, password } = req.body;

    // Validar entrada
    if (!username || !password) {
      console.log('\x1b[31m%s\x1b[0m', '❌ Faltan datos para registro');
      return res.status(400).json({
        success: false,
        error: 'Usuario y contraseña son requeridos'
      });
    }

    // Leer usuarios desde JSON local
    const usersPath = path.join(__dirname, '../data/users.json');
    
    if (!fs.existsSync(usersPath)) {
      console.log('\x1b[31m%s\x1b[0m', '❌ Archivo users.json no encontrado');
      return res.status(500).json({
        success: false,
        error: 'Base de datos de usuarios no encontrada'
      });
    }

    const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    
    // Verificar si el usuario ya existe
    const userExists = usersData.users.find(u => u.username === username);
    
    if (userExists) {
      console.log('\x1b[31m%s\x1b[0m', `❌ Usuario ya existe: ${username}`);
      return res.status(409).json({
        success: false,
        error: 'El usuario ya existe'
      });
    }

    // Crear nuevo usuario
    const newUser = {
      id: usersData.users.length + 1,
      username: username,
      password: password, // En producción, esto debería estar hasheado
      email: email || '',
      role: 'user'
    };

    usersData.users.push(newUser);

    // Guardar en el archivo
    fs.writeFileSync(usersPath, JSON.stringify(usersData, null, 2), 'utf8');

    console.log('\x1b[32m%s\x1b[0m', `✅ Usuario registrado exitosamente: ${username}`);

    // Registro exitoso
    res.json({
      success: true,
      data: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role
      },
      message: 'Usuario registrado exitosamente'
    });

  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error en registro:', error);
    res.status(500).json({
      success: false,
      error: 'Error al procesar registro',
      message: error.message
    });
  }
});

module.exports = router;
