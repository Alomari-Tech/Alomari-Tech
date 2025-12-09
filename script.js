// ===== GLOBAL VARIABLES =====
let isScrolling = false;
let ticking = false;

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// ===== INITIALIZE WEBSITE =====
function initializeWebsite() {
    setupNavigation();
    setupScrollAnimations();
    setupContactForm();
    setupPricingToggle();
    setupScrollToTop();
    setupMobileMenu();
    setupSmoothScrolling();
    setupIntersectionObserver();
    addLoadingAnimation();
    setupButtonHandlers();
    
    console.log('🚀 Alomari Tech website initialized successfully!');
}

// ===== NAVIGATION FUNCTIONALITY =====
function setupNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(15, 15, 15, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(15, 15, 15, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
    
    // Active nav link highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===== MOBILE MENU =====
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
}

// ===== SMOOTH SCROLLING =====
function setupSmoothScrolling() {
    // Custom smooth scroll function
    window.scrollToSection = function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    };
    
    // Handle navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function setupScrollAnimations() {
    // Add scroll-based animations
    const animateElements = document.querySelectorAll('.about-card, .service-card, .project-card, .team-member, .pricing-card');
    
    animateElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('animate-on-scroll');
    });
}

// ===== INTERSECTION OBSERVER =====
function setupIntersectionObserver() {
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
    
    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
    
    // Special animation for hero section
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-buttons, .hero-stats');
    heroElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
    });
}

// ===== CONTACT FORM =====
function setupContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    }
}

async function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate all fields
    let isValid = true;
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fix the errors above', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        // Simulate form submission (replace with actual endpoint)
        await simulateFormSubmission(data);
        
        // Success
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        form.reset();
        
        // Reset form styling
        inputs.forEach(input => {
            input.parentElement.classList.remove('success');
        });
        
    } catch (error) {
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Randomly succeed or fail for demo purposes
            if (Math.random() > 0.1) { // 90% success rate
                console.log('Form data submitted:', data);
                resolve(data);
            } else {
                reject(new Error('Network error'));
            }
        }, 2000);
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldGroup = field.parentElement;
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation (optional but if provided, should be valid)
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Show error or success
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        fieldGroup.classList.add('success');
    }
    
    return isValid;
}

function showFieldError(field, message) {
    const fieldGroup = field.parentElement;
    fieldGroup.classList.add('error');
    
    // Remove existing error message
    const existingError = fieldGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    fieldGroup.appendChild(errorElement);
}

function clearFieldError(field) {
    const fieldGroup = field.parentElement;
    fieldGroup.classList.remove('error');
    
    const errorMessage = fieldGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// ===== PRICING TOGGLE =====
function setupPricingToggle() {
    const toggle = document.getElementById('pricing-toggle');
    
    if (toggle) {
        toggle.addEventListener('change', handlePricingToggle);
    }
}

function handlePricingToggle(e) {
    const isYearly = e.target.checked;
    const monthlyPrices = document.querySelectorAll('.amount.monthly');
    const yearlyPrices = document.querySelectorAll('.amount.yearly');
    
    monthlyPrices.forEach(price => {
        price.style.display = isYearly ? 'none' : 'inline';
    });
    
    yearlyPrices.forEach(price => {
        price.style.display = isYearly ? 'inline' : 'none';
    });
}

// ===== SCROLL TO TOP BUTTON =====
function setupScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== LOADING ANIMATIONS =====
function addLoadingAnimation() {
    // Add stagger animation to cards
    const cards = document.querySelectorAll('.service-card, .project-card, .team-member');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--accent-main)' : type === 'error' ? '#ff4444' : 'var(--bg-surface-1)'};
        color: ${type === 'success' || type === 'error' ? 'var(--bg-page)' : 'var(--text-primary)'};
        padding: 16px 20px;
        border-radius: 8px;
        border: 1px solid ${type === 'success' ? 'var(--accent-main)' : type === 'error' ? '#ff4444' : 'var(--border-divider)'};
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        opacity: 0.7;
        transition: opacity 0.2s;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Handle close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
}

function hideNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ===== HIRING SECTION FUNCTIONS =====
function openApplicationForm() {
    // Replace with your actual Google Form URL
    const googleFormUrl = 'https://forms.gle/qvWh5M5tcGzkzMAJ7';
    
    // Show notification
    showNotification('Opening application form...', 'info');
    
    // Open Google Form in new tab
    setTimeout(() => {
        window.open(googleFormUrl, '_blank');
    }, 500);
}

// ===== ENHANCED SCROLL EFFECTS =====
function setupEnhancedScrollEffects() {
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
}

// ===== PARALLAX EFFECT =====
function setupParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.hero-background .animated-bg');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// ===== PERFORMANCE OPTIMIZATION =====
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function setupAccessibility() {
    // Keyboard navigation for custom elements
    document.addEventListener('keydown', (e) => {
        // Handle Enter and Space for buttons
        if (e.target.classList.contains('btn') && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            e.target.click();
        }
        
        // Escape key to close mobile menu
        if (e.key === 'Escape') {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            if (hamburger && navMenu && navMenu.classList.contains('active')) {
                hamburger.click();
            }
        }
    });
    
    // Focus management for mobile menu
    const mobileMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (mobileMenu && hamburger) {
        hamburger.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                // Focus first menu item when menu opens
                const firstMenuItem = mobileMenu.querySelector('.nav-link');
                if (firstMenuItem) {
                    setTimeout(() => firstMenuItem.focus(), 100);
                }
            }
        });
    }
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // Optionally show user-friendly error message
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // Optionally show user-friendly error message
});

