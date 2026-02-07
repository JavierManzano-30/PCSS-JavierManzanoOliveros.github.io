// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile navigation toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const sectionMap = document.getElementById('section-map');
const mapLinks = document.querySelectorAll('[data-map-link]');
const pageSections = document.querySelectorAll('main section[id]');

function setActiveSection(id) {
    document.querySelectorAll('.nav-link').forEach((link) => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${id}`);
    });
    mapLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('data-map-link') === id);
    });
}

function getCurrentSectionId() {
    const navHeightValue = getComputedStyle(document.documentElement).getPropertyValue('--nav-height');
    const navHeight = parseFloat(navHeightValue) || 70;
    const probeY = window.scrollY + navHeight + (window.innerHeight * 0.28);

    let activeId = pageSections[0] ? pageSections[0].id : 'home';

    pageSections.forEach((section, index) => {
        const currentTop = section.offsetTop;
        const nextTop = pageSections[index + 1] ? pageSections[index + 1].offsetTop : Number.POSITIVE_INFINITY;
        if (probeY >= currentTop && probeY < nextTop) {
            activeId = section.id;
        }
    });

    return activeId;
}

function updateThemeToggle(theme) {
    if (!themeToggle) {
        return;
    }

    const isLight = theme === 'light';
    themeToggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
    themeToggle.setAttribute('aria-label', isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
    themeToggle.innerHTML = isLight
        ? '<i class="fas fa-moon" aria-hidden="true"></i>'
        : '<i class="fas fa-sun" aria-hidden="true"></i>';
}

function setTheme(theme, persist = true) {
    document.body.setAttribute('data-theme', theme);
    updateThemeToggle(theme);
    if (persist) {
        localStorage.setItem('theme', theme);
    }
}

if (themeToggle) {
    const storedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)');
    const initialTheme = storedTheme || (prefersLight && prefersLight.matches ? 'light' : 'dark');

    setTheme(initialTheme, false);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
    });

    if (!storedTheme && prefersLight) {
        prefersLight.addEventListener('change', (event) => {
            setTheme(event.matches ? 'light' : 'dark', false);
        });
    }
}

navToggle.addEventListener('click', () => {
    const isActive = navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isActive);
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.classList.remove('is-hidden');
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// Navbar state on scroll
const updateNavbarState = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) {
        return;
    }
    const currentScrollY = window.scrollY;

    navbar.classList.toggle('is-scrolled', currentScrollY > 50);
    navbar.classList.toggle('is-hidden', currentScrollY > 0);

    if (sectionMap) {
        sectionMap.classList.toggle('is-visible', currentScrollY > 180);
    }

    setActiveSection(getCurrentSectionId());
};

window.addEventListener('scroll', updateNavbarState);
window.addEventListener('resize', updateNavbarState);
updateNavbarState();

setActiveSection(getCurrentSectionId());

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Add animation classes to elements for scroll reveal
    const animateElements = document.querySelectorAll('.skill-category, .skill-info-item, .project-card, .about-content, .about-panel, .about-focus, .timeline-item, .milestone-card, .video-card, .subscribe-box, .contact-content, .youtube-hero');
    animateElements.forEach((el, index) => {
        el.classList.add('slide-up');
        if (index < 16) {
            el.style.transitionDelay = `${Math.min(index * 50, 320)}ms`;
        }
        observer.observe(el);
    });

});

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Simple validation
        if (!name || !email || !subject || !message) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, ingresa un email válido.');
            return;
        }

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Abriendo correo...';
        submitBtn.disabled = true;

        const mailBody = `Nombre: ${name}\nEmail: ${email}\n\n${message}`;
        const mailto = `mailto:jmanzano3010@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;
        window.location.href = mailto;

        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        this.reset();
    });
}
// Typing animation for hero title
function typeWriterHeading(element, prefixText, highlightText, speed = 100) {
    let i = 0;
    element.textContent = '';
    const textNode = document.createTextNode('');
    element.appendChild(textNode);

    function type() {
        if (i < prefixText.length) {
            textNode.textContent += prefixText.charAt(i);
            i++;
            setTimeout(type, speed);
            return;
        }

        if (highlightText) {
            const highlight = document.createElement('span');
            highlight.className = 'highlight';
            highlight.textContent = highlightText;
            element.appendChild(highlight);
        }
    }

    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const highlight = heroTitle.querySelector('.highlight');
        const highlightText = highlight ? highlight.textContent : '';
        const prefixText = highlight ? heroTitle.textContent.replace(highlightText, '') : heroTitle.textContent;
        typeWriterHeading(heroTitle, prefixText, highlightText, 50);
    }
});
// Parallax effect for hero section (desktop only)
function updateHeroParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) {
        return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.innerWidth >= 992;

    if (!isDesktop || reduceMotion) {
        hero.style.transform = 'none';
        return;
    }

    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.2;
    hero.style.transform = `translateY(${rate}px)`;
}

window.addEventListener('scroll', updateHeroParallax);
window.addEventListener('resize', updateHeroParallax);
updateHeroParallax();

// Add hover effects to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click effects to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple effect CSS
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add loading styles
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(loadingStyle);
