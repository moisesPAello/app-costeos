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
        // Intentar cargar desde API
        const newsContainer = document.querySelector('.announcement-card:nth-child(2) .announcement-content');
        if (!newsContainer) return;

        // Usar datos de demostración si no hay conexión o API no está disponible
        const news = await fetchNewsWithFallback();
        
        if (news && news.length > 0) {
            renderNews(newsContainer, news.slice(0, 3));
            updateNewsTimestamp();
        }
    } catch (error) {
        console.log('Usando noticias predeterminadas', error);
        // Las noticias predeterminadas del HTML permanecen
    }
}

async function fetchNewsWithFallback() {
    try {
        // Intentar obtener noticias económicas en español
        const response = await fetch(
            `${NEWS_API_URL}?q=economía+costa+Rica&language=es&sortBy=publishedAt&pageSize=3`,
            {
                headers: {
                    'X-API-Key': 'c3f7d8e9a0b1c2d3e4f5g6h7i8j9k0l1' // API key de demostración
                }
            }
        );

        if (!response.ok) {
            throw new Error('API no disponible');
        }

        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
            return data.articles.map(article => ({
                title: article.title,
                description: article.description,
                date: formatDate(article.publishedAt),
                source: article.source.name
            }));
        }
    } catch (error) {
        console.log('Error fetching news, using demo data:', error);
    }
    
    return null;
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
        // API de tasas de cambio gratuita
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        
        if (!response.ok) {
            throw new Error('No se pudieron cargar las tasas');
        }

        const data = await response.json();
        
        // Actualizar tasas en el DOM
        updateExchangeRates(data.rates);
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
