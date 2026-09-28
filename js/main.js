/* ============================================================
   Sevak Auto Garage — shared site script
   Navbar, scroll reveal, gallery lightbox, review filter,
   contact form, floating WhatsApp button + FAQ chatbot.
   ============================================================ */
(function () {
  'use strict';

  var WA_NUMBER = '918806840295';
  var TEL = '+918806840295';
  var ADDRESS = 'Gate No. 2, Opp. Flyover Pillar No. 28, Near Bohra Nursery, Saraswati Nagar, Balram Nagar, Nashik 422003';
  var MAPS_DIR = 'https://www.google.com/maps/dir/?api=1&destination=20.0215545,73.8335745';

  function wa(text) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function now() {
    var d = new Date(), h = d.getHours(), m = d.getMinutes();
    var ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return h + ':' + (m < 10 ? '0' + m : m) + ' ' + ap;
  }

  var ICON = {
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.8h-.02a9.8 9.8 0 0 1-4.99-1.37l-.36-.21-3.71.97.99-3.62-.23-.37a9.79 9.79 0 0 1-1.5-5.22c0-5.4 4.4-9.8 9.82-9.8 2.62 0 5.08 1.03 6.93 2.88a9.74 9.74 0 0 1 2.87 6.93c0 5.41-4.4 9.81-9.8 9.81M20.5 3.47A11.65 11.65 0 0 0 12.05 0C5.6 0 .35 5.25.35 11.7c0 2.06.54 4.07 1.56 5.85L.25 24l6.6-1.73a11.66 11.66 0 0 0 5.2 1.24h.01c6.45 0 11.7-5.25 11.7-11.7 0-3.13-1.22-6.07-3.43-8.28"/></svg>',
    bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="8" width="18" height="12" rx="3"/><path d="M12 8V4M9 2h6"/><circle cx="8.5" cy="14" r="1.3" fill="currentColor" stroke="none"/><circle cx="15.5" cy="14" r="1.3" fill="currentColor" stroke="none"/><path d="M1 12v3M23 12v3"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    tick: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>'
  };

  /* ---------------- navbar ---------------- */
  function initNav() {
    var burger = document.querySelector('.burger');
    var nav = document.getElementById('site-nav');
    if (burger && nav) {
      burger.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      nav.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
          nav.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
        }
      });
    }
    var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    Array.prototype.forEach.call(document.querySelectorAll('.nav a'), function (a) {
      var href = (a.getAttribute('href') || '').toLowerCase();
      if (href === page || (page === '' && href === 'index.html')) {
        a.classList.add('is-active');
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ---------------- scroll reveal ---------------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (n) { n.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(items, function (n, i) {
      n.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
      io.observe(n);
    });
  }

  /* ---------------- carousel ---------------- */
  function initCarousels() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-carousel]'), function (root) {
      var track = root.querySelector('.carousel__track');
      var prev = root.querySelector('[data-car-prev]');
      var next = root.querySelector('[data-car-next]');
      if (!track) return;
      function step(dir) {
        var card = track.firstElementChild;
        var w = card ? card.getBoundingClientRect().width + 19 : 320;
        track.scrollBy({ left: dir * w, behavior: 'smooth' });
      }
      if (prev) prev.addEventListener('click', function () { step(-1); });
      if (next) next.addEventListener('click', function () { step(1); });
    });
  }

  /* ---------------- review filter ---------------- */
  function initFilters() {
    var bar = document.querySelector('[data-filters]');
    if (!bar) return;
    var cards = document.querySelectorAll('[data-review]');
    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter');
      if (!btn) return;
      var key = btn.getAttribute('data-filter');
      Array.prototype.forEach.call(bar.querySelectorAll('.filter'), function (b) {
        b.classList.toggle('is-active', b === btn);
      });
      Array.prototype.forEach.call(cards, function (c) {
        var show = key === 'all' || c.getAttribute('data-review') === key;
        c.hidden = !show;
      });
    });
  }

  /* ---------------- gallery lightbox ---------------- */
  function initLightbox() {
    var items = document.querySelectorAll('[data-lb]');
    if (!items.length) return;
    var box = el('div', 'lightbox');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Photo viewer');
    box.innerHTML =
      '<button class="lightbox__x" type="button" aria-label="Close viewer">' + ICON.x + '</button>' +
      '<button class="lightbox__prev" type="button" aria-label="Previous photo">' + ICON.prev + '</button>' +
      '<button class="lightbox__next" type="button" aria-label="Next photo">' + ICON.next + '</button>' +
      '<div><img alt=""><p class="lightbox__cap"></p></div>';
    document.body.appendChild(box);

    var img = box.querySelector('img');
    var cap = box.querySelector('.lightbox__cap');
    var idx = 0, last = null;

    function show(i) {
      idx = (i + items.length) % items.length;
      var src = items[idx].getAttribute('data-lb');
      var text = items[idx].getAttribute('data-lb-cap') || '';
      img.src = src;
      img.alt = text;
      cap.textContent = text;
    }
    function open(i) {
      last = document.activeElement;
      show(i);
      box.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      box.querySelector('.lightbox__x').focus();
    }
    function close() {
      box.classList.remove('is-open');
      document.body.style.overflow = '';
      if (last) last.focus();
    }
    Array.prototype.forEach.call(items, function (it, i) {
      it.addEventListener('click', function () { open(i); });
    });
    box.querySelector('.lightbox__x').addEventListener('click', close);
    box.querySelector('.lightbox__prev').addEventListener('click', function () { show(idx - 1); });
    box.querySelector('.lightbox__next').addEventListener('click', function () { show(idx + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ---------------- toast ---------------- */
  var toastEl = null, toastTimer = null;
  function toast(title, body) {
    if (!toastEl) {
      toastEl = el('div', 'toast');
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = ICON.tick + '<div><b></b><p></p></div>';
    toastEl.querySelector('b').textContent = title;
    toastEl.querySelector('p').textContent = body;
    void toastEl.offsetWidth;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 6000);
  }

  /* ---------------- contact form ---------------- */
  function initForm() {
    var form = document.getElementById('booking-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var name = (d.get('name') || '').toString().trim();
      var phone = (d.get('phone') || '').toString().trim();
      var car = (d.get('car') || '').toString().trim();
      var service = (d.get('service') || '').toString().trim();
      var msg = (d.get('message') || '').toString().trim();

      var lines = [
        'Hi Sevak Auto Garage, I would like to book a service.',
        'Name: ' + name,
        'Phone: ' + phone,
        'Car: ' + (car || 'Not specified'),
        'Service needed: ' + (service || 'Not specified')
      ];
      if (msg) lines.push('Details: ' + msg);
      var text = lines.join('\n');

      var fallback = document.getElementById('mail-fallback');
      if (fallback) {
        fallback.href = 'mailto:sevakautogarage@gmail.com?subject=' +
          encodeURIComponent('Service enquiry from ' + (name || 'website')) +
          '&body=' + encodeURIComponent(text);
        fallback.hidden = false;
      }
      toast('Request ready', 'Opening WhatsApp with your details filled in. Send the message and we will reply during shop hours.');
      window.open(wa(text), '_blank', 'noopener');
      form.reset();
    });
  }

  /* ---------------- floating widgets ---------------- */
  function initWidgets() {
    var host = document.getElementById('widgets');
    if (!host) return;

    var botBtn = el('button', 'fab-bot');
    botBtn.type = 'button';
    botBtn.setAttribute('aria-label', 'Open the Sevak Auto assistant');
    botBtn.setAttribute('aria-expanded', 'false');
    botBtn.innerHTML = ICON.bot + '<span class="fab-bot__dot"></span>';

    var panel = el('div', 'bot');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Sevak Auto assistant');
    panel.innerHTML =
      '<div class="bot__head">' +
        '<div class="bot__avatar">' + ICON.bot + '</div>' +
        '<div><b>Sevak Auto Assistant</b><span>Usually replies instantly</span></div>' +
        '<button class="bot__x" type="button" aria-label="Close chat">' + ICON.x + '</button>' +
      '</div>' +
      '<div class="bot__log" id="bot-log" aria-live="polite"></div>' +
      '<div class="bot__quick" id="bot-quick"></div>';

    host.appendChild(panel);
    host.appendChild(botBtn);

    var log = panel.querySelector('#bot-log');
    var quick = panel.querySelector('#bot-quick');
    var started = false;

    var waBtn = function (label, text) {
      return '<a class="btn btn--wa btn--sm" href="' + wa(text) + '" target="_blank" rel="noopener">' + ICON.wa + label + '</a>';
    };

    var REPLIES = {
      book: 'Happy to get you booked in. Tell us your car model and what it needs, and we will hold a slot — most jobs can be taken in the same day if you drop the car before 11 AM.<br><br>Workshop hours: <strong>Mon&ndash;Sat, 9 AM &ndash; 7 PM</strong>. Serving Nashik since <strong>2002</strong>.' +
            waBtn('Book on WhatsApp', 'Hi, I would like to book a service slot at Sevak Auto Garage. My car is:'),
      price: 'Our team gives free, honest quotes &mdash; we inspect first, then share an itemised estimate before any work starts, so there are no surprises on the final bill.<br><br>Send us your car model and the issue for an exact figure.' +
             waBtn('Get a free quote', 'Hi, I would like a quote for work on my car. Car model and issue:'),
      location: 'You will find us at <strong>' + ADDRESS + '</strong> &mdash; right opposite flyover pillar no. 28, near Bohra Nursery.<br><br>Parking is available inside the gate.' +
                '<a class="btn btn--primary btn--sm" href="' + MAPS_DIR + '" target="_blank" rel="noopener">Get directions</a>',
      hours: 'We are open <strong>Monday to Saturday, 9:00 AM &ndash; 7:00 PM</strong>, and closed on Sunday. For pickups and drop-offs outside those hours, message us and we will try to arrange it.',
      suspension: 'Suspension is what we are best known for &mdash; struts, shockers, bushes, link rods, wheel bearings and the knocking noises that come with Nashik road conditions. Over <strong>20 years</strong> of it, and we road-test the car before and after the repair.' +
                  waBtn('Ask about suspension', 'Hi, my car has a suspension issue. Details:'),
      human: 'Connecting you to the workshop now &mdash; our team picks up WhatsApp through the day.<br><br>Prefer a call? <strong><a href="tel:' + TEL + '">+91 88068 40295</a></strong>' +
             waBtn('Talk to our team', 'Hi, I would like to speak to someone at Sevak Auto Garage about my car.')
    };

    var CHIPS = [
      { label: 'Book a Service', key: 'book' },
      { label: 'Check Pricing', key: 'price' },
      { label: 'Our Location', key: 'location' },
      { label: 'Opening Hours', key: 'hours' },
      { label: 'Suspension Work', key: 'suspension' },
      { label: 'Talk to a Human', key: 'human' }
    ];

    function addMsg(who, html) {
      var m = el('div', 'msg msg--' + who);
      m.innerHTML = '<div class="msg__b">' + html + '</div><span class="msg__t">' + now() + '</span>';
      log.appendChild(m);
      log.scrollTop = log.scrollHeight;
      return m;
    }
    function addTyping() {
      var t = el('div', 'msg msg--bot', '<div class="typing"><i></i><i></i><i></i></div>');
      log.appendChild(t);
      log.scrollTop = log.scrollHeight;
      return t;
    }
    function botSay(html, delay) {
      var t = addTyping();
      setTimeout(function () {
        t.remove();
        addMsg('bot', html);
      }, delay || 750);
    }
    function renderChips() {
      quick.innerHTML = '';
      CHIPS.forEach(function (c) {
        var b = el('button', 'chip', c.label);
        b.type = 'button';
        b.addEventListener('click', function () {
          addMsg('me', c.label);
          botSay(REPLIES[c.key], 700 + Math.random() * 450);
        });
        quick.appendChild(b);
      });
    }
    function start() {
      if (started) return;
      started = true;
      renderChips();
      botSay("Hi! I'm Sevak Auto's assistant. How can I help you today?", 450);
      setTimeout(function () {
        botSay('Pick one of the options below, or tap <strong>Talk to a Human</strong> to reach the workshop on WhatsApp.', 600);
      }, 1200);
    }
    function toggle(open) {
      var isOpen = open == null ? !panel.classList.contains('is-open') : open;
      panel.classList.toggle('is-open', isOpen);
      botBtn.classList.toggle('is-open', isOpen);
      botBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (isOpen) start();
    }
    botBtn.addEventListener('click', function () { toggle(); });
    panel.querySelector('.bot__x').addEventListener('click', function () { toggle(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) toggle(false);
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-open-chat]'), function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); toggle(true); });
    });
  }

  /* ---------------- workshop reels ---------------- */
  var SND = {
    on: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>',
    off: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="m22 9-6 6M16 9l6 6"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5z"/></svg>'
  };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;

  function playSafe(v, withSound) {
    v.muted = !withSound;
    var p = v.play();
    if (p && p.catch) {
      p.catch(function () {
        if (withSound) { v.muted = true; v.play().catch(function () {}); }
      });
    }
  }

  // full-screen viewer, opened from any [data-reel] element
  function initReelViewer() {
    if (!document.querySelector('[data-reel]')) return;
    var box = el('div', 'rv');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Workshop video player');
    box.innerHTML =
      '<div class="rv__stage">' +
        '<video playsinline preload="auto"></video>' +
        '<span class="rv__bar"></span><span class="rv__count"></span>' +
        '<button class="rv__tap" type="button" aria-label="Pause or play"></button>' +
        '<span class="rv__paused rc__play">' + SND.play + '</span>' +
        '<div class="rv__info"><span class="reel__tag"></span><h3></h3>' +
          '<a class="btn btn--wa btn--sm" target="_blank" rel="noopener">' + ICON.wa + '<span>Get a quote for this</span></a></div>' +
      '</div>' +
      '<button class="rv__btn rv__x" type="button" aria-label="Close video">' + ICON.x + '</button>' +
      '<button class="rv__btn rv__mute" type="button" aria-label="Mute">' + SND.on + '</button>' +
      '<button class="rv__btn rv__prev" type="button" aria-label="Previous video">' + ICON.prev + '</button>' +
      '<button class="rv__btn rv__next" type="button" aria-label="Next video">' + ICON.next + '</button>';
    document.body.appendChild(box);

    var video = box.querySelector('video');
    var bar = box.querySelector('.rv__bar');
    var count = box.querySelector('.rv__count');
    var tag = box.querySelector('.reel__tag');
    var title = box.querySelector('h3');
    var cta = box.querySelector('.rv__info a');
    var muteBtn = box.querySelector('.rv__mute');
    var list = [], idx = 0, last = null, muted = false;

    function setMute(m) {
      muted = m;
      video.muted = m;
      muteBtn.innerHTML = m ? SND.off : SND.on;
      muteBtn.setAttribute('aria-label', m ? 'Unmute' : 'Mute');
    }
    function show(i) {
      idx = (i + list.length) % list.length;
      var it = list[idx];
      var t = it.getAttribute('data-title') || '';
      video.src = it.getAttribute('data-src');
      var img = it.querySelector('img, video');
      video.poster = img ? (img.getAttribute('src') || img.getAttribute('poster') || '') : '';
      tag.textContent = it.getAttribute('data-tag') || '';
      title.textContent = t;
      count.textContent = (idx + 1) + ' / ' + list.length;
      cta.href = wa('Hi, I saw the "' + t + '" video on your website. I would like a quote for similar work on my car.');
      bar.style.width = '0';
      box.classList.remove('is-paused');
      playSafe(video, !muted);
    }
    function open(item) {
      var group = item.closest('[data-reel-group]') || document;
      list = Array.prototype.filter.call(group.querySelectorAll('[data-reel]'), function (n) { return !n.hidden; });
      last = document.activeElement;
      document.dispatchEvent(new CustomEvent('reelviewer', { detail: true }));
      box.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      setMute(false);
      show(Math.max(0, list.indexOf(item)));
      box.querySelector('.rv__x').focus();
    }
    function close() {
      video.pause();
      video.removeAttribute('src');
      video.load();
      box.classList.remove('is-open');
      document.body.style.overflow = '';
      document.dispatchEvent(new CustomEvent('reelviewer', { detail: false }));
      if (last) last.focus();
    }
    function toggle() {
      if (video.paused) { playSafe(video, !muted); box.classList.remove('is-paused'); }
      else { video.pause(); box.classList.add('is-paused'); }
    }

    video.addEventListener('timeupdate', function () {
      if (video.duration) bar.style.width = (video.currentTime / video.duration * 100) + '%';
    });
    video.addEventListener('ended', function () { show(idx + 1); });
    box.querySelector('.rv__tap').addEventListener('click', toggle);
    box.querySelector('.rv__x').addEventListener('click', close);
    box.querySelector('.rv__prev').addEventListener('click', function () { show(idx - 1); });
    box.querySelector('.rv__next').addEventListener('click', function () { show(idx + 1); });
    muteBtn.addEventListener('click', function () { setMute(!muted); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); show(idx - 1); }
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); show(idx + 1); }
      else if (e.key === ' ' && e.target.tagName !== 'A') { e.preventDefault(); toggle(); }
      else if (e.key === 'm' || e.key === 'M') setMute(!muted);
    });
    var tx = 0, ty = 0;
    box.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 50) return;
      if (Math.abs(dy) > Math.abs(dx)) show(idx + (dy < 0 ? 1 : -1));
      else show(idx + (dx < 0 ? 1 : -1));
    });

    document.addEventListener('click', function (e) {
      if (e.target.closest('.rc__sound')) return;
      var item = e.target.closest('[data-reel]');
      if (item && !box.contains(item)) { e.preventDefault(); open(item); }
    });
  }

  // home page top-10 strip: the card in view plays, one at a time; sound is opt-in
  function initReelStrip() {
    var strip = document.querySelector('[data-reel-strip]');
    if (!strip) return;
    var cards = Array.prototype.slice.call(strip.querySelectorAll('.rc'));
    var hints = document.querySelectorAll('[data-sound-toggle]');
    var sound = false, active = null, inView = false, paused = false;
    var ratios = new Map();

    function vid(card) {
      var v = card.querySelector('video');
      if (!v.getAttribute('src')) { v.src = v.getAttribute('data-src'); v.preload = 'auto'; }
      return v;
    }
    function paintSound() {
      cards.forEach(function (c) {
        var b = c.querySelector('.rc__sound');
        b.innerHTML = sound ? SND.on : SND.off;
        b.setAttribute('aria-pressed', sound ? 'true' : 'false');
        b.setAttribute('aria-label', sound ? 'Mute' : 'Turn sound on');
      });
      Array.prototype.forEach.call(hints, function (h) {
        h.setAttribute('aria-pressed', sound ? 'true' : 'false');
        h.innerHTML = (sound ? SND.on : SND.off) + '<span>' + (sound ? 'Sound on' : 'Tap for sound') + '</span>';
      });
    }
    function activate(card) {
      if (active && active !== card) {
        var old = active.querySelector('video');
        old.pause();
        active.classList.remove('is-active', 'is-playing');
      }
      active = card;
      if (!card || paused || !inView) return;
      card.classList.add('is-active', 'is-playing');
      playSafe(vid(card), sound);
    }
    function pick() {
      var best = null, br = 0;
      cards.forEach(function (c) {
        var r = ratios.get(c) || 0;
        if (r > br + 0.01) { br = r; best = c; }
      });
      if (best && br > 0.55) activate(best);
    }

    if (reduceMotion || saveData) {
      // no autoplay: cards stay as posters, tap opens the viewer
      cards.forEach(function (c) { c.querySelector('.rc__sound').hidden = true; });
    } else if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { ratios.set(en.target, en.intersectionRatio); });
        pick();
      }, { threshold: [0, 0.3, 0.55, 0.8, 1] });
      cards.forEach(function (c) { io.observe(c); });
      var secIo = new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (!inView && active) { active.querySelector('video').pause(); active.classList.remove('is-playing'); }
        else if (inView) { if (active) activate(active); else pick(); }
      }, { threshold: 0.25 });
      secIo.observe(strip);
      cards.forEach(function (c) {
        c.addEventListener('mouseenter', function () { if (window.matchMedia('(hover: hover)').matches) activate(c); });
      });
    }

    function toggleSound(card) {
      sound = !sound;
      paintSound();
      if (card && card !== active) activate(card);
      else if (active) {
        var v = vid(active);
        v.muted = !sound;
        if (v.paused) activate(active);
      } else activate(cards[0]);
    }
    cards.forEach(function (c) {
      c.querySelector('.rc__sound').addEventListener('click', function (e) { e.stopPropagation(); toggleSound(c); });
    });
    Array.prototype.forEach.call(hints, function (h) {
      h.addEventListener('click', function () {
        inView = true;
        toggleSound(active || cards[0]);
      });
    });
    document.addEventListener('reelviewer', function (e) {
      paused = e.detail;
      if (paused && active) { active.querySelector('video').pause(); active.classList.remove('is-playing'); }
      else if (!paused && active) activate(active);
    });
    paintSound();
  }

  // gallery category filter
  function initReelFilter() {
    var bar = document.querySelector('[data-reel-filters]');
    if (!bar) return;
    var items = document.querySelectorAll('.reel-grid [data-reel]');
    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter');
      if (!btn) return;
      var key = btn.getAttribute('data-filter');
      Array.prototype.forEach.call(bar.querySelectorAll('.filter'), function (b) {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      Array.prototype.forEach.call(items, function (it) {
        it.hidden = !(key === 'all' || it.getAttribute('data-cat') === key);
      });
    });
  }

  function initHeroVideo() {
    if (!reduceMotion && !saveData) return;
    Array.prototype.forEach.call(document.querySelectorAll('.hero video'), function (v) {
      v.removeAttribute('autoplay');
      v.pause();
    });
  }

  /* ---------------- misc ---------------- */
  function initMisc() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (n) {
      n.textContent = new Date().getFullYear();
    });
  }

  function boot() {
    initNav();
    initReveal();
    initCarousels();
    initFilters();
    initLightbox();
    initForm();
    initWidgets();
    initReelViewer();
    initReelStrip();
    initReelFilter();
    initHeroVideo();
    initMisc();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
