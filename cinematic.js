/* ============================================================
   yezhuththu.site — shared cinematic motion engine
   Assumes gsap + ScrollTrigger are loaded (from cdnjs) before this
   file, but degrades gracefully to plain CSS/IntersectionObserver
   if they are not available or fail to load.
   ============================================================ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = !!window.gsap;
  const hasScrollTrigger = hasGSAP && !!window.ScrollTrigger;
  if (hasScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------------- preloader ---------------- */
  function initPreloader() {
    const pre = document.querySelector('[data-preloader]');
    const fill = document.querySelector('[data-preloader-fill]');
    const barsRoot = document.body;
    if (!pre) return;

    if (reduceMotion) {
      pre.classList.add('is-done');
      barsRoot.classList.add('cine-bars-open');
      return;
    }

    let progress = 0;
    const tick = setInterval(() => {
      progress += Math.random() * 18;
      if (progress > 92) progress = 92;
      if (fill) fill.style.width = progress + '%';
    }, 140);

    const finish = () => {
      clearInterval(tick);
      if (fill) fill.style.width = '100%';
      setTimeout(() => {
        pre.classList.add('is-done');
        barsRoot.classList.add('cine-bars-open');
      }, 260);
    };

    if (document.readyState === 'complete') {
      setTimeout(finish, 500);
    } else {
      window.addEventListener('load', () => setTimeout(finish, 350));
      // safety net so a slow asset never traps the visitor behind the preloader
      setTimeout(finish, 3200);
    }
  }

  /* ---------------- page-to-page curtain transition ---------------- */
  function initPageCurtain() {
    const curtain = document.querySelector('[data-page-curtain]');
    if (!curtain) return;

    // Reset on bfcache restore (browser back/forward) so the curtain
    // never gets stuck covering the page.
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) {
        curtain.classList.remove('is-animating', 'is-covering');
        document.body.classList.remove('cine-bars-open');
        const pre = document.querySelector('[data-preloader]');
        if (pre) pre.classList.remove('is-done');
        initPreloader();
      }
    });

    if (reduceMotion) return;

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (link.target === '_blank' || link.hasAttribute('download')) return;
      let url;
      try { url = new URL(href, window.location.href); } catch (err) { return; }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.hash) return;

      e.preventDefault();
      curtain.classList.add('is-animating');
      requestAnimationFrame(() => curtain.classList.add('is-covering'));
      setTimeout(() => { window.location.href = url.href; }, 560);
    });
  }

  /* ---------------- kinetic split-line reveal ---------------- */
  function splitLines(el) {
    const text = el.textContent.trim();
    const words = text.split(/\s+/);
    el.textContent = '';
    el.setAttribute('aria-label', text);
    const frag = document.createDocumentFragment();
    words.forEach((word, i) => {
      const line = document.createElement('span');
      line.className = 'split-line';
      const inner = document.createElement('span');
      inner.textContent = word;
      line.appendChild(inner);
      frag.appendChild(line);
      if (i < words.length - 1) frag.appendChild(document.createTextNode(' '));
    });
    el.appendChild(frag);
    return el.querySelectorAll('.split-line > span');
  }

  function initSplitReveal() {
    const targets = document.querySelectorAll('[data-split]');
    if (!targets.length) return;

    targets.forEach((el) => {
      const spans = splitLines(el);
      if (reduceMotion) {
        spans.forEach((s) => (s.style.transform = 'none'));
        return;
      }
      if (hasGSAP) {
        gsap.to(spans, {
          y: '0%', duration: 0.9, ease: 'power4.out', stagger: 0.045,
          delay: parseFloat(el.dataset.splitDelay || '0.15'),
        });
      } else {
        setTimeout(() => {
          spans.forEach((s, i) => {
            setTimeout(() => { s.style.transition = 'transform .7s cubic-bezier(.16,1,.3,1)'; s.style.transform = 'translateY(0)'; }, i * 40);
          });
        }, (parseFloat(el.dataset.splitDelay || '0.15')) * 1000);
      }
    });
  }

  /* ---------------- scroll reveals ---------------- */
  function initScrollReveals() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (reduceMotion) {
      items.forEach((el) => el.classList.add('is-in'));
      return;
    }

    if (hasScrollTrigger) {
      items.forEach((el, i) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
      });
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      items.forEach((el) => io.observe(el));
    }
  }

  /* ---------------- scroll-pinned cinematic section ---------------- */
  function initPinCinema() {
    const section = document.querySelector('[data-pin-cinema]');
    if (!section) return;
    const lines = section.querySelectorAll('.pin-cinema-line');
    if (!lines.length) return;

    if (reduceMotion || !hasScrollTrigger) {
      // static fallback: just show the first line, stacked normally
      lines.forEach((line, i) => {
        line.style.position = i === 0 ? 'relative' : 'none';
        if (i === 0) { line.style.opacity = '1'; }
        else { line.style.display = 'none'; }
      });
      return;
    }

    gsap.set(lines[0], { opacity: 1 });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section, start: 'top top', end: '+=120%',
        scrub: 0.6, pin: true, anticipatePin: 1,
      },
    });

    lines.forEach((line, i) => {
      if (i === 0) return;
      tl.to(lines[i - 1], { opacity: 0, duration: 0.4 }, i)
        .to(line, { opacity: 1, duration: 0.4 }, i);
    });
  }

  /* ---------------- cursor-follow video preview ---------------- */
  function initRowVideoPreview() {
    const preview = document.querySelector('[data-row-preview]');
    if (!preview || reduceMotion) return;
    const video = preview.querySelector('video');
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch) return;

    const triggers = document.querySelectorAll('[data-preview-video]');
    if (!triggers.length) return;

    triggers.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        const src = el.getAttribute('data-preview-video');
        if (video && video.currentSrc.indexOf(src) === -1) {
          video.src = src;
          video.play().catch(() => {});
        } else if (video) {
          video.play().catch(() => {});
        }
        preview.classList.add('is-visible');
      });
      el.addEventListener('mousemove', (e) => {
        preview.style.left = e.clientX + 'px';
        preview.style.top = e.clientY + 'px';
      });
      el.addEventListener('mouseleave', () => {
        preview.classList.remove('is-visible');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initPageCurtain();
    initSplitReveal();
    initScrollReveals();
    initPinCinema();
    initRowVideoPreview();
  });
})();
