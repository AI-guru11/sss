// ==============================================
// Interactive Nebula Canvas Background
// Vanilla JS Particle System with Mouse Interaction
// ==============================================

class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
    // Random initial position
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5; // Velocity X
    this.vy = (Math.random() - 0.5) * 0.5; // Velocity Y
    this.radius = Math.random() * 2 + 1; // 1-3px
    this.opacity = Math.random() * 0.5 + 0.3; // 0.3-0.8
  }

  update(mouse, theme) {
    // Mouse attraction/repulsion
    if (mouse.x !== null && mouse.y !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 150;

      if (distance < maxDistance) {
        // Attraction force (pull particles toward mouse)
        const force = (1 - distance / maxDistance) * 0.5;
        this.vx -= (dx / distance) * force;
        this.vy -= (dy / distance) * force;
      }
    }

    // Apply velocity
    this.x += this.vx;
    this.y += this.vy;

    // Damping (friction)
    this.vx *= 0.98;
    this.vy *= 0.98;

    // Boundaries (wrap around)
    if (this.x < 0) this.x = this.canvas.width;
    if (this.x > this.canvas.width) this.x = 0;
    if (this.y < 0) this.y = this.canvas.height;
    if (this.y > this.canvas.height) this.y = 0;

    // Keep minimum velocity
    if (Math.abs(this.vx) < 0.1) this.vx += (Math.random() - 0.5) * 0.1;
    if (Math.abs(this.vy) < 0.1) this.vy += (Math.random() - 0.5) * 0.1;
  }

  draw(ctx, theme) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    // Theme-aware colors
    if (theme === 'dark') {
      ctx.fillStyle = `rgba(34, 211, 238, ${this.opacity})`; // Cyan
    } else {
      ctx.fillStyle = `rgba(251, 146, 60, ${this.opacity})`; // Orange
    }

    ctx.fill();
  }
}

class NebulaCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error('Nebula canvas not found');
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null };
    this.theme = document.documentElement.classList.contains('idea') ? 'light' : 'dark';

    // Performance: fewer particles on mobile
    this.particleCount = window.innerWidth < 768 ? 50 : 100;

    // Throttle settings
    this.lastMouseUpdate = 0;
    this.mouseThrottle = 16; // ~60fps

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(new Particle(this.canvas));
    }
  }

  bindEvents() {
    // Resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.resize();
        this.createParticles();
      }, 250);
    });

    // Mouse move (throttled)
    this.canvas.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - this.lastMouseUpdate < this.mouseThrottle) return;

      this.lastMouseUpdate = now;
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    // Mouse leave
    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    // Touch support (mobile)
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const now = Date.now();
      if (now - this.lastMouseUpdate < this.mouseThrottle) return;

      this.lastMouseUpdate = now;
      const rect = this.canvas.getBoundingClientRect();
      const touch = e.touches[0];
      this.mouse.x = touch.clientX - rect.left;
      this.mouse.y = touch.clientY - rect.top;
    }, { passive: false });

    this.canvas.addEventListener('touchend', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    // Theme change detection
    const observer = new MutationObserver(() => {
      this.theme = document.documentElement.classList.contains('idea') ? 'light' : 'dark';
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  drawConnections() {
    const maxDistance = 120;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.3;

          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);

          // Theme-aware connection lines
          if (this.theme === 'dark') {
            this.ctx.strokeStyle = `rgba(34, 211, 238, ${opacity})`; // Cyan
          } else {
            this.ctx.strokeStyle = `rgba(251, 146, 60, ${opacity})`; // Orange
          }

          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw connections first (behind particles)
    this.drawConnections();

    // Update and draw particles
    this.particles.forEach(particle => {
      particle.update(this.mouse, this.theme);
      particle.draw(this.ctx, this.theme);
    });

    // Loop
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new NebulaCanvas('nebulaCanvas');
  });
} else {
  new NebulaCanvas('nebulaCanvas');
}
