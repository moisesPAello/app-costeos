// Usuarios demo iniciales
const INITIAL_DEMO_USERS = {
    'admin': 'admin123',
    'usuario': 'password123',
    'demo': 'demo'
};

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar usuarios si no existen
    initializeUsers();
    checkAuthentication();
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    document.getElementById('switchToRegister').addEventListener('click', switchToRegister);
    document.getElementById('switchToLogin').addEventListener('click', switchToLogin);

    const demoBtn = document.getElementById('demoLogin');
    if (demoBtn) {
        demoBtn.addEventListener('click', loginAsGuest);
    }

    document.getElementById('regUsername').addEventListener('change', checkUsernameAvailability);

    restoreRememberedUser();
});

function initializeUsers() {
    const users = localStorage.getItem('registeredUsers');
    if (!users) {
        const INITIAL_DEMO_USERS = {
            'admin': 'admin123',
            'usuario': 'password123',
            'demo': 'demo'
        };
        localStorage.setItem('registeredUsers', JSON.stringify(INITIAL_DEMO_USERS));
    }
}

async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const remember = document.getElementById('rememberMe').checked;

    // Validar campos
    if (!username || !password) {
        notify.error('Campos Vacíos', 'Por favor completa todos los campos');
        return;
    }

    // Intentar login con el backend
    try {
        notify.info('Verificando...', 'Autenticando credenciales');
        
        // Verificar si el backend está disponible
        const backendAvailable = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        }).then(res => res.json()).catch(() => null);

        if (backendAvailable && backendAvailable.success) {
            // Login exitoso con backend
            const userData = {
                id: backendAvailable.data.id,
                username: backendAvailable.data.username,
                role: backendAvailable.data.role
            };
            
            loginUser(userData, false, remember);
        } else if (backendAvailable && !backendAvailable.success) {
            // Backend respondió pero credenciales incorrectas
            notify.error('Error de Autenticación', backendAvailable.error || 'Credenciales incorrectas');
            document.getElementById('loginPassword').value = '';
        } else {
            // Backend no disponible, usar localStorage (fallback)
            console.warn('Backend no disponible, usando autenticación local');
            const users = JSON.parse(localStorage.getItem('registeredUsers')) || {};
            
            if (users[username] && users[username] === password) {
                const userData = {
                    id: Date.now(),
                    username: username,
                    role: 'user'
                };
                loginUser(userData, false, remember);
            } else {
                notify.error('Error de Autenticación', 'Usuario o contraseña incorrectos');
                document.getElementById('loginPassword').value = '';
            }
        }
    } catch (error) {
        console.error('Error en login:', error);
        
        // Fallback a localStorage si hay error
        const users = JSON.parse(localStorage.getItem('registeredUsers')) || {};
        
        if (users[username] && users[username] === password) {
            notify.warning('Modo Sin Conexión', 'Iniciando sesión localmente');
            const userData = {
                id: Date.now(),
                username: username,
                role: 'user'
            };
            loginUser(userData, false, remember);
        } else {
            notify.error('Error de Conexión', 'No se pudo conectar con el servidor y las credenciales locales son incorrectas');
            document.getElementById('loginPassword').value = '';
        }
    }
}

