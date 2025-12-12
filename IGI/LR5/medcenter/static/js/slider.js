/**
 * Image Slider Class - Lab 3, Task 1
 * Implements a customizable image slider with various features
 */
class ImageSlider {
    constructor(containerSelector, options = {}) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            console.error(`Container ${containerSelector} not found`);
            return;
        }

        // Default options
        this.options = {
            loop: options.loop !== undefined ? options.loop : true,
            navs: options.navs !== undefined ? options.navs : true,
            pags: options.pags !== undefined ? options.pags : true,
            auto: options.auto !== undefined ? options.auto : true,
            stopMouseHover: options.stopMouseHover !== undefined ? options.stopMouseHover : true,
            delay: options.delay || 5 // seconds
        };

        this.slides = [];
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.isPaused = false;

        this.init();
    }

    init() {
        this.createSliderStructure();
        this.attachEventListeners();
        
        if (this.options.auto) {
            this.startAutoPlay();
        }
    }

    addSlide(imageUrl, caption, link) {
        this.slides.push({
            imageUrl,
            caption,
            link
        });
        this.renderSlides();
    }

    createSliderStructure() {
        this.container.innerHTML = `
            <div class="slider-wrapper">
                <div class="slider-track"></div>
                ${this.options.navs ? `
                    <button class="slider-nav slider-prev" aria-label="Предыдущий слайд">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M15 18l-6-6 6-6"/>
                        </svg>
                    </button>
                    <button class="slider-nav slider-next" aria-label="Следующий слайд">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </button>
                ` : ''}
                <div class="slider-counter"></div>
                ${this.options.pags ? '<div class="slider-pagination"></div>' : ''}
            </div>
        `;

        this.track = this.container.querySelector('.slider-track');
        this.counter = this.container.querySelector('.slider-counter');
        this.pagination = this.container.querySelector('.slider-pagination');
        this.prevBtn = this.container.querySelector('.slider-prev');
        this.nextBtn = this.container.querySelector('.slider-next');
    }

    renderSlides() {
        if (this.slides.length === 0) return;

        // Render slides
        this.track.innerHTML = this.slides.map((slide, index) => `
            <div class="slider-slide ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <a href="${slide.link || '#'}" class="slider-link">
                    <img src="${slide.imageUrl}" alt="${slide.caption}" loading="lazy">
                    <div class="slider-caption">${slide.caption}</div>
                </a>
            </div>
        `).join('');

        // Update counter
        this.updateCounter();

        // Render pagination
        if (this.options.pags && this.pagination) {
            this.pagination.innerHTML = this.slides.map((_, index) => `
                <button class="slider-dot ${index === this.currentIndex ? 'active' : ''}" 
                        data-index="${index}" 
                        aria-label="Перейти к слайду ${index + 1}"></button>
            `).join('');
        }
    }

    updateCounter() {
        if (this.counter) {
            this.counter.textContent = `${this.currentIndex + 1}/${this.slides.length}`;
        }
    }

    goToSlide(index) {
        if (index < 0) {
            index = this.options.loop ? this.slides.length - 1 : 0;
        } else if (index >= this.slides.length) {
            index = this.options.loop ? 0 : this.slides.length - 1;
        }

        this.currentIndex = index;
        this.renderSlides();
    }

    nextSlide() {
        this.goToSlide(this.currentIndex + 1);
    }

    prevSlide() {
        this.goToSlide(this.currentIndex - 1);
    }

    startAutoPlay() {
        if (!this.options.auto) return;

        this.autoPlayInterval = setInterval(() => {
            if (!this.isPaused) {
                this.nextSlide();
            }
        }, this.options.delay * 1000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    pauseAutoPlay() {
        this.isPaused = true;
    }

    resumeAutoPlay() {
        this.isPaused = false;
    }

    updateDelay(newDelay) {
        this.options.delay = newDelay;
        if (this.options.auto) {
            this.stopAutoPlay();
            this.startAutoPlay();
        }
    }

    attachEventListeners() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Pagination dots
        if (this.pagination) {
            this.pagination.addEventListener('click', (e) => {
                if (e.target.classList.contains('slider-dot')) {
                    const index = parseInt(e.target.dataset.index);
                    this.goToSlide(index);
                }
            });
        }

        // Mouse hover pause
        if (this.options.stopMouseHover && this.options.auto) {
            this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
            this.container.addEventListener('mouseleave', () => this.resumeAutoPlay());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
    }

    destroy() {
        this.stopAutoPlay();
        this.container.innerHTML = '';
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageSlider;
}
