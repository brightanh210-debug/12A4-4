
// Helper: remove diacritics and normalize password
function normalizeText(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '');
}

const CORRECT = 'cacbannam12a4deptrai'; // normalized target

document.getElementById('togglePassword').addEventListener('click', function(){
  const p = document.getElementById('password');
  if (p.type === 'password') { p.type = 'text'; this.textContent = '🙈'; }
  else { p.type = 'password'; this.textContent = '👁️'; }
});

document.getElementById('login-form').addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('fullname').value.trim();
  const pass = document.getElementById('password').value || '';
  const norm = normalizeText(pass);
  if (norm === CORRECT) {
    // store name (raw) and slug
    localStorage.setItem('currentUser', name);
    const slug = name.trim().toLowerCase().replace(/\s+/g,'-');
    localStorage.setItem('currentSlug', slug);
    showGift();
  } else {
    // clear password and show playful message
    document.getElementById('password').value = '';
    alert('Ơ kìa các bạn Nam 12A4 rất đẹp trai luôn á 🥲');
  }
});

function showGift(){
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('gift-container').style.display = 'flex';
}

// FIREWORKS canvas implementation (simple particle bursts)
(function(){
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas.getContext('2d');
  let cw, ch, raf;
  function resize(){ cw = canvas.width = window.innerWidth; ch = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  // particle arrays
  let particles = [];

  function rand(min,max){ return Math.random()*(max-min)+min; }

  function createBurst(x,y){
    const colors = ['#ff7ab6','#ffd56b','#9b7bff','#66e0d5','#ff8a66'];
    const count = 40;
    for (let i=0;i<count;i++){
      const angle = Math.random()*Math.PI*2;
      const speed = rand(2,6);
      particles.push({
        x:x, y:y,
        vx: Math.cos(angle)*speed,
        vy: Math.sin(angle)*speed,
        life: rand(50,120),
        age:0,
        color: colors[Math.floor(Math.random()*colors.length)],
        size: rand(1.5,3.5)
      });
    }
  }

  function step(){
    ctx.clearRect(0,0,cw,ch);
    for (let i = particles.length-1; i>=0; i--){
      const p = particles[i];
      p.vy += 0.05; // gravity
      p.vx *= 0.99;
      p.vy *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.age++;
      const alpha = Math.max(0,1 - p.age / p.life);
      if (alpha <= 0.02) { particles.splice(i,1); continue; }
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fill();
    }
    raf = requestAnimationFrame(step);
  }
  step();

  // Expose function to create bursts
  window.fireworkBurst = function(){
    // generate multiple bursts in random places
    for (let i=0;i<3;i++){
      const x = rand(cw*0.2, cw*0.8);
      const y = rand(ch*0.2, ch*0.5);
      createBurst(x,y);
    }
  };
})();

// Gift click handling: play sound, show fireworks, stop shaking and redirect after 3s
document.getElementById('gift-box').addEventListener('click', function(){
  // stop shaking visually
  this.style.animation = 'none';
  // play boomy but cute sound
  const s = document.getElementById('boom-sound');
  s.currentTime = 0;
  s.play().catch(()=>{ /* autoplay may be blocked on some browsers */ });

  // trigger fireworks repeatedly for 2.5s
  const iv = setInterval(()=>{ window.fireworkBurst(); }, 300);
  // also call once immediately
  window.fireworkBurst();

  // after 3s, redirect to profile page
  setTimeout(()=>{
    clearInterval(iv);
    const name = localStorage.getItem('currentUser') || 'Bạn';
    const slug = localStorage.getItem('currentSlug') || 'user';
    const url = 'profile.html?user=' + encodeURIComponent(slug);
    window.location.href = url;
  }, 3000);
});
