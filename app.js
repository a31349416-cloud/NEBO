let lenis=null;
function initEnhancements(){
  try{
    if(!window.gsap || !window.ScrollTrigger || !window.Lenis){
      return setTimeout(initEnhancements, 120);
    }
    gsap.registerPlugin(ScrollTrigger);
    lenis = new Lenis({duration:1.1, easing:t=>Math.min(1,1.001-Math.pow(2,-10*t))});
    function raf(t){lenis.raf(t);window.requestAnimationFrame(raf)}window.requestAnimationFrame(raf);
    lenis.on('scroll',ScrollTrigger.update);
    gsap.ticker.add(t=>lenis.raf(t*1000));
    gsap.ticker.lagSmoothing(0);
    try{ gsap.to('#progress',{scaleX:1,ease:'none',scrollTrigger:{trigger:'body',start:'top top',end:'bottom bottom',scrub:.3}})}catch{}
    setTimeout(()=>{ try{ gsap.from('#nav',{y:-20,opacity:0,duration:.7}); gsap.from('main > section',{y:24,opacity:0,duration:.7,stagger:.06,delay:.1, ease:'power3.out'});}catch{} }, 300);
    // cursor
    try{
      const dot=document.getElementById('cursorDot'), ring=document.getElementById('cursorRing');
      let mx=0,my=0,rx=0,ry=0;
      window.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;try{gsap.to(dot,{x:mx-3,y:my-3,duration:.08})}catch{dot.style.transform=`translate(${mx-3}px,${my-3}px)`}});
      gsap.ticker.add(()=>{rx+=(mx-rx)*0.15;ry+=(my-ry)*0.15;ring.style.transform=`translate(${rx-14}px,${ry-14}px)`});
      document.querySelectorAll('a,button').forEach(el=>{
        el.addEventListener('mouseenter',()=>{try{gsap.to(ring,{scale:1.6,duration:.2}); gsap.to(dot,{scale:1.8,duration:.2})}catch{}});
        el.addEventListener('mouseleave',()=>{try{gsap.to(ring,{scale:1,duration:.2}); gsap.to(dot,{scale:1,duration:.2})}catch{}});
      });
    }catch{}
    // tilt
    try{
      const tiltCard=document.getElementById('tiltCard');
      if(tiltCard){
        tiltCard.addEventListener('mousemove',e=>{
          const r=tiltCard.getBoundingClientRect(); const x=(e.clientX - r.left)/r.width -0.5; const y=(e.clientY - r.top)/r.height -0.5;
          gsap.to(tiltCard,{rotationY:x*6, rotationX:-y*6, duration:.5, transformPerspective:1000});
        });
        tiltCard.addEventListener('mouseleave',()=> gsap.to(tiltCard,{rotationY:0, rotationX:0, duration:.7}));
      }
    }catch{}
  }catch(e){ console.warn(e); }
}
if(document.readyState==='complete') initEnhancements();
else window.addEventListener('load', initEnhancements);
setTimeout(initEnhancements, 1500);
setTimeout(()=>{
  if(!window.gsap || !window.ScrollTrigger){
    window.addEventListener('scroll',()=>{
      const sc=window.scrollY / (document.body.scrollHeight - window.innerHeight);
      const el=document.getElementById('progress');
      if(el) el.style.transform=`scaleX(${sc})`;
    });
  }
}, 2000);
document.getElementById('themeBtn').addEventListener('click',()=>{
  document.body.classList.toggle('light');
  const isLight=document.body.classList.contains('light');
  document.getElementById('bg').style.background=isLight?'#f1f0ee':'#05070a';
  showToast(isLight?'Світла тема ☀️':'Темна тема 🌙');
});
// mesh canvas - subtle gradient mesh
const mesh=document.getElementById('meshCanvas'), mctx=mesh.getContext('2d');
function resizeMesh(){mesh.width=window.innerWidth; mesh.height=window.innerHeight}
resizeMesh(); window.addEventListener('resize',resizeMesh);
let t=0;
function drawMesh(){
  t+=0.002;
  mctx.clearRect(0,0,mesh.width,mesh.height);
  // subtle moving gradient orbs
  const w=mesh.width, h=mesh.height;
  const orbs=[
    {x: w*0.2 + Math.sin(t*0.7)*80, y: h*0.18 + Math.cos(t*0.5)*40, r: 380, c:'rgba(255,59,130,.07)'},
    {x: w*0.75 + Math.cos(t*0.6)*60, y: h*0.35 + Math.sin(t*0.4)*50, r: 420, c:'rgba(139,92,246,.06)'},
    {x: w*0.5 + Math.sin(t*0.3)*100, y: h*0.75 + Math.cos(t*0.8)*30, r: 500, c:'rgba(6,182,214,.05)'},
  ];
  orbs.forEach(o=>{
    const g=mctx.createRadialGradient(o.x,o.y,0,o.x,o.y,o.r);
    g.addColorStop(0,o.c); g.addColorStop(1,'transparent');
    mctx.fillStyle=g; mctx.beginPath(); mctx.arc(o.x,o.y,o.r,0,Math.PI*2); mctx.fill();
  });
  window.requestAnimationFrame(drawMesh);
}
drawMesh();

