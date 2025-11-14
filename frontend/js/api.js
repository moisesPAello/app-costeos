/**
 * Cliente API para comunicación con el backend
 * Endpoints: /api/auth, /api/upload, /api/reports
 */

// Configuración de la API
const API_BASE_URL = window.location.origin;

const API = {
    // Endpoints de autenticación
    auth: {
        login: `${API_BASE_URL}/api/auth/login`,
        logout: `${API_BASE_URL}/api/auth/logout`
    },
    // Endpoints de carga de archivos
    upload: {
        upload: `${API_BASE_URL}/api/upload`,
        delete: (filename) => `${API_BASE_URL}/api/upload/${filename}`
    },
    // Endpoints de reportes
    reports: {
        generate: `${API_BASE_URL}/api/reports/generate`,
        summary: `${API_BASE_URL}/api/reports/summary`,
        charts: `${API_BASE_URL}/api/reports/charts`
    }
};

/**
 * Realizar login en el backend
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Promise<Object>} Respuesta del servidor
 */
async function loginWithBackend(username, password) {
    try {
        const response = await fetch(API.auth.login, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error en el login');
        }

        return data;
    } catch (error) {
        console.error('Error en loginWithBackend:', error);
        throw error;
    }
}

/**
 * Subir archivo Excel al backend
 * @param {File} file - Archivo Excel
 * @returns {Promise<Object>} Respuesta del servidor con datos procesados
 */
async function uploadExcelToBackend(file) {
    try {
        const formData = new FormData();
        formData.append('excel', file);

        const response = await fetch(API.upload.upload, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al subir archivo');
        }

        return data;
    } catch (error) {
        console.error('Error en uploadExcelToBackend:', error);
        throw error;
    }
}

/**
 * Generar reporte de variaciones
 * @param {Array} data - Datos procesados
 * @returns {Promise<Object>} Reporte generado
 */
async function generateReport(data) {
    try {
        const response = await fetch(API.reports.generate, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Error al generar reporte');
        }

        return result;
    } catch (error) {
        console.error('Error en generateReport:', error);
        throw error;
    }
}

/**
 * Obtener resumen de análisis
 * @param {Array} data - Datos procesados
 * @returns {Promise<Object>} Resumen calculado
 */
async function getSummary(data) {
    try {
        const response = await fetch(API.reports.summary, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Error al obtener resumen');
        }

        return result;
    } catch (error) {
        console.error('Error en getSummary:', error);
        throw error;
    }
}

/**
 * Obtener datos para gráficos
 * @param {Array} data - Datos procesados
 * @returns {Promise<Object>} Datos formateados para Chart.js
 */
async function getChartsData(data) {
    try {
        const response = await fetch(API.reports.charts, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Error al obtener datos de gráficos');
        }

        return result;
    } catch (error) {
        console.error('Error en getChartsData:', error);
        throw error;
    }
}

/**
 * Verificar conexión con el backend
 * @returns {Promise<boolean>} True si está conectado
 */
async function checkBackendConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/`, {
            method: 'GET'
        });
        
        return response.ok;
    } catch (error) {
        console.error('Backend no disponible:', error);
        return false;
    }
}

// Exportar funciones para uso global
window.API_CLIENT = {
    loginWithBackend,
    uploadExcelToBackend,
    generateReport,
    getSummary,
    getChartsData,
    checkBackendConnection
};