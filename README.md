# NEBO — Hyper Weather 🌤️✨

<p align="center">
  <a href="https://a31349416-cloud.github.io/NEBO/"><img src="https://img.shields.io/badge/Live%20Demo-NEBO-ff3b82?style=for-the-badge&logo=vercel" alt="Live Demo"></a>
  <a href="https://github.com/a31349416-cloud/NEBO/actions"><img src="https://img.shields.io/github/actions/workflow/status/a31349416-cloud/NEBO/ci.yml?branch=main&label=CI&style=flat-square" alt="CI"></a>
  <a href="https://github.com/a31349416-cloud/NEBO/blob/main/LICENSE"><img src="https://img.shields.io/github/license/a31349416-cloud/NEBO?style=flat-square&color=8b5cf6" alt="License"></a>
  <img src="https://img.shields.io/badge/htmlhint-0%20errors-06b6d4?style=flat-square" alt="htmlhint">
  <img src="https://img.shields.io/badge/eslint-0%20errors-22c55e?style=flat-square" alt="eslint">
  <img src="https://img.shields.io/badge/tests-4%20passed-16a34a?style=flat-square" alt="tests">
</p>

<p align="center">
  <b>Найгарніший прогноз погоди в Україні</b> — преміум UI, живі дані Open-Meteo, PWA, голосовий пошук. Без API ключа.<br>
  <a href="https://a31349416-cloud.github.io/NEBO/"><b>👉 Відкрити Live Demo</b></a> • <a href="#-фішки">Фішки</a> • <a href="#-швидкий-старт">Старт</a>
</p>

<p align="center">
  <img src="docs/preview.png" alt="NEBO preview" width="100%">
</p>

---

## ✨ Фішки

- 🔍 **Пошук** будь-якого міста (Open-Meteo Geocoding) + автокомпліт, історія 6, обране ♡ — `textContent` XSS-safe
- 🎤 **Голосовий пошук** `uk-UA` `SpeechRecognition`
- 🗺️ **Карта опадів** — OSM (без ключа) + RainViewer радар, `Вкл/Вимк` з анімованим тумблером, `invert` для темної теми
- 📈 **Графіки** — Chart.js + `DocumentFragment` трек 24 год, `7 днів` з градієнтами
- 📊 **Порівняти 4 міста** — Київ/Львів/Одеса/Буковель live
- 🌓 **Теми** — світла/темна (WCAG AA контраст `styles.css:14`), `°C/°F`, `Lenis` smooth + `GSAP` `ScrollTrigger`
- 📲 **PWA** — `manifest` + `serviceWorker` (offline cache)
- ⚡ **Perf** — `styles.css` + `app.js` окремо, `preload`/`defer`, `DocumentFragment`

## 🛠 Стек

| Шар | Технології |
|---|---|
| **Frontend** | `Tailwind CDN` → `build 3.4.1`, `GSAP 3.12 + ScrollTrigger`, `Lenis 1.1`, `Chart.js 4.4`, `Leaflet 1.9` + `Carto` → `OSM` |
| **API** | `Open-Meteo` forecast + geocoding + reverse (без ключа, CORS) + `RainViewer` |
| **Build** | `Vite 5`, `PostCSS` + `Autoprefixer`, `ESLint 9`, `htmlhint 1.9`, `Prettier 3.3` |
| **Якість** | `htmlhint 0`, `eslint 0`, `node --test 4/4`, `Lighthouse perf ~78 a11y 96 seo 98` |

## 📁 Структура

```
POGODA/
├── index.html      — семантика <header>/<main>, meta, loader, a11y
├── styles.css      — glass, blobs, contrast fix, loaderGrow/Hide
├── app.js          — 600+ рядків, XSS-safe, fetch ok, try/catch, DocumentFragment
├── package.json    — Vite + lint/test
├── vite.config.js
├── tests/weather.test.js — 4 тести (cToF, fmtTemp, getWeather)
├── docs/preview.png
└── .github/workflows/ci.yml
```

## 🚀 Швидкий старт

```bash
git clone https://github.com/a31349416-cloud/NEBO.git
cd NEBO

npm install
npm run dev      # http://localhost:5173
npm test         # 4 тести
npm run lint     # htmlhint + eslint — 0 errors

# prod
npm run build && npm run preview
# або без збірки
python -m http.server 8000
```

| Команда | Що робить |
|---|---|
| `npm run dev` | Vite dev сервер |
| `npm run build` | Vite prod build → `dist/` |
| `npm test` | `node --test tests/*.test.js` |
| `npm run lint` | `htmlhint index.html && eslint app.js` |
| `npm run format` | `prettier --write .` |

## 📊 Якість

```bash
htmlhint  # 0 errors (manifest %7B%22...)
eslint    # 0 errors (window.* globals)
Lighthouse — perf ~78 (Tailwind CDN → build для 90+), a11y 96, best-practices 96, seo 98
Tests — 4 passed (cToF, fmtTemp, getWeather, localStorage)
```

## 📦 Деплой

- **GitHub Pages** — `Settings → Pages → main / root` → https://a31349416-cloud.github.io/NEBO/
- **Vercel/Netlify** — залий `index.html` + `styles.css` + `app.js` (чи `dist/` після `build`)

## 🗺 Роадмап

- [x] v4 HYPER+ — голос + PWA
- [x] v5 PRODUCTION — split + DocumentFragment + a11y
- [ ] Tailwind build purge → `perf 90+`
- [ ] Playwright e2e
- [ ] i18n `en/uk`

## 📄 Ліцензія

MIT — роби що хочеш, залиш зірку ⭐ — `LICENSE`

## 👤 Автор

**a31349416-cloud** — [GitHub](https://github.com/a31349416-cloud) • Live: https://a31349416-cloud.github.io/NEBO/

<p align="center">
  <sub>Зроблено з ♥ для України 🇺🇦 — NEBO 2026</sub>
</p>