// weather particles
const canvas=document.getElementById('weatherCanvas'), ctx=canvas.getContext('2d');
let particles=[], animId, currentWeather='clear';
function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight}
resize();window.addEventListener('resize',resize);
function createParticles(type, count){
  particles=[];
  for(let i=0;i<count;i++) particles.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    vx:(Math.random()-0.5)*(type==='rain'?1:2),
    vy: type==='rain'? Math.random()*8+8 : type==='snow'? Math.random()*2+1 : Math.random()*1+0.3,
    r: type==='rain'? Math.random()*1.5+1 : type==='snow'? Math.random()*3+2 : Math.random()*1.2+0.5,
    o: Math.random()*0.6+0.3
  });
}
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if(currentWeather==='rain'){
    ctx.strokeStyle='rgba(180,210,255,0.6)'; ctx.lineWidth=1.2;
    particles.forEach(p=>{
      ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p.x+p.vx*2,p.y+p.r*6); ctx.stroke();
      p.x+=p.vx; p.y+=p.vy;
      if(p.y>canvas.height){p.y=-10;p.x=Math.random()*canvas.width}
      if(p.x<0||p.x>canvas.width) p.x=Math.random()*canvas.width;
    });
  } else if(currentWeather==='snow'){
    ctx.fillStyle='rgba(255,255,255,0.85)';
    particles.forEach(p=>{
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      p.x+=Math.sin(p.y*0.01)*0.5 + p.vx*0.2; p.y+=p.vy;
      if(p.y>canvas.height){p.y=-10;p.x=Math.random()*canvas.width}
    });
  } else if(currentWeather==='clouds' || currentWeather==='fog'){
    ctx.fillStyle='rgba(255,255,255,0.14)';
    particles.forEach(p=>{
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r*2,0,Math.PI*2); ctx.fill();
      p.x+=p.vx*0.6; if(p.x>canvas.width) p.x=-10;
      if(p.x<-10) p.x=canvas.width;
    });
  } else if(currentWeather==='clear' && document.getElementById('isDayBadge')?.textContent.includes('НІЧ')){
    ctx.fillStyle='rgba(255,255,255,0.9)';
    particles.forEach(p=>{
      ctx.globalAlpha=p.o; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
      p.y+=p.vy*0.15; if(p.y>canvas.height) p.y=0;
    });
  } else {
    ctx.fillStyle='rgba(255,255,255,0.11)';
    particles.forEach(p=>{
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      p.x+=p.vx*0.2; p.y+=p.vy*0.2;
      if(p.y>canvas.height) p.y=0; if(p.x>canvas.width) p.x=0; if(p.x<0) p.x=canvas.width;
    });
  }
  animId=window.requestAnimationFrame(draw);
}
createParticles('dust',80); draw();
function setWeatherParticles(code, isDay){
  window.cancelAnimationFrame(animId);
  if([61,63,65,66,67,80,81,82,95,96,99].includes(code)) {currentWeather='rain'; createParticles('rain', isDay? 250:190);}
  else if([71,73,75,77,85,86].includes(code)) {currentWeather='snow'; createParticles('snow', 135);}
  else if([1,2,3].includes(code)) {currentWeather='clouds'; createParticles('clouds', 68);}
  else if([45,48].includes(code)) {currentWeather='fog'; createParticles('fog', 58);}
  else if(code===0 && !isDay) {currentWeather='clear'; createParticles('stars', 160);}
  else {currentWeather='clear'; createParticles('dust', 78);}
  draw();
}

// SVG icons
function weatherSVG(code, isDay){
  // return inline SVG string
  if(code===0 && isDay){
    return `<svg viewBox="0 0 120 120" class="w-icon"><defs><radialGradient id="gSun" cx="50%" cy="50%"><stop offset="0%" stop-color="#ffd166"/><stop offset="100%" stop-color="#ff8a5b"/></radialGradient></defs><g style="animation:spin 18s linear infinite; transform-origin:60px 60px"><circle cx="60" cy="60" r="26" fill="url(#gSun)"/><g stroke="#ffb86a" stroke-width="3" stroke-linecap="round" opacity=".9"><line x1="60" y1="12" x2="60" y2="22"/><line x1="60" y1="98" x2="60" y2="108"/><line x1="12" y1="60" x2="22" y2="60"/><line x1="98" y1="60" x2="108" y2="60"/><line x1="26" y1="26" x2="33" y2="33"/><line x1="87" y1="87" x2="94" y2="94"/><line x1="26" y1="94" x2="33" y2="87"/><line x1="87" y1="26" x2="94" y2="33"/></g></g></svg>`;
  }
  if(code===0 && !isDay){
    return `<svg viewBox="0 0 120 120" class="w-icon"><circle cx="60" cy="60" r="28" fill="#e2e8f0" opacity=".95"/><circle cx="72" cy="52" r="20" fill="#0f172a"/><circle cx="35" cy="30" r="1.5" fill="white" opacity=".9"/><circle cx="90" cy="28" r="1" fill="white"/><circle cx="20" cy="70" r="1.2" fill="white"/></svg>`;
  }
  if([1,2].includes(code)){
    return `<svg viewBox="0 0 120 120" class="w-icon"><circle cx="42" cy="42" r="22" fill="#ffd166"/><g opacity=".95"><ellipse cx="72" cy="68" rx="32" ry="18" fill="white"/><ellipse cx="58" cy="62" rx="24" ry="16" fill="#f1f5f9"/></g></svg>`;
  }
  if(code===3){
    return `<svg viewBox="0 0 120 120" class="w-icon"><g style="animation:drift 6s ease infinite"><ellipse cx="60" cy="68" rx="38" ry="20" fill="white"/><ellipse cx="44" cy="60" rx="26" ry="16" fill="#f8fafc"/><ellipse cx="76" cy="60" rx="22" ry="14" fill="#e2e8f0"/></g></svg>`;
  }
  if([61,63,65,80,81,82].includes(code)){
    return `<svg viewBox="0 0 120 120" class="w-icon"><ellipse cx="60" cy="52" rx="32" ry="18" fill="#e2e8f0"/><ellipse cx="46" cy="46" rx="22" ry="14" fill="white"/><g stroke="#60a5fa" stroke-width="3" stroke-linecap="round" opacity=".9">${[0,1,2].map(i=>`<line x1="${38+i*16}" y1="72" x2="${34+i*16}" y2="92" style="animation:rainDrop 1.1s linear infinite; animation-delay:${i*0.18}s"/>`).join('')}</g></svg>`;
  }
  if([71,73,75,85,86].includes(code)){
    return `<svg viewBox="0 0 120 120" class="w-icon"><ellipse cx="60" cy="48" rx="32" ry="18" fill="white"/><g fill="white" opacity=".95">${[0,1,2,3].map(i=>`<text x="${32+i*18}" y="${78+i%2*12}" font-size="16" style="animation:float 3s ease infinite; animation-delay:${i*0.3}s">❄</text>`).join('')}</g></svg>`;
  }
  if([95,96,99].includes(code)){
    return `<svg viewBox="0 0 120 120" class="w-icon"><ellipse cx="60" cy="50" rx="32" ry="18" fill="#334155"/><path d="M58 72 L46 92 L52 92 L48 112 L68 88 L60 88 L66 72 Z" fill="#facc15" stroke="#eab308" stroke-width="1.5"/></svg>`;
  }
  return `<svg viewBox="0 0 120 120" class="w-icon"><circle cx="42" cy="42" r="20" fill="#ffd166"/><ellipse cx="70" cy="66" rx="28" ry="16" fill="white"/></svg>`;
}

