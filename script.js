/* ============================================================ CURSOR */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});
function animRing() {
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();
document.querySelectorAll('a, button, .cake-card, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1.6)'; ring.style.transform = 'translate(-50%,-50%) scale(1.15)'; });
  el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.transform = 'translate(-50%,-50%) scale(1)'; });
});

/* ============================================================ THEME */
const themeBtn = document.getElementById('themeToggle');
let dark = true;
themeBtn.addEventListener('click', () => {
  dark = !dark;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  themeBtn.textContent = dark ? '☽' : '☀';
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

/* ============================================================ CANVAS — BULB LEAF ANIMATION */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Each "bulb leaf" = an elongated teardrop / leaf shape
function createParticle() {
  const side = Math.random() > 0.5 ? 1 : -1;
  return {
    x: Math.random() * canvas.width,
    y: canvas.height + 60,
    speedX: (Math.random() * 0.6 - 0.3) * side,
    speedY: -(Math.random() * 0.9 + 0.4),
    size: Math.random() * 18 + 8,
    // EXACT user spec: thickness Math.random()*1.2+1.0, opacity Math.random()*0.5+0.8
    thickness: Math.random() * 1.2 + 1.0,
    opacity: Math.random() * 0.4 + 0.4,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() * 0.012 - 0.006),
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 0.03 + 0.01,
    // color: mix of sun gold & soul violet & moon crimson
    colorType: Math.floor(Math.random() * 3),
    life: 0,
    maxLife: Math.random() * 380 + 220,
  };
}

const particles = Array.from({ length: 30 }, createParticle);

function drawBulbLeaf(p) {
  const t = document.documentElement.getAttribute('data-theme');
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);

  // Color selection based on theme
  let stroke, fill;
  if (p.colorType === 0) {
    // Sunshine gold
    stroke = t === 'dark' ? `rgba(240,192,64,${p.opacity * 0.9})` : `rgba(180,122,0,${p.opacity * 0.6})`;
    fill = t === 'dark' ? `rgba(240,192,64,${p.opacity * 0.12})` : `rgba(240,192,64,${p.opacity * 0.1})`;
  } else if (p.colorType === 1) {
    // Soul indigo
    stroke = t === 'dark' ? `rgba(155,100,220,${p.opacity * 0.7})` : `rgba(74,45,138,${p.opacity * 0.5})`;
    fill = t === 'dark' ? `rgba(155,100,220,${p.opacity * 0.08})` : `rgba(74,45,138,${p.opacity * 0.07})`;
  } else {
    // Moon crimson
    stroke = t === 'dark' ? `rgba(192,57,43,${p.opacity * 0.65})` : `rgba(155,27,48,${p.opacity * 0.4})`;
    fill = t === 'dark' ? `rgba(192,57,43,${p.opacity * 0.08})` : `rgba(192,57,43,${p.opacity * 0.07})`;
  }

  // Draw bulb-leaf shape
  const s = p.size;
  const sw = s * 0.38 * p.thickness; // width controlled by user thickness spec

  ctx.beginPath();
  ctx.moveTo(0, -s * 0.5);
  ctx.bezierCurveTo(sw, -s * 0.2, sw, s * 0.3, 0, s * 0.5);
  ctx.bezierCurveTo(-sw, s * 0.3, -sw, -s * 0.2, 0, -s * 0.5);

  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = p.thickness;
  ctx.stroke();

  // center vein
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.42);
  ctx.lineTo(0, s * 0.42);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = p.thickness * 0.5;
  ctx.globalAlpha = 0.5;
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.restore();
}

let frame = 0;
function animCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.life++;
    p.x += p.speedX + Math.sin(p.wobble) * 0.3;
    p.y += p.speedY;
    p.rotation += p.rotSpeed;
    p.wobble += p.wobbleSpeed;

    // Fade in/out using life
    const lifeFrac = p.life / p.maxLife;
    const fadeAlpha = lifeFrac < 0.1 ? lifeFrac * 10 : lifeFrac > 0.85 ? (1 - lifeFrac) / 0.15 : 1;
    ctx.globalAlpha = fadeAlpha;

    drawBulbLeaf(p);

    ctx.globalAlpha = 1;

    if (p.life >= p.maxLife || p.y < -60) {
      particles[i] = createParticle();
    }
  }

  frame++;
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


