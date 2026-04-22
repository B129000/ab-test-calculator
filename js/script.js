const STRINGS = {
  en: {
    tie:        'Tie — no clear winner',
    vA:         'Version A (Control) leads',
    vB:         'Version B (Variant) leads',
    awaitDesc:  'Enter your data',
    higherRate: p => `${p}% higher conversion rate`,
    lowerRate:  p => `${p}% lower conversion rate`,
    equalRate:  'Same conversion rate',
    tsigYes:    () => 'Reliable',
    tsigNo:     () => 'Not reliable',
    whoA:       'Version A (Control) has a higher conversion rate.',
    whoB:       'Version B (Variant) has a higher conversion rate.',
    whoTie:     'Both versions have the same conversion rate.',
    rowSig: (c, chance, who) =>
      `At ${c}% confidence, there is only a ${chance}% chance this difference happened by chance. Your results are strong enough to act on. ${who}`,
    rowNot: (c, chance) =>
      `At ${c}% confidence, there is still a ${chance}% chance this difference happened by chance. Collect more data before deciding.`,
    rec:   { 80:'Quick or low-stakes tests', 90:'Most routine A/B tests', 95:'Important decisions', 99:'High-impact or high-risk changes' },
    guide: {
      80: 'You accept a 20% chance the result is random. Good for fast, directional tests where the cost of being wrong is low.',
      90: 'A reliable balance of speed and confidence. A common choice for everyday experiments.',
      95: 'The standard for most web experiments. Only a 5% chance the result is due to chance.',
      99: 'Use when a wrong decision would be costly or hard to reverse. Requires more data to reach this threshold.',
    },
  },
  fr: {
    tie:        'Égalité — pas de gagnant clair',
    vA:         'Version A (Témoin) en tête',
    vB:         'Version B (Variante) en tête',
    awaitDesc:  'Entrez vos données',
    higherRate: p => `Taux de conversion ${p} % plus élevé`,
    lowerRate:  p => `Taux de conversion ${p} % plus bas`,
    equalRate:  'Même taux de conversion',
    tsigYes:    () => 'Fiable',
    tsigNo:     () => 'Non fiable',
    whoA:       'La version A (Témoin) a un taux de conversion plus élevé.',
    whoB:       'La version B (Variante) a un taux de conversion plus élevé.',
    whoTie:     'Les deux versions ont le même taux de conversion.',
    rowSig: (c, chance, who) =>
      `À ${c} % de confiance, il n'y a que ${chance} % de chance que cette différence soit due au hasard. Vos résultats sont fiables. ${who}`,
    rowNot: (c, chance) =>
      `À ${c} % de confiance, il y a encore ${chance} % de chance que cette différence soit due au hasard. Collectez plus de données avant de décider.`,
    rec:   { 80:'Tests rapides ou à faible risque', 90:'La plupart des tests A/B courants', 95:'Décisions importantes', 99:'Changements à fort impact ou à risque élevé' },
    guide: {
      80: 'Vous acceptez 20 % de chance que le résultat soit aléatoire. Bon pour des tests rapides où le coût d\'une erreur est faible.',
      90: 'Un bon équilibre entre rapidité et confiance pour les tests courants.',
      95: 'La norme pour la plupart des expériences web. Seulement 5 % de chance que le résultat soit dû au hasard.',
      99: 'À utiliser quand une mauvaise décision serait coûteuse. Nécessite plus de données.',
    },
  }
};

const html = document.documentElement;
const $    = s => document.querySelector(s);
const lang = () => html.getAttribute('data-lang') || 'en';
const s    = () => STRINGS[lang()];
const fmtPct = (x, dp=2) => isFinite(x) ? (100*x).toFixed(dp) + '%' : '—';

/* ── Apply saved language preference ── */
(function() {
  const saved = localStorage.getItem('ca-analytics-lang');
  if (saved && saved !== lang()) {
    html.setAttribute('data-lang', saved);
    html.setAttribute('lang', saved);
  }
})();

