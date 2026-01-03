document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');
  const container = document.querySelector('.container');
  const MOBILE_BREAK = 900;
  const AUTOPLAY_DELAY = 5000;

  const EMAILJS_USER_ID = '9YyKdfxDwlFRLzgrL';
  const EMAILJS_SERVICE_ID = 'letikbet';
  const EMAILJS_TEMPLATE_ID = 'letikbet_temp';

  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const on = (el, ev, fn, opts = {}) => el && el.addEventListener(ev, fn, opts);
  const off = (el, ev, fn) => el && el.removeEventListener(ev, fn);

  function sidebarToggleInit() {
    const toggle = $('#sidebarToggle');
    const backdrop = $('#backdrop');
    const sidebar = $('.sidebar');

    const setOpen = open => {
      if (!sidebar) return;
      sidebar.classList.toggle('open', Boolean(open));
      backdrop?.classList.toggle('active', Boolean(open));
      document.body.style.overflow = open ? 'hidden' : '';
      toggle?.setAttribute('aria-expanded', String(Boolean(open)));
    };

    on(toggle, 'click', () => setOpen(!sidebar?.classList.contains('open')));
    on(backdrop, 'click', () => setOpen(false));
    if (sidebar) $$('.sidebar a').forEach(a => on(a, 'click', () => setOpen(false)));
  }

  function sidebarNavigationInit() {
    const ids = ['inicio', 'sobre', 'destaques', 'ferramentas', 'contato'];
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean);


    const sidebarLinks = Array.from(document.querySelectorAll('.sidebar a[href^="#"]'));
    const topLinks = Array.from(document.querySelectorAll('.top-nav a[href^="#"]'));
    const links = [...new Set([...sidebarLinks, ...topLinks])];

    links.forEach(link => link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = (link.getAttribute('href') || '').slice(1);
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });


      links.forEach(l => l.classList.remove('active'));

      const same = links.filter(l => l.getAttribute('href') === `#${id}`);
      same.forEach(s => s.classList.add('active'));


      const sb = document.querySelector('.sidebar');
      const backdrop = document.getElementById('backdrop');
      if (sb && sb.classList.contains('open')) {
        sb.classList.remove('open');
        if (backdrop) backdrop.classList.remove('active');
        document.body.style.overflow = '';
        const toggle = document.getElementById('sidebarToggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    }));

    function sync() {
      const ref = window.innerHeight * 0.25;
      sections.forEach(sec => {
        const r = sec.getBoundingClientRect();
        const active = r.top <= ref && r.bottom >= ref;

        links.forEach(l => {
          if (l.getAttribute('href') === `#${sec.id}`) l.classList.toggle('active', active);
        });
      });
    }

    sync();
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
  }

  function progressBarInit() {
    const bar = $('#progressBar');
    if (!bar) return;
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const pct = (scrollTop / (scrollHeight - clientHeight)) * 100 || 0;
      bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
    };
    update();
    on(window, 'scroll', update, { passive: true });
    on(window, 'resize', update);
  }

  function emailFormInit() {
    const form = $('.contact-form');
    const msg = $('#formMessage');
    if (window.emailjs && EMAILJS_USER_ID) emailjs.init(EMAILJS_USER_ID);
    if (!form) return;

    const show = (text, type = 'info', auto = true) => {
      if (!msg) return;
      msg.hidden = false;
      msg.textContent = text;
      msg.className = 'form-message ' + type;
      if (auto) {
        clearTimeout(msg._t);
        msg._t = setTimeout(() => msg.hidden = true, 5000);
      }
    };

    on(form, 'submit', e => {
      e.preventDefault();
      if (!window.emailjs) { show('Serviço de email indisponível.', 'error'); return; }
      const btn = form.querySelector('button[type="submit"]');
      btn?.setAttribute('disabled', 'true');
      show('Enviando...', 'info', false);
      emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
        .then(() => { show('Mensagem enviada com sucesso.', 'success'); form.reset(); })
        .catch(err => { console.error(err); show('Erro ao enviar a mensagem.', 'error'); })
        .finally(() => btn?.removeAttribute('disabled'));
    });
  }

  function lightboxInit() {
    const lightbox = $('#lightbox');
    if (!lightbox) return;
    const img = lightbox.querySelector('.lightbox-img');
    const caption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    const open = (src, alt = '', text = '') => {
      img.src = src;
      img.alt = alt;
      caption.textContent = text;
      lightbox.classList.add('show');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeBtn?.focus();
    };
    const close = () => {
      lightbox.classList.remove('show');
      lightbox.setAttribute('aria-hidden', 'true');
      img.src = '';
      document.body.style.overflow = '';
    };

    $$('.card img').forEach(i => on(i, 'click', () => {
      const fig = i.closest('.card');
      const text = fig?.querySelector('.card-caption')?.innerText.trim() || '';
      open(i.src, i.alt, text);
    }));

    on(lightbox, 'click', e => { if (e.target === lightbox) close(); });
    on(closeBtn, 'click', close);
    on(window, 'keydown', e => { if (e.key === 'Escape' && lightbox.classList.contains('show')) close(); });
  }

  function carouselInit() {
    $$('.carousel').forEach(carousel => {
      const track = carousel.querySelector('.carousel-track');
      const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
      const prev = carousel.querySelector('.carousel-btn.prev');
      const next = carousel.querySelector('.carousel-btn.next');
      const indicatorsWrap = carousel.querySelector('.carousel-indicators');
      if (!track || slides.length === 0) return;

      let index = 0;
      let autoplayId = 0;

      indicatorsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        b.setAttribute('aria-label', `Ir para slide ${i + 1}`);
        on(b, 'click', () => { goTo(i); resetAutoplay(); });
        indicatorsWrap.appendChild(b);
      });
      const indicators = Array.from(indicatorsWrap.children);

      const updateIndicators = () => indicators.forEach((b, i) => b.setAttribute('aria-selected', i === index ? 'true' : 'false'));

      const goTo = (i, smooth = true) => {
        index = ((i % slides.length) + slides.length) % slides.length;
        const offset = slides[index].offsetLeft;
        track.style.transition = smooth ? '' : 'none';
        track.style.transform = `translateX(${-offset}px)`;
        updateIndicators();
      };

      const startAutoplay = () => {
        stopAutoplay();
        if (slides.length < 2) return;
        autoplayId = setInterval(() => goTo(index + 1), AUTOPLAY_DELAY);
      };
      const stopAutoplay = () => { if (autoplayId) clearInterval(autoplayId); autoplayId = 0; };
      const resetAutoplay = () => { stopAutoplay(); startAutoplay(); };

      on(prev, 'click', () => { goTo(index - 1); resetAutoplay(); });
      on(next, 'click', () => { goTo(index + 1); resetAutoplay(); });

      on(carousel, 'mouseenter', stopAutoplay);
      on(carousel, 'mouseleave', startAutoplay);
      on(carousel, 'focusin', stopAutoplay);
      on(carousel, 'focusout', startAutoplay);

      on(window, 'resize', () => setTimeout(() => goTo(index, false), 80));

      setTimeout(() => { goTo(0, false); startAutoplay(); }, 50);
    });
  }


  (function topbarScrollToggle() {
    const topbar = document.querySelector('.topbar');
    if (!topbar) return;

    let lastY = window.scrollY || 0;
    let ticking = false;
    const HIDE_AFTER = 95;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
      }
    }

    function handleScroll() {
      const y = window.scrollY || 0;

      if (y <= 20) {
        topbar.classList.remove('topbar--hidden');
      } else if (y > lastY && y > HIDE_AFTER) {
        topbar.classList.add('topbar--hidden');
      } else if (y < lastY) {
        topbar.classList.remove('topbar--hidden');
      }

      lastY = y;
      ticking = false;
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    handleScroll();
  })();

  function initCvRectDownload() {
    const link = document.getElementById('cvRectLink');
    if (!link) return;
    const url = link.getAttribute('href');
    const filename = link.getAttribute('download') || 'Curriculo.pdf';

    link.addEventListener('click', (e) => {


      e.preventDefault();
      fetch(url, { cache: 'no-store' })
        .then(res => {
          if (!res.ok) throw new Error('network');
          return res.blob();
        })
        .then(blob => {
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(blobUrl);
        })
        .catch(() => {

          window.location.href = url;
        });
    });
  }

  sidebarToggleInit();
  sidebarNavigationInit();
  progressBarInit();
  emailFormInit();
  lightboxInit();
  carouselInit();
  initCvRectDownload();
});