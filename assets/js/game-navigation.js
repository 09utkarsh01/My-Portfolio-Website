
/**
 * Game Controller Navigation & Physics Interaction
 * Powered by Three.js, Matter.js, and Anime.js
 */

const GameNavigation = (function() {
    "use strict";

    let scene, camera, renderer, crosshair;
    let engine, world;
    let mouse = { x: 0, y: 0 };
    let physicsBodies = [];
    const interactionRadius = 150;

    function init() {
        initThreeJS();
        // If the crosshair container isn't present, keep the rest of the site fully functional
        // and skip the game-style cursor system entirely.
        if (!renderer || !scene || !camera) return;
        initMatterJS();
        createCrosshair();
        bindEvents();
        mapUIElements();
        animate();
    }

    function initThreeJS() {
        const container = document.getElementById('crosshair-canvas-container');
        if (!container) return;

        scene = new THREE.Scene();
        camera = new THREE.OrthographicCamera(
            window.innerWidth / -2, window.innerWidth / 2,
            window.innerHeight / 2, window.innerHeight / -2,
            1, 1000
        );
        camera.position.z = 10;

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
    }

    function createCrosshair() {
        const group = new THREE.Group();

        // Outer Circle
        const circleGeom = new THREE.RingGeometry(15, 17, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x00F3FF, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(circleGeom, material);
        group.add(ring);

        // Cross Lines
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00F3FF });
        
        const hPoints = [new THREE.Vector3(-25, 0, 0), new THREE.Vector3(25, 0, 0)];
        const hGeom = new THREE.BufferGeometry().setFromPoints(hPoints);
        const hLine = new THREE.Line(hGeom, lineMaterial);
        group.add(hLine);

        const vPoints = [new THREE.Vector3(0, -25, 0), new THREE.Vector3(0, 25, 0)];
        const vGeom = new THREE.BufferGeometry().setFromPoints(vPoints);
        const vLine = new THREE.Line(vGeom, lineMaterial);
        group.add(vLine);

        // Center Dot
        const dotGeom = new THREE.CircleGeometry(2, 16);
        const dot = new THREE.Mesh(dotGeom, material);
        group.add(dot);

        crosshair = group;
        scene.add(crosshair);
    }

    function initMatterJS() {
        engine = Matter.Engine.create();
        world = engine.world;
        engine.gravity.y = 0; // Top-down game feel
    }

    function mapUIElements() {
        // Clear old bodies
        physicsBodies.forEach(body => Matter.World.remove(world, body));
        physicsBodies = [];

        // Map project tiles and buttons
        const targets = document.querySelectorAll('.terminal-project, .theme-btn, .glass-card, .nav li a');
        targets.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            const body = Matter.Bodies.rectangle(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                rect.width,
                rect.height,
                { isStatic: true, label: 'ui-element' }
            );
            body.element = el;
            physicsBodies.push(body);
            Matter.World.add(world, body);
        });
    }

    function bindEvents() {
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;

            // Update Three.js crosshair
            if (crosshair) {
                crosshair.position.x = mouse.x - window.innerWidth / 2;
                crosshair.position.y = -(mouse.y - window.innerHeight / 2);
            }

            // Check proximity/collision for physics interaction
            checkInteractions();
        });

        window.addEventListener('mousedown', () => {
             if (crosshair) {
                anime({
                    targets: crosshair.scale,
                    x: [1, 0.8, 1.2, 1],
                    y: [1, 0.8, 1.2, 1],
                    duration: 300,
                    easing: 'easeOutElastic(1, .5)'
                });
             }
        });

        window.addEventListener('resize', () => {
            if (renderer) {
                renderer.setSize(window.innerWidth, window.innerHeight);
                camera.left = window.innerWidth / -2;
                camera.right = window.innerWidth / 2;
                camera.top = window.innerHeight / 2;
                camera.bottom = window.innerHeight / -2;
                camera.updateProjectionMatrix();
            }
            mapUIElements();
        });
        
        // Handle clicks on elements through the crosshair
        window.addEventListener('click', (e) => {
             // Find if any element is under the crosshair
             const element = document.elementFromPoint(mouse.x, mouse.y);
             if (element && (element.tagName === 'A' || element.closest('a'))) {
                 const link = element.tagName === 'A' ? element : element.closest('a');
                 // If it's a hash link, the default logic in script.js should handle it
                 // but we ensure it works if we blocked something
             }
        });
    }

    function checkInteractions() {
        physicsBodies.forEach(body => {
            const dx = body.position.x - mouse.x;
            const dy = body.position.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < interactionRadius) {
                const strength = (1 - distance / interactionRadius) * 8; // Reduced strength
                const angle = Math.atan2(dy, dx);
                
                const moveX = Math.cos(angle) * strength;
                const moveY = Math.sin(angle) * strength;

                // Apply visual recoil using Anime.js
                if (!body.isReacting) {
                    body.isReacting = true;
                    anime({
                        targets: body.element,
                        translateX: moveX,
                        translateY: moveY,
                        scale: 1.02,
                        duration: 400,
                        easing: 'easeOutElastic(1, .6)',
                        complete: () => {
                            anime({
                                targets: body.element,
                                translateX: 0,
                                translateY: 0,
                                scale: 1,
                                duration: 600,
                                easing: 'easeOutElastic(1, .5)',
                                complete: () => { body.isReacting = false; }
                            });
                        }
                    });
                }
            }
        });
    }

    function animate() {
        requestAnimationFrame(animate);
        
        // Expert Refine: Magnetic Snapping
        let targetX = mouse.x;
        let targetY = mouse.y;

        physicsBodies.forEach(body => {
            const dx = body.position.x - mouse.x;
            const dy = body.position.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 80) { // Snapping range
                const factor = (1 - distance / 80) * 0.4;
                targetX += (body.position.x - mouse.x) * factor;
                targetY += (body.position.y - mouse.y) * factor;
            }
        });

        if (crosshair) {
            crosshair.rotation.z += 0.01;
            // Smoothly move crosshair to snapped position
            crosshair.position.x += ((targetX - window.innerWidth / 2) - crosshair.position.x) * 0.2;
            crosshair.position.y += (-(targetY - window.innerHeight / 2) - crosshair.position.y) * 0.2;
        }

        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }

    return {
        init: init
    };

})();

// Initialize when libraries are loaded
document.addEventListener('DOMContentLoaded', () => {
    // We'll rely on index.html loading order
    setTimeout(() => {
        GameNavigation.init();
    }, 500);
});
