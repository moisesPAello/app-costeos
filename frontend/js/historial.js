// Historial: selección, tags, export y comparación
let allCalculations = [];
let filteredCalculations = [];
let selectedIds = new Set();
let currentPage = 1;
const itemsPerPage = 10;
let compareChart = null;

document.addEventListener('DOMContentLoaded', () => {
    loadCalculations();
    bindUI();
    renderTable();
    updateStats();
});

function bindUI() {
    // Filters (if exist)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', applyFilters);

    // Pagination buttons
    const prev = document.getElementById('prevPage');
    const next = document.getElementById('nextPage');
    if (prev) prev.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderTable(); }});
    if (next) next.addEventListener('click', () => { const max = Math.ceil(filteredCalculations.length / itemsPerPage); if (currentPage < max) { currentPage++; renderTable(); }});

    // Bulk action buttons
    const addTagBtn = document.getElementById('addTagBtn');
    const removeTagBtn = document.getElementById('removeTagBtn');
    const highlightBtn = document.getElementById('highlightBtn');
    const exportSelectedBtn = document.getElementById('exportSelectedBtn');
    const compareSelectedBtn = document.getElementById('compareSelectedBtn');
    const selectAll = document.getElementById('selectAllCheckbox');

    if (addTagBtn) addTagBtn.addEventListener('click', () => {
        const tag = (document.getElementById('tagInput') || {}).value.trim();
        if (tag) addTagToSelected(tag);
    });
    if (removeTagBtn) removeTagBtn.addEventListener('click', () => {
        const tag = (document.getElementById('tagInput') || {}).value.trim();
        if (tag) removeTagFromSelected(tag);
    });
    if (highlightBtn) highlightBtn.addEventListener('click', highlightSelectedRows);
    if (exportSelectedBtn) exportSelectedBtn.addEventListener('click', exportSelectedCalculations);
    if (compareSelectedBtn) compareSelectedBtn.addEventListener('click', compareSelectedCalculations);
    if (selectAll) selectAll.addEventListener('change', (e) => toggleSelectAll(e.target.checked));

    // New status buttons
    const setGreen = document.getElementById('setStatusGreen');
    const setYellow = document.getElementById('setStatusYellow');
    const setRed = document.getElementById('setStatusRed');
    if (setGreen) setGreen.addEventListener('click', () => setStatusToSelected('green'));
    if (setYellow) setYellow.addEventListener('click', () => setStatusToSelected('yellow'));
    if (setRed) setRed.addEventListener('click', () => setStatusToSelected('red'));

    // Compare modal close
    const closeCompare = document.getElementById('closeCompare');
    const closeCompareBtn = document.getElementById('closeCompareBtn');
    if (closeCompare) closeCompare.addEventListener('click', closeCompareModal);
    if (closeCompareBtn) closeCompareBtn.addEventListener('click', closeCompareModal);

    // Tag color select and moved export button
    const exportBottom = document.getElementById('exportSelectedBottom');
    if (exportBottom) exportBottom.addEventListener('click', exportSelectedCalculations);

    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', () => {
        // reset filters (search input if exists)
        const s = document.getElementById('searchInput');
        if (s) s.value = '';
        selectedIds.clear();
        loadCalculations();
        renderTable();
        notify.info('Filtros limpiados');
    });
}

function loadCalculations() {
    const stored = localStorage.getItem('calculations');
    allCalculations = stored ? JSON.parse(stored) : [];
    // Ensure numeric ids
    allCalculations.forEach(c => { if (c.id) c.id = Number(c.id); });
    filteredCalculations = [...allCalculations].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
    currentPage = 1;
}

function applyFilters() {
    // Simple search filter
    const searchTerm = (document.getElementById('searchInput') || {}).value?.toLowerCase() || '';
    filteredCalculations = allCalculations.filter(c => 
        c.projectName.toLowerCase().includes(searchTerm) ||
        (c.description || '').toLowerCase().includes(searchTerm)
    ).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
    currentPage = 1;
    renderTable();
    updateStats();
}

