// ==============================================
// Organic Light Tendrils Background
// Vanilla JS Bezier Curve-based Animation
// ==============================================

class Tendril {
  constructor(canvas, theme) {
    this.canvas = canvas;
    this.theme = theme;
    this.reset();
  }

  reset() {
    const rect = this.canvas.getBoundingClientRect();

    // Spawn from right side with random vertical position
    this.x = rect.width;
    this.y = Math.random() * rect.height;

    // Random walk parameters
    this.vx = -(Math.random() * 1.5 + 0.8); // Move left (0.8-2.3px/frame)
    this.vy = (Math.random() - 0.5) * 0.8; // Vertical drift

    // Organic wave parameters
    this.waveAmplitude = Math.random() * 30 + 20; // Wave height (20-50px)
    this.waveFrequency = Math.random() * 0.02 + 0.01; // Wave frequency
    this.wavePhase = Math.random() * Math.PI * 2; // Random starting phase

    // Life cycle
    this.age = 0;
    this.maxAge = Math.random() * 300 + 200; // 200-500 frames
    this.opacity = 0;
    this.maxOpacity = Math.random() * 0.4 + 0.2; // 0.2-0.6

    // Size variation
    this.thickness = Math.random() * 2 + 1; // 1-3px

    // Control points for organic shape
    this.controlPoints = [];
    this.segmentCount = 5; // Number of curve segments

    // Initialize control points
    for (let i = 0; i <= this.segmentCount; i++) {
      this.controlPoints.push({
        x: 0,
        y: 0,
        offsetY: (Math.random() - 0.5) * 40 // Random offset
      });
    }
  }

  update(mouse) {
    this.age++;

    // Fade in/out based on lifecycle
    const fadeInDuration = 50;
    const fadeOutDuration = 80;

    if (this.age < fadeInDuration) {
      // Fade in
      this.opacity = (this.age / fadeInDuration) * this.maxOpacity;
    } else if (this.age > this.maxAge - fadeOutDuration) {
      // Fade out
      const fadeProgress = (this.maxAge - this.age) / fadeOutDuration;
      this.opacity = fadeProgress * this.maxOpacity;
    } else {
      // Full opacity
      this.opacity = this.maxOpacity;
    }

    // Movement with random walk
    this.x += this.vx;
    this.y += this.vy;

    // Add subtle random drift for organic feel
    this.vy += (Math.random() - 0.5) * 0.1;
    this.vy *= 0.95; // Damping

    // Wave phase evolution
    this.wavePhase += 0.03;

    // Mouse interaction - subtle repulsion
    if (mouse.x !== null && mouse.y !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const influenceRadius = 100;

      if (distance < influenceRadius) {
        const force = (1 - distance / influenceRadius) * 0.3;
        this.vy += (dy / distance) * force;
      }
    }

    // Update control points for Bezier curves
    for (let i = 0; i <= this.segmentCount; i++) {
      const segmentX = this.x - (i * 40); // Trail behind
      const waveOffset = Math.sin(this.wavePhase + i * 0.5) * this.waveAmplitude;

      this.controlPoints[i].x = segmentX;
      this.controlPoints[i].y = this.y + waveOffset + this.controlPoints[i].offsetY;
    }

    // Check if tendril should be removed
    return this.age >= this.maxAge || this.x < -200;
  }

  draw(ctx, theme) {
    if (this.opacity <= 0 || this.controlPoints.length < 2) return;

    // Theme-aware colors
    let glowColor, strokeColor;
    if (theme === 'dark') {
      glowColor = 'rgba(34, 211, 238, ' + this.opacity + ')'; // Cyan
      strokeColor = 'rgba(34, 211, 238, ' + (this.opacity * 0.6) + ')';
    } else {
      glowColor = 'rgba(251, 146, 60, ' + this.opacity + ')'; // Orange
      strokeColor = 'rgba(251, 146, 60, ' + (this.opacity * 0.5) + ')';
    }

    // Set up neon glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = glowColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = this.thickness;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw smooth Bezier curve through control points
    ctx.beginPath();
    ctx.moveTo(this.controlPoints[0].x, this.controlPoints[0].y);

    for (let i = 1; i < this.controlPoints.length; i++) {
      const curr = this.controlPoints[i];
      const prev = this.controlPoints[i - 1];

      // Calculate control point for quadratic curve
      const cpX = (prev.x + curr.x) / 2;
      const cpY = (prev.y + curr.y) / 2;

      ctx.quadraticCurveTo(prev.x, prev.y, cpX, cpY);
    }

    // Final segment
    const last = this.controlPoints[this.controlPoints.length - 1];
    ctx.lineTo(last.x, last.y);

    ctx.stroke();

    // Reset shadow for next draw
    ctx.shadowBlur = 0;
  }
}

class OrganicTendrils {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error('Canvas not found');
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.tendrils = [];
    this.mouse = { x: null, y: null };
    this.theme = document.documentElement.classList.contains('idea') ? 'light' : 'dark';

    // Performance settings
    this.maxTendrils = window.innerWidth < 768 ? 3 : 5;
    this.spawnRate = window.innerWidth < 768 ? 120 : 80; // Frames between spawns
    this.frameCount = 0;

    // Throttle settings
    this.lastMouseUpdate = 0;
    this.mouseThrottle = 16; // ~60fps

    // Mobile detection for battery optimization
    this.isMobile = window.innerWidth < 768;
    this.throttleFrames = this.isMobile ? 2 : 1; // Skip frames on mobile

    this.init();
  }

  init() {
    this.resize();
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

  bindEvents() {
    // Resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.resize();
        this.isMobile = window.innerWidth < 768;
        this.maxTendrils = this.isMobile ? 3 : 5;
        this.throttleFrames = this.isMobile ? 2 : 1;
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

  spawnTendril() {
    if (this.tendrils.length < this.maxTendrils) {
      this.tendrils.push(new Tendril(this.canvas, this.theme));
    }
  }

  animate() {
    this.frameCount++;

    // Mobile frame throttling
    if (this.frameCount % this.throttleFrames !== 0) {
      requestAnimationFrame(() => this.animate());
      return;
    }

    // Clear canvas with slight trail effect for smoothness
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Spawn new tendrils periodically
    if (this.frameCount % this.spawnRate === 0) {
      this.spawnTendril();
    }

    // Update and draw tendrils
    this.tendrils = this.tendrils.filter(tendril => {
      const shouldKeep = !tendril.update(this.mouse);
      if (!shouldKeep) return false;

      tendril.draw(this.ctx, this.theme);
      return true;
    });

    // Loop
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new OrganicTendrils('nebulaCanvas');
  });
} else {
  new OrganicTendrils('nebulaCanvas');
}
