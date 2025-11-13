let calculations = [];
let charts = {};

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initializeAnalysis();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('updateProjection').addEventListener('click', updateProjections);
    document.getElementById('exportAnalysis').addEventListener('click', exportAnalysisReport);
}

function loadData() {
    const stored = localStorage.getItem('calculations');
    calculations = stored ? JSON.parse(stored) : [];
}

function initializeAnalysis() {
    if (calculations.length === 0) {
        document.getElementById('noDataMessage').removeAttribute('hidden');
        document.getElementById('analysisDashboard').setAttribute('hidden', '');
        return;
    }

    document.getElementById('noDataMessage').setAttribute('hidden', '');
    document.getElementById('analysisDashboard').removeAttribute('hidden');

    calculateKPIs();
    renderCharts();
    calculateDetailedStats();
    updateProjections();
}

function calculateKPIs() {
    const totalCalcs = calculations.length;
    const totalProfit = calculations.reduce((sum, c) => sum + c.results.totalProfit, 0);
    const avgCost = calculations.reduce((sum, c) => sum + c.results.costPerUnit, 0) / totalCalcs;
    const avgMargin = calculations.reduce((sum, c) => sum + c.profitMargin, 0) / totalCalcs;

    document.getElementById('kpiTotal').textContent = totalCalcs;
    document.getElementById('kpiTotalProfit').textContent = totalProfit.toFixed(2);
    document.getElementById('kpiAvgCost').textContent = avgCost.toFixed(2);
    document.getElementById('kpiAvgMargin').textContent = avgMargin.toFixed(2) + '%';
}

function renderCharts() {
    renderCostChart();
    renderProfitChart();
    renderProjectChart();
    renderCurrencyChart();
}

