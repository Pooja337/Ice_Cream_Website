document.addEventListener('DOMContentLoaded', () => {
    /* === Preloader === */
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 600);
    }, 1500); // simulate loading time

    /* === Custom Cursor === */
    const cursor = document.getElementById('cursor');
    const interactiveElements = document.querySelectorAll('a, button, .flavour-card, .menu-toggle');
    
    // Disable custom cursor on touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });
    } else {
        cursor.style.display = 'none';
    }

    /* === Navbar Scroll Effect === */
    const navbar = document.getElementById('navbar');
    const scrollToTopBtn = document.getElementById('scrollToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll to top button visibility
        if (window.scrollY > 500) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* === Mobile Menu Toggle === */
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu on link click
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    /* === Intersection Observer for Scroll Animations === */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-slide-right, .reveal-slide-left, .reveal-scale');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    /* === Parallax Effect for About Image === */
    const parallaxImg = document.querySelector('.parallax-img');
    if (parallaxImg) {
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY;
            const elementTop = document.getElementById('about').offsetTop;
            if (scrollPos > elementTop - window.innerHeight) {
                const offset = (scrollPos - elementTop + window.innerHeight) * 0.1;
                parallaxImg.style.transform = `translateY(${offset}px)`;
            }
        });
    }

    /* === Wave Card Logic === */
    class WaveCard {
        constructor(element) {
            this.card = element;
            this.wavePath = element.querySelector('.wave-path');
            this.progress = 0;
            this.target = 0;
            this.animationFrame = null;
            if (this.wavePath) this.init();
        }

        createWave(progress) {
            const baseY = 326 - (progress * 380);
            const p1 = baseY + 25;
            const p2 = baseY - 20;
            const p3 = baseY + 15;
            return `M 0 ${p1} C 45 ${p1 - 45}, 90 ${p1 + 40}, 140 ${p2} C 190 ${p2 - 45}, 245 ${p3 + 30}, 314 ${p3 - 40} L 314 314 L 0 314 Z`;
        }

        animate() {
            this.progress += (this.target - this.progress) * 0.04;
            this.wavePath.setAttribute("d", this.createWave(this.progress));
            if (Math.abs(this.target - this.progress) > 0.001) {
                this.animationFrame = requestAnimationFrame(() => this.animate());
            } else {
                // Ensure class state matches for any CSS styles
                if(this.target === 1) this.card.classList.add('wave-active');
                else this.card.classList.remove('wave-active');
            }
        }

        startAnimation() {
            if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
            this.animationFrame = requestAnimationFrame(() => this.animate());
        }

        init() {
            this.wavePath.setAttribute("d", this.createWave(0));
            this.card.addEventListener("mouseenter", () => {
                this.target = 1;
                this.startAnimation();
            });
            this.card.addEventListener("mouseleave", () => {
                this.target = 0;
                this.startAnimation();
            });
            this.card.addEventListener("click", () => {
                this.target = this.target === 1 ? 0 : 1;
                this.startAnimation();
            });
        }
    }

    const flavourCards = document.querySelectorAll('.flavour-card');
    flavourCards.forEach(card => new WaveCard(card));

    /* === Testimonial Carousel === */
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Initialize dots click
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            clearInterval(slideInterval);
            currentSlide = parseInt(this.getAttribute('data-index'));
            showSlide(currentSlide);
            startCarousel(); // restart interval
        });
    });

    function startCarousel() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    startCarousel();

    /* === Countdown Timer === */
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minsEl = document.getElementById('mins');
    const secsEl = document.getElementById('secs');

    // Set offer end time to 3 days from now
    const offerEndTime = new Date().getTime() + (3 * 24 * 60 * 60 * 1000);

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = offerEndTime - now;

        if (distance < 0) {
            clearInterval(countdownTimer);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((distance % (1000 * 60)) / 1000);

        if (daysEl) {
            daysEl.innerText = days < 10 ? '0' + days : days;
            hoursEl.innerText = hours < 10 ? '0' + hours : hours;
            minsEl.innerText = mins < 10 ? '0' + mins : mins;
            secsEl.innerText = secs < 10 ? '0' + secs : secs;
        }
    }

    const countdownTimer = setInterval(updateCountdown, 1000);
    updateCountdown();

    /* === Form Submissions === */
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Basic validation is handled by HTML5 'required' attributes
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            
            // Simulate API call
            setTimeout(() => {
                contactForm.reset();
                btn.innerText = originalText;
                formMessage.innerText = 'Thank you! Your message has been sent.';
                formMessage.style.color = 'var(--accent)';
                setTimeout(() => { formMessage.innerText = ''; }, 3000);
            }, 1500);
        });
    }

    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = newsletterForm.querySelector('button');
            btn.innerHTML = '✓';
            setTimeout(() => {
                newsletterForm.reset();
                btn.innerHTML = '→';
            }, 2000);
        });
    }

    /* === Hero Particles Generation === */
    const particlesContainer = document.getElementById('particles');
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }

    function createParticle() {
        const particle = document.createElement('div');
        
        // Randomize size, position, and animation duration
        const size = Math.random() * 8 + 4;
        const posX = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        // Sprinkle colors
        const colors = ['#D4AF37', '#FDE8E9', '#FFFFFF', '#4A3026'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: absolute;
            bottom: -20px;
            left: ${posX}%;
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            opacity: ${Math.random() * 0.5 + 0.3};
            pointer-events: none;
            animation: float-up ${duration}s linear ${delay}s infinite;
        `;
        
        particlesContainer.appendChild(particle);
    }
});

/* Particle Keyframes injected via JS since dynamic */
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes float-up {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }
`;
document.head.appendChild(styleSheet);

/* === Shopping Cart Logic === */
class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('lumiere_cart')) || [];
        this.cartToggle = document.getElementById('cartToggle');
        this.cartOverlay = document.getElementById('cartOverlay');
        this.cartSidebar = document.getElementById('cartSidebar');
        this.closeCartBtn = document.getElementById('closeCart');
        this.cartItemsContainer = document.getElementById('cartItems');
        this.cartCountElement = document.getElementById('cartCount');
        this.cartTotalElement = document.getElementById('cartTotal');
        
        this.init();
    }
    
    init() {
        if(!this.cartSidebar) return;
        
        // Event Listeners for UI
        this.cartToggle.addEventListener('click', () => this.openCart());
        this.closeCartBtn.addEventListener('click', () => this.closeCart());
        this.cartOverlay.addEventListener('click', () => this.closeCart());
        
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const name = btn.getAttribute('data-name');
                const price = parseFloat(btn.getAttribute('data-price'));
                const img = btn.getAttribute('data-img');
                this.addItem(name, price, img);
                this.openCart();
            });
        });
        
        this.render();
    }
    
    addItem(name, price, img) {
        const existingItem = this.cart.find(item => item.name === name);
        if(existingItem) {
            existingItem.qty += 1;
        } else {
            this.cart.push({ name, price, img, qty: 1 });
        }
        this.save();
        this.render();
    }
    
    updateQty(name, change) {
        const item = this.cart.find(item => item.name === name);
        if(item) {
            item.qty += change;
            if(item.qty <= 0) {
                this.cart = this.cart.filter(i => i.name !== name);
            }
            this.save();
            this.render();
        }
    }
    
    save() {
        localStorage.setItem('lumiere_cart', JSON.stringify(this.cart));
    }
    
    render() {
        this.cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;
        
        if(this.cart.length === 0) {
            this.cartItemsContainer.innerHTML = '<p style="text-align:center; margin-top:20px; color:#888;">Your cart is empty.</p>';
        } else {
            this.cart.forEach(item => {
                total += (item.price * item.qty);
                count += item.qty;
                
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-controls">
                            <button class="qty-btn minus" data-name="${item.name}">-</button>
                            <span>${item.qty}</span>
                            <button class="qty-btn plus" data-name="${item.name}">+</button>
                        </div>
                    </div>
                `;
                this.cartItemsContainer.appendChild(itemEl);
            });
            
            // Rebind plus/minus buttons
            this.cartItemsContainer.querySelectorAll('.minus').forEach(btn => {
                btn.addEventListener('click', () => this.updateQty(btn.getAttribute('data-name'), -1));
            });
            this.cartItemsContainer.querySelectorAll('.plus').forEach(btn => {
                btn.addEventListener('click', () => this.updateQty(btn.getAttribute('data-name'), 1));
            });
        }
        
        this.cartCountElement.innerText = count;
        this.cartTotalElement.innerText = total.toFixed(2);
    }
    
    openCart() {
        this.cartSidebar.classList.add('open');
        this.cartOverlay.classList.add('open');
    }
    
    closeCart() {
        this.cartSidebar.classList.remove('open');
        this.cartOverlay.classList.remove('open');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ShoppingCart();
});
