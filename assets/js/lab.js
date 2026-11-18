// Q-MIZAN Simulation Lab
// Physics: vertical gravity change from a mass m at horizontal offset ρ and vertical distance z:
//   Δg = G · m · z / (ρ² + z²)^(3/2)      (point mass directly above/below: G·m / z²)
// 1 µGal = 1e-8 m/s².
(function () {
  var G = 6.674e-11;
  var AR = document.documentElement.lang === 'ar';
  function T(en, ar) { return AR ? ar : en; }
  var U = { t: T(' t', ' طن'), m: T(' m', ' م'), g: T(' µGal', ' ميكروغال') };
  var css = getComputedStyle(document.documentElement);
  function col(n) { return css.getPropertyValue(n).trim(); }
  var C = { teal: col('--teal'), violet: col('--violet'), sand: col('--sand'), warn: col('--warn'), bad: col('--bad'), muted: col('--muted'), line: col('--line'), ink: col('--ink'), panel: col('--panel') };
  function dgPoint(tonnes, r) { return G * tonnes * 1000 / (r * r) * 1e8; }
  function fmtT(t) { return Math.round(t).toLocaleString('en-US') + U.t; }
  function fmtG(v) { var a = Math.abs(v); return a >= 10 ? v.toFixed(0) : a >= 1 ? v.toFixed(1) : a >= 0.01 ? v.toFixed(2) : v.toExponential(1); }
  function setup(cv) {
    var dpr = window.devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    var ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: w, h: h };
  }
  function axes(c, pad, xt, yt, xLab, yLab, xf, yf) {
    var ctx = c.ctx; ctx.font = '12px "IBM Plex Sans", Arial'; ctx.fillStyle = C.muted; ctx.strokeStyle = C.line; ctx.lineWidth = 1;
    yt.forEach(function (t) { var y = yf(t.v); ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(c.w - pad.r, y); ctx.stroke(); ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText(t.label, pad.l - 6, y); });
    xt.forEach(function (t) { ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillText(t.label, xf(t.v), c.h - pad.b + 6); });
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText(xLab, pad.l + (c.w - pad.l - pad.r) / 2, c.h - 10);
    ctx.save(); ctx.translate(13, pad.t + (c.h - pad.t - pad.b) / 2); ctx.rotate(-Math.PI / 2); ctx.textBaseline = 'middle'; ctx.fillText(yLab, 0, 0); ctx.restore();
  }
  var $ = function (id) { return document.getElementById(id); };

  // ================= 1. Signal calculator =================
  var mass = $('mass'), dist = $('dist'), lim = $('lim'), exactT = 25000;
  function drawA() {
    var t = exactT || Math.pow(10, +mass.value), r = +dist.value, L = +lim.value, v = dgPoint(t, r);
    $('massOut').textContent = fmtT(t); $('distOut').textContent = r + U.m; $('limOut').textContent = L + U.g;
    $('dgOut').textContent = '+' + fmtG(v) + U.g;
    var ratio = v / L;
    $('verdictA').innerHTML = ratio >= 1
      ? '<span class="pill ok">' + T('Detectable: ', 'يمكن رصده: ') + (ratio >= 10 ? Math.round(ratio) : ratio.toFixed(1)) + T('× the limit', ' أضعاف الحدّ') + '</span>'
      : '<span class="pill no">' + T('Too small: ', 'أصغر من اللازم: ') + (ratio < 0.01 ? T('under 1%', 'أقل من 1%') : Math.round(ratio * 100) + '%') + T(' of the limit', ' من الحدّ') + '</span>';
    var rMax = Math.sqrt(G * t * 1000 * 1e8 / L);
    $('reachA').textContent = T('With this much carbon, a sensor up to ', 'بهذه الكمية من الكربون، يستطيع مستشعر على بُعد يصل إلى ') + (rMax >= 1000 ? (rMax / 1000).toFixed(1) + T(' km', ' كم') : Math.round(rMax) + U.m) + T(' away could still see it.', ' أن يرصدها.');
    var c = setup($('chartA')), ctx = c.ctx, pad = { l: 58, r: 26, t: 14, b: 46 }, lo = -3, hi = 3;
    function xf(x) { return pad.l + (x - 20) / (800 - 20) * (c.w - pad.l - pad.r); }
    function yf(g) { var lg = Math.log10(Math.max(g, 1e-9)); lg = Math.min(hi, Math.max(lo, lg)); return pad.t + (hi - lg) / (hi - lo) * (c.h - pad.t - pad.b); }
    axes(c, pad, [20, 200, 400, 600, 800].map(function (v) { return { v: v, label: v + U.m }; }),
      [0.001, 0.01, 0.1, 1, 10, 100, 1000].map(function (g) { return { v: g, label: String(g) }; }),
      T('Distance between carbon and sensor', 'المسافة بين الكربون والمستشعر'), T('µGal (log scale)', 'ميكروغال (مقياس لوغاريتمي)'), xf, yf);
    ctx.strokeStyle = C.warn; ctx.setLineDash([6, 5]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(pad.l, yf(L)); ctx.lineTo(c.w - pad.r, yf(L)); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); for (var x = 20; x <= 800; x += 5) { x === 20 ? ctx.moveTo(xf(x), yf(dgPoint(t, x))) : ctx.lineTo(xf(x), yf(dgPoint(t, x))); }
    ctx.lineTo(xf(800), c.h - pad.b); ctx.lineTo(xf(20), c.h - pad.b); ctx.closePath(); ctx.fillStyle = 'rgba(126,221,211,0.10)'; ctx.fill();
    ctx.beginPath(); for (var x2 = 20; x2 <= 800; x2 += 5) { x2 === 20 ? ctx.moveTo(xf(x2), yf(dgPoint(t, x2))) : ctx.lineTo(xf(x2), yf(dgPoint(t, x2))); }
    ctx.strokeStyle = C.teal; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.fillStyle = C.violet; ctx.beginPath(); ctx.arc(xf(r), yf(v), 6.5, 0, 7); ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.stroke();
  }
  if (mass) {
    mass.addEventListener('input', function () { exactT = 0; drawA(); });
    [dist, lim].forEach(function (e) { e.addEventListener('input', drawA); });
    document.querySelectorAll('#presetsA button').forEach(function (b) {
      b.addEventListener('click', function () {
        exactT = +b.dataset.m; mass.value = Math.log10(exactT);
        document.querySelectorAll('#presetsA button').forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        drawA();
      });
    });
  }

  // ================= 2. Month-by-month monitoring =================
  var rate = $('rate'), distB = $('distB'), noise = $('noise'), leak = false, seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function gauss() { var u = rnd() || 1e-9, v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function drawB() {
    var R = +rate.value, r = +distB.value, s = +noise.value;
    $('rateOut').textContent = R + T(' t/day', ' طن/يوم'); $('distBOut').textContent = r + U.m; $('noiseOut').textContent = '±' + s + U.g;
    var months = 36, perMonth = R * 30.4, truth = [], meas = [], s0 = seed;
    for (var m = 0; m <= months; m++) {
      var stored = Math.min(m, 12) * perMonth;
      if (leak && m > 12) stored *= 1 - 0.4 * Math.min(1, (m - 12) / 18);
      truth.push(dgPoint(stored, r));
    }
    for (var k = 0; k <= months; k++) meas.push(truth[k] + s * gauss());
    seed = s0;
    var c = setup($('chartB')), ctx = c.ctx, pad = { l: 52, r: 34, t: 14, b: 46 };
    var ymax = Math.max(8, Math.max.apply(null, truth) * 1.25, Math.max.apply(null, meas) * 1.05), ymin = Math.min(-3 * s, Math.min.apply(null, meas) * 1.1);
    function xf(m) { return pad.l + m / months * (c.w - pad.l - pad.r); }
    function yf(g) { return pad.t + (ymax - g) / (ymax - ymin) * (c.h - pad.t - pad.b); }
    var step = ymax > 200 ? 100 : ymax > 80 ? 20 : ymax > 30 ? 10 : 5, yt = [];
    for (var g = Math.ceil(ymin / step) * step; g <= ymax; g += step) yt.push({ v: g, label: String(g) });
    axes(c, pad, [0, 12, 24, 36].map(function (v) { return { v: v, label: T('month ', 'الشهر ') + v }; }), yt, T('Time', 'الزمن'), T('Gravity change (µGal)', 'تغيّر الجاذبية (ميكروغال)'), xf, yf);
    ctx.fillStyle = 'rgba(126,221,211,0.06)'; ctx.fillRect(xf(0), pad.t, xf(12) - xf(0), c.h - pad.t - pad.b);
    ctx.fillStyle = C.muted; ctx.font = '12px "IBM Plex Sans", Arial'; ctx.textAlign = 'left'; ctx.fillText(T('injecting', 'فترة الحقن'), xf(0) + 6, pad.t + 14);
    ctx.strokeStyle = C.muted; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(xf(12), pad.t); ctx.lineTo(xf(12), c.h - pad.b); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); truth.forEach(function (g, m) { m ? ctx.lineTo(xf(m), yf(g)) : ctx.moveTo(xf(m), yf(g)); }); ctx.strokeStyle = C.teal; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.fillStyle = C.sand; meas.forEach(function (g, m) { ctx.beginPath(); ctx.arc(xf(m), yf(g), 3.8, 0, 7); ctx.fill(); });
    function mean(a, b) { var t = 0; for (var i = a; i <= b; i++) t += meas[i]; return t / (b - a + 1); }
    var early = mean(13, 18), late = mean(31, 36), se = s * Math.sqrt(2 / 6), peak = truth[12];
    var tonnes = Math.round(12 * perMonth).toLocaleString('en-US');
    if (peak < 2 * s) { $('verdictB').innerHTML = '<span class="pill no">' + T('Signal lost in the noise', 'الإشارة ضائعة في الضجيج') + '</span>'; $('noteB').textContent = T(tonnes + ' t injected gives only +' + fmtG(peak) + ' µGal at ' + r + ' m. Move the sensor closer or inject more.', 'حقن ' + tonnes + ' طن يعطي ' + fmtG(peak) + '+ ميكروغال فقط على بُعد ' + r + ' م. قرّب المستشعر أو زِد كمية الحقن.'); }
    else if (early - late > 3 * se) { $('verdictB').innerHTML = '<span class="pill warn">' + T('Gravity falling: carbon may be moving', 'الجاذبية تنخفض: قد يكون الكربون يتحرّك') + '</span>'; $('noteB').textContent = T('Readings dropped by ' + fmtG(early - late) + ' µGal after injection stopped. Time to check the monitoring wells.', 'انخفضت القراءات بمقدار ' + fmtG(early - late) + ' ميكروغال بعد توقّف الحقن. حان وقت فحص آبار المراقبة.'); }
    else { $('verdictB').innerHTML = '<span class="pill ok">' + T('Gravity steady: carbon is staying put', 'الجاذبية ثابتة: الكربون باقٍ في مكانه') + '</span>'; $('noteB').textContent = T(tonnes + ' t injected in year one gives about +' + fmtG(peak) + ' µGal at ' + r + ' m, and the readings stay level afterwards.', 'حقن ' + tonnes + ' طن في السنة الأولى يعطي نحو ' + fmtG(peak) + '+ ميكروغال على بُعد ' + r + ' م، وتبقى القراءات ثابتة بعد ذلك.'); }
  }
  if (rate) {
    [rate, distB, noise].forEach(function (e) { e.addEventListener('input', drawB); });
    var bS = $('scStay'), bL = $('scLeak');
    bS.addEventListener('click', function () { leak = false; bS.setAttribute('aria-pressed', 'true'); bL.setAttribute('aria-pressed', 'false'); drawB(); });
    bL.addEventListener('click', function () { leak = true; bL.setAttribute('aria-pressed', 'true'); bS.setAttribute('aria-pressed', 'false'); drawB(); });
    $('reroll').addEventListener('click', function () { seed = 1 + Math.floor(Math.random() * 2147483000); drawB(); });
  }

  // ================= 3. Site map: sensor network =================
  // Plan view of a 1.2 km × 1.2 km site. The carbonate zone is modelled as 400 small masses
  // in a spreading cloud; sensors sit on a plane a fixed vertical distance from it.
  var years = $('years'), depth = $('depth'), limC = $('limC'), drift = false, sensors = [];
  var SIZE = 1200, HALF = SIZE / 2, NPTS = 400, pts = [];
  (function () { var s = 11; function r() { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }
    for (var i = 0; i < NPTS; i++) { var u = r() || 1e-9, v = r(); pts.push([Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v), Math.sqrt(-2 * Math.log(u)) * Math.sin(2 * Math.PI * v) * 0.7, r()]); } })();
  function defaultSensors() { sensors = []; [-250, 0, 250].forEach(function (y) { [-250, 0, 250].forEach(function (x) { sensors.push([x, y]); }); }); }
  defaultSensors();
  function deposit(yrs) {
    var injYears = Math.min(yrs, 5), total = 25000 * injYears, sigma = 35 + 22 * Math.sqrt(Math.max(yrs, 0.01)), mEach = total / NPTS, out = [];
    var after = Math.max(0, yrs - 5);
    for (var i = 0; i < NPTS; i++) {
      var p = pts[i], x = p[0] * sigma, y = p[1] * sigma;
      if (drift && p[2] < 0.35) x += 70 * after; // 35% of the carbon creeps east after injection ends
      out.push([x, y, mEach]);
    }
    return { pts: out, total: total };
  }
  function gAt(dep, x, y, z) {
    var g = 0;
    for (var i = 0; i < dep.pts.length; i++) { var q = dep.pts[i], dx = x - q[0], dy = y - q[1], r2 = dx * dx + dy * dy + z * z; g += q[2] * 1000 * z / (r2 * Math.sqrt(r2)); }
    return G * g * 1e8;
  }
  function heat(v, vmax) {
    var t = Math.max(0, Math.min(1, v / vmax));
    var a = [22, 35, 46], b = [27, 92, 130], c2 = [126, 221, 211], d = [242, 245, 247], c;
    if (t < 0.4) c = mix(a, b, t / 0.4); else if (t < 0.8) c = mix(b, c2, (t - 0.4) / 0.4); else c = mix(c2, d, (t - 0.8) / 0.2);
    return c;
  }
  function mix(a, b, f) { return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]; }
  function drawC() {
    var yrs = +years.value, z = +depth.value, L = +limC.value;
    $('yearsOut').textContent = yrs + T(yrs === 1 ? ' year' : ' years', yrs === 1 ? ' سنة' : (yrs <= 10 ? ' سنوات' : ' سنة')); $('depthOut').textContent = z + U.m; $('limCOut').textContent = L + U.g;
    var dep = deposit(yrs), cv = $('chartC'), c = setup(cv), ctx = c.ctx, side = Math.min(c.w, c.h), ox = (c.w - side) / 2, oy = (c.h - side) / 2;
    var N = 60, cell = side / N, vals = [], vmax = 0;
    for (var j = 0; j < N; j++) for (var i = 0; i < N; i++) { var x = -HALF + (i + 0.5) * SIZE / N, y = HALF - (j + 0.5) * SIZE / N, v = gAt(dep, x, y, z); vals.push(v); if (v > vmax) vmax = v; }
    var scaleMax = Math.max(vmax, L * 2);
    var img = ctx.createImageData(N, N);
    for (var k = 0; k < vals.length; k++) { var cc = heat(vals[k], scaleMax); img.data[k * 4] = cc[0]; img.data[k * 4 + 1] = cc[1]; img.data[k * 4 + 2] = cc[2]; img.data[k * 4 + 3] = 255; }
    var off = document.createElement('canvas'); off.width = N; off.height = N; off.getContext('2d').putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = true; ctx.drawImage(off, ox, oy, side, side);
    function px(x) { return ox + (x + HALF) / SIZE * side; } function py(y) { return oy + (HALF - y) / SIZE * side; }
    // contour of the sensor limit (cells above the limit outlined)
    ctx.strokeStyle = C.warn; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
    for (var j2 = 0; j2 < N; j2++) for (var i2 = 0; i2 < N; i2++) {
      var on = vals[j2 * N + i2] >= L;
      if (i2 < N - 1 && on !== (vals[j2 * N + i2 + 1] >= L)) { ctx.beginPath(); ctx.moveTo(ox + (i2 + 1) * cell, oy + j2 * cell); ctx.lineTo(ox + (i2 + 1) * cell, oy + (j2 + 1) * cell); ctx.stroke(); }
      if (j2 < N - 1 && on !== (vals[(j2 + 1) * N + i2] >= L)) { ctx.beginPath(); ctx.moveTo(ox + i2 * cell, oy + (j2 + 1) * cell); ctx.lineTo(ox + (i2 + 1) * cell, oy + (j2 + 1) * cell); ctx.stroke(); }
    }
    ctx.setLineDash([]);
    // injection well
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(px(0), py(0), 4, 0, 7); ctx.fill();
    // wadi aquifer marker (east)
    ctx.fillStyle = 'rgba(63,167,214,0.35)'; ctx.fillRect(px(480), oy, side - (px(480) - ox), side);
    ctx.fillStyle = C.ink; ctx.font = '12px "IBM Plex Sans", Arial'; ctx.textAlign = 'center';
    ctx.save(); ctx.translate(px(540), py(0)); ctx.rotate(-Math.PI / 2); ctx.fillText(T('fresh wadi groundwater', 'مياه جوفية عذبة في الوادي'), 0, 0); ctx.restore();
    // scale bar
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px(-560), py(-560)); ctx.lineTo(px(-360), py(-560)); ctx.stroke();
    ctx.textAlign = 'left'; ctx.fillText('200' + U.m, px(-560), py(-560) - 6);
    // sensors
    var rows = '', seen = 0;
    sensors.forEach(function (s, n) {
      var v = gAt(dep, s[0], s[1], z), ok = v >= L; if (ok) seen++;
      ctx.beginPath(); ctx.arc(px(s[0]), py(s[1]), 8, 0, 7); ctx.fillStyle = ok ? C.violet : 'rgba(155,107,255,0.25)'; ctx.fill();
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = C.ink; ctx.font = '600 11px "IBM Plex Sans", Arial'; ctx.textAlign = 'center'; ctx.fillText(String(n + 1), px(s[0]), py(s[1]) - 12);
      rows += '<tr><td class="mono">' + T('S', 'م') + (n + 1) + '</td><td class="mono"><span class="ltr">' + Math.round(s[0]) + ', ' + Math.round(s[1]) + '</span></td><td class="mono"><span class="ltr">+' + fmtG(v) + '</span></td><td>' + (ok ? '<span class="yes">' + T('sees it', 'يرصده') + '</span>' : '<span class="no">' + T('below limit', 'دون الحدّ') + '</span>') + '</td></tr>';
    });
    $('sensorRows').innerHTML = rows;
    var east = 0; dep.pts.forEach(function (q) { east += q[0]; }); east /= dep.pts.length;
    $('verdictC').innerHTML = '<span class="pill ' + (seen >= 3 ? 'ok' : seen ? 'warn' : 'no') + '">' + T(seen + ' of ' + sensors.length + ' sensors see the carbon', seen + ' من ' + sensors.length + ' مستشعرات ترصد الكربون') + '</span>' +
      (drift && yrs > 5 ? ' <span class="pill warn">' + T('Carbon centre has moved ' + Math.round(east) + ' m east', 'انتقل مركز الكربون ' + Math.round(east) + ' م شرقاً') + '</span>' : '');
    $('noteC').textContent = T(fmtT(dep.total) + ' stored after ' + yrs + (yrs === 1 ? ' year' : ' years') + '. Strongest signal on the sensor plane: +' + fmtG(vmax) + ' µGal. Click the map to add or remove a sensor.', 'تخزين ' + fmtT(dep.total) + ' بعد ' + yrs + (yrs === 1 ? ' سنة' : (yrs <= 10 ? ' سنوات' : ' سنة')) + '. أقوى إشارة على مستوى المستشعرات: ' + fmtG(vmax) + '+ ميكروغال. انقر على الخريطة لإضافة مستشعر أو إزالته.');
    cv._map = { px: px, py: py, ox: ox, oy: oy, side: side };
  }
  if (years) {
    [years, depth, limC].forEach(function (e) { e.addEventListener('input', drawC); });
    var dS = $('dStay'), dE = $('dDrift');
    dS.addEventListener('click', function () { drift = false; dS.setAttribute('aria-pressed', 'true'); dE.setAttribute('aria-pressed', 'false'); drawC(); });
    dE.addEventListener('click', function () { drift = true; dE.setAttribute('aria-pressed', 'true'); dS.setAttribute('aria-pressed', 'false'); drawC(); });
    $('resetSensors').addEventListener('click', function () { defaultSensors(); drawC(); });
    $('chartC').addEventListener('click', function (e) {
      var m = this._map; if (!m) return;
      var rect = this.getBoundingClientRect(), cx = e.clientX - rect.left, cy = e.clientY - rect.top;
      if (cx < m.ox || cx > m.ox + m.side || cy < m.oy || cy > m.oy + m.side) return;
      var x = (cx - m.ox) / m.side * SIZE - HALF, y = HALF - (cy - m.oy) / m.side * SIZE;
      for (var i = 0; i < sensors.length; i++) { var dx = sensors[i][0] - x, dy = sensors[i][1] - y; if (dx * dx + dy * dy < 40 * 40) { sensors.splice(i, 1); drawC(); return; } }
      if (sensors.length < 16) sensors.push([x, y]);
      drawC();
    });
  }

  function all() { if (mass) drawA(); if (rate) drawB(); if (years) drawC(); }
  var to; window.addEventListener('resize', function () { clearTimeout(to); to = setTimeout(all, 120); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(all);
  all();
})();
