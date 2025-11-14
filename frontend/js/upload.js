/**
 * Manejo de carga de archivos Excel para costeo estándar
 */

document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('uploadExcelForm');
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleExcelUpload);
    }

    const fileInput = document.getElementById('excelFile');
    if (fileInput) {
        fileInput.addEventListener('change', validateFileSelection);
    }
});

/**
 * Validar archivo seleccionado
 */
function validateFileSelection(e) {
    const file = e.target.files[0];
    
    if (!file) return;

    const validExtensions = ['.xlsx', '.xls'];
    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
        notify.error('Formato Inválido', 'Solo se aceptan archivos Excel (.xlsx, .xls)');
        e.target.value = '';
        return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        notify.error('Archivo Muy Grande', 'El archivo no debe superar 5MB');
        e.target.value = '';
        return;
    }

    notify.success('Archivo Válido', `${fileName} listo para cargar`);
}

/**
 * Manejar subida de Excel al backend
 */
async function handleExcelUpload(e) {
    e.preventDefault();

    const fileInput = document.getElementById('excelFile');
    const file = fileInput.files[0];

    if (!file) {
        notify.error('Sin Archivo', 'Por favor selecciona un archivo Excel');
        return;
    }

    // Verificar que el backend esté disponible
    const backendAvailable = await API_CLIENT.checkBackendConnection();
    
    if (!backendAvailable) {
        notify.error('Backend No Disponible', 'El servidor no está ejecutándose. Inicia el backend con: npm start');
        return;
    }

    try {
        notify.info('Procesando...', 'Subiendo y procesando archivo Excel');

        // Subir archivo al backend
        const response = await API_CLIENT.uploadExcelToBackend(file);

        if (response.success) {
            notify.success('¡Procesado!', 'Archivo procesado exitosamente');
            
            // Guardar datos procesados
            localStorage.setItem('lastProcessedData', JSON.stringify(response.data));
            
            // Mostrar resultados
            displayProcessedData(response.data);
            
            // Guardar en historial
            saveToHistory(response);
        } else {
            notify.error('Error de Procesamiento', response.error || 'No se pudo procesar el archivo');
        }

    } catch (error) {
        console.error('Error al subir Excel:', error);
        notify.error('Error', error.message || 'Error al subir el archivo');
    }
}

/**
 * Mostrar datos procesados en la interfaz
 */
function displayProcessedData(data) {
    const resultsContainer = document.getElementById('processedResults');
    
    if (!resultsContainer) return;

    resultsContainer.innerHTML = '';

    if (!Array.isArray(data) || data.length === 0) {
        resultsContainer.innerHTML = '<p>No hay datos para mostrar</p>';
        return;
    }

    // Crear tabla de resultados
    const table = document.createElement('table');
    table.className = 'results-table';

    // Header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Material</th>
            <th>PS</th>
            <th>QS</th>
            <th>Precio Real</th>
            <th>Cantidad Real</th>
            <th>Unidades Prod.</th>
            <th>Costo Estándar</th>
            <th>Costo Real</th>
            <th>Variación Total</th>
            <th>Eficiencia</th>
        </tr>
    `;
    table.appendChild(thead);

    // Body
    const tbody = document.createElement('tbody');
    data.forEach(record => {
        const row = document.createElement('tr');
        
        const variationClass = record.variacion_total < 0 ? 'favorable' : 'desfavorable';
        
        row.innerHTML = `
            <td>${record.material}</td>
            <td>${record.ps.toFixed(2)}</td>
            <td>${record.qs.toFixed(2)}</td>
            <td>${record.precio_real.toFixed(2)}</td>
            <td>${record.cantidad_real.toFixed(2)}</td>
            <td>${record.unidades_producidas}</td>
            <td>$${record.costo_estandar.toFixed(2)}</td>
            <td>$${record.costo_real.toFixed(2)}</td>
            <td class="${variationClass}">$${record.variacion_total.toFixed(2)}</td>
            <td>${record.eficiencia}</td>
        `;
        
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    resultsContainer.appendChild(table);

    // Botón para generar reporte
    const reportBtn = document.createElement('button');
    reportBtn.className = 'btn';
    reportBtn.textContent = 'Generar Reporte Completo';
    reportBtn.onclick = () => generateFullReport(data);
    resultsContainer.appendChild(reportBtn);

    resultsContainer.removeAttribute('hidden');
}

/**
 * Generar reporte completo
 */
async function generateFullReport(data) {
    try {
        notify.info('Generando...', 'Creando reporte completo');

        const response = await API_CLIENT.generateReport(data);

        if (response.success) {
            notify.success('¡Reporte Listo!', 'Reporte generado exitosamente');
            
            // Guardar reporte
            localStorage.setItem('lastReport', JSON.stringify(response.data));
            
            // Redirigir a página de análisis
            window.location.href = 'Analizar.html';
        } else {
            notify.error('Error', response.error || 'No se pudo generar el reporte');
        }

    } catch (error) {
        console.error('Error al generar reporte:', error);
        notify.error('Error', 'No se pudo generar el reporte');
    }
}

/**
 * Guardar en historial
 */
function saveToHistory(response) {
    const currentUser = localStorage.getItem('currentUser');
    const isGuest = localStorage.getItem('isGuest') === 'true';

    if (isGuest) {
        return; // Los invitados no guardan historial
    }

    let history = JSON.parse(localStorage.getItem('uploadHistory')) || [];
    
    try {
        const user = JSON.parse(currentUser);
        
        history.push({
            id: Date.now(),
            user: user.username,
            userId: user.id,
            fileName: response.file.name,
            fileSize: response.file.size,
            recordsProcessed: response.data.length,
            timestamp: new Date().toISOString()
        });

        localStorage.setItem('uploadHistory', JSON.stringify(history));
    } catch (error) {
        console.error('Error al guardar historial:', error);
    }
}

/**
 * Exportar datos procesados
 */
function exportProcessedData(data, format = 'csv') {
    if (!data || data.length === 0) {
        notify.error('Sin Datos', 'No hay datos para exportar');
        return;
    }

    if (format === 'csv') {
        exportToCSV(data);
    } else if (format === 'json') {
        exportToJSON(data);
    }
}

function exportToCSV(data) {
    const headers = [
        'Material', 'PS', 'QS', 'Precio Real', 'Cantidad Real', 'Unidades Producidas',
        'Costo Estándar', 'Costo Real', 'Variación Total', 'Variación Precio', 
        'Variación Cantidad', 'Eficiencia'
    ];

    let csv = headers.join(',') + '\n';

    data.forEach(record => {
        const row = [
            record.material,
            record.ps,
            record.qs,
            record.precio_real,
            record.cantidad_real,
            record.unidades_producidas,
            record.costo_estandar,
            record.costo_real,
            record.variacion_total,
            record.variacion_precio,
            record.variacion_cantidad,
            record.eficiencia
        ];
        csv += row.join(',') + '\n';
    });

    downloadFile(csv, 'costeo-estandar.csv', 'text/csv');
}

function exportToJSON(data) {
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, 'costeo-estandar.json', 'application/json');
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
    
    notify.success('Descarga Completa', `${filename} descargado exitosamente`);
}
