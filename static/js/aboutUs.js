class AboutUsPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupStatsCounter();
        this.setupTeamInteractions();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // Observar todos los elementos con clase fade-in
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Observar elementos de estadísticas
        document.querySelectorAll('.stat-item').forEach(el => {
            observer.observe(el);
        });
    }

    setupStatsCounter() {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.stat-item').forEach(stat => {
            statsObserver.observe(stat);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const numberElement = element.querySelector('.stat-number');
        const duration = 2000; // 2 segundos
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            // Formatear número con + si es necesario
            let displayValue = Math.floor(current);
            if (target >= 24) {
                numberElement.textContent = displayValue + '/7';
            } else {
                numberElement.textContent = displayValue + '+';
            }
        }, 16);

        element.classList.add('animate');
    }

    setupTeamInteractions() {
        // Agregar efectos de hover adicionales para las tarjetas del equipo
        document.querySelectorAll('.team-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Manejar clicks en enlaces sociales
        document.querySelectorAll('.social-link').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.href === '#') {
                    e.preventDefault();
                    this.showSocialMessage(link);
                }
            });
        });
    }

    showSocialMessage(link) {
        const socialType = link.classList[1]; // linkedin, twitter, etc.
        const memberCard = link.closest('.team-card');
        const memberName = memberCard.querySelector('.team-name').textContent;

        // Crear mensaje temporal
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            z-index: 1000;
            font-size: 16px;
            text-align: center;
        `;

        message.textContent = `Conecta con ${memberName} en ${socialType}`;
        document.body.appendChild(message);

        // Remover mensaje después de 2 segundos
        setTimeout(() => {
            document.body.removeChild(message);
        }, 2000);
    }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new AboutUsPage();
});

// Smooth scroll para enlaces internos
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