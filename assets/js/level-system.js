
/**
 * Level System Logic - Portfolio Section Transitions
 * Intersection Observer API se handle kiya gaya hai.
 */

const LevelSystem = (function() {
    "use strict";

    let currentLevel = null;
    let observer;
    const overlay = document.getElementById('level-overlay');
    const levelText = overlay ? overlay.querySelector('.level-text') : null;

    // --- Audio Manager: Low-latency sound triggers ---
    const AudioManager = {
        ctx: null,
        init() {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        },
        play(type) {
            if (!this.ctx) this.init();
            if (this.ctx.state === 'suspended') this.ctx.resume();
            
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, this.ctx.currentTime);
                gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.1);
            } else if (type === 'levelup') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(220, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.5);
                gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.8);
            }
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
        }
    };

    // --- Terminal Typing Logic: Ak ek karke character print hoga ---
    function typeTerminalText(element, text, speed = 50) {
        if (!element) return;
        element.innerHTML = '';
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                // Soft typing sound
                if (i % 2 === 0) AudioManager.play('click');
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    function init() {
        const options = { threshold: 0.5 };

        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const levelName = entry.target.getAttribute('data-level-name');
                    const levelNum = entry.target.getAttribute('data-level-num');
                    
                    if (currentLevel !== levelName) {
                        triggerLevelTransition(levelName, levelNum, entry.target);
                        currentLevel = levelName;
                    }
                }
            });
        }, options);

        const sections = document.querySelectorAll('section, .about-area, .contact-area');
        sections.forEach(section => observer.observe(section));
        
        // Button click sounds bind
        document.querySelectorAll('.theme-btn, .nav li a, .fancybox').forEach(btn => {
            btn.addEventListener('click', () => AudioManager.play('click'));
        });
    }

    function triggerLevelTransition(name, num, section) {
        // Overlay removed as per expert UX refinement
        // overlay.classList.add('active'); 
        AudioManager.play('levelup');

        // Level text typing effect
        const fullText = `LEVEL ${num}: ${name}`;
        if (levelText) typeTerminalText(levelText, fullText, 40);

        setTimeout(() => {
            // overlay.classList.remove('active');
            // Section specific power-ups
            triggerSectionAnimations(section, name);
            
            // Section header typing (if exists)
            const header = section.querySelector('.section-title h2, .about-content h2');
            if (header) typeTerminalText(header, header.textContent, 60);
        }, 800); // Reduced delay since overlay is gone
    }

    function triggerSectionAnimations(section, name) {
        // Section specific logic yahan add karein
        
        // 1. Data Analytics (Neural Link) - Power-up bars
        if (section.id === 'about' || name.toLowerCase().includes('neural')) {
            const bars = section.querySelectorAll('.skill-bar');
            bars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.parentElement.classList.add('chart-spawn-active');
                    // Reset original width for animation effect
                    const targetWidth = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => { 
                        bar.style.width = targetWidth;
                        playSystemBeep(440 + index * 100, 0.05);
                    }, 50);
                }, index * 300);
            });
        }

        // 2. UI/UX (Mission Logs) - Map Unlock Reveal
        if (section.id === 'project' || name.toLowerCase().includes('mission')) {
            const projects = section.querySelectorAll('.grid');
            projects.forEach((project, index) => {
                setTimeout(() => {
                    project.classList.add('map-unlock-active');
                    playSystemBeep(880 - index * 50, 0.05);
                }, index * 200);
            });
        }
    }

    function playSystemBeep(freq, duration) {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.log("Audio scale locked by browser policy");
        }
    }

    return {
        init: init
    };

})();

// Initialize Level System
document.addEventListener('DOMContentLoaded', () => {
    LevelSystem.init();
});
