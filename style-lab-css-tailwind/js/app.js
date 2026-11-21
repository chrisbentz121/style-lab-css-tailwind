(() => {
  const $ = (s) => document.querySelector(s)
  const store = { get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} } }
  const pills = (el, opts, cur, fn) => { el.innerHTML = opts.map((o) => `<button class="sl-pill" aria-pressed="${o === cur}">${o}</button>`).join(''); el.onclick = (e) => { const b = e.target.closest('button'); if (b) fn(b.textContent) } }
  const clone = (o) => JSON.parse(JSON.stringify(o))

  /* ===== 1. MOTOR DEL GIST: cada fila se convierte en una clase CSS real ===== */
  const rows = window.GIST
  const decls = (r) => r.decl.replace(/^>/, '').split(';').filter(Boolean).map((s) => { const i = s.indexOf(':'); return [s.slice(0, i).trim(), s.slice(i + 1).trim()] })
  const supported = (r) => decls(r).some(([p, v]) => CSS.supports(p, v))
  const esc = (c) => c.replace(/[^\w-]/g, '\\$&')
  const sheet = document.createElement('style')
  sheet.id = 'gist-css'
  sheet.textContent = rows.map((r) => (r.decl[0] === '>' ? `.${esc(r.tw)} > *{${r.decl.slice(1)}}` : `.${esc(r.tw)}{${r.decl}}`)).join('\n')
  document.head.appendChild(sheet)

  /* ===== 2. NAV + REVEAL ===== */
  $('#burger').onclick = (e) => { const o = $('#nav').classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', o) }
  $('#nav').onclick = (e) => e.target.tagName === 'A' && $('#nav').classList.remove('open')
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), { threshold: 0.08 }) : null
  document.querySelectorAll('.sl-sec').forEach((s) => { s.classList.add('sl-reveal'); io ? io.observe(s) : s.classList.add('in') })

  /* ===== 3. DATOS ===== */
  const COLORS = { black: '#1b1b1b', ivory: '#f3ece0', camel: '#c19a6b', navy: '#1f2a44', olive: '#6b705c', burgundy: '#6d1f2f', blush: '#e8b4b8', cobalt: '#2f5bea' }
  const STYLES = ['Minimalist', 'Streetwear', 'Casual', 'Elegant', 'Old money', 'Contemporary']
  const INFO = { Minimalist: 'Clean lines, neutral palette, zero noise.', Streetwear: 'Oversized fits, sneakers and graphic attitude.', Casual: 'Easy, breathable pieces from brunch to errands.', Elegant: 'Tailored silhouettes, rich fabrics, deliberate details.', 'Old money': 'Quiet luxury: camel, navy, ivory and loafers.', Contemporary: 'Mixed proportions and bold colour pops.' }
  const QUIZ = [['Your ideal Saturday?', ['Gallery stroll', 'Skate park', 'Brunch with friends', 'Opera night', 'Polo club', 'Pop-up market']], ['Pick a fabric', ['Cotton poplin', 'Heavy fleece', 'Soft jersey', 'Silk satin', 'Cashmere', 'Technical nylon']], ['Pick a word', ['Pure', 'Loud', 'Easy', 'Refined', 'Timeless', 'Playful']]]
  const OUTFITS = [
    { id: 1, name: 'Gallery Monday', occ: 'Work', sea: 'Autumn', sty: 'Minimalist', pal: ['ivory', 'black', 'camel'] },
    { id: 2, name: 'Concrete Pulse', occ: 'Weekend', sea: 'Winter', sty: 'Streetwear', pal: ['black', 'cobalt', 'ivory'] },
    { id: 3, name: 'Sunday Linen', occ: 'Weekend', sea: 'Summer', sty: 'Casual', pal: ['ivory', 'olive', 'blush'] },
    { id: 4, name: 'Opera Velvet', occ: 'Formal', sea: 'Winter', sty: 'Elegant', pal: ['burgundy', 'black', 'blush'] },
    { id: 5, name: 'Club House', occ: 'Travel', sea: 'Spring', sty: 'Old money', pal: ['navy', 'camel', 'ivory'] },
    { id: 6, name: 'Colour Riot', occ: 'Party', sea: 'Summer', sty: 'Contemporary', pal: ['cobalt', 'blush', 'olive'] },
    { id: 7, name: 'Quiet Office', occ: 'Work', sea: 'Spring', sty: 'Old money', pal: ['camel', 'navy', 'ivory'] },
    { id: 8, name: 'After Dark', occ: 'Party', sea: 'Autumn', sty: 'Elegant', pal: ['black', 'burgundy', 'camel'] },
  ]
  const TIPS = [['Trends', 'Quiet colour', 'Muted camel, olive and ivory replace loud logos this season.'], ['Trends', 'Cobalt accents', 'One electric cobalt piece lifts a neutral outfit.'], ['Tips', 'Rule of three', 'Max three colours per look: base, support, accent.'], ['Tips', 'Know your undertone', 'Silver vs gold jewellery hints at cool or warm skin.'], ['Combos', 'Navy + camel + ivory', 'A timeless trio for work, travel and dinners.'], ['Combos', 'Black + burgundy + blush', 'Evening depth with a soft highlight.']]
  const TONES = { Warm: ['Golden or peachy skin: earthy, rich colours glow.', ['camel', 'olive', 'burgundy', 'ivory']], Cool: ['Pink or bluish skin: jewel and crisp tones flatter.', ['navy', 'cobalt', 'blush', 'black']], Neutral: ['Balanced skin: try soft contrasts.', ['ivory', 'olive', 'navy', 'burgundy']] }
  const EMAIL = 'hello@stylelab.dev'

  /* ===== 4. OUTFIT STUDIO ===== */
  const SLOTS = [['top', 'Top', ['Tee', 'Shirt', 'Turtleneck']], ['bottom', 'Bottom', ['Trousers', 'Skirt', 'Shorts']], ['shoes', 'Shoes', ['Boots', 'Sneakers', 'Loafers']], ['acc', 'Accessory', ['None', 'Hat', 'Bag']]]
  const TOP = ['M60 70h80l22 40-20 8-8-14v60H66v-60l-8 14-20-8z', 'M60 70h80l30 90-18 6-16-50v60H64v-60l-16 50-18-6z']
  const BOT = ['M66 170h68l6 150h-30l-10-100-10 100H60z', 'M66 170h68l24 120H42z', 'M66 170h68l8 80H58z']
  const INIT = { top: [0, 'ivory'], bottom: [0, 'navy'], shoes: [2, 'black'], acc: [1, 'camel'] }
  let look = store.get('look', clone(INIT)), saved = store.get('saved', [])
  $('#studio-box').innerHTML = `<svg id="man" class="sl-mannequin" viewBox="0 0 200 360" role="img" aria-label="Outfit preview"></svg><div class="sl-ctrl">${SLOTS.map(([k, l, o]) => `<fieldset><legend>${l}</legend><select data-k="${k}" aria-label="${l} style">${o.map((x, i) => `<option value="${i}">${x}</option>`).join('')}</select><div class="sl-dots">${Object.entries(COLORS).map(([n, h]) => `<button data-k="${k}" data-c="${n}" aria-label="${n}" style="background:${h}"></button>`).join('')}</div></fieldset>`).join('')}<div class="sl-row"><button class="sl-btn" id="surprise">Surprise me</button><button class="sl-btn ghost" id="reset">Reset</button><button class="sl-btn ghost" id="save">Save look</button></div><div id="saved"></div></div>`
  const f = (k) => COLORS[look[k][1]]
  function drawLook() {
    const sh = [[17, 14], [22, 9], [19, 8]][look.shoes[0]]
    $('#man').innerHTML = `<circle cx="100" cy="42" r="22" fill="#d9b99b"/>` +
      (look.acc[0] === 1 ? `<rect x="66" y="14" width="68" height="12" rx="4" fill="${f('acc')}"/>` : '') +
      (look.acc[0] === 2 ? `<rect x="150" y="190" width="32" height="40" rx="4" fill="${f('acc')}"/>` : '') +
      `<path d="${BOT[look.bottom[0]]}" fill="${f('bottom')}"/><path d="${TOP[look.top[0] ? 1 : 0]}" fill="${f('top')}"/>` +
      (look.top[0] === 2 ? `<rect x="86" y="58" width="28" height="18" rx="4" fill="${f('top')}"/>` : '') +
      [76, 124].map((x) => `<ellipse cx="${x}" cy="334" rx="${sh[0]}" ry="${sh[1]}" fill="${f('shoes')}"/>`).join('')
    document.querySelectorAll('#studio-box select').forEach((s) => (s.value = look[s.dataset.k][0]))
    document.querySelectorAll('.sl-dots button').forEach((b) => b.setAttribute('aria-pressed', look[b.dataset.k][1] === b.dataset.c))
    $('#saved').innerHTML = saved.map((s, i) => `<span class="sl-chip"><button data-load="${i}">Look ${i + 1} ${SLOTS.map(([k]) => `<i style="background:${COLORS[s[k][1]]}"></i>`).join('')}</button><button data-del="${i}" aria-label="Delete look ${i + 1}">×</button></span>`).join('')
    store.set('look', look); store.set('saved', saved)
  }
  $('#studio-box').addEventListener('change', (e) => { if (e.target.dataset.k) { look[e.target.dataset.k][0] = +e.target.value; drawLook() } })
  $('#studio-box').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return
    if (b.dataset.c) look[b.dataset.k][1] = b.dataset.c
    else if (b.id === 'surprise') look = Object.fromEntries(SLOTS.map(([k]) => [k, [Math.floor(Math.random() * 3), Object.keys(COLORS)[Math.floor(Math.random() * 8)]]]))
    else if (b.id === 'reset') look = clone(INIT)
    else if (b.id === 'save') saved.push(clone(look))
    else if (b.dataset.load) look = clone(saved[b.dataset.load])
    else if (b.dataset.del) saved.splice(b.dataset.del, 1)
    drawLook()
  })
  drawLook()

  /* ===== 5. COLORIMETRÍA ===== */
  const toHsl = (h) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255); const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, L = (mx + mn) / 2; let H = 0, S = 0; if (d) { S = d / (1 - Math.abs(2 * L - 1)); H = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; H = (H * 60 + 360) % 360 } return [H, S, L] }
  const toHex = (h, s, l) => { const a = s * Math.min(l, 1 - l); const k = (n) => { const q = (n + h / 30) % 12; return Math.round(255 * (l - a * Math.max(-1, Math.min(q - 3, 9 - q, 1)))).toString(16).padStart(2, '0') }; return '#' + k(0) + k(8) + k(4) }
  const HARM = { Complementary: [0, 180], Analogous: [-30, 0, 30], Triadic: [0, 120, 240], Monochrome: [0] }
  let mode = 'Analogous', tone = 'Warm'
  const sws = (el, list) => { el.innerHTML = list.map((x) => `<button class="sl-sw" data-hex="${x}" style="background:${x}" aria-label="Copy ${x}"><span>${x}</span></button>`).join('') }
  function drawColour() {
    const [h, s, l] = toHsl($('#base').value)
    sws($('#harm-sws'), mode === 'Monochrome' ? [0.2, 0.35, 0.5, 0.7, 0.88].map((x) => toHex(h, s, x)) : HARM[mode].flatMap((o) => [toHex((h + o + 360) % 360, s, l), toHex((h + o + 360) % 360, s * 0.6, Math.min(0.9, l + 0.25))]))
    pills($('#harm'), Object.keys(HARM), mode, (m) => { mode = m; drawColour() })
    pills($('#tone'), Object.keys(TONES), tone, (t) => { tone = t; drawColour() })
    $('#tone-note').textContent = TONES[tone][0]
    sws($('#tone-sws'), TONES[tone][1].map((n) => COLORS[n]))
  }
  $('#base').oninput = drawColour
  $('#colour').addEventListener('click', (e) => { const b = e.target.closest('.sl-sw'); if (!b) return; navigator.clipboard?.writeText(b.dataset.hex).catch(() => {}); b.querySelector('span').textContent = 'Copied'; setTimeout(() => (b.querySelector('span').textContent = b.dataset.hex), 1200) })
  drawColour()

  /* ===== 6. STYLE FINDER ===== */
  let ans = [], gStyle = 'All'
  function drawFinder() {
    const box = $('#finder-box')
    if (ans.length < QUIZ.length) {
      const [q, o] = QUIZ[ans.length]
      box.innerHTML = `<p class="sl-q">${ans.length + 1}/${QUIZ.length} — ${q}</p><div class="sl-row">${o.map((x, i) => `<button class="sl-pill" data-a="${i}">${x}</button>`).join('')}</div>`
    } else {
      const c = STYLES.map((_, i) => ans.filter((a) => a === i).length), res = STYLES[c.indexOf(Math.max(...c))]
      box.innerHTML = `<div class="sl-result"><p class="sl-kicker">Your style</p><h3>${res}</h3><p>${INFO[res]}</p><div class="sl-row"><a class="sl-btn" href="#gallery" data-res="${res}">See ${res} outfits</a><button class="sl-btn ghost" id="retake">Retake</button></div></div>`
    }
  }
  $('#finder-box').addEventListener('click', (e) => {
    const b = e.target.closest('button,a'); if (!b) return
    if (b.dataset.a) ans.push(+b.dataset.a)
    else if (b.id === 'retake') ans = []
    else if (b.dataset.res) { gStyle = b.dataset.res; drawGallery(); return }
    drawFinder()
  })
  drawFinder()

  /* ===== 7. GALERÍA ===== */
  const F = { occ: 'All', sea: 'All', col: 'All' }
  let favs = store.get('favs', []), onlyFav = false
  const uniq = (k) => [...new Set(OUTFITS.map((o) => o[k]))]
  const sel = (id, l, opts, v) => `<label class="sl-lab">${l}<select data-f="${id}"><option>All</option>${opts.map((o) => `<option${o === v ? ' selected' : ''}>${o}</option>`).join('')}</select></label>`
  function drawGallery() {
    $('#filters').innerHTML = sel('occ', 'Occasion', uniq('occ'), F.occ) + sel('sea', 'Season', uniq('sea'), F.sea) + sel('sty', 'Style', STYLES, gStyle) + sel('col', 'Colour', Object.keys(COLORS), F.col) + `<button class="sl-pill" id="favs" aria-pressed="${onlyFav}">♥ Favourites (${favs.length})</button>`
    const list = OUTFITS.filter((o) => (F.occ === 'All' || o.occ === F.occ) && (F.sea === 'All' || o.sea === F.sea) && (gStyle === 'All' || o.sty === gStyle) && (F.col === 'All' || o.pal.includes(F.col)) && (!onlyFav || favs.includes(o.id)))
    $('#count').textContent = list.length + ' looks'
    $('#gal').innerHTML = list.map((o, i) => `<article class="sl-look${i % 3 === 0 ? ' tall' : ''}"><div class="sl-look-art rounded-lg shadow-lg">${o.pal.map((n) => `<i style="background:${COLORS[n]}"></i>`).join('')}</div><div class="sl-look-meta"><div><h3>${o.name}</h3><p>${o.sty} · ${o.occ} · ${o.sea}</p></div><button data-fav="${o.id}" aria-pressed="${favs.includes(o.id)}" aria-label="Favourite ${o.name}">${favs.includes(o.id) ? '♥' : '♡'}</button></div></article>`).join('') || '<p>No looks match. Try removing a filter.</p>'
    store.set('favs', favs)
  }
  $('#filters').addEventListener('change', (e) => { const k = e.target.dataset.f; if (!k) return; k === 'sty' ? (gStyle = e.target.value) : (F[k] = e.target.value); drawGallery() })
  $('#filters').addEventListener('click', (e) => { if (e.target.id === 'favs') { onlyFav = !onlyFav; drawGallery() } })
  $('#gal').addEventListener('click', (e) => { const b = e.target.closest('[data-fav]'); if (!b) return; const id = +b.dataset.fav; favs = favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id]; drawGallery() })
  drawGallery()

  /* ===== 8. INSPIRACIÓN ===== */
  let tab = 'Trends'
  function drawTips() { pills($('#tabs'), ['Trends', 'Tips', 'Combos'], tab, (t) => { tab = t; drawTips() }); $('#tips').innerHTML = TIPS.filter((x) => x[0] === tab).map((x) => `<article class="rounded-lg shadow-lg p-6"><h3>${x[1]}</h3><p>${x[2]}</p></article>`).join('') }
  drawTips()

  /* ===== 9. CONTACTO ===== */
  $('#contact').onsubmit = (e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.currentTarget)); location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('STYLE LAB — ' + d.name)}&body=${encodeURIComponent(d.message + '\n\n' + d.email)}`; $('#msg').textContent = 'Opening your mail app…' }

  /* ===== 10. CODE ATELIER: cada fila del gist se "viste" en el maniquí ===== */
  const byId = Object.fromEntries(rows.map((r) => [r.id, r]))
  let on = new Set(), lim = 24
  const ok = rows.filter(supported).length
  $('#atelier-info').textContent = `${rows.length} CSS3 ⇄ Tailwind codes loaded from the gist · ${ok} run natively in your browser, ${rows.length - ok} are non-standard (marked "no-op"). Tap a code to apply its CSS to the model.`
  function applyModel() {
    const m = $('#model'), st = {}, tr = [], cls = []
    on.forEach((id) => { const r = byId[id]; if (r.decl[0] === '>') return cls.push(r.tw); decls(r).forEach(([p, v]) => { if (!CSS.supports(p, v)) return; p === 'transform' ? tr.push(v) : (st[p] = v) }) })
    m.className = 'sl-model ' + cls.join(' ')
    m.style.cssText = Object.entries(st).map(([p, v]) => `${p}:${v}`).join(';') + (tr.length ? `;transform:${tr.join(' ')}` : '')
    drawCodes()
  }
  function drawCodes() {
    const q = $('#q').value.toLowerCase(), list = rows.filter((r) => (r.css + r.tw + r.decl).toLowerCase().includes(q))
    $('#codes').innerHTML = list.slice(0, lim).map((r) => `<li><button data-id="${r.id}" aria-pressed="${on.has(r.id)}"><b>${r.tw}</b><span>${r.css}${supported(r) ? '' : ' · no-op'}</span><code>${r.decl.replace(/^>/, '.child → ')}</code></button></li>`).join('')
    $('#more').innerHTML = lim < list.length ? `<button class="sl-btn ghost" data-lim="40">Show more</button><button class="sl-btn ghost" data-lim="all">Show all (${list.length})</button>` : `<span class="sl-kicker">${list.length} codes</span>`
  }
  $('#codes').onclick = (e) => { const b = e.target.closest('button'); if (!b) return; const id = +b.dataset.id; on.has(id) ? on.delete(id) : on.add(id); applyModel() }
  $('#more').onclick = (e) => { const b = e.target.closest('button'); if (!b) return; lim = b.dataset.lim === 'all' ? Infinity : lim + 40; drawCodes() }
  $('#q').oninput = () => { lim = 24; drawCodes() }
  $('#rnd').onclick = () => { on = new Set([...rows].sort(() => Math.random() - 0.5).filter(supported).slice(0, 5).map((r) => r.id)); applyModel() }
  $('#clr').onclick = () => { on.clear(); applyModel() }
  drawCodes()
})()