function renderTable() {
    const container = document.getElementById('recordsContainer');
    const noRecords = document.getElementById('noRecords');
    const tbody = document.getElementById('historyTableBody');
    if (!tbody) return;

    if (filteredCalculations.length === 0) {
        container && container.setAttribute('hidden', '');
        noRecords && noRecords.removeAttribute('hidden');
        tbody.innerHTML = '';
        updateStats();
        return;
    }

    container && container.removeAttribute('hidden');
    noRecords && noRecords.setAttribute('hidden', '');

    tbody.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const pageData = filteredCalculations.slice(start, start + itemsPerPage);

    pageData.forEach(calc => {
        calc.tags = Array.isArray(calc.tags) ? calc.tags : [];
        // normalize status
        const status = calc.status || ''; // 'green'|'yellow'|'red' or ''
        const row = document.createElement('tr');
        row.setAttribute('data-id', calc.id);
        if (selectedIds.has(calc.id)) row.classList.add('selected-row');
        if (status) row.classList.add(`status-${status}`);

        const date = (calc.timestamp || '').split(' ')[0];

        // Build a status badge HTML
        const statusHtml = status ? `<span class="status-badge ${status}">${status === 'green' ? 'OK' : status === 'yellow' ? 'Revisar' : 'Urgente'}</span>` : '';

        row.innerHTML = `
            <td><input type="checkbox" class="row-checkbox" data-id="${calc.id}" ${selectedIds.has(calc.id) ? 'checked' : ''} /></td>
            <td class="project-name">${escapeHtml(calc.projectName || '')} ${statusHtml}</td>
            <td>${escapeHtml(date)}</td>
            <td><span class="currency-badge">${escapeHtml(calc.currency || '')}</span></td>
            <td>${escapeHtml(String(calc.quantity || ''))}</td>
            <td class="amount">${escapeHtml(calc.currencySymbol || '')} ${Number(calc.results?.totalProductionCost || 0).toFixed(2)}</td>
            <td>${escapeHtml(calc.currencySymbol || '')} ${Number(calc.results?.costPerUnit || 0).toFixed(2)}</td>
            <td class="amount">${escapeHtml(calc.currencySymbol || '')} ${Number(calc.results?.totalProfit || 0).toFixed(2)}</td>
            <td class="tags-cell">${calc.tags.map(t => renderTagBadge(t)).join(' ')}</td>
            <td>
                <div class="table-actions">
                    <button class="small" onclick="viewDetails(${calc.id})" title="Ver detalles">👁️</button>
                    <button class="small" onclick="exportSingleCalculation(${calc.id})" title="Exportar">📥</button>
                    <button class="small" onclick="deleteCalculation(${calc.id})" title="Eliminar">🗑️</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    // attach checkbox listeners
    document.querySelectorAll('.row-checkbox').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const id = Number(e.target.getAttribute('data-id'));
            if (e.target.checked) selectedIds.add(id);
            else selectedIds.delete(id);
            updateRowSelectionVisual(id);
            updateBulkActionsState();
        });
    });

    updatePaginationInfo();
    updateBulkActionsState();
}

function updateRowSelectionVisual(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (!row) return;
    if (selectedIds.has(id)) row.classList.add('selected-row');
    else row.classList.remove('selected-row');
}

function toggleSelectAll(checked) {
    document.querySelectorAll('#historyTableBody .row-checkbox').forEach(cb => {
        cb.checked = checked;
        const id = Number(cb.getAttribute('data-id'));
        if (checked) selectedIds.add(id); else selectedIds.delete(id);
        updateRowSelectionVisual(id);
    });
    updateBulkActionsState();
}

function updateBulkActionsState() {
    const any = selectedIds.size > 0;
    const atLeastTwo = selectedIds.size >= 2;
    const enableId = (id, flag) => { const el = document.getElementById(id); if (el) el.disabled = !flag; };
    enableId('addTagBtn', any);
    enableId('removeTagBtn', any);
    enableId('highlightBtn', any);
    enableId('setStatusGreen', any);
    enableId('setStatusYellow', any);
    enableId('setStatusRed', any);
    enableId('exportSelectedBottom', any);
    const compareBtn = document.getElementById('compareSelectedBtn');
    if (compareBtn) compareBtn.disabled = !atLeastTwo;
}

function addTagToSelected(tag) {
    if (!tag) { notify.error('Etiqueta vacía'); return; }
    const color = (document.getElementById('tagColorSelect') || {}).value || '';
    const calculations = JSON.parse(localStorage.getItem('calculations')) || [];
    let count = 0;
    calculations.forEach(c => {
        if (selectedIds.has(c.id)) {
            c.tags = Array.isArray(c.tags) ? c.tags : (Array.isArray(c.tags) ? c.tags : []);
            // normalize existing tags to objects for comparison
            const exists = c.tags.some(t => (typeof t === 'string' ? t === tag : t.name === tag));
            if (!exists) {
                if (color) c.tags.push({ name: tag, color });
                else c.tags.push(tag);
                count++;
            }
        }
    });
    localStorage.setItem('calculations', JSON.stringify(calculations));
    loadCalculations();
    renderTable();
    notify.success('Etiquetas aplicadas', `${count} elemento(s) actualizados`);
}

function removeTagFromSelected(tag) {
    if (!tag) { notify.error('Etiqueta vacía'); return; }
    const calculations = JSON.parse(localStorage.getItem('calculations')) || [];
    let count = 0;
    calculations.forEach(c => {
        if (selectedIds.has(c.id) && Array.isArray(c.tags)) {
            const before = c.tags.length;
            c.tags = c.tags.filter(t => {
                if (typeof t === 'string') return t !== tag;
                return t.name !== tag;
            });
            if (c.tags.length !== before) count++;
        }
    });
    localStorage.setItem('calculations', JSON.stringify(calculations));
    loadCalculations();
    renderTable();
    notify.success('Etiqueta eliminada', `${count} elemento(s) actualizados`);
}

// Render badge helper: accepts string or object
function renderTagBadge(t) {
    if (!t) return '';
    if (typeof t === 'string') {
        return `<span class="tag-badge">${escapeHtml(t)}</span>`;
    } else {
        const cls = t.color ? ` ${t.color}` : '';
        return `<span class="tag-badge${cls}">${escapeHtml(t.name)}</span>`;
    }
}

function highlightSelectedRows() {
    selectedIds.forEach(id => updateRowSelectionVisual(id));
    notify.info('Filas resaltadas', `${selectedIds.size} seleccionadas`);
}

function exportSelectedCalculations() {
    if (selectedIds.size === 0) { notify.error('No hay selección'); return; }
    const calculations = JSON.parse(localStorage.getItem('calculations')) || [];
    const selected = calculations.filter(c => selectedIds.has(c.id));
    const rows = [['PROYECTO','FECHA','MONEDA','CANTIDAD','COSTO_TOTAL','COSTO_UNIDAD','GANANCIA','TAGS']];
    selected.forEach(c => {
        rows.push([c.projectName, c.timestamp, c.currency, c.quantity, (c.results?.totalProductionCost||0).toFixed(2), (c.results?.costPerUnit||0).toFixed(2), (c.results?.totalProfit||0).toFixed(2), (c.tags||[]).join('|')]);
    });
    const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `seleccion-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    notify.success('Exportado', 'Selección descargada');
}

function compareSelectedCalculations() {
    if (selectedIds.size < 2) { notify.warning('Selecciona al menos 2'); return; }
    const calculations = JSON.parse(localStorage.getItem('calculations')) || [];
    const selected = calculations.filter(c => selectedIds.has(c.id));
    const labels = selected.map(s => s.projectName.substring(0,20));
    const costs = selected.map(s => Number(s.results?.totalProductionCost||0));
    const profits = selected.map(s => Number(s.results?.totalProfit||0));

    const modal = document.getElementById('compareModal');
    if (!modal) return;
    modal.removeAttribute('hidden');

    const ctx = document.getElementById('compareChart').getContext('2d');
    if (compareChart) compareChart.destroy();
    compareChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                { label: 'Costo Total', data: costs, backgroundColor: '#3d7654' },
                { label: 'Ganancia', data: profits, backgroundColor: '#5fb383' }
            ]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });

    const container = document.getElementById('compareTableContainer');
    container.innerHTML = `<table style="width:100%;border-collapse:collapse;">
        <thead><tr><th>Proyecto</th><th>Costo Total</th><th>Ganancia</th><th>Tags</th></tr></thead>
        <tbody>${selected.map(s => `<tr><td>${escapeHtml(s.projectName)}</td><td>${escapeHtml(s.currencySymbol||'')} ${Number(s.results?.totalProductionCost||0).toFixed(2)}</td><td>${escapeHtml(s.currencySymbol||'')} ${Number(s.results?.totalProfit||0).toFixed(2)}</td><td>${(s.tags||[]).map(t=>`<span class="tag-badge">${escapeHtml(t)}</span>`).join(' ')}</td></tr>`).join('')}</tbody>
    </table>`;
}

