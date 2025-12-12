/**
 * Services Catalog Pagination - Lab 3, Task 5
 * Implements pagination for services/products catalog with configurable items per page
 */
class ServiceCatalogPagination {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id ${containerId} not found`);
            return;
        }

        this.services = [];
        this.currentPage = 1;
        this.itemsPerPage = options.itemsPerPage || 3;
        this.allowCustomItemsPerPage = options.allowCustomItemsPerPage !== false;

        this.init();
    }

    init() {
        this.createCatalogStructure();
        this.loadServices();
        this.attachEventListeners();
    }

    createCatalogStructure() {
        this.container.innerHTML = `
            <div class="services-catalog-wrapper">
                <div class="catalog-header">
                    <h2>Каталог услуг</h2>
                    ${this.allowCustomItemsPerPage ? `
                        <div class="items-per-page-control">
                            <label for="itemsPerPage">Показывать по:</label>
                            <select id="itemsPerPage">
                                <option value="3" ${this.itemsPerPage === 3 ? 'selected' : ''}>3</option>
                                <option value="6" ${this.itemsPerPage === 6 ? 'selected' : ''}>6</option>
                                <option value="9" ${this.itemsPerPage === 9 ? 'selected' : ''}>9</option>
                                <option value="12" ${this.itemsPerPage === 12 ? 'selected' : ''}>12</option>
                            </select>
                        </div>
                    ` : ''}
                </div>

                <div class="services-grid" id="servicesGrid"></div>

                <div class="catalog-pagination" id="catalogPagination"></div>
            </div>
        `;
    }

    attachEventListeners() {
        if (this.allowCustomItemsPerPage) {
            const select = document.getElementById('itemsPerPage');
            if (select) {
                select.addEventListener('change', (e) => {
                    this.itemsPerPage = parseInt(e.target.value);
                    this.currentPage = 1;
                    this.render();
                });
            }
        }
    }

    async loadServices() {
        try {
            // Fetch from Django API endpoint
            const response = await fetch('/services/api/');
            if (response.ok) {
                const data = await response.json();
                this.services = data;
            } else {
                console.log('API returned error, using sample data');
                this.services = this.getSampleServices();
            }
        } catch (error) {
            console.log('Failed to fetch services:', error);
            console.log('Using sample data');
            this.services = this.getSampleServices();
        } finally {
            this.render();
        }
    }

    getSampleServices() {
        return [
            { id: 1, name: 'Консультация терапевта', description: 'Первичный осмотр и консультация врача-терапевта', price: '30 BYN', image: 'surgery-operation-surgeon-operating-room-svgrepo-com.svg' },
            { id: 2, name: 'УЗИ диагностика', description: 'Ультразвуковое исследование органов', price: '45 BYN', image: 'surgery-operation-surgeon-operating-room-svgrepo-com.svg' },
            { id: 3, name: 'Анализы крови', description: 'Общий и биохимический анализ крови', price: '25 BYN', image: 'surgery-operation-surgeon-operating-room-svgrepo-com.svg' },
            { id: 4, name: 'Кардиограмма', description: 'ЭКГ с расшифровкой', price: '20 BYN', image: 'surgery-operation-surgeon-operating-room-svgrepo-com.svg' },
            { id: 5, name: 'Рентген', description: 'Рентгенологическое исследование', price: '35 BYN', image: 'surgery-operation-surgeon-operating-room-svgrepo-com.svg' },
            { id: 6, name: 'Консультация хирурга', description: 'Осмотр и консультация врача-хирурга', price: '40 BYN', image: 'surgery-operation-surgeon-operating-room-svgrepo-com.svg' },
            { id: 7, name: 'Стоматология', description: 'Лечение и профилактика зубов', price: '50 BYN', image: 'surgery-operation-surgeon-operating-room-svgrepo-com.svg' },
            { id: 8, name: 'Офтальмология', description: 'Проверка зрения и консультация', price: '30 BYN', image: 'surgery-operation-surgeon-operating-room-svgrepo-com.svg' },
            { id: 9, name: 'Педиатрия', description: 'Консультация детского врача', price: '35 BYN', image: 'surgery-operation-surgeon-operating-room-svgrepo-com.svg' },
            { id: 10, name: 'Невролог', description: 'Консультация невролога', price: '40 BYN', image: 'surgery-operation-surgeon-operating-room-svgrepo-com.svg' },
            { id: 11, name: 'Эндокринолог', description: 'Консультация эндокринолога', price: '38 BYN', image: 'surgery-operation-surgeon-operating-room-svgrepo-com.svg' },
            { id: 12, name: 'Гинеколог', description: 'Консультация гинеколога', price: '42 BYN', image: 'surgery-operation-surgeon-operating-room-svgrepo-com.svg' }
        ];
    }

    render() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageServices = this.services.slice(start, end);

        const grid = document.getElementById('servicesGrid');
        if (!grid) return;

        grid.innerHTML = pageServices.map(service => `
            <article class="service-card" data-id="${service.id}">
                <div class="service-image">
                    <img src="/static/images/${service.image}" alt="${service.name}" 
                         onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22><rect fill=%22%23e0e0e0%22 width=%22300%22 height=%22200%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2220%22>🏥</text></svg>'" />
                </div>
                <div class="service-content">
                    <h3 class="service-title">${service.name}</h3>
                    <p class="service-description">${service.description}</p>
                    <div class="service-footer">
                        <span class="service-price">${service.price}</span>
                        <button class="btn-book" data-id="${service.id}">Записаться</button>
                    </div>
                </div>
            </article>
        `).join('');

        this.renderPagination();
        this.attachCardEffects();
    }

    renderPagination() {
        const pagination = document.getElementById('catalogPagination');
        if (!pagination) return;

        const totalPages = Math.ceil(this.services.length / this.itemsPerPage);

        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let html = '<button class="catalog-page-btn" data-action="first" title="Первая">«</button>';
        html += '<button class="catalog-page-btn" data-action="prev" title="Предыдущая">‹</button>';

        // Show page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                html += `<button class="catalog-page-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                html += '<span class="page-dots">...</span>';
            }
        }

        html += '<button class="catalog-page-btn" data-action="next" title="Следующая">›</button>';
        html += '<button class="catalog-page-btn" data-action="last" title="Последняя">»</button>';

        pagination.innerHTML = html;

        // Attach pagination events
        pagination.querySelectorAll('.catalog-page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                const page = btn.dataset.page;
                const totalPages = Math.ceil(this.services.length / this.itemsPerPage);

                if (action === 'first') {
                    this.currentPage = 1;
                } else if (action === 'prev' && this.currentPage > 1) {
                    this.currentPage--;
                } else if (action === 'next' && this.currentPage < totalPages) {
                    this.currentPage++;
                } else if (action === 'last') {
                    this.currentPage = totalPages;
                } else if (page) {
                    this.currentPage = parseInt(page);
                }

                this.render();
                
                // Scroll to top of catalog
                this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    attachCardEffects() {
        // Add event listeners to book buttons
        document.querySelectorAll('.btn-book').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                const service = this.services.find(s => s.id === id);
                alert(`Запись на услугу: ${service.name}`);
            });
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('servicesCatalogContainer')) {
            window.serviceCatalog = new ServiceCatalogPagination('servicesCatalogContainer', {
                itemsPerPage: 3,
                allowCustomItemsPerPage: true
            });
        }
    });
} else {
    if (document.getElementById('servicesCatalogContainer')) {
        window.serviceCatalog = new ServiceCatalogPagination('servicesCatalogContainer', {
            itemsPerPage: 3,
            allowCustomItemsPerPage: true
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ServiceCatalogPagination;
}
