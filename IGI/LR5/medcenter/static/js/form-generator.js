/**
 * Form Element Generator - Lab 3, Task 4
 * Variant 10: <input type="checkbox"> with attributes: name, value, checked, required, disabled
 * Generates form elements with persistence using localStorage
 */
class FormElementGenerator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id ${containerId} not found`);
            return;
        }

        this.elements = [];
        this.nextId = 1;

        this.init();
    }

    init() {
        this.loadFromStorage();
        this.createInterface();
        this.renderElements();
    }

    createInterface() {
        this.container.innerHTML = `
            <div class="form-generator-wrapper">
                <div class="generator-header">
                    <h2>Генератор элементов формы</h2>
                    <p>Создание чекбоксов с настраиваемыми атрибутами</p>
                </div>

                <div class="generator-controls">
                    <label class="add-checkbox-control">
                        <input type="checkbox" id="addCheckboxTrigger" />
                        <span>Добавить новый чекбокс</span>
                    </label>
                </div>

                <div id="checkboxConfigurator" class="checkbox-configurator" style="display: none;">
                    <h3>Настройка чекбокса</h3>
                    
                    <div class="config-grid">
                        <div class="config-field">
                            <label for="cbxName">Name (имя элемента)</label>
                            <input type="text" id="cbxName" placeholder="Например: agreement" />
                        </div>

                        <div class="config-field">
                            <label for="cbxValue">Value (значение)</label>
                            <input type="text" id="cbxValue" placeholder="Например: yes" />
                        </div>

                        <div class="config-field">
                            <label class="checkbox-label">
                                <input type="checkbox" id="cbxChecked" />
                                <span>Checked (отмечен по умолчанию)</span>
                            </label>
                        </div>

                        <div class="config-field">
                            <label class="checkbox-label">
                                <input type="checkbox" id="cbxRequired" />
                                <span>Required (обязательный)</span>
                            </label>
                        </div>

                        <div class="config-field">
                            <label class="checkbox-label">
                                <input type="checkbox" id="cbxDisabled" />
                                <span>Disabled (отключен)</span>
                            </label>
                        </div>

                        <div class="config-field full-width">
                            <label for="cbxLabel">Текст метки</label>
                            <input type="text" id="cbxLabel" placeholder="Текст рядом с чекбоксом" />
                        </div>
                    </div>

                    <div class="config-actions">
                        <button id="btnCreateCheckbox" class="btn-create">
                            Создать чекбокс
                        </button>
                        <button id="btnCancelConfig" class="btn-cancel-config">
                            Отмена
                        </button>
                    </div>
                </div>

                <div class="generated-elements" id="generatedElements">
                    <h3>Созданные элементы</h3>
                    <div id="elementsContainer" class="elements-container"></div>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        // Toggle configurator
        document.getElementById('addCheckboxTrigger').addEventListener('change', (e) => {
            this.toggleConfigurator(e.target.checked);
        });

        // Create button
        document.getElementById('btnCreateCheckbox').addEventListener('click', () => {
            this.createCheckbox();
        });

        // Cancel button
        document.getElementById('btnCancelConfig').addEventListener('click', () => {
            document.getElementById('addCheckboxTrigger').checked = false;
            this.toggleConfigurator(false);
        });
    }

    toggleConfigurator(show) {
        const configurator = document.getElementById('checkboxConfigurator');
        configurator.style.display = show ? 'block' : 'none';

        if (!show) {
            this.resetConfigurator();
        }
    }

    resetConfigurator() {
        document.getElementById('cbxName').value = '';
        document.getElementById('cbxValue').value = '';
        document.getElementById('cbxChecked').checked = false;
        document.getElementById('cbxRequired').checked = false;
        document.getElementById('cbxDisabled').checked = false;
        document.getElementById('cbxLabel').value = '';
    }

    createCheckbox() {
        const config = {
            id: this.nextId++,
            type: 'checkbox',
            name: document.getElementById('cbxName').value || `checkbox_${this.nextId}`,
            value: document.getElementById('cbxValue').value || 'on',
            checked: document.getElementById('cbxChecked').checked,
            required: document.getElementById('cbxRequired').checked,
            disabled: document.getElementById('cbxDisabled').checked,
            label: document.getElementById('cbxLabel').value || 'Чекбокс'
        };

        this.elements.push(config);
        this.saveToStorage();
        this.renderElements();

        // Close configurator
        document.getElementById('addCheckboxTrigger').checked = false;
        this.toggleConfigurator(false);
    }

    deleteElement(id) {
        this.elements = this.elements.filter(el => el.id !== id);
        this.saveToStorage();
        this.renderElements();
    }

    renderElements() {
        const container = document.getElementById('elementsContainer');

        if (this.elements.length === 0) {
            container.innerHTML = '<p class="no-elements">Пока нет созданных элементов. Добавьте чекбокс!</p>';
            return;
        }

        container.innerHTML = this.elements.map(el => `
            <div class="element-card" data-id="${el.id}">
                <div class="element-preview">
                    <label class="preview-label">
                        <input 
                            type="checkbox" 
                            name="${el.name}"
                            value="${el.value}"
                            ${el.checked ? 'checked' : ''}
                            ${el.required ? 'required' : ''}
                            ${el.disabled ? 'disabled' : ''}
                            class="preview-checkbox"
                        />
                        <span>${el.label}</span>
                        ${el.required ? '<span class="required-mark">*</span>' : ''}
                    </label>
                </div>

                <div class="element-info">
                    <div class="info-row">
                        <strong>Name:</strong> <code>${el.name}</code>
                    </div>
                    <div class="info-row">
                        <strong>Value:</strong> <code>${el.value}</code>
                    </div>
                    <div class="info-row">
                        <strong>Атрибуты:</strong> 
                        ${el.checked ? '<span class="badge">checked</span>' : ''}
                        ${el.required ? '<span class="badge">required</span>' : ''}
                        ${el.disabled ? '<span class="badge">disabled</span>' : ''}
                    </div>
                </div>

                <button class="btn-delete" data-id="${el.id}" title="Удалить элемент">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                </button>
            </div>
        `).join('');

        // Attach delete event listeners
        container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                if (confirm('Удалить этот элемент?')) {
                    this.deleteElement(id);
                }
            });
        });
    }

    saveToStorage() {
        localStorage.setItem('formElements', JSON.stringify(this.elements));
        localStorage.setItem('formElementsNextId', this.nextId);
    }

    loadFromStorage() {
        const stored = localStorage.getItem('formElements');
        const storedNextId = localStorage.getItem('formElementsNextId');

        if (stored) {
            try {
                this.elements = JSON.parse(stored);
            } catch (e) {
                console.error('Error loading from storage:', e);
                this.elements = [];
            }
        }

        if (storedNextId) {
            this.nextId = parseInt(storedNextId);
        }
    }

    clearAll() {
        if (confirm('Удалить все созданные элементы?')) {
            this.elements = [];
            this.saveToStorage();
            this.renderElements();
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('formGeneratorContainer')) {
            window.formGenerator = new FormElementGenerator('formGeneratorContainer');
        }
    });
} else {
    if (document.getElementById('formGeneratorContainer')) {
        window.formGenerator = new FormElementGenerator('formGeneratorContainer');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormElementGenerator;
}
