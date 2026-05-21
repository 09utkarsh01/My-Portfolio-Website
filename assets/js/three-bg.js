/**
 * Global 3D Particle Background using Three.js
 * Reacts to mouse movement
 */

class ParticleBackground {
    constructor() {
        this.container = document.body;
        this.canvasId = 'three-bg-canvas';
        this.init();
    }

    init() {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.id = this.canvasId;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        canvas.style.background = '#0A192F';
        this.container.prepend(canvas);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };

        this.createParticles();
        this.addEventListeners();
        this.animate();
    }

    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];

        for (let i = 0; i < 2000; i++) {
            const x = THREE.MathUtils.randFloatSpread(200);
            const y = THREE.MathUtils.randFloatSpread(200);
            const z = THREE.MathUtils.randFloatSpread(200);
            vertices.push(x, y, z);

            // Random colors (bluish gold theme)
            const color = new THREE.Color();
            const r = Math.random() * 0.2 + 0.1;
            const g = Math.random() * 0.2 + 0.15;
            const b = Math.random() * 0.5 + 0.4;
            colors.push(r, g, b);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);

        this.camera.position.z = 100;
    }

    addEventListeners() {
        window.addEventListener('mousemove', (e) => {
            this.targetMouse.x = (e.clientX - window.innerWidth / 2) / 100;
            this.targetMouse.y = (e.clientY - window.innerHeight / 2) / 100;
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Smooth mouse reaction
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

        this.particleSystem.rotation.x += 0.001;
        this.particleSystem.rotation.y += 0.001;

        this.particleSystem.position.x = -this.mouse.x * 2;
        this.particleSystem.position.y = this.mouse.y * 2;

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize on load
window.addEventListener('load', () => {
    new ParticleBackground();
});
