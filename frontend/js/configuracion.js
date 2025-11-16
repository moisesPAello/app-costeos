document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    setupEventListeners();
});

function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.config-tab').forEach(tab => {
        tab.addEventListener('click', switchTab);
    });

    // Account
    document.getElementById('saveUsername').addEventListener('click', saveUsername);
    document.getElementById('saveEmail').addEventListener('click', saveEmail);
    document.getElementById('changePassword').addEventListener('click', changePassword);

    // Preferences
    document.getElementById('savePreferences').addEventListener('click', saveAllPreferences);
    document.getElementById('resetPreferences').addEventListener('click', resetPreferences);

    // Data
    document.getElementById('exportData').addEventListener('click', exportAllData);
    document.getElementById('importData').addEventListener('click', importData);
    document.getElementById('clearCache').addEventListener('click', clearCache);
    document.getElementById('deleteAllData').addEventListener('click', deleteAllData);
}

function switchTab(e) {
    const tabName = e.target.getAttribute('data-tab');
    
    // Remove active from all tabs and sections
    document.querySelectorAll('.config-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.config-section').forEach(section => section.classList.remove('active'));
    
    // Add active to selected tab and section
    e.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('appSettings')) || {};

    // Account
    if (settings.username) {
        document.getElementById('username').value = settings.username;
    }
    if (settings.email) {
        document.getElementById('email').value = settings.email;
    }

    // Preferences
    if (settings.defaultCurrency) {
        document.getElementById('defaultCurrency').value = settings.defaultCurrency;
    }
    if (settings.defaultMargin) {
        document.getElementById('defaultMargin').value = settings.defaultMargin;
    }
    if (settings.notifications) {
        document.getElementById('notifEmail').checked = settings.notifications.email;
        document.getElementById('notifBrowser').checked = settings.notifications.browser;
        document.getElementById('notifDaily').checked = settings.notifications.daily;
    }
    if (settings.language) {
        document.getElementById('language').value = settings.language;
    }
}

function saveUsername() {
    const username = document.getElementById('username').value.trim();
    if (!username) {
        alert('Por favor ingresa un nombre de usuario');
        return;
    }
    updateSetting('username', username);
    document.getElementById('userDisplay').textContent = username;
    alert('✓ Nombre de usuario guardado');
}

function saveEmail() {
    const email = document.getElementById('email').value.trim();
    if (!email || !email.includes('@')) {
        alert('Por favor ingresa un email válido');
        return;
    }
    updateSetting('email', email);
    alert('✓ Email guardado');
}

function changePassword() {
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;

    if (!current || !newPass || !confirm) {
        alert('Por favor completa todos los campos');
        return;
    }

    if (newPass !== confirm) {
        alert('Las contraseñas no coinciden');
        return;
    }

    if (newPass.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres');
        return;
    }

    updateSetting('password', newPass);
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    alert('✓ Contraseña cambiada exitosamente');
}

function saveAllPreferences() {
    const preferences = {
        defaultCurrency: document.getElementById('defaultCurrency').value,
        defaultMargin: parseFloat(document.getElementById('defaultMargin').value),
        notifications: {
            email: document.getElementById('notifEmail').checked,
            browser: document.getElementById('notifBrowser').checked,
            daily: document.getElementById('notifDaily').checked
        },
        language: document.getElementById('language').value
    };

    Object.entries(preferences).forEach(([key, value]) => {
        updateSetting(key, value);
    });

    alert('✓ Todas las preferencias han sido guardadas correctamente');
}

function resetPreferences() {
    if (confirm('¿Estás seguro de que deseas restablecer las preferencias predeterminadas?')) {
        document.getElementById('defaultCurrency').value = 'EUR';
        document.getElementById('defaultMargin').value = '20';
        document.getElementById('notifEmail').checked = true;
        document.getElementById('notifBrowser').checked = true;
        document.getElementById('notifDaily').checked = false;
        document.getElementById('language').value = 'es';
        saveAllPreferences();
    }
}

function exportAllData() {
    const data = {
        settings: JSON.parse(localStorage.getItem('appSettings')) || {},
        calculations: JSON.parse(localStorage.getItem('calculations')) || [],
        timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `datos-${new Date().toISOString().split('T')[0]}.json`);
    link.click();

    alert('✓ Datos exportados correctamente');
}

function importData() {
    const file = document.getElementById('importFile').files[0];
    if (!file) {
        alert('Por favor selecciona un archivo');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.settings) {
                localStorage.setItem('appSettings', JSON.stringify(data.settings));
            }
            if (data.calculations) {
                localStorage.setItem('calculations', JSON.stringify(data.calculations));
            }

            alert('✓ Datos importados correctamente. Recargando página...');
            setTimeout(() => location.reload(), 500);
        } catch (error) {
            alert('Error al importar datos. Asegúrate que el archivo es válido.');
        }
    };
    reader.readAsText(file);
}

function clearCache() {
    if (confirm('¿Estás seguro de que deseas limpiar el caché?')) {
        localStorage.clear();
        sessionStorage.clear();
        alert('✓ Caché limpiado. Recargando página...');
        setTimeout(() => location.reload(), 500);
    }
}

function deleteAllData() {
    if (confirm('⚠️ ¿Estás SEGURO de que deseas eliminar TODOS los datos? Esta acción NO se puede deshacer.')) {
        if (confirm('Última confirmación: ¿Eliminar TODO?')) {
            localStorage.clear();
            sessionStorage.clear();
            alert('✓ Todos los datos han sido eliminados');
            location.href = 'index.html';
        }
    }
}

function updateSetting(key, value) {
    const settings = JSON.parse(localStorage.getItem('appSettings')) || {};
    settings[key] = value;
    localStorage.setItem('appSettings', JSON.stringify(settings));
}
