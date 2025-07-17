// Custom JavaScript for JobAI Landing Page

document.addEventListener('DOMContentLoaded', function() {

    // Initialize scroll effects
    initScrollEffects();

    // Initialize animations
    initAnimations();

    // Initialize form handlers
    initFormHandlers();
});



// Initialize scroll effects
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
}

// Initialize animations
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Observe step cards
    const stepCards = document.querySelectorAll('.step-card');
    stepCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Initialize form handlers
function initFormHandlers() {
    // Handle CTA buttons
    const ctaButtons = document.querySelectorAll('.btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.textContent.includes('Get Started') || this.textContent.includes('Start Job Search')) {
                e.preventDefault();
                showSignupModal();
            } else if (this.textContent.includes('Learn More') || this.textContent.includes('How It Works')) {
                e.preventDefault();
                scrollToSection('how-it-works');
            }
        });
    });
}

// Utility function to scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Show signup modal (placeholder function)
function showSignupModal() {
    // This would typically open a modal or redirect to signup page
    alert('Signup functionality would be implemented here!\n\nThis would typically:\n- Open a signup modal\n- Redirect to registration page\n- Integrate with your authentication system');
}

// Add some interactive effects
document.addEventListener('mousemove', function(e) {
    const gradientCircle = document.querySelector('.gradient-circle');
    if (gradientCircle) {
        const rect = gradientCircle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * 0.01;
        const deltaY = (e.clientY - centerY) * 0.01;

        gradientCircle.style.transform = `translate(-50%, -50%) translate(${deltaX}px, ${deltaY}px)`;
    }
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');

    // Animate hero elements
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDescription = document.querySelector('.hero-description');
    const heroButtons = document.querySelector('.hero-buttons');

    if (heroTitle) {
        setTimeout(() => heroTitle.style.opacity = '1', 200);
        setTimeout(() => heroSubtitle.style.opacity = '1', 400);
        setTimeout(() => heroDescription.style.opacity = '1', 600);
        setTimeout(() => heroButtons.style.opacity = '1', 800);
    }
});

// Add some performance optimizations
let ticking = false;

function updateScrollEffects() {
    // Update scroll-based animations here
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Console welcome message
console.log(`
🚀 JobAI Landing Page Loaded Successfully!

Features:
- Responsive Bootstrap 5 design
- Smooth scrolling navigation
- Interactive animations
- Flask-ready navbar component
- Modern gradient effects
- Accessibility optimized

Built with ❤️ for your AI-powered job portal
`);