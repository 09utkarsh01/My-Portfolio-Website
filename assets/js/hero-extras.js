/*------------------------------------------
    = HERO TYPING ANIMATION
-------------------------------------------*/
(function ($) {
    "use strict";

    function initHeroTyping() {
        const roles = ["Data Analyst", "UI/UX Designer", "Dashboard Developer"];
        const target = document.querySelector(".hero-typing-target");
        if (!target) return;

        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                target.textContent = currentRole.substring(0, charIndex);
                charIndex--;
            } else {
                target.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500;
            } else if (isDeleting) {
                typeSpeed = 50;
            } else {
                typeSpeed = 100;
            }

            setTimeout(type, typeSpeed);
        }

        type();
    }

    $(window).on('load', function () {
        initHeroTyping();
    });

})(window.jQuery);
