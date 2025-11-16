// Inicialización general de la app

document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    checkUserAuthentication();

    // Año en footer
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Cargar preferencias guardadas
    loadAppPreferences();

    // User display
    const userDisplay = document.getElementById('userDisplay');
    if (userDisplay) {
        const currentUser = localStorage.getItem('currentUser');
        const isGuest = localStorage.getItem('isGuest') === 'true';
        
        if (currentUser) {
            try {
                const user = JSON.parse(currentUser);
                const username = user.username || user.name || 'Usuario';
                
                if (isGuest) {
                    userDisplay.textContent = `👤 ${username}`;
                    userDisplay.style.opacity = '0.6';
                } else {
                    userDisplay.textContent = `👤 ${username}`;
                }
            } catch (error) {
                // Fallback para usuarios guardados como string
                if (isGuest) {
                    userDisplay.textContent = `👤 ${currentUser}`;
                    userDisplay.style.opacity = '0.6';
                } else {
                    userDisplay.textContent = `👤 ${currentUser}`;
                }
            }
        }
    }

    // Logout button mejorado
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Quick calculator en index.html
    const quickCalcForm = document.getElementById('quickCalc');
    if (quickCalcForm) {
        quickCalcForm.addEventListener('submit', handleQuickCalculate);
    }
});

async function handleLogout() {
    const confirmed = await ConfirmationDialog.show({
        title: 'Cerrar Sesión',
        message: '¿Estás seguro de que deseas cerrar sesión? Se perderá tu acceso a las funciones restringidas.',
        icon: '👋',
        confirmText: 'Cerrar Sesión',
        cancelText: 'Cancelar',
        isDangerous: true
    });

    if (confirmed) {
        notify.info('Cerrando sesión...', 'Redirigiendo al login');
        
        setTimeout(() => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isGuest');
            localStorage.removeItem('loginTime');
            localStorage.removeItem('rememberUser');
            
            window.location.href = 'login.html';
        }, 800);
    }
}

function checkUserAuthentication() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const isGuest = localStorage.getItem('isGuest') === 'true';
    const currentPage = window.location.pathname;

    // Páginas que requieren autenticación completa (no permite invitados)
    const restrictedPages = ['historial.html', 'analizar.html', 'configuracion.html'];
    const isRestricted = restrictedPages.some(page => currentPage.includes(page));

    // Si es invitado y está en una página restringida
    if (isGuest && isRestricted) {
        showGuestRestrictionWarning();
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
        return;
    }

    // Si no está logeado y está en página restringida
    if (!isLoggedIn && isRestricted) {
        window.location.href = 'login.html';
        return;
    }
}

function showGuestRestrictionWarning() {
    const overlay = document.createElement('div');
    overlay.className = 'restricted-overlay';
    overlay.innerHTML = `
        <div class="restricted-modal">
            <h2>🔒 Acceso Restringido</h2>
            <p>Esta sección solo está disponible para usuarios registrados.</p>
            <p>Por favor, crea una cuenta o inicia sesión para continuar.</p>
            <button class="btn" onclick="window.location.href='login.html'">Ir a Login</button>
        </div>
    `;
    document.body.appendChild(overlay);
}

function loadAppPreferences() {
    const settings = JSON.parse(localStorage.getItem('appSettings')) || {};

    // Aplicar tamaño de fuente si existe
    if (settings.fontSize) {
        const fontSizes = {
            'small': '14px',
            'normal': '16px',
            'large': '18px'
        };
        document.body.style.fontSize = fontSizes[settings.fontSize] || '16px';
    }
}

function handleQuickCalculate(e) {
    e.preventDefault();

    const quantity = parseFloat(document.getElementById('quantity').value);
    const unitCost = parseFloat(document.getElementById('unitCost').value);
    const fixedCosts = parseFloat(document.getElementById('fixedCosts').value);

    // Validar datos
    if (!quantity || !unitCost || fixedCosts === undefined) {
        notify.warning('Datos Incompletos', 'Por favor completa todos los campos');
        return;
    }

    // Cálculos
    const totalCost = (unitCost * quantity) + fixedCosts;
    const costPerUnit = totalCost / quantity;

    // Mostrar resultados
    document.getElementById('totalCost').textContent = totalCost.toFixed(2);
    document.getElementById('costPerUnit').textContent = costPerUnit.toFixed(2);

    document.getElementById('results').removeAttribute('hidden');
    notify.success('Cálculo Completado', 'Los resultados se muestran abajo');
}
