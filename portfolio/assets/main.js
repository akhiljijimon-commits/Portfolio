/* Portfolio interactions. No libraries, no tracking, no network requests. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* 1. Reveal on scroll: elements fade and slide in when they enter the screen */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        $$('.count', e.target).forEach(countUp);
        settle(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) {
      // stagger siblings inside grids so cards arrive one after another
      if (!el.style.getPropertyValue('--rd') && el.parentElement) {
        var sibs = $$(':scope > .reveal', el.parentElement);
        var i = sibs.indexOf(el);
        if (i > 0) el.style.setProperty('--rd', Math.min(i % 3, 3) * 0.09 + 's');
      }
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
    $$('.count').forEach(function (el) { el.textContent = el.dataset.to; });
  }

  // once an element has arrived, switch it to a quick transition so hover effects feel instant
  function settle(el) { setTimeout(function () { el.classList.add('is-done'); }, 1300); }

  /* 2. Count-up numbers */
  function countUp(el) {
    var to = parseFloat(el.dataset.to), dec = parseInt(el.dataset.dec || '0', 10);
    var start = null, dur = 1400;
    function step(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = (to * eased).toFixed(dec);
      if (p < 1) requestAnimationFrame(step); else el.textContent = to.toFixed(dec);
    }
    requestAnimationFrame(step);
  }

  /* 3. Scroll work: progress bar, sticky nav, timeline line, parallax */
  var nav = $('#nav'), bar = $('#progressBar'), timeline = $('#timeline');
  var parallax = $$('[data-parallax]');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    if (nav) nav.classList.toggle('is-stuck', y > 40);
    if (timeline && !reduce) {
      var r = timeline.getBoundingClientRect();
      var p = (window.innerHeight * 0.7 - r.top) / r.height;
      timeline.style.setProperty('--draw', Math.max(0, Math.min(1, p)));
    }
    if (!reduce) parallax.forEach(function (el) {
      el.style.transform = 'translate3d(0,' + (y * parseFloat(el.dataset.parallax)) + 'px,0)';
    });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* 4. Highlight the nav link of the section on screen */
  var links = $$('#navLinks a[href^="#"]:not(.btn)');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) { var s = $(a.getAttribute('href')); if (s) spy.observe(s); });
  }

  /* 5. Mobile menu */
  var burger = $('#burger'), menu = $('#navLinks');
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* 6. Typing effect in the hero */
  var typed = $('#typed');
  if (typed && !reduce) {
    var words = JSON.parse(typed.dataset.words), wi = 0, ci = words[0].length, del = true;
    setTimeout(function tick() {
      var w = words[wi];
      ci += del ? -1 : 1;
      typed.textContent = w.slice(0, ci);
      var wait = del ? 38 : 70;
      if (!del && ci === w.length) { del = true; wait = 1900; }
      else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; wait = 350; }
      setTimeout(tick, wait);
    }, 2600); // the first word stays readable for a moment before the loop starts
  }

  /* 7. Mouse effects (only on devices with a real mouse) */
  if (fine && !reduce) {
    // magnetic buttons: the button leans toward the cursor
    $$('.magnetic').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * 0.25 + 'px,' + (e.clientY - r.top - r.height / 2) * 0.35 + 'px)';
      });
      b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    });
    // cards: red glow follows the cursor, plus a small 3D tilt
    $$('.card').forEach(function (c) {
      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        c.style.setProperty('--mx', x + 'px');
        c.style.setProperty('--my', y + 'px');
        if (c.classList.contains('tilt') && c.classList.contains('is-done')) {
          c.style.transform = 'perspective(900px) rotateX(' + ((y / r.height - 0.5) * -3.500) + 'deg) rotateY(' + ((x / r.width - 0.5) * 3.500) + 'deg) translateY(-4px)';
        }
      });
      c.addEventListener('mouseleave', function () { c.style.transform = ''; });
    });
    // portrait leans with the cursor
    var hero = $('.hero'), frame = $('.portrait__frame');
    if (hero && frame) {
      hero.addEventListener('mousemove', function (e) {
        var x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
        frame.style.transform = 'perspective(900px) rotateY(' + x * 8 + 'deg) rotateX(' + y * -8 + 'deg)';
      });
      hero.addEventListener('mouseleave', function () { frame.style.transform = ''; });
    }
  }

  /* 8. Project filter */
  var filters = $$('.filter'), projects = $$('.project');
  filters.forEach(function (f) {
    f.addEventListener('click', function () {
      var cat = f.dataset.filter;
      filters.forEach(function (o) { var on = o === f; o.classList.toggle('is-on', on); o.setAttribute('aria-pressed', String(on)); });
      projects.forEach(function (p, i) {
        var show = cat === 'all' || p.dataset.cat.split(' ').indexOf(cat) > -1;
        p.classList.toggle('is-hidden', !show);
        if (show && !reduce && p.animate) {
          p.classList.add('is-in');
          p.animate([{ opacity: 0, transform: 'translateY(18px) scale(.98)' }, { opacity: 1, transform: 'none' }],
            { duration: 500, delay: (i % 6) * 40, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
        }
      });
    });
  });

  /* 9. Email: built here so the address is not sitting in the HTML for spam bots.
     A plain mailto: link does nothing for visitors without a mail app set up,
     so the buttons open a small chooser: Gmail, Outlook, mail app or copy. */
  function addr(el) { return el.dataset.u + '@' + el.dataset.d; }
  function mailto(a) {
    var q = [];
    if (a.dataset.subject) q.push('subject=' + encodeURIComponent(a.dataset.subject));
    if (a.dataset.body) q.push('body=' + encodeURIComponent(a.dataset.body));
    return 'mailto:' + addr(a) + (q.length ? '?' + q.join('&') : '');
  }
  function copyText(text, btn, label) {
    var done = function () {
      btn.textContent = 'Copied'; btn.classList.add('is-done');
      setTimeout(function () { btn.textContent = label; btn.classList.remove('is-done'); }, 1800);
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
    function fallback() {
      var t = document.createElement('textarea'); t.value = text; t.setAttribute('readonly', '');
      t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); done(); } catch (e) { window.prompt('Copy my address:', text); }
      document.body.removeChild(t);
    }
  }
  var pick = $('#mailPick');
  var canPick = pick && typeof pick.showModal === 'function';
  $$('.js-mail').forEach(function (a) {
    a.href = mailto(a);
    if (!canPick) return; // very old browsers keep the plain mailto: link
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var to = addr(a), su = a.dataset.subject || '', body = a.dataset.body || '';
      $('#mailPickTitle').textContent = a.textContent.trim();
      $('#mailPickAddr').textContent = to;
      $('#mpGmail').href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(to) +
        '&su=' + encodeURIComponent(su) + '&body=' + encodeURIComponent(body);
      $('#mpOutlook').href = 'https://outlook.live.com/mail/0/deeplink/compose?to=' + encodeURIComponent(to) +
        '&subject=' + encodeURIComponent(su) + '&body=' + encodeURIComponent(body);
      $('#mpApp').href = mailto(a);
      pick.showModal();
    });
  });
  if (canPick) {
    pick.addEventListener('click', function (e) {
      // close on the x, on a chosen option, or on a click outside the box
      if (e.target === pick || e.target.closest('[data-close]') || e.target.closest('a')) pick.close();
    });
    $('#mpCopy').addEventListener('click', function () { copyText($('#mailPickAddr').textContent, this, 'Copy address'); });
  }
  $$('.js-mailtext').forEach(function (el) { el.textContent = addr(el); });
  var copy = $('#copyMail'), mailText = $('.js-mailtext');
  if (copy && mailText) {
    copy.addEventListener('click', function () { copyText(addr(mailText), copy, 'Copy'); });
  }

  /* 10. Hero background: a drifting network of connected points, like a neural network */
  var net = $('#net');
  if (net && !reduce && net.getContext) {
    var ctx = net.getContext('2d'), pts = [], W = 0, H = 0, dpr = 1, running = false, mouse = null;
    var sizeNet = function () {
      var r = net.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      net.width = W * dpr; net.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(70, Math.max(24, W * H / 17000)));
      pts = [];
      for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, hot: Math.random() < 0.18 });
    };
    var drawNet = function () {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      var i, j, a, b, d, max = 175;
      for (i = 0; i < pts.length; i++) {
        a = pts[i]; a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;
        if (mouse) { // points close to the cursor are gently pushed away
          var mx = a.x - mouse.x, my = a.y - mouse.y, md = Math.sqrt(mx * mx + my * my);
          if (md < 110 && md > 0) { a.x += mx / md * 0.8; a.y += my / md * 0.8; }
        }
        for (j = i + 1; j < pts.length; j++) {
          b = pts[j]; d = Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
          if (d < max) {
            ctx.strokeStyle = (a.hot || b.hot) ? 'rgba(239,43,43,' + (0.55 * (1 - d / max)) + ')' : 'rgba(255,255,255,' + (0.17 * (1 - d / max)) + ')';
            ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        ctx.fillStyle = a.hot ? 'rgba(255,90,70,.9)' : 'rgba(255,255,255,.4)';
        ctx.beginPath(); ctx.arc(a.x, a.y, a.hot ? 2.2 : 1.4, 0, 6.2832); ctx.fill();
      }
      requestAnimationFrame(drawNet);
    };
    sizeNet();
    window.addEventListener('resize', sizeNet);
    var heroEl = $('.hero');
    heroEl.addEventListener('mousemove', function (e) { var r = net.getBoundingClientRect(); mouse = { x: e.clientX - r.left, y: e.clientY - r.top }; });
    heroEl.addEventListener('mouseleave', function () { mouse = null; });
    // only animate while the top of the page is visible, to save battery
    new IntersectionObserver(function (en) {
      var on = en[0].isIntersecting;
      if (on && !running) { running = true; requestAnimationFrame(drawNet); } else if (!on) running = false;
    }).observe(heroEl);
  }

  /* 11. Slider of animated illustrations: arrows, drag, dots, gentle auto-slide */
  var slider = $('#slider');
  if (slider) {
    var slides = $$('.slide', slider), prev = $('#slidePrev'), next = $('#slideNext'), dots = $('#sliderDots');
    var stepW = function () { return slides[1].offsetLeft - slides[0].offsetLeft; };
    var maxS = function () { return slider.scrollWidth - slider.clientWidth; };
    var current = function () { return Math.min(slides.length - 1, Math.round(slider.scrollLeft / stepW())); };
    slides.forEach(function () { dots.appendChild(document.createElement('i')); });
    var sync = function () {
      var c = slider.scrollLeft >= maxS() - 4 ? slides.length - 1 : current();
      $$('i', dots).forEach(function (d, i) { d.classList.toggle('is-on', i === c); });
      prev.disabled = slider.scrollLeft < 4;
      next.disabled = slider.scrollLeft >= maxS() - 4;
    };
    var go = function (dir) { slider.scrollBy({ left: dir * stepW(), behavior: reduce ? 'auto' : 'smooth' }); };
    prev.addEventListener('click', function () { go(-1); stopAuto(); });
    next.addEventListener('click', function () { go(1); stopAuto(); });
    slider.addEventListener('scroll', function () { requestAnimationFrame(sync); }, { passive: true });
    slider.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { go(1); stopAuto(); } else if (e.key === 'ArrowLeft') { go(-1); stopAuto(); }
    });
    // drag with the mouse
    var down = false, sx = 0, sl = 0, moved = false;
    slider.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = slider.scrollLeft; });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      if (Math.abs(e.clientX - sx) > 4) { moved = true; slider.classList.add('is-drag'); stopAuto(); }
      if (moved) slider.scrollLeft = sl - (e.clientX - sx);
    });
    window.addEventListener('pointerup', function () {
      if (!down) return; down = false;
      if (moved) { slider.classList.remove('is-drag'); slider.scrollTo({ left: current() * stepW(), behavior: 'smooth' }); }
    });
    // the drawings only run while their card is visible
    if ('IntersectionObserver' in window) {
      var live = new IntersectionObserver(function (en) {
        en.forEach(function (e) { e.target.classList.toggle('is-live', e.isIntersecting); });
      }, { threshold: 0.25 });
      slides.forEach(function (s) { live.observe(s); });
    } else slides.forEach(function (s) { s.classList.add('is-live'); });
    // auto-slide every few seconds until the visitor takes over
    var timer = null, auto = !reduce;
    function stopAuto() { auto = false; clearInterval(timer); timer = null; }
    function startAuto() {
      if (!auto || timer) return;
      timer = setInterval(function () {
        if (slider.matches(':hover')) return;
        if (slider.scrollLeft >= maxS() - 4) slider.scrollTo({ left: 0, behavior: 'smooth' }); else go(1);
      }, 4200);
    }
    slider.addEventListener('touchstart', stopAuto, { passive: true });
    slider.addEventListener('wheel', stopAuto, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) startAuto(); else { clearInterval(timer); timer = null; }
      }, { threshold: 0.4 }).observe(slider);
    }
    sync();
  }

  var year = $('#year'); if (year) year.textContent = new Date().getFullYear();
})();