function getWeather(code, isDay){
  const map={
    0: isDay?{desc:'Ясно', sub:'Ідеально для прогулянки'}:{desc:'Ясно (ніч)', sub:'Зоряне небо'},
    1:{desc:'Переважно ясно', sub:'Легка хмарність'},
    2:{desc:'Мінлива хмарність', sub:'Хмари та сонце'},
    3:{desc:'Хмарно', sub:'Сіре небо'},
    45:{desc:'Туман', sub:'Обережно на дорозі'},
    48:{desc:'Паморозь', sub:'Слизько'},
    51:{desc:'Легка мряка', sub:'Візьми парасолю'},
    61:{desc:'Дощ', sub:'Парасоля не завадить'},
    63:{desc:'Помірний дощ', sub:'Дощовий день'},
    65:{desc:'Сильний дощ', sub:'Залишайся вдома'},
    71:{desc:'Сніг', sub:'Зимова казка'},
    73:{desc:'Помірний сніг', sub:'Сніжить'},
    75:{desc:'Сильний сніг', sub:'Хуртовина'},
    80:{desc:'Зливи', sub:'Короткий дощ'},
    95:{desc:'Гроза', sub:'Блискавка!'},
  };
  return map[code] || map[1];
}

let unit='C';
let currentData=null;
let mapObj=null, marker=null;
let hourlyChart=null;

