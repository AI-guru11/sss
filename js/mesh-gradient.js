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

    // Neon Mint & Coral horizontal gradient palette
    this.colors = [
      { color: '#81D8D0', name: 'neon-mint' },         // Neon Mint/Teal (right side)
      { color: '#E53935', name: 'coral-red' },         // Coral Red (left side)
      { color: '#5FA9A3', name: 'mint-shadow' },       // Darker Mint (right edge blobs)
      { color: '#B82E2A', name: 'coral-shadow' }       // Darker Coral (left edge blobs)
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

    // Blob configurations for horizontal gradient (Coral Left / Mint Right)
    const blobConfigs = [
      // Center/Primary Blobs - Right side (Neon Mint)
      { x: 70, y: 20, size: 600, colorIndex: 0 },   // Top-right, Neon Mint
      { x: 65, y: 75, size: 550, colorIndex: 0 },   // Bottom-right, Neon Mint

      // Center/Primary Blobs - Left side (Coral Red)
      { x: 30, y: 15, size: 580, colorIndex: 1 },   // Top-left, Coral Red
      { x: 35, y: 80, size: 520, colorIndex: 1 },   // Bottom-left, Coral Red

      // Edge Blobs - Right side (Mint Shadow)
      { x: 90, y: 8, size: 400, colorIndex: 2 },    // Top-right corner, Mint Shadow
      { x: 92, y: 92, size: 380, colorIndex: 2 },   // Bottom-right corner, Mint Shadow

      // Edge Blobs - Left side (Coral Shadow)
      { x: 8, y: 10, size: 420, colorIndex: 3 },    // Top-left corner, Coral Shadow
      { x: 10, y: 90, size: 400, colorIndex: 3 }    // Bottom-left corner, Coral Shadow
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

    // Neon Mint & Coral horizontal gradient aesthetic
    // Creates vibrant split with smooth blending
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
