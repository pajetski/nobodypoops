const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const header = document.querySelector('.site-header');

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
  header.classList.toggle('menu-open', !open);
  document.body.style.overflow = open ? '' : 'hidden';
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  toggle.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
  header.classList.remove('menu-open');
  document.body.style.overflow = '';
}));

const progress = document.querySelector('.progress span');
const updateProgress = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max ? (scrollY / max) * 100 : 0}%`;
};
addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .13 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / 900, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: .5 });
document.querySelectorAll('[data-count]').forEach((el) => countObserver.observe(el));

const confessions = [
  'Rebalancing the shower head. It had drifted four degrees off true.',
  'Fixing the Fitzer valve under the sink. Common issue. Very technical.',
  'Checking the water pressure. Thirty-one minutes of checking.',
  'Reading the full ingredient list on the shampoo. Both bottles.',
  'Testing the exhaust fan. It passed, eventually.',
  'Rotating the towels. They rotate seasonally.',
  'Letting the grout cure. You cannot rush grout.',
  'Taking a call they could not take in front of us.'
];
let confessionIndex = 0;
const confession = document.querySelector('#confession-text');
document.querySelector('#next-confession').addEventListener('click', () => {
  NP.event('another-excuse', 'Another excuse');
  confession.classList.add('changing');
  setTimeout(() => {
    confessionIndex = (confessionIndex + 1) % confessions.length;
    confession.textContent = confessions[confessionIndex];
    confession.classList.remove('changing');
  }, 180);
});

document.querySelectorAll('.signup').forEach((form) => form.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = event.currentTarget.querySelector('input');
  const note = event.currentTarget.querySelector('.form-note');
  if (!input.validity.valid) {
    note.textContent = 'That email looks suspiciously anonymous. Try again.';
    input.focus();
    return;
  }
  NP.event('email-signup', 'Email signup');
  event.currentTarget.querySelector('button').innerHTML = 'You’re on the list <span>✓</span>';
  note.textContent = 'Your secret is safe. Your hat is not guaranteed.';
  input.disabled = true;
}));

/* ---------- Gift shop config: edit these ---------- */
/* ---------- Analytics config: edit these ---------- */
const NP_ANALYTICS = {
  // 1. Sign up free at goatcounter.com, pick a site code, then put it here.
  //    Example: code 'nobodypoops' -> 'https://nobodypoops.goatcounter.com/count'
  endpoint: 'https://REPLACE.goatcounter.com/count'
};

const SHOP = {
  amazonTag: 'nobodypoops-20', // Amazon Associates tracking ID
  hats: {
    fulanos:   { price: 34, checkout: 'https://buy.stripe.com/eVq3cv3rabae9Iu5y38k800' },
    chinatown: { price: 34, checkout: 'https://buy.stripe.com/6oU9ATd1KceicUGgcH8k801' },
    ohurleys:  { price: 34, checkout: 'https://buy.stripe.com/28EdR9gdWbae2g2aSn8k802' }
  },
  shelf: [
    ['Squatty Potty', 'Posture correction for an activity that does not occur.', 'squatty potty toilet stool', 'ic-stool'],
    ['Poo-Pourri Before-You-Go', 'A preemptive apology in a bottle.', 'poo-pourri before you go spray', 'ic-spray'],
    ['TUSHY Classic bidet', 'Popular with the kind of people who would need it.', 'tushy classic bidet attachment', 'ic-bidet'],
    ['Everyone Poops, by Taro Gomi', 'The opposing viewpoint. We stock it for balance.', 'everyone poops taro gomi', 'ic-book'],
    ['Uncle John\u2019s Bathroom Reader', 'Reading material for a room we have never used.', 'uncle johns bathroom reader', 'ic-reader'],
    ['Motion-activated toilet light', 'For 3 a.m. visits that are none of our business.', 'motion activated toilet night light', 'ic-light'],
    ['OXO toilet plunger', 'Purely hypothetical.', 'oxo good grips toilet plunger', 'ic-plunger'],
    ['Matches, bathroom-grade', 'The candle was not for ambiance. We all knew.', 'bathroom matches odor', 'ic-matches']
  ]
};

/* ---------- Analytics: pageviews + click events ---------- */
const NP = (() => {
  const live = NP_ANALYTICS.endpoint && !NP_ANALYTICS.endpoint.includes('REPLACE');

  // remember where this visit came from (utm_source), for the whole session
  let src = 'direct';
  try {
    const q = new URLSearchParams(location.search).get('utm_source');
    if (q) sessionStorage.setItem('np_src', q.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 24));
    src = sessionStorage.getItem('np_src') || (document.referrer ? 'referral' : 'direct');
  } catch (e) { /* private mode: carry on */ }

  if (live) {
    window.goatcounter = { no_onload: false };
    const s = document.createElement('script');
    s.async = true;
    s.dataset.goatcounter = NP_ANALYTICS.endpoint;
    s.src = '//gc.zgo.at/count.js';
    document.head.appendChild(s);
  }

  const count = (path, title) => {
    if (!live || !window.goatcounter || !window.goatcounter.count) return;
    try { window.goatcounter.count({ path, title, event: true }); } catch (e) { /* never block a click */ }
  };

  return {
    src,
    event: (name, label) => count(`${name}--${src}`, label || name),
    // Amazon SubTag: shows the traffic source inside Amazon's own reports
    subtag: (slug) => `np-${src}-${slug}`.slice(0, 60)
  };
})();

const shelfEl = document.querySelector('#shelf');
SHOP.shelf.forEach(([name, why, query, icon], i) => {
  const li = document.createElement('li');
  const a = document.createElement('a');
  const slug = query.split(' ').slice(0, 2).join('-').replace(/[^a-z0-9-]/gi, '');
  a.href = `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${encodeURIComponent(SHOP.amazonTag)}`
    + `&ascsubtag=${encodeURIComponent(NP.subtag(slug))}`;
  a.addEventListener('click', () => NP.event(`amazon-${slug}`, `Amazon: ${name}`));
  a.target = '_blank';
  a.rel = 'sponsored nofollow noopener';
  a.innerHTML = `<span class="no">2.${String(i + 1).padStart(2, '0')}</span>`
    + `<span class="ic"><svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><use href="#${icon}"></use></svg></span>`
    + `<span class="name"></span><span class="go">Amazon \u2197</span><span class="why"></span>`;
  a.querySelector('.name').textContent = name;
  a.querySelector('.why').textContent = why;
  li.appendChild(a);
  shelfEl.appendChild(li);
});

const shopToast = document.querySelector('#shop-toast');
let toastTimer;
document.querySelectorAll('.hat-card').forEach((card) => {
  const hat = SHOP.hats[card.dataset.hat];
  const button = card.querySelector('.buy-button');
  card.querySelector('.hat-price').textContent = `$${hat.price}`;
  button.addEventListener('click', () => NP.event(`buy-${card.dataset.hat}`, `Buy: ${card.dataset.hat}`));
  if (hat.checkout.includes('REPLACE_')) {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      shopToast.textContent = 'The register opens soon. The hat is real; the checkout isn’t yet.';
      shopToast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => shopToast.classList.remove('show'), 2800);
    });
  } else {
    button.href = hat.checkout;
    button.rel = 'noopener';
  }
});
