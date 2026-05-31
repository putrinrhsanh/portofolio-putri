/* =============================================
   E-PORTFOLIO PPL TERBIMBING
   JavaScript Logic
   ============================================= */

// =============================================
// NAVIGATION
// =============================================
function navigateTo(sectionId) {
  // Update sections
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(sectionId);
  if (target) { target.classList.add('active'); target.scrollIntoView({ top: 0 }); }

  // Update nav links
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.section === sectionId);
  });

  // Update breadcrumb
  const labels = {
    beranda: 'Beranda', profil: 'Profil Mahasiswa',
    artefak: 'Artefak Pembelajaran', analisis: 'Analisis Artefak',
    penilaian: 'Penilaian GP & DPL', 'model-guru': 'Model Guru',
    refleksi: 'Refleksi PPL', filosofi: 'Filosofi Mengajar',
    dokumentasi: 'Dokumentasi PPL', lampiran: 'Lampiran', kontak: 'Kontak'
  };
  document.getElementById('breadcrumb').textContent = labels[sectionId] || sectionId;

  // Close sidebar on mobile
  closeSidebar();

  // Scroll main content to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Init chart when navigating to penilaian
  if (sectionId === 'penilaian') setTimeout(initChart, 100);
}

// Bind nav links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    navigateTo(this.dataset.section);
  });
});

// =============================================
// SIDEBAR TOGGLE
// =============================================
document.getElementById('hamburger').addEventListener('click', openSidebar);
document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
document.getElementById('overlay').addEventListener('click', closeSidebar);

function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// =============================================
// DARK MODE
// =============================================
function setTheme(dark) {
  document.body.classList.toggle('dark-mode', dark);
  const icon = document.getElementById('themeIcon');
  const iconM = document.getElementById('themeIconMobile');
  const label = document.getElementById('themeLabel');
  if (dark) {
    if (icon) { icon.className = 'ti ti-moon'; }
    if (iconM) { iconM.className = 'ti ti-moon'; }
    if (label) label.textContent = 'Mode Gelap';
  } else {
    if (icon) { icon.className = 'ti ti-sun'; }
    if (iconM) { iconM.className = 'ti ti-sun'; }
    if (label) label.textContent = 'Mode Terang';
  }
  localStorage.setItem('eportfolio-dark', dark ? '1' : '0');
}

const savedTheme = localStorage.getItem('eportfolio-dark');
if (savedTheme === '1') setTheme(true);

document.getElementById('themeToggle').addEventListener('click', () => {
  setTheme(!document.body.classList.contains('dark-mode'));
});
document.getElementById('themeToggleMobile').addEventListener('click', () => {
  setTheme(!document.body.classList.contains('dark-mode'));
});

// =============================================
// ACCORDION
// =============================================
document.querySelectorAll('.accordion-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const item = this.closest('.accordion-item');
    const body = item.querySelector('.accordion-body');
    const isOpen = this.classList.contains('open');

    // Close all
    document.querySelectorAll('.accordion-btn').forEach(b => b.classList.remove('open'));
    document.querySelectorAll('.accordion-body').forEach(b => b.classList.remove('open'));

    // Toggle current
    if (!isOpen) {
      this.classList.add('open');
      body.classList.add('open');
    }
  });
});

// =============================================
// TABS
// =============================================
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const tabId = this.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
    const tc = document.getElementById(tabId);
    if (tc) tc.classList.add('active');
  });
});

