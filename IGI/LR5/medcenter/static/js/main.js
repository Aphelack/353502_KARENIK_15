/**
 * Main JavaScript for Medical Center
 * Handles interactive features like FAQ accordion, animations, etc.
 */

document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion functionality
    initFAQAccordion();
    
    // Smooth scroll for anchor links
    initSmoothScroll();
    
    // Fixed navigation on scroll
    initFixedNav();
    
    // Preloader
    initPreloader();
    
    // Copy promo code functionality
    initPromoCopy();
});

/**
 * FAQ Accordion - Toggle questions and answers
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href !== '#main-content') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

/**
 * Fixed navigation on scroll
 */
function initFixedNav() {
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
                document.body.classList.add('has-fixed-nav');
            } else {
                header.classList.remove('scrolled');
                document.body.classList.remove('has-fixed-nav');
            }
        });
    }
}

/**
 * Preloader functionality
 */
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    
    if (preloader) {
        // Show preloader when page is loading
        window.addEventListener('load', function() {
            preloader.classList.remove('active');
        });
        
        // Show preloader on AJAX requests (if using fetch)
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            preloader.classList.add('active');
            return originalFetch.apply(this, args).finally(() => {
                preloader.classList.remove('active');
            });
        };
    }
}

/**
 * Copy promo code to clipboard
 */
function initPromoCopy() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const promoCode = this.closest('.promo-code-display').querySelector('.promo-code');
            
            if (promoCode) {
                const text = promoCode.textContent;
                
                // Copy to clipboard
                navigator.clipboard.writeText(text).then(() => {
                    // Change button text temporarily
                    const originalText = this.textContent;
                    this.textContent = 'Скопировано!';
                    this.style.background = '#27ae60';
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.background = '';
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy:', err);
                    alert('Не удалось скопировать промокод');
                });
            }
        });
    });
}

/**
 * Rating stars interaction
 */
function initRatingStars() {
    const ratingInputs = document.querySelectorAll('.rating-input');
    
    ratingInputs.forEach(input => {
        input.addEventListener('change', function() {
            const rating = this.value;
            console.log('Rating selected:', rating);
        });
    });
}

/**
 * Form validation helper
 */
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });
    
    return isValid;
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('header nav > ul');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}