function closeCompareModal() {
    const modal = document.getElementById('compareModal');
    if (!modal) return;
    modal.setAttribute('hidden', '');
    if (compareChart) { compareChart.destroy(); compareChart = null; }
}

function viewDetails(id) {
    // Reuse existing implementation if present; otherwise open details modal (placeholder)
    if (typeof window.viewDetails === 'function') {
        window.viewDetails(id);
        return;
    }
    notify.info('Detalle', `Ver detalles de id ${id}`);
}

function exportSingleCalculation(id) {
    const calculations = JSON.parse(localStorage.getItem('calculations')) || [];
    const calc = calculations.find(c => c.id === id);
    if (!calc) { notify.error('No encontrado'); return; }
    // generate CSV simple
    const rows = [
        ['CÁLCULO', calc.projectName],
        ['Fecha', calc.timestamp],
        ['Moneda', calc.currency],
        ['Cantidad', calc.quantity],
        ['Costo Total', `${calc.currencySymbol} ${Number(calc.results?.totalProductionCost||0).toFixed(2)}`]
    ];
    const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `calculo-${(calc.projectName||'export').replace(/\s+/g,'-')}.csv`;
    link.click();
    notify.success('Exportado', 'Cálculo descargado');
}

function deleteCalculation(id) {
    if (!confirm('¿Eliminar cálculo?')) return;
    let calculations = JSON.parse(localStorage.getItem('calculations')) || [];
    calculations = calculations.filter(c => c.id !== id);
    localStorage.setItem('calculations', JSON.stringify(calculations));
    // update state
    selectedIds.delete(id);
    loadCalculations();
    renderTable();
    updateStats();
    notify.success('Eliminado', 'Cálculo eliminado correctamente');
}

