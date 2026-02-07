// ==============================================
// Breathing Arcs Background Animation
// Scroll-linked semicircular arcs with echo effect
// ==============================================

class BreathingArc {
  constructor(canvas, theme, baseRadius, index) {
    this.canvas = canvas;
    this.theme = theme;
    this.baseRadius = baseRadius;
    this.index = index;
    this.reset();
  }

  reset() {
    const rect = this.canvas.getBoundingClientRect();

    // Position in top-right corner
    this.centerX = rect.width - 100;
    this.centerY = 100;

    // Arc parameters
    this.radius = this.baseRadius + (this.index * 60); // Spacing between arcs
    this.startAngle = Math.PI * 0.5; // Start from bottom
    this.endAngle = Math.PI; // End at left (quarter circle in top-right)

    // Breathing cycle
    this.breathCycle = 0;
    this.breathDuration = 180; // 3 seconds at 60fps
    this.echoDelay = 60; // 1 second delay for echo
    this.isEcho = false;

    // Appearance
    this.opacity = 0;
    this.maxOpacity = 0.3;
    this.thickness = 2;
  }

  update() {
    this.breathCycle++;

    // Breathing animation logic
    const cyclePosition = this.breathCycle % this.breathDuration;

    if (!this.isEcho) {
      // Main arc: fade in and out
      if (cyclePosition < 60) {
        // Fade in (1 second)
        this.opacity = (cyclePosition / 60) * this.maxOpacity;
      } else if (cyclePosition < 120) {
        // Stay visible (1 second)
        this.opacity = this.maxOpacity;
      } else {
        // Fade out (1 second)
        this.opacity = ((180 - cyclePosition) / 60) * this.maxOpacity;
      }
    } else {
      // Echo arc: appears after delay, smaller and fainter
      const echoStart = this.echoDelay;
      const echoEnd = this.echoDelay + 60;

      if (cyclePosition >= echoStart && cyclePosition < echoEnd) {
        const echoProgress = (cyclePosition - echoStart) / 60;
        this.opacity = Math.sin(echoProgress * Math.PI) * (this.maxOpacity * 0.5);
      } else {
        this.opacity = 0;
      }
    }
  }

  draw(ctx, theme, scrollOpacity) {
    if (this.opacity <= 0) return;

    // Apply scroll-based opacity reduction
    const finalOpacity = this.opacity * scrollOpacity;
    if (finalOpacity <= 0.01) return;

    // Theme-aware colors
    let strokeColor;
    if (theme === 'dark') {
      strokeColor = `rgba(34, 211, 238, ${finalOpacity})`; // Cyan
    } else {
      strokeColor = `rgba(251, 146, 60, ${finalOpacity})`; // Orange
    }

    // Glow effect
    ctx.shadowBlur = 20;
    ctx.shadowColor = strokeColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = this.isEcho ? this.thickness * 0.7 : this.thickness;
    ctx.lineCap = 'round';

    // Draw arc
    ctx.beginPath();
    const radius = this.isEcho ? this.radius * 0.85 : this.radius;
    ctx.arc(this.centerX, this.centerY, radius, this.startAngle, this.endAngle);
    ctx.stroke();

    // Reset shadow
    ctx.shadowBlur = 0;
  }
}

class BreathingArcsCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error('Canvas not found');
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.arcs = [];
    this.theme = document.documentElement.classList.contains('idea') ? 'light' : 'dark';
    this.scrollOpacity = 1;

    // Arc configuration
    this.arcCount = 3; // Main arcs
    this.baseRadius = 80;

    this.init();
  }

  init() {
    this.resize();
    this.createArcs();
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

  createArcs() {
    this.arcs = [];

    // Create main arcs
    for (let i = 0; i < this.arcCount; i++) {
      const arc = new BreathingArc(this.canvas, this.theme, this.baseRadius, i);
      arc.breathCycle = i * 60; // Stagger animations
      this.arcs.push(arc);
    }

    // Create echo arcs
    for (let i = 0; i < this.arcCount; i++) {
      const echoArc = new BreathingArc(this.canvas, this.theme, this.baseRadius, i);
      echoArc.isEcho = true;
      echoArc.breathCycle = i * 60; // Match main arc timing
      this.arcs.push(echoArc);
    }
  }

  bindEvents() {
    // Resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.resize();
        this.createArcs();
      }, 250);
    });

    // Scroll handler for opacity fade
    window.addEventListener('scroll', () => {
      this.updateScrollOpacity();
    }, { passive: true });

    // Theme change detection
    const observer = new MutationObserver(() => {
      this.theme = document.documentElement.classList.contains('idea') ? 'light' : 'dark';
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  updateScrollOpacity() {
    // Get hero section height
    const heroSection = this.canvas.closest('section');
    if (!heroSection) return;

    const heroHeight = heroSection.offsetHeight;
    const scrollY = window.scrollY;

    // Calculate opacity based on scroll (fade out as user scrolls down)
    // Opacity 1 at top, 0 when scrolled past hero section
    this.scrollOpacity = Math.max(0, 1 - (scrollY / heroHeight));
  }

  animate() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw arcs
    this.arcs.forEach(arc => {
      arc.update();
      arc.draw(this.ctx, this.theme, this.scrollOpacity);
    });

    // Loop
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new BreathingArcsCanvas('nebulaCanvas');
  });
} else {
  new BreathingArcsCanvas('nebulaCanvas');
}
