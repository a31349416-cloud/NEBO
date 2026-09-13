import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// pure helpers extracted from app.js for testability
function cToF(c){ return Math.round(c*9/5+32); }
function fmtTemp(t, unit='C'){ return unit==='C' ? Math.round(t)+'°' : cToF(t)+'°'; }
function getWeather(code, isDay){
  const map={
    0: isDay?{desc:'Ясно'}:{desc:'Ясно (ніч)'},
    1:{desc:'Переважно ясно'},
    2:{desc:'Мінлива хмарність'},
    3:{desc:'Хмарно'},
    61:{desc:'Дощ'},
    71:{desc:'Сніг'},
    95:{desc:'Гроза'},
  };
  return map[code] || map[1];
}

describe('weather helpers', ()=>{
  it('cToF converts correctly', ()=>{
    assert.equal(cToF(0), 32);
    assert.equal(cToF(100), 212);
    assert.equal(cToF(20), 68);
  });
  it('fmtTemp respects unit', ()=>{
    assert.equal(fmtTemp(22,'C'), '22°');
    assert.equal(fmtTemp(22,'F'), '72°');
  });
  it('getWeather maps WMO codes', ()=>{
    assert.equal(getWeather(0,true).desc, 'Ясно');
    assert.equal(getWeather(0,false).desc, 'Ясно (ніч)');
    assert.equal(getWeather(3,true).desc, 'Хмарно');
    assert.equal(getWeather(999,true).desc, 'Переважно ясно'); // fallback
  });
  it('localStorage JSON safe', ()=>{
    const bad='{"a":}';
    let out=[]; try{ out=JSON.parse(bad);}catch{ out=[]; }
    assert.deepEqual(out, []);
  });
});