function updatePaginationInfo() {
    const max = Math.max(1, Math.ceil(filteredCalculations.length / itemsPerPage));
    const pageInfo = document.getElementById('pageInfo');
    if (pageInfo) pageInfo.textContent = `Página ${currentPage} de ${max}`;
    const prev = document.getElementById('prevPage');
    const next = document.getElementById('nextPage');
    if (prev) prev.disabled = currentPage === 1;
    if (next) next.disabled = currentPage === max;
}

function updateStats() {
    const total = filteredCalculations.length;
    const totalAmount = filteredCalculations.reduce((s,c) => s + Number(c.results?.totalProductionCost||0), 0);
    const avg = total ? (totalAmount / total) : 0;
    const dates = filteredCalculations.map(c => (c.timestamp||'').split(' ')[0]).filter(Boolean);
    const dateRange = dates.length ? `${dates[dates.length-1]} a ${dates[0]}` : '-';
    const totalEl = document.getElementById('totalCalcs');
    if (totalEl) totalEl.textContent = total;
    const totalAmountEl = document.getElementById('totalAmount');
    if (totalAmountEl) totalAmountEl.textContent = totalAmount.toFixed(2);
    const avgEl = document.getElementById('averageAmount');
    if (avgEl) avgEl.textContent = avg.toFixed(2);
    const dr = document.getElementById('dateRange');
    if (dr) dr.textContent = dateRange;
}

// small helper
function escapeHtml(s) {
    if (s === undefined || s === null) return '';
    return String(s).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
