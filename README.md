# NEBO v2 ULTRA — Найгарніший сайт погоди 🌤️✨

**v2 ULTRA** — ще більш нереально гарний. Преміум прогноз з живими даними без API ключа.

**Live:** відкрити `index.html` — все працює з коробки.

## ✨ Фічі v2 ULTRA
- 🔍 Пошук будь-якого міста світу (Open-Meteo Geocoding) + автокомпліт + швидкі чіпи
- 📍 Геолокація "Моє місце" + reverse geocode + обране ♡
- 🌡️ Поточна погода: величезна типографіка 124px, відчувається, вологість/вітер/опади в склі
- 📈 Графік Chart.js — температура + опади % на 24 год + горизонтальний скрол карток
- ⏰ 7 днів з градієнтною шкалою макс/мiн
- 🌅 Схід/захід з анімованим прогресом дня + circular gauge вологості
- 🗺️ Карта Leaflet (Carto Dark) + AQI повітря
- 🎨 Динамічний фон: 3 blob-градієнти + canvas частинки (дощ/сніг/туман/зірки) + світла/темна тема
- 🧊 Gradient border, grain, кастомний курсор, Lenis smooth scroll, GSAP ScrollTrigger
- °C / °F, збереження міста, toast-сповіщення

## 🛠 Стек (все безкоштовне)
- Tailwind CDN
- GSAP 3.12 + ScrollTrigger
- Lenis 1.1.20
- Chart.js 4.4.7 (графік)
- Leaflet 1.9.4 + Carto Dark
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
