// Shared: mobile menu + atom interferometer explainer (technology page)
(function () {
  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // ---------- Atom interferometer explainer ----------
  var cv = document.getElementById('aiCanvas');
  if (!cv) return;
  var css = getComputedStyle(document.documentElement);
  var C = {
    teal: css.getPropertyValue('--teal').trim(), violet: css.getPropertyValue('--violet').trim(),
    warn: css.getPropertyValue('--warn').trim(), muted: css.getPropertyValue('--muted').trim(),
    line: css.getPropertyValue('--line').trim(), ink: css.getPropertyValue('--ink').trim()
  };
  var AR = document.documentElement.lang === 'ar';
  function T(en, ar) { return AR ? ar : en; }
  var steps = AR ? [
    { t: 'التبريد', d: 'تُبطئ ستّة أشعة ليزر سحابة من ذرّات الروبيديوم حتى تصبح على بُعد أجزاء من المليون من الدرجة فوق الصفر المطلق. الذرّات الباردة تتحرّك ببطء، فنستطيع تتبّعها وهي تسقط.' },
    { t: 'الانقسام', d: 'تعطي نبضة ليزر كل ذرّة دفعة صغيرة، لكن «نصفها» فقط: تصبح الذرّة في حالة تراكب بين مسارين، أحدهما أسرع قليلاً من الآخر. وتبقى ذرّة واحدة.' },
    { t: 'السقوط', d: 'يسقط المساران سقوطاً حراً لمدة عُشر ثانية تقريباً. ثم تبدّل نبضة ثانية المسارين، فيتّجهان نحو بعضهما من جديد.' },
    { t: 'التداخل', d: 'تعيد نبضة ثالثة دمج المسارين. ومثل الأمواج التي تلتقي في الماء، يتداخلان. وتعتمد النتيجة على فرق الطور، الذي يعتمد على قوة سحب الجاذبية أثناء السقوط.' },
    { t: 'القراءة', d: 'يعدّ الكاشف الذرّات في كل حالة. وبتكرار ذلك كل ثانية نحصل على شدّة الجاذبية بدقة تقارب جزءاً من مليار من g، من دون نوابض تنحرف ببطء مع الزمن.' }
  ] : [
    { t: 'Cool', d: 'Six laser beams slow a cloud of rubidium atoms until it is a few millionths of a degree above absolute zero. Cold atoms move slowly, so we can follow them as they fall.' },
    { t: 'Split', d: 'A laser pulse gives each atom a tiny kick, but only “half” of it: the atom is now in a superposition of two paths, one moving slightly faster than the other. It is still one atom.' },
    { t: 'Fall', d: 'Both paths fall freely for about a tenth of a second. A second pulse swaps them over, so they head back towards each other.' },
    { t: 'Interfere', d: 'A third pulse recombines the two paths. Like waves meeting in water, they interfere. The result depends on the phase difference, which depends on how strongly gravity pulled during the fall.' },
    { t: 'Read', d: 'A detector counts how many atoms end up in each state. Repeating this every second gives the strength of gravity to about a billionth of g, with no springs that slowly drift.' }
  ];
  var cur = 0, t0 = performance.now();
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bar = document.getElementById('aiSteps'), ex = document.getElementById('aiExplain');
  steps.forEach(function (s, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.textContent = (i + 1) + ' ' + s.t;
    b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    b.addEventListener('click', function () { go(i); });
    bar.appendChild(b);
  });
  function go(i) {
    cur = i; t0 = performance.now();
    bar.querySelectorAll('button').forEach(function (b, k) { b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
    ex.innerHTML = '<h3>' + (i + 1) + ' · ' + steps[i].t + '</h3><p class="muted">' + steps[i].d + '</p>';
  }
  document.getElementById('aiNext').addEventListener('click', function () { go((cur + 1) % steps.length); });
  go(0);

  function glow(ctx, x, y, r, col) {
    var g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, '#E4D6FF'); g.addColorStop(0.35, col); g.addColorStop(1, 'rgba(100,0,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  }
  function frame(now) {
    var dpr = window.devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight;
    if (cv.width !== w * dpr) { cv.width = w * dpr; cv.height = h * dpr; }
    var ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    var p = reduce ? 1 : Math.min(1, (now - t0) / 1800);
    var cx = w / 2, top = 50, y1 = h * 0.30, y2 = h * 0.55, y3 = h * 0.80, sx = Math.min(70, w * 0.16);
    // chamber
    ctx.strokeStyle = C.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(cx - 110, 20, 220, h - 40, 26); ctx.stroke();
    ctx.fillStyle = C.muted; ctx.font = '12px "IBM Plex Sans", Arial'; ctx.textAlign = 'left';
    ctx.fillText(T('vacuum chamber', 'حجرة مفرغة'), cx + 118, 36);
    // pulse bands
    [y1, y2, y3].forEach(function (y, k) {
      var active = (cur === 1 && k === 0) || (cur === 2 && k === 1) || (cur >= 3 && k === 2);
      ctx.fillStyle = active ? 'rgba(126,221,211,0.45)' : 'rgba(126,221,211,0.12)';
      ctx.fillRect(cx - 108, y - 6, 216, 12);
      ctx.fillStyle = C.muted; ctx.textAlign = 'right'; ctx.fillText(T('pulse ', 'نبضة ') + (k + 1), cx - 118, y + 4);
    });
    ctx.textAlign = 'left';
    // paths drawn so far
    ctx.strokeStyle = C.violet; ctx.lineWidth = 2.5;
    function line(a, b, c, d, f) { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(a + (c - a) * f, b + (d - b) * f); ctx.stroke(); }
    if (cur === 0) {
      // cooling beams
      ctx.strokeStyle = C.teal; ctx.lineWidth = 3;
      var k = 30 + 10 * Math.sin(now / 300);
      [[cx - 100, top, cx - k, top], [cx + 100, top, cx + k, top]].forEach(function (s) { ctx.beginPath(); ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); ctx.stroke(); });
      glow(ctx, cx, top, 26 - 8 * p, C.violet);
    }
    if (cur >= 1) {
      ctx.setLineDash([4, 6]); ctx.strokeStyle = C.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx, top); ctx.lineTo(cx, y1); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = C.violet; ctx.lineWidth = 2.5;
      var f1 = cur === 1 ? p : 1;
      line(cx, y1, cx - sx, y2, cur === 1 ? f1 * 0.25 : (cur >= 2 ? 1 : 0));
      line(cx, y1, cx + sx, y2, cur === 1 ? f1 * 0.25 : (cur >= 2 ? 1 : 0));
      if (cur === 1) { glow(ctx, cx - sx * 0.25 * f1, y1 + (y2 - y1) * 0.25 * f1, 16, C.violet); glow(ctx, cx + sx * 0.25 * f1, y1 + (y2 - y1) * 0.25 * f1, 16, C.violet); }
    }
    if (cur === 2) {
      line(cx - sx, y2, cx, y3, p * 0.5); line(cx + sx, y2, cx, y3, p * 0.5);
      glow(ctx, cx - sx + sx * 0.5 * p, y2 + (y3 - y2) * 0.5 * p, 16, C.violet);
      glow(ctx, cx + sx - sx * 0.5 * p, y2 + (y3 - y2) * 0.5 * p, 16, C.violet);
    }
    if (cur >= 3) {
      line(cx - sx, y2, cx, y3, 1); line(cx + sx, y2, cx, y3, 1);
      glow(ctx, cx, y3, 22, C.violet);
      if (cur === 3) {
        // interference fringes
        for (var i = 0; i < 9; i++) {
          var a = 0.5 + 0.5 * Math.cos(i * 0.9 + now / 400);
          ctx.fillStyle = 'rgba(155,107,255,' + (0.15 + 0.6 * a) + ')';
          ctx.fillRect(cx - 54 + i * 12, y3 + 22, 8, 22);
        }
      }
    }
    if (cur === 4) {
      ctx.fillStyle = C.warn; ctx.beginPath(); ctx.roundRect(cx - 50, h - 64, 100, 26, 6); ctx.fill();
      var frac = 0.62 + 0.02 * Math.sin(now / 500);
      ctx.fillStyle = C.ink; ctx.font = '600 13px "IBM Plex Sans", Arial'; ctx.textAlign = 'center';
      ctx.fillText(T('state A ', 'الحالة أ ') + Math.round(frac * 100) + '%  ·  ' + T('state B ', 'الحالة ب ') + Math.round((1 - frac) * 100) + '%', cx, h - 76);
      ctx.fillStyle = '#1B1407'; ctx.fillText(T('detector', 'الكاشف'), cx, h - 46);
    }
    // gravity arrow
    ctx.strokeStyle = C.muted; ctx.fillStyle = C.muted; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx + 150, y1); ctx.lineTo(cx + 150, y3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + 144, y3 - 10); ctx.lineTo(cx + 150, y3); ctx.lineTo(cx + 156, y3 - 10); ctx.fill();
    ctx.textAlign = 'center'; ctx.font = '600 14px "IBM Plex Sans", Arial'; ctx.fillText('g', cx + 150, y1 - 10);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
