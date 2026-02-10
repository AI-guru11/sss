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

    // Deep Crimson & Dark Cherry palette with black edges
    this.colors = [
      { color: '#8B0000', name: 'crimson' },           // Crimson (vibrant centers)
      { color: '#4A0404', name: 'dark-cherry' },       // Dark Cherry (rich depth)
      { color: '#5C0A0A', name: 'dark-crimson' },      // Dark Crimson (medium tone)
      { color: '#1A0202', name: 'black-red' },         // Black-Red (edge blobs)
      { color: '#0D0101', name: 'deep-black' }         // Deep Black (darkest edges)
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

    // Blob configurations for full-screen coverage with deep black edges
    const blobConfigs = [
      // Center/Primary Blobs (Crimson & Dark Cherry)
      { x: 25, y: 20, size: 600, colorIndex: 0 },   // Top-left, Crimson
      { x: 70, y: 15, size: 550, colorIndex: 1 },   // Top-right, Dark Cherry
      { x: 35, y: 75, size: 580, colorIndex: 2 },   // Bottom-left, Dark Crimson
      { x: 80, y: 80, size: 520, colorIndex: 1 },   // Bottom-right, Dark Cherry

      // Edge Blobs (Deep Black Swabs)
      { x: 5, y: 5, size: 400, colorIndex: 3 },     // Top-left corner, Black-Red
      { x: 95, y: 5, size: 380, colorIndex: 4 },    // Top-right corner, Deep Black
      { x: 5, y: 95, size: 420, colorIndex: 4 },    // Bottom-left corner, Deep Black
      { x: 95, y: 95, size: 400, colorIndex: 3 }    // Bottom-right corner, Black-Red
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

    // Deep Crimson & Dark Cherry aesthetic with smooth gradients
    // Darker edge blobs blend into background for cinematic depth
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
      const baseSize = isMobile ? 250 : 400;
      // Size variations for 8 blobs: [4 center blobs, 4 edge blobs]
      const sizeVariation = [
        50, 0, 30, -20,    // Center blobs (larger, vibrant)
        -50, -70, -40, -60  // Edge blobs (smaller, darker)
      ];
      const newSize = baseSize + (sizeVariation[index] || 0);

      element.style.width = `${newSize}px`;
      element.style.height = `${newSize}px`;
    });
  }
}

// Expose the MeshGradient class immediately
window.MeshGradient = MeshGradient;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('premium-mesh-canvas') && !window.meshGradientInstance) {
      window.meshGradientInstance = new MeshGradient('premium-mesh-canvas');
    }
  });
} else {
  // DOM already loaded
  if (document.getElementById('premium-mesh-canvas') && !window.meshGradientInstance) {
    window.meshGradientInstance = new MeshGradient('premium-mesh-canvas');
  }
}
