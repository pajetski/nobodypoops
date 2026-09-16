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
  'I once blamed the sound on a neighbor moving furniture. I was in a hotel.',
  'I ran the hand dryer for four consecutive minutes. There was no one else in the building.',
  'I have a playlist called “Conference Call.” It has saved my life twice.',
  'I said I was checking on the dog. I do not own a dog.',
  'The candle wasn’t for ambiance. We all knew. Nobody said anything.'
];
let confessionIndex = 0;
const confession = document.querySelector('#confession-text');
document.querySelector('#next-confession').addEventListener('click', () => {
  confession.classList.add('changing');
  setTimeout(() => {
    confessionIndex = (confessionIndex + 1) % confessions.length;
    confession.textContent = confessions[confessionIndex];
    confession.classList.remove('changing');
  }, 180);
});

document.querySelector('.signup').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = event.currentTarget.querySelector('input');
  const note = event.currentTarget.querySelector('.form-note');
  if (!input.validity.valid) {
    note.textContent = 'That email looks suspiciously anonymous. Try again.';
    input.focus();
    return;
  }
  event.currentTarget.querySelector('button').innerHTML = 'You’re on the list <span>✓</span>';
  note.textContent = 'Your secret is safe with us.';
  input.disabled = true;
});

/* ---------- Gift shop config: edit these ---------- */
const SHOP = {
  amazonTag: 'nobodypoops-20', // Amazon Associates tracking ID
  hats: {
    fulanos:   { price: 34, checkout: 'https://buy.stripe.com/REPLACE_FULANOS' },
    chinatown: { price: 34, checkout: 'https://buy.stripe.com/REPLACE_CHINATOWN' },
    ohurleys:  { price: 34, checkout: 'https://buy.stripe.com/REPLACE_OHURLEYS' }
  },
  shelf: [
    ['Squatty Potty', 'Posture correction for an activity that does not occur.', 'squatty potty toilet stool'],
    ['Poo-Pourri Before-You-Go', 'A preemptive apology in a bottle.', 'poo-pourri before you go spray'],
    ['TUSHY Classic bidet', 'Popular with the kind of people who would need it.', 'tushy classic bidet attachment'],
    ['Everyone Poops, by Taro Gomi', 'The opposing viewpoint. We stock it for balance.', 'everyone poops taro gomi'],
    ['Uncle John’s Bathroom Reader', 'Reading material for a room we have never used.', 'uncle johns bathroom reader'],
    ['Motion-activated toilet light', 'For 3 a.m. visits that are none of our business.', 'motion activated toilet night light'],
    ['OXO toilet plunger', 'Purely hypothetical.', 'oxo good grips toilet plunger'],
    ['Matches, bathroom-grade', 'The candle was not for ambiance. We all knew.', 'bathroom matches odor']
  ]
};

const shelfEl = document.querySelector('#shelf');
SHOP.shelf.forEach(([name, why, query], i) => {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${encodeURIComponent(SHOP.amazonTag)}`;
  a.target = '_blank';
  a.rel = 'sponsored nofollow noopener';
  a.innerHTML = `<span class="no">2.${String(i + 1).padStart(2, '0')}</span><span class="name"></span><span class="go">Amazon ↗</span><span class="why"></span>`;
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
