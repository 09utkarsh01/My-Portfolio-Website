(function($) {

    "use strict";


    /*------------------------------------------
        = FUNCTIONS
    -------------------------------------------*/
    // Toggle mobile navigation
    function toggleMobileNavigation() {
        var navbar = $(".navigation-holder");
        var openBtn = $(".navbar-header .open-btn");
        var closeBtn = $(".navigation-holder .close-navbar");

        openBtn.on("click", function() {
            if (!navbar.hasClass("slideInn")) {
                navbar.addClass("slideInn");
            }
            return false;
        })

        closeBtn.on("click", function() {
            if (navbar.hasClass("slideInn")) {
                navbar.removeClass("slideInn");
            }
            return false;
        })
    }

    toggleMobileNavigation();


    // Function for toggle a class for small menu
    function toggleClassForSmallNav() {
        var windowWidth = window.innerWidth;
        var mainNav = $("#navbar > ul");

        if (windowWidth <= 991) {
            mainNav.addClass("small-nav");
        } else {
            mainNav.removeClass("small-nav");
        }
    }

    toggleClassForSmallNav();


    // Function for small menu
    function smallNavFunctionality() {
        var windowWidth = window.innerWidth;
        var mainNav = $(".navigation-holder");
        var smallNav = $(".navigation-holder > .small-nav");
        var subMenu = smallNav.find(".sub-menu");
        var megamenu = smallNav.find(".mega-menu");
        var menuItemWidthSubMenu = smallNav.find(".menu-item-has-children > a");

        if (windowWidth <= 991) {
            subMenu.hide();
            megamenu.hide();
            menuItemWidthSubMenu.on("click", function(e) {
                var $this = $(this);
                $this.siblings().slideToggle();
                 e.preventDefault();
                e.stopImmediatePropagation();
            })
        } else if (windowWidth > 991) {
            mainNav.find(".sub-menu").show();
            mainNav.find(".mega-menu").show();
        }
    }


    // smooth-scrolling
    function smoothScrolling($scrollLinks, $topOffset) {
        var links = $scrollLinks;
        var topGap = $topOffset;

        links.on("click", function() {
            if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $("[name=" + this.hash.slice(0) +"]");
                if (target.length) {
                    $("html, body").animate({
                    scrollTop: target.offset().top - topGap
                }, 1000, "easeInOutExpo");
                    return false;
                }
            }
            return false;
        });
    }

    // Parallax background
    function bgParallax() {
        if ($(".parallax").length) {
            $(".parallax").each(function() {
                var height = $(this).position().top;
                var resize     = height - $(window).scrollTop();
                var doParallax = -(resize/5);
                var positionValue   = doParallax + "px";
                var img = $(this).data("bg-image");

                $(this).css({
                    backgroundImage: "url(" + img + ")",
                    backgroundPosition: "50%" + positionValue,
                    backgroundSize: "cover"
                });
            });
        }
    }


    // Hero slider background setting
    function sliderBgSetting() {
        if ($(".hero-slider .slide").length) {
            $(".hero-slider .slide").each(function() {
                var $this = $(this);
                var img = $this.find(".slider-bg").attr("src");
                var sliderBg = $this.find(".slider-image");

                sliderBg.css({
                    backgroundImage: "url("+ img +")",
                    backgroundSize: "cover",
                    backgroundPosition: "center center"
                })
            });
        }
    }


    //Setting hero slider
    function heroSlider() {
        if ($(".hero-slider").length) {
            var $status = $('.pagi-info');

            $(".hero-slider").on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
                var i = (currentSlide ? currentSlide : 0) + 1;

                if(i < 10) {
                    i = '0' + i;
                }

                if(slick.slideCount < 10) {
                    var slideCount = '0' + slick.slideCount;
                } else {
                    var slideCount = slick.slideCount;
                }

                $status.text(i + ' / ' + slideCount);
            });

            $(".hero-slider").slick({
                autoplay: true,
                autoplaySpeed: 6000,
                arrows: false,
                dots: true,
                speed: 1000,
                cssEase: 'cubic-bezier(.4,.72,.22,.99)',
                // speed: 1000,
                // fade: true,
                // cssEase: 'ease-in-out',
                draggable: false
            });
        }
    }

    //Active heor slider
    heroSlider();


    /*------------------------------------------
        = HIDE PRELOADER
    -------------------------------------------*/
    function preloader() {
        wow.init();
    }

    /*------------------------------------------
        = WOW ANIMATION SETTING
    -------------------------------------------*/
    var wow = new WOW({
        boxClass:     'wow',      // default
        animateClass: 'animated', // default
        offset:       0,          // default
        mobile:       true,       // default
        live:         true        // default
    });
   

    /*------------------------------------------
        = ACTIVE POPUP IMAGE
    -------------------------------------------*/
    if ($(".fancybox").length) {
        $(".fancybox").fancybox({
            openEffect  : "elastic",
            closeEffect : "elastic",
            wrapCSS     : "project-fancybox-title-style"
        });
    }


    /*------------------------------------------
        = POPUP VIDEO
    -------------------------------------------*/
    if ($(".video-btn").length) {
        $(".video-btn").on("click", function(){
            $.fancybox({
                href: this.href,
                type: $(this).data("type"),
                'title'         : this.title,
                helpers     : {
                    title : { type : 'inside' },
                    media : {}
                },

                beforeShow : function(){
                    $(".fancybox-wrap").addClass("gallery-fancybox");
                }
            });
            return false
        });
    }


    /*------------------------------------------
        = POPUP YOUTUBE, VIMEO, GMAPS
    -------------------------------------------*/
    $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false
    });
    


    /*------------------------------------------
        = ACTIVE POPUP IMAGE
    -------------------------------------------*/
    if ($(".popup-image").length) {
        $('.popup-image').magnificPopup({
            type: 'image',
            zoom: {
                enabled: true,

                duration: 300,
                easing: 'ease-in-out',
                opener: function(openerElement) {
                    return openerElement.is('img') ? openerElement : openerElement.find('img');
                }
            }
        });
    }


    /*------------------------------------------
        = ACTIVE GALLERY POPUP IMAGE
    -------------------------------------------*/
    if ($(".popup-gallery").length) {
        $('.popup-gallery').magnificPopup({
            delegate: 'a',
            type: 'image',

            gallery: {
              enabled: true
            },

            zoom: {
                enabled: true,

                duration: 300,
                easing: 'ease-in-out',
                opener: function(openerElement) {
                    return openerElement.is('img') ? openerElement : openerElement.find('img');
                }
            }
        });
    }


    /*------------------------------------------
        = FUNCTION FORM SORTING GALLERY
    -------------------------------------------*/
    function sortingGallery() {
        if ($(".sortable-gallery .gallery-filters").length) {
            var $container = $('.gallery-container');
            $container.isotope({
                filter:'*',
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false,
                }
            });

            $(".gallery-filters li a").on("click", function() {
                $('.gallery-filters li .current').removeClass('current');
                $(this).addClass('current');
                var selector = $(this).attr('data-filter');
                $container.isotope({
                    filter:selector,
                    animationOptions: {
                        duration: 750,
                        easing: 'linear',
                        queue: false,
                    }
                });
                return false;
            });
        }
    }

    sortingGallery();


    /*------------------------------------------
        = MASONRY GALLERY SETTING
    -------------------------------------------*/
    function masonryGridSetting() {
        if ($('.masonry-gallery').length) {
            var $grid =  $('.masonry-gallery').masonry({
                itemSelector: '.grid-item',
                columnWidth: '.grid-item',
                percentPosition: true
            });

            $grid.imagesLoaded().progress( function() {
                $grid.masonry('layout');
            });
        }
    }

    // masonryGridSetting();



    /*------------------------------------------
        = STICKY HEADER
    -------------------------------------------*/

    // Function for clone an element for sticky menu
    function cloneNavForSticyMenu($ele, $newElmClass) {
        $ele.addClass('original').clone().insertAfter($ele).addClass($newElmClass).removeClass('original');
    }

    // clone home style 1 navigation for sticky menu
    if ($('.site-header .navigation').length) {
        cloneNavForSticyMenu($('.site-header .navigation'), "sticky-header");
    }

    // Function for sticky menu
    function stickIt($stickyClass, $toggleClass) {

        if ($(window).scrollTop() >= 300) {
            var orgElement = $(".original");
            if (!orgElement.length || !$stickyClass.length) {
                return;
            }
            var coordsOrgElement = orgElement.offset();
            var leftOrgElement = coordsOrgElement.left;
            var widthOrgElement = orgElement.css("width");

            $stickyClass.addClass($toggleClass);

            $stickyClass.css({
                "width": widthOrgElement
            }).show();

            $(".original").css({
                "visibility": "hidden"
            });

        } else {

            $(".original").css({
                "visibility": "visible"
            });

            $stickyClass.removeClass($toggleClass);
        }
    }

    /*------------------------------------------
        = FUNFACE
    -------------------------------------------*/
    if ($(".odometer").length) {
        $('.odometer').appear();
        $(document.body).on('appear', '.odometer', function(e) {
            var odo = $(".odometer");
            odo.each(function() {
                var countNumber = $(this).attr("data-count");
                $(this).html(countNumber);
            });
        });
    }

    /*------------------------------------------
        = CONTACT FORM SUBMISSION
    -------------------------------------------*/
    if ($("#contact-form").length) {
        $("#contact-form").validate({
            rules: {
                name: {
                    required: true,
                    minlength: 2
                },

                email: "required",

                phone: "required",

                address: "required",
            },

            messages: {
                name: "Please enter your name",
                email: "Please enter your email address",
                phone: "Please enter your phone number",
                address: "Please enter your address",
            },

            submitHandler: function (form) {
                $.ajax({
                    type: "POST",
                    url: "mail.php",
                    data: $(form).serialize(),
                    success: function () {
                        $( "#loader").hide();
                        $( "#success").slideDown( "slow" );
                        setTimeout(function() {
                        $( "#success").slideUp( "slow" );
                        }, 3000);
                        form.reset();
                    },
                    error: function() {
                        $( "#loader").hide();
                        $( "#error").slideDown( "slow" );
                        setTimeout(function() {
                        $( "#error").slideUp( "slow" );
                        }, 3000);
                    }
                });
                return false; // required to block normal submit since you used ajax
            }

        });
    }

    /*------------------------------------------
        = BACK TO TOP BTN SETTING
    -------------------------------------------*/
    $("body").append("<a href='#' class='back-to-top'><i class='ti-arrow-up'></i></a>");

    function toggleBackToTopBtn() {
        var amountScrolled = 1000;
        if ($(window).scrollTop() > amountScrolled) {
            $("a.back-to-top").fadeIn("slow");
        } else {
            $("a.back-to-top").fadeOut("slow");
        }
    }

    $(".back-to-top").on("click", function() {
        $("html,body").animate({
            scrollTop: 0
        }, 700);
        return false;
    })



    /*================================
     Gift-carousel
     ==================================*/


    /*==========================================================================
        WHEN DOCUMENT LOADING
    ==========================================================================*/
        $(window).on('load', function() {

            preloader();

            sliderBgSetting();

            toggleMobileNavigation();

            smallNavFunctionality();

            sortingGallery();
            
            smoothScrolling($("#navbar > ul > li > a[href^='#']"), $(".site-header .navigation").innerHeight());
            
            smoothScrolling($(".go-contact-item"), $(".site-header .navigation").innerHeight());

            /*------------------------------------------
                = SECTION 3D BACKGROUND SYSTEM (lightweight parallax)
              -------------------------------------------*/
            function initSection3DBackgrounds() {
                /** @type {NodeListOf<HTMLElement>} */
                var sections = document.querySelectorAll('.section-3d');
                if (!sections.length) return;

                var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                if (reduceMotion) return;

                var canHoverFine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
                var header = document.querySelector('.site-header');

                var targetX = 0;
                var targetY = 0;
                var currentX = 0;
                var currentY = 0;
                var rafMove = 0;

                function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

                function tickMove() {
                    rafMove = 0;
                    currentX += (targetX - currentX) * 0.08;
                    currentY += (targetY - currentY) * 0.08;

                    sections.forEach(function(sec) {
                        sec.style.setProperty('--mx', currentX.toFixed(4));
                        sec.style.setProperty('--my', currentY.toFixed(4));
                    });
                }

                function onMouseMove(e) {
                    targetX = ((e.clientX / window.innerWidth) * 2) - 1;
                    targetY = ((e.clientY / window.innerHeight) * 2) - 1;
                    targetX = clamp(targetX, -1, 1);
                    targetY = clamp(targetY, -1, 1);
                    if (!rafMove) rafMove = requestAnimationFrame(tickMove);
                }

                var rafScroll = 0;
                function tickScroll() {
                    rafScroll = 0;
                    var vh = window.innerHeight || 1;
                    sections.forEach(function(sec) {
                        var r = sec.getBoundingClientRect();
                        var mid = r.top + (r.height / 2);
                        var p = (mid - (vh / 2)) / (vh / 2); // approx -1..1
                        p = clamp(p, -1, 1);
                        sec.style.setProperty('--sp', p.toFixed(4));
                    });

                    // Header: subtle scroll-driven 3D drift (keeps header clean; no background/border).
                    if (header) {
                        var t = window.scrollY / 240;
                        t = clamp(t, 0, 1);
                        header.style.setProperty('--hdrsp', t.toFixed(4));
                    }
                }

                function onScroll() {
                    if (!rafScroll) rafScroll = requestAnimationFrame(tickScroll);
                }

                tickScroll();
                window.addEventListener('scroll', onScroll, { passive: true });
                window.addEventListener('resize', tickScroll, { passive: true });

                if (canHoverFine) {
                    window.addEventListener('mousemove', onMouseMove, { passive: true });
                }

                /* Hero tilt card (mouse-controlled) */
                var heroSurface = document.querySelector('[data-hero-surface]');
                if (heroSurface && canHoverFine) {
                    var rafHero = 0;
                    var hx = 0, hy = 0, chx = 0, chy = 0;

                    function tickHero() {
                        rafHero = 0;
                        chx += (hx - chx) * 0.12;
                        chy += (hy - chy) * 0.12;
                        heroSurface.style.setProperty('--hry', (chx * 8).toFixed(3) + 'deg');
                        heroSurface.style.setProperty('--hrx', (chy * -6).toFixed(3) + 'deg');
                        heroSurface.style.setProperty('--htz', '6px');
                    }

                    function onHeroMove(ev) {
                        var rect = heroSurface.getBoundingClientRect();
                        var px = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
                        var py = ((ev.clientY - rect.top) / rect.height) * 2 - 1;
                        hx = clamp(px, -1, 1);
                        hy = clamp(py, -1, 1);
                        if (!rafHero) rafHero = requestAnimationFrame(tickHero);
                    }

                    function onHeroLeave() {
                        heroSurface.style.setProperty('--hry', '0deg');
                        heroSurface.style.setProperty('--hrx', '0deg');
                        heroSurface.style.setProperty('--htz', '0px');
                    }

                    heroSurface.addEventListener('mousemove', onHeroMove, { passive: true });
                    heroSurface.addEventListener('mouseleave', onHeroLeave, { passive: true });
                }
            }

            initSection3DBackgrounds();

            /*------------------------------------------
                = VANILLA TILT INITIALIZATION
            -------------------------------------------*/
            if ($("[data-tilt]").length) {
                VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
                    max: 10,
                    speed: 450,
                    glare: true,
                    "max-glare": 0.22,
                    scale: 1.03,
                    perspective: 900
                });
            }

            /*------------------------------------------
                = SKILLS DASHBOARD (3D CATEGORY CARDS)
            -------------------------------------------*/
            function initSkillsDashboard() {
                var skillsRoot = document.getElementById('skills');
                if (!skillsRoot) return;

                var dashboard = skillsRoot.querySelector('[data-skills-dashboard]');
                if (!dashboard) return;

                /** @type {NodeListOf<HTMLButtonElement>} */
                var buttons = dashboard.querySelectorAll('.skills-summary-grid button[data-skill-card]');
                if (!buttons.length) return;

                /** @type {HTMLElement | null} */
                var detailPanel = document.getElementById('skills-detail-panel');
                if (!detailPanel) return;
                if (!dashboard.contains(detailPanel)) return;

                /** @type {HTMLElement | null} */
                var summaryGrid = dashboard.querySelector('.skills-summary-grid');
                if (!summaryGrid) return;

                /** @type {HTMLElement | null} */
                var detailTitle = detailPanel.querySelector('[data-skill-detail-title]');
                /** @type {HTMLElement | null} */
                var detailMeta = detailPanel.querySelector('[data-skill-detail-meta]');
                /** @type {HTMLElement | null} */
                var detailList = detailPanel.querySelector('[data-skill-detail-list]');
                if (!detailTitle || !detailMeta || !detailList) return;

                /** @type {Record<string, HTMLTemplateElement>} */
                var logoTemplates = {};
                dashboard.querySelectorAll('template[data-skill-logo]').forEach(function(tpl) {
                    var key = tpl.getAttribute('data-skill-logo');
                    if (!key) return;
                    logoTemplates[key] = /** @type {HTMLTemplateElement} */ (tpl);
                });

                var categories = {
                    programming: {
                        title: 'Programming Languages',
                        summary: '1+ Programming Language',
                        skills: [
                            { key: 'python', name: 'Python' },
                            { key: 'sql', name: 'SQL' }
                        ]
                    },
                    analytics: {
                        title: 'Analytics Methods',
                        summary: '5+ Analytic Methods',
                        skills: [
                            { key: 'clean', name: 'Data Cleaning' },
                            { key: 'eda', name: 'Exploratory Data Analysis' },
                            { key: 'stats', name: 'Statistical Analysis' },
                            { key: 'interpret', name: 'Data Interpretation' },
                            { key: 'insight', name: 'Business Insight Extraction' }
                        ]
                    },
                    visualization: {
                        title: 'Visualization Tools',
                        summary: '2+ Visualization Tools',
                        skills: [
                            { key: 'powerbi', name: 'Power BI' },
                            { key: 'tableau', name: 'Tableau' }
                        ]
                    },
                    tools: {
                        title: 'Professional Tools',
                        summary: '6+ Professional Tools',
                        skills: [
                            { key: 'excel', name: 'Excel' },
                            { key: 'mysql', name: 'MySQL' },
                            { key: 'git', name: 'Git' },
                            { key: 'figma', name: 'Figma' },
                            { key: 'dash', name: 'Dashboard Development' },
                            { key: 'dataviz', name: 'Data Visualization' }
                        ]
                    }
                };

                function setPanelHeight(panel) {
                    // CSS reads this variable as the panel's animated max-height.
                    panel.style.setProperty('--panel-h', panel.scrollHeight + 'px');
                }

                function setActiveButton(activeButton) {
                    buttons.forEach(function(btn) {
                        var isActive = btn === activeButton;
                        btn.classList.toggle('is-active', isActive);
                        btn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
                    });
                }

                function clearActiveButtons() {
                    buttons.forEach(function(btn) {
                        btn.classList.remove('is-active');
                        btn.setAttribute('aria-expanded', 'false');
                    });
                }

                function closeDetailPanel() {
                    clearActiveButtons();
                    detailPanel.classList.remove('is-open');

                    // Place back under the grid when closing so layout stays consistent on desktop.
                    if (detailPanel.parentElement !== dashboard) {
                        dashboard.insertBefore(detailPanel, summaryGrid.nextSibling);
                    }

                    var onEnd = function(ev) {
                        if (ev.target !== detailPanel) return;
                        if (detailPanel.classList.contains('is-open')) return; // reopened before transition ended
                        detailPanel.hidden = true;
                        detailPanel.removeEventListener('transitionend', onEnd);
                    };
                    detailPanel.addEventListener('transitionend', onEnd);

                    // Fallback for reduced-motion / no-transition environments.
                    window.setTimeout(function() {
                        if (!detailPanel.classList.contains('is-open')) detailPanel.hidden = true;
                        detailPanel.removeEventListener('transitionend', onEnd);
                    }, 520);
                }

                function renderDetail(categoryKey) {
                    var payload = categories[categoryKey];
                    if (!payload) return;

                    detailTitle.textContent = payload.title;
                    detailMeta.textContent = payload.summary + ' • ' + payload.skills.length + ' items';
                    detailList.innerHTML = '';

                    payload.skills.forEach(function(skill) {
                        var li = document.createElement('li');
                        li.className = 'skills-detail__item';

                        var logo = document.createElement('span');
                        logo.className = 'skills-detail__logo';

                        var tpl = logoTemplates[skill.key];
                        if (tpl && tpl.content) {
                            logo.appendChild(tpl.content.cloneNode(true));
                        } else {
                            // Minimal fallback: a dot if no template exists.
                            logo.textContent = '•';
                        }

                        var name = document.createElement('span');
                        name.className = 'skills-detail__name';
                        name.textContent = skill.name;

                        li.appendChild(logo);
                        li.appendChild(name);
                        detailList.appendChild(li);
                    });
                }

                function openDetailPanel(categoryKey, activeButton) {
                    // On mobile we want the panel directly under the tapped card (accordion feel).
                    // On larger viewports, keep it under the full card grid.
                    if (window.matchMedia && window.matchMedia('(max-width: 575px)').matches) {
                        summaryGrid.insertBefore(detailPanel, activeButton.nextSibling);
                    } else {
                        dashboard.insertBefore(detailPanel, summaryGrid.nextSibling);
                    }

                    detailPanel.hidden = false;
                    renderDetail(categoryKey);
                    setPanelHeight(detailPanel);
                    requestAnimationFrame(function() {
                        detailPanel.classList.add('is-open');
                    });
                    setActiveButton(activeButton);
                }

                buttons.forEach(function(button) {
                    button.addEventListener('click', function() {
                        var categoryKey = button.getAttribute('data-skill-card');
                        if (!categoryKey) return;

                        var isActive = button.classList.contains('is-active');
                        if (isActive) {
                            closeDetailPanel();
                            return;
                        }

                        openDetailPanel(categoryKey, button);
                    });
                });

                /*------------------------------------------
                    = MOUSE-CONTROLLED 3D CARD CONTROLLER
                -------------------------------------------*/
                function initSkills3DController() {
                    // Desktop-only: fine pointer + hover capability.
                    if (!window.matchMedia) return;
                    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
                    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

                    var MAX_TILT = 9; // degrees
                    var LERP = 0.12; // smoothing factor

                    function clamp01(n) {
                        return Math.max(0, Math.min(1, n));
                    }

                    function lerp(a, b, t) {
                        return a + (b - a) * t;
                    }

                    /** @type {{card: HTMLElement, readRect: () => void, isHovering: () => boolean}[]} */
                    var activeStates = [];

                    function refreshActiveRects() {
                        activeStates.forEach(function(s) {
                            if (!s.isHovering()) return;
                            s.readRect();
                        });
                    }

                    window.addEventListener('scroll', refreshActiveRects, { passive: true });

                    buttons.forEach(function(card) {
                        /** @type {DOMRect | null} */
                        var rect = null;
                        var hovering = false;
                        var rafId = 0;

                        // Normalized pointer coords (0..1) + centered (-1..1)
                        var tx = 0.5, ty = 0.4;
                        var cx = 0.5, cy = 0.4;
                        var tmx = 0, tmy = 0;
                        var cmx = 0, cmy = 0;

                        // Motion state
                        var tLift = 0;
                        var cLift = 0;

                        // Cache depth layers inside this card.
                        /** @type {{el: HTMLElement, depth: number}[]} */
                        var layers = [];
                        card.querySelectorAll('[data-depth]').forEach(function(el) {
                            var d = parseFloat(el.getAttribute('data-depth') || '0') || 0;
                            layers.push({ el: /** @type {HTMLElement} */ (el), depth: d });

                            // Store base Z as a CSS var; we only animate X/Y parallax at runtime.
                            // Depth is intentionally subtle; keeping Z small reduces jitter and aliasing.
                            el.style.setProperty('--lz', Math.round(Math.min(20, Math.max(6, d))) + 'px');
                        });

                        function readRect() {
                            rect = card.getBoundingClientRect();
                        }

                        function setTargetsFromEvent(e) {
                            if (!rect) readRect();
                            if (!rect || rect.width === 0 || rect.height === 0) return;

                            var x = clamp01((e.clientX - rect.left) / rect.width);
                            var y = clamp01((e.clientY - rect.top) / rect.height);

                            tx = x;
                            ty = y;
                            tmx = (x - 0.5) * 2;
                            tmy = (y - 0.5) * 2;
                        }

                        function applyFrame() {
                            // Smoothly chase targets.
                            cx = lerp(cx, tx, LERP);
                            cy = lerp(cy, ty, LERP);
                            cmx = lerp(cmx, tmx, LERP);
                            cmy = lerp(cmy, tmy, LERP);
                            cLift = lerp(cLift, tLift, LERP);

                            var rx = (-cmy * MAX_TILT) * cLift; // degrees
                            var ry = (cmx * MAX_TILT) * cLift;  // degrees

                            // Lift forward, subtle translateY, and dynamic shadow shift.
                            card.style.setProperty('--rx', rx.toFixed(3) + 'deg');
                            card.style.setProperty('--ry', ry.toFixed(3) + 'deg');
                            card.style.setProperty('--ty', (-8 * cLift).toFixed(2) + 'px');
                            card.style.setProperty('--tz', (14 * cLift).toFixed(2) + 'px');

                            // Shadow shift follows the tilt; keep it soft and restrained.
                            card.style.setProperty('--sx', (-ry * 1.15).toFixed(2) + 'px');
                            card.style.setProperty('--sy', (rx * 1.25).toFixed(2) + 'px');

                            card.style.setProperty('--shine-x', (cx * 100).toFixed(2) + '%');
                            card.style.setProperty('--shine-y', (cy * 100).toFixed(2) + '%');

                            // Layer parallax: icon/text/stats drift slightly differently.
                            if (layers.length) {
                                layers.forEach(function(layer) {
                                    var amt = (layer.depth / 16) * 5.5 * cLift; // px at max tilt
                                    layer.el.style.setProperty('--lx', (cmx * amt).toFixed(2) + 'px');
                                    layer.el.style.setProperty('--ly', (cmy * amt).toFixed(2) + 'px');
                                });
                            }

                            // Continue animating while active or while returning to neutral.
                            if (hovering || cLift > 0.001) {
                                rafId = window.requestAnimationFrame(applyFrame);
                            } else {
                                // Reset to clean defaults (avoid stale inline vars after long sessions).
                                card.style.removeProperty('--rx');
                                card.style.removeProperty('--ry');
                                card.style.removeProperty('--ty');
                                card.style.removeProperty('--tz');
                                card.style.removeProperty('--sx');
                                card.style.removeProperty('--sy');
                                card.style.removeProperty('--shine-x');
                                card.style.removeProperty('--shine-y');
                                layers.forEach(function(layer) {
                                    layer.el.style.removeProperty('--lx');
                                    layer.el.style.removeProperty('--ly');
                                });
                                rafId = 0;
                            }
                        }

                        card.addEventListener('pointerenter', function(e) {
                            // Ignore touch-like pointers.
                            if (e.pointerType && e.pointerType !== 'mouse') return;
                            hovering = true;
                            tLift = 1;
                            card.classList.add('is-hovered');
                            readRect();
                            setTargetsFromEvent(e);
                            if (!rafId) rafId = window.requestAnimationFrame(applyFrame);

                            // Track for scroll-based rect refresh (single global listener).
                            var already = activeStates.some(function(s) { return s.card === card; });
                            if (!already) {
                                activeStates.push({
                                    card: card,
                                    readRect: readRect,
                                    isHovering: function() { return hovering; }
                                });
                            }
                        });

                        card.addEventListener('pointermove', function(e) {
                            if (!hovering) return;
                            if (e.pointerType && e.pointerType !== 'mouse') return;
                            setTargetsFromEvent(e);
                        });

                        card.addEventListener('pointerleave', function(e) {
                            if (e.pointerType && e.pointerType !== 'mouse') return;
                            hovering = false;
                            tLift = 0;
                            card.classList.remove('is-hovered');
                            // Re-center targets for a smooth return.
                            tx = 0.5; ty = 0.4;
                            tmx = 0; tmy = 0;
                            if (!rafId) rafId = window.requestAnimationFrame(applyFrame);
                        });
                    });
                }

                initSkills3DController();

                // Recalculate open panel heights on resize for responsive typography wrapping.
                var resizeTimer = 0;
                window.addEventListener('resize', function() {
                    window.clearTimeout(resizeTimer);
                    resizeTimer = window.setTimeout(function() {
                        if (!detailPanel.classList.contains('is-open')) return;

                        // Keep placement aligned with breakpoint changes.
                        var activeButton = dashboard.querySelector('.skills-summary-grid .skill3d-card.is-active');
                        if (activeButton && window.matchMedia && window.matchMedia('(max-width: 575px)').matches) {
                            summaryGrid.insertBefore(detailPanel, activeButton.nextSibling);
                        } else {
                            dashboard.insertBefore(detailPanel, summaryGrid.nextSibling);
                        }

                        setPanelHeight(detailPanel);
                    }, 150);
                });

                // Escape key closes the currently open panel (if focus is inside the dashboard).
                dashboard.addEventListener('keydown', function(e) {
                    if (e.key !== 'Escape') return;
                    var active = document.activeElement;
                    if (!active || !dashboard.contains(active)) return;
                    if (detailPanel.classList.contains('is-open')) closeDetailPanel();
                });

                // Start closed by default.
                detailPanel.hidden = true;
                detailPanel.classList.remove('is-open');
                clearActiveButtons();
            }

            initSkillsDashboard();

            // Terminal Typewriter Effect
            function initTypewriter() {
                const element = document.querySelector('.typewriter-terminal');
                if (!element) return;
                const text = element.getAttribute('data-text');
                if (!text) return;
                element.innerHTML = '';
                let i = 0;
                function type() {
                    if (i < text.length) {
                        element.innerHTML += text.charAt(i);
                        i++;
                        setTimeout(type, 30 + Math.random() * 50);
                    }
                }
                type();
            }

            $(window).on('load', function() {
                initTypewriter();
            });

            // Motion capability flags (used by optional interactions).
            const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const canHoverFinePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

            // Interactive Sound Effects (Synthesized)
            // Lazy-init AudioContext to avoid autoplay policy warnings and reduce startup cost.
            let audioCtx = null;
            function playBeep(freq = 440, duration = 0.05) {
                try {
                    const Ctx = window.AudioContext || window.webkitAudioContext;
                    if (!Ctx) return;
                    if (!audioCtx) {
                        audioCtx = new Ctx();
                    }
                    if (audioCtx.state === 'suspended') {
                        audioCtx.resume().catch(function() {});
                    }

                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                    gain.gain.setValueAtTime(0.045, audioCtx.currentTime);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start();
                    osc.stop(audioCtx.currentTime + duration);
                } catch (e) {
                    // No-op: audio is optional and should never break UI.
                }
            }

            if (!prefersReducedMotion && canHoverFinePointer) {
                $('.theme-btn, .nav div > ul > li > a, .glass-card').on('mouseenter', function() {
                    playBeep(880, 0.02);
                });
            }
        });




    /*==========================================================================
        WHEN WINDOW SCROLL
    ==========================================================================*/
    // Expert Scroll Progress Logic
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        $('.scroll-progress').css('width', progress + '%');
    }

    $(window).on("scroll", function() {

        if ($(".site-header").length) {
            stickIt($(".sticky-header"), "sticky-on");
        }

        updateScrollProgress();

        bgParallax();
        
        toggleBackToTopBtn();

    });




    /*==========================================================================
        WHEN WINDOW RESIZE
    ==========================================================================*/
    $(window).on("resize", function() {
        toggleClassForSmallNav();
        //smallNavFunctionality();

        clearTimeout($.data(this, 'resizeTimer'));
        $.data(this, 'resizeTimer', setTimeout(function() {
            smallNavFunctionality();
        }, 200));

    });


})(window.jQuery);
