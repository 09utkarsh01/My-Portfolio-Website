/**
 * Portfolio — Main Script
 * Pure vanilla JS, zero jQuery dependency
 * Features: smooth scroll, mobile nav, scroll progress, reveal animations,
 *           skill bar fills, typewriter, sticky header, back-to-top
 */

(function () {
    'use strict';

    // ===== MOBILE NAVIGATION =====
    const navToggle = document.querySelector('.nav-toggle');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.nav-links a');

    function toggleNav(open) {
        document.body.classList.toggle('nav-open', open);
        navToggle?.setAttribute('aria-expanded', String(open));
    }

    navToggle?.addEventListener('click', () => {
        const isOpen = document.body.classList.contains('nav-open');
        toggleNav(!isOpen);
    });

    navOverlay?.addEventListener('click', () => toggleNav(false));

    navLinks.forEach(link => {
        link.addEventListener('click', () => toggleNav(false));
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (!targetEl) return;
            e.preventDefault();
            const headerH = document.querySelector('.site-header')?.offsetHeight || 80;
            const top = targetEl.getBoundingClientRect().top + window.scrollY - headerH;
            window.scrollTo({ top, behavior: 'smooth' });

            // Pause introduction video when navigating away
            const cinVideo = document.getElementById('cinVideo');
            if (cinVideo && targetId !== '#introduction') {
                cinVideo.pause();
                const toggleBtn = document.getElementById('cinPlayToggle');
                const playIcon = document.getElementById('cinPlayIcon');
                if (toggleBtn && playIcon) {
                    playIcon.innerHTML = '<i class="fas fa-play"></i>';
                    toggleBtn.classList.remove('is-hidden');
                }
            }
        });
    });

    // ===== SCROLL PROGRESS BAR =====
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        document.documentElement.style.setProperty('--scroll-progress', progress + '%');
    }

    // ===== STICKY HEADER =====
    const header = document.querySelector('.site-header');
    function updateStickyHeader() {
        if (!header) return;
        header.classList.toggle('scrolled', window.scrollY > 80);
    }

    // ===== BACK TO TOP =====
    const backToTop = document.querySelector('.back-to-top');
    function updateBackToTop() {
        if (!backToTop) return;
        backToTop.classList.toggle('visible', window.scrollY > 600);
    }

    // Combined scroll handler
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                updateScrollProgress();
                updateStickyHeader();
                updateBackToTop();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    // Initial calls
    updateScrollProgress();
    updateStickyHeader();
    updateBackToTop();

    // ===== REVEAL ON SCROLL (IntersectionObserver) =====
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal-fade').forEach(el => {
        revealObserver.observe(el);
    });

    // ===== SKILL BAR ANIMATION =====
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.skill-bar-fill');
                bars.forEach(bar => {
                    const targetWidth = bar.getAttribute('data-width');
                    if (targetWidth) {
                        // Small delay for visual effect
                        setTimeout(() => {
                            bar.style.width = targetWidth + '%';
                        }, 200);
                    }
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    document.querySelectorAll('.skill-card').forEach(card => {
        skillObserver.observe(card);
    });

    // ===== TYPEWRITER EFFECT =====
    function initTypewriter() {
        const el = document.querySelector('[data-typewriter]');
        if (!el) return;

        const text = el.getAttribute('data-typewriter');
        if (!text) return;

        let index = 0;
        const speed = 35;

        function type() {
            if (index < text.length) {
                el.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        }

        // Start typewriter when element is visible
        const typeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(type, 400);
                    typeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        typeObserver.observe(el);
    }

    initTypewriter();

    // ===== VANILLA TILT INITIALIZATION =====
    function initTilt() {
        if (typeof VanillaTilt === 'undefined') return;

        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // Only on devices with fine pointer (mouse)
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
            max: 8,
            speed: 400,
            glare: true,
            'max-glare': 0.15,
            scale: 1.02,
            perspective: 900
        });
    }

    // Wait for VanillaTilt script to load
    if (document.readyState === 'complete') {
        initTilt();
    } else {
        window.addEventListener('load', initTilt);
    }

    // ===== ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');
    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateActiveNavLink);
    }, { passive: true });

    // ===== HERO VIDEO PLAYER CONTROLS =====
    function initHeroVideoPlayer() {
        const video = document.getElementById('heroVideo');
        const player = document.getElementById('heroVideoPlayer');
        const overlay = document.getElementById('videoUnmuteOverlay');
        const controls = document.getElementById('videoControls');
        const playPauseBtn = document.getElementById('vcPlayPause');
        const progressWrapper = document.getElementById('vcProgressWrapper');
        const progressFilled = document.getElementById('vcProgressFilled');
        const progressThumb = document.getElementById('vcProgressThumb');
        const timeDisplay = document.getElementById('vcTime');
        const muteToggle = document.getElementById('vcMuteToggle');
        const volumeSlider = document.getElementById('vcVolumeSlider');
        const fullscreenBtn = document.getElementById('vcFullscreen');

        if (!video || !player) return;

        // --- Unmute Overlay ---
        overlay?.addEventListener('click', () => {
            video.muted = false;
            video.volume = 0.8;
            volumeSlider.value = 0.8;
            updateVolumeSliderBg();
            updateMuteIcon();
            overlay.classList.add('hidden');
        });

        // --- Play / Pause ---
        playPauseBtn?.addEventListener('click', () => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });

        // Click video to toggle play/pause
        video.addEventListener('click', () => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });

        video.addEventListener('play', () => {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        });

        video.addEventListener('pause', () => {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        });

        // --- Progress Bar ---
        function formatTime(seconds) {
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return m + ':' + (s < 10 ? '0' : '') + s;
        }

        video.addEventListener('timeupdate', () => {
            if (!video.duration) return;
            const pct = (video.currentTime / video.duration) * 100;
            progressFilled.style.width = pct + '%';
            progressThumb.style.left = pct + '%';
            timeDisplay.textContent = formatTime(video.currentTime) + ' / ' + formatTime(video.duration);
        });

        video.addEventListener('loadedmetadata', () => {
            timeDisplay.textContent = '0:00 / ' + formatTime(video.duration);
        });

        // Click / drag to seek
        let isSeeking = false;

        function seekTo(e) {
            const rect = progressWrapper.getBoundingClientRect();
            let pct = (e.clientX - rect.left) / rect.width;
            pct = Math.max(0, Math.min(1, pct));
            video.currentTime = pct * video.duration;
        }

        progressWrapper?.addEventListener('mousedown', (e) => {
            isSeeking = true;
            seekTo(e);
        });

        document.addEventListener('mousemove', (e) => {
            if (isSeeking) seekTo(e);
        });

        document.addEventListener('mouseup', () => {
            isSeeking = false;
        });

        // Touch support for progress
        progressWrapper?.addEventListener('touchstart', (e) => {
            isSeeking = true;
            seekTo(e.touches[0]);
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (isSeeking) seekTo(e.touches[0]);
        }, { passive: true });

        document.addEventListener('touchend', () => {
            isSeeking = false;
        });

        // --- Volume ---
        function updateMuteIcon() {
            if (!muteToggle) return;
            let icon;
            if (video.muted || video.volume === 0) {
                icon = 'fa-volume-mute';
            } else if (video.volume < 0.5) {
                icon = 'fa-volume-down';
            } else {
                icon = 'fa-volume-up';
            }
            muteToggle.innerHTML = '<i class="fas ' + icon + '"></i>';
        }

        function updateVolumeSliderBg() {
            if (!volumeSlider) return;
            const pct = volumeSlider.value * 100;
            volumeSlider.style.background =
                'linear-gradient(to right, #d4af37 0%, #d4af37 ' + pct + '%, rgba(255,255,255,0.15) ' + pct + '%, rgba(255,255,255,0.15) 100%)';
        }

        muteToggle?.addEventListener('click', () => {
            video.muted = !video.muted;
            if (!video.muted && video.volume === 0) {
                video.volume = 0.5;
                volumeSlider.value = 0.5;
            }
            volumeSlider.value = video.muted ? 0 : video.volume;
            updateVolumeSliderBg();
            updateMuteIcon();
        });

        volumeSlider?.addEventListener('input', () => {
            video.volume = parseFloat(volumeSlider.value);
            video.muted = video.volume === 0;
            updateVolumeSliderBg();
            updateMuteIcon();

            // Also hide overlay if user adjusts volume
            if (!video.muted && overlay) {
                overlay.classList.add('hidden');
            }
        });

        // --- Fullscreen ---
        fullscreenBtn?.addEventListener('click', () => {
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                if (player.requestFullscreen) {
                    player.requestFullscreen();
                } else if (player.webkitRequestFullscreen) {
                    player.webkitRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        });

        function updateFullscreenIcon() {
            if (!fullscreenBtn) return;
            const isFS = !!(document.fullscreenElement || document.webkitFullscreenElement);
            fullscreenBtn.innerHTML = isFS
                ? '<i class="fas fa-compress"></i>'
                : '<i class="fas fa-expand"></i>';
        }

        document.addEventListener('fullscreenchange', updateFullscreenIcon);
        document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);

        // --- Show controls briefly on load ---
        controls?.classList.add('vc-visible');
        setTimeout(() => {
            controls?.classList.remove('vc-visible');
        }, 3000);

        // Initialize slider bg
        updateVolumeSliderBg();
    }

    initHeroVideoPlayer();

    // ===== CINEMATIC INTRODUCTION VIDEO =====
    function initCinematicIntro() {
        const video = document.getElementById('cinVideo');
        const toggleBtn = document.getElementById('cinPlayToggle');
        const playIcon = document.getElementById('cinPlayIcon');
        const playLabel = document.getElementById('cinPlayLabel');
        const scrollArrow = document.getElementById('cinScrollArrow');

        if (!video || !toggleBtn) return;

        let unmuted = false;

        // Toggle button: Handles unmute, play, pause, and replay
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (video.currentTime >= video.duration || video.ended) {
                // Video ended, replay from beginning
                video.currentTime = 0;
            }
            
            // Unmute and play
            video.muted = false;
            video.volume = 0.8;
            unmuted = true;
            video.play();
            
            toggleBtn.classList.add('is-hidden');
            if (playIcon) {
                playIcon.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
        });

        // Click on video directly: toggle play/pause (or unmute on first click)
        video.addEventListener('click', () => {
            if (!unmuted) {
                video.muted = false;
                video.volume = 0.8;
                unmuted = true;
                video.play();
                toggleBtn.classList.add('is-hidden');
                if (playIcon) {
                    playIcon.innerHTML = '<i class="fas fa-volume-up"></i>';
                }
                return;
            }

            if (video.paused || video.ended) {
                if (video.ended) {
                    video.currentTime = 0;
                }
                video.play();
                toggleBtn.classList.add('is-hidden');
            } else {
                video.pause();
                if (playIcon) {
                    playIcon.innerHTML = '<i class="fas fa-play"></i>';
                }
                if (playLabel) {
                    playLabel.textContent = 'Play Video';
                }
                toggleBtn.classList.remove('is-hidden');
            }
        });

        // 1-Time Play: Handle video ended state (no loop)
        video.addEventListener('ended', () => {
            if (playIcon) {
                playIcon.innerHTML = '<i class="fas fa-redo"></i>';
            }
            if (playLabel) {
                playLabel.textContent = 'Replay';
            }
            toggleBtn.classList.remove('is-hidden');
            unmuted = false; // Reset to allow replay click
        });

        // Smooth scroll arrow: scrolls to home AND pauses introduction video
        scrollArrow?.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById('home');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            // Pause video when exploring
            video.pause();
            if (playIcon) {
                playIcon.innerHTML = '<i class="fas fa-play"></i>';
            }
            if (playLabel) {
                playLabel.textContent = 'Play Video';
            }
            toggleBtn.classList.remove('is-hidden');
        });

        // Auto-pause video when scrolling away manually
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        video.pause();
                        if (playIcon) {
                            playIcon.innerHTML = '<i class="fas fa-play"></i>';
                        }
                        if (playLabel) {
                            playLabel.textContent = 'Play Video';
                        }
                        toggleBtn.classList.remove('is-hidden');
                    }
                });
            }, { threshold: 0.15 });

            const introSection = document.getElementById('introduction');
            if (introSection) {
                observer.observe(introSection);
            }
        }

        // --- AUTOMATIC UNMUTED AUTOPLAY ATTEMPT ON LOAD/REFRESH ---
        video.volume = 0.8;
        video.muted = false;
        
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Successful unmuted autoplay!
                unmuted = true;
                toggleBtn.classList.add('is-hidden');
                if (playIcon) {
                    playIcon.innerHTML = '<i class="fas fa-volume-up"></i>';
                }
            }).catch(error => {
                // Browser security blocked autoplay with audio. Fallback to muted autoplay.
                console.log("Autoplay with sound blocked. Falling back to muted autoplay.");
                video.muted = true;
                video.play().then(() => {
                    // Muted autoplay succeeded. Keep toggle button visible to prompt manual unmute.
                    unmuted = false;
                    if (playIcon) {
                        playIcon.innerHTML = '<i class="fas fa-volume-mute"></i>';
                    }
                    toggleBtn.classList.remove('is-hidden');

                    // Global helper to unmute on first user interaction anywhere
                    const autoUnmuteOnInteraction = () => {
                        if (video.muted && !video.paused) {
                            video.muted = false;
                            video.volume = 0.8;
                            unmuted = true;
                            toggleBtn.classList.add('is-hidden');
                            if (playIcon) {
                                playIcon.innerHTML = '<i class="fas fa-volume-up"></i>';
                            }
                        }
                        cleanupInteractionListeners();
                    };

                    const cleanupInteractionListeners = () => {
                        document.removeEventListener('click', autoUnmuteOnInteraction);
                        document.removeEventListener('touchstart', autoUnmuteOnInteraction);
                        document.removeEventListener('keydown', autoUnmuteOnInteraction);
                        window.removeEventListener('scroll', autoUnmuteOnInteraction);
                        window.removeEventListener('wheel', autoUnmuteOnInteraction);
                    };

                    // Listen on common user interaction events
                    document.addEventListener('click', autoUnmuteOnInteraction);
                    document.addEventListener('touchstart', autoUnmuteOnInteraction);
                    document.addEventListener('keydown', autoUnmuteOnInteraction);
                    window.addEventListener('scroll', autoUnmuteOnInteraction, { passive: true });
                    window.addEventListener('wheel', autoUnmuteOnInteraction, { passive: true });

                    // Clean up if video ends or is paused manually
                    video.addEventListener('pause', cleanupInteractionListeners, { once: true });
                }).catch(err => {
                    console.error("Muted autoplay also blocked:", err);
                    unmuted = false;
                    if (playIcon) {
                        playIcon.innerHTML = '<i class="fas fa-play"></i>';
                    }
                    if (playLabel) {
                        playLabel.textContent = 'Play Video';
                    }
                    toggleBtn.classList.remove('is-hidden');
                });
            });
        }
    }

    initCinematicIntro();

    // ===== CERTIFICATIONS CAROUSEL (HORIZONTAL INFINITE MOTION) =====
    function initCertCarousel() {
        const viewport = document.getElementById('certViewport');
        const prevBtn = document.getElementById('certPrevBtn');
        const nextBtn = document.getElementById('certNextBtn');

        if (!viewport || !prevBtn || !nextBtn) return;

        const grid = viewport.querySelector('.cert-grid');
        if (!grid) return;

        // Clone all cards to create a seamless infinite scroll loop
        const originalCards = Array.from(grid.children);
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            grid.appendChild(clone);
        });

        // Initialize tilt on newly created clones/originals to ensure 3D physics work seamlessly
        if (typeof VanillaTilt !== 'undefined' && 
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches && 
            window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            grid.querySelectorAll('.cert-card').forEach(card => {
                if (card.vanillaTilt) card.vanillaTilt.destroy();
            });
            VanillaTilt.init(grid.querySelectorAll('.cert-card'), {
                max: 8,
                speed: 400,
                glare: true,
                'max-glare': 0.15,
                scale: 1.02,
                perspective: 900
            });
        }

        let originalHeight = 0;
        let scrollSpeed = 0.55; // Pixels per frame (highly tuned for elegant, smooth readability)
        let isPaused = false;
        let pauseTimeout = null;
        let animationFrameId = null;

        // Dynamically compute the original cards' height including gaps
        function updateOriginalHeight() {
            let height = 0;
            originalCards.forEach((card, idx) => {
                height += card.offsetHeight;
                if (idx < originalCards.length - 1) {
                    height += 16; // 16px CSS gap
                }
            });
            if (originalCards.length > 0) {
                height += 16; // gap between last original and first clone
            }
            originalHeight = height || (grid.offsetHeight / 2);
        }

        // Initialize and listen to screen resizes
        updateOriginalHeight();
        window.addEventListener('resize', updateOriginalHeight);

        // Continuous marquee animation loop
        function animateMarquee() {
            if (!isPaused) {
                viewport.scrollTop += scrollSpeed;
            }

            // High-fidelity seamless wrap check
            // Keeps the scroll boundaries centered to allow infinite scroll up/down
            if (viewport.scrollTop >= originalHeight + 16) {
                viewport.scrollTop -= originalHeight;
            } else if (viewport.scrollTop <= 16) {
                viewport.scrollTop += originalHeight;
            }

            animationFrameId = requestAnimationFrame(animateMarquee);
        }

        // Set initial scroll position and start animation after DOM paints
        setTimeout(() => {
            updateOriginalHeight();
            viewport.scrollTop = originalHeight;
            animateMarquee();
        }, 500);

        // Hover container tracking to pause/resume marquee on mouse entry
        const container = document.querySelector('.cert-carousel-container');
        if (container) {
            container.addEventListener('mouseenter', () => {
                isPaused = true;
            });
            container.addEventListener('mouseleave', () => {
                // Resume auto-scroll immediately if we're not inside a manual override pause window
                if (!pauseTimeout) {
                    isPaused = false;
                }
            });
        }

        // Handle temporary pauses for manual scroll/interaction
        function triggerManualInteractionPause() {
            isPaused = true;
            if (pauseTimeout) clearTimeout(pauseTimeout);
            pauseTimeout = setTimeout(() => {
                pauseTimeout = null;
                // Only resume if user mouse is not actively hovering over the container
                const isHovering = container && container.matches(':hover');
                if (!isHovering) {
                    isPaused = false;
                }
            }, 3000); // 3 seconds pause on scroll wheel or button click
        }

        // Listen to active manual scrolls to prevent layout jitter
        viewport.addEventListener('wheel', triggerManualInteractionPause, { passive: true });
        viewport.addEventListener('touchstart', triggerManualInteractionPause, { passive: true });

        // Calculate card height for clean jumps
        function getScrollAmount() {
            const card = viewport.querySelector('.cert-card');
            if (card) {
                return card.offsetHeight + 16;
            }
            return 120;
        }

        // Circular controls
        prevBtn.addEventListener('click', () => {
            triggerManualInteractionPause();
            viewport.scrollBy({
                top: -getScrollAmount(),
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            triggerManualInteractionPause();
            viewport.scrollBy({
                top: getScrollAmount(),
                behavior: 'smooth'
            });
        });

        // Keep control buttons permanently active (loop is infinite)
        prevBtn.style.opacity = '1';
        prevBtn.style.pointerEvents = 'auto';
        nextBtn.style.opacity = '1';
        nextBtn.style.pointerEvents = 'auto';
    }

    initCertCarousel();

    // ===== PREMIUM VERTICAL PROJECT SHOWCASE SLIDER =====
    function initProjectShowcase() {
        const viewport = document.getElementById('projectViewport');
        const track = document.getElementById('projectTrack');
        const prevBtn = document.getElementById('projectPrevBtn');
        const nextBtn = document.getElementById('projectNextBtn');
        const dotsContainer = document.getElementById('projectIndicatorDots');
        const progressBar = document.getElementById('projectProgressBar');

        if (!viewport || !track) return;

        const slides = Array.from(track.querySelectorAll('.project-slide'));
        if (slides.length === 0) return;

        const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.indicator-dot')) : [];

        let currentIndex = 0;
        let isTransitioning = false;
        const totalSlides = slides.length;
        const transitionDuration = 750; // in milliseconds (matches CSS transitions)

        function goToSlide(index, instant = false) {
            if (isTransitioning && !instant) return;
            
            // Loop index boundaries
            let prevIndex = currentIndex;
            if (index < 0) {
                currentIndex = totalSlides - 1;
            } else if (index >= totalSlides) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }

            if (!instant) {
                isTransitioning = true;
            }

            const activeSlide = slides[currentIndex];
            const previousSlide = slides[prevIndex];

            // Handle transition states by toggling classes
            slides.forEach((slide, idx) => {
                slide.classList.remove('slide-leaving');
                if (idx === currentIndex) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                    if (idx === prevIndex && !instant) {
                        slide.classList.add('slide-leaving');
                    }
                }
            });

            // Adjust heights and translate offsets dynamically to support varying content heights across viewports
            // RequestAnimationFrame ensures smooth rendering
            requestAnimationFrame(() => {
                viewport.style.height = activeSlide.offsetHeight + 'px';
                track.style.transform = 'translateY(-' + activeSlide.offsetTop + 'px)';
            });

            // Sync indicators
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });

            // Sync progress bar
            if (progressBar) {
                const progressPct = ((currentIndex + 1) / totalSlides) * 100;
                progressBar.style.width = progressPct + '%';
            }

            if (!instant) {
                setTimeout(() => {
                    isTransitioning = false;
                    // Clean up leaving state classes after transition completes
                    slides.forEach(slide => slide.classList.remove('slide-leaving'));
                }, transitionDuration);
            }
        }

        // --- Arrow Buttons ---
        prevBtn?.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
        });

        nextBtn?.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
        });

        // --- Indicator Dots ---
        dots.forEach(dot => {
            dot.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-go-to'), 10);
                if (!isNaN(index)) {
                    goToSlide(index);
                }
            });
        });

        // --- Keyboard Navigation ---
        document.addEventListener('keydown', (e) => {
            // Check if projects section is in viewport
            const rect = viewport.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            if (!inView) return;

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                goToSlide(currentIndex + 1);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                goToSlide(currentIndex - 1);
            }
        });

        // --- Mobile Swipe Support ---
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        const minSwipeDelta = 40; // min swipe distance in pixels

        viewport.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        viewport.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            touchEndY = e.changedTouches[0].clientY;
            handleSwipeGesture();
        }, { passive: true });

        function handleSwipeGesture() {
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            // Handle horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > minSwipeDelta) {
                    if (deltaX > 0) {
                        goToSlide(currentIndex - 1); // Swipe right
                    } else {
                        goToSlide(currentIndex + 1); // Swipe left
                    }
                }
            } else {
                // Handle vertical swipes inside the showcase container
                if (Math.abs(deltaY) > minSwipeDelta) {
                    if (deltaY > 0) {
                        goToSlide(currentIndex - 1); // Swipe down
                    } else {
                        goToSlide(currentIndex + 1); // Swipe up
                    }
                }
            }
        }

        // --- Dynamic Window Resizing ---
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                goToSlide(currentIndex, true);
            }, 100);
        });

        // Initialize first slide instantly on render
        setTimeout(() => {
            goToSlide(0, true);
        }, 300);

        // Re-align layouts after images or sub-resources finish painting
        window.addEventListener('load', () => {
            goToSlide(currentIndex, true);
        });
    }

    initProjectShowcase();

})();
