/* North Muirton Community Centre - What's On embed (interactive).
   Paste into a WordPress Custom HTML block:
     <div id="nmcc-whats-on"></div>
     <script src="__BASE__/embed.js" defer></script>
*/
(function () {
  var BASE = (document.currentScript && document.currentScript.src || '').replace(/embed\.js.*$/, '');
  var host = document.getElementById('nmcc-whats-on');
  if (!host) return;
  if (!document.getElementById('nmcc-wo-font')) {
    var l = document.createElement('link'); l.id = 'nmcc-wo-font'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap';
    document.head.appendChild(l);
  }
  var root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;
  var css = ':host{display:block}*{box-sizing:border-box}'
    + '.wo{font-family:Nunito,"Segoe UI",Helvetica,Arial,sans-serif;color:#1F2430;max-width:860px}'
    + '.hd{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 16px;margin:0 0 18px}'
    + '.hd h2{margin:0;font-weight:800;font-size:clamp(1.8rem,3.5vw,2.4rem);line-height:1.05}'
    + '.rng{font-weight:800;font-size:.95rem;background:#E6F7F7;color:#096D72;padding:9px 16px;border-radius:999px}'
    + '.bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;margin:0 0 16px}'
    + '.sw{display:inline-flex;gap:4px;padding:5px;background:#E6F7F7;border-radius:999px}'
    + '.sw button{font:800 .95rem/1 Nunito,"Segoe UI",sans-serif;color:#1F2430;cursor:pointer;padding:10px 18px;border:0;border-radius:999px;background:transparent}'
    + '.sw button[aria-pressed="true"]{background:#096D72;color:#fff}'
    + '.key{font-size:.9rem;color:#5A6070;display:flex;align-items:center;gap:6px}'
    + '.day{display:grid;grid-template-columns:5.5rem 1fr;gap:16px;padding:12px;margin-bottom:10px;background:#F7F9F9;border-radius:18px}'
    + '.day.today{background:#E6F7F7;box-shadow:inset 0 0 0 2px #31B8BA}'
    + '.tab{border-radius:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10px 4px;text-align:center}'
    + '.dn{font-weight:800;text-transform:uppercase;font-size:1.05rem;letter-spacing:.03em;line-height:1}'
    + '.dd{font-weight:700;font-size:.8rem;margin-top:4px;opacity:.9}'
    + '.its{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px 14px;align-content:center;align-items:start}'
    + '.it{display:block;width:100%;text-align:left;font:inherit;color:inherit;background:#fff;border:0;border-radius:14px;padding:12px 40px 12px 14px;cursor:pointer;position:relative;transition:box-shadow .15s,transform .15s}'
    + '.it:hover{box-shadow:0 4px 14px rgba(31,36,48,.10);transform:translateY(-1px)}'
    + '.it:focus-visible{outline:3px solid #096D72;outline-offset:2px}'
    + '.it:after{content:"+";position:absolute;right:14px;top:12px;width:22px;height:22px;border-radius:50%;background:#E6F7F7;color:#096D72;font-weight:900;display:flex;align-items:center;justify-content:center;line-height:1}'
    + '.it[aria-expanded="true"]:after{content:"\\2013"}'
    + '.t{font-weight:800;font-size:1.05rem;line-height:1.25;display:flex;align-items:center;gap:6px}'
    + '.tm{font-weight:700;color:#096D72;font-size:.9rem;font-variant-numeric:tabular-nums;margin-top:2px}'
    + '.more{display:none;margin-top:10px;padding-top:10px;border-top:1px solid #E9ECF2;font-size:.95rem;line-height:1.45;color:#3A4050}'
    + '.it[aria-expanded="true"] .more{display:block}'
    + '.more p{margin:0 0 8px}.more a{display:inline-block;font-weight:800;color:#fff;background:#096D72;padding:9px 14px;border-radius:999px;text-decoration:none}'
    + '.more a:hover{background:#075A5E}'
    + '.fr{background:#FFC233}.fr .tm,.fr .more{color:#1F2430}.fr .more{border-top-color:rgba(31,36,48,.15)}.fr:after{background:rgba(255,255,255,.6);color:#1F2430}'
    + '.ym{height:1.15em;width:auto;border:1.5px solid #31B8BA;border-radius:4px;padding:1px 2px;background:#fff}'
    + '.none{padding:18px;background:#F7F9F9;border-radius:18px;color:#5A6070}'
    + '.ft{margin-top:14px;font-size:.85rem;color:#5A6070}'
    + '@media (max-width:520px){.day{grid-template-columns:4.2rem 1fr;gap:10px}.its{grid-template-columns:1fr}}'
    + '@media (prefers-reduced-motion:reduce){.it{transition:none}.it:hover{transform:none}}';
  function esc(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var TABS = [['#31B8BA', '#1F2430'], ['#FFC233', '#1F2430'], ['#312783', '#fff'], ['#096D72', '#fff']];
  var data = null, view = 'week';

  function card(day, k, isToday) {
    var dt = new Date(day.date + 'T00:00:00');
    var tab = TABS[k % TABS.length];
    var entries = [];
    day.items.forEach(function (i) {
      var more = (i.desc ? '<p>' + esc(i.desc) + '</p>' : '')
        + (i.room ? '<p>In the ' + esc(i.room) + '.</p>' : '')
        + (i.ours ? '<p>Run by Your North Muirton.</p>' : '<p>This group runs independently, so please contact them directly for details and booking.</p>')
        + (i.link ? '<a href="' + esc(i.link) + '" target="_blank" rel="noopener">Visit their website</a>' : '');
      entries.push([i.sort || '', '<button class="it" type="button" aria-expanded="false"><div class="t">'
        + (i.ours ? '<img class="ym" src="' + BASE + 'assets/logo_mark.png" alt="Your North Muirton event">' : '')
        + esc(i.title) + '</div><div class="tm">' + esc(i.time) + (i.room ? ' · ' + esc(i.room.replace('Small ', '')) : '')
        + '</div><div class="more">' + more + '</div></button>']);
    });
    (day.free || []).forEach(function (f) {
      var more = '<p>The hall is free for a regular weekly booking at this time.</p>'
        + (data.hireLink ? '<a href="' + esc(data.hireLink) + '" target="_blank" rel="noopener">Ask about booking</a>' : '<p>Get in touch with the centre to book it.</p>');
      entries.push([f.sort || '', '<button class="it fr" type="button" aria-expanded="false"><div class="t">' + esc(f.label)
        + ' available</div><div class="tm">' + esc(f.time) + ' · for regular hire</div><div class="more">' + more + '</div></button>']);
    });
    entries.sort(function (a, b) { return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0; });
    return '<div class="day' + (isToday ? ' today' : '') + '"><div class="tab" style="background:' + tab[0] + ';color:' + tab[1] + '">'
      + '<div class="dn">' + esc(day.name.slice(0, 3)) + '</div><div class="dd">'
      + dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + (isToday ? '<br>Today' : '') + '</div></div>'
      + '<div class="its">' + entries.map(function (e) { return e[1]; }).join('') + '</div></div>';
  }

  function render() {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var todayIso = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    var hasToday = data.days.some(function (d) { return d.date === todayIso; });
    var inWeek = todayIso >= data.weekStart && todayIso <= (function () { var e = new Date(data.weekStart + 'T00:00:00'); e.setDate(e.getDate() + 6); return e.toISOString().slice(0, 10); })();
    var anyOurs = data.days.some(function (x) { return x.items.some(function (i) { return i.ours; }); });
    var html = '<style>' + css + '</style><div class="wo"><div class="hd"><h2>What’s on</h2><span class="rng">' + esc(data.range) + '</span></div>'
      + '<div class="bar">' + (inWeek ? '<div class="sw" role="group" aria-label="Show"><button type="button" data-v="week" aria-pressed="' + (view === 'week') + '">This week</button>'
      + '<button type="button" data-v="today" aria-pressed="' + (view === 'today') + '">Today</button></div>' : '<span></span>')
      + (anyOurs ? '<span class="key"><img class="ym" src="' + BASE + 'assets/logo_mark.png" alt="">Run by Your North Muirton</span>' : '') + '</div>';
    var days = data.days.map(function (d, k) { return [d, k]; });
    if (view === 'today') days = days.filter(function (x) { return x[0].date === todayIso; });
    if (!days.length) html += '<div class="none">' + (view === 'today' ? 'Nothing on in the hall today. Tap “This week” to see the rest of the week.' : 'Nothing is on this week.') + '</div>';
    days.forEach(function (x) { html += card(x[0], x[1], x[0].date === todayIso); });
    html += '<p class="ft">Tap a group for more details. Groups are run independently, so please contact them directly. Updated every Sunday.</p></div>';
    root.innerHTML = html;
  }

  root.addEventListener('click', function (e) {
    var t = e.target;
    if (t.closest && t.closest('a')) return;
    var sw = t.closest && t.closest('.sw button');
    if (sw) { view = sw.getAttribute('data-v'); render(); return; }
    var it = t.closest && t.closest('.it');
    if (it) it.setAttribute('aria-expanded', it.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
  });

  fetch(BASE + 'whats-on.json', { cache: 'no-cache' }).then(function (r) { return r.json(); })
    .then(function (d) { data = d; render(); })
    .catch(function () { root.innerHTML = '<p>What’s On couldn’t load just now.</p>'; });
})();
