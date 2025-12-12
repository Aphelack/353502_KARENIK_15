/**
 * Scroll Animations - Lab 3, Task 11
 * Implements animations triggered by scrolling
 * Theme: Medical center - animated medical icons and elements
 */

class ScrollAnimations {
    constructor() {
        this.animatedElements = [];
        this.init();
    }

    init() {
        this.createAnimationElements();
        this.attachScrollListener();
        this.checkVisibility();
    }

    createAnimationElements() {
        // Create floating medical icons container
        const animContainer = document.createElement('div');
        animContainer.id = 'scrollAnimationContainer';
        animContainer.className = 'scroll-animation-container';
        animContainer.innerHTML = `
            <div class="animated-element medical-icon heart-icon" data-animation="float">
                ❤️
            </div>
            <div class="animated-element medical-icon pill-icon" data-animation="rotate">
                💊
            </div>
            <div class="animated-element medical-icon syringe-icon" data-animation="slide-in-left">
                💉
            </div>
            <div class="animated-element medical-icon cross-icon" data-animation="bounce">
                ➕
            </div>
            <div class="animated-element medical-icon stethoscope-icon" data-animation="pulse">
                🩺
            </div>
            <div class="animated-element medical-icon ambulance-icon" data-animation="slide-in-right">
                🚑
            </div>
            <div class="animated-element medical-icon hospital-icon" data-animation="fade-in">
                🏥
            </div>
            <div class="animated-element medical-icon doctor-icon" data-animation="scale-up">
                👨‍⚕️
            </div>
        `;

        // Add to body if not already present
        if (!document.getElementById('scrollAnimationContainer')) {
            document.body.appendChild(animContainer);
        }

        // Get all animated elements
        this.animatedElements = document.querySelectorAll('.animated-element');
    }

    attachScrollListener() {
        // Throttle scroll events for better performance
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.checkVisibility();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Also check on window resize
        window.addEventListener('resize', () => {
            this.checkVisibility();
        });
    }

    checkVisibility() {
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollBottom = scrollTop + windowHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Calculate scroll progress (0 to 1)
        const scrollProgress = scrollTop / (documentHeight - windowHeight);

        this.animatedElements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollTop;
            const elementBottom = elementTop + rect.height;

            // Check if element is in viewport
            const isVisible = (elementTop < scrollBottom) && (elementBottom > scrollTop);

            if (isVisible) {
                element.classList.add('visible');
                
                // Apply additional transformations based on scroll progress
                this.applyScrollTransform(element, scrollProgress, index);
            } else {
                // Remove visible class when scrolling back up
                if (scrollTop < elementTop - windowHeight) {
                    element.classList.remove('visible');
                }
            }
        });
    }

    applyScrollTransform(element, scrollProgress, index) {
        const animation = element.dataset.animation;

        switch (animation) {
            case 'float':
                // Floating up and down
                const floatOffset = Math.sin(scrollProgress * Math.PI * 4 + index) * 20;
                element.style.transform = `translateY(${floatOffset}px)`;
                break;

            case 'rotate':
                // Rotating
                const rotation = scrollProgress * 360 * 2;
                element.style.transform = `rotate(${rotation}deg)`;
                break;

            case 'slide-in-left':
                // Slide from left
                const leftOffset = Math.max(0, (1 - scrollProgress * 2) * -100);
                element.style.transform = `translateX(${leftOffset}px)`;
                break;

            case 'slide-in-right':
                // Slide from right
                const rightOffset = Math.max(0, (1 - scrollProgress * 2) * 100);
                element.style.transform = `translateX(${rightOffset}px)`;
                break;

            case 'pulse':
                // Pulsing scale
                const scale = 1 + Math.sin(scrollProgress * Math.PI * 6) * 0.2;
                element.style.transform = `scale(${scale})`;
                break;

            case 'bounce':
                // Bouncing
                const bounceY = Math.abs(Math.sin(scrollProgress * Math.PI * 8)) * -30;
                element.style.transform = `translateY(${bounceY}px)`;
                break;

            case 'scale-up':
                // Scale based on scroll progress
                const scaleUp = 0.5 + scrollProgress * 0.5;
                element.style.transform = `scale(${scaleUp})`;
                break;

            case 'fade-in':
                // Fade in based on scroll progress
                element.style.opacity = Math.min(1, scrollProgress * 2);
                break;
        }
    }

    // Add element with custom animation
    addAnimatedElement(content, animation, position) {
        const container = document.getElementById('scrollAnimationContainer');
        if (!container) return;

        const element = document.createElement('div');
        element.className = 'animated-element';
        element.dataset.animation = animation;
        element.style.left = `${position.x}%`;
        element.style.top = `${position.y}%`;
        element.innerHTML = content;

        container.appendChild(element);
        this.animatedElements = document.querySelectorAll('.animated-element');
    }

    // Enable/disable animations
    toggle(enable = true) {
        const container = document.getElementById('scrollAnimationContainer');
        if (container) {
            container.style.display = enable ? 'block' : 'none';
        }
    }
}

// Additional scroll effects for page elements
class PageScrollEffects {
    constructor() {
        this.init();
    }

    init() {
        this.addRevealEffects();
        this.addParallaxEffects();
        this.attachScrollListener();
    }

    addRevealEffects() {
        // Add reveal-on-scroll class to elements
        const elementsToReveal = document.querySelectorAll(
            'section, article, .service-card, .doctor-card, .news-card'
        );

        elementsToReveal.forEach((element, index) => {
            element.classList.add('scroll-reveal');
            element.style.animationDelay = `${index * 0.1}s`;
        });
    }

    addParallaxEffects() {
        // Add parallax effect to background elements
        const parallaxElements = document.querySelectorAll('.parallax-bg');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    attachScrollListener() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                } else {
                    // Optional: remove class when scrolling back up
                    if (entry.boundingClientRect.top > 0) {
                        entry.target.classList.remove('revealed');
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        document.querySelectorAll('.scroll-reveal').forEach(element => {
            observer.observe(element);
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.scrollAnimations = new ScrollAnimations();
        window.pageScrollEffects = new PageScrollEffects();
    });
} else {
    window.scrollAnimations = new ScrollAnimations();
    window.pageScrollEffects = new PageScrollEffects();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScrollAnimations, PageScrollEffects };
}
