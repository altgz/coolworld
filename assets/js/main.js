/* =========================================================
   COOL WORLD INTERNATIONAL — site behaviour
   ========================================================= */
(function () {
  'use strict';

  /* ---------- language switch (persisted) ---------- */
  var LANG_KEY = 'cw-lang';
  var LANG_MAP = { zh: 'zh-CN', en: 'en', vi: 'vi' };
  function applyLang(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', LANG_MAP[lang] || 'en');
    document.querySelectorAll('[data-lang-btn]').forEach(function (b) {
      b.classList.toggle('is-on', b.dataset.langBtn === lang);
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
            '<span data-en>' + (cur.dataset.enCap || '') + '</span>' +
            '<span data-vi>' + (cur.dataset.viCap || '') + '</span>';
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

  /* ---------- office contact tooltip (contact.html) ---------- */
  var OFFICE_STAFF = {
    xiamen: {
      zh: '酷界（厦门）国际物流有限公司',
      en: 'COOL WORLD (XIAMEN) LOGISTICS INTERNATIONAL CO LTD',
      staff: [
        { name:'Bob Wu', title:'总经理',   phone:'+86 13058184999', email:'bob.wu@coolworldcn.com',         wechat:'bob_tyrone', tel:'+86 592 5639968', qq:'2300687944' },
        { name:'Kathy Zhang', title:'副总经理', phone:'+86 13606928663', email:'kathy.zhang@coolworldcn.com', wechat:'13606928663', tel:'+86 592 5639568', qq:'1542195492' },
        { name:'Jane Luo', title:'人力资源总监', phone:'+86 18106088909', email:'jane.luo@coolworldcn.com',     wechat:'18106088909', tel:'+86 592 5772527', qq:'1247089857' },
        { name:'Duke Huang', title:'公司经理', phone:'+86 15960619043', email:'duke.huang@coolworldcn.com',   wechat:'15960619043', tel:'+86 592 5772511', qq:'191201578' },
        { name:'Grace Zhang', title:'海外市场经理', phone:'+86 19906043621', email:'grace.zhang@coolworldcn.com', wechat:'19906043621', tel:'+86 592 5772511', qq:'2445645578' },
        { name:'Lily Xie', title:'海外业务专员', phone:'+86 17720995595', email:'biz01.xm@coolworldcn.com',     wechat:'17720995595', tel:'+86 592 5772511', qq:'1943464048' }
      ]
    },
    guangzhou: {
      zh: '酷界（广州）国际物流有限公司',
      en: 'COOL WORLD (GUANGZHOU) LOGISTICS INTERNATIONAL CO LTD',
      staff: [
        { name:'Shirley Ye', title:'总经理',   phone:'+86 18924153132', email:'shirley.yeh@coolworldcn.com', wechat:'Juan583166134',   tel:'020-83720206', qq:'1074288341' },
        { name:'Tim Lin',   title:'销售经理', phone:'+86 19068099365', email:'tim.lin@coolworldcn.com',     wechat:'timlin0228113657', tel:'020-83720206', qq:'3813755484' }
      ]
    },
    shenzhen: {
      zh: '酷界速运（深圳）有限公司',
      en: 'COOL WORLD (SHENZHEN) EXPRESS CO LTD',
      staff: [
        { name:'Klaus Wang', title:'总经理',   phone:'+86 13113874333', email:'klaus.wang@coolworldcn.com',  wechat:'TQ995990717',   tel:'+86 755 82281167', qq:'1773176512' },
        { name:'Sharon Wang', title:'副总经理', phone:'+86 15815522452', email:'sharon.wang@coolworldcn.com', wechat:'sharonwangxiaona', tel:'+86 755 82281167', qq:'153345268' }
      ]
    },
    vietnam: {
      zh: '酷界国际物流（越南）有限公司',
      en: 'COOL WORLD LOGISTICS VIETNAM CO LTD',
      staff: [
        { name:'Bob Wu',    title:'总经理',   phone:'+84 768941949',   email:'bob.wu@coolworldcn.com',       wechat:'bob_tyrone',   tel:'+84 768941949',   qq:'2300687944' },
        { name:'Dicy Chen', title:'商务经理', phone:'+84 367052308',   email:'dicy.chen@coolworlddon.com',   wechat:'CHXD2234',     tel:'+84 367052308',   qq:'' },
        { name:'Pier Wu',   title:'海外部经理', phone:'+84 768941949', email:'pier.wu@coolworldcn.com',      wechat:'+852 91861358', tel:'+84 2871076168', qq:'' },
        { name:'Sean Zhang', title:'业务经理', phone:'+86 13842670726', email:'sales01@coolworldvn.com',      wechat:'18242070238',   tel:'+84 367052308',   qq:'' }
      ]
    },
    malaysia: {
      zh: 'COOL WORLD (M) SDN.BHD',
      en: 'COOL WORLD (M) SDN.BHD',
      staff: [
        { name:'Calvin Chia', title:'总经理', phone:'+60 111 256 4767', email:'calvin@coolworldcn.com', wechat:'CalvinChiawg', tel:'', qq:'' }
      ]
    }
  };

  var tooltip = document.getElementById('officeTooltip');
  if (tooltip) {
    var titleEl = tooltip.querySelector('#officeTooltipTitle');
    var subEl = tooltip.querySelector('.office-tooltip__subtitle');
    var bodyEl = tooltip.querySelector('#officeTooltipBody');
    var hideTimer = null;
    var currentKey = null;

    function renderRows(staff) {
      if (!staff || !staff.length) {
        bodyEl.innerHTML = '<tr><td colspan="7" class="office-tooltip__empty">暂无联系人信息</td></tr>';
        return;
      }
      bodyEl.innerHTML = staff.map(function (s) {
        var phoneCell = s.phone ? '<a href="tel:' + s.phone.replace(/\s+/g,'') + '">' + s.phone + '</a>' : '';
        var emailCell = s.email ? '<a href="mailto:' + s.email + '">' + s.email + '</a>' : '';
        return '<tr>' +
          '<td>' + (s.name || '') + '</td>' +
          '<td>' + (s.title || '') + '</td>' +
          '<td>' + phoneCell + '</td>' +
          '<td>' + emailCell + '</td>' +
          '<td>' + (s.wechat || '') + '</td>' +
          '<td>' + (s.tel || '') + '</td>' +
          '<td>' + (s.qq || '') + '</td>' +
        '</tr>';
      }).join('');
    }

    function positionTooltip(anchor) {
      var rect = anchor.getBoundingClientRect();
      var tipRect = tooltip.getBoundingClientRect();
      var w = tipRect.width;
      var h = tipRect.height;
      var pad = 14;
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      var top = rect.bottom + pad;
      var left = rect.left;
      if (left + w > vw - 8) left = vw - w - 8;
      if (left < 8) left = 8;
      if (top + h > vh - 8) { top = rect.top - h - pad; }
      if (top < 8) top = 8;
      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
    }

    function showTooltip(officeKey, anchor) {
      cancelHide();
      var data = OFFICE_STAFF[officeKey];
      if (!data) return;
      currentKey = officeKey;
      titleEl.textContent = data.zh || '';
      subEl.textContent = data.en || '';
      renderRows(data.staff);
      tooltip.classList.add('is-visible');
      tooltip.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(function () { positionTooltip(anchor); });
    }

    function scheduleHide() {
      cancelHide();
      hideTimer = setTimeout(function () {
        tooltip.classList.remove('is-visible');
        tooltip.setAttribute('aria-hidden', 'true');
        currentKey = null;
      }, 180);
    }

    function cancelHide() {
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    }

    tooltip.addEventListener('mouseenter', cancelHide);
    tooltip.addEventListener('mouseleave', scheduleHide);
    window.addEventListener('scroll', function () {
      if (tooltip.classList.contains('is-visible') && currentKey) {
        var card = document.querySelector('.office[data-office="' + currentKey + '"]');
        if (card) positionTooltip(card);
      }
    }, { passive: true });
    window.addEventListener('resize', function () {
      if (tooltip.classList.contains('is-visible') && currentKey) {
        var card = document.querySelector('.office[data-office="' + currentKey + '"]');
        if (card) positionTooltip(card);
      }
    });

    document.querySelectorAll('.office[data-office]').forEach(function (card) {
      card.addEventListener('mouseenter', function () { showTooltip(card.dataset.office, card); });
      card.addEventListener('mouseleave', scheduleHide);
      card.addEventListener('focus', function () { showTooltip(card.dataset.office, card); });
      card.addEventListener('blur', scheduleHide);
    });
  }
})();
