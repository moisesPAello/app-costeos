// Sistema de anuncios y noticias económicas

document.addEventListener('DOMContentLoaded', () => {
    loadExchangeRates();
    loadEconomicNews();
    
    // Actualizar tasas cada 5 minutos
    setInterval(loadExchangeRates, 5 * 60 * 1000);
});

function loadExchangeRates() {
    // Simulación de datos (en producción usarías una API real como OpenExchangeRates o similar)
    const rates = {
        usdEur: { value: 0.92, change: 0.5, direction: 'up' },
        usdMxn: { value: 20.50, change: 0.2, direction: 'down' },
        usdArs: { value: 850.00, change: 1.2, direction: 'up' }
    };

    // Actualizar UI
    const usdEurElement = document.getElementById('usdEurRate');
    const usdMxnElement = document.getElementById('usdMxnRate');
    const usdArsElement = document.getElementById('usdArsRate');

    if (usdEurElement) usdEurElement.textContent = rates.usdEur.value.toFixed(2);
    if (usdMxnElement) usdMxnElement.textContent = rates.usdMxn.value.toFixed(2);
    if (usdArsElement) usdArsElement.textContent = rates.usdArs.value.toFixed(2);

    // Guardar en localStorage para referencia
    localStorage.setItem('exchangeRates', JSON.stringify({
        ...rates,
        lastUpdated: new Date().toISOString()
    }));
}

function loadEconomicNews() {
    // Simulación de noticias (en producción usarías una API de noticias)
    const news = [
        {
            date: 'Hoy · 10:30',
            title: 'Banco Central eleva tasas de interés',
            description: 'Decisión esperada para controlar la inflación en los próximos trimestres.'
        },
        {
            date: 'Ayer · 14:15',
            title: 'Mercados globales muestran estabilidad',
            description: 'Los índices bursátiles cierran en positivo por confianza inversora.'
        },
        {
            date: 'Hace 2 días · 09:00',
            title: 'Acuerdo comercial anunciado',
            description: 'Nueva alianza comercial podría impactar positivamente el sector.'
        }
    ];

    localStorage.setItem('economicNews', JSON.stringify({
        news: news,
        lastUpdated: new Date().toISOString()
    }));
}

// Función para obtener tasas de cambio reales (reemplaza la simulación)
async function fetchRealExchangeRates() {
    try {
        // Ejemplo con Open Exchange Rates (necesitas API key)
        // const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        // const data = await response.json();
        // return data.rates;
        
        console.log('Para usar tasas reales, integra una API de cambio de divisas');
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
    }
}

// Función para obtener noticias reales (reemplaza la simulación)
async function fetchRealNews() {
    try {
        // Ejemplo con NewsAPI (necesitas API key)
        // const response = await fetch('https://newsapi.org/v2/everything?q=economy&sortBy=publishedAt&language=es');
        // const data = await response.json();
        // return data.articles;
        
        console.log('Para usar noticias reales, integra NewsAPI u otro proveedor');
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}
