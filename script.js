/* ===================================================================
   Yasser Kerriz — Portfolio BTS SIO
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Menu mobile ---------- */
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    primaryNav.classList.toggle('is-open', !isOpen);
  });

  /* ---------- Menu déroulant "Compétences" ---------- */
  const dropdownTrigger = document.getElementById('dropdownTrigger');
  const dropdownMenu = document.getElementById('dropdownMenu');

  dropdownTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdownTrigger.getAttribute('aria-expanded') === 'true';
    dropdownTrigger.setAttribute('aria-expanded', String(!isOpen));
    dropdownMenu.classList.toggle('is-open', !isOpen);
  });

  document.addEventListener('click', (e) => {
    if (!dropdownTrigger.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownTrigger.setAttribute('aria-expanded', 'false');
      dropdownMenu.classList.remove('is-open');
    }
  });

  // Ferme les menus après un clic sur un lien (mobile)
  document.querySelectorAll('.primary-nav a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      primaryNav.classList.remove('is-open');
      dropdownTrigger.setAttribute('aria-expanded', 'false');
      dropdownMenu.classList.remove('is-open');
    });
  });

  /* ---------- Accordéon des compétences ---------- */
  document.querySelectorAll('.acc-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.classList.toggle('is-open', !isOpen);
    });
  });

  /* ---------- Dépôt des justificatifs PDF ---------- */
  document.querySelectorAll('.dropzone').forEach(zone => {
    const comp = zone.dataset.comp;
    const input = zone.querySelector('.dz-input');
    const list = zone.querySelector(`[data-list="${comp}"]`);

    const addFiles = (fileList) => {
      [...fileList].forEach(file => {
        if (file.type !== 'application/pdf') return;
        const url = URL.createObjectURL(file);

        const row = document.createElement('li');
        row.className = 'file-row';
        row.innerHTML = `
          <span class="file-icon">PDF</span>
          <span class="file-name">${escapeHtml(file.name)}</span>
          <a class="file-open" href="${url}" target="_blank" rel="noopener">Ouvrir</a>
          <button type="button" class="file-remove" aria-label="Retirer ${escapeHtml(file.name)}">&times;</button>
        `;
        row.querySelector('.file-remove').addEventListener('click', () => {
          URL.revokeObjectURL(url);
          row.remove();
        });
        list.appendChild(row);
      });
    };

    input.addEventListener('change', () => addFiles(input.files));

    ['dragenter', 'dragover'].forEach(evt =>
      zone.addEventListener(evt, (e) => {
        e.preventDefault();
        zone.classList.add('is-dragover');
      })
    );
    ['dragleave', 'drop'].forEach(evt =>
      zone.addEventListener(evt, (e) => {
        e.preventDefault();
        zone.classList.remove('is-dragover');
      })
    );
    zone.addEventListener('drop', (e) => {
      if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);
    });
  });

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------- Illustration réseau du hero ---------- */
  buildHeroNetwork();
});

function buildHeroNetwork() {
  const linesGroup = document.getElementById('netLines');
  const nodesGroup = document.getElementById('netNodes');
  if (!linesGroup || !nodesGroup) return;

  const w = 900, h = 640;
  const points = [
    [120, 90], [340, 60], [560, 130], [780, 80],
    [200, 250], [430, 220], [660, 260], [830, 220],
    [140, 420], [370, 400], [600, 440], [800, 400],
    [260, 560], [500, 590], [720, 550]
  ];

  const edges = [
    [0,1],[1,2],[2,3],[0,4],[1,5],[2,6],[3,7],
    [4,5],[5,6],[6,7],[4,8],[5,9],[6,10],[7,11],
    [8,9],[9,10],[10,11],[8,12],[9,13],[10,13],[11,14],
    [12,13],[13,14]
  ];

  const ns = 'http://www.w3.org/2000/svg';

  edges.forEach(([a, b], i) => {
    const [x1, y1] = points[a];
    const [x2, y2] = points[b];
    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', x1); line.setAttribute('y1', y1);
    line.setAttribute('x2', x2); line.setAttribute('y2', y2);
    const len = Math.hypot(x2 - x1, y2 - y1);
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = len;
    line.style.animationDelay = `${i * 35}ms`;
    linesGroup.appendChild(line);
  });

  points.forEach(([x, y], i) => {
    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('cx', x); circle.setAttribute('cy', y);
    circle.setAttribute('r', 3.5);
    circle.style.animationDelay = `${600 + i * 40}ms`;
    nodesGroup.appendChild(circle);
  });
}