// ===== UTILITY FUNCTIONS =====
function isMobile() {
    return window.innerWidth <= 768;
}

function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

function isDesktop() {
    return window.innerWidth > 1024;
}

// ===== INITIALIZE ADDITIONAL FEATURES =====
document.addEventListener('DOMContentLoaded', () => {
    setupEnhancedScrollEffects();
    setupParallaxEffect();
    setupAccessibility();
    
    // Add loading complete class
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// ===== RESIZE HANDLER =====
window.addEventListener('resize', debounce(() => {
    // Handle responsive adjustments
    console.log('Window resized:', window.innerWidth);
}, 250));

// ===== EXPORT FUNCTIONS FOR GLOBAL ACCESS =====
window.AlomariTech = {
    scrollToSection,
    openApplicationForm,
    showNotification,
    isMobile: isMobile(),
    isTablet: isTablet(),
    isDesktop: isDesktop()
};

// ===== BUTTON HANDLERS =====
function setupButtonHandlers() {
    // Pricing buttons
    const pricingButtons = document.querySelectorAll('.pricing-card .btn');
    pricingButtons.forEach(button => {
        button.addEventListener('click', handlePricingButtonClick);
    });
    
    // Service buttons
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        const button = card.querySelector('.btn');
        if (button && !button.hasAttribute('onclick')) {
            button.addEventListener('click', () => handleServiceButtonClick(card));
        }
    });
    
    // Project CTA button
    const projectsCTA = document.querySelector('.projects-cta .btn');
    if (projectsCTA) {
        projectsCTA.addEventListener('click', handleProjectsCTA);
    }
    
    // Contact buttons in hero
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(button => {
        if (!button.hasAttribute('onclick')) {
            const span = button.querySelector('span');
            if (span && span.textContent.includes('Get Started')) {
                button.addEventListener('click', () => scrollToSection('contact'));
            }
        }
    });
}

function handlePricingButtonClick(e) {
    e.preventDefault();
    const button = e.target.closest('.btn');
    const pricingCard = button.closest('.pricing-card');
    const planName = pricingCard.querySelector('h3').textContent;
    
    if (button.textContent.includes('Contact Sales')) {
        // Scroll to contact form
        scrollToSection('contact');
        
        // Pre-fill service selection
        setTimeout(() => {
            const serviceSelect = document.getElementById('service');
            if (serviceSelect) {
                serviceSelect.value = 'consultation';
                // Trigger change event for label animation
                serviceSelect.dispatchEvent(new Event('change'));
            }
            
            // Focus on name field
            const nameField = document.getElementById('name');
            if (nameField) {
                nameField.focus();
            }
        }, 500);
        
        showNotification(`Let's discuss your ${planName} plan requirements!`, 'info');
    } else {
        // Scroll to contact form
        scrollToSection('contact');
        
        // Pre-fill service selection
        setTimeout(() => {
            const serviceSelect = document.getElementById('service');
            if (serviceSelect) {
                serviceSelect.value = 'ai-development'; // Default to AI development
                serviceSelect.dispatchEvent(new Event('change'));
            }
        }, 500);
        
        showNotification(`Let's get started with your ${planName} plan!`, 'success');
    }
}

function handleServiceButtonClick(serviceCard) {
    const serviceName = serviceCard.querySelector('h3').textContent;
    const serviceIcon = serviceCard.querySelector('.service-icon i').className;
    
    // Map service icons to form values
    let formValue = 'consultation';
    if (serviceName.includes('AI Development')) formValue = 'ai-development';
    else if (serviceName.includes('Process Automation')) formValue = 'process-automation';
    else if (serviceName.includes('Data Analytics')) formValue = 'data-analytics';
    else if (serviceName.includes('Cloud AI')) formValue = 'cloud-ai';
    else if (serviceName.includes('Chatbots')) formValue = 'chatbots';
    else if (serviceName.includes('Security')) formValue = 'ai-security';
    
    // Scroll to contact form
    scrollToSection('contact');
    
    // Pre-fill the form
    setTimeout(() => {
        const serviceSelect = document.getElementById('service');
        if (serviceSelect) {
            serviceSelect.value = formValue;
            serviceSelect.dispatchEvent(new Event('change'));
        }
        
        const nameField = document.getElementById('name');
        if (nameField) {
            nameField.focus();
        }
    }, 500);
    
    showNotification(`Great choice! Let's discuss ${serviceName} for your business.`, 'info');
}

function handleProjectsCTA() {
    // Scroll to contact or show more projects modal
    scrollToSection('contact');
    showNotification('Ready to start your own success story? Let\'s talk!', 'success');
}

// ===== CSS FOR MOBILE MENU (ADDED DYNAMICALLY) =====
const mobileMenuStyles = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 80px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 80px);
            background: var(--bg-surface-1);
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 2rem;
            transition: left 0.3s ease-in-out;
            border-top: 1px solid var(--border-divider);
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-menu li {
            margin: 1rem 0;
        }
        
        .nav-link {
            font-size: 1.2rem;
            padding: 0.5rem 1rem;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        body.menu-open {
            overflow: hidden;
        }
    }
`;

// Add mobile menu styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuStyles;
document.head.appendChild(styleSheet);