function renderCostChart() {
    const ctx = document.getElementById('costChart').getContext('2d');
    const totalFixed = calculations.reduce((sum, c) => sum + c.fixedCosts, 0);
    const totalVariable = calculations.reduce((sum, c) => sum + c.results.totalVariableCosts, 0);
    const totalProduction = calculations.reduce((sum, c) => sum + c.results.totalProductionCost, 0);

    if (charts.costChart) charts.costChart.destroy();
    charts.costChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Costos Fijos', 'Costos Variables'],
            datasets: [{
                data: [totalFixed, totalVariable],
                backgroundColor: ['#2d5a42', '#5fb383'],
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function renderProfitChart() {
    const ctx = document.getElementById('profitChart').getContext('2d');
    const sortedCalcs = [...calculations].sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
    ).slice(-10);

    const labels = sortedCalcs.map(c => c.projectName.substring(0, 10));
    const data = sortedCalcs.map(c => c.results.totalProfit);

    if (charts.profitChart) charts.profitChart.destroy();
    charts.profitChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ganancia',
                data: data,
                borderColor: '#5fb383',
                backgroundColor: 'rgba(95, 179, 131, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#5fb383',
                pointBorderColor: '#2d5a42'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function renderProjectChart() {
    const ctx = document.getElementById('projectChart').getContext('2d');
    const sortedCalcs = [...calculations].sort((a, b) => 
        b.results.totalProfit - a.results.totalProfit
    ).slice(0, 8);

    const labels = sortedCalcs.map(c => c.projectName.substring(0, 12));
    const costs = sortedCalcs.map(c => c.results.totalProductionCost);
    const profits = sortedCalcs.map(c => c.results.totalProfit);

    if (charts.projectChart) charts.projectChart.destroy();
    charts.projectChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Costo',
                    data: costs,
                    backgroundColor: '#3d7654'
                },
                {
                    label: 'Ganancia',
                    data: profits,
                    backgroundColor: '#5fb383'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function renderCurrencyChart() {
    const ctx = document.getElementById('currencyChart').getContext('2d');
    const currencyMap = {};

    calculations.forEach(c => {
        if (!currencyMap[c.currency]) {
            currencyMap[c.currency] = 0;
        }
        currencyMap[c.currency] += c.results.totalProductionCost;
    });

    const labels = Object.keys(currencyMap);
    const data = Object.values(currencyMap);
    const colors = ['#2d5a42', '#3d7654', '#4a9368', '#5fb383', '#7ec9a3', '#a8d5ba', '#d4e8e0'];

    if (charts.currencyChart) charts.currencyChart.destroy();
    charts.currencyChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function updateProjections() {
    const months = parseInt(document.getElementById('projMonths').value);
    const growth = parseFloat(document.getElementById('projGrowth').value) / 100;

    const avgRevenue = calculations.reduce((sum, c) => sum + c.results.totalSalePrice, 0) / calculations.length;
    const avgProfit = calculations.reduce((sum, c) => sum + c.results.totalProfit, 0) / calculations.length;

    const projectionLabels = [];
    const projectionRevenue = [];
    const projectionProfit = [];

    for (let i = 0; i <= months; i++) {
        projectionLabels.push(`Mes ${i}`);
        projectionRevenue.push(avgRevenue * Math.pow(1 + growth, i));
        projectionProfit.push(avgProfit * Math.pow(1 + growth, i));
    }

    renderProjectionChart(projectionLabels, projectionRevenue);
    renderProjectionProfitChart(projectionLabels, projectionProfit);
}

function renderProjectionChart(labels, data) {
    const ctx = document.getElementById('projectionChart').getContext('2d');
    
    if (charts.projectionChart) charts.projectionChart.destroy();
    charts.projectionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ingresos Proyectados',
                data: data,
                borderColor: '#4a9368',
                backgroundColor: 'rgba(74, 147, 104, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#4a9368'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function renderProjectionProfitChart(labels, data) {
    const ctx = document.getElementById('projectionProfitChart').getContext('2d');
    
    if (charts.projectionProfitChart) charts.projectionProfitChart.destroy();
    charts.projectionProfitChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ganancias Proyectadas',
                data: data,
                borderColor: '#5fb383',
                backgroundColor: 'rgba(95, 179, 131, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#5fb383'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function calculateDetailedStats() {
    if (calculations.length === 0) return;

    const totalUnits = calculations.reduce((sum, c) => sum + c.quantity, 0);
    const totalCost = calculations.reduce((sum, c) => sum + c.results.totalProductionCost, 0);
    const totalFixed = calculations.reduce((sum, c) => sum + c.fixedCosts, 0);
    const totalVariable = calculations.reduce((sum, c) => sum + c.results.totalVariableCosts, 0);
    const totalRevenue = calculations.reduce((sum, c) => sum + c.results.totalSalePrice, 0);
    const totalGain = calculations.reduce((sum, c) => sum + c.results.totalProfit, 0);

    const unitCosts = calculations.map(c => c.results.costPerUnit);
    const margins = calculations.map(c => c.profitMargin);
    const largest = calculations.reduce((max, c) => c.quantity > max.quantity ? c : max);
    const mostProfitable = calculations.reduce((max, c) => c.results.totalProfit > max.results.totalProfit ? c : max);

    const currencyCounts = {};
    calculations.forEach(c => {
        currencyCounts[c.currency] = (currencyCounts[c.currency] || 0) + 1;
    });
    const topCurrency = Object.keys(currencyCounts).reduce((a, b) => 
        currencyCounts[a] > currencyCounts[b] ? a : b);

    // Products Stats
    document.getElementById('statProjects').textContent = calculations.length;
    document.getElementById('statTotalUnits').textContent = totalUnits;
    document.getElementById('statAvgUnits').textContent = Math.round(totalUnits / calculations.length);
    document.getElementById('statLargestProject').textContent = `${largest.projectName} (${largest.quantity})`;

    // Costs Stats
    document.getElementById('statTotalCost').textContent = totalCost.toFixed(2);
    document.getElementById('statFixedCosts').textContent = totalFixed.toFixed(2);
    document.getElementById('statVariableCosts').textContent = totalVariable.toFixed(2);
    document.getElementById('statMinUnitCost').textContent = Math.min(...unitCosts).toFixed(2);
    document.getElementById('statMaxUnitCost').textContent = Math.max(...unitCosts).toFixed(2);

    // Revenue Stats
    document.getElementById('statTotalRevenue').textContent = totalRevenue.toFixed(2);
    document.getElementById('statTotalGain').textContent = totalGain.toFixed(2);
    document.getElementById('statAvgGain').textContent = (totalGain / calculations.length).toFixed(2);
    document.getElementById('statAvgMargin').textContent = (margins.reduce((a, b) => a + b) / calculations.length).toFixed(2) + '%';
    
    const roi = (totalGain / totalCost * 100);
    document.getElementById('statROI').textContent = roi.toFixed(2) + '%';

    // Efficiency Stats
    document.getElementById('statMostProfitable').textContent = mostProfitable.projectName;
    document.getElementById('statHighestMargin').textContent = Math.max(...margins).toFixed(2) + '%';
    document.getElementById('statLowestMargin').textContent = Math.min(...margins).toFixed(2) + '%';
    document.getElementById('statTopCurrency').textContent = topCurrency;
}

function exportAnalysisReport() {
    const report = generateAnalysisReport();
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `analisis-${new Date().toISOString().split('T')[0]}.txt`);
    link.click();
}

function generateAnalysisReport() {
    const totalCalcs = calculations.length;
    const totalProfit = calculations.reduce((sum, c) => sum + c.results.totalProfit, 0);
    const avgCost = calculations.reduce((sum, c) => sum + c.results.costPerUnit, 0) / totalCalcs;

    return `
═══════════════════════════════════════════════════════════
         REPORTE COMPLETO DE ANÁLISIS DE COSTOS
═══════════════════════════════════════════════════════════

GENERADO: ${new Date().toLocaleString('es-ES')}

───────────────────────────────────────────────────────────
RESUMEN EJECUTIVO
───────────────────────────────────────────────────────────
Total de Cálculos:           ${totalCalcs}
Ganancia Total:              ${totalProfit.toFixed(2)}
Costo Promedio Unitario:     ${avgCost.toFixed(2)}

───────────────────────────────────────────────────────────
DETALLES DE PROYECTOS
───────────────────────────────────────────────────────────
${calculations.map((c, i) => `
${i + 1}. ${c.projectName}
   Fecha: ${c.timestamp}
   Cantidad: ${c.quantity} unidades
   Costo Total: ${c.currencySymbol} ${c.results.totalProductionCost.toFixed(2)}
   Ganancia: ${c.currencySymbol} ${c.results.totalProfit.toFixed(2)}
   Margen: ${c.profitMargin}%
`).join('')}

═══════════════════════════════════════════════════════════
    `;
}
