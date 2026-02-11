// ==============================================
// Liquid Mesh Background Animation
// Red #E53935 & Mint #00E5A0 fluid blobs
// ==============================================

class LiquidBlob {
  constructor(canvas, config, index) {
    this.canvas = canvas;
    this.index = index;

    // Base position (percentage of canvas)
    this.basePctX = config.x;
    this.basePctY = config.y;
    this.radius = config.radius;
    this.color = config.color;

    // Non-linear movement parameters (unique per blob) - reduced by 20%
    this.freqX = 0.0003 + index * 0.00012;
    this.freqY = 0.00025 + index * 0.0001;
    this.ampX = (80 + index * 25) * 0.8;
    this.ampY = (60 + index * 20) * 0.8;
    this.phaseX = index * 1.8;
    this.phaseY = index * 2.4;

    // Breathing scale
    this.scaleFreq = 0.0004 + index * 0.00008;
    this.scalePhase = index * 1.2;

    this.x = 0;
    this.y = 0;
    this.scale = 1;
  }

  update(time, scrollOffset) {
    const rect = this.canvas.getBoundingClientRect();

    // Base position from percentage
    const baseX = (this.basePctX / 100) * rect.width;
    const baseY = (this.basePctY / 100) * rect.height;

    // Non-linear organic movement via sin/cos
    const moveX = Math.sin(time * this.freqX + this.phaseX) *
                  Math.cos(time * this.freqX * 0.7 + this.phaseY) * this.ampX;
    const moveY = Math.cos(time * this.freqY + this.phaseY) *
                  Math.sin(time * this.freqY * 0.6 + this.phaseX) * this.ampY;

    // Subtle parallax shift from scroll
    const parallaxY = scrollOffset * (0.03 + this.index * 0.015);

    this.x = baseX + moveX;
    this.y = baseY + moveY + parallaxY;

    // Breathing scale animation - reduced by 20%
    this.scale = 1 + (0.12 * 0.8) * Math.sin(time * this.scaleFreq + this.scalePhase);
  }

  draw(ctx, opacity) {
    if (opacity <= 0.01) return;

    const r = this.radius * this.scale;

    // Parse the color for alpha manipulation
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.shadowBlur = 120;
    ctx.shadowColor = this.color;

    // Radial gradient for soft blob edge
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r);
    gradient.addColorStop(0, this.colorWithAlpha(0.5 * opacity));
    gradient.addColorStop(0.4, this.colorWithAlpha(0.3 * opacity));
    gradient.addColorStop(0.7, this.colorWithAlpha(0.1 * opacity));
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  colorWithAlpha(alpha) {
    // Convert hex color to rgba
    const hex = this.color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}

class LiquidMesh {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('LiquidMesh: container not found');
      return;
    }

    // Create canvas element inside the container
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'liquidMeshCanvas';
    this.container.innerHTML = '';
    this.container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.blobs = [];
    this.theme = document.documentElement.classList.contains('idea') ? 'light' : 'dark';
    this.scrollY = 0;
    this.startTime = performance.now();
    this.animId = null;

    this.init();
  }

  init() {
    this.resize();
    this.createBlobs();
    this.bindEvents();
    this.animate();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.container.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
  }

  getColors() {
    if (this.theme === 'dark') {
      return [
        '#00E5A0', // Mint (right side)
        '#E53935', // Red (left side)
        '#00C88C', // Deep Mint
        '#C62828'  // Deep Red
      ];
    } else {
      return [
        '#00C88C', // Mint (light mode)
        '#D32F2F', // Red (light mode)
        '#00B37A', // Medium Mint
        '#B71C1C'  // Medium Red
      ];
    }
  }

  createBlobs() {
    this.blobs = [];
    const colors = this.getColors();

    // 4 large blobs — Red left, Mint right
    const configs = [
      { x: 75, y: 25, radius: 320, color: colors[0] },  // Top-right, Mint
      { x: 20, y: 30, radius: 300, color: colors[1] },  // Top-left, Red
      { x: 80, y: 75, radius: 280, color: colors[2] },  // Bottom-right, Deep Mint
      { x: 25, y: 80, radius: 260, color: colors[3] }   // Bottom-left, Deep Red
    ];

    configs.forEach((config, i) => {
      this.blobs.push(new LiquidBlob(this.canvas, config, i));
    });
  }

  bindEvents() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.resize();
        this.createBlobs();
      }, 250);
    });

    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
    }, { passive: true });

    // Theme change detection
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.classList.contains('idea') ? 'light' : 'dark';
      if (newTheme !== this.theme) {
        this.theme = newTheme;
        this.createBlobs();
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  animate() {
    const time = performance.now() - this.startTime;
    const rect = this.canvas.getBoundingClientRect();

    this.ctx.clearRect(0, 0, rect.width, rect.height);

    // Dark: dim/subdued glow — Light: softer for readability - reduced by 20%
    const baseOpacity = this.theme === 'dark' ? 0.32 : 0.22;

    // Update and draw each blob
    this.blobs.forEach(blob => {
      blob.update(time, this.scrollY);
      blob.draw(this.ctx, baseOpacity);
    });

    this.animId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
    }
  }
}

// Expose class
window.LiquidMesh = LiquidMesh;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('premium-mesh-canvas') && !window.liquidMeshInstance) {
      window.liquidMeshInstance = new LiquidMesh('premium-mesh-canvas');
    }
  });
} else {
  if (document.getElementById('premium-mesh-canvas') && !window.liquidMeshInstance) {
    window.liquidMeshInstance = new LiquidMesh('premium-mesh-canvas');
  }
}
