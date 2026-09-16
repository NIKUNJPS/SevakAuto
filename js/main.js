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
    initMisc();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
