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
