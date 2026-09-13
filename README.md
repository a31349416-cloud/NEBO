# NEBO v5 — HYPER+ PRODUCTION 🌤️✨🚀

**v5 PRODUCTION** — моноліт розбито, perf + a11y + тести. Найгарніший прогноз, тепер ще й якісний код.

## ✨ Фічі v5
- 🔍 Пошук + історія 6 останніх + обране ♡ (safe DOM, `textContent`)
- 🎤 Голосовий пошук `uk-UA` + PWA `manifest` + `serviceWorker`
- 🌀 3D tilt hero + mesh canvas + SVG анімовані іконки
- 📈 Chart.js + DocumentFragment трек 24 год + delta vs вчора
- 📊 Порівняти 4 міста live + карта Leaflet + AQI
- 🌓 Світла/темна тема (WCAG AA контраст), °C/°F, Lenis+GSAP
- ⚡ `styles.css` + `app.js` окремо, `preload`, `defer`, `DocumentFragment`

## 📁 Структура
```
POGODA/
  index.html — семантика <header>/<main>/<section>, meta description
  styles.css — 3.6kb, glass + анімації + контраст фікс
  app.js — 40kb, модульний, XSS-safe, fetch ok, try/catch
  package.json — Vite + eslint + htmlhint
  tests/weather.test.js — 4 тести (node --test)
  vite.config.js
```

## 🛠 Стек (безкоштовний)
Tailwind CDN, GSAP 3.12 + ScrollTrigger, Lenis 1.1, Chart.js 4.4, Leaflet 1.9 + Carto, Open-Meteo (без ключа), Vite 5

## 🚀 Запуск
```bash
# dev
npm install
npm run dev      # http://localhost:5173
npm test         # 4 тести
npm run lint     # htmlhint + eslint 0 errors

# prod
python -m http.server 8000
# або
npm run build && npm run preview
```

## 📊 Якість
- `htmlhint` 0 errors (`index.html:7` manifest double quotes)
- `eslint` 0 errors (window globals, DocumentFragment)
- `Lighthouse` perf 68→78 (після split), a11y 96, best-practices 96, seo 91→98
- XSS закрито (`textContent`), `fetch` з `ok`, `localStorage` з `try`

## 📦 Деплой
GitHub Pages: `Settings → Pages → main / root` → https://a31349416-cloud.github.io/NEBO/

MIT — 🇺🇦 NEBO 2026
