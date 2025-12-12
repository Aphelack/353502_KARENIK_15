/**
 * Class Inheritance - Lab 3, Task 8
 * Variant 2: Cars with marks, numbers, and owners
 * Implements both prototypal and ES6 class inheritance
 */

// ================== VERSION 1: PROTOTYPAL INHERITANCE ==================

/**
 * Base class (constructor function) - Vehicle
 */
function Vehicle(mark, number) {
    this.mark = mark;
    this.number = number;
}

// Getter for mark
Vehicle.prototype.getMark = function() {
    return this.mark;
};

// Setter for mark
Vehicle.prototype.setMark = function(mark) {
    this.mark = mark;
};

// Getter for number
Vehicle.prototype.getNumber = function() {
    return this.number;
};

// Setter for number
Vehicle.prototype.setNumber = function(number) {
    this.number = number;
};

// Method to display vehicle info
Vehicle.prototype.displayInfo = function() {
    return `${this.mark} (${this.number})`;
};

/**
 * Derived class - Car (inherits from Vehicle)
 */
function Car(mark, number, owner) {
    Vehicle.call(this, mark, number);
    this.owner = owner;
}

// Establish prototype chain
Car.prototype = Object.create(Vehicle.prototype);
Car.prototype.constructor = Car;

// Getter for owner
Car.prototype.getOwner = function() {
    return this.owner;
};

// Setter for owner
Car.prototype.setOwner = function(owner) {
    this.owner = owner;
};

// Override displayInfo
Car.prototype.displayInfo = function() {
    return `${this.mark} (${this.number}) - Владелец: ${this.owner}`;
};

/**
 * Car Manager - Prototypal version
 */
function CarManagerPrototypal() {
    this.cars = [];
}

// Add car from form
CarManagerPrototypal.prototype.addFromForm = function(formId) {
    const form = document.getElementById(formId);
    const mark = form.querySelector('[name="mark"]').value;
    const number = form.querySelector('[name="number"]').value;
    const owner = form.querySelector('[name="owner"]').value;

    if (mark && number && owner) {
        const car = new Car(mark, number, owner);
        this.cars.push(car);
        form.reset();
        return true;
    }
    return false;
};

