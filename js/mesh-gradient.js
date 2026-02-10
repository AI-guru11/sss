// ==============================================
// Dynamic Mesh Gradient Background
// Premium red color palette with organic movement
// ==============================================

class MeshGradient {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('Mesh gradient container not found');
      return;
    }

    // Premium red color palette (avoiding pure #FF0000)
    this.colors = [
      { color: '#8B0000', name: 'crimson' },      // Crimson/Deep Red
      { color: '#4A0404', name: 'blood-red' },    // Blood Red/Dark Cherry
      { color: '#630F0F', name: 'muted-red' },    // Muted Highlight
      { color: '#5C0A0A', name: 'dark-cherry' }   // Additional dark variant
    ];

    this.blobs = [];
    this.theme = document.documentElement.classList.contains('idea') ? 'light' : 'dark';

    this.init();
  }

  init() {
    this.createBlobs();
    this.bindEvents();
  }

  createBlobs() {
    // Remove any existing blobs
    this.container.innerHTML = '';

    // Blob configurations with organic positioning
    const blobConfigs = [
      { x: 15, y: 20, size: 500, colorIndex: 0 },   // Top-left, Crimson
      { x: 70, y: 15, size: 450, colorIndex: 1 },   // Top-right, Blood Red
      { x: 25, y: 75, size: 480, colorIndex: 2 },   // Bottom-left, Muted Red
      { x: 80, y: 80, size: 420, colorIndex: 3 }    // Bottom-right, Dark Cherry
    ];

    blobConfigs.forEach((config, index) => {
      const blob = document.createElement('div');
      blob.className = 'mesh-blob';

      // Position as percentage
      blob.style.left = `${config.x}%`;
      blob.style.top = `${config.y}%`;

      // Size
      blob.style.width = `${config.size}px`;
      blob.style.height = `${config.size}px`;

      // Transform origin for smooth scaling
      blob.style.transformOrigin = 'center center';

      // Apply color based on theme
      this.applyBlobColor(blob, config.colorIndex);

      // Add to container
      this.container.appendChild(blob);
      this.blobs.push({ element: blob, colorIndex: config.colorIndex });
    });
  }

  applyBlobColor(blob, colorIndex) {
    const color = this.colors[colorIndex].color;

    if (this.theme === 'dark') {
      // Dark mode: use radial gradient with premium reds
      blob.style.background = `radial-gradient(circle at center, ${color}, transparent 70%)`;
    } else {
      // Light mode: softer, more diffused blobs
      const lightColor = this.adjustColorForLightMode(color);
      blob.style.background = `radial-gradient(circle at center, ${lightColor}, transparent 70%)`;
    }
  }

  adjustColorForLightMode(darkColor) {
    // Convert hex to RGB and adjust for light mode (more opacity, lighter)
    const hex = darkColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Make it lighter and more saturated for light mode
    const lighterR = Math.min(255, r + 80);
    const lighterG = Math.min(255, g + 40);
    const lighterB = Math.min(255, b + 40);

    return `rgb(${lighterR}, ${lighterG}, ${lighterB})`;
  }

  updateTheme() {
    this.theme = document.documentElement.classList.contains('idea') ? 'light' : 'dark';

    // Update all blob colors based on new theme
    this.blobs.forEach(({ element, colorIndex }) => {
      this.applyBlobColor(element, colorIndex);
    });
  }

  bindEvents() {
    // Theme change detection
    const observer = new MutationObserver(() => {
      this.updateTheme();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Responsive resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
  }

  handleResize() {
    // Adjust blob sizes based on viewport
    const isMobile = window.innerWidth < 768;

    this.blobs.forEach(({ element }, index) => {
      const baseSize = isMobile ? 300 : 450;
      const sizeVariation = [50, 0, 30, -30];
      const newSize = baseSize + sizeVariation[index];

      element.style.width = `${newSize}px`;
      element.style.height = `${newSize}px`;
    });
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to ensure the container is ready
    setTimeout(() => {
      if (document.getElementById('meshGradientCanvas')) {
        window.MeshGradient = MeshGradient;
        // Will be initialized by fikraApp() in app.js
      }
    }, 100);
  });
} else {
  setTimeout(() => {
    if (document.getElementById('meshGradientCanvas')) {
      window.MeshGradient = MeshGradient;
      // Will be initialized by fikraApp() in app.js
    }
  }, 100);
}
