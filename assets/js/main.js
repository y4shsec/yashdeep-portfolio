/**
 * SENTINEL PORTFOLIO — main.js
 * Cyberpunk Hacker Dashboard
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     1. PRELOADER
  ═══════════════════════════════════════════ */
  var preloader = document.getElementById('preloader');
  if (preloader) {
    var bootMsgs = [
      'INITIALIZING SECURE ENVIRONMENT...',
      'LOADING KERNEL MODULES...',
      'MOUNTING ENCRYPTED FILESYSTEM...',
      'ESTABLISHING SECURE CONNECTION...',
      'CALIBRATING THREAT DETECTION...',
      'SYSTEM READY. WELCOME, SENTINEL.'
    ];
    var msgEl = document.getElementById('boot-msg');
    var mi = 0;
    var bootInterval = setInterval(function () {
      mi++;
      if (msgEl && mi < bootMsgs.length) msgEl.textContent = bootMsgs[mi];
      if (mi >= bootMsgs.length - 1) clearInterval(bootInterval);
    }, 450);

    function hidePreloader() {
      preloader.style.transition = 'opacity 0.5s ease';
      preloader.style.opacity = '0';
      setTimeout(function () { preloader.style.display = 'none'; }, 600);
    }
    // Hard timeout — never stays stuck
    setTimeout(hidePreloader, 3000);
    window.addEventListener('load', function () { setTimeout(hidePreloader, 200); });
  }

  /* ═══════════════════════════════════════════
     2. MATRIX RAIN
  ═══════════════════════════════════════════ */
  var canvas = document.getElementById('matrix-canvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var chars = '01アイウエオカキクケABCDEF!@#$%^&*<>/|{}[]?+=~01';
    var fSize = 13;
    var drops = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      var cols = Math.floor(canvas.width / fSize);
      drops = [];
      for (var i = 0; i < cols; i++) {
        drops[i] = Math.random() * -100;
      }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    setInterval(function () {
      ctx.fillStyle = 'rgba(2,4,8,0.055)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = fSize + 'px "Share Tech Mono", monospace';
      for (var i = 0; i < drops.length; i++) {
        var ch = chars[Math.floor(Math.random() * chars.length)];
        var alpha = 0.1 + Math.random() * 0.45;
        ctx.fillStyle = 'rgba(0,255,65,' + alpha + ')';
        ctx.fillText(ch, i * fSize, drops[i] * fSize);
        if (drops[i] * fSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.5;
      }
    }, 50);
  }

  /* ═══════════════════════════════════════════
     3. LIVE CLOCK
  ═══════════════════════════════════════════ */
  var clockEl = document.getElementById('nav-clock');
  if (clockEl) {
    function updateClock() {
      clockEl.textContent = new Date().toTimeString().substring(0, 8);
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  /* ═══════════════════════════════════════════
     4. HEADER SCROLL EFFECT
  ═══════════════════════════════════════════ */
  var header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════
     5. MOBILE NAV
  ═══════════════════════════════════════════ */
  var mobileBtn = document.getElementById('mobileBtn');
  var mobileOverlay = document.getElementById('mobile-nav-overlay');
  var mobClose = document.getElementById('mobClose');

  function openMob() {
    if (mobileOverlay) {
      mobileOverlay.classList.add('open');
    }
    if (mobileBtn) {
      mobileBtn.setAttribute('aria-expanded', 'true');
    }
  }

  function closeMob() {
    if (mobileOverlay) {
      mobileOverlay.classList.remove('open');
    }
    if (mobileBtn) {
      mobileBtn.setAttribute('aria-expanded', 'false');
    }
  }

  // Expose closeMob globally for onclick attributes
  window.closeMob = closeMob;

  if (mobileBtn) mobileBtn.addEventListener('click', openMob);
  if (mobClose) mobClose.addEventListener('click', closeMob);

  // Close on overlay link clicks
  if (mobileOverlay) {
    mobileOverlay.querySelectorAll('.mob-link').forEach(function (a) {
      a.addEventListener('click', closeMob);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (mobileOverlay.classList.contains('open') &&
        mobileBtn && !mobileBtn.contains(e.target) &&
        !mobileOverlay.contains(e.target)) {
        closeMob();
      }
    });
  }

  /* ═══════════════════════════════════════════
     6. SMOOTH SCROLL (safe)
  ═══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (!href || href === '#') return;
      try {
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          closeMob();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (_) { }
    });
  });

  /* ═══════════════════════════════════════════
     7. ACTIVE NAV SCROLLSPY
  ═══════════════════════════════════════════ */
  function scrollspy() {
    var scrollY = window.scrollY + 120;
    var current = '';
    document.querySelectorAll('section[id]').forEach(function (s) {
      if (scrollY >= s.offsetTop) current = s.id;
    });
    document.querySelectorAll('.navmenu a, .mob-link').forEach(function (a) {
      a.classList.remove('active');
      var href = a.getAttribute('href');
      if (href && href === '#' + current) a.classList.add('active');
    });
  }
  window.addEventListener('scroll', scrollspy, { passive: true });
  window.addEventListener('load', scrollspy);

  /* ═══════════════════════════════════════════
     8. SCROLL TO TOP
  ═══════════════════════════════════════════ */
  var scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      scrollTopBtn.classList.toggle('active', window.scrollY > 400);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ═══════════════════════════════════════════
     9. TYPED.JS
  ═══════════════════════════════════════════ */
  window.addEventListener('load', function () {
    var typedEl = document.querySelector('.typed');
    if (typedEl && typeof Typed !== 'undefined') {
      var items = typedEl.getAttribute('data-typed-items');
      if (items) {
        new Typed('.typed', {
          strings: items.split(',').map(function (s) { return s.trim(); }),
          loop: true,
          typeSpeed: 80,
          backSpeed: 45,
          backDelay: 2200
        });
      }
    }
  });

  /* ═══════════════════════════════════════════
     10. SKILL BARS (IntersectionObserver)
  ═══════════════════════════════════════════ */
  function animateSkills() {
    document.querySelectorAll('.sk-bar').forEach(function (bar) {
      var pct = bar.getAttribute('aria-valuenow');
      if (pct) bar.style.width = pct + '%';
    });
  }

  var skillPanel = document.querySelector('.skills-animation');
  if (skillPanel) {
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries, obs) {
        if (entries[0].isIntersecting) {
          animateSkills();
          obs.disconnect();
        }
      }, { threshold: 0.2 });
      observer.observe(skillPanel);
    } else {
      animateSkills();
    }
  }

  /* ═══════════════════════════════════════════
     11. AOS INIT
  ═══════════════════════════════════════════ */
  window.addEventListener('load', function () {
    if (typeof AOS !== 'undefined') {
      AOS.init({ duration: 650, easing: 'ease-in-out', once: true, offset: 60 });
    }
    // Fallback: force visibility after 1.8s
    setTimeout(function () {
      document.querySelectorAll('[data-aos]').forEach(function (el) {
        el.classList.add('aos-animate');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }, 1800);
  });

  /* ═══════════════════════════════════════════
     12. ISOTOPE PORTFOLIO FILTER
  ═══════════════════════════════════════════ */
  window.addEventListener('load', function () {
    document.querySelectorAll('.isotope-layout').forEach(function (layout) {
      var container = layout.querySelector('.isotope-container');
      if (!container) return;

      var defaultFilter = layout.getAttribute('data-default-filter') || '*';
      var iso;

      function initIso() {
        if (typeof Isotope !== 'undefined') {
          iso = new Isotope(container, {
            itemSelector: '.isotope-item',
            layoutMode: layout.getAttribute('data-layout') || 'masonry',
            filter: defaultFilter,
            sortBy: layout.getAttribute('data-sort') || 'original-order'
          });
        }
      }

      if (typeof imagesLoaded !== 'undefined') {
        imagesLoaded(container, initIso);
      } else {
        initIso();
      }

      layout.querySelectorAll('.isotope-filters li').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var active = layout.querySelector('.isotope-filters .filter-active');
          if (active) active.classList.remove('filter-active');
          btn.classList.add('filter-active');
          var filter = btn.getAttribute('data-filter');
          if (iso) {
            iso.arrange({ filter: filter === '*' ? '*' : filter });
          } else {
            // Fallback without isotope
            container.querySelectorAll('.isotope-item').forEach(function (item) {
              if (filter === '*' || item.classList.contains(filter.replace('.', ''))) {
                item.style.display = '';
              } else {
                item.style.display = 'none';
              }
            });
          }
        });
      });
    });
  });

  /* ═══════════════════════════════════════════
     13. GLIGHTBOX
  ═══════════════════════════════════════════ */
  window.addEventListener('load', function () {
    if (typeof GLightbox !== 'undefined') {
      GLightbox({ selector: '.glightbox' });
    }
  });

  /* ═══════════════════════════════════════════
     14. SWIPER
  ═══════════════════════════════════════════ */
  window.addEventListener('load', function () {
    document.querySelectorAll('.init-swiper').forEach(function (el) {
      if (typeof Swiper === 'undefined') return;
      var cfgEl = el.querySelector('.swiper-config');
      var cfg = {};
      if (cfgEl) { try { cfg = JSON.parse(cfgEl.textContent.trim()); } catch (_) { } }
      new Swiper(el, cfg);
    });
  });

  /* ═══════════════════════════════════════════
     15. PURECOUNTER
  ═══════════════════════════════════════════ */
  window.addEventListener('load', function () {
    if (typeof PureCounter !== 'undefined') new PureCounter();
  });

  /* ═══════════════════════════════════════════
     16. HASH SCROLL ON LOAD
  ═══════════════════════════════════════════ */
  window.addEventListener('load', function () {
    if (window.location.hash) {
      try {
        var target = document.querySelector(window.location.hash);
        if (target) {
          setTimeout(function () {
            target.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        }
      } catch (_) { }
    }
  });

  /* ═══════════════════════════════════════════
     17. GLITCH HOVER EFFECT on project cards
  ═══════════════════════════════════════════ */
  document.querySelectorAll('.proj-card').forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      var title = card.querySelector('.proj-title');
      if (title) title.style.textShadow = '0 0 16px rgba(0,255,65,0.6), 2px 0 rgba(0,245,255,0.4)';
    });
    card.addEventListener('mouseleave', function () {
      var title = card.querySelector('.proj-title');
      if (title) title.style.textShadow = '';
    });
  });

  /* ═══════════════════════════════════════════
     18. DECRYPTION TEXT EFFECT on section titles
  ═══════════════════════════════════════════ */
  var cryptoChars = '!<>-_\\/[]{}—=+*^?#';

  function decryptText(el) {
    var original = el.dataset.value || el.textContent;
    el.dataset.value = original;
    var iter = 0;
    var interval = setInterval(function () {
      el.textContent = original.split('').map(function (ch, i) {
        if (i < iter) return original[i];
        return cryptoChars[Math.floor(Math.random() * cryptoChars.length)];
      }).join('');
      if (iter >= original.length) clearInterval(interval);
      iter += 0.4;
    }, 30);
  }

  // Apply on section titles when they come into view
  if ('IntersectionObserver' in window) {
    document.querySelectorAll('.section-title h2').forEach(function (h2) {
      var obs = new IntersectionObserver(function (entries, o) {
        if (entries[0].isIntersecting) {
          decryptText(h2);
          o.disconnect();
        }
      }, { threshold: 0.5 });
      obs.observe(h2);
    });
  }

})();

/* ═══════════════════════════════════════════
   19. NETWATCH SOC v2 — GIF Tab Switcher
═══════════════════════════════════════════ */

function nwSwitch(btn, targetId) {
  // Deactivate all tabs and frames
  document.querySelectorAll('.nw-tab').forEach(function (t) { t.classList.remove('active'); });
  document.querySelectorAll('.nw-frame').forEach(function (f) { f.classList.remove('active'); });
  // Activate clicked tab and target frame
  btn.classList.add('active');
  var frame = document.getElementById(targetId);
  if (frame) frame.classList.add('active');
}

/* ═══════════════════════════════════════════
   20. Contact Form
═══════════════════════════════════════════ */
document.getElementById("contactForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const btn = form.querySelector("button[type=submit]");
  const originalText = btn.innerHTML;

  btn.disabled = true;
  btn.innerHTML = "Sending...";

  try {
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.success) {
      window.location.href = "thankyou.html";
    } else {
      alert(data.message || "Something went wrong. Please try again.");
    }
  } catch (err) {
    alert("Network error. Please try again later.");
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
});