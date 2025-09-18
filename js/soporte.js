// ===== GLOBAL VARIABLES =====
let mouseX = 0;
let mouseY = 0;
let isLoading = true;

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// ===== MAIN INITIALIZATION =====
function initializeWebsite() {
    // Initialize all components
    initLoader();
    initCustomCursor();
    initNavigation();
    initHeroAnimations();
    initServiceTabs();
    initCarousels();
    initFAQ();
    initContactForm();
    initScrollAnimations();
    initParallaxEffects();
    initMouseReactiveEffects();
    initScrollFunctionality(); // Nueva función para manejar todos los scrolls
}

// ===== LOADER FUNCTIONALITY =====
function initLoader() {
    const loader = document.getElementById('loader');
    const loadingText = document.getElementById('loading-text');
    
    const loadingMessages = [
        '[STD-TEC] Cargando módulos de soporte...'
    ];
    
    let messageIndex = 0;
    
    // Typewriter effect for loading messages
    function typewriterLoader() {
        if (messageIndex < loadingMessages.length) {
            const message = loadingMessages[messageIndex];
            loadingText.textContent = '';
            
            let charIndex = 0;
            const typeInterval = setInterval(() => {
                loadingText.textContent += message[charIndex];
                charIndex++;
                
                if (charIndex === message.length) {
                    clearInterval(typeInterval);
                    messageIndex++;
                    
                    setTimeout(() => {
                        if (messageIndex < loadingMessages.length) {
                            typewriterLoader();
                        } else {
                            // Hide loader after all messages
                            setTimeout(() => {
                                loader.classList.add('hidden');
                                isLoading = false;
                                startHeroAnimations();
                            }, 1000);
                        }
                    }, 800);
                }
            }, 100);
        }
    }
    
    // Start loader animation
    setTimeout(typewriterLoader, 500);
}

// ===== CUSTOM CURSOR =====
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    // Only initialize on desktop
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
            
            setTimeout(() => {
                cursorFollower.style.left = mouseX + 'px';
                cursorFollower.style.top = mouseY + 'px';
            }, 100);
        });
        
        // Hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .portfolio-item, .service-card, .client-item, .team-member, .faq-question');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorFollower.classList.add('hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorFollower.classList.remove('hover');
            });
        });
    }
}

// ===== NAVIGATION =====
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(17, 17, 17, 0.95)';
        } else {
            header.style.background = 'rgba(17, 17, 17, 0.9)';
        }
    });
    
    // Smooth scroll for navigation links (only internal links)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only prevent default for internal links (starting with #)
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    // Close mobile menu if open
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    
                    // Use the smoothScrollTo function from scroll functionality
                    const targetPosition = targetSection.offsetTop - 80;
                    const startPosition = window.pageYOffset;
                    const distance = targetPosition - startPosition;
                    const duration = 800;
                    let startTime = null;

                    function animation(currentTime) {
                        if (startTime === null) startTime = currentTime;
                        const timeElapsed = currentTime - startTime;
                        const progress = Math.min(timeElapsed / duration, 1);
                        const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
                        
                        window.scrollTo(0, startPosition + (distance * ease));
                        
                        if (timeElapsed < duration) {
                            requestAnimationFrame(animation);
                        }
                    }

                    requestAnimationFrame(animation);
                }
            }
            // External links (like index.html) will work normally
        });
    });
}

// ===== HERO ANIMATIONS =====
function initHeroAnimations() {
    const heroTypewriter = document.getElementById('hero-typewriter');
    const rotatingText = document.getElementById('rotating-text');
    
    const rotatingMessages = [
        'Reparamos tu tecnología',
        'Soporte especializado',
        'Mantenimiento preventivo',
        'Diagnóstico preciso',
        'Soluciones técnicas'
    ];
    
    let rotatingIndex = 0;
    
    // Typewriter effect for hero title
    function typewriterEffect(element, text, speed = 150) {
        element.textContent = '';
        let i = 0;
        
        const typeInterval = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            
            if (i >= text.length) {
                clearInterval(typeInterval);
            }
        }, speed);
    }
    
    // Start rotating text after loader finishes
    function startRotatingText() {
        setInterval(() => {
            rotatingText.style.opacity = '0';
            
            setTimeout(() => {
                rotatingIndex = (rotatingIndex + 1) % rotatingMessages.length;
                rotatingText.textContent = rotatingMessages[rotatingIndex];
                rotatingText.style.opacity = '1';
            }, 300);
        }, 4000);
    }
    
    window.startHeroAnimations = function() {
        // Start typewriter effect for hero title
        const heroText = heroTypewriter.textContent;
        typewriterEffect(heroTypewriter, heroText, 120);
        
        // Start rotating text after typewriter finishes
        setTimeout(() => {
            startRotatingText();
        }, heroText.length * 120 + 1000);
        
        createParticles();
    };
}

