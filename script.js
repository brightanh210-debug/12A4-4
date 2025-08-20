const giftBox = document.getElementById('gift-box');
const boomSound = document.getElementById('boom-sound');
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];

giftBox.addEventListener('click', () => {
  giftBox.style.display = 'none';
  boomSound.play();
  canvas.style.display = 'block';
  launchFireworks();
});

function launchFireworks() {
  for (let i = 0; i < 50; i++) {
    fireworks.push(new Firework());
  }
  animate();
}

function Firework() {
  this.x = canvas.width/2;
  this.y = canvas.height/2;
  this.speedX = (Math.random() - 0.5) * 8;
  this.speedY = (Math.random() - 0.5) * 8;
  this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
  this.life = 100;
}
Firework.prototype.update = function() {
  this.x += this.speedX;
  this.y += this.speedY;
  this.life--;
};
Firework.prototype.draw = function() {
  ctx.beginPath();
  ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
  ctx.fillStyle = this.color;
  ctx.fill();
};

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fireworks.forEach((f, i) => {
    f.update();
    f.draw();
    if (f.life <= 0) fireworks.splice(i, 1);
  });
  if (fireworks.length > 0) {
    requestAnimationFrame(animate);
  }
}
