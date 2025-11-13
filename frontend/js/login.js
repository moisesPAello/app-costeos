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

function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const remember = document.getElementById('rememberMe').checked;

    // Validar campos
    if (!username || !password) {
        notify.error('Campos Vacíos', 'Por favor completa todos los campos');
        return;
    }

    const users = JSON.parse(localStorage.getItem('registeredUsers')) || {};

    // Validar credenciales
    if (users[username] && users[username] === password) {
        loginUser(username, false, remember);
    } else {
        notify.error('Credenciales Inválidas', 'Usuario o contraseña incorrectos');
        document.getElementById('loginPassword').value = '';
    }
}

function handleRegister(e) {
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

    const users = JSON.parse(localStorage.getItem('registeredUsers')) || {};

    if (users[username]) {
        notify.error('Usuario Existente', 'Este usuario ya está registrado');
        return;
    }

    // Registrar nuevo usuario
    users[username] = password;
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    // Guardar email
    const emails = JSON.parse(localStorage.getItem('userEmails')) || {};
    emails[username] = email;
    localStorage.setItem('userEmails', JSON.stringify(emails));

    notify.success('¡Cuenta Creada!', 'Tu cuenta ha sido creada exitosamente. Iniciando sesión...');
    
    setTimeout(() => {
        loginUser(username, false, true);
    }, 1200);
}

function loginUser(username, isGuest = false, remember = false) {
    // Guardar sesión
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', username);
    localStorage.setItem('isGuest', isGuest);
    localStorage.setItem('loginTime', new Date().toISOString());

    // Recordar usuario
    if (remember) {
        localStorage.setItem('rememberUser', username);
    } else {
        localStorage.removeItem('rememberUser');
    }

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
    const guestName = `Invitado_${Date.now()}`;
    loginUser(guestName, true, false);
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
    window.location.href = 'login.html';
}