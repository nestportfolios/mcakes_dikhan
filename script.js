/* ============================================================ 
   MCakes — Script
   Sparkle Trail Cursor, Vaporwave Canvas, Nav Active Indicator,
   Amazon-style Zoom, WhatsApp Integration, Theme Toggle
   ============================================================ */

/* ============================================================ CUSTOM CURSOR — Sparkle Trail */
const cursorDot = document.getElementById('cursorDot');
let mx = 0, my = 0;

// Create trail particles
const TRAIL_COUNT = 12;
const trails = [];
for (let i = 0; i < TRAIL_COUNT; i++) {
  const t = document.createElement('div');
  t.classList.add('cursor-trail');
  document.body.appendChild(t);
  trails.push({ el: t, x: 0, y: 0 });
}

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top = my + 'px';
});

function animTrail() {
  let prevX = mx, prevY = my;
  for (let i = 0; i < trails.length; i++) {
    const t = trails[i];
    const speed = 0.2 - (i * 0.012);
    t.x += (prevX - t.x) * Math.max(speed, 0.04);
    t.y += (prevY - t.y) * Math.max(speed, 0.04);
    t.el.style.left = t.x + 'px';
    t.el.style.top = t.y + 'px';
    t.el.style.opacity = (1 - i / trails.length) * 0.6;
    t.el.style.transform = `translate(-50%, -50%) scale(${1 - i * 0.06})`;
    prevX = t.x;
    prevY = t.y;
  }
  requestAnimationFrame(animTrail);
}
animTrail();

// Cursor hover effects
document.querySelectorAll('a, button, .cake-card, .filter-btn, .trust-card, .hero-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.classList.add('hovering');
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.classList.remove('hovering');
  });
});

/* ============================================================ THEME TOGGLE */
const themeBtn = document.getElementById('themeToggle');
let dark = true;
themeBtn.addEventListener('click', () => {
  dark = !dark;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  themeBtn.textContent = dark ? '☽' : '☀';
});

/* ============================================================ NAV ACTIVE INDICATOR */
const navLinks = document.querySelectorAll('#navLinks a');
const navIndicator = document.getElementById('navIndicator');

function updateIndicator(link) {
  if (!navIndicator || !link) return;
  const rect = link.getBoundingClientRect();
  const parentRect = link.closest('ul').getBoundingClientRect();
  navIndicator.style.left = (rect.left - parentRect.left) + 'px';
  navIndicator.style.width = rect.width + 'px';
}

navLinks.forEach(link => {
  link.addEventListener('mouseenter', () => updateIndicator(link));
});

// Reset indicator on mouse leave
const navLinksContainer = document.getElementById('navLinks');
if (navLinksContainer) {
  navLinksContainer.addEventListener('mouseleave', () => {
    // Find active section
    const activeLink = document.querySelector('#navLinks a.active') || navLinks[0];
    if (activeLink) updateIndicator(activeLink);
  });
}

// Track scroll to highlight active section
const sections = document.querySelectorAll('section[id]');
function onScroll() {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 200;
    if (window.scrollY >= top) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href && href.includes(current) && current) {
      link.classList.add('active');
      if (window.innerWidth > 1024) updateIndicator(link);
    }
  });
}
window.addEventListener('scroll', onScroll);
window.addEventListener('load', () => {
  onScroll();
  if (navLinks[0]) updateIndicator(navLinks[0]);
});

/* ============================================================ FILTER BUTTONS */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

/* ============================================================ SCROLL REVEAL */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

/* ============================================================ CANVAS — Vaporwave / Minimalist Particles */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: canvas.height + 60,
    speedX: (Math.random() * 0.5 - 0.25),
    speedY: -(Math.random() * 0.7 + 0.3),
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.4 + 0.1,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 0.02 + 0.005,
    life: 0,
    maxLife: Math.random() * 400 + 200,
    colorType: Math.floor(Math.random() * 3),
  };
}

const particles = Array.from({ length: 40 }, createParticle);

function animCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const t = document.documentElement.getAttribute('data-theme');

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.life++;
    p.x += p.speedX + Math.sin(p.wobble) * 0.2;
    p.y += p.speedY;
    p.wobble += p.wobbleSpeed;

    const lifeFrac = p.life / p.maxLife;
    const fadeAlpha = lifeFrac < 0.1 ? lifeFrac * 10 : lifeFrac > 0.85 ? (1 - lifeFrac) / 0.15 : 1;

    ctx.globalAlpha = fadeAlpha * p.opacity;

    let color;
    if (t === 'dark') {
      if (p.colorType === 0) color = '#ff4df0';
      else if (p.colorType === 1) color = '#ffea61';
      else color = '#8b5cf6';
    } else {
      if (p.colorType === 0) color = 'rgba(0,0,0,0.1)';
      else if (p.colorType === 1) color = 'rgba(0,0,0,0.06)';
      else color = 'rgba(0,0,0,0.08)';
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Glow in dark mode
    if (t === 'dark') {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = fadeAlpha * p.opacity * 0.08;
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    if (p.life >= p.maxLife || p.y < -60) {
      particles[i] = createParticle();
    }
  }

  requestAnimationFrame(animCanvas);
}
animCanvas();

/* ============================================================ TEAM PAGE */
function openTeam() {
  document.getElementById('teamPage').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeTeam() {
  document.getElementById('teamPage').classList.remove('open');
  document.body.style.overflow = '';
}

/* Team page canvas — same particle style */
(function(){
  const tc = document.getElementById('teamCanvas');
  if (!tc) return;
  const tx = tc.getContext('2d');
  function resizeT(){ tc.width=window.innerWidth; tc.height=window.innerHeight; }
  resizeT(); window.addEventListener('resize', resizeT);

  function mkP(){
    return {
      x: Math.random()*tc.width, y: tc.height+60,
      speedX:(Math.random()*0.5-0.25),
      speedY:-(Math.random()*0.6+0.3),
      size:Math.random()*2.5+1,
      opacity:Math.random()*0.15+0.05,
      wobble:Math.random()*Math.PI*2,
      wobbleSpeed:Math.random()*0.02+0.005,
      colorType:Math.floor(Math.random()*3),
      life:0, maxLife:Math.random()*400+200
    };
  }
  const pts = Array.from({length:25},mkP);
  function animT(){
    tx.clearRect(0,0,tc.width,tc.height);
    const theme = document.documentElement.getAttribute('data-theme');
    for(let i=0;i<pts.length;i++){
      const p=pts[i]; p.life++;
      p.x+=p.speedX+Math.sin(p.wobble)*.2; p.y+=p.speedY;
      p.wobble+=p.wobbleSpeed;
      const lf=p.life/p.maxLife;
      const fa=lf<.1?lf*10:lf>.85?(1-lf)/.15:1;
      tx.globalAlpha=fa*p.opacity;
      let c;
      if(theme==='dark'){
        if(p.colorType===0)c='#ff4df0';
        else if(p.colorType===1)c='#ffea61';
        else c='#8b5cf6';
      } else {
        c='rgba(0,0,0,0.06)';
      }
      tx.beginPath();
      tx.arc(p.x,p.y,p.size,0,Math.PI*2);
      tx.fillStyle=c; tx.fill();
      tx.globalAlpha=1;
      if(p.life>=p.maxLife||p.y<-60) pts[i]=mkP();
    }
    requestAnimationFrame(animT);
  }
  animT();
})();

/* ============================================================ DATE PICKER MIN */
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('wa-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
});

/* ============================================================ WHATSAPP ORDER FORM */
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'wa-submit') {
    e.preventDefault();
    
    const name = document.getElementById('wa-name')?.value || '';
    const phone = document.getElementById('wa-phone')?.value || '';
    const occasion = document.getElementById('wa-occasion')?.value || '';
    const size = document.getElementById('wa-size')?.value || '';
    const rawDate = document.getElementById('wa-date')?.value || '';
    const notes = document.getElementById('wa-notes')?.value || '';
    
    let formattedDate = rawDate;
    if (rawDate) {
      const d = new Date(rawDate);
      formattedDate = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }
    
    if (!name || !phone) {
      alert('Please fill in at least your name and phone number.');
      return;
    }
    
    let message = `Hello MCakes! I would like to place an order:\n\n`;
    message += `*Name:* ${name}\n`;
    message += `*Phone:* ${phone}\n`;
    message += `*Occasion:* ${occasion}\n`;
    message += `*Cake Size:* ${size}\n`;
    message += `*Delivery Date:* ${formattedDate}\n`;
    if (notes) {
      message += `*Design Notes:* ${notes}\n`;
    }
    
    const waUrl = `https://wa.me/923359244499?text=${encodeURIComponent(message)}`;
    
    const waSubmit = e.target;
    const oldText = waSubmit.textContent;
    waSubmit.textContent = "Your order submitted ✓";
    waSubmit.style.background = "#25D366";
    waSubmit.style.color = "#fff";
    waSubmit.style.boxShadow = "0 4px 0 #1a9e4a";
    
    window.open(waUrl, '_blank');
    alert("Your order is submitted! We are redirecting you to WhatsApp to complete ✦");
    
    setTimeout(() => {
      waSubmit.textContent = oldText;
      waSubmit.style.background = "";
      waSubmit.style.color = "";
      waSubmit.style.boxShadow = "";
    }, 5000);
  }
});

/* ============================================================ LIGHTBOX with AMAZON-STYLE ZOOM */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');
const zoomLens = document.getElementById('zoomLens');

let isZooming = false;

function openLightbox(src, type) {
  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  if (type === 'image') {
    lightboxImg.src = src;
    lightboxImg.style.display = 'block';
    lightboxVideo.style.display = 'none';
    lightboxVideo.pause();
    
    // Setup zoom on image load
    lightboxImg.onload = () => {
      setupZoom(lightboxImg, src);
    };
  } else if (type === 'video') {
    lightboxVideo.src = src;
    lightboxVideo.style.display = 'block';
    lightboxImg.style.display = 'none';
    zoomLens.style.display = 'none';
    lightboxVideo.play();
  }
}

function setupZoom(img, src) {
  const zoomFactor = 2.5;
  
  img.addEventListener('mousemove', function(e) {
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Position zoom lens
    zoomLens.style.display = 'block';
    zoomLens.style.left = (e.clientX - 75) + 'px';
    zoomLens.style.top = (e.clientY - 75) + 'px';
    
    // Calculate background position
    const bgX = (x / rect.width) * 100;
    const bgY = (y / rect.height) * 100;
    
    zoomLens.style.backgroundImage = `url('${src}')`;
    zoomLens.style.backgroundSize = `${rect.width * zoomFactor}px ${rect.height * zoomFactor}px`;
    zoomLens.style.backgroundPosition = `${bgX}% ${bgY}%`;
  });
  
  img.addEventListener('mouseleave', () => {
    zoomLens.style.display = 'none';
  });
  
  img.addEventListener('mouseenter', () => {
    img.style.cursor = 'crosshair';
  });
}

function closeLightbox() {
  lightbox.style.display = 'none';
  document.body.style.overflow = '';
  lightboxVideo.pause();
  lightboxVideo.src = '';
  lightboxImg.src = '';
  zoomLens.style.display = 'none';
  
  // Remove zoom event listeners by cloning
  const newImg = lightboxImg.cloneNode(true);
  lightboxImg.parentNode.replaceChild(newImg, lightboxImg);
  // Re-assign reference — we use getElementById
}

/* ============================================================ MOBILE MENU */
document.addEventListener('DOMContentLoaded', () => {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navLinksEl = document.getElementById('navLinks');
  
  if (mobileBtn && navLinksEl) {
    mobileBtn.addEventListener('click', () => {
      navLinksEl.classList.toggle('active');
      const icon = mobileBtn.querySelector('i');
      if (navLinksEl.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
    
    const links = navLinksEl.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinksEl.classList.remove('active');
        const icon = mobileBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      });
    });
  }
});

/* ============================================================ TEXT MORPH — apply to specific hover elements */
document.querySelectorAll('.section-title, .hero-title, .team-banner-title').forEach(el => {
  el.style.transition = 'letter-spacing 0.5s cubic-bezier(.4,0,.2,1)';
  el.addEventListener('mouseenter', () => {
    el.style.letterSpacing = '0.02em';
  });
  el.addEventListener('mouseleave', () => {
    el.style.letterSpacing = '';
  });
});