async function handleRegister(e) {
    e.preventDefault();

    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    // Validaciones
    if (username.length < 3) {
        notify.error('Usuario Muy Corto', 'El usuario debe tener al menos 3 caracteres');
        return;
    }

    if (password.length < 6) {
        notify.error('Contraseña Débil', 'La contraseña debe tener al menos 6 caracteres');
        return;
    }

    if (password !== confirmPassword) {
        notify.error('Contraseñas No Coinciden', 'Las contraseñas ingresadas son diferentes');
        return;
    }

    // Verificar en localStorage primero
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || {};

    if (users[username]) {
        notify.error('Usuario Existente', 'Este usuario ya está registrado localmente');
        return;
    }

    try {
        // Intentar registrar en backend primero
        const backendResponse = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        }).then(res => res.json()).catch(() => null);

        if (backendResponse && backendResponse.success) {
            // Registro exitoso en backend, también guardar en localStorage
            users[username] = password;
            localStorage.setItem('registeredUsers', JSON.stringify(users));

            const emails = JSON.parse(localStorage.getItem('userEmails')) || {};
            emails[username] = email;
            localStorage.setItem('userEmails', JSON.stringify(emails));

            notify.success('¡Cuenta Creada!', 'Tu cuenta ha sido creada exitosamente en el servidor. Iniciando sesión...');
            
            setTimeout(() => {
                const userData = {
                    id: backendResponse.data.id,
                    username: backendResponse.data.username,
                    role: backendResponse.data.role
                };
                loginUser(userData, false, true);
            }, 1200);
        } else if (backendResponse && !backendResponse.success) {
            // Backend respondió con error
            notify.error('Error de Registro', backendResponse.error || 'No se pudo crear la cuenta');
        } else {
            // Backend no disponible, registrar solo en localStorage
            console.warn('Backend no disponible, registrando solo localmente');
            
            users[username] = password;
            localStorage.setItem('registeredUsers', JSON.stringify(users));

            const emails = JSON.parse(localStorage.getItem('userEmails')) || {};
            emails[username] = email;
            localStorage.setItem('userEmails', JSON.stringify(emails));

            notify.warning('Cuenta Creada Localmente', 'Tu cuenta se sincronizará cuando el servidor esté disponible. Iniciando sesión...');
            
            setTimeout(() => {
                const userData = {
                    id: Date.now(),
                    username: username,
                    role: 'user'
                };
                loginUser(userData, false, true);
            }, 1200);
        }
    } catch (error) {
        console.error('Error en registro:', error);
        
        // Fallback a localStorage
        users[username] = password;
        localStorage.setItem('registeredUsers', JSON.stringify(users));

        const emails = JSON.parse(localStorage.getItem('userEmails')) || {};
        emails[username] = email;
        localStorage.setItem('userEmails', JSON.stringify(emails));

        notify.warning('Cuenta Creada Localmente', 'Registro guardado localmente. Iniciando sesión...');
        
        setTimeout(() => {
            const userData = {
                id: Date.now(),
                username: username,
                role: 'user'
            };
            loginUser(userData, false, true);
        }, 1200);
    }
}

function loginUser(userData, isGuest = false, remember = false) {
    // Guardar sesión
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('isGuest', isGuest);
    localStorage.setItem('loginTime', new Date().toISOString());

    // Recordar usuario
    if (remember) {
        localStorage.setItem('rememberUser', typeof userData === 'string' ? userData : userData.username);
    } else {
        localStorage.removeItem('rememberUser');
    }

    const username = typeof userData === 'string' ? userData : userData.username;

    if (isGuest) {
        notify.success('Acceso como Invitado', 'Ten en cuenta que algunas funciones están limitadas');
    } else {
        notify.success('¡Bienvenido!', `Iniciando sesión como ${username}`);
    }
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function loginAsGuest() {
    const guestData = {
        id: Date.now(),
        username: `Invitado_${Date.now()}`,
        role: 'guest'
    };
    loginUser(guestData, true, false);
}

function switchToRegister() {
    document.getElementById('loginFormContainer').setAttribute('hidden', '');
    document.getElementById('registerFormContainer').removeAttribute('hidden');
    document.getElementById('registerMessage').setAttribute('hidden', '');
}

function switchToLogin() {
    document.getElementById('registerFormContainer').setAttribute('hidden', '');
    document.getElementById('loginFormContainer').removeAttribute('hidden');
    document.getElementById('loginMessage').setAttribute('hidden', '');
}

function checkUsernameAvailability() {
    const username = document.getElementById('regUsername').value.trim();
    const helpText = document.getElementById('usernameHelp');
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || {};

    if (!username) {
        helpText.textContent = '';
        helpText.classList.remove('error');
        return;
    }

    if (username.length < 3) {
        helpText.textContent = 'Mínimo 3 caracteres';
        helpText.classList.add('error');
        return;
    }

    if (users[username]) {
        helpText.textContent = 'Este usuario ya está registrado';
        helpText.classList.add('error');
    } else {
        helpText.textContent = '✓ Usuario disponible';
        helpText.classList.remove('error');
    }
}

function restoreRememberedUser() {
    const rememberedUser = localStorage.getItem('rememberUser');
    if (rememberedUser) {
        document.getElementById('loginUsername').value = rememberedUser;
        document.getElementById('rememberMe').checked = true;
    }
}

function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    // Si está en la página de login y está logeado, redirigir
    if (isLoggedIn && window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
    }
}

// Función para logout (se llama desde otras páginas)
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isGuest');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('rememberUser');
    notify.info('Sesión Cerrada', 'Has cerrado sesión correctamente');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 800);
}