/* Team page canvas — same bulb leaf animation */
(function(){
  const tc = document.getElementById('teamCanvas');
  const tx = tc.getContext('2d');
  function resizeT(){ tc.width=window.innerWidth; tc.height=window.innerHeight; }
  resizeT(); window.addEventListener('resize', resizeT);

  function mkP(){
    return {
      x: Math.random()*tc.width, y: tc.height+60,
      speedX:(Math.random()*0.6-0.3)*(Math.random()>.5?1:-1),
      speedY:-(Math.random()*0.9+0.4),
      size:Math.random()*18+8,
      thickness:Math.random()*1.2+1.0,
      opacity:Math.random()*0.15+0.15,
      rotation:Math.random()*Math.PI*2,
      rotSpeed:(Math.random()*0.012-0.006),
      wobble:Math.random()*Math.PI*2,
      wobbleSpeed:Math.random()*0.03+0.01,
      colorType:Math.floor(Math.random()*3),
      life:0, maxLife:Math.random()*380+220
    };
  }
  const pts = Array.from({length:20},mkP);
  function drawL(p){
    const t = document.documentElement.getAttribute('data-theme');
    tx.save(); tx.translate(p.x,p.y); tx.rotate(p.rotation);
    let stroke,fill;
    if(p.colorType===0){stroke=`rgba(240,192,64,${p.opacity*.9})`;fill=`rgba(240,192,64,${p.opacity*.1})`;}
    else if(p.colorType===1){stroke=`rgba(155,100,220,${p.opacity*.7})`;fill=`rgba(155,100,220,${p.opacity*.08})`;}
    else{stroke=`rgba(192,57,43,${p.opacity*.65})`;fill=`rgba(192,57,43,${p.opacity*.08})`;}
    const s=p.size, sw=s*0.38*p.thickness;
    tx.beginPath();
    tx.moveTo(0,-s*.5);
    tx.bezierCurveTo(sw,-s*.2,sw,s*.3,0,s*.5);
    tx.bezierCurveTo(-sw,s*.3,-sw,-s*.2,0,-s*.5);
    tx.fillStyle=fill; tx.fill();
    tx.strokeStyle=stroke; tx.lineWidth=p.thickness; tx.stroke();
    tx.beginPath(); tx.moveTo(0,-s*.42); tx.lineTo(0,s*.42);
    tx.lineWidth=p.thickness*.5; tx.globalAlpha=0.5; tx.stroke();
    tx.globalAlpha=1; tx.restore();
  }
  function animT(){
    tx.clearRect(0,0,tc.width,tc.height);
    for(let i=0;i<pts.length;i++){
      const p=pts[i]; p.life++;
      p.x+=p.speedX+Math.sin(p.wobble)*.3; p.y+=p.speedY;
      p.rotation+=p.rotSpeed; p.wobble+=p.wobbleSpeed;
      const lf=p.life/p.maxLife;
      const fa=lf<.1?lf*10:lf>.85?(1-lf)/.15:1;
      tx.globalAlpha=fa; drawL(p); tx.globalAlpha=1;
      if(p.life>=p.maxLife||p.y<-60) pts[i]=mkP();
    }
    requestAnimationFrame(animT);
  }
  animT();
})();

// Set minimum date to today for the date picker
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('wa-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});

// WhatsApp Integration
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
        
        // Open WhatsApp
        window.open(waUrl, '_blank');
        
        // Provide the success message to the user
        alert("Your order is submitted! We are redirecting you to WhatsApp to complete ✦");
        
        setTimeout(() => {
            waSubmit.textContent = oldText;
            waSubmit.style.background = "";
            waSubmit.style.color = "";
        }, 5000);
    }
});

// ============================================================ LIGHTBOX FEATURE
function openLightbox(src, type) {
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbVid = document.getElementById('lightbox-video');
    
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // prevent scrolling behind lightbox
    
    if (type === 'image') {
        lbImg.src = src;
        lbImg.style.display = 'block';
        lbVid.style.display = 'none';
        lbVid.pause();
    } else if (type === 'video') {
        lbVid.src = src;
        lbVid.style.display = 'block';
        lbImg.style.display = 'none';
        lbVid.play();
    }
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    const lbVid = document.getElementById('lightbox-video');
    
    lb.style.display = 'none';
    document.body.style.overflow = '';
    
    lbVid.pause();
    lbVid.src = '';
    document.getElementById('lightbox-img').src = '';
}

// ============================================================ MOBILE MENU
document.addEventListener('DOMContentLoaded', () => {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
});
