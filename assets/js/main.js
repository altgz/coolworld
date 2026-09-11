/* =========================================================
   COOL WORLD INTERNATIONAL — site behaviour
   ========================================================= */
(function () {
  'use strict';

  /* ---------- language switch (persisted) ---------- */
  var LANG_KEY = 'cw-lang';
  function applyLang(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.classList.toggle('is-on', b.dataset.lang === lang);
    });
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  }
  document.querySelectorAll('[data-lang-btn]').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.dataset.langBtn); });
  });
  var saved = 'zh';
  try { saved = localStorage.getItem(LANG_KEY) || 'zh'; } catch (e) {}
  applyLang(saved);

  /* ---------- sticky header shadow ---------- */
  var header = document.querySelector('.header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- mobile nav ---------- */
  var burger = document.querySelector('.burger');
  var mnav = document.querySelector('.mnav');
  function closeMnav() { if (mnav) mnav.classList.remove('is-open'); document.body.style.overflow = ''; }
  if (burger && mnav) {
    burger.addEventListener('click', function () {
      mnav.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
    mnav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMnav); });
    var c = mnav.querySelector('.mnav__close');
    if (c) c.addEventListener('click', closeMnav);
  }

  /* ---------- reveal on scroll ---------- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && items.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- carrier marquee: duplicate track ---------- */
  document.querySelectorAll('.marquee__track').forEach(function (t) {
    t.innerHTML += t.innerHTML;
  });

  /* ---------- quote / message forms (front-end demo) ---------- */
  document.querySelectorAll('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var ok = f.querySelector('.form__ok');
      if (ok) {
        ok.hidden = false;
        ok.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
      f.reset();
    });
  });

  /* ---------- hero carousel ---------- */
  var slider = document.querySelector('.hero__slider');
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero__slide'));
    var dotsWrap = document.querySelector('.hero__dots');
    var cap = document.querySelector('.hero__cap');
    var hero = slider.closest('.hero');
    var idx = 0, timer = null, N = slides.length;

    var show = function (i) {
      idx = (i + N) % N;
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === idx); });
      if (dotsWrap) {
        dotsWrap.querySelectorAll('.dot').forEach(function (d, k) {
          d.classList.toggle('is-active', k === idx);
        });
      }
      if (cap) {
        var cur = slides[idx];
        cap.style.opacity = '0';
        setTimeout(function () {
          cap.innerHTML =
            '<span data-zh>' + (cur.dataset.zhCap || '') + '</span>' +
            '<span data-en>' + (cur.dataset.enCap || '') + '</span>';
          cap.style.opacity = '1';
        }, 380);
      }
    };
    var play = function () {
      if (timer) clearInterval(timer);
      var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) return; /* no autoplay for reduced motion */
      timer = setInterval(function () { show(idx + 1); }, 6000);
    };
    var stop = function () { if (timer) clearInterval(timer); };

    show(0);
    play();
    document.querySelectorAll('[data-slide-next]').forEach(function (b) {
      b.addEventListener('click', function () { show(idx + 1); });
    });
    document.querySelectorAll('[data-slide-prev]').forEach(function (b) {
      b.addEventListener('click', function () { show(idx - 1); });
    });
    if (dotsWrap) {
      dotsWrap.querySelectorAll('.dot').forEach(function (d) {
        d.addEventListener('click', function () { show(+d.dataset.slideTo); });
      });
    }
    if (hero) {
      hero.addEventListener('mouseenter', stop);
      hero.addEventListener('mouseleave', play);
      document.addEventListener('visibilitychange', function () {
        document.hidden ? stop() : play();
      });
    }
  }

  /* ---------- current year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
