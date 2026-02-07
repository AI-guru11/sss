// ==============================================
// Floating Glyphs for Brief Wizard Section
// Sequential neon icon animations
// ==============================================

class FloatingGlyph {
  constructor(icon, canvasWidth, canvasHeight) {
    this.icon = icon;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.reset();
  }

  reset() {
    // Random position in top-left area
    this.x = Math.random() * (this.canvasWidth * 0.3) + 50;
    this.y = Math.random() * (this.canvasHeight * 0.3) + 50;

    // Random rotation (-15° to +15°)
    this.rotation = (Math.random() - 0.5) * 30 * (Math.PI / 180);

    // Lifecycle
    this.age = 0;
    this.maxAge = 240; // 4 seconds at 60fps
    this.opacity = 0;
    this.maxOpacity = 0.8;

    // Size
    this.size = 40;

    // Subtle float animation
    this.floatOffset = 0;
    this.floatSpeed = 0.02;
  }

  update() {
    this.age++;

    // Fade in/out animation
    const fadeInDuration = 40; // ~0.67s
    const fadeOutDuration = 40;

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

    // Subtle floating motion
    this.floatOffset += this.floatSpeed;

    return this.age >= this.maxAge;
  }

  draw(ctx, theme) {
    if (this.opacity <= 0) return;

    ctx.save();

    // Apply transform
    const floatY = Math.sin(this.floatOffset) * 5; // ±5px float
    ctx.translate(this.x, this.y + floatY);
    ctx.rotate(this.rotation);

    // White neon glow
    const glowIntensity = theme === 'dark' ? 15 : 10;
    ctx.shadowBlur = glowIntensity;
    ctx.shadowColor = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.1})`;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw icon path
    this.drawIconPath(ctx);

    ctx.restore();
  }

  drawIconPath(ctx) {
    const s = this.size;

    switch (this.icon) {
      case 'pen':
        // Pen/Design tool icon
        ctx.beginPath();
        ctx.moveTo(-s * 0.3, s * 0.4);
        ctx.lineTo(-s * 0.1, s * 0.2);
        ctx.lineTo(s * 0.3, -s * 0.4);
        ctx.lineTo(s * 0.4, -s * 0.3);
        ctx.lineTo(0, s * 0.3);
        ctx.lineTo(-s * 0.2, s * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Pen tip
        ctx.beginPath();
        ctx.moveTo(s * 0.25, -s * 0.35);
        ctx.lineTo(s * 0.35, -s * 0.25);
        ctx.lineTo(s * 0.4, -s * 0.3);
        ctx.lineTo(s * 0.3, -s * 0.4);
        ctx.closePath();
        ctx.fill();
        break;

      case 'megaphone':
        // Megaphone/Marketing icon
        ctx.beginPath();
        ctx.moveTo(-s * 0.4, -s * 0.1);
        ctx.lineTo(-s * 0.4, s * 0.1);
        ctx.lineTo(s * 0.2, s * 0.3);
        ctx.lineTo(s * 0.2, -s * 0.3);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        // Sound waves
        ctx.beginPath();
        ctx.arc(s * 0.3, 0, s * 0.15, -Math.PI / 4, Math.PI / 4, false);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(s * 0.35, 0, s * 0.25, -Math.PI / 4, Math.PI / 4, false);
        ctx.stroke();
        break;

      case 'lightbulb':
        // Lightbulb/Ideas icon
        ctx.beginPath();
        ctx.arc(0, -s * 0.1, s * 0.25, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();

        // Base
        ctx.beginPath();
        ctx.rect(-s * 0.1, s * 0.15, s * 0.2, s * 0.15);
        ctx.stroke();

        // Rays
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI / 2) - Math.PI / 4;
          const x1 = Math.cos(angle) * s * 0.3;
          const y1 = Math.sin(angle) * s * 0.3 - s * 0.1;
          const x2 = Math.cos(angle) * s * 0.45;
          const y2 = Math.sin(angle) * s * 0.45 - s * 0.1;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        break;

      case 'box':
        // Box/Package icon
        // Front face
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.4);
        ctx.lineTo(s * 0.3, -s * 0.25);
        ctx.lineTo(s * 0.3, s * 0.25);
        ctx.lineTo(0, s * 0.4);
        ctx.lineTo(-s * 0.3, s * 0.25);
        ctx.lineTo(-s * 0.3, -s * 0.25);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        // Center line
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.4);
        ctx.lineTo(0, s * 0.4);
        ctx.stroke();
        break;

      case 'star':
        // Star/Featured icon
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
          const x = Math.cos(angle) * s * 0.35;
          const y = Math.sin(angle) * s * 0.35;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          // Inner point
          const innerAngle = angle + Math.PI / 5;
          const innerX = Math.cos(innerAngle) * s * 0.15;
          const innerY = Math.sin(innerAngle) * s * 0.15;
          ctx.lineTo(innerX, innerY);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        break;
    }
  }
}

class FloatingGlyphsCanvas {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('Brief container not found');
      return;
    }

    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'glyphsCanvas';
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '5';

    // Ensure container has position relative
    if (getComputedStyle(this.container).position === 'static') {
      this.container.style.position = 'relative';
    }

    this.container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.glyphs = [];
    this.currentGlyph = null;
    this.theme = document.documentElement.classList.contains('idea') ? 'light' : 'dark';

    // Icon sequence
    this.iconTypes = ['pen', 'megaphone', 'lightbulb', 'box', 'star'];
    this.currentIconIndex = 0;
    this.spawnDelay = 300; // 5 seconds between spawns at 60fps
    this.frameCount = 0;

    this.init();
  }

  init() {
    this.resize();
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

  bindEvents() {
    // Resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.resize();
      }, 250);
    });

    // Theme change detection
    const observer = new MutationObserver(() => {
      this.theme = document.documentElement.classList.contains('idea') ? 'light' : 'dark';
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  spawnGlyph() {
    const rect = this.canvas.getBoundingClientRect();
    const iconType = this.iconTypes[this.currentIconIndex];

    const glyph = new FloatingGlyph(iconType, rect.width, rect.height);
    this.currentGlyph = glyph;

    // Move to next icon in sequence
    this.currentIconIndex = (this.currentIconIndex + 1) % this.iconTypes.length;
  }

  animate() {
    this.frameCount++;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Spawn new glyph periodically (one at a time)
    if (this.frameCount % this.spawnDelay === 0 && !this.currentGlyph) {
      this.spawnGlyph();
    }

    // Update and draw current glyph
    if (this.currentGlyph) {
      const isDone = this.currentGlyph.update();
      if (isDone) {
        this.currentGlyph = null;
      } else {
        this.currentGlyph.draw(this.ctx, this.theme);
      }
    }

    // Loop
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize when Brief Wizard section is available
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to ensure Alpine.js has initialized
    setTimeout(() => {
      const briefSection = document.querySelector('#brief .noise');
      if (briefSection) {
        briefSection.id = 'brief-container';
        new FloatingGlyphsCanvas('brief-container');
      }
    }, 500);
  });
} else {
  setTimeout(() => {
    const briefSection = document.querySelector('#brief .noise');
    if (briefSection) {
      briefSection.id = 'brief-container';
      new FloatingGlyphsCanvas('brief-container');
    }
  }, 500);
}