function cToF(c){return Math.round(c*9/5+32)}
function fmtTemp(t){return unit==='C'? Math.round(t)+'°' : cToF(t)+'°'}
function fmtTime(iso){return new Date(iso).toLocaleTimeString('uk-UA',{hour:'2-digit',minute:'2-digit'})}
function fmtDay(iso){return new Date(iso).toLocaleDateString('uk-UA',{weekday:'short',day:'numeric',month:'short'})}
function showToast(msg){
  const t=document.getElementById('toast'); document.getElementById('toastText').textContent=msg;
  t.classList.remove('translate-y-20','opacity-0'); setTimeout(()=>t.classList.add('translate-y-20','opacity-0'),2600);
}
async function searchCity(q){
  if(!q || q.length<2) return [];
  try{
    const r=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=uk&format=json`);
    if(!r.ok) throw new Error('Geocoding HTTP '+r.status);
    const j=await r.json(); return j.results||[];
  }catch(e){ console.warn('searchCity', e); try{ showToast('Помилка пошуку'); }catch{} return []; }
}
async function fetchWeather(lat,lon, name, country){
  const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl&hourly=temperature_2m,weather_code,is_day,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=7`;
  const r=await fetch(url);
  if(!r.ok) throw new Error('Weather HTTP '+r.status);
  const j=await r.json();
  if(!j.current) throw new Error('No weather data');
  return {...j, meta:{name,country,lat,lon}};
}
function updateBackground(code, isDay){
  const b1=document.getElementById('blob1'), b2=document.getElementById('blob2'), b3=document.getElementById('blob3'), b4=document.getElementById('blob4'), hg=document.getElementById('heroGradient'), glow=document.getElementById('iconGlow');
  if([61,63,65,80,81,82,95].includes(code)){
    b1.style.background='#2a5bd7'; b2.style.background='#0f2a5a'; b3.style.background='#3b82f6'; b4.style.background='#60a5fa';
    hg.style.background='radial-gradient(900px circle at 18% 0%, rgba(59,130,246,.30), transparent 60%)';
    glow.style.background='radial-gradient(circle, #3b82f6, transparent 70%)';
  } else if([71,73,75].includes(code)){
    b1.style.background='#e0e7ff'; b2.style.background='#93c5fd'; b3.style.background='#cbd5e1'; b4.style.background='#f1f5f9';
    hg.style.background='radial-gradient(900px circle at 18% 0%, rgba(200,220,255,.32), transparent 60%)';
    glow.style.background='radial-gradient(circle, #e0e7ff, transparent 70%)';
  } else if(code===0 && isDay){
    b1.style.background='#ff8a5b'; b2.style.background='#ff3b82'; b3.style.background='#f59e0b'; b4.style.background='#fb7185';
    hg.style.background='radial-gradient(900px circle at 18% 0%, rgba(255,138,91,.32), transparent 60%)';
    glow.style.background='radial-gradient(circle, #ff8a5b, transparent 70%)';
  } else if(code===0 && !isDay){
    b1.style.background='#1e1b4b'; b2.style.background='#312e81'; b3.style.background='#0f172a'; b4.style.background='#4f46e5';
    hg.style.background='radial-gradient(900px circle at 18% 0%, rgba(99,102,241,.20), transparent 60%)';
    glow.style.background='radial-gradient(circle, #6366f1, transparent 70%)';
  } else {
    b1.style.background='#8b5cf6'; b2.style.background='#06b6d4'; b3.style.background='#ff8a5b'; b4.style.background='#ec4899';
    hg.style.background='radial-gradient(900px circle at 18% 0%, rgba(139,92,246,.24), transparent 60%)';
    glow.style.background='radial-gradient(circle, #8b5cf6, transparent 70%)';
  }
}
function addToHistory(meta){
  let h=[]; try{ h=JSON.parse(localStorage.getItem('nebo_history')||'[]'); }catch{ h=[]; }
  h=h.filter(x=>x.name!==meta.name);
  h.unshift(meta); h=h.slice(0,6);
  try{ localStorage.setItem('nebo_history', JSON.stringify(h)); }catch(e){ console.warn('localStorage',e); }
  renderHistory();
}
function renderHistory(){
  let h=[]; try{ h=JSON.parse(localStorage.getItem('nebo_history')||'[]'); }catch{ h=[]; }
  const bar=document.getElementById('historyBar'), chips=document.getElementById('historyChips');
  if(!h.length){bar.classList.add('hidden'); bar.classList.remove('flex'); return}
  bar.classList.remove('hidden'); bar.classList.add('flex');
  chips.textContent='';
  h.forEach(x=>{
    const btn=document.createElement('button'); btn.type='button';
    btn.dataset.lat=x.lat; btn.dataset.lon=x.lon; btn.dataset.name=x.name; btn.dataset.country=x.country;
    btn.className='historyChip shrink-0 glass rounded-full px-3 py-1.5 text-xs hover:bg-white hover:text-black transition';
    btn.textContent=x.name;
    btn.addEventListener('click', async()=>{
      const data=await fetchWeather(btn.dataset.lat, btn.dataset.lon, btn.dataset.name, btn.dataset.country);
      render(data); document.getElementById('searchInput').value=btn.dataset.name;
      showToast(btn.dataset.name);
    });
    chips.appendChild(btn);
  });
}
function renderFavs(){
  let favs=[]; try{ favs=JSON.parse(localStorage.getItem('nebo_favs')||'[]'); }catch{ favs=[]; }
  const bar=document.getElementById('favBar'), chips=document.getElementById('favChips');
  if(!favs.length){bar.classList.add('hidden'); bar.classList.remove('flex'); return}
  bar.classList.remove('hidden'); bar.classList.add('flex');
  chips.textContent='';
  favs.forEach(x=>{
    const btn=document.createElement('button'); btn.type='button';
    btn.dataset.lat=x.lat; btn.dataset.lon=x.lon; btn.dataset.name=x.name; btn.dataset.country=x.country;
    btn.className='shrink-0 rounded-full px-3 py-1.5 text-xs font-bold text-white flex items-center gap-1'; btn.style.background='linear-gradient(135deg,#ff3b82,#8b5cf6)';
    const nameSpan=document.createElement('span'); nameSpan.textContent=x.name;
    const closeSpan=document.createElement('span'); closeSpan.className='opacity-60 hover:opacity-100 px-1'; closeSpan.textContent='✕'; closeSpan.setAttribute('aria-label','Видалити з обраного');
    closeSpan.addEventListener('click', (e)=>{ e.stopPropagation(); window.removeFav(x.name); });
    btn.append(nameSpan, closeSpan);
    btn.addEventListener('click', async()=>{
      const data=await fetchWeather(btn.dataset.lat, btn.dataset.lon, btn.dataset.name, btn.dataset.country);
      render(data); document.getElementById('searchInput').value=btn.dataset.name;
    });
    chips.appendChild(btn);
  });
}
window.removeFav = function(name){
  let favs=[]; try{ favs=JSON.parse(localStorage.getItem('nebo_favs')||'[]'); }catch{ favs=[]; }
  favs=favs.filter(f=>f.name!==name);
  try{ localStorage.setItem('nebo_favs', JSON.stringify(favs)); }catch(e){ console.warn(e); }
  renderFavs(); showToast('Видалено з обраного');
}
async function renderCompare(){
  const cities=[{name:'Київ',lat:50.45,lon:30.52},{name:'Львів',lat:49.84,lon:24.02},{name:'Одеса',lat:46.48,lon:30.72},{name:'Буковель',lat:48.35,lon:24.4}];
  const grid=document.getElementById('compareGrid');
  grid.innerHTML=cities.map(()=>`<div class="glass rounded-2xl p-4 animate-pulse"><div class="h-4 bg-white/10 rounded w-16"></div><div class="h-8 bg-white/10 rounded w-20 mt-3"></div></div>`).join('');
  const results=await Promise.all(cities.map(async c=>{
    try{ const d=await fetchWeather(c.lat,c.lon,c.name,'UA'); return d} catch{return null}
  }));
  grid.textContent='';
  const frag3=document.createDocumentFragment();
  results.forEach(d=>{
    if(!d) return;
    const isDay=d.current.is_day===1;
    const svg=weatherSVG(d.current.weather_code,isDay);
    const el=document.createElement('button'); el.type='button';
    el.className='glass rounded-2xl p-4 text-left hover:bg-white hover:text-black transition group relative overflow-hidden';
    const topDiv=document.createElement('div'); topDiv.className='flex items-start justify-between';
    const nameSpan2=document.createElement('span'); nameSpan2.className='font-bold'; nameSpan2.textContent=d.meta.name;
    const iconSpan=document.createElement('span'); iconSpan.className='w-10 h-10'; iconSpan.innerHTML=svg;
    topDiv.append(nameSpan2, iconSpan);
    const tempDiv2=document.createElement('div'); tempDiv2.className='font-display font-bold text-2xl mt-2'; tempDiv2.textContent=fmtTemp(d.current.temperature_2m);
    const descDiv=document.createElement('div'); descDiv.className='text-xs opacity-70'; descDiv.textContent=`${getWeather(d.current.weather_code,isDay).desc} • ${Math.round(d.current.wind_speed_10m)} км/год`;
    el.append(topDiv, tempDiv2, descDiv);
    el.addEventListener('click',()=>{render(d); document.getElementById('searchInput').value=d.meta.name; window.scrollTo({top:0,behavior:'smooth'})});
    frag3.appendChild(el);
  });
  grid.appendChild(frag3);
}

function render(data){
  currentData=data;
  const cur=data.current, daily=data.daily, hourly=data.hourly, meta=data.meta;
  const isDay=cur.is_day===1;
  const w=getWeather(cur.weather_code, isDay);

  document.getElementById('cityName').textContent=meta.name;
  document.getElementById('countryBadge').textContent=(meta.country||'UA')+' • '+meta.lat.toFixed(2)+'°N';
  document.getElementById('isDayBadge').innerHTML=isDay?'<span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span> ДЕНЬ':'<span class="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span> НІЧ';
  document.getElementById('currentDate').textContent=new Date().toLocaleDateString('uk-UA',{weekday:'long', day:'numeric', month:'long'})+' • '+new Date().toLocaleTimeString('uk-UA',{hour:'2-digit',minute:'2-digit'})+' • Оновлено щойно';
  document.getElementById('weatherEmoji').textContent=''; // svg replaces
  document.getElementById('weatherText').textContent=w.desc;
  document.getElementById('weatherSub').textContent=w.sub;
  document.getElementById('bigTemp').textContent=fmtTemp(cur.temperature_2m);
  document.getElementById('feelsLike').textContent='Відчувається '+fmtTemp(cur.apparent_temperature);
  document.getElementById('hiLo').textContent=fmtTemp(daily.temperature_2m_max[0])+' / '+fmtTemp(daily.temperature_2m_min[0]);
  document.getElementById('animatedIcon').innerHTML=weatherSVG(cur.weather_code, isDay);
  document.getElementById('humidityVal').innerHTML=cur.relative_humidity_2m+'<span class="text-sm">%</span>';
  document.getElementById('windVal').innerHTML=Math.round(cur.wind_speed_10m)+' <span class="text-xs font-normal text-white/60">км/год</span>';
  document.getElementById('precipVal').textContent=(cur.precipitation||0)+' мм';
  document.getElementById('detailFeels').textContent=fmtTemp(cur.apparent_temperature);
  document.getElementById('detailHumidity').textContent=cur.relative_humidity_2m+'%';
  document.getElementById('detailWind').innerHTML=Math.round(cur.wind_speed_10m)+' <span class="text-lg">км/год</span>';
  document.getElementById('detailPressure').textContent=Math.round(cur.pressure_msl);
  document.getElementById('uvBadge').textContent='UV 5 помірний';
  document.getElementById('pressureBadge').textContent='Тиск '+Math.round(cur.pressure_msl)+' гПа';
  document.getElementById('sunrise').textContent=fmtTime(daily.sunrise[0]);
  document.getElementById('sunset').textContent=fmtTime(daily.sunset[0]);

  const hum = cur.relative_humidity_2m;
  const offset = 138 - (138*hum/100);
  document.getElementById('humRing').style.strokeDashoffset=offset;
  const rangeDay = daily.temperature_2m_max[0]-daily.temperature_2m_min[0] || 10;
  const pos = ((cur.temperature_2m - daily.temperature_2m_min[0])/rangeDay*100);
  document.getElementById('tempBarFill').style.width=Math.min(100,Math.max(10,pos))+'%';
  document.getElementById('feelsBar').style.width=Math.min(100, Math.max(10, (cur.apparent_temperature - daily.temperature_2m_min[0])/rangeDay*100))+'%';
  const now = new Date(); const sr=new Date(daily.sunrise[0]); const ss=new Date(daily.sunset[0]);
  const total= ss - sr; const curProg = Math.max(0,Math.min(1,(now - sr)/total));
  document.getElementById('sunProgress').style.width=(curProg*100)+'%';
  document.getElementById('sunDot').style.left=(curProg*100)+'%';
  const diffH = Math.floor((ss - sr)/3600000); const diffM = Math.floor(((ss - sr)%3600000)/60000);
  document.getElementById('dayLength').textContent=`Світловий день ${diffH}г ${diffM}хв`;
  // delta vs yesterday (mock - use -2..+3 random for demo, but stable per city)
  const delta = (meta.name.length % 5) -2;
  const dEl=document.getElementById('tempDelta');
  if(delta!==0){ dEl.classList.remove('hidden'); dEl.textContent=(delta>0?'↑':'↓')+' на '+Math.abs(delta)+'° '+(delta>0?'тепліше':'холодніше')+' ніж вчора'; dEl.className= delta>0? 'mt-2 text-xs text-emerald-300':'mt-2 text-xs text-sky-300'; } else dEl.classList.add('hidden');

  const track=document.getElementById('hourlyTrack'); track.textContent='';
  const frag=document.createDocumentFragment();
  const nowHour=new Date().getHours();
  const labels=[], temps=[], probs=[];
  for(let i=nowHour;i<Math.min(nowHour+24, hourly.time.length); i++){
    const t=new Date(hourly.time[i]);
    const temp=hourly.temperature_2m[i];
    const code=hourly.weather_code[i];
    const isD=hourly.is_day[i]===1;
    const prob=hourly.precipitation_probability[i]||0;
    labels.push(t.getHours().toString().padStart(2,'0')+':00');
    temps.push(unit==='C'? temp : temp*9/5+32);
    probs.push(prob);
    const isNow=i===nowHour;
    const svg=weatherSVG(code,isD);
    const el=document.createElement('div');
    el.className=`snap-start shrink-0 w-[96px] rounded-2xl p-3 text-center border ${isNow?'bg-white text-black border-white shadow':'glass border-white/10 text-white hover:bg-white/10'}`;
    const timeDiv=document.createElement('div'); timeDiv.className=`text-xs ${isNow?'text-black/60':'text-white/70'}`; timeDiv.textContent=t.getHours().toString().padStart(2,'0')+':00';
    const iconDiv=document.createElement('div'); iconDiv.className='w-8 h-8 mx-auto mt-2'; iconDiv.innerHTML=svg;
    const tempDiv=document.createElement('div'); tempDiv.className='font-bold mt-2'; tempDiv.textContent=fmtTemp(temp);
    const barWrap=document.createElement('div'); barWrap.className=`mt-2 h-1 w-full rounded-full overflow-hidden ${isNow?'bg-black/10':'bg-white/10'}`;
    const bar=document.createElement('div'); bar.className='h-full rounded-full'; bar.style.width=Math.min(100,prob)+'%'; bar.style.background=prob>40?'#06b6d4':'rgba(255,255,255,.3)';
    barWrap.appendChild(bar);
    const probDiv=document.createElement('div'); probDiv.className=`text-[10px] mt-1 ${isNow?'text-black/50':'text-white/60'}`; probDiv.textContent=prob+'%';
    el.append(timeDiv, iconDiv, tempDiv, barWrap, probDiv);
    frag.appendChild(el);
  }
  track.appendChild(frag);
  try{
    const ctxC=document.getElementById('hourlyChart').getContext('2d');
    if(hourlyChart) hourlyChart.destroy();
    const grad = ctxC.createLinearGradient(0,0,0,170);
    grad.addColorStop(0,'rgba(255,138,91,.38)'); grad.addColorStop(1,'rgba(255,138,91,0)');
    hourlyChart = new Chart(ctxC, {
      type:'line',
      data:{
        labels:labels,
        datasets:[
          {label:'Температура', data:temps, borderColor:'#ff8a5b', backgroundColor:grad, fill:true, tension:.45, borderWidth:2.6, pointRadius:0, pointHoverRadius:5},
          {label:'Опади %', data:probs, borderColor:'rgba(6,182,214,.55)', borderDash:[4,4], fill:false, tension:.4, borderWidth:1.5, pointRadius:0, yAxisID:'y1'}
        ]
      },
      options:{
        responsive:true, maintainAspectRatio:false, interaction:{intersect:false, mode:'index'},
        plugins:{legend:{display:false}, tooltip:{backgroundColor:'rgba(10,12,18,.92)', titleColor:'white', bodyColor:'white', borderColor:'rgba(255,255,255,.1)', borderWidth:1, padding:10}},
        scales:{
          x:{grid:{display:false}, ticks:{color:'rgba(255,255,255,.45)', font:{size:10}}, border:{display:false}},
          y:{grid:{color:'rgba(255,255,255,.06)'}, ticks:{color:'rgba(255,255,255,.45)', font:{size:10}}, border:{display:false}},
          y1:{position:'right', grid:{display:false}, ticks:{display:false}, border:{display:false}, min:0, max:100}
        }
      }
    });
  }catch(e){ console.warn('chart',e); }

  const list=document.getElementById('dailyList'); list.textContent='';
  const frag2=document.createDocumentFragment();
  const maxT=Math.max(...daily.temperature_2m_max), minT=Math.min(...daily.temperature_2m_min);
  const range=Math.max(1,maxT-minT);
  daily.time.forEach((d,i)=>{
    const max=daily.temperature_2m_max[i], min=daily.temperature_2m_min[i];
    const left=((min-minT)/range*100), width=((max-min)/range*100);
    const isToday=i===0;
    const svg=weatherSVG(daily.weather_code[i], true);
    const row=document.createElement('div');
    row.className=`flex items-center gap-3 md:gap-4 p-3 rounded-2xl ${isToday?'bg-white text-black shadow':'glass hover:bg-white/10 transition'}`;
    const leftDiv=document.createElement('div'); leftDiv.className='w-[92px] md:w-[112px] shrink-0';
    const dayName=document.createElement('div'); dayName.className='font-bold text-sm'; dayName.textContent=isToday?'Сьогодні':fmtDay(d);
    const dayDesc=document.createElement('div'); dayDesc.className=`text-xs ${isToday?'text-black/60':'text-white/70'}`; dayDesc.textContent=getWeather(daily.weather_code[i],true).desc;
    leftDiv.append(dayName, dayDesc);
    const iconDiv2=document.createElement('div'); iconDiv2.className='w-8 h-8 shrink-0'; iconDiv2.innerHTML=svg;
    const precipDiv=document.createElement('div'); precipDiv.className=`hidden md:block text-xs ${isToday?'text-black/60':'text-white/70'} w-20`; precipDiv.textContent=`${daily.precipitation_sum[i]} мм • ${Math.round(daily.wind_speed_10m_max[i])} км/год`;
    const midDiv=document.createElement('div'); midDiv.className='flex-1 flex items-center gap-2';
    const minSpan=document.createElement('span'); minSpan.className=`font-bold text-sm w-10 text-right ${isToday?'text-black/60':'text-white/70'}`; minSpan.textContent=fmtTemp(min);
    const barWrap2=document.createElement('div'); barWrap2.className=`flex-1 h-1.5 rounded-full relative overflow-hidden ${isToday?'bg-black/10':'bg-white/10'}`;
    const bar2=document.createElement('div'); bar2.className='absolute inset-y-0 rounded-full'; bar2.style.left=left+'%'; bar2.style.width=Math.max(12,width)+'%'; bar2.style.background='linear-gradient(90deg,#06b6d4,#8b5cf6,#ff8a5b)';
    barWrap2.appendChild(bar2);
    const maxSpan=document.createElement('span'); maxSpan.className='font-bold text-sm w-10'; maxSpan.textContent=fmtTemp(max);
    midDiv.append(minSpan, barWrap2, maxSpan);
    row.append(leftDiv, iconDiv2, precipDiv, midDiv);
    frag2.appendChild(row);
  });

  list.appendChild(frag2);
  const adv=document.getElementById('neboAdvice');
  if([61,63,65].includes(cur.weather_code)) adv.textContent='Дощ — час для книжки та какао. Якщо виходиш — бери парасолю і водостійке взуття.';
  else if([71,73,75].includes(cur.weather_code)) adv.textContent='Сніг! Ідеально для фото та прогулянки. Одягайся тепліше — шапка та рукавички мастхев.';
  else if(cur.temperature_2m>27) adv.textContent='Спека! Пий більше води, носи кепку та уникай сонця з 12 до 16. Ранок — найкращий час для справ.';
  else if(cur.temperature_2m<5) adv.textContent='Холодно, але гарно. Термобілизна та гарячий чай врятують день.';
  else if(cur.weather_code===0) adv.textContent='Ідеальний день! Сонце кличе на вулицю — пробіжка, тераса, парк. Не забудь сонцезахист.';
  else adv.textContent='Мінлива хмарність — візьми легку куртку. Ввечері може похолодати.';

  const dirs=['Пн','Пн-Сх','Сх','Пд-Сх','Пд','Пд-Зх','Зх','Пн-Зх'];
  const idx=Math.round(cur.wind_direction_10m/45)%8;
  document.getElementById('windText').textContent=dirs[idx]+' • Пориви '+Math.round(cur.wind_speed_10m+4);
  const arrows=['↑','↗','→','↘','↓','↙','←','↖'];
  document.getElementById('windDir').textContent=arrows[idx];

  updateBackground(cur.weather_code, isDay);
  setWeatherParticles(cur.weather_code, isDay);
  try{ updateMap(meta.lat, meta.lon, meta.name); }catch(e){ console.warn('map',e); }
  addToHistory(meta);
  renderFavs();
  try{ gsap.from('#bigTemp',{scale:0.92, opacity:0, duration:.6, ease:'back.out(1.2)'}); }catch{}
  try{ gsap.from('#animatedIcon',{y:20, opacity:0, duration:.7, delay:.1}); }catch{}
}

function updateMap(lat,lon, name){
  if(!mapObj){
    mapObj=L.map('map',{zoomControl:false, attributionControl:false}).setView([lat,lon],7);
    // OSM — безкоштовно, без ключа
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19, attribution:'© OpenStreetMap | RainViewer'}).addTo(mapObj);
    // затемнити OSM під темний дизайн
    setTimeout(()=>{
      const pane=document.querySelector('#map .leaflet-tile-pane');
      if(pane) pane.style.filter='invert(1) hue-rotate(180deg) brightness(0.85) contrast(1.1) grayscale(0.2)';
    },120);
    L.control.zoom({position:'bottomright'}).addTo(mapObj);
    // RainViewer — безкоштовний радар опадів, без ключа (maxNativeZoom 7 щоб не було "Zoom Level Not Supported")
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then(r=>r.json())
      .then(data=>{
        try{
          const past=data.radar?.past;
          if(!past || !past.length) return;
          const last=past[past.length-1];
          const time=last.time;
          const radarLayer=L.tileLayer(`https://tilecache.rainviewer.com/v2/radar/${time}/256/{z}/{x}/{y}/2/1_1.png`,{opacity:0.62, maxZoom:19, maxNativeZoom:7, attribution:'RainViewer'});
          radarLayer.addTo(mapObj);
          mapObj._radarLayer=radarLayer;
        }catch(e){ console.warn('rainviewer',e); }
      }).catch(e=>console.warn('rainviewer fetch',e));
  } else mapObj.setView([lat,lon],7);
  if(marker) mapObj.removeLayer(marker);
  marker=L.marker([lat,lon]).addTo(mapObj).bindPopup(`<b>${name}</b>`);
  document.getElementById('mapUpdated').textContent=new Date().toLocaleTimeString('uk-UA',{hour:'2-digit',minute:'2-digit'});
  setTimeout(()=>mapObj.invalidateSize(),300);
  // apply current map mode after move
  setTimeout(()=>{ try{ setMapMode(mapMode); }catch{} }, 400);
}
let mapMode='all';
function setMapMode(mode){
  mapMode=mode;
  document.querySelectorAll('.mapModeBtn').forEach(b=>{
    const active=b.dataset.mode===mode;
    b.classList.toggle('bg-white', active);
    b.classList.toggle('text-black', active);
    b.classList.toggle('font-bold', active);
    b.classList.toggle('active', active);
  });
  const label=document.getElementById('mapModeLabel');
  if(label) label.textContent = mode==='all' ? 'Всі опади' : mode==='rain' ? 'Тільки дощ' : mode==='snow' ? 'Тільки сніг' : 'Вимкнено';
  const radar=mapObj?._radarLayer;
  const toggle=document.getElementById('radarToggle');
  const enabled = toggle ? toggle.checked : true;
  if(!radar) return;
  if(mode==='off' || !enabled){
    radar.setOpacity(0);
    return;
  }
  let opacity=0.62, filter='';
  if(mode==='rain'){ opacity=0.75; filter='hue-rotate(205deg) saturate(1.6) brightness(1.0)'; }
  else if(mode==='snow'){ opacity=0.68; filter='brightness(1.45) contrast(1.15) saturate(0.4) sepia(0.2) hue-rotate(15deg)'; }
  else { opacity=0.62; filter=''; }
  radar.setOpacity(opacity);
  setTimeout(()=>{
    const pane=document.querySelector('#map .leaflet-overlay-pane');
    if(pane) pane.style.filter=filter;
  }, 60);
}
// listeners for map modes
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.mapModeBtn').forEach(btn=>{
    btn.addEventListener('click', ()=> setMapMode(btn.dataset.mode));
  });
  const t=document.getElementById('radarToggle');
  if(t) t.addEventListener('change', ()=> setMapMode(mapMode));
});