// Display all cars
CarManagerPrototypal.prototype.displayAll = function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (this.cars.length === 0) {
        container.innerHTML = '<p class="no-data">Нет автомобилей в базе</p>';
        return;
    }

    let html = '<div class="cars-list">';
    this.cars.forEach((car, index) => {
        html += `
            <div class="car-item">
                <span class="car-number">${index + 1}</span>
                <span class="car-info">${car.displayInfo()}</span>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
};

// Find cars by mark and display result
CarManagerPrototypal.prototype.findByMarkAndDisplay = function(mark, resultContainerId) {
    const container = document.getElementById(resultContainerId);
    if (!container) return;

    const found = this.cars.filter(car => 
        car.getMark().toLowerCase().includes(mark.toLowerCase())
    );

    if (found.length === 0) {
        container.innerHTML = `<p class="no-results">Автомобили марки "${mark}" не найдены</p>`;
        return;
    }

    let html = `<h4>Найдено автомобилей марки "${mark}": ${found.length}</h4>`;
    html += '<div class="search-results">';
    found.forEach(car => {
        html += `
            <div class="result-item">
                <strong>Номер:</strong> ${car.getNumber()}<br>
                <strong>Владелец:</strong> ${car.getOwner()}
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
};

// ================== VERSION 2: ES6 CLASS INHERITANCE ==================

/**
 * Base class - VehicleES6
 */
class VehicleES6 {
    constructor(mark, number) {
        this.mark = mark;
        this.number = number;
    }

    // Getter
    getMark() {
        return this.mark;
    }

    // Setter
    setMark(mark) {
        this.mark = mark;
    }

    // Getter
    getNumber() {
        return this.number;
    }

    // Setter
    setNumber(number) {
        this.number = number;
    }

    // Display method
    displayInfo() {
        return `${this.mark} (${this.number})`;
    }
}

/**
 * Derived class - CarES6 (extends VehicleES6)
 */
class CarES6 extends VehicleES6 {
    constructor(mark, number, owner) {
        super(mark, number);
        this.owner = owner;
    }

    // Getter
    getOwner() {
        return this.owner;
    }

    // Setter
    setOwner(owner) {
        this.owner = owner;
    }

    // Override displayInfo
    displayInfo() {
        return `${this.mark} (${this.number}) - Владелец: ${this.owner}`;
    }
}

/**
 * Car Manager - ES6 version
 */
class CarManagerES6 {
    constructor() {
        this.cars = [];
    }

    // Add car from form
    addFromForm(formId) {
        const form = document.getElementById(formId);
        const mark = form.querySelector('[name="mark"]').value;
        const number = form.querySelector('[name="number"]').value;
        const owner = form.querySelector('[name="owner"]').value;

        if (mark && number && owner) {
            const car = new CarES6(mark, number, owner);
            this.cars.push(car);
            form.reset();
            return true;
        }
        return false;
    }

    // Display all cars
    displayAll(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (this.cars.length === 0) {
            container.innerHTML = '<p class="no-data">Нет автомобилей в базе</p>';
            return;
        }

        let html = '<div class="cars-list">';
        this.cars.forEach((car, index) => {
            html += `
                <div class="car-item">
                    <span class="car-number">${index + 1}</span>
                    <span class="car-info">${car.displayInfo()}</span>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    }

    // Find cars by mark and display result
    findByMarkAndDisplay(mark, resultContainerId) {
        const container = document.getElementById(resultContainerId);
        if (!container) return;

        const found = this.cars.filter(car => 
            car.getMark().toLowerCase().includes(mark.toLowerCase())
        );

        if (found.length === 0) {
            container.innerHTML = `<p class="no-results">Автомобили марки "${mark}" не найдены</p>`;
            return;
        }

        let html = `<h4>Найдено автомобилей марки "${mark}": ${found.length}</h4>`;
        html += '<div class="search-results">';
        found.forEach(car => {
            html += `
                <div class="result-item">
                    <strong>Номер:</strong> ${car.getNumber()}<br>
                    <strong>Владелец:</strong> ${car.getOwner()}
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    }
}

// ================== DEMO APPLICATION ==================

class CarInheritanceDemo {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id ${containerId} not found`);
            return;
        }

        this.prototypalManager = new CarManagerPrototypal();
        this.es6Manager = new CarManagerES6();

        this.init();
    }

    init() {
        this.createInterface();
        this.attachEventListeners();
        this.addSampleData();
    }

    createInterface() {
        this.container.innerHTML = `
            <div class="inheritance-demo-wrapper">
                <h2>Демонстрация наследования классов</h2>
                <p class="subtitle">Задача: Управление автомобилями (марка, номер, владелец)</p>

                <div class="demo-tabs">
                    <button class="tab-btn active" data-tab="prototypal">
                        Прототипное наследование
                    </button>
                    <button class="tab-btn" data-tab="es6">
                        ES6 Class/Extends
                    </button>
                </div>

                <!-- Prototypal Version -->
                <div id="prototypal-tab" class="tab-content active">
                    <h3>Прототипное наследование (Function + prototype)</h3>
                    
                    <form id="prototypalForm" class="car-form">
                        <div class="form-row">
                            <input type="text" name="mark" placeholder="Марка автомобиля" required />
                            <input type="text" name="number" placeholder="Номер" required />
                            <input type="text" name="owner" placeholder="Владелец" required />
                        </div>
                        <button type="submit" class="btn-add">Добавить автомобиль</button>
                    </form>

                    <div class="cars-display" id="prototypalCars"></div>

                    <div class="search-section">
                        <h4>Поиск по марке</h4>
                        <div class="search-form">
                            <input type="text" id="prototypalSearch" placeholder="Введите марку" />
                            <button id="prototypalSearchBtn" class="btn-search">Найти</button>
                        </div>
                        <div id="prototypalResults" class="search-results-container"></div>
                    </div>
                </div>

                <!-- ES6 Version -->
                <div id="es6-tab" class="tab-content">
                    <h3>ES6 Class наследование (class/extends)</h3>
                    
                    <form id="es6Form" class="car-form">
                        <div class="form-row">
                            <input type="text" name="mark" placeholder="Марка автомобиля" required />
                            <input type="text" name="number" placeholder="Номер" required />
                            <input type="text" name="owner" placeholder="Владелец" required />
                        </div>
                        <button type="submit" class="btn-add">Добавить автомобиль</button>
                    </form>

                    <div class="cars-display" id="es6Cars"></div>

                    <div class="search-section">
                        <h4>Поиск по марке</h4>
                        <div class="search-form">
                            <input type="text" id="es6Search" placeholder="Введите марку" />
                            <button id="es6SearchBtn" class="btn-search">Найти</button>
                        </div>
                        <div id="es6Results" class="search-results-container"></div>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });

        // Prototypal form
        document.getElementById('prototypalForm').addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.prototypalManager.addFromForm('prototypalForm')) {
                this.prototypalManager.displayAll('prototypalCars');
            }
        });

        // ES6 form
        document.getElementById('es6Form').addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.es6Manager.addFromForm('es6Form')) {
                this.es6Manager.displayAll('es6Cars');
            }
        });

        // Prototypal search
        document.getElementById('prototypalSearchBtn').addEventListener('click', () => {
            const mark = document.getElementById('prototypalSearch').value;
            if (mark) {
                this.prototypalManager.findByMarkAndDisplay(mark, 'prototypalResults');
            }
        });

        // ES6 search
        document.getElementById('es6SearchBtn').addEventListener('click', () => {
            const mark = document.getElementById('es6Search').value;
            if (mark) {
                this.es6Manager.findByMarkAndDisplay(mark, 'es6Results');
            }
        });
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });
    }

    addSampleData() {
        // Add sample data to both managers
        const sampleCars = [
            { mark: 'Toyota', number: '1234 AB-5', owner: 'Иванов И.И.' },
            { mark: 'BMW', number: '5678 CD-7', owner: 'Петров П.П.' },
            { mark: 'Toyota', number: '9012 EF-3', owner: 'Сидоров С.С.' },
            { mark: 'Mercedes', number: '3456 GH-2', owner: 'Козлов К.К.' },
        ];

        sampleCars.forEach(car => {
            this.prototypalManager.cars.push(new Car(car.mark, car.number, car.owner));
            this.es6Manager.cars.push(new CarES6(car.mark, car.number, car.owner));
        });

        this.prototypalManager.displayAll('prototypalCars');
        this.es6Manager.displayAll('es6Cars');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('classInheritanceContainer')) {
            window.carInheritanceDemo = new CarInheritanceDemo('classInheritanceContainer');
        }
    });
} else {
    if (document.getElementById('classInheritanceContainer')) {
        window.carInheritanceDemo = new CarInheritanceDemo('classInheritanceContainer');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CarManagerPrototypal, CarManagerES6, CarInheritanceDemo };
}
