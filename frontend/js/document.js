document.addEventListener('DOMContentLoaded', () => {
    const calcForm = document.getElementById('calcForm');
    
    if (calcForm) {
        calcForm.addEventListener('submit', handleCalculate);
    }

    const saveBtn = document.getElementById('savecalcBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveCalculation);
    }

    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportCalculation);
    }

    // Quick number buttons
    const quickBtns = document.querySelectorAll('.quick-btn');
    quickBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const value = btn.getAttribute('data-value');
            document.getElementById('quantity').value = value;
            document.getElementById('quantity').focus();
        });
    });

    // Update currency symbol when changed
    const currencySelect = document.getElementById('currencySelect');
    if (currencySelect) {
        currencySelect.addEventListener('change', updateCurrencyDisplay);
    }

    // Logout button mejorado
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

function getCurrencySymbol(currency) {
    const symbols = {
        'EUR': '€',
        'USD': '$',
        'MXN': '$',
        'ARS': '$',
        'COP': '$',
        'GBP': '£',
        'JPY': '¥'
    };
    return symbols[currency] || currency;
}

function updateCurrencyDisplay() {
    // Esta función se puede usar para actualizar etiquetas si lo deseas
}

function handleCalculate(e) {
    e.preventDefault();

    const projectName = document.getElementById('projectName').value;
    const description = document.getElementById('description').value;
    const currency = document.getElementById('currencySelect').value;
    const currencySymbol = getCurrencySymbol(currency);
    const quantity = parseFloat(document.getElementById('quantity').value);
    const unitCost = parseFloat(document.getElementById('unitCost').value);
    const fixedCosts = parseFloat(document.getElementById('fixedCosts').value);
    const variableCosts = parseFloat(document.getElementById('variableCosts').value);
    const profitMargin = parseFloat(document.getElementById('profitMargin').value);

    // Cálculos
    const totalVariableCosts = variableCosts * quantity;
    const totalProductionCost = fixedCosts + totalVariableCosts;
    const costPerUnit = totalProductionCost / quantity;
    const profitPerUnit = costPerUnit * (profitMargin / 100);
    const salePrice = costPerUnit + profitPerUnit;
    const totalProfit = profitPerUnit * quantity;
    const totalSalePrice = salePrice * quantity;

    // Mostrar resultados con moneda dinámica
    document.getElementById('resFixedCosts').textContent = currencySymbol + ' ' + fixedCosts.toFixed(2);
    document.getElementById('resVariableCosts').textContent = currencySymbol + ' ' + totalVariableCosts.toFixed(2);
    document.getElementById('resTotalProduction').textContent = currencySymbol + ' ' + totalProductionCost.toFixed(2);
    document.getElementById('resCostPerUnit').textContent = currencySymbol + ' ' + costPerUnit.toFixed(2);
    document.getElementById('resProfitMargin').textContent = profitMargin.toFixed(1) + '%';
    document.getElementById('resProfitPerUnit').textContent = currencySymbol + ' ' + profitPerUnit.toFixed(2);
    document.getElementById('resSalePrice').textContent = currencySymbol + ' ' + salePrice.toFixed(2);
    document.getElementById('resTotalPrice').textContent = currencySymbol + ' ' + totalSalePrice.toFixed(2);

    document.getElementById('calcResults').removeAttribute('hidden');
    document.getElementById('noResults').setAttribute('hidden', '');

    // Guardar datos actuales para exportar/guardar
    window.currentCalc = {
        projectName,
        description,
        currency,
        currencySymbol,
        quantity,
        unitCost,
        fixedCosts,
        variableCosts,
        profitMargin,
        results: {
            totalVariableCosts,
            totalProductionCost,
            costPerUnit,
            profitPerUnit,
            salePrice,
            totalProfit,
            totalSalePrice
        },
        timestamp: new Date().toLocaleString('es-ES')
    };
}

function saveCalculation() {
    if (!window.currentCalc) {
        alert('Por favor, realiza un cálculo primero');
        return;
    }

    // Verificar si está logeado
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const isGuest = localStorage.getItem('isGuest') === 'true';
    
    if (!isLoggedIn) {
        showLoginWarning();
        return;
    }

    if (isGuest) {
        showGuestWarning();
        return;
    }

    let calculations = JSON.parse(localStorage.getItem('calculations')) || [];
    
    const calculation = {
        id: Date.now(),
        user: localStorage.getItem('currentUser'),
        ...window.currentCalc
    };

    calculations.push(calculation);
    localStorage.setItem('calculations', JSON.stringify(calculations));

    alert('✓ Cálculo guardado correctamente');
}

function showLoginWarning() {
    const message = `Para guardar tus cálculos debes iniciar sesión.\n\n¿Deseas ir a login ahora?`;
    
    if (confirm(message)) {
        window.location.href = 'login.html';
    }
}

function showGuestWarning() {
    const message = `Los invitados no pueden guardar cálculos.\n\nCrea una cuenta para acceso completo.\n\n¿Deseas crear una cuenta ahora?`;
    
    if (confirm(message)) {
        window.location.href = 'login.html';
    }
}

function exportCalculation() {
    if (!window.currentCalc) {
        alert('Por favor, realiza un cálculo primero');
        return;
    }

    const data = window.currentCalc;
    const csvContent = generateCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `calculo-${data.projectName.replace(/\s+/g, '-')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function generateCSV(data) {
    const symbol = data.currencySymbol;
    const rows = [
        ['CÁLCULO DE COSTOS', data.projectName],
        ['Descripción', data.description],
        ['Moneda', data.currency],
        [''],
        ['DATOS DE ENTRADA', ''],
        ['Cantidad', data.quantity],
        ['Costo Unitario', symbol + ' ' + data.unitCost],
        ['Costos Fijos', symbol + ' ' + data.fixedCosts],
        ['Costos Variables (unitario)', symbol + ' ' + data.variableCosts],
        ['Margen de Ganancia', data.profitMargin + '%'],
        [''],
        ['RESULTADOS', ''],
        ['Costos Variables Total', symbol + ' ' + data.results.totalVariableCosts.toFixed(2)],
        ['Costo Total de Producción', symbol + ' ' + data.results.totalProductionCost.toFixed(2)],
        ['Costo por Unidad', symbol + ' ' + data.results.costPerUnit.toFixed(2)],
        ['Ganancia por Unidad', symbol + ' ' + data.results.profitPerUnit.toFixed(2)],
        ['Precio de Venta Unitario', symbol + ' ' + data.results.salePrice.toFixed(2)],
        ['Ganancia Total', symbol + ' ' + data.results.totalProfit.toFixed(2)],
        ['Precio Total de Venta', symbol + ' ' + data.results.totalSalePrice.toFixed(2)],
        [''],
        ['Fecha de Cálculo', data.timestamp]
    ];

    return rows.map(row => row.join(',')).join('\n');
}

async function handleLogout() {
    const confirmed = await ConfirmationDialog.show({
        title: 'Cerrar Sesión',
        message: '¿Estás seguro de que deseas cerrar sesión?',
        icon: '👋',
        confirmText: 'Cerrar Sesión',
        cancelText: 'Cancelar',
        isDangerous: true
    });

    if (confirmed) {
        notify.info('Cerrando sesión...', 'Redirigiendo al login');
        
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isGuest');
        localStorage.removeItem('loginTime');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
}