// ===== PARTICLE SYSTEM =====
function createParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = '#4ec9b0';
        particle.style.borderRadius = '50%';
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.pointerEvents = 'none';
        
        // Animate particles
        const duration = Math.random() * 10 + 10;
        particle.style.animation = `floatParticle ${duration}s infinite linear`;
        
        particlesContainer.appendChild(particle);
    }
    
    // Add CSS animation for particles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0% { transform: translateY(100vh) translateX(0); }
            100% { transform: translateY(-100px) translateX(${Math.random() * 200 - 100}px); }
        }
    `;
    document.head.appendChild(style);
}


// ===== FAQ ACCORDION =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active', !isActive);
        });
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    const form = document.getElementById('contact-form');
    const modal = document.getElementById('success-modal');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const subject = formData.get('subject').trim();
        const message = formData.get('message').trim();
        
        // Clear previous errors
        clearFormErrors();
        
        // Validate form
        let isValid = true;
        
        if (!name) {
            showFormError('name-error', 'El nombre es requerido');
            isValid = false;
        }
        
        if (!email) {
            showFormError('email-error', 'El email es requerido');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showFormError('email-error', 'Por favor ingresa un email válido');
            isValid = false;
        }
        
        if (!subject) {
            showFormError('subject-error', 'El asunto es requerido');
            isValid = false;
        }
        
        if (!message) {
            showFormError('message-error', 'El mensaje es requerido');
            isValid = false;
        }
        
        if (isValid) {
            // Simulate form submission
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span>Enviando...</span>';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Reset form
                form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show success modal
                showModal();
            }, 2000);
        }
    });
    
    function clearFormErrors() {
        const errors = document.querySelectorAll('.form-error');
        errors.forEach(error => error.textContent = '');
    }
    
    function showFormError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        errorElement.textContent = message;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showModal() {
        modal.classList.add('show');
    }
    
    // Global function to close modal
    window.closeModal = function() {
        modal.classList.remove('show');
    };
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section-title, .service-card, .about-card, .testimonial-card, .portfolio-item, .faq-item, .client-item, .team-member');
    
    // Add animate-on-scroll class to elements
    animatedElements.forEach(element => {
        element.classList.add('animate-on-scroll');
    });
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== PARALLAX EFFECTS =====
function initParallaxEffects() {
    const fogAnimation = document.querySelector('.fog-animation');
    
    window.addEventListener('mousemove', (e) => {
        if (!isLoading && fogAnimation) {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            
            fogAnimation.style.setProperty('--mouse-x', x + '%');
            fogAnimation.style.setProperty('--mouse-y', y + '%');
        }
    });
    
    // Parallax scroll effect for sections
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-bg');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ===== MOUSE REACTIVE EFFECTS =====
function initMouseReactiveEffects() {
    const interactiveElements = document.querySelectorAll('.service-card, .portfolio-item, .client-item, .team-member');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
    
    // Glow effect on hover
    const glowElements = document.querySelectorAll('.cta-button, .submit-btn, .carousel-btn');
    
    glowElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            element.style.setProperty('--glow-x', x + 'px');
            element.style.setProperty('--glow-y', y + 'px');
        });
    });
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Optimize scroll events
const optimizedScrollHandler = throttle(() => {
    // Handle scroll-based animations here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Optimize mouse move events
const optimizedMouseHandler = throttle((e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
}, 16); // ~60fps

window.addEventListener('mousemove', optimizedMouseHandler);

// ===== RESPONSIVE HANDLING =====
window.addEventListener('resize', debounce(() => {
    // Reinitialize components that need responsive updates
    if (window.innerWidth <= 768) {
        // Disable cursor effects on mobile
        document.body.style.cursor = 'auto';
    } else {
        // Re-enable cursor effects on desktop
        document.body.style.cursor = 'none';
    }
}, 250));

// ===== ACCESSIBILITY ENHANCEMENTS =====
document.addEventListener('keydown', (e) => {
    // ESC key closes modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('success-modal');
        if (modal.classList.contains('show')) {
            closeModal();
        }
        
        // Close mobile menu
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        if (navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// ===== PRELOAD OPTIMIZATION =====
function preloadCriticalResources() {
    // Preload fonts
    const fontLinks = [
        'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Inter:wght@300;400;500;600;700&display=swap'
    ];
    
    fontLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
}

// Initialize preloading
preloadCriticalResources();

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // Graceful degradation - ensure basic functionality works
});

// ===== SCROLL FUNCTIONALITY =====
function initScrollFunctionality() {
    // ===== CONFIGURACIÓN DE SCROLL =====
    const SCROLL_CONFIG = {
        // Velocidad del scroll suave (en milisegundos)
        scrollDuration: 800,
        // Offset para el scroll (espacio desde el top)
        scrollOffset: 80,
        // Punto donde aparece el botón "scroll to top" (en píxeles)
        showScrollTopAt: 300
    };

    // ===== ELEMENTOS DEL DOM =====
    const ctaButton = document.querySelector('.cta-button');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    const contactSection = document.getElementById('contacto');
    const heroSection = document.getElementById('inicio');

    // ===== FUNCIÓN DE SCROLL SUAVE =====
    function smoothScrollTo(targetElement, duration = SCROLL_CONFIG.scrollDuration) {
        if (!targetElement) return;

        const targetPosition = targetElement.offsetTop - SCROLL_CONFIG.scrollOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        // Función de easing para suavizar la animación
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // ===== BOTÓN "COMENZAR PROYECTO" -> CONTACTO =====
    if (ctaButton && contactSection) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            smoothScrollTo(contactSection);
        });
    }

    // ===== FLECHA DE SCROLL HACIA ABAJO =====
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', (e) => {
            e.preventDefault();
            // Scroll a la siguiente sección (servicios)
            const servicesSection = document.getElementById('servicios');
            if (servicesSection) {
                smoothScrollTo(servicesSection);
            }
        });
    }

    // ===== BOTÓN SCROLL TO TOP =====
    if (scrollToTopBtn && heroSection) {
        // Mostrar/ocultar botón según scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > SCROLL_CONFIG.showScrollTopAt) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        // Funcionalidad del botón
        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            smoothScrollTo(heroSection, SCROLL_CONFIG.scrollDuration);
        });
    }
}

// ===== SERVICE TABS FUNCTIONALITY =====
function initServiceTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Activate clicked button and corresponding content
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Reinitialize carousels for the active tab
            if (targetTab === 'particulares') {
                initSingleCarousel('services', 'services-track', 'services-dots');
            } else if (targetTab === 'empresas') {
                initSingleCarousel('services-enterprise', 'services-enterprise-track', 'services-enterprise-dots');
            }
        });
    });
}

// ===== CAROUSEL FUNCTIONALITY OPTIMIZADO =====
function initCarousels() {
    const carousels = ['services', 'services-enterprise', 'testimonials'];
    
    carousels.forEach(carouselName => {
        const track = document.getElementById(`${carouselName}-track`);
        const prevBtn = document.querySelector(`[data-carousel="${carouselName}"].prev`);
        const nextBtn = document.querySelector(`[data-carousel="${carouselName}"].next`);
        const dotsContainer = document.getElementById(`${carouselName}-dots`);
        
        if (!track) return;
        
        const cards = track.children;
        const cardCount = cards.length;
        let currentIndex = 0;

        // ===== CONFIGURACIÓN DEL SLIDER DE SERVICIOS =====
        if (carouselName === 'services' || carouselName === 'services-enterprise') {
            // Configurar servicios para mostrar múltiples por vista
            const SERVICES_CONFIG = {
                // Número de servicios visibles por vista (ajustar según necesidad)
                servicesPerView: {
                    desktop: 3,    // 3 servicios en desktop
                    tablet: 2,     // 2 servicios en tablet
                    mobile: 1      // 1 servicio en móvil
                },
                // Velocidad de autoplay (en milisegundos)
                autoplaySpeed: 5000
            };

            // Determinar servicios por vista según el tamaño de pantalla
            function getServicesPerView() {
                if (window.innerWidth > 1024) return SERVICES_CONFIG.servicesPerView.desktop;
                if (window.innerWidth > 768) return SERVICES_CONFIG.servicesPerView.tablet;
                return SERVICES_CONFIG.servicesPerView.mobile;
            }

            const servicesPerView = getServicesPerView();
            
            // Crear slides agrupando servicios según servicesPerView
            const slides = [];
            for (let i = 0; i < cardCount; i += servicesPerView) {
                const slideServices = Array.from(cards).slice(i, i + servicesPerView);
                slides.push(slideServices);
            }
            
            const totalSlides = slides.length;
            const maxIndex = totalSlides - 1;

            // Reorganizar el track con slides completos
            track.innerHTML = '';
            track.style.display = 'flex';
            track.style.transition = 'transform 0.5s ease';
            
            slides.forEach((slideServices, slideIndex) => {
                const slideContainer = document.createElement('div');
                slideContainer.className = 'services-slide';
                slideContainer.style.cssText = `
                    display: flex;
                    min-width: 100%;
                    flex: 0 0 100%;
                    gap: 1rem;
                    justify-content: ${slideServices.length < servicesPerView ? 'flex-start' : 'space-between'};
                    align-items: stretch;
                    box-sizing: border-box;
                `;
                
                slideServices.forEach(service => {
                    service.style.cssText = `
                        min-width: calc(${100 / servicesPerView}% - ${(servicesPerView - 1) * 1}rem / ${servicesPerView});
                        flex: 0 0 calc(${100 / servicesPerView}% - ${(servicesPerView - 1) * 1}rem / ${servicesPerView});
                        box-sizing: border-box;
                        margin: 0;
                    `;
                    slideContainer.appendChild(service);
                });
                
                // Agregar espacios vacíos si es necesario
                const emptySlots = servicesPerView - slideServices.length;
                for (let j = 0; j < emptySlots; j++) {
                    const emptySlot = document.createElement('div');
                    emptySlot.className = 'service-card-empty';
                    emptySlot.style.cssText = `
                        min-width: calc(${100 / servicesPerView}% - ${(servicesPerView - 1) * 1}rem / ${servicesPerView});
                        flex: 0 0 calc(${100 / servicesPerView}% - ${(servicesPerView - 1) * 1}rem / ${servicesPerView});
                        visibility: hidden;
                        box-sizing: border-box;
                    `;
                    slideContainer.appendChild(emptySlot);
                }
                
                track.appendChild(slideContainer);
            });

            function updateServicesCarousel() {
                const translateX = -(currentIndex * 100);
                track.style.transform = `translateX(${translateX}%)`;
                
                // Actualizar dots
                Array.from(dots).forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });

                // Actualizar estados activos de las slides
                const slideContainers = track.querySelectorAll('.services-slide');
                slideContainers.forEach((slide, index) => {
                    const serviceCards = slide.querySelectorAll('.service-card');
                    serviceCards.forEach(card => {
                        card.classList.toggle('active', index === currentIndex);
                    });
                });
            }

            function nextServicesSlide() {
                currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
                updateServicesCarousel();
            }

            function prevServicesSlide() {
                currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
                updateServicesCarousel();
            }

            // Crear dots para cada slide
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateServicesCarousel();
                });
                dotsContainer.appendChild(dot);
            }

            const dots = dotsContainer.children;

            // Event listeners para servicios
            if (nextBtn) nextBtn.addEventListener('click', nextServicesSlide);
            if (prevBtn) prevBtn.addEventListener('click', prevServicesSlide);

            // Inicializar carousel
            updateServicesCarousel();

            // Autoplay para servicios
            setInterval(nextServicesSlide, SERVICES_CONFIG.autoplaySpeed);

            // Responsive: recalcular en resize
            window.addEventListener('resize', () => {
                const newServicesPerView = getServicesPerView();
                if (newServicesPerView !== servicesPerView) {
                    location.reload(); // Recargar para reconfigurar
                }
            });

            return; // Salir para servicios, ya que tiene lógica especial
        }

        // ===== LÓGICA ESTÁNDAR PARA OTROS CAROUSELS =====
        // Crear dots
        for (let i = 0; i < cardCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
        
        const dots = dotsContainer.children;
        
        function updateCarousel() {
            const translateX = -currentIndex * 100;
            track.style.transform = `translateX(${translateX}%)`;
            
            // Update active states
            Array.from(cards).forEach((card, index) => {
                card.classList.toggle('active', index === currentIndex);
            });
            
            Array.from(dots).forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }
        
        function nextSlide() {
            currentIndex = (currentIndex + 1) % cardCount;
            updateCarousel();
        }
        
        function prevSlide() {
            currentIndex = (currentIndex - 1 + cardCount) % cardCount;
            updateCarousel();
        }
        
        // Event listeners
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        
        // Auto-play para testimonials
        if (carouselName === 'testimonials') {
            setInterval(nextSlide, 5000);
        }
    });
}


// ===== FINAL INITIALIZATION =====
console.log('STD TEC Website Initialized Successfully! 🚀');