function flash(el) {
  if (!el) return;
  // Force reflow so the CSS animation restarts even if the class is already present.
  el.classList.remove('updated'); void el.offsetWidth; el.classList.add('updated');
}

function updateRates() {
  const nA = Number($('#visA').value), xA = Number($('#convA').value);
  const nB = Number($('#visB').value), xB = Number($('#convB').value);
  const pA = (nA > 0 && xA <= nA && xA >= 0) ? xA / nA : NaN;
  const pB = (nB > 0 && xB <= nB && xB >= 0) ? xB / nB : NaN;
  const rA = $('#rateA'), rB = $('#rateB');
  const newA = fmtPct(pA), newB = fmtPct(pB);
  if (rA.textContent !== newA) { rA.textContent = newA; flash(rA); }
  if (rB.textContent !== newB) { rB.textContent = newB; flash(rB); }
}

['visA','convA','visB','convB'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => { updateRates(); compute(); });
});

function wireHoverTooltips() {
  document.querySelectorAll('.tt').forEach(el => {
    let tip;
    const show = () => {
      const L = lang();
      const title = el.getAttribute(`data-tip-title-${L}`) || el.getAttribute('data-tip-title-en') || 'Help';
      const text  = el.getAttribute(`data-tip-${L}`)       || el.getAttribute('data-tip-en')       || '';
      if (!tip) { tip = document.createElement('div'); tip.className = 'tooltip'; el.appendChild(tip); }
      tip.innerHTML = `<span class="title">${title}</span>${text}`;
      tip.setAttribute('data-show', 'true');
    };
    const hide = () => { if (tip) tip.setAttribute('data-show', 'false'); };
    el.addEventListener('mouseenter', show);
    el.addEventListener('mouseleave', hide);
    el.addEventListener('focus',      show);
    el.addEventListener('blur',       hide);
    el.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
  });
}

$('#lang-toggle').addEventListener('click', () => {
  const isFr = lang() === 'fr';
  const newLang = isFr ? 'en' : 'fr';
  html.setAttribute('data-lang', newLang);
  html.setAttribute('lang', newLang);
  localStorage.setItem('ca-analytics-lang', newLang);
  compute();
});

// Normal CDF approximation — Abramowitz & Stegun (1964) formula 26.2.17.
// Max error < 7.5e-8. Called once in compute() to derive the two-tailed p-value.
function phi(x) {
  const b1=0.319381530,b2=-0.356563782,b3=1.781477937,b4=-1.821255978,b5=1.330274429,p=0.2316419,c=0.39894228;
  const t=1/(1+p*Math.abs(x)),z=c*Math.exp(-x*x/2)*((((b5*t+b4)*t+b3)*t+b2)*t+b1)*t,r=1-z;
  return x>=0 ? r : 1-r;
}

function compute() {
  const nA=Number($('#visA').value), xA=Number($('#convA').value),
        nB=Number($('#visB').value), xB=Number($('#convB').value);
  const errA = xA > nA || nA < 0 || xA < 0;
  const errB = xB > nB || nB < 0 || xB < 0;
  ['visA','convA','visB','convB'].forEach((id,i) => $('#'+id).classList.toggle('err', i<2 ? errA : errB));
  if (errA || errB) {
    ['#rateA','#rateB','#improve','#abs-diff','#pooled','#se','#z','#p']
      .forEach(id => $(id) && ($(id).textContent = '—'));
    $('#winner-desc').textContent = s().awaitDesc;
    $('#tbody').innerHTML = '';
    return;
  }
  const pA = nA > 0 ? xA / nA : NaN;
  const pB = nB > 0 ? xB / nB : NaN;
  $('#rateA').textContent = fmtPct(pA); flash($('#rateA'));
  $('#rateB').textContent = fmtPct(pB); flash($('#rateB'));
  const lift    = (isFinite(pA) && pA > 0 && isFinite(pB)) ? (pB - pA) / pA : NaN;
  const absDiff = (isFinite(pA) && isFinite(pB)) ? pB - pA : NaN;
  const improveEl = $('#improve'), absDiffEl = $('#abs-diff');
  if (isFinite(lift)) {
    improveEl.textContent = (lift > 0 ? '+' : '') + (100*lift).toFixed(2) + '%';
    improveEl.className = 'result-val' + (lift > 0 ? ' positive' : lift < 0 ? ' negative' : '');
  } else { improveEl.textContent = '—'; improveEl.className = 'result-val'; }
  if (isFinite(absDiff)) {
    absDiffEl.textContent = (absDiff >= 0 ? '+' : '') + (absDiff*100).toFixed(2) + ' pp';
    absDiffEl.className = 'result-val' + (absDiff > 0 ? ' positive' : absDiff < 0 ? ' negative' : '');
  } else { absDiffEl.textContent = '—'; absDiffEl.className = 'result-val'; }
  flash(improveEl); flash(absDiffEl);
  // SE is undefined when pooled is 0 or 1 (no variance) or either group is empty.
  const pooled = (nA+nB) > 0 ? (xA+xB)/(nA+nB) : NaN;
  const se     = (isFinite(pooled) && pooled > 0 && pooled < 1 && nA > 0 && nB > 0)
                 ? Math.sqrt(pooled*(1-pooled)*(1/nA+1/nB)) : NaN;
  const z      = (isFinite(se) && se > 0 && isFinite(pA) && isFinite(pB)) ? (pB-pA)/se : 0;
  const pval   = isFinite(z) ? 2*(1-phi(Math.abs(z))) : NaN;
  [$('#pooled'),$('#se'),$('#z'),$('#p')].forEach(flash);
  $('#pooled').textContent = fmtPct(pooled);
  $('#se').textContent     = isFinite(se)   ? se.toFixed(4)   : '—';
  $('#z').textContent      = isFinite(z)    ? z.toFixed(2)    : '—';
  $('#p').textContent      = isFinite(pval) ? pval.toFixed(4) : '—';
  const S = s(), isTie = !isFinite(pA)||!isFinite(pB)||pA===pB, aWins = !isTie&&pA>pB;
  $('#winner-block').className = 'winner-block '+(isTie?'tie':(aWins?'version-a-wins':'version-b-wins'));
  $('#winner').textContent = isTie?S.tie:(aWins?S.vA:S.vB);
  const pct = isFinite(lift) ? Math.abs(100*lift).toFixed(2) : null;
  $('#winner-desc').textContent = pct ? (lift>=0?S.higherRate(pct):S.lowerRate(pct)) : S.equalRate;
  const tbody = $('#tbody');
  tbody.innerHTML = '';
  for (const conf of [0.80,0.90,0.95,0.99]) {
    const chance=1-conf, pct100=Math.round(conf*100), chance100=Math.round(chance*100);
    const significant = isFinite(pval) && pval < chance;
    const who = isTie?S.whoTie:(aWins?S.whoA:S.whoB);
    const tr=document.createElement('tr');
    const td1=document.createElement('td'); td1.textContent=`${pct100}%`;
    const td2=document.createElement('td');
    td2.innerHTML=significant?`<span class="tsig ok">${S.tsigYes()}</span>`:`<span class="tsig no">${S.tsigNo()}</span>`;
    const td3=document.createElement('td'); td3.textContent=significant?S.rowSig(pct100,chance100,who):S.rowNot(pct100,chance100);
    const td4=document.createElement('td'); td4.textContent=S.rec[pct100];
    const td5=document.createElement('td'); td5.textContent=S.guide[pct100];
    tr.append(td1,td2,td3,td4,td5); tbody.appendChild(tr);
  }
}

wireHoverTooltips();
compute();
