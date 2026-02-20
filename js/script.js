// ===========================
// LOADING SCREEN
// ===========================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 800);
        }, 600);
    }
});

// ===========================
// DOM ELEMENTS
// ===========================
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const navAnchors = document.querySelectorAll('.nav-links a');
const statNumbers = document.querySelectorAll('.stat-number');
const scrollProgress = document.getElementById('scrollProgress');
const cursorGlow = document.getElementById('cursorGlow');
const themeToggle = document.getElementById('themeToggle');

// ===========================
// DARK MODE TOGGLE
// ===========================
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}

// ===========================
// CURSOR GLOW EFFECT (Desktop)
// ===========================
if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();
}

// ===========================
// SCROLL PROGRESS BAR
// ===========================
function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    if (scrollProgress) {
        scrollProgress.style.width = progress + '%';
    }
}

// ===========================
// HEADER & SCROLL EFFECTS
// ===========================
window.addEventListener('scroll', () => {
    // Header scroll
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Back to top
    if (backToTop) {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    // Scroll progress
    updateScrollProgress();

    // Active nav
    updateActiveNav();
});

// ===========================
// MOBILE MENU
// ===========================
const navOverlay = document.getElementById('navOverlay');

function openMobileMenu() {
    hamburger.classList.add('active');
    navLinks.classList.add('open');
    if (navOverlay) navOverlay.classList.add('active');
    document.body.classList.add('nav-open');
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.classList.remove('nav-open');
}

if (hamburger) {
    hamburger.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
}

if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileMenu);
}

navAnchors.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

document.addEventListener('click', (e) => {
    if (hamburger && navLinks && !hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        closeMobileMenu();
    }
});

// ===========================
// ACTIVE NAV ON SCROLL
// ===========================
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navAnchors.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===========================
// ANIMATED COUNTERS
// ===========================
function animateCounters() {
    statNumbers.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2200;
        const startTime = performance.now();

        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const current = Math.floor(easedProgress * target);

            counter.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(updateCounter);
    });
}

// ===========================
// INTERSECTION OBSERVER - REVEAL
// ===========================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('[data-reveal]').forEach(el => {
    revealObserver.observe(el);
});

// Counter observer
const heroSection = document.querySelector('.hero');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

if (heroSection) {
    counterObserver.observe(heroSection);
}

// ===========================
// 3D TILT EFFECT ON CARDS
// ===========================
function initTiltCards() {
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -4;
            const rotateY = (x - centerX) / centerX * 4;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// Only enable tilt on desktop
if (window.matchMedia('(pointer: fine)').matches) {
    initTiltCards();
}

// ===========================
// CONTACT FORM HANDLING
// ===========================
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        if (!data.name || !data.phone || !data.service) {
            // Shake animation on button
            const btn = contactForm.querySelector('button[type="submit"]');
            btn.style.animation = 'none';
            void btn.offsetWidth; // Force reflow to restart animation
            btn.style.animation = 'shake 0.5s ease';
            setTimeout(() => btn.style.animation = '', 600);

            // Highlight empty required fields
            ['name', 'phone', 'service'].forEach(fieldId => {
                const field = contactForm.querySelector(`#${fieldId}`);
                if (field && !field.value) {
                    field.style.borderColor = '#ef4444';
                    setTimeout(() => field.style.borderColor = '', 2000);
                }
            });
            return;
        }

        const serviceName = contactForm.querySelector('#service option:checked')?.textContent || data.service;
        let message = `*New Appointment Request*\n\n`;
        message += `*Name:* ${data.name}\n`;
        message += `*Phone:* ${data.phone}\n`;
        if (data.email) message += `*Email:* ${data.email}\n`;
        if (data.vehicle) message += `*Vehicle:* ${data.vehicle}\n`;
        message += `*Service:* ${serviceName}\n`;
        if (data.message) message += `*Message:* ${data.message}\n`;

        const whatsappURL = `https://wa.me/94776635799?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');

        // Show success
        const formWrapper = contactForm.closest('.contact-form-wrapper');
        contactForm.style.display = 'none';

        const successDiv = document.createElement('div');
        successDiv.className = 'form-success show';
        successDiv.innerHTML = `
            <i class="fab fa-whatsapp" style="font-size: 56px; color: #25D366;"></i>
            <h3>Redirected to WhatsApp!</h3>
            <p>Your appointment details have been sent via WhatsApp. We'll respond shortly to confirm your booking.</p>
            <br>
            <button class="btn btn-primary btn-glow" onclick="resetForm()">
                <i class="fas fa-redo"></i> Submit Another
            </button>
        `;
        formWrapper.appendChild(successDiv);
    });
}

// Reset form global function
window.resetForm = function() {
    const formWrapper = document.querySelector('.contact-form-wrapper');
    const successDiv = formWrapper.querySelector('.form-success');
    if (successDiv) successDiv.remove();
    contactForm.style.display = 'block';
    contactForm.reset();
};

// ===========================
// SMOOTH SCROLL
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================
// MAGNETIC BUTTON EFFECT
// ===========================
if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.btn-glow').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-2px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

// ===========================
// PAGE LOAD
// ===========================
window.addEventListener('load', () => {
    if (heroSection && heroSection.getBoundingClientRect().top < window.innerHeight) {
        animateCounters();
    }
    updateScrollProgress();
});
