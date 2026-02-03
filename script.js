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
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// Navbar background change on scroll
const updateNavbarState = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) {
        return;
    }
    navbar.classList.toggle('is-scrolled', window.scrollY > 50);
};

window.addEventListener('scroll', updateNavbarState);
updateNavbarState();

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
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .stat, .about-content, .video-card, .subscribe-box, .contact-content, .youtube-hero');
    animateElements.forEach(el => {
        el.classList.add('slide-up');
        observer.observe(el);
    });

    const galleryButtons = document.querySelectorAll('[data-gallery]');
    const galleryModal = document.getElementById('gallery-modal');
    const galleryGrid = document.getElementById('gallery-grid');
    const galleryTitle = document.getElementById('gallery-title');

    const closeGallery = () => {
        if (!galleryModal) {
            return;
        }
        galleryModal.classList.remove('is-open');
        galleryModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
        if (galleryGrid) {
            galleryGrid.innerHTML = '';
        }
    };

    const openGallery = (button) => {
        if (!galleryModal || !galleryGrid) {
            return;
        }
        const images = button.getAttribute('data-images');
        if (!images) {
            return;
        }

        const title = button.getAttribute('data-gallery-title') || 'Demo';
        if (galleryTitle) {
            galleryTitle.textContent = title;
        }

        galleryGrid.innerHTML = '';
        images.split('|').forEach(url => {
            const trimmed = url.trim();
            if (!trimmed) {
                return;
            }
            const img = document.createElement('img');
            img.src = trimmed;
            img.alt = title;
            img.loading = 'lazy';
            galleryGrid.appendChild(img);
        });

        galleryModal.classList.add('is-open');
        galleryModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
    };

    galleryButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            openGallery(button);
        });
    });

    if (galleryModal) {
        galleryModal.addEventListener('click', (event) => {
            const target = event.target;
            if (target && target.matches('[data-gallery-close]')) {
                closeGallery();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeGallery();
        }
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
// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

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

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }
    
    updateCounter();
}

// Initialize counter animation when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat h3');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (number) {
                    animateCounter(stat, number);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutStats = document.querySelector('.about-stats');
if (aboutStats) {
    statsObserver.observe(aboutStats);
}

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



