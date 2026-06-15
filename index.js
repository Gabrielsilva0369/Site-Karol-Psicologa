const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => observer.observe(el));

// Sticky Nav Highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.ds-nav__links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current
      ? 'var(--cor-areia)'
      : 'rgba(255,255,255,0.5)';
  });

  // Hero 3D Apple Modal Effect
  const hero = document.getElementById('hero');
  if (hero && window.scrollY <= window.innerHeight * 1.5) {
    const progress = Math.min(window.scrollY / window.innerHeight, 1);
    
    // Scale: 1 -> 0.95
    const scale = 1 - (progress * 0.05);
    // Brightness: 1 -> 0.4
    const brightness = 1 - (progress * 0.6);
    // Blur: 0 -> 5px
    const blur = progress * 5;

    hero.style.setProperty('--hero-scale', scale);
    hero.style.setProperty('--hero-brightness', brightness);
    hero.style.setProperty('--hero-blur', `${blur}px`);
  }
});
