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
