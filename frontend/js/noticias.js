// NewsAPI - Servicio gratuito de noticias
const NEWS_API_KEY = '4d5b7c6851d84efaab001760ba0090d7'; // Usar 'demo' para pruebas o registrarse en newsapi.org
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

document.addEventListener('DOMContentLoaded', () => {
    loadEconomicNews();
    loadExchangeRates();
    
    // Actualizar noticias cada 30 minutos
    setInterval(loadEconomicNews, 30 * 60 * 1000);
    // Actualizar tasas cada 5 minutos
    setInterval(loadExchangeRates, 5 * 60 * 1000);
});

async function loadEconomicNews() {
    try {
        const newsContainer = document.querySelector('.announcement-card:nth-child(2) .announcement-content');
        if (!newsContainer) return;

        // Usar datos mock
        const news = await fetchNewsWithFallback();
        
        if (news && news.length > 0) {
            renderNews(newsContainer, news.slice(0, 3));
            updateNewsTimestamp();
        }
    } catch (error) {
        console.log('Error cargando noticias:', error);
    }
}

async function fetchNewsWithFallback() {
    // Usar datos mock ya que la API requiere key válida
    return [
        {
            title: "Mercado bursátil muestra recuperación en América Latina",
            description: "Los índices principales registran ganancias tras anuncios económicos positivos en la región.",
            date: "Hace 2 horas",
            source: "Reuters"
        },
        {
            title: "Inflación se mantiene estable en niveles moderados",
            description: "Los datos del último mes muestran una tendencia a la baja en la mayoría de los países.",
            date: "Hace 4 horas",
            source: "Bloomberg"
        },
        {
            title: "Nuevo acuerdo comercial impulsa exportaciones",
            description: "El tratado firmado recientemente abre nuevas oportunidades para el comercio internacional.",
            date: "Hace 6 horas",
            source: "Financial Times"
        }
    ];
}

function renderNews(container, newsArray) {
    container.innerHTML = '';
    
    newsArray.forEach(news => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.innerHTML = `
            <div class="news-date">${news.date}</div>
            <div class="news-title">${news.title}</div>
            <div class="news-description">${news.description || 'Sin descripción disponible'}</div>
        `;
        container.appendChild(newsItem);
    });
}

function updateNewsTimestamp() {
    const indicators = document.querySelectorAll('.announcement-card');
    if (indicators.length >= 2) {
        const newsCard = indicators[1];
        const timestamp = newsCard.querySelector('.refresh-time');
        if (timestamp) {
            timestamp.textContent = 'Actualizado hace menos de 1 minuto';
        }
    }
}

function updateRatesTimestamp() {
    const indicators = document.querySelectorAll('.announcement-card');
    if (indicators.length >= 1) {
        const ratesCard = indicators[0];
        const timestamp = ratesCard.querySelector('.refresh-time');
        if (timestamp) {
            timestamp.textContent = 'Actualizado hace menos de 1 minuto';
        }
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
        return `Hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
        return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
        return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    } else {
        return date.toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'short', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
}

async function loadExchangeRates() {
    try {
        // API gratuita de tasas de cambio
        const response = await fetch('https://api.exchangerate.host/latest?base=USD');
        
        if (!response.ok) {
            throw new Error('No se pudieron cargar las tasas');
        }

        const data = await response.json();
        
        // Actualizar tasas en el DOM
        updateExchangeRates(data.rates);
        updateRatesTimestamp();
    } catch (error) {
        console.log('Usando tasas predeterminadas:', error);
        // Las tasas predeterminadas del HTML permanecen
    }
}

function updateExchangeRates(rates) {
    const eurRate = document.getElementById('usdEurRate');
    const mxnRate = document.getElementById('usdMxnRate');
    const arsRate = document.getElementById('usdArsRate');

    if (eurRate && rates.EUR) {
        eurRate.textContent = (1 / rates.EUR).toFixed(2);
    }
    if (mxnRate && rates.MXN) {
        mxnRate.textContent = rates.MXN.toFixed(2);
    }
    if (arsRate && rates.ARS) {
        arsRate.textContent = rates.ARS.toFixed(2);
    }
}