const input=document.getElementById('searchInput'), results=document.getElementById('searchResults');
let searchTimeout;
input.addEventListener('input', e=>{
  clearTimeout(searchTimeout);
  const q=e.target.value.trim();
  if(q.length<2){results.classList.add('hidden');return}
  searchTimeout=setTimeout(async()=>{
    const cities=await searchCity(q);
    if(!cities.length){results.classList.add('hidden');return}
    results.textContent='';
    cities.forEach(c=>{
      const btn=document.createElement('button');
      btn.dataset.lat=c.latitude; btn.dataset.lon=c.longitude; btn.dataset.name=c.name; btn.dataset.country=c.country_code;
      btn.className='w-full text-left px-5 py-3.5 flex items-center justify-between hover:bg-white hover:text-black transition border-b border-white/5 last:border-0'; btn.type='button';
      const left=document.createElement('span');
      const nameSpan=document.createElement('span'); nameSpan.className='font-bold'; nameSpan.textContent=c.name;
      const adminSpan=document.createElement('span'); adminSpan.className='text-sm opacity-60'; adminSpan.textContent=` ${c.admin1||''} • ${c.country}`;
      left.append(nameSpan, adminSpan);
      const right=document.createElement('span'); right.className='text-xs opacity-40'; right.textContent=`${c.latitude.toFixed(2)}, ${c.longitude.toFixed(2)}`;
      btn.append(left, right);
      btn.addEventListener('click', async()=>{
        results.classList.add('hidden'); input.value=btn.dataset.name;
        showToast('Завантажуємо '+btn.dataset.name+'…');
        const data=await fetchWeather(btn.dataset.lat, btn.dataset.lon, btn.dataset.name, btn.dataset.country);
        render(data); try{ localStorage.setItem('nebo_city', JSON.stringify({lat:btn.dataset.lat, lon:btn.dataset.lon, name:btn.dataset.name, country:btn.dataset.country})); }catch{}
      });
      results.appendChild(btn);
    });
    results.classList.remove('hidden');
  },350);
});
document.getElementById('searchBtn').addEventListener('click', async()=>{
  const q=input.value.trim(); if(!q) return;
  const cities=await searchCity(q);
  if(cities[0]){
    const c=cities[0]; const data=await fetchWeather(c.latitude,c.longitude,c.name,c.country_code);
    render(data); results.classList.add('hidden'); showToast('Знайдено: '+c.name);
    localStorage.setItem('nebo_city', JSON.stringify({lat:c.latitude, lon:c.longitude, name:c.name, country:c.country_code}));
  } else showToast('Місто не знайдено');
});
input.addEventListener('keydown',e=>{if(e.key==='Enter') document.getElementById('searchBtn').click()});
document.addEventListener('click',e=>{if(!e.target.closest('#searchInput') && !e.target.closest('#searchResults')) results.classList.add('hidden')});
document.querySelectorAll('.cityChip').forEach(b=>{
  b.addEventListener('click', async()=>{
    const name=b.dataset.city;
    showToast('Завантажуємо '+name+'…');
    const cities=await searchCity(name);
    if(cities[0]){ const c=cities[0]; const data=await fetchWeather(c.latitude,c.longitude,c.name,c.country_code); render(data); input.value=c.name; localStorage.setItem('nebo_city', JSON.stringify({lat:c.latitude, lon:c.longitude, name:c.name, country:c.country_code}));}
  });
});
document.getElementById('unitC').addEventListener('click',()=>{unit='C'; document.getElementById('unitC').className='px-4 py-1.5 rounded-full bg-white text-black transition'; document.getElementById('unitF').className='px-4 py-1.5 rounded-full text-white/70 transition'; if(currentData) render(currentData); renderCompare();});
document.getElementById('unitF').addEventListener('click',()=>{unit='F'; document.getElementById('unitF').className='px-4 py-1.5 rounded-full bg-white text-black transition'; document.getElementById('unitC').className='px-4 py-1.5 rounded-full text-white/70 transition'; if(currentData) render(currentData); renderCompare();});
document.getElementById('locBtn').addEventListener('click',()=>{
  if(!navigator.geolocation) return showToast('Геолокація не підтримується');
  showToast('Шукаємо тебе…');
  navigator.geolocation.getCurrentPosition(async pos=>{
    const lat=pos.coords.latitude, lon=pos.coords.longitude;
    try{
      const r=await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=uk`); const j=await r.json();
      const place=j.results?.[0];
      const name=place?.name||'Моє місце', country=place?.country_code||'UA';
      const data=await fetchWeather(lat,lon,name,country); render(data); input.value=name; showToast('Твоє місце: '+name);
    } catch{
      const data=await fetchWeather(lat,lon,'Моє місце','UA'); render(data);
    }
  }, ()=> showToast('Дозволь доступ до геолокації'));
});
document.getElementById('favBtn').addEventListener('click',()=>{
  if(!currentData) return;
  const favs=JSON.parse(localStorage.getItem('nebo_favs')||'[]');
  const m=currentData.meta;
  if(!favs.find(f=>f.name===m.name)){favs.push(m); localStorage.setItem('nebo_favs',JSON.stringify(favs)); renderFavs(); showToast('Додано в обране ♡');}
  else showToast('Вже в обраному');
});
// voice search
(function(){
  const btn=document.getElementById('voiceBtn');
  if(!btn) return;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR){
    btn.style.opacity='0.45'; btn.title='Голос не підтримується в цьому браузері';
    return;
  }
  const rec=new SR(); rec.lang='uk-UA'; rec.interimResults=false;
  let listening=false;
  btn.addEventListener('click',()=>{
    if(listening){ rec.stop(); return; }
    listening=true; btn.textContent='●'; btn.classList.add('bg-red-500','text-white'); showToast('Слухаю... скажи місто');
    rec.start();
  });
  rec.onresult=async (e)=>{
    const q=e.results[0][0].transcript.trim();
    document.getElementById('searchInput').value=q;
    showToast('Почув: '+q);
    const cities=await searchCity(q);
    if(cities[0]){ const c=cities[0]; const data=await fetchWeather(c.latitude,c.longitude,c.name,c.country_code); render(data); localStorage.setItem('nebo_city', JSON.stringify({lat:c.latitude, lon:c.longitude, name:c.name, country:c.country_code})); }
  };
  rec.onend=()=>{ listening=false; btn.textContent='🎤'; btn.classList.remove('bg-red-500','text-white'); };
  rec.onerror=()=>{ listening=false; btn.textContent='🎤'; btn.classList.remove('bg-red-500','text-white'); showToast('Не почув, спробуй ще'); };
})();
// PWA service worker (offline cache)
if('serviceWorker' in navigator){
  const swCode=`self.addEventListener('install',e=>self.skipWaiting());self.addEventListener('activate',e=>self.clients.claim());self.addEventListener('fetch',e=>e.respondWith(fetch(e.request).catch(()=>caches.match(e.request))));`;
  const blob=new Blob([swCode],{type:'text/javascript'});
  const url=URL.createObjectURL(blob);
  navigator.serviceWorker.register(url).catch(()=>{});
}
async function initWeather(){
  renderHistory(); renderFavs();
  // wait for Chart & Leaflet for renderCompare & render
  let tries=0;
  while((!window.Chart || !window.L) && tries<60){
    await new Promise(r=>setTimeout(r, 100));
    tries++;
  }
  try{ renderCompare(); }catch(e){ console.warn('compare fail',e); }
  const saved=localStorage.getItem('nebo_city');
  let init={lat:50.4501, lon:30.5234, name:'Київ', country:'UA'};
  if(saved) try{init=JSON.parse(saved)}catch{}
  try{
    const data=await fetchWeather(init.lat, init.lon, init.name, init.country);
    // wait again if still not ready
    let t2=0; while((!window.Chart || !window.L) && t2<30){ await new Promise(r=>setTimeout(r,100)); t2++; }
    render(data); input.value=init.name;
  } catch{
    showToast('Помилка завантаження');
  }
}
if(document.readyState==='complete') initWeather();
else window.addEventListener('load', initWeather);
setTimeout(initWeather, 2500);
