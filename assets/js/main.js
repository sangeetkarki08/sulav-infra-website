// ============ Mobile nav toggle ============
const navToggle = document.getElementById('navToggle');
const navlinks = document.querySelector('.navlinks');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = navlinks.style.display === 'flex';
    navlinks.style.display = open ? 'none' : 'flex';
    navlinks.style.cssText += open
      ? 'display:none;'
      : 'display:flex;flex-direction:column;position:absolute;top:100%;left:0;right:0;background:#F4F2EC;padding:20px var(--edge);gap:18px;border-bottom:1px solid #D3CFC2;';
  });
}

// ============ Project filter ============
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('#projGrid .proj-card');
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    cards.forEach(card => {
      const show = f === 'all' || card.dataset.cat === f;
      card.classList.toggle('hide', !show);
    });
  });
});

// ============ Lightbox for portfolio + fleet images ============
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.proj-media img, .fleet-media img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', (e) => {
    e.stopPropagation();
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
  });
});
function closeLightbox(){ lightbox.classList.remove('open'); lightboxImg.src=''; }
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

// ============ Project detail modal ============
const projModal = document.getElementById('projModal');
const projModalContent = document.getElementById('projModalContent');
const projModalClose = document.getElementById('projModalClose');

function openProjectDetail(card) {
  const tpl = document.getElementById(card.dataset.detail);
  if (!tpl) return;
  projModalContent.innerHTML = '';
  projModalContent.appendChild(tpl.content.cloneNode(true));
  projModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeProjectDetail(){ projModal.classList.remove('open'); document.body.style.overflow = ''; }

document.querySelectorAll('.proj-card[data-detail]').forEach(card => {
  card.addEventListener('click', () => openProjectDetail(card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProjectDetail(card);
    }
  });
});
projModalClose.addEventListener('click', closeProjectDetail);
projModal.addEventListener('click', (e) => { if (e.target === projModal) closeProjectDetail(); });

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeLightbox(); closeProjectDetail(); }
});

// ============ Scroll-reveal (timeline + capability/project/fleet/team cards) ============
const revealSelector = '.tl-item, .cap, .proj-card, .fleet-item, .pillar, .lead-card, .client-card, .testi-card';
const revealItems = document.querySelectorAll(revealSelector);
if (revealItems.length && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('inview');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('inview'));
}

// ============ Animated stat counters ============
const statNums = document.querySelectorAll('.num[data-count]');
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1200;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
if (statNums.length && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  statNums.forEach(el => statObserver.observe(el));
}

// ============ Scroll to top ============
const toTop = document.getElementById('toTop');
if (toTop) {
  window.addEventListener('scroll', () => {
    toTop.classList.toggle('show', window.scrollY > 600);
  });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ============ Quote form (front-end only — wire to a backend) ============
const quoteForm = document.getElementById('quoteForm');
const formStatus = document.getElementById('formStatus');
if (quoteForm) {
  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!quoteForm.checkValidity()) {
      quoteForm.reportValidity();
      return;
    }
    // Placeholder success state. Replace this block with a real submission:
    // fetch('/api/quote', { method:'POST', body: new FormData(quoteForm) })
    formStatus.textContent = 'Thanks — this is a front-end preview, so nothing was actually sent. Connect this form to your email or CRM to go live.';
    formStatus.style.color = '#B6391F';
  });
}
