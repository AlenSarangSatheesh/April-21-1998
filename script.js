document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Gallery Rendering & Interaction ---

  const galleryContainer = document.getElementById('gallery-container');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  // Utility to generate random numbers in a range
  const random = (min, max) => Math.random() * (max - min) + min;

  // Render cards
  if (typeof galleryData !== 'undefined') {
    galleryData.forEach((item, index) => {
      // Create Polaroid container
      const polaroid = document.createElement('div');
      polaroid.classList.add('polaroid');
      
      const rotate = random(-15, 15);
      const translateY = random(-10, 20);
      polaroid.style.setProperty('--rot', `${rotate}deg`);
      polaroid.style.setProperty('--y', `${translateY}px`);
      
      // Randomize animation delay and duration so they bob organically
      polaroid.style.animationDelay = `${random(0, 4)}s`;
      polaroid.style.animationDuration = `${random(3.5, 6)}s`;

      // Create image element
      const img = document.createElement('img');
      // For development, we use externalPlaceholder. In actual use, replace with item.src
      img.src = item.externalPlaceholder || item.src;
      img.alt = `Memory ${index + 1}`;
      
      // Add elements to DOM
      polaroid.appendChild(img);
      galleryContainer.appendChild(polaroid);

      // Click event for Lightbox
      polaroid.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = item.caption || "A beautiful memory.";
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      });
    });
  }

  // Close Lightbox
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    setTimeout(() => {
      lightboxImg.src = "";
      lightboxCaption.textContent = "";
      document.body.style.overflow = '';
    }, 400); // Wait for transition
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });


  // --- 2. Canvas Particles (Floating Hearts / Lights) ---

  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let particles = [];
  
  // Resize canvas
  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  };
  
  window.addEventListener('resize', resize);
  resize();

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 5 + 3; // Heart size
      this.speedY = Math.random() * 0.5 + 0.1; // Float slowly upwards
      this.speedX = (Math.random() - 0.5) * 0.5; // Drift sideways
      this.opacity = Math.random() * 0.4 + 0.1;
      // Soft pink/white color for particles
      const colors = ['rgba(255, 255, 255, ', 'rgba(255, 204, 213, ', 'rgba(255, 77, 109, '];
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      
      // Reset if off screen
      if (this.y < -10) {
        this.y = height + 10;
        this.x = Math.random() * width;
      }
      if (this.x > width + 10 || this.x < -10) {
        this.speedX *= -1;
      }
    }

    draw() {
      ctx.beginPath();
      // Draw a small floating heart
      const x = this.x;
      const y = this.y;
      const size = this.size;
      
      ctx.moveTo(x, y - size / 4);
      ctx.bezierCurveTo(x, y - size, x - size, y - size, x - size, y - size / 4);
      ctx.bezierCurveTo(x - size, y + size / 2, x, y + size * 0.75, x, y + size);
      ctx.bezierCurveTo(x, y + size * 0.75, x + size, y + size / 2, x + size, y - size / 4);
      ctx.bezierCurveTo(x + size, y - size, x, y - size, x, y - size / 4);
      
      ctx.fillStyle = this.colorBase + this.opacity + ')';
      ctx.fill();
    }
  }

  // Initialize Particles
  const initParticles = () => {
    particles = [];
    const particleCount = Math.min(window.innerWidth / 10, 100); // Responsive particle count
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  };

  // Animation Loop
  const animate = () => {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    requestAnimationFrame(animate);
  };

  initParticles();
  animate();
});
