/* Yasser Kerriz — interactions vanilla JS, sans dépendance externe ni curseur personnalisé */
(() => {
  'use strict';
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const navToggle = $('#navToggle');
  const primaryNav = $('#primaryNav');
  const dropdownTrigger = $('#dropdownTrigger');
  const dropdownMenu = $('#dropdownMenu');
  const dropdownParent = $('.has-dropdown');

  const closeMenus = () => {
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Ouvrir le menu');
    primaryNav?.classList.remove('is-open');
    dropdownTrigger?.setAttribute('aria-expanded', 'false');
    dropdownMenu?.classList.remove('is-open');
  };
  navToggle?.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    primaryNav?.classList.toggle('is-open', open);
  });
  dropdownTrigger?.addEventListener('click', event => {
    event.stopPropagation();
    const open = dropdownTrigger.getAttribute('aria-expanded') !== 'true';
    dropdownTrigger.setAttribute('aria-expanded', String(open));
    dropdownMenu?.classList.toggle('is-open', open);
  });
  document.addEventListener('click', event => {
    if (dropdownParent && !dropdownParent.contains(event.target)) {
      dropdownTrigger?.setAttribute('aria-expanded', 'false');
      dropdownMenu?.classList.remove('is-open');
    }
  });
  $$('#primaryNav a').forEach(link => link.addEventListener('click', closeMenus));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenus(); });

  // Accordéon principal : une compétence à la fois.
  $$('.acc-trigger').forEach(trigger => {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!panel) return;
    trigger.addEventListener('click', () => {
      const open = trigger.getAttribute('aria-expanded') === 'true';
      $$('.acc-trigger').forEach(other => {
        other.setAttribute('aria-expanded', 'false');
        document.getElementById(other.getAttribute('aria-controls'))?.classList.remove('is-open');
      });
      trigger.setAttribute('aria-expanded', String(!open));
      panel.classList.toggle('is-open', !open);
    });
  });

  // Accordéons imbriqués : chaque sous-catégorie fonctionne indépendamment.
  $$('.nested-trigger').forEach(trigger => {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!panel) return;
    trigger.addEventListener('click', () => {
      const open = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!open));
      panel.classList.toggle('is-open', !open);
    });
  });

  const revealTargets = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealTargets.forEach(element => observer.observe(element));
  } else revealTargets.forEach(element => element.classList.add('is-visible'));

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  // Réseau SVG et particules d'ambiance générés sans librairie.
  const linesGroup = $('#netLines');
  const nodesGroup = $('#netNodes');
  if (linesGroup && nodesGroup) {
    const points = [[120,90],[340,60],[560,130],[780,80],[200,250],[430,220],[660,260],[830,220],[140,420],[370,400],[600,440],[800,400],[260,560],[500,590],[720,550]];
    const edges = [[0,1],[1,2],[2,3],[0,4],[1,5],[2,6],[3,7],[4,5],[5,6],[6,7],[4,8],[5,9],[6,10],[7,11],[8,9],[9,10],[10,11],[8,12],[9,13],[10,13],[11,14],[12,13],[13,14]];
    const ns = 'http://www.w3.org/2000/svg';
    edges.forEach(([a,b], i) => { const line = document.createElementNS(ns, 'line'); const [x1,y1] = points[a]; const [x2,y2] = points[b]; const length = Math.hypot(x2-x1,y2-y1); line.setAttribute('x1',x1); line.setAttribute('y1',y1); line.setAttribute('x2',x2); line.setAttribute('y2',y2); line.style.strokeDasharray = length; line.style.strokeDashoffset = length; line.style.animationDelay = `${i*35}ms`; linesGroup.appendChild(line); });
    points.forEach(([x,y], i) => { const circle = document.createElementNS(ns, 'circle'); circle.setAttribute('cx',x); circle.setAttribute('cy',y); circle.setAttribute('r','3.5'); circle.style.animationDelay = `${600+i*40}ms`; nodesGroup.appendChild(circle); });
  }
  const particleLayer = $('.ambient-particles');
  if (particleLayer) for (let i = 0; i < 28; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'ambient-particle';
    particle.style.left = `${8 + Math.random() * 86}%`;
    particle.style.top = `${42 + Math.random() * 58}%`;
    particle.style.setProperty('--particle-x', `${-45 + Math.random() * 90}px`);
    particle.style.setProperty('--particle-duration', `${6 + Math.random() * 7}s`);
    particle.style.setProperty('--particle-delay', `${Math.random() * -10}s`);
    particle.style.setProperty('--particle-color', Math.random() > .45 ? '#ff244f' : '#a90f31');
    particleLayer.appendChild(particle);
  }
})();
