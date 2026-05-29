export const LEVEL_META = {
  free: { color: '#2e7d32', label: 'Свободно' },
  medium: { color: '#f9a825', label: 'Средняя загрузка' },
  jam: { color: '#c62828', label: 'Пробка' },
};

const LEVELS = ['free', 'medium', 'jam'];

function randomLevel() {
  return LEVELS[Math.floor(Math.random() * LEVELS.length)];
}

function randomSpeed(level) {
  if (level === 'free') return 60 + Math.floor(Math.random() * 30);
  if (level === 'medium') return 30 + Math.floor(Math.random() * 20);
  return 5 + Math.floor(Math.random() * 15);
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchTrafficData() {
  const rawQueries = [
    'Тверская улица, Москва',
    'Новый Арбат, Москва',
    'Ленинградский проспект, Москва',
    'Кутузовский проспект, Москва',
    'Профсоюзная улица, Москва'
  ];

  const queries = [...new Set(rawQueries)];

  const results = [];
  const now = new Date().toISOString();

  try {
    for (let index = 0; index < queries.length; index++) {
      const query = queries[index];

      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'TrafficMapApp/1.0 (Educational Project; contact: ivanivanov1995@gmail.com)'
          }
        });

        if (!response.ok) {
          console.warn(`Ошибка ${response.status} при запросе улицы: ${query}`);
          continue;
        }

        const data = await response.json();

        if (data && data.length > 0) {
          const resultData = data[0];
          const level = randomLevel();

          results.push({
            id: `segment-${index}`,
            name: query.replace(', Москва', ''),
            description: resultData.display_name,
            coordinates: [parseFloat(resultData.lat), parseFloat(resultData.lon)],
            level,
            speedKmh: randomSpeed(level),
            updatedAt: now,
          });
        }
      } catch (innerError) {
        console.error(`Проблема с сетью/данными на запросе "${query}":`, innerError);
      }

      if (index < queries.length - 1) {
        await delay(3000);
      }
    }

    return results;

  } catch (error) {
    console.error('Критическая ошибка выполнения fetchTrafficData:', error);
    throw new Error('Не удалось получить данные с сервера OSM');
  }
}