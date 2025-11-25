// Optimized Canvas Particles
class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = this.isMobile() ? 30 : 50;

    this.init();
  }

  isMobile() {
    return window.innerWidth < 768;
  }

  init() {
    this.resize();
    this.createParticles();
    this.animate();

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 1,
        speedY: Math.random() * -0.5 - 0.2,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }
  }

  updateParticles() {
    this.particles.forEach(particle => {
      particle.y += particle.speedY;

      if (particle.y < -10) {
        particle.y = this.canvas.height + 10;
        particle.x = Math.random() * this.canvas.width;
      }
    });
  }

  drawParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(particle => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 215, 0, ${particle.opacity})`;
      this.ctx.fill();

      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
    });
  }

  animate() {
    this.updateParticles();
    this.drawParticles();
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem('particlesCanvas');
  });
} else {
  new ParticleSystem('particlesCanvas');
}
