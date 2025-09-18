// ====================================
// MÓDULO DE FOLIOS - STD TEC
// Sistema completo de gestión de folios de reparación
// ====================================

// Variables globales y estado de la aplicación
let currentFolio = null;        // Folio actualmente seleccionado para edición
let isEditMode = false;         // Indica si estamos en modo edición
let currentPage = 1;            // Página actual de la tabla paginada
let itemsPerPage = 10;          // Número de elementos por página
let sortColumn = 'folio';       // Columna por la cual ordenar
let sortDirection = 'asc';      // Dirección del ordenamiento (asc/desc)
let allFolios = [];             // Array que contiene todos los folios
let isLoading = true;           // Estado de carga de la aplicación

// ====================================
// CONFIGURACIÓN DE FIREBASE
// ====================================
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyApNsjc4xWWSC-LJs13dTe6_piukiyXSBA",
    authDomain: "stdfolios.firebaseapp.com",
    databaseURL: "https://stdfolios-default-rtdb.firebaseio.com", 
    projectId: "stdfolios",
    storageBucket: "stdfolios.firebasestorage.app",
    messagingSenderId: "461516592135",
    appId: "1:461516592135:web:0500c9be66c68103d8c6a2",
    measurementId: "G-8FEC3LEBG3"
};

// Variable para controlar si usar Firebase o localStorage
const USE_FIREBASE = true; 

// Variables globales de Firebase
let firebaseApp = null;
let firebaseDb = null;

// ====================================
// INICIALIZACIÓN PRINCIPAL
// ====================================
document.addEventListener('DOMContentLoaded', function() {
    // Ejecutar cuando el DOM esté completamente cargado
    initializeWebsite();
});

async function initializeWebsite() {
    // Inicializar Firebase
    await initializeFirebase();
    
    // Mostrar el texto del hero inmediatamente antes que todo lo demás
    const heroTypewriter = document.getElementById('hero-typewriter');
    if (heroTypewriter) {
        heroTypewriter.textContent = 'Gestión de Folios de Reparación';
        heroTypewriter.style.opacity = '1';
    }
    
    // Inicializar todos los componentes de la aplicación
    initLoader();                   // Pantalla de carga
    initCursor();                   // Cursor personalizado
    
    // Usar solo navegación simple por ahora
    setTimeout(() => {
        initSimpleNavigation();     // Navegación simple y segura
    }, 300);
    initHeroAnimations();           // Animaciones del hero (typewriter, partículas)
    initFoliosModule();             // Módulo principal de folios
    initScrollEffects();            // Efectos de scroll y animaciones
    initScrollFunctionality();      // Funcionalidad de scroll suave
    initParallaxEffects();          // Efectos parallax y mouse tracking
    initMouseReactiveEffects();     // Efectos reactivos al mouse
    initFormHandlers();             // Manejadores de formularios
    initEventListeners();           // Event listeners generales
    initTableFunctionality();       // Funcionalidad de tablas
    
    // Cargar datos iniciales
    await loadInitialData();
    
    // Marcar que la carga ha terminado
    isLoading = false;
}

// ====================================
// INICIALIZADORES DE COMPONENTES
// ====================================

function initCustomCursor() {
    // Obtener elementos del cursor personalizado
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    // Verificar que los elementos existan
    if (!cursor || !cursorFollower) return;
    
    // Variables para posición del mouse y seguidor
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;
    
    // Actualizar posición del mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Mover cursor principal inmediatamente
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });
    
    // Animación suave del cursor seguidor
    function animateFollower() {
        const distX = mouseX - followerX;
        const distY = mouseY - followerY;
        
        // Aplicar suavizado (0.1 = más suave, 1.0 = instantáneo)
        followerX += distX * 0.1;
        followerY += distY * 0.1;
        
        // Actualizar posición del seguidor
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        // Continuar animación
        requestAnimationFrame(animateFollower);
    }
    animateFollower();
    
    // Agregar efectos hover a elementos interactivos
    const hoverElements = document.querySelectorAll('a, button, .btn, [data-cursor-hover], .card, .portfolio-item');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        });
    });
}

function initHeroAnimations() {
    // Obtener elementos del hero para animaciones
    const heroTypewriter = document.getElementById('hero-typewriter');
    const rotatingText = document.getElementById('rotating-text');
    
    // Mensajes que rotan en el subtítulo del hero
    const rotatingMessages = [
        'Sistema profesional de folios',
        'Gestión eficiente de equipos',
        'Control total de reparaciones',
        'Seguimiento en tiempo real',
        'Tecnología avanzada'
    ];
    
    let rotatingIndex = 0; // Índice actual del mensaje rotativo
    
    // Efecto de máquina de escribir para el título
    function typewriterEffect(element, text, speed = 150) {
        element.textContent = ''; // Limpiar texto
        let i = 0;
        
        const typeInterval = setInterval(() => {
            element.textContent += text.charAt(i); // Agregar carácter por carácter
            i++;
            
            if (i >= text.length) {
                clearInterval(typeInterval); // Detener cuando termine
            }
        }, speed);
    }
    
    // Iniciar rotación de texto después de que termine el loader
    function startRotatingText() {
        setInterval(() => {
            rotatingText.style.opacity = '0'; // Desvanecer texto actual
            
            setTimeout(() => {
                // Cambiar al siguiente mensaje
                rotatingIndex = (rotatingIndex + 1) % rotatingMessages.length;
                rotatingText.textContent = rotatingMessages[rotatingIndex];
                rotatingText.style.opacity = '1'; // Mostrar nuevo texto
            }, 300);
        }, 4000); // Cambiar cada 4 segundos
    }
    
    // Función global para iniciar animaciones del hero
    window.startHeroAnimations = function() {
        // Mostrar texto del hero inmediatamente (sin esperar typewriter)
        if (heroTypewriter && heroTypewriter.textContent.trim() === '') {
            heroTypewriter.textContent = 'Gestión de Folios de Reparación';
        }
        
        // Iniciar efecto typewriter para el título
        const heroText = heroTypewriter.textContent;
        typewriterEffect(heroTypewriter, heroText, 120);
        
        // Iniciar texto rotativo después de que termine el typewriter
        setTimeout(() => {
            startRotatingText();
        }, heroText.length * 120 + 1000);
        
        // Crear sistema de partículas
        createParticles();
    };
}

// ===== SISTEMA DE PARTÍCULAS =====
function createParticles() {
    // Obtener contenedor de partículas
    const particlesContainer = document.querySelector('.particles-container');
    const particleCount = 50; // Número de partículas a crear
    
    // Crear cada partícula individualmente
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        
        // Configurar estilos de la partícula
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 1 + 'px';        // Tamaño aleatorio 1-5px
        particle.style.height = particle.style.width;               // Mantener forma circular
        particle.style.background = '#4ec9b0';                     // Color teal característico
        particle.style.borderRadius = '50%';                       // Hacer circular
        particle.style.opacity = Math.random() * 0.5 + 0.1;       // Opacidad aleatoria 0.1-0.6
        particle.style.left = Math.random() * 100 + '%';           // Posición horizontal aleatoria
        particle.style.top = Math.random() * 100 + '%';            // Posición vertical aleatoria
        particle.style.pointerEvents = 'none';                     // No interferir con clics
        
        // Configurar animación de flotación
        const duration = Math.random() * 10 + 10;                  // Duración aleatoria 10-20s
        particle.style.animation = `floatParticle ${duration}s infinite linear`;
        
        // Agregar partícula al contenedor
        particlesContainer.appendChild(particle);
    }
    
    // Agregar animación CSS para las partículas
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0% { transform: translateY(100vh) translateX(0); }
            100% { transform: translateY(-100px) translateX(${Math.random() * 200 - 100}px); }
        }
    `;
    document.head.appendChild(style);
}

// ===== EFECTOS PARALLAX =====
function initParallaxEffects() {
    // Obtener elemento de animación de niebla
    const fogAnimation = document.querySelector('.fog-animation');
    
    // Efecto de seguimiento del mouse para la luz de fondo
    window.addEventListener('mousemove', (e) => {
        if (!isLoading && fogAnimation) {
            // Calcular posición del mouse como porcentaje de la pantalla
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            
            // Actualizar variables CSS para mover el gradiente
            fogAnimation.style.setProperty('--mouse-x', x + '%');
            fogAnimation.style.setProperty('--mouse-y', y + '%');
        }
    });
    
    // Efecto parallax en el scroll para las secciones
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset; // Cantidad de scroll vertical
        const parallaxElements = document.querySelectorAll('.hero-bg');
        
        parallaxElements.forEach(element => {
            const speed = 0.5; // Velocidad del parallax (0.5 = mitad de velocidad del scroll)
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ===== EFECTOS REACTIVOS AL MOUSE =====
function initMouseReactiveEffects() {
    // Seleccionar elementos interactivos que tendrán efecto 3D
    const interactiveElements = document.querySelectorAll('.service-card, .portfolio-item, .client-item, .team-member');
    
    interactiveElements.forEach(element => {
        // Efecto 3D al mover el mouse sobre el elemento
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left; // Posición X relativa al elemento
            const y = e.clientY - rect.top;  // Posición Y relativa al elemento
            
            // Calcular centro del elemento
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calcular rotación basada en la distancia del centro
            const rotateX = (y - centerY) / 10; // Rotación en X (vertical)
            const rotateY = (centerX - x) / 10; // Rotación en Y (horizontal)
            
            // Aplicar transformación 3D
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        // Restaurar posición original al salir del elemento
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
    
    // Efecto glow que sigue al mouse en botones
    const glowElements = document.querySelectorAll('.cta-button, .submit-btn, .carousel-btn');
    
    glowElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left; // Posición X relativa al botón
            const y = e.clientY - rect.top;  // Posición Y relativa al botón
            
            // Actualizar variables CSS para posicionar el glow
            element.style.setProperty('--glow-x', x + 'px');
            element.style.setProperty('--glow-y', y + 'px');
        });
    });
}

function initFormHandlers() {
    // Initialize form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
    
    // Initialize date pickers if any
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) {
            input.value = new Date().toISOString().split('T')[0];
        }
    });
}

function initEventListeners() {
    // Add any global event listeners here
    document.addEventListener('click', (e) => {
        // Handle outside clicks for dropdowns/modals
        const dropdowns = document.querySelectorAll('.dropdown-menu.show');
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target) && !e.target.matches('[data-toggle="dropdown"]')) {
                dropdown.classList.remove('show');
            }
        });
    });
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

function initTableFunctionality() {
    // Initialize table sorting
    const sortableHeaders = document.querySelectorAll('th[data-sort]');
    sortableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.getAttribute('data-sort');
            sortTable(column);
        });
    });
    
    // Initialize row click handlers
    const tableRows = document.querySelectorAll('#folio-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', () => {
            const folioId = row.getAttribute('data-folio-id');
            if (folioId) {
                // Handle row click (e.g., show details)
                console.log('Selected folio:', folioId);
            }
        });
    });
}

async function loadInitialData() {
    // Load any initial data needed for the page
    allFolios = await getFolios();
    renderTable();
    renderSummary();
}

// ====================================
// LOADER
// ====================================
function initLoader() {
    const loader = document.getElementById('loader');
    const loadingText = document.getElementById('loading-text');
    
    const loadingMessages = [
        '[STD-TEC] Cargando módulos de folios...'
    ];
    
    let messageIndex = 0;
    
    // Typewriter effect for loading messages
    function typewriterLoader() {
        if (messageIndex < loadingMessages.length) {
            const message = loadingMessages[messageIndex];
            loadingText.textContent = '';
            
            let charIndex = 0;
            const typeInterval = setInterval(() => {
                loadingText.textContent += message.charAt(charIndex); // Agregar carácter por carácter
                charIndex++;
                
                if (charIndex >= message.length) {
                    clearInterval(typeInterval); // Detener cuando termine
                    messageIndex++;
                    
                    setTimeout(() => {
                        if (messageIndex < loadingMessages.length) {
                            typewriterLoader();
                        } else {
                            // Hide loader after all messages
                            setTimeout(() => {
                                loader.classList.add('hidden');
                                document.body.style.overflow = 'auto';
                                // Start hero animations after loader
                                setTimeout(() => {
                                    initHeroTypewriter();
                                }, 500);
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

function typewriterEffect(element, text, speed, callback) {
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    
    type();
}

// ====================================
// CUSTOM CURSOR
// ====================================
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });
    
    function animateFollower() {
        const dx = mouseX - followerX;
        const dy = mouseY - followerY;
        
        followerX += dx * 0.1;
        followerY += dy * 0.1;
        
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    
    animateFollower();
    
    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .portfolio-item');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            follower.classList.add('cursor-hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            follower.classList.remove('cursor-hover');
        });
    });
}

// ====================================
// NAVEGACIÓN (COPIADO DE MAIN.JS)
// ====================================
function initNavigation() {
    console.log('🔧 Intentando navegación principal...');
    
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');
    
    console.log('📱 Elementos:', { navToggle: !!navToggle, navMenu: !!navMenu });
    
    // Mobile menu toggle con verificación extra
    if (navToggle && navMenu) {
        console.log('✅ Configurando menú principal...');
        
        navToggle.addEventListener('click', function() {
            console.log('🍔 Click detectado');
            
            // Verificar que los elementos aún existen
            if (navToggle && navMenu) {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                console.log('📱 Menú toggled');
            }
        });
    } else {
        throw new Error('Elementos de navegación no encontrados');
    }
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navToggle) navToggle.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });
    
    // Header scroll effect
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(17, 17, 17, 0.95)';
            } else {
                header.style.background = 'rgba(17, 17, 17, 0.9)';
            }
        });
    }
    
    // Smooth scroll for navigation links (only internal links)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only prevent default for internal links (starting with #)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    // Close mobile menu if open
                    if (navToggle) navToggle.classList.remove('active');
                    if (navMenu) navMenu.classList.remove('active');
                    
                    // Smooth scroll animation
                    const targetPosition = targetSection.offsetTop - 80;
                    const startPosition = window.pageYOffset;
                    const distance = targetPosition - startPosition;
                    const duration = 800;
                    let start = null;
                    
                    function animation(currentTime) {
                        if (start === null) start = currentTime;
                        const timeElapsed = currentTime - start;
                        const run = ease(timeElapsed, startPosition, distance, duration);
                        window.scrollTo(0, run);
                        if (timeElapsed < duration) requestAnimationFrame(animation);
                    }
                    
                    function ease(t, b, c, d) {
                        t /= d / 2;
                        if (t < 1) return c / 2 * t * t + b;
                        t--;
                        return -c / 2 * (t * (t - 2) - 1) + b;
                    }
                    
                    requestAnimationFrame(animation);
                }
            }
        });
    });
}

// ====================================
// NAVEGACIÓN SIMPLE (FALLBACK)
// ====================================
function initSimpleNavigation() {
    console.log('🔧 Inicializando navegación simple...');
    
    // Función para intentar configurar el menú
    function trySetupMenu() {
        const toggle = document.getElementById('nav-toggle');
        const menu = document.getElementById('nav-menu');
        
        console.log('📱 Buscando elementos...', {
            toggle: !!toggle,
            menu: !!menu,
            toggleType: toggle ? toggle.tagName : 'null',
            menuType: menu ? menu.tagName : 'null'
        });
        
        if (toggle && menu) {
            console.log('✅ Elementos encontrados, configurando...');
            
            // Limpiar cualquier event listener previo
            toggle.onclick = null;
            
            // Configurar el toggle del menú
            toggle.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🍔 Click en menú detectado');
                
                try {
                    // Re-obtener elementos para asegurar que existen
                    const currentMenu = document.getElementById('nav-menu');
                    const currentToggle = document.getElementById('nav-toggle');
                    
                    if (currentMenu && currentToggle) {
                        if (currentMenu.classList.contains('active')) {
                            currentMenu.classList.remove('active');
                            currentToggle.classList.remove('active');
                            console.log('📱 Menú cerrado');
                        } else {
                            currentMenu.classList.add('active');
                            currentToggle.classList.add('active');
                            console.log('📱 Menú abierto');
                        }
                    } else {
                        console.error('❌ Elementos perdidos durante click');
                    }
                } catch (error) {
                    console.error('❌ Error en toggle:', error);
                }
            };
            
            // Configurar cierre en enlaces
            const links = document.querySelectorAll('.nav-link');
            console.log('🔗 Enlaces encontrados:', links.length);
            
            links.forEach((link, index) => {
                link.onclick = function(e) {
                    console.log('🔗 Click en enlace', index);
                    
                    try {
                        const currentMenu = document.getElementById('nav-menu');
                        const currentToggle = document.getElementById('nav-toggle');
                        
                        if (currentMenu) currentMenu.classList.remove('active');
                        if (currentToggle) currentToggle.classList.remove('active');
                    } catch (error) {
                        console.error('❌ Error cerrando menú:', error);
                    }
                };
            });
            
            console.log('✅ Navegación simple configurada exitosamente');
            return true;
        } else {
            console.warn('⚠️ Elementos no encontrados, reintentando...');
            return false;
        }
    }
    
    // Intentar configurar inmediatamente
    if (!trySetupMenu()) {
        // Si falla, reintentar después de 500ms
        setTimeout(() => {
            if (!trySetupMenu()) {
                // Si falla otra vez, reintentar después de 1000ms
                setTimeout(() => {
                    trySetupMenu();
                }, 1000);
            }
        }, 500);
    }
}

function smoothScrollTo(target) {
    const targetPosition = target.offsetTop - 80;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let start = null;
    
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = ease(timeElapsed, startPosition, distance, 1000);
        window.scrollTo(0, run);
        if (timeElapsed < 1000) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// ====================================
// HERO TYPEWRITER
// ====================================
function initHeroTypewriter() {
    const typewriterElement = document.getElementById('hero-typewriter');
    const rotatingElement = document.getElementById('rotating-text');
    
    if (typewriterElement) {
        // Clear initial text and start typewriter effect
        typewriterElement.textContent = '';
        const text = 'Gestión de Folios de Reparación';
        
        setTimeout(() => {
            let i = 0;
            const typeInterval = setInterval(() => {
                typewriterElement.textContent += text[i];
                i++;
                if (i >= text.length) {
                    clearInterval(typeInterval);
                    // Start rotating text after typewriter finishes
                    if (rotatingElement) {
                        startRotatingText();
                    }
                }
            }, 80);
        }, 1500); // Start after loader finishes
    }
    
    function startRotatingText() {
        const rotatingTexts = [
            'Sistema profesional de folios',
            'Control total de reparaciones',
            'Gestión eficiente de equipos',
            'Seguimiento en tiempo real'
        ];
        
        let currentIndex = 0;
        
        function rotateText() {
            rotatingElement.style.opacity = '0';
            setTimeout(() => {
                rotatingElement.textContent = rotatingTexts[currentIndex];
                rotatingElement.style.opacity = '1';
                currentIndex = (currentIndex + 1) % rotatingTexts.length;
            }, 300);
        }
        
        // Start rotating after a delay
        setTimeout(() => {
            setInterval(rotateText, 3000);
        }, 1000);
    }
}

// ====================================
// SCROLL EFFECTS
// ====================================
function initScrollEffects() {
    // Scroll to top button
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });
        
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ====================================
// MÓDULO PRINCIPAL DE FOLIOS
// Sistema completo de gestión de folios de reparación
// ====================================
function initFoliosModule() {
    // ===== ELEMENTOS DEL DOM - BOTONES =====
    const adminAccessBtn = document.getElementById('admin-access');           // Botón acceso administrador
    const publicSearchBtn = document.getElementById('public-search');         // Botón búsqueda pública
    const backToHomeBtn = document.getElementById('back-to-home');            // Botón volver al inicio
    const backToHomePublicBtn = document.getElementById('back-to-home-public'); // Botón volver (público)
    const adminLogoutBtn = document.getElementById('admin-logout');           // Botón cerrar sesión admin
    
    // ===== SECCIONES DE LA APLICACIÓN =====
    const foliosHomeSection = document.getElementById('folios-home');         // Sección principal de folios
    const adminLoginSection = document.getElementById('admin-login');         // Sección login administrador
    const adminPanelSection = document.getElementById('admin-panel');         // Panel de administración
    const publicSearchSection = document.getElementById('public-search-section'); // Sección búsqueda pública
    
    // ===== FORMULARIOS =====
    const adminLoginForm = document.getElementById('admin-login-form');       // Formulario login admin
    const publicSearchForm = document.getElementById('public-search-form');   // Formulario búsqueda pública
    const folioForm = document.getElementById('folio-form');                  // Formulario de folios
    
    // ===== ELEMENTOS DEL PANEL DE ADMINISTRACIÓN =====
    const newFolioBtn = document.getElementById('new-folio-btn');             // Botón nuevo folio
    const folioFormContainer = document.getElementById('folio-form-container'); // Contenedor formulario
    const cancelFormBtn = document.getElementById('cancel-form');             // Botón cancelar formulario
    const deleteFolioBtn = document.getElementById('delete-folio');           // Botón eliminar folio
    const clearFormBtn = document.getElementById('clear-form');               // Botón limpiar formulario
    const applyFiltersBtn = document.getElementById('apply-filters');         // Botón aplicar filtros
    const clearFiltersBtn = document.getElementById('clear-filters');         // Botón limpiar filtros
    
    // ===== FUNCIONES DE NAVEGACIÓN =====
    function showSection(sectionToShow) {
        // Ocultar todas las secciones
        const sections = [foliosHomeSection, adminLoginSection, adminPanelSection, publicSearchSection];
        sections.forEach(section => {
            if (section) section.style.display = 'none';
        });
        
        // Mostrar la sección solicitada y hacer scroll suave hacia ella
        if (sectionToShow) {
            sectionToShow.style.display = 'block';
            // Usar scroll suave si la función está disponible
            if (typeof smoothScrollTo === 'function') {
                smoothScrollTo(sectionToShow);
            } else {
                // Fallback a scroll nativo
                sectionToShow.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
    
    function goHome() {
        // Volver a la sección principal y limpiar formularios
        showSection(foliosHomeSection);
        clearForms();
    }
    
    // Event Listeners - Navigation
    if (adminAccessBtn) {
        adminAccessBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Check if already logged in
            if (sessionStorage.getItem('adminLoggedIn') === 'true') {
                loadAdminPanel();
                showSection(adminPanelSection);
            } else {
                showSection(adminLoginSection);
            }
        });
    }
    
    if (publicSearchBtn) {
        publicSearchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(publicSearchSection);
        });
    }
    
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', goHome);
    }
    
    if (backToHomePublicBtn) {
        backToHomePublicBtn.addEventListener('click', goHome);
    }
    
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('adminLoggedIn');
            goHome();
        });
    }
    
    // ===== EVENT LISTENERS - FORMULARIOS =====
    if (adminLoginForm) {
        console.log('✅ Formulario de login encontrado - Agregando event listener');
        console.log('📋 Formulario ID:', adminLoginForm.id);
        console.log('🔍 Botón submit del formulario:', adminLoginForm.querySelector('button[type="submit"]'));
        
        // Agregar event listener al formulario (no al botón)
        adminLoginForm.addEventListener('submit', handleAdminLogin);
        
        // También agregar event listener directo al botón como respaldo
        const submitButton = adminLoginForm.querySelector('button[type="submit"]');
        if (submitButton) {
            console.log('🔘 Agregando event listener directo al botón submit');
            submitButton.addEventListener('click', (e) => {
                console.log('🖱️ Click directo en botón submit detectado');
                // No prevenir default aquí, dejar que el formulario maneje el submit
            });
        }
    } else {
        console.error('❌ No se encontró el formulario de login de administrador');
    }
    
    if (publicSearchForm) {
        publicSearchForm.addEventListener('submit', handlePublicSearch);
    }
    
    if (folioForm) {
        folioForm.addEventListener('submit', handleFolioSubmit);
    }
    
    // Event Listeners - Admin Panel
    if (newFolioBtn) {
        newFolioBtn.addEventListener('click', () => {
            console.log('➕ Creando nuevo folio');
            
            // Limpiar estado y formulario
            isEditMode = false;
            currentFolio = null;
            clearForm();
            
            // Configurar formulario para nuevo folio
            document.getElementById('form-title').textContent = 'Nuevo Folio';
            const newFolioNumber = generateFolio();
            document.getElementById('folio-number').value = newFolioNumber;
            
            // Mostrar información del nuevo folio en el display
            const folioDisplay = document.getElementById('folio-number-display');
            if (folioDisplay) {
                const currentDate = new Date().toLocaleDateString('es-MX');
                folioDisplay.innerHTML = `
                    <div style="font-size: 0.9rem; color: var(--text-light);">
                        <div><strong>Nuevo Folio:</strong> ${newFolioNumber}</div>
                        <div><strong>Fecha:</strong> ${currentDate}</div>
                        <div style="color: var(--accent-teal);"><strong>Las fechas se asignan automáticamente</strong></div>
                    </div>
                `;
            }
            
            // Ocultar botón de eliminar y mostrar formulario
            deleteFolioBtn.style.display = 'none';
            folioFormContainer.style.display = 'block';
            
            // Hacer scroll suave al formulario
            if (typeof smoothScrollTo === 'function') {
                smoothScrollTo(folioFormContainer);
            } else {
                folioFormContainer.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    if (cancelFormBtn) {
        cancelFormBtn.addEventListener('click', () => {
            folioFormContainer.style.display = 'none';
            clearForm();
        });
    }
    
    // New: clear form without closing
    if (clearFormBtn) {
        clearFormBtn.addEventListener('click', () => {
            const folioNumberInput = document.getElementById('folio-number');
            const entryDateInput = document.getElementById('entry-date');
            const deliveryDateInput = document.getElementById('delivery-date');
            const currentFolioNumber = folioNumberInput ? folioNumberInput.value : '';
            
            // Reset all fields
            const form = document.getElementById('folio-form');
            if (form) form.reset();
            
            // Preserve or regenerate folio number, set dates
            if (folioNumberInput) {
                if (isEditMode && currentFolio) {
                    folioNumberInput.value = currentFolio.folio; // keep same folio when editing
                } else {
                    folioNumberInput.value = generateFolio();
                }
            }
            if (entryDateInput) entryDateInput.value = formatDateISO(new Date());
            if (deliveryDateInput) deliveryDateInput.value = '';
        });
    }
    
    if (deleteFolioBtn) {
        deleteFolioBtn.addEventListener('click', handleDeleteFolio);
    }
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', refreshTableWithFilters);
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            document.getElementById('filter-date-from').value = '';
            document.getElementById('filter-date-to').value = '';
            document.getElementById('filter-status').value = '';
            document.getElementById('filter-responsible').value = '';
            refreshTableWithFilters();
        });
    }
    
    // Advanced search event listeners
    const advancedSearchBtn = document.getElementById('advanced-search-btn');
    const clearAdvancedSearchBtn = document.getElementById('clear-advanced-search');
    
    if (advancedSearchBtn) {
        advancedSearchBtn.addEventListener('click', refreshTableWithFilters);
    }
    
    if (clearAdvancedSearchBtn) {
        clearAdvancedSearchBtn.addEventListener('click', () => {
            document.getElementById('search-folio-number').value = '';
            document.getElementById('search-client-name').value = '';
            document.getElementById('search-phone').value = '';
            document.getElementById('search-equipment').value = '';
            refreshTableWithFilters();
        });
    }
    
    // Real-time search on input
    const searchInputs = ['search-folio-number', 'search-client-name', 'search-phone', 'search-equipment'];
    searchInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', debounce(refreshTableWithFilters, 300));
        }
    });
    
    // ===== MANEJO DE CAMBIOS DE ESTATUS =====
    // Actualizar fecha de entrega automáticamente cuando cambie a "Entregado" o "Devuelto"
    const statusSelect = document.getElementById('status');
    if (statusSelect) {
        statusSelect.addEventListener('change', (e) => {
            console.log('📊 Cambio de estatus detectado:', e.target.value);
            
            // Para folios existentes, actualizar la fecha automáticamente
            if (currentFolio) {
                const currentDate = formatDateISO(new Date());
                
                if (e.target.value === 'Entregado' || e.target.value === 'Devuelto') {
                    if (!currentFolio.deliveryDate) {
                        currentFolio.deliveryDate = currentDate;
                        console.log('📅 Fecha de entrega actualizada automáticamente:', currentDate);
                    }
                } else if (e.target.value !== 'Entregado' && e.target.value !== 'Devuelto') {
                    // Limpiar fecha de entrega si cambia a otro estatus
                    currentFolio.deliveryDate = '';
                    console.log('🗑️ Fecha de entrega limpiada');
                }
            }
        });
    }
    
    // Check if admin is already logged in
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        // Don't auto-load admin panel, stay on home
    }
}

// ====================================
// LOGIN DE ADMINISTRADOR
// ====================================
async function handleAdminLogin(e) {
    e.preventDefault();
    console.log('🔐 Función handleAdminLogin ejecutada - Intentando login de administrador...');
    console.log('📝 Evento recibido:', e.type, 'desde:', e.target);
    
    // Obtener valores de los campos del formulario
    const emailField = document.getElementById('admin-email');
    const passwordField = document.getElementById('admin-password');
    
    if (!emailField || !passwordField) {
        console.error('❌ No se encontraron los campos de email o contraseña');
        alert('Error: No se pudieron encontrar los campos del formulario');
        return;
    }
    
    const email = emailField.value.trim();
    const password = passwordField.value.trim();
    
    console.log('📧 Email ingresado:', email);
    console.log('🔑 Contraseña ingresada:', password ? '***' : 'vacía');
    
    // Validar credenciales
    if (email === 'alejandromachucastdtec@gmail.com' && password === '41590902Ale$') {
        console.log('✅ Credenciales correctas - Iniciando sesión...');
        
        // Guardar estado de login
        sessionStorage.setItem('adminLoggedIn', 'true');
        
        // Cargar panel de administración
        loadAdminPanel();
        
        // Mostrar panel y ocultar login
        const adminPanel = document.getElementById('admin-panel');
        const adminLogin = document.getElementById('admin-login');
        
        if (adminPanel && adminLogin) {
            adminPanel.style.display = 'block';
            adminLogin.style.display = 'none';
            
            // Hacer scroll suave al panel
            if (typeof smoothScrollTo === 'function') {
                smoothScrollTo(adminPanel);
            } else {
                adminPanel.scrollIntoView({ behavior: 'smooth' });
            }
            
            console.log('🎉 Login exitoso - Panel de administración cargado');
        } else {
            console.error('❌ No se encontraron las secciones del panel o login');
        }
    } else {
        console.log('❌ Credenciales incorrectas');
        alert('Credenciales incorrectas. Intenta de nuevo.\n\nEmail: alejandromachucastdtec@gmail.com\nContraseña: 41590902Ale$');
    }
}

// ====================================
// PUBLIC SEARCH
// ====================================
async function handlePublicSearch(e) {
    e.preventDefault();
    
    const folioNumber = document.getElementById('search-folio').value.trim();
    const folios = await getFolios();
    const folio = folios.find(f => f.folio === folioNumber);
    
    const resultsDiv = document.getElementById('search-results');
    const errorDiv = document.getElementById('search-error');
    
    if (folio) {
        // Show results
        document.getElementById('result-folio').textContent = folio.folio;
        document.getElementById('result-status').textContent = folio.status;
        document.getElementById('result-status').className = `status-badge status-${folio.status.toLowerCase().replace(/\s+/g, '-')}`;
        document.getElementById('result-entry-date').textContent = folio.entryDate || 'No especificada';
        document.getElementById('result-delivery-date').textContent = folio.deliveryDate || 'Pendiente';
        
        resultsDiv.style.display = 'block';
        errorDiv.style.display = 'none';
    } else {
        // Show error
        resultsDiv.style.display = 'none';
        errorDiv.style.display = 'block';
    }
}

// ====================================
// ADMIN PANEL
// ====================================
async function loadAdminPanel() {
    renderSummary();
    renderTable();
}

async function renderSummary() {
    const folios = await getFolios();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyFolios = folios.filter(f => {
        const entryDate = new Date(f.entryDate);
        return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    });

    const totalFolios = monthlyFolios.length;
    const totalIncome = monthlyFolios.reduce((sum, f) => sum + (parseFloat(f.cost) || 0), 0);

    // Status counts (robust for any status labels)
    const statusCounts = monthlyFolios.reduce((acc, f) => {
        const key = (f.status || '').trim();
        if (!key) return acc;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    // Derived groups
    const entregados = statusCounts['Entregado'] || 0;
    const devueltos = statusCounts['Devuelto'] || statusCounts['Devueltos'] || 0;
    const garantia = statusCounts['Garantía'] || statusCounts['Garantia'] || 0;
    const enDiagnostico = statusCounts['En diagnóstico'] || statusCounts['En diagnostico'] || 0;
    const enReparacion = statusCounts['En reparación'] || statusCounts['En reparacion'] || 0;
    const esperandoRepuesto = statusCounts['Esperando repuesto'] || 0;
    const listos = statusCounts['Listo'] || 0;
    const recibidos = statusCounts['Recibido'] || 0;
    const enCurso = enDiagnostico + enReparacion + esperandoRepuesto;
    const pendientes = totalFolios - entregados;

    // Equipment types breakdown (top 4)
    const typeCounts = monthlyFolios.reduce((acc, f) => {
        const t = (f.equipmentType || 'Otro').trim();
        acc[t] = (acc[t] || 0) + 1;
        return acc;
    }, {});
    const topTypes = Object.entries(typeCounts).sort((a,b) => b[1]-a[1]).slice(0,4);

    const summaryContainer = document.getElementById('summary-cards');
    if (summaryContainer) {
        summaryContainer.innerHTML = `
            <div class="summary-card">
                <div class="summary-icon"><i class="fas fa-clipboard-list"></i></div>
                <div class="summary-content"><h3>${totalFolios}</h3><p>Folios este mes</p></div>
            </div>
            <div class="summary-card">
                <div class="summary-icon"><i class="fas fa-dollar-sign"></i></div>
                <div class="summary-content"><h3>$${totalIncome.toFixed(2)}</h3><p>Ingresos del mes</p></div>
            </div>
            <div class="summary-card">
                <div class="summary-icon"><i class="fas fa-check-circle"></i></div>
                <div class="summary-content"><h3>${entregados}</h3><p>Entregados</p></div>
            </div>
            <div class="summary-card">
                <div class="summary-icon"><i class="fas fa-tasks"></i></div>
                <div class="summary-content">
                    <h3>${enCurso}</h3><p>En curso</p>
                    <div class="status-breakdown">
                        <div class="item"><span>Diagnóstico: </span><span>${enDiagnostico}</span></div>
                        <div class="item"><span>Reparación: </span><span>${enReparacion}</span></div>
                        <div class="item"><span>Repuesto: </span><span>${esperandoRepuesto}</span></div>
                        <div class="item"><span>Listos: </span><span>${listos}</span></div>
                    </div>
                </div>
            </div>
            <div class="summary-card">
                <div class="summary-icon"><i class="fas fa-undo-alt"></i></div>
                <div class="summary-content"><h3>${devueltos}</h3><p>Devueltos</p></div>
            </div>
            <div class="summary-card">
                <div class="summary-icon"><i class="fas fa-shield-alt"></i></div>
                <div class="summary-content"><h3>${garantia}</h3><p>Garantía</p></div>
            </div>
            <div class="summary-card">
                <div class="summary-icon"><i class="fas fa-layer-group"></i></div>
                <div class="summary-content">
                    <h3>${pendientes}</h3><p>Pendientes</p>
                </div>
            </div>
        `;
    }
}

async function renderTable() {
    allFolios = await getFolios();
    renderPaginatedTable(allFolios);
}

function sortFolios(folios, column, direction) {
    return folios.sort((a, b) => {
        let aVal = a[column] || '';
        let bVal = b[column] || '';
        
        // Handle numeric values
        if (column === 'cost') {
            aVal = parseFloat(aVal) || 0;
            bVal = parseFloat(bVal) || 0;
        }
        
        // Handle dates
        if (column === 'entryDate' || column === 'deliveryDate') {
            aVal = new Date(aVal || 0);
            bVal = new Date(bVal || 0);
        }
        
        if (direction === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
}

function renderPaginatedTable(folios) {
    const tbody = document.getElementById('folio-table-body');
    if (!tbody) return;
    
    // Sort folios
    const sortedFolios = sortFolios([...folios], sortColumn, sortDirection);
    
    // Calculate pagination
    const totalItems = sortedFolios.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedFolios = sortedFolios.slice(startIndex, endIndex);
    
    // Clear table
    tbody.innerHTML = '';
    
    // Renderizar filas de la tabla
    paginatedFolios.forEach(folio => {
        const row = document.createElement('tr');
        
        // Agregar clase para indicar que es clickeable
        row.classList.add('clickable-row');
        row.style.cursor = 'pointer';
        
        row.innerHTML = `
            <td data-column="folio">${folio.folio}</td>
            <td data-column="name">${folio.name}</td>
            <td data-column="phone">${folio.phone}</td>
            <td data-column="equipmentDetail">${folio.equipmentDetail}</td>
            <td data-column="equipmentType">${folio.equipmentType}</td>
            <td data-column="responsible">${folio.responsible}</td>
            <td data-column="entryDate">${folio.entryDate || ''}</td>
            <td data-column="deliveryDate">${folio.deliveryDate || ''}</td>
            <td data-column="status"><span class="status-badge status-${folio.status.toLowerCase().replace(/\s+/g, '-')}">${folio.status}</span></td>
            <td data-column="cost">$${(parseFloat(folio.cost) || 0).toFixed(2)}</td>
        `;
        
        // Agregar evento de clic a la fila para editar
        row.addEventListener('click', () => {
            console.log('🖱️ Clic en fila detectado - Cargando folio:', folio.folio);
            loadToForm(folio);
        });
        
        // Agregar efecto hover
        row.addEventListener('mouseenter', () => {
            row.style.backgroundColor = 'rgba(78, 201, 176, 0.1)';
        });
        
        row.addEventListener('mouseleave', () => {
            row.style.backgroundColor = '';
        });
        
        tbody.appendChild(row);
    });
    
    // Ya no necesitamos event listeners para botones de edición
    // La edición se maneja directamente con el clic en la fila
    
    // Render pagination controls
    renderPaginationControls(totalPages, totalItems);
    
    // Update table headers with sort indicators
    updateSortHeaders();
}

function renderPaginationControls(totalPages, totalItems) {
    const tableContainer = document.querySelector('.table-container');
    if (!tableContainer) return;
    
    // Remove existing pagination
    const existingPagination = tableContainer.querySelector('.pagination-container');
    if (existingPagination) {
        existingPagination.remove();
    }
    
    if (totalPages <= 1) return;
    
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination-container';
    
    let paginationHTML = `
        <div class="pagination-info">
            Mostrando ${((currentPage - 1) * itemsPerPage) + 1} - ${Math.min(currentPage * itemsPerPage, totalItems)} de ${totalItems} folios
        </div>
        <div class="pagination-controls">
            <button class="btn btn-sm ${currentPage === 1 ? 'btn-disabled' : 'btn-secondary'}" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            paginationHTML += `
                <button class="btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-secondary'}" onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            paginationHTML += '<span class="pagination-ellipsis">...</span>';
        }
    }
    
    paginationHTML += `
            <button class="btn btn-sm ${currentPage === totalPages ? 'btn-disabled' : 'btn-secondary'}" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
        <div class="pagination-size">
            <select onchange="changePageSize(this.value)">
                <option value="10" ${itemsPerPage === 10 ? 'selected' : ''}>10 por página</option>
                <option value="25" ${itemsPerPage === 25 ? 'selected' : ''}>25 por página</option>
                <option value="50" ${itemsPerPage === 50 ? 'selected' : ''}>50 por página</option>
                <option value="100" ${itemsPerPage === 100 ? 'selected' : ''}>100 por página</option>
            </select>
        </div>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
    tableContainer.appendChild(paginationContainer);
}

function updateSortHeaders() {
    const headers = document.querySelectorAll('#folio-table th[data-sortable]');
    headers.forEach(header => {
        const column = header.getAttribute('data-sortable');
        header.classList.remove('sort-asc', 'sort-desc');
        
        if (column === sortColumn) {
            header.classList.add(sortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
        }
    });
}

// Global functions for pagination
window.changePage = function(page) {
    if (page >= 1 && page <= Math.ceil(allFolios.length / itemsPerPage)) {
        currentPage = page;
        renderPaginatedTable(allFolios);
    }
};

window.changePageSize = function(size) {
    itemsPerPage = parseInt(size);
    currentPage = 1;
    renderPaginatedTable(allFolios);
};

window.sortTable = function(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }
    currentPage = 1;
    renderPaginatedTable(allFolios);
};

async function refreshTableWithFilters() {
    const dateFrom = document.getElementById('filter-date-from').value;
    const dateTo = document.getElementById('filter-date-to').value;
    const status = document.getElementById('filter-status').value;
    const responsible = document.getElementById('filter-responsible').value;
    
    // Advanced search filters
    const searchFolio = document.getElementById('search-folio-number')?.value.toLowerCase() || '';
    const searchName = document.getElementById('search-client-name')?.value.toLowerCase() || '';
    const searchPhone = document.getElementById('search-phone')?.value.toLowerCase() || '';
    const searchEquipment = document.getElementById('search-equipment')?.value.toLowerCase() || '';
    
    let folios = await getFolios();
    
    // Apply date filters
    if (dateFrom) {
        folios = folios.filter(f => f.entryDate >= dateFrom);
    }
    if (dateTo) {
        folios = folios.filter(f => f.entryDate <= dateTo);
    }
    
    // Apply dropdown filters
    if (status) {
        folios = folios.filter(f => f.status === status);
    }
    if (responsible) {
        folios = folios.filter(f => f.responsible === responsible);
    }
    
    // Apply advanced search filters
    if (searchFolio) {
        folios = folios.filter(f => f.folio.toLowerCase().includes(searchFolio));
    }
    if (searchName) {
        folios = folios.filter(f => f.name.toLowerCase().includes(searchName));
    }
    if (searchPhone) {
        folios = folios.filter(f => f.phone.toLowerCase().includes(searchPhone));
    }
    if (searchEquipment) {
        folios = folios.filter(f => 
            f.equipmentDetail.toLowerCase().includes(searchEquipment) ||
            f.equipmentType.toLowerCase().includes(searchEquipment)
        );
    }
    
    // Reset pagination and render
    currentPage = 1;
    allFolios = folios;
    renderPaginatedTable(folios);
}

// ====================================
// FOLIO FORM MANAGEMENT
// ====================================
function clearForm() {
    console.log('🧹 Limpiando formulario de folios');
    
    // Resetear el formulario
    const form = document.getElementById('folio-form');
    if (form) {
        form.reset();
    }
    
    // Limpiar variables de estado
    isEditMode = false;
    currentFolio = null;
    
    // Actualizar título del formulario
    const formTitle = document.getElementById('form-title');
    if (formTitle) {
        formTitle.textContent = 'Nuevo Folio';
    }
    
    // Limpiar display del número de folio
    const folioDisplay = document.getElementById('folio-number-display');
    if (folioDisplay) {
        folioDisplay.innerHTML = '';
    }
    
    // Ocultar botón de eliminar
    const deleteBtn = document.getElementById('delete-folio');
    if (deleteBtn) {
        deleteBtn.style.display = 'none';
    }
    
    // Limpiar resultados de búsqueda
    const resultsDiv = document.getElementById('search-results');
    const errorDiv = document.getElementById('search-error');
    if (resultsDiv) resultsDiv.style.display = 'none';
    if (errorDiv) errorDiv.style.display = 'none';
}

function clearForms() {
    clearForm();
    const adminLoginForm = document.getElementById('admin-login-form');
    const publicSearchForm = document.getElementById('public-search-form');
    if (adminLoginForm) adminLoginForm.reset();
    if (publicSearchForm) publicSearchForm.reset();
}

function loadToForm(folio) {
    console.log('📝 Cargando folio al formulario:', folio.folio);
    
    isEditMode = true;
    currentFolio = folio;
    
    // Actualizar título del formulario
    document.getElementById('form-title').textContent = 'Editar Folio';
    
    // Cargar datos del folio al formulario
    document.getElementById('folio-number').value = folio.folio;
    document.getElementById('client-name').value = folio.name;
    document.getElementById('client-phone').value = folio.phone;
    document.getElementById('equipment-detail').value = folio.equipmentDetail;
    document.getElementById('equipment-type').value = folio.equipmentType;
    document.getElementById('responsible').value = folio.responsible;
    document.getElementById('status').value = folio.status;
    document.getElementById('cost').value = folio.cost || '';
    document.getElementById('report').value = folio.report || '';
    
    // Mostrar información de fechas en el display del número de folio
    const folioDisplay = document.getElementById('folio-number-display');
    if (folioDisplay) {
        const entryDate = folio.entryDate ? new Date(folio.entryDate).toLocaleDateString('es-MX') : 'No definida';
        const deliveryDate = folio.deliveryDate ? new Date(folio.deliveryDate).toLocaleDateString('es-MX') : 'Pendiente';
        
        folioDisplay.innerHTML = `
            <div style="font-size: 0.9rem; color: var(--text-light);">
                <div><strong>Folio:</strong> ${folio.folio}</div>
                <div><strong>Ingreso:</strong> ${entryDate}</div>
                <div><strong>Entrega:</strong> ${deliveryDate}</div>
            </div>
        `;
    }
    
    // Mostrar botón de eliminar y el formulario
    document.getElementById('delete-folio').style.display = 'inline-block';
    document.getElementById('folio-form-container').style.display = 'block';
    
    // Hacer scroll suave al formulario
    const formContainer = document.getElementById('folio-form-container');
    if (typeof smoothScrollTo === 'function') {
        smoothScrollTo(formContainer);
    } else {
        formContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

async function handleFolioSubmit(e) {
    e.preventDefault();
    
    // Validate form data
    const validationErrors = validateFolioForm();
    if (validationErrors.length > 0) {
        alert('Por favor corrige los siguientes errores:\n' + validationErrors.join('\n'));
        return;
    }
    
    // Obtener datos del formulario
    const status = document.getElementById('status').value;
    const currentDate = formatDateISO(new Date());
    
    const folioData = {
        folio: document.getElementById('folio-number').value.trim(),
        name: document.getElementById('client-name').value.trim(),
        phone: document.getElementById('client-phone').value.trim(),
        equipmentDetail: document.getElementById('equipment-detail').value.trim(),
        equipmentType: document.getElementById('equipment-type').value,
        responsible: document.getElementById('responsible').value,
        status: status,
        cost: parseFloat(document.getElementById('cost').value) || 0,
        report: document.getElementById('report').value.trim()
    };
    
    // ===== MANEJO AUTOMÁTICO DE FECHAS =====
    if (isEditMode && currentFolio) {
        // Para folios existentes, mantener fecha de ingreso original
        folioData.entryDate = currentFolio.entryDate;
        
        // Actualizar fecha de entrega automáticamente si cambia a "Entregado" o "Devuelto"
        if ((status === 'Entregado' || status === 'Devuelto') && !currentFolio.deliveryDate) {
            folioData.deliveryDate = currentDate;
            console.log('📅 Fecha de entrega actualizada automáticamente:', currentDate);
        } else if (status !== 'Entregado' && status !== 'Devuelto') {
            folioData.deliveryDate = ''; // Limpiar fecha si no está entregado/devuelto
        } else {
            folioData.deliveryDate = currentFolio.deliveryDate; // Mantener fecha existente
        }
    } else {
        // Para folios nuevos, establecer fecha de ingreso automáticamente
        folioData.entryDate = currentDate;
        
        // Solo establecer fecha de entrega si ya está marcado como entregado/devuelto
        if (status === 'Entregado' || status === 'Devuelto') {
            folioData.deliveryDate = currentDate;
        } else {
            folioData.deliveryDate = '';
        }
        
        console.log('📅 Nuevo folio - Fecha de ingreso:', currentDate);
    }
    
    let folios = await getFolios();
    
    if (isEditMode && currentFolio) {
        // Update existing folio
        const index = folios.findIndex(f => f.folio === currentFolio.folio);
        if (index !== -1) {
            folios[index] = folioData;
        }
    } else {
        // Check for duplicate folio numbers
        if (folios.some(f => f.folio === folioData.folio)) {
            alert('Ya existe un folio con ese número');
            return;
        }
        
        // Add new folio
        folios.push(folioData);
        
        // Update counter
        const counters = await getCounters();
        const monthKey = getMonthKey();
        counters[monthKey] = (counters[monthKey] || 0) + 1;
        await saveCounters(counters);
    }
    
    await saveFolios(folios);
    renderTable();
    renderSummary();
    
    document.getElementById('folio-form-container').style.display = 'none';
    clearForm();
    
    alert(isEditMode ? 'Folio actualizado exitosamente' : 'Folio creado exitosamente');
}

function validateFolioForm() {
    const errors = [];
    
    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const equipmentDetail = document.getElementById('equipment-detail').value.trim();
    const equipmentType = document.getElementById('equipment-type').value;
    const responsible = document.getElementById('responsible').value;
    const cost = document.getElementById('cost').value;
    
    if (!name) {
        errors.push('- El nombre del cliente es obligatorio');
    } else if (name.length < 2) {
        errors.push('- El nombre debe tener al menos 2 caracteres');
    }
    
    if (!phone) {
        errors.push('- El teléfono es obligatorio');
    } else if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
        errors.push('- El teléfono debe tener 10 dígitos');
    }
    
    if (!equipmentDetail) {
        errors.push('- El detalle del equipo es obligatorio');
    } else if (equipmentDetail.length < 5) {
        errors.push('- El detalle del equipo debe ser más descriptivo');
    }
    
    if (!equipmentType) {
        errors.push('- Debe seleccionar un tipo de equipo');
    }
    
    if (!responsible) {
        errors.push('- Debe asignar un responsable');
    }
    
    if (cost && (isNaN(cost) || parseFloat(cost) < 0)) {
        errors.push('- El costo debe ser un número válido mayor o igual a 0');
    }
    
    return errors;
}

function showSuccessMessage(message) {
    // Create a temporary success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

async function handleDeleteFolio() {
    if (!currentFolio) return;
    
    if (confirm('¿Estás seguro de que deseas eliminar este folio?')) {
        let folios = await getFolios();
        folios = folios.filter(f => f.folio !== currentFolio.folio);
        await saveFolios(folios);
        
        renderTable();
        renderSummary();
        
        document.getElementById('folio-form-container').style.display = 'none';
        clearForm();
        
        alert('Folio eliminado exitosamente');
    }
}

// ====================================
// LOCAL STORAGE HELPERS
// ====================================
async function getFolios() {
    if (USE_FIREBASE && firebaseDb) {
        try {
            console.log('🔥 Obteniendo folios desde Firebase...');
            const snapshot = await firebaseDb.ref('folios').once('value');
            const folios = snapshot.val();
            return folios ? Object.values(folios) : [];
        } catch (error) {
            console.error('❌ Error obteniendo folios de Firebase:', error);
            console.log('🔄 Fallback a localStorage');
        }
    }
    
    // Fallback a localStorage
    const folios = localStorage.getItem('stdtec_folios');
    return folios ? JSON.parse(folios) : [];
}

async function saveFolios(folios) {
    // Siempre guardar en localStorage como respaldo
    localStorage.setItem('stdtec_folios', JSON.stringify(folios));
    
    if (USE_FIREBASE && firebaseDb) {
        try {
            console.log('🔥 Guardando folios en Firebase...');
            
            // Convertir array a objeto con folio como key
            const foliosObject = {};
            folios.forEach(folio => {
                foliosObject[folio.folio] = folio;
            });
            
            await firebaseDb.ref('folios').set(foliosObject);
            console.log('✅ Folios guardados en Firebase');
        } catch (error) {
            console.error('❌ Error guardando folios en Firebase:', error);
            console.log('💾 Datos guardados en localStorage como respaldo');
        }
    }
}

async function getCounters() {
    if (USE_FIREBASE && firebaseDb) {
        try {
            console.log('🔥 Obteniendo contadores desde Firebase...');
            const snapshot = await firebaseDb.ref('counters').once('value');
            const counters = snapshot.val();
            return counters || {};
        } catch (error) {
            console.error('❌ Error obteniendo contadores de Firebase:', error);
            console.log('🔄 Fallback a localStorage');
        }
    }
    
    // Fallback a localStorage
    const counters = localStorage.getItem('stdtec_folio_counters');
    return counters ? JSON.parse(counters) : {};
}

async function saveCounters(counters) {
    // Siempre guardar en localStorage como respaldo
    localStorage.setItem('stdtec_folio_counters', JSON.stringify(counters));
    
    if (USE_FIREBASE && firebaseDb) {
        try {
            console.log('🔥 Guardando contadores en Firebase...');
            await firebaseDb.ref('counters').set(counters);
            console.log('✅ Contadores guardados en Firebase');
        } catch (error) {
            console.error('❌ Error guardando contadores en Firebase:', error);
            console.log('💾 Datos guardados en localStorage como respaldo');
        }
    }
}

// ====================================
// FOLIO GENERATION
// ====================================
function pad(num, size) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

function monthAbbr(month) {
    const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 
                   'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    return months[month];
}

function yytwo(year) {
    return year.toString().slice(-2);
}

function getMonthKey() {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth()}`;
}

function generateFolio() {
    const now = new Date();
    const month = monthAbbr(now.getMonth());
    const year = yytwo(now.getFullYear());
    
    const counters = getCounters();
    const monthKey = getMonthKey();
    const currentCount = (counters[monthKey] || 0) + 1;
    
    return `STD-${month}-${year}-${pad(currentCount, 3)}`;
}

function formatDateISO(date) {
    return date.toISOString().split('T')[0];
}

// ====================================
// FUNCIONALIDAD DE SCROLL SUAVE
// ====================================
function initScrollFunctionality() {
    // ===== CONFIGURACIÓN DE SCROLL =====
    const SCROLL_CONFIG = {
        scrollDuration: 800,        // Duración de la animación en milisegundos
        scrollOffset: 80,           // Offset desde el top (para header fijo)
        showScrollTopAt: 300        // Píxeles de scroll para mostrar botón "volver arriba"
    };

    // ===== ELEMENTOS DEL DOM =====
    const ctaButtons = document.querySelectorAll('.cta-button');           // Todos los botones CTA
    const scrollIndicator = document.querySelector('.scroll-indicator');   // Indicador de scroll del hero
    const scrollToTopBtn = document.getElementById('scroll-to-top');       // Botón volver arriba
    const heroSection = document.getElementById('inicio');                 // Sección hero

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

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // ===== BOTONES CTA CON SCROLL =====
    ctaButtons.forEach(button => {
        // Excluir botones de tipo submit que están dentro de formularios
        if (button.type === 'submit' || button.closest('form')) {
            console.log('⏭️ Saltando botón de formulario:', button);
            return; // No agregar scroll a botones de formulario
        }
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            let targetId;
            
            // Si es un enlace con href
            if (button.tagName === 'A') {
                targetId = button.getAttribute('data-target') || button.getAttribute('href').substring(1);
            } 
            // Si es un botón, usar folios-home por defecto
            else if (button.tagName === 'BUTTON') {
                targetId = 'folios-home';
            }
            
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                smoothScrollTo(targetSection);
            }
        });
    });

    // ===== FLECHA DE SCROLL HACIA ABAJO =====
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', (e) => {
            e.preventDefault();
            const foliosSection = document.getElementById('folios-home');
            if (foliosSection) {
                smoothScrollTo(foliosSection);
            }
        });
    }

    // ===== BOTÓN SCROLL TO TOP =====
    if (scrollToTopBtn && heroSection) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > SCROLL_CONFIG.showScrollTopAt) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            smoothScrollTo(heroSection, SCROLL_CONFIG.scrollDuration);
        });
    }
}

// ====================================
// UTILITY FUNCTIONS
// ====================================
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

// ====================================
// INICIALIZACIÓN DE FIREBASE
// ====================================
async function initializeFirebase() {
    if (!USE_FIREBASE) {
        console.log('📱 Usando localStorage para almacenamiento');
        return;
    }
    
    try {
        console.log('🔥 Inicializando Firebase...');
        
        // Verificar si Firebase ya está cargado
        if (typeof firebase === 'undefined') {
            console.error('❌ Firebase SDK no está cargado');
            return false;
        }
        
        // Inicializar Firebase
        firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
        firebaseDb = firebase.database();
        
        console.log('✅ Firebase inicializado correctamente');
        return true;
    } catch (error) {
        console.error('❌ Error inicializando Firebase:', error);
        console.log('🔄 Fallback a localStorage');
        return false;
    }
}

// ====================================
// FUNCIONES DE ALMACENAMIENTO HÍBRIDO
// ====================================

// ===== FOLIOS =====
async function getFolios() {
    if (USE_FIREBASE && firebaseDb) {
        try {
            console.log('🔥 Obteniendo folios desde Firebase...');
            const snapshot = await firebaseDb.ref('folios').once('value');
            const folios = snapshot.val();
            return folios ? Object.values(folios) : [];
        } catch (error) {
            console.error('❌ Error obteniendo folios de Firebase:', error);
            console.log('🔄 Fallback a localStorage');
        }
    }
    
    // Fallback a localStorage
    const folios = localStorage.getItem('stdtec_folios');
    return folios ? JSON.parse(folios) : [];
}

async function saveFolios(folios) {
    // Siempre guardar en localStorage como respaldo
    localStorage.setItem('stdtec_folios', JSON.stringify(folios));
    
    if (USE_FIREBASE && firebaseDb) {
        try {
            console.log('🔥 Guardando folios en Firebase...');
            
            // Convertir array a objeto con folio como key
            const foliosObject = {};
            folios.forEach(folio => {
                foliosObject[folio.folio] = folio;
            });
            
            await firebaseDb.ref('folios').set(foliosObject);
            console.log('✅ Folios guardados en Firebase');
        } catch (error) {
            console.error('❌ Error guardando folios en Firebase:', error);
            console.log('💾 Datos guardados en localStorage como respaldo');
        }
    }
}

// ===== CONTADORES =====
async function getCounters() {
    if (USE_FIREBASE && firebaseDb) {
        try {
            console.log('🔥 Obteniendo contadores desde Firebase...');
            const snapshot = await firebaseDb.ref('counters').once('value');
            const counters = snapshot.val();
            return counters || {};
        } catch (error) {
            console.error('❌ Error obteniendo contadores de Firebase:', error);
            console.log('🔄 Fallback a localStorage');
        }
    }
    
    // Fallback a localStorage
    const counters = localStorage.getItem('stdtec_folio_counters');
    return counters ? JSON.parse(counters) : {};
}

async function saveCounters(counters) {
    // Siempre guardar en localStorage como respaldo
    localStorage.setItem('stdtec_folio_counters', JSON.stringify(counters));
    
    if (USE_FIREBASE && firebaseDb) {
        try {
            console.log('🔥 Guardando contadores en Firebase...');
            await firebaseDb.ref('counters').set(counters);
            console.log('✅ Contadores guardados en Firebase');
        } catch (error) {
            console.error('❌ Error guardando contadores en Firebase:', error);
            console.log('💾 Datos guardados en localStorage como respaldo');
        }
    }
}

// ====================================
// FUNCIONES DE SINCRONIZACIÓN
// ====================================
async function syncWithFirebase() {
    if (!USE_FIREBASE || !firebaseDb) return;
    
    try {
        console.log('🔄 Sincronizando datos con Firebase...');
        
        // Obtener datos locales
        const localFolios = JSON.parse(localStorage.getItem('stdtec_folios') || '[]');
        const localCounters = JSON.parse(localStorage.getItem('stdtec_folio_counters') || '{}');
        
        // Obtener datos de Firebase
        const [foliosSnapshot, countersSnapshot] = await Promise.all([
            firebaseDb.ref('folios').once('value'),
            firebaseDb.ref('counters').once('value')
        ]);
        
        const firebaseFolios = foliosSnapshot.val();
        const firebaseCounters = countersSnapshot.val();
        
        // Determinar qué datos usar (Firebase tiene prioridad si existe)
        const finalFolios = firebaseFolios ? Object.values(firebaseFolios) : localFolios;
        const finalCounters = firebaseCounters || localCounters;
        
        // Actualizar ambos almacenamientos
        await saveFolios(finalFolios);
        await saveCounters(finalCounters);
        
        console.log('✅ Sincronización completada');
        return { folios: finalFolios, counters: finalCounters };
    } catch (error) {
        console.error('❌ Error en sincronización:', error);
        return null;
    }
}

// ====================================
// FUNCIONES DE MIGRACIÓN
// ====================================
async function migrateToFirebase() {
    if (!USE_FIREBASE || !firebaseDb) {
        console.log('❌ Firebase no está habilitado');
        return false;
    }
    
    try {
        console.log('📦 Migrando datos locales a Firebase...');
        
        // Obtener datos locales
        const localFolios = JSON.parse(localStorage.getItem('stdtec_folios') || '[]');
        const localCounters = JSON.parse(localStorage.getItem('stdtec_folio_counters') || '{}');
        
        // Migrar a Firebase
        await saveFolios(localFolios);
        await saveCounters(localCounters);
        
        console.log('✅ Migración completada');
        console.log(`📊 Migrados ${localFolios.length} folios`);
        console.log(`🔢 Migrados contadores:`, Object.keys(localCounters).length);
        
        return true;
    } catch (error) {
        console.error('❌ Error en migración:', error);
        return false;
    }
}
