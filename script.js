// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    const navLinks = document.querySelectorAll('.nav-link');
    const heroLinks = document.querySelectorAll('.btn[href^="#"]');
    
    [...navLinks, ...heroLinks].forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks_ = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navLinks_.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Active navigation link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navHeight = document.querySelector('.nav').offsetHeight;
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Update active link on scroll
    window.addEventListener('scroll', updateActiveNavLink);

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('.nav');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.product-card, .contact-item, .stat');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Counter animation for statistics
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = counter.textContent;
            const isPercentage = target.includes('%');
            const isDollar = target.includes('$');
            const isPlus = target.includes('+');
            const isStar = target.includes('★');
            
            let numericValue = parseFloat(target.replace(/[^0-9.]/g, ''));
            
            if (isDollar && target.includes('M')) {
                numericValue = numericValue * 1000000;
            } else if (isDollar && target.includes('K')) {
                numericValue = numericValue * 1000;
            } else if (!isDollar && target.includes('K')) {
                numericValue = numericValue * 1000;
            }
            
            let current = 0;
            const increment = numericValue / 100;
            const timer = setInterval(() => {
                current += increment;
                
                if (current >= numericValue) {
                    current = numericValue;
                    clearInterval(timer);
                }
                
                let displayValue = current;
                let suffix = '';
                
                if (isDollar) {
                    if (current >= 1000000) {
                        displayValue = (current / 1000000).toFixed(1);
                        suffix = 'M';
                    } else if (current >= 1000) {
                        displayValue = (current / 1000).toFixed(1);
                        suffix = 'K';
                    }
                    counter.textContent = `$${displayValue}${suffix}${isPlus ? '+' : ''}`;
                } else if (!isDollar && current >= 1000) {
                    displayValue = (current / 1000).toFixed(1);
                    suffix = 'K';
                    counter.textContent = `${displayValue}${suffix}${isPlus ? '+' : ''}`;
                } else if (isPercentage) {
                    counter.textContent = `${current.toFixed(1)}%`;
                } else if (isStar) {
                    counter.textContent = `${current.toFixed(1)}★`;
                } else {
                    counter.textContent = `${Math.floor(current)}${isPlus ? '+' : ''}`;
                }
            }, 20);
        });
    }

    // Trigger counter animation when stats section is visible
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }

    // Form handling
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name') || this.querySelector('input[type="text"]').value;
            const email = formData.get('email') || this.querySelector('input[type="email"]').value;
            const message = formData.get('message') || this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Thank you for your message! I\'ll get back to you soon.');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Add loading animation to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Parallax effect for hero background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-background');
        const speed = scrolled * 0.5;
        
        if (parallax) {
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });

    // Product card hover effects
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Initialize AOS (Animate On Scroll) alternative
    const fadeInElements = document.querySelectorAll('.product-card, .stat, .contact-item');
    fadeInElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        el.style.transitionDelay = `${index * 0.1}s`;
    });

    // Custom intersection observer for fade-in animation
    const fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    fadeInElements.forEach(el => {
        fadeObserver.observe(el);
    });
});

// Additional CSS for mobile navigation (injected via JavaScript)
const additionalStyles = `
    @media (max-width: 768px) {
        .nav-links {
            position: fixed;
            top: 70px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 70px);
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 2rem;
            transition: left 0.3s ease;
            z-index: 999;
        }
        
        .nav-links.active {
            left: 0;
        }
        
        .nav-link {
            padding: 1rem 0;
            font-size: 1.2rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            width: 80%;
            text-align: center;
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
        
        .nav.scrolled {
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet); 