// =============================================
// FILTER (Artefak)
// =============================================
document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
  btn.addEventListener('click', function() {
    const filter = this.dataset.filter;
    document.querySelectorAll('.filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    document.querySelectorAll('#artefakGrid .artefak-card').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// FILTER (Gallery)
document.querySelectorAll('.filter-btn[data-gallery]').forEach(btn => {
  btn.addEventListener('click', function() {
    const filter = this.dataset.gallery;
    document.querySelectorAll('.filter-btn[data-gallery]').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    document.querySelectorAll('#galleryGrid .gallery-item').forEach(item => {
      if (filter === 'all' || item.dataset.gallery === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// FILTER (Lampiran)
let currentLampFilter = 'all';

document.querySelectorAll('.filter-btn[data-lamp-filter]').forEach(btn => {
  btn.addEventListener('click', function() {
    currentLampFilter = this.dataset.lampFilter;
    document.querySelectorAll('.filter-btn[data-lamp-filter]').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    filterLampiran();
  });
});

function filterLampiran() {
  const query = (document.getElementById('lampiranSearch')?.value || '').toLowerCase();
  document.querySelectorAll('#lampiranList .lampiran-item').forEach(item => {
    const cat = item.dataset.lampCat;
    const text = item.textContent.toLowerCase();
    const catMatch = currentLampFilter === 'all' || cat === currentLampFilter;
    const searchMatch = !query || text.includes(query);
    item.classList.toggle('hidden', !(catMatch && searchMatch));
  });
}

// =============================================
// LIGHTBOX
// =============================================
function openLightbox(el) {
  const caption = el.querySelector('.gallery-caption')?.textContent || '';
  const bg = el.querySelector('.gallery-img')?.style.background || '#860050';
  const icon = el.querySelector('.gallery-img i')?.className || 'ti ti-photo';

  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbCap = document.getElementById('lightboxCaption');

  lbImg.style.background = bg;
  lbImg.innerHTML = `<i class="${icon}" style="font-size:5rem;opacity:0.5"></i>`;
  lbCap.textContent = caption;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

// Close lightbox with Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeLightbox();
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
});

// =============================================
// MODAL
// =============================================
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function closeModalOutside(event, id) {
  if (event.target.id === id) closeModal(id);
}

// =============================================
// CHART.JS — Perkembangan Nilai
// =============================================
let chartInstance = null;

function initChart() {
  const canvas = document.getElementById('nilaiChart');
  if (!canvas) return;
  if (chartInstance) { chartInstance.destroy(); chartInstance = null; }

  const isDark = document.body.classList.contains('dark-mode');
  const textColor = isDark ? 'rgba(252,232,243,0.7)' : 'rgba(90,58,74,0.8)';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(134,0,80,0.08)';

  chartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels: ['Siklus 1', 'Siklus 2', 'Siklus 3'],
      datasets: [
        {
          label: 'Guru Pamong',
          data: [83.5, 87.0, 91.5],
          borderColor: '#860050',
          backgroundColor: 'rgba(134,0,80,0.1)',
          borderWidth: 2.5,
          pointBackgroundColor: '#860050',
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: true,
          tension: 0.4
        },
        {
          label: 'DPL',
          data: [82.0, 86.5, 90.0],
          borderColor: '#d4006a',
          backgroundColor: 'rgba(212,0,106,0.08)',
          borderWidth: 2.5,
          pointBackgroundColor: '#d4006a',
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: true,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#860050',
          titleColor: '#fff',
          bodyColor: 'rgba(255,255,255,0.85)',
          borderColor: '#d4006a',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8
        }
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: textColor, font: { family: "'DM Sans', sans-serif", size: 13 } }
        },
        y: {
          min: 75,
          max: 100,
          grid: { color: gridColor },
          ticks: { color: textColor, font: { family: "'DM Sans', sans-serif", size: 13 } }
        }
      }
    }
  });
}

// =============================================
// BACK TO TOP
// =============================================
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 200) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =============================================
// SEND MESSAGE (Kontak Form)
// =============================================
function sendMessage() {
  const btn = event.currentTarget;
  const original = btn.innerHTML;
  btn.innerHTML = '<i class="ti ti-check"></i> Pesan Terkirim!';
  btn.style.background = '#065f46';
  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.background = '';
  }, 3000);
}

// =============================================
// HASH ROUTING
// =============================================
function handleHash() {
  const hash = window.location.hash.replace('#', '');
  const validSections = ['beranda','profil','artefak','analisis','penilaian','model-guru','refleksi','filosofi','dokumentasi','lampiran','kontak'];
  if (hash && validSections.includes(hash)) {
    navigateTo(hash);
  }
}

window.addEventListener('hashchange', handleHash);
handleHash();

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  // Animate stats on load
  const statNums = document.querySelectorAll('.stat-number');
  statNums.forEach(el => {
    const target = parseInt(el.textContent);
    let current = 0;
    const step = Math.ceil(target / 30);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 40);
  });

  // Progress bar animation for model-guru (when visible)
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.progress-fill').forEach(bar => {
          const w = bar.style.width;
          bar.style.width = '0';
          setTimeout(() => { bar.style.width = w; }, 100);
        });
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.kompetensi-card').forEach(card => observer.observe(card));
});
