document.addEventListener('DOMContentLoaded', () => {
    // Verificar sesión
    checkSession();

    // Actualizar año en footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Mostrar usuario
    displayUserInfo();

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Calculadora rápida
    const quickCalcForm = document.getElementById('quickCalc');
    if (quickCalcForm) {
        quickCalcForm.addEventListener('submit', handleQuickCalc);
    }
});

function checkSession() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }
}

function displayUserInfo() {
    const currentUser = localStorage.getItem('currentUser');
    const userDisplay = document.getElementById('userDisplay');
    
    if (currentUser && userDisplay) {
        const user = JSON.parse(currentUser);
        userDisplay.textContent = `Hola, ${user.name}`;
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberUser');
    window.location.href = 'login.html';
}

function handleQuickCalc(e) {
    e.preventDefault();

    const quantity = parseFloat(document.getElementById('quantity').value);
    const unitCost = parseFloat(document.getElementById('unitCost').value);
    const fixedCosts = parseFloat(document.getElementById('fixedCosts').value);

    const totalCost = (quantity * unitCost) + fixedCosts;
    const costPerUnit = totalCost / quantity;

    document.getElementById('totalCost').textContent = '€ ' + totalCost.toFixed(2);
    document.getElementById('costPerUnit').textContent = '€ ' + costPerUnit.toFixed(2);
    document.getElementById('results').removeAttribute('hidden');
}