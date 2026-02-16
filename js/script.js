// ===========================
// LOADING SCREEN
// ===========================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 600);
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

// ===========================
// HEADER SCROLL EFFECT
// ===========================
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Back to top button
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    // Active nav link on scroll
    updateActiveNav();
});

// ===========================
// MOBILE MENU TOGGLE
// ===========================
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});

// Close menu when clicking a link
navAnchors.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    }
});

// ===========================
// ACTIVE NAV LINK ON SCROLL
// ===========================
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 100;

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
// ANIMATED COUNTER
// ===========================
function animateCounters() {
    statNumbers.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    });
}

// Intersection Observer for counter animation
const heroSection = document.querySelector('.hero');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (heroSection) {
    counterObserver.observe(heroSection);
}

// ===========================
// SCROLL REVEAL ANIMATION
// ===========================
const revealElements = document.querySelectorAll(
    '.service-card, .why-card, .process-step, .testimonial-card, .gallery-item, .contact-card, .about-content, .about-image'
);

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

// ===========================
// CONTACT FORM HANDLING
// ===========================
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Simple validation
        if (!data.name || !data.phone || !data.service) {
            alert('Please fill in all required fields.');
            return;
        }

        // Build WhatsApp message
        const serviceName = contactForm.querySelector('#service option:checked')?.textContent || data.service;
        let message = `*New Appointment Request*\n\n`;
        message += `*Name:* ${data.name}\n`;
        message += `*Phone:* ${data.phone}\n`;
        if (data.email) message += `*Email:* ${data.email}\n`;
        if (data.vehicle) message += `*Vehicle:* ${data.vehicle}\n`;
        message += `*Service:* ${serviceName}\n`;
        if (data.message) message += `*Message:* ${data.message}\n`;

        // Open WhatsApp with pre-filled message
        const whatsappURL = `https://wa.me/94776635799?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');

        // Show success message
        const formWrapper = contactForm.closest('.contact-form-wrapper');
        contactForm.style.display = 'none';

        const successDiv = document.createElement('div');
        successDiv.className = 'form-success show';
        successDiv.innerHTML = `
            <i class="fab fa-whatsapp" style="font-size: 48px; color: #25D366;"></i>
            <h3>Redirected to WhatsApp!</h3>
            <p>Your appointment details have been sent via WhatsApp. We'll respond shortly to confirm your booking.</p>
            <br>
            <button class="btn btn-primary" onclick="resetForm()">
                <i class="fas fa-redo"></i> Submit Another
            </button>
        `;
        formWrapper.appendChild(successDiv);
    });
}

function resetForm() {
    const formWrapper = document.querySelector('.contact-form-wrapper');
    const successDiv = formWrapper.querySelector('.form-success');
    if (successDiv) successDiv.remove();
    contactForm.style.display = 'block';
    contactForm.reset();
}

// ===========================
// SMOOTH SCROLL FOR ALL ANCHOR LINKS
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
// PAGE LOAD
// ===========================
window.addEventListener('load', () => {
    // Trigger initial counter if hero is visible
    if (heroSection && heroSection.getBoundingClientRect().top < window.innerHeight) {
        animateCounters();
    }
});
