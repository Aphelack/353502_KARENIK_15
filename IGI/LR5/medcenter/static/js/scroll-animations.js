/**
 * Scroll Animations - Lab 3, Task 11
 * Medical Parallax Scroll Animation
 * Theme: Medical center - Ambulance driving, pills falling, person healing
 */

// Initialize medical scroll animation when DOM is ready
function initMedicalScrollAnimation() {
    const animationSection = document.getElementById('medicalScrollAnimation');
    if (!animationSection) {
        console.log('Medical animation section not found');
        return;
    }

    console.log('Initializing medical scroll animation');

    // Get all animated elements
    const ambulance = document.getElementById('ambulance');
    const cloud1 = document.getElementById('cloud1');
    const cloud2 = document.getElementById('cloud2');
    const pills1 = document.getElementById('pills1');
    const pills2 = document.getElementById('pills2');
    const pills3 = document.getElementById('pills3');
    const sickPerson = document.getElementById('sickPerson');
    const healthyPerson = document.getElementById('healthyPerson');
    const heartbeat = document.getElementById('heartbeat');
    const medicalText = document.getElementById('medicalText');

    // Scroll event handler
    function handleScroll() {
        const rect = animationSection.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const windowHeight = window.innerHeight;

        // Calculate scroll progress (0 to 1) based on section visibility
        if (sectionTop < windowHeight && sectionTop > -sectionHeight) {
            let scrollProgress = 1 - ((sectionTop + sectionHeight) / (windowHeight + sectionHeight));
            scrollProgress = Math.max(0, Math.min(1, scrollProgress));

            // Ambulance drives from right to left (stops at hospital at 10%)
            if (ambulance) {
                const ambulanceProgress = Math.min(1, scrollProgress * 1.5);
                // Start at -10%, end at hospital (around 15%)
                ambulance.style.right = `${-10 + (ambulanceProgress * 85)}%`;
            }

            // Clouds move in opposite directions
            if (cloud1) cloud1.style.transform = `translateX(${scrollProgress * 100}px)`;
            if (cloud2) cloud2.style.transform = `translateX(${-scrollProgress * 80}px)`;

            // Pills fall down
            if (pills1) pills1.style.top = `${-50 + (scrollProgress * 400)}px`;
            if (pills2) pills2.style.top = `${-100 + (scrollProgress * 450)}px`;
            if (pills3) pills3.style.top = `${-150 + (scrollProgress * 500)}px`;

            // Person transforms from sick to healthy
            const healProgress = Math.max(0, (scrollProgress - 0.3) * 2);
            if (sickPerson) sickPerson.style.opacity = 1 - healProgress;
            if (healthyPerson) healthyPerson.style.opacity = healProgress;

            // Heartbeat pulses
            if (heartbeat) {
                const pulse = Math.sin(scrollProgress * Math.PI * 4);
                heartbeat.style.transform = `scale(${1 + pulse * 0.1})`;
            }

            // Text fades in
            if (medicalText) {
                medicalText.style.opacity = Math.min(1, scrollProgress * 2);
            }
        }
    }

    // Add scroll event listener with throttling
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial call
    handleScroll();
}

// Additional scroll reveal animations for other elements
class ScrollAnimations {
    constructor() {
        this.animatedElements = [];
        this.init();
    }

    init() {
        initMedicalScrollAnimation(); // Initialize demo page animation
        this.collectAnimatedElements();
        this.attachScrollListener();
        this.checkVisibility();
    }

    collectAnimatedElements() {
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
