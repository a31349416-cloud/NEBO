# NEBO — Найгарніший сайт погоди 🌤️

Преміум прогноз погоди з нереально гарними стилями та анімаціями. Живі дані без API ключа.

**Live:** відкрити `index.html` — все працює з коробки.

## ✨ Фічі
- 🔍 Пошук будь-якого міста світу (Open-Meteo Geocoding) + автокомпліт
- 📍 Геолокація "Моє місце" + reverse geocode
- 🌡️ Поточна погода: температура, відчувається, вологість, вітер, тиск, опади
- ⏰ Погодинний прогноз 24 год + 7 днів з градієнтною шкалою
- 🌅 Схід/захід з прогресом дня
- 🗺️ Карта Leaflet (Carto Dark) + AQI повітря
- 🎨 Динамічний фон: blob-градієнти + canvas частинки (дощ/сніг/туман/зірки) змінюються під погоду
- 🧊 Glassmorphism, grain, кастомний курсор, Lenis smooth scroll, GSAP анімації
- °C / °F перемикач, збереження останнього міста в localStorage

## 🛠 Стек (все безкоштовне)
- Tailwind CDN
- GSAP 3.12 + ScrollTrigger
- Lenis 1.1.20
- Leaflet 1.9.4 + Carto
- Open-Meteo API (forecast + geocoding) — без ключа, CORS
- Google Fonts: Manrope / Space Grotesk / Cormorant Garamond

## 🚀 Запуск
```bash
# варіант 1 — просто відкрий файл
start index.html

# варіант 2 — локальний сервер
python -m http.server 8000
# -> http://localhost:8000
```

## 📦 Деплой
- GitHub Pages: Settings → Pages → Deploy from branch → `main` / `root`
- Vercel / Netlify — просто залий `index.html`

## 📄 Ліцензія
MIT — роби що хочеш, тільки залиш зірочку ⭐

Зроблено з ♥ для України 🇺🇦 — NEBO 2026
