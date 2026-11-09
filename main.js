document.addEventListener('DOMContentLoaded', function () {
    var loader = document.getElementById('loader');
    var hideLoader = function () {
        if (loader) {
            loader.classList.add('hidden');
        }
    };

    window.addEventListener('load', hideLoader, { once: true });
    if (document.readyState === 'complete') {
        hideLoader();
    }

    var navbar = document.getElementById('navbar');
    var updateNavbar = function () {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 20);
        }
    };
    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });

    var menu = document.getElementById('nav-menu') || document.getElementById('navMenu');
    var menuToggle = document.getElementById('hamburger') || document.getElementById('navToggle');
    if (menu && menuToggle) {
        var closeMenu = function () {
            menu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        };

        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.addEventListener('click', function () {
            var isOpen = menu.classList.toggle('active');
            menuToggle.classList.toggle('active', isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });

        menu.addEventListener('click', function (event) {
            if (event.target.closest('a')) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeMenu();
            }
        });
    }

    var animatedElements = document.querySelectorAll('.fade-in, .fade-in-right, .fade-in-left, .scale-in');
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries, currentObserver) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    currentObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(function (element) {
            observer.observe(element);
        });
    } else {
        animatedElements.forEach(function (element) {
            element.classList.add('visible');
        });
    }

    document.querySelectorAll('.counter[data-target]').forEach(function (counter) {
        var target = Number(counter.getAttribute('data-target'));
        if (!Number.isFinite(target)) {
            return;
        }

        var startCounting = function () {
            var startTime = null;
            var duration = 1800;
            var animateCount = function (timestamp) {
                if (startTime === null) {
                    startTime = timestamp;
                }
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var easedProgress = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(target * easedProgress).toLocaleString();
                if (progress < 1) {
                    window.requestAnimationFrame(animateCount);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };
            window.requestAnimationFrame(animateCount);
        };

        if ('IntersectionObserver' in window) {
            var countObserver = new IntersectionObserver(function (entries, currentObserver) {
                if (entries[0].isIntersecting) {
                    currentObserver.unobserve(counter);
                    startCounting();
                }
            }, { threshold: 0.5 });
            countObserver.observe(counter);
        } else {
            counter.textContent = target.toLocaleString();
        }
    });

    document.querySelectorAll('.faq-question').forEach(function (question, index) {
        var item = question.closest('.faq-item');
        var answer = item && item.querySelector('.faq-answer');
        if (!item || !answer) {
            return;
        }

        var answerId = answer.id || 'faq-answer-' + (index + 1);
        answer.id = answerId;
        question.setAttribute('role', 'button');
        question.setAttribute('tabindex', '0');
        question.setAttribute('aria-controls', answerId);
        question.setAttribute('aria-expanded', 'false');

        var toggleAnswer = function () {
            var isOpen = item.classList.toggle('active');
            question.setAttribute('aria-expanded', String(isOpen));
            answer.style.maxHeight = isOpen ? answer.scrollHeight + 'px' : '0';
        };

        question.addEventListener('click', toggleAnswer);
        question.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleAnswer();
            }
        });
    });
});
