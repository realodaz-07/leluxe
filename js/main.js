/* LeLuxe Dermsolutions — scroll reveal, sticky nav, mobile menu */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* scroll reveal */
  var reveals = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* sticky nav */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* expanding panels — expand on hover (one active at a time); tap on touch */
  var panels = document.querySelectorAll('[data-panel]');
  var setActive = function (p) {
    panels.forEach(function (x) { x.classList.remove('is-active'); });
    p.classList.add('is-active');
  };
  panels.forEach(function (p) {
    p.addEventListener('mouseenter', function () { setActive(p); });
    p.addEventListener('focusin', function () { setActive(p); });
    p.addEventListener('click', function (e) {
      // touch/keyboard: expand first tap; let CTA work once already open
      if (p.classList.contains('is-active') && e.target.closest('a')) return;
      if (e.target.closest('a') && !p.classList.contains('is-active')) e.preventDefault();
      setActive(p);
    });
  });

  /* mobile menu */
  var burger = document.querySelector('.nav__burger');
  var links = document.querySelector('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();

/* LeLuxe — booking modal (calendar + slots, no backend; hands off via SMS/Viber/Messenger/Call) */
(function () {
  'use strict';
  var modal = document.getElementById('booking');
  if (!modal) return;
  var PHONE = '+639171043624';
  var monthEl = document.getElementById('bkMonth');
  var grid = document.getElementById('bkGrid');
  var slotsEl = document.getElementById('bkSlots');
  var summaryEl = document.getElementById('bkSummary');
  var nameEl = document.getElementById('bkName');
  var phoneEl = document.getElementById('bkPhone');
  var confirmEl = document.getElementById('bkConfirm');
  var formEl = document.getElementById('bkForm');
  var doneEl = document.getElementById('bkDone');
  var doneMsgEl = document.getElementById('bkDoneMsg');
  var errEl = document.getElementById('bkErr');
  var branchesEl = document.getElementById('bkBranches');
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var SLOTS = ['12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM'];
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var maxDate = new Date(today.getFullYear(), today.getMonth() + 4, 0);
  var view = new Date(today.getFullYear(), today.getMonth(), 1);
  var state = { branch: 'Carmona', date: null, time: null };
  var lastFocus = null;

  function sameDay(a, b) { return a && b && a.getTime() === b.getTime(); }

  function renderSlots() {
    slotsEl.innerHTML = '';
    SLOTS.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'bk__slot'; b.textContent = t;
      if (state.time === t) b.classList.add('is-sel');
      b.addEventListener('click', function () { state.time = t; renderSlots(); update(); });
      slotsEl.appendChild(b);
    });
  }

  function renderCal() {
    var y = view.getFullYear(), m = view.getMonth();
    monthEl.textContent = MONTHS[m] + ' ' + y;
    grid.innerHTML = '';
    var first = new Date(y, m, 1).getDay();
    var days = new Date(y, m + 1, 0).getDate();
    var i;
    for (i = 0; i < first; i++) { var e = document.createElement('span'); e.className = 'bk__day is-empty'; grid.appendChild(e); }
    for (var d = 1; d <= days; d++) {
      var cell = new Date(y, m, d);
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'bk__day'; btn.textContent = d;
      if (cell < today || cell > maxDate) { btn.disabled = true; btn.classList.add('is-off'); }
      else { (function (cd) { btn.addEventListener('click', function () { state.date = cd; renderCal(); update(); }); })(cell); }
      if (sameDay(cell, state.date)) btn.classList.add('is-sel');
      grid.appendChild(btn);
    }
    var prev = modal.querySelector('[data-cal="-1"]');
    prev.disabled = (y === today.getFullYear() && m === today.getMonth());
    var next = modal.querySelector('[data-cal="1"]');
    next.disabled = (y === maxDate.getFullYear() && m === maxDate.getMonth());
  }

  function longDate(d) { return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }); }

  function update() {
    var hasSlot = state.date && state.time;
    summaryEl.textContent = hasSlot
      ? state.branch + ' branch · ' + longDate(state.date) + ' · ' + state.time
      : 'Select a branch, date and time to continue.';
    confirmEl.disabled = !hasSlot;
  }

  function validPHMobile(v) {
    return /^(\+?63|0)9\d{9}$/.test(v.replace(/[\s\-()]/g, ''));
  }

  confirmEl.addEventListener('click', function () {
    if (confirmEl.disabled) return;
    var name = nameEl.value.trim();
    var nameOk = name.length >= 2 && /[a-zA-Z]/.test(name);
    var phoneOk = validPHMobile(phoneEl.value);
    if (!nameOk || !phoneOk) {
      var need = [];
      if (!nameOk) need.push('your full name');
      if (!phoneOk) need.push('a valid Philippine mobile number (e.g. 0917 123 4567)');
      errEl.textContent = 'Please enter ' + need.join(' and ') + '.';
      errEl.hidden = false;
      return;
    }
    errEl.hidden = true;
    doneMsgEl.textContent = 'Your consultation request for the ' + state.branch + ' branch on '
      + longDate(state.date) + ' at ' + state.time + ', under ' + name
      + ', has been noted. We\'ll confirm your slot shortly by phone or Viber.';
    formEl.hidden = true;
    doneEl.hidden = false;
  });

  branchesEl.addEventListener('click', function (e) {
    var b = e.target.closest('.bk__branch'); if (!b) return;
    branchesEl.querySelectorAll('.bk__branch').forEach(function (x) { x.classList.remove('is-sel'); });
    b.classList.add('is-sel'); state.branch = b.getAttribute('data-branch'); update();
  });
  modal.querySelectorAll('[data-cal]').forEach(function (nav) {
    nav.addEventListener('click', function () {
      view = new Date(view.getFullYear(), view.getMonth() + parseInt(nav.getAttribute('data-cal'), 10), 1);
      renderCal();
    });
  });
  [nameEl, phoneEl].forEach(function (el) {
    el.addEventListener('input', function () { errEl.hidden = true; update(); });
  });

  function open() {
    lastFocus = document.activeElement;
    state.date = null; state.time = null;
    formEl.hidden = false; doneEl.hidden = true; errEl.hidden = true;
    renderCal(); renderSlots(); update();
    modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('[data-book]').forEach(function (t) {
    t.addEventListener('click', function (e) { e.preventDefault(); open(); });
  });
  modal.querySelectorAll('[data-close]').forEach(function (c) { c.addEventListener('click', close); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('is-open')) close(); });
})();
