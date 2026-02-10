// ==============================================
// Global Premium Crimson Mesh Gradient
// Deep Crimson palette with Lissajous movement
// ==============================================

class MeshGradient {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('Mesh gradient container not found');
      return;
    }

    // Premium AI Aesthetic palette (Purple & Soft Pink)
    this.colors = [
      { color: '#6B46C1', name: 'deep-purple' },      // Deep Purple
      { color: '#9333EA', name: 'vibrant-purple' },   // Vibrant Purple
      { color: '#EC4899', name: 'soft-pink' },        // Soft Pink
      { color: '#8B5CF6', name: 'lavender-purple' }   // Lavender Purple
    ];

    this.blobs = [];
    this.theme = document.documentElement.classList.contains('idea') ? 'light' : 'dark';

    this.init();
  }

  init() {
    this.createBlobs();
    this.createOrbitalElements();
    this.bindEvents();
  }

  createBlobs() {
    // Remove any existing blobs
    this.container.innerHTML = '';

    // Blob configurations for full-screen coverage
    const blobConfigs = [
      { x: 20, y: 15, size: 600, colorIndex: 0 },   // Top-left, Deep Purple
      { x: 75, y: 10, size: 550, colorIndex: 1 },   // Top-right, Vibrant Purple
      { x: 30, y: 80, size: 580, colorIndex: 2 },   // Bottom-left, Soft Pink
      { x: 85, y: 85, size: 520, colorIndex: 3 }    // Bottom-right, Lavender Purple
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

    // Premium AI aesthetic with Purple/Pink gradient blobs
    // Softer edges for fluid ambient effect
    blob.style.background = `radial-gradient(circle at center, ${color}, transparent 70%)`;
  }

  createOrbitalElements() {
    // Create orbital light halos in corners
    const orbitalConfigs = [
      { x: 95, y: 5, size: 180, position: 'top-right' },
      { x: 5, y: 95, size: 160, position: 'bottom-left' }
    ];

    orbitalConfigs.forEach((config, index) => {
      const orbital = document.createElement('div');
      orbital.className = 'orbital-halo';

      orbital.style.left = `${config.x}%`;
      orbital.style.top = `${config.y}%`;
      orbital.style.width = `${config.size}px`;
      orbital.style.height = `${config.size}px`;

      // Add pulsing animation with staggered timing
      orbital.style.animationDelay = `${index * 1.5}s`;

      this.container.appendChild(orbital);
    });
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
      if (document.getElementById('premium-mesh-canvas')) {
        window.MeshGradient = MeshGradient;
        // Will be initialized by fikraApp() in app.js
      }
    }, 100);
  });
} else {
  setTimeout(() => {
    if (document.getElementById('premium-mesh-canvas')) {
      window.MeshGradient = MeshGradient;
      // Will be initialized by fikraApp() in app.js
    }
  }, 100);
}
