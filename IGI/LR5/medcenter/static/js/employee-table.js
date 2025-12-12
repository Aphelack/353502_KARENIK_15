/**
 * Employee Table Manager - Lab 3, Task 3
 * Manages employee data with sorting, filtering, pagination, and validation
 */
class EmployeeTable {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id ${containerId} not found`);
            return;
        }

        this.employees = [];
        this.filteredEmployees = [];
        this.currentPage = 1;
        this.itemsPerPage = options.itemsPerPage || 3;
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.filterText = '';
        this.selectedEmployees = new Set();

        this.init();
    }

    init() {
        this.createTableStructure();
        this.attachEventListeners();
        this.loadEmployeesFromServer();
    }

    createTableStructure() {
        this.container.innerHTML = `
            <div class="employee-table-wrapper">
                <div class="table-controls">
                    <button class="btn-add-employee" id="btnAddEmployee">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Добавить сотрудника
                    </button>
                    
                    <div class="search-box">
                        <input type="text" id="filterInput" placeholder="Поиск сотрудников..." />
                        <button id="btnSearch" class="btn-search">Найти</button>
                    </div>
                </div>

                <div id="addEmployeeForm" class="add-employee-form" style="display: none;">
                    <h3>Добавить нового сотрудника</h3>
                    <form id="employeeForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="firstName">Имя *</label>
                                <input type="text" id="firstName" required />
                            </div>
                            <div class="form-group">
                                <label for="lastName">Фамилия *</label>
                                <input type="text" id="lastName" required />
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="position">Должность *</label>
                                <input type="text" id="position" required />
                            </div>
                            <div class="form-group">
                                <label for="phone">Телефон *</label>
                                <input type="tel" id="phone" required />
                                <span class="validation-message" id="phoneValidation"></span>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="email">Email *</label>
                                <input type="email" id="email" required />
                            </div>
                            <div class="form-group">
                                <label for="photoUrl">URL фото *</label>
                                <input type="text" id="photoUrl" required />
                                <span class="validation-message" id="urlValidation"></span>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="description">Описание работы *</label>
                            <textarea id="description" rows="3" required></textarea>
                        </div>

                        <div class="form-actions">
                            <button type="submit" id="btnSubmit" class="btn-submit" disabled>
                                Добавить в таблицу
                            </button>
                            <button type="button" id="btnCancel" class="btn-cancel">
                                Отмена
                            </button>
                        </div>
                    </form>
                </div>

                <div class="table-container">
                    <table class="employee-table" id="employeeTable">
                        <thead>
                            <tr>
                                <th><input type="checkbox" id="selectAll" /></th>
                                <th data-sort="lastName">
                                    Фамилия <span class="sort-icon">⇅</span>
                                </th>
                                <th data-sort="firstName">
                                    Имя <span class="sort-icon">⇅</span>
                                </th>
                                <th>Фото</th>
                                <th data-sort="position">
                                    Должность <span class="sort-icon">⇅</span>
                                </th>
                                <th data-sort="phone">
                                    Телефон <span class="sort-icon">⇅</span>
                                </th>
                                <th data-sort="email">
                                    Email <span class="sort-icon">⇅</span>
                                </th>
                                <th>Описание работы</th>
                            </tr>
                        </thead>
                        <tbody id="employeeTableBody">
                        </tbody>
                    </table>
                </div>

                <div class="pagination" id="pagination"></div>

                <div class="selected-info">
                    <button id="btnBonus" class="btn-bonus">Премировать выбранных</button>
                    <div id="bonusMessage" class="bonus-message"></div>
                </div>

                <div class="employee-details" id="employeeDetails" style="display: none;">
                    <h3>Детали сотрудника</h3>
                    <div id="detailsContent"></div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Add employee button
        document.getElementById('btnAddEmployee').addEventListener('click', () => {
            this.toggleAddForm();
        });

        // Cancel button
        document.getElementById('btnCancel').addEventListener('click', () => {
            this.toggleAddForm();
        });

        // Search button
        document.getElementById('btnSearch').addEventListener('click', () => {
            this.filterEmployees();
        });

        // Filter input (Enter key)
        document.getElementById('filterInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.filterEmployees();
            }
        });

        // Form validation
        ['phone', 'photoUrl'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                this.validateForm();
            });
        });

        // All form inputs for enabling submit button
        document.querySelectorAll('#employeeForm input, #employeeForm textarea').forEach(input => {
            input.addEventListener('input', () => {
                this.validateForm();
            });
        });

        // Form submission
        document.getElementById('employeeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addEmployee();
        });

        // Select all checkbox
        document.getElementById('selectAll').addEventListener('change', (e) => {
            this.toggleSelectAll(e.target.checked);
        });

        // Bonus button
        document.getElementById('btnBonus').addEventListener('click', () => {
            this.showBonusMessage();
        });

        // Table header sorting
        document.querySelectorAll('[data-sort]').forEach(th => {
            th.addEventListener('click', () => {
                const column = th.dataset.sort;
                this.sortTable(column);
            });
        });
    }

    validatePhone(phone) {
        // Форматы: 80291112233, 8 (029) 1112233, +375 (29) 111-22-33, +375 (29) 111 22 33
        const patterns = [
            /^8\d{10}$/,                                    // 80291112233
            /^8\s?\(\d{3}\)\s?\d{7}$/,                     // 8 (029) 1112233
            /^\+375\s?\(\d{2}\)\s?\d{3}-\d{2}-\d{2}$/,    // +375 (29) 111-22-33
            /^\+375\s?\(\d{2}\)\s?\d{3}\s?\d{2}\s?\d{2}$/ // +375 (29) 111 22 33
        ];

        return patterns.some(pattern => pattern.test(phone));
    }

    validateUrl(url) {
        // URL должен начинаться с http:// или https:// и заканчиваться на .php или .html
        const pattern = /^https?:\/\/.+\.(php|html)$/;
        return pattern.test(url);
    }

    validateForm() {
        const phone = document.getElementById('phone').value;
        const photoUrl = document.getElementById('photoUrl').value;
        const phoneValidation = document.getElementById('phoneValidation');
        const urlValidation = document.getElementById('urlValidation');

        let isPhoneValid = false;
        let isUrlValid = false;

        // Validate phone
        if (phone) {
            if (this.validatePhone(phone)) {
                phoneValidation.textContent = '✓ Номер телефона валиден';
                phoneValidation.className = 'validation-message valid';
                document.getElementById('phone').classList.remove('invalid');
                isPhoneValid = true;
            } else {
                phoneValidation.textContent = '✗ Неверный формат телефона';
                phoneValidation.className = 'validation-message invalid';
                document.getElementById('phone').classList.add('invalid');
            }
        }

        // Validate URL
        if (photoUrl) {
            if (this.validateUrl(photoUrl)) {
                urlValidation.textContent = '✓ URL валиден';
                urlValidation.className = 'validation-message valid';
                document.getElementById('photoUrl').classList.remove('invalid');
                isUrlValid = true;
            } else {
                urlValidation.textContent = '✗ URL должен начинаться с http:// или https:// и заканчиваться на .php или .html';
                urlValidation.className = 'validation-message invalid';
                document.getElementById('photoUrl').classList.add('invalid');
            }
        }

        // Check all required fields
        const allFieldsFilled = ['firstName', 'lastName', 'position', 'phone', 'email', 'photoUrl', 'description']
            .every(id => document.getElementById(id).value.trim() !== '');

        // Enable submit button only if all fields are filled and validations pass
        document.getElementById('btnSubmit').disabled = !(allFieldsFilled && isPhoneValid && isUrlValid);
    }

    toggleAddForm() {
        const form = document.getElementById('addEmployeeForm');
        const isHidden = form.style.display === 'none';
        form.style.display = isHidden ? 'block' : 'none';
        
        if (!isHidden) {
            document.getElementById('employeeForm').reset();
            document.getElementById('phoneValidation').textContent = '';
            document.getElementById('urlValidation').textContent = '';
            document.getElementById('btnSubmit').disabled = true;
        }
    }

    async loadEmployeesFromServer() {
        console.log('Starting to load employees...');
        
        try {
            console.log('Fetching from API: /company/api/contacts/');
            // Try to fetch from Django backend
            const response = await fetch('/company/api/contacts/');
            console.log('Response status:', response.status, 'OK:', response.ok);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Received data:', data);
                // API now returns array directly
                if (Array.isArray(data) && data.length > 0) {
                    this.employees = data;
                    console.log('Loaded employees from API:', this.employees.length);
                } else {
                    console.log('API returned empty or invalid data, using sample');
                    this.employees = this.getSampleData();
                }
            } else {
                console.log('API returned error status:', response.status);
                // Fallback to sample data
                this.employees = this.getSampleData();
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            console.log('Using sample data');
            this.employees = this.getSampleData();
        } finally {
            console.log('Finally block: rendering');
            this.filteredEmployees = [...this.employees];
            console.log('Calling render with', this.filteredEmployees.length, 'employees');
            this.render();
        }
    }

    getSampleData() {
        return [
            { id: 1, firstName: 'Иван', lastName: 'Иванов', position: 'Врач-терапевт', phone: '+375 (29) 111-22-33', email: 'ivanov@med.by', photoUrl: '/static/images/doctor1.jpg', description: 'Специалист по терапии' },
            { id: 2, firstName: 'Петр', lastName: 'Петров', position: 'Хирург', phone: '8 (029) 2223344', email: 'petrov@med.by', photoUrl: '/static/images/doctor2.jpg', description: 'Опытный хирург' },
            { id: 3, firstName: 'Мария', lastName: 'Сидорова', position: 'Медсестра', phone: '80293334455', email: 'sidorova@med.by', photoUrl: '/static/images/doctor3.jpg', description: 'Медицинская сестра' },
            { id: 4, firstName: 'Анна', lastName: 'Иванова', position: 'Педиатр', phone: '+375 (29) 444 55 66', email: 'anna@med.by', photoUrl: '/static/images/doctor4.jpg', description: 'Детский врач' },
            { id: 5, firstName: 'Сергей', lastName: 'Козлов', position: 'Кардиолог', phone: '8 (029) 5556677', email: 'kozlov@med.by', photoUrl: '/static/images/doctor5.jpg', description: 'Специалист по сердцу' },
            { id: 6, firstName: 'Елена', lastName: 'Смирнова', position: 'Офтальмолог', phone: '+375 (29) 666-77-88', email: 'smirnova@med.by', photoUrl: '/static/images/doctor6.jpg', description: 'Глазной врач' },
            { id: 7, firstName: 'Дмитрий', lastName: 'Волков', position: 'Стоматолог', phone: '80297778899', email: 'volkov@med.by', photoUrl: '/static/images/doctor7.jpg', description: 'Зубной врач' },
            { id: 8, firstName: 'Ольга', lastName: 'Новикова', position: 'Гинеколог', phone: '8 (029) 8889900', email: 'novikova@med.by', photoUrl: '/static/images/doctor8.jpg', description: 'Женский врач' },
            { id: 9, firstName: 'Алексей', lastName: 'Морозов', position: 'Невролог', phone: '+375 (29) 999 00 11', email: 'morozov@med.by', photoUrl: '/static/images/doctor9.jpg', description: 'Невролог' },
            { id: 10, firstName: 'Татьяна', lastName: 'Лебедева', position: 'Эндокринолог', phone: '+375 (29) 000-11-22', email: 'lebedeva@med.by', photoUrl: '/static/images/doctor10.jpg', description: 'Специалист по гормонам' }
        ];
    }

    addEmployee() {
        const newEmployee = {
            id: Date.now(),
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            position: document.getElementById('position').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            photoUrl: document.getElementById('photoUrl').value,
            description: document.getElementById('description').value
        };

        this.employees.push(newEmployee);
        this.filteredEmployees = [...this.employees];
        this.toggleAddForm();
        this.render();
    }

    filterEmployees() {
        this.filterText = document.getElementById('filterInput').value.toLowerCase();
        
        if (!this.filterText) {
            this.filteredEmployees = [...this.employees];
        } else {
            this.filteredEmployees = this.employees.filter(emp => {
                return Object.values(emp).some(value => 
                    String(value).toLowerCase().includes(this.filterText)
                );
            });
        }
        
        this.currentPage = 1;
        this.render();
    }

    sortTable(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        this.filteredEmployees.sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];

            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (this.sortDirection === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        this.render();
        this.updateSortIcons();
    }

    updateSortIcons() {
        document.querySelectorAll('[data-sort]').forEach(th => {
            const icon = th.querySelector('.sort-icon');
            if (th.dataset.sort === this.sortColumn) {
                icon.textContent = this.sortDirection === 'asc' ? '↑' : '↓';
            } else {
                icon.textContent = '⇅';
            }
        });
    }

    toggleSelectAll(checked) {
        const checkboxes = document.querySelectorAll('.employee-checkbox');
        checkboxes.forEach(cb => {
            cb.checked = checked;
            const id = parseInt(cb.dataset.id);
            if (checked) {
                this.selectedEmployees.add(id);
            } else {
                this.selectedEmployees.delete(id);
            }
        });
    }

    showBonusMessage() {
        const bonusMessage = document.getElementById('bonusMessage');
        
        if (this.selectedEmployees.size === 0) {
            bonusMessage.textContent = 'Выберите сотрудников для премирования';
            bonusMessage.className = 'bonus-message error';
            return;
        }

        const selectedEmps = this.employees.filter(emp => 
            this.selectedEmployees.has(emp.id)
        );

        const names = selectedEmps.map(emp => emp.lastName).join(', ');
        bonusMessage.textContent = `Премирование: ${names}. Поздравляем с заслуженной наградой!`;
        bonusMessage.className = 'bonus-message success';
    }

    showEmployeeDetails(employee) {
        const details = document.getElementById('employeeDetails');
        const content = document.getElementById('detailsContent');
        
        content.innerHTML = `
            <div class="detail-row"><strong>ФИО:</strong> ${employee.lastName} ${employee.firstName}</div>
            <div class="detail-row"><strong>Должность:</strong> ${employee.position}</div>
            <div class="detail-row"><strong>Телефон:</strong> ${employee.phone}</div>
            <div class="detail-row"><strong>Email:</strong> ${employee.email}</div>
            <div class="detail-row"><strong>Описание:</strong> ${employee.description}</div>
            <div class="detail-row"><strong>Фото:</strong> <a href="${employee.photoUrl}" target="_blank">${employee.photoUrl}</a></div>
        `;
        
        details.style.display = 'block';
    }

    render() {
        console.log('Render called with', this.filteredEmployees.length, 'employees');
        const tbody = document.getElementById('employeeTableBody');
        if (!tbody) {
            console.error('employeeTableBody element not found!');
            return;
        }
        
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageEmployees = this.filteredEmployees.slice(start, end);
        console.log('Rendering page', this.currentPage, ':', pageEmployees.length, 'employees');

        tbody.innerHTML = pageEmployees.map(emp => `
            <tr class="employee-row" data-id="${emp.id}">
                <td><input type="checkbox" class="employee-checkbox" data-id="${emp.id}" /></td>
                <td>${emp.lastName}</td>
                <td>${emp.firstName}</td>
                <td><img src="${emp.photoUrl}" alt="${emp.firstName}" class="employee-photo" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22>No Image</text></svg>'" /></td>
                <td>${emp.position}</td>
                <td>${emp.phone}</td>
                <td>${emp.email}</td>
                <td>${emp.description}</td>
            </tr>
        `).join('');
        
        console.log('HTML set, tbody children count:', tbody.children.length);

        // Attach row click and checkbox events
        document.querySelectorAll('.employee-row').forEach(row => {
            row.addEventListener('click', (e) => {
                if (!e.target.classList.contains('employee-checkbox')) {
                    const id = parseInt(row.dataset.id);
                    const employee = this.employees.find(emp => emp.id === id);
                    this.showEmployeeDetails(employee);
                }
            });
        });

        document.querySelectorAll('.employee-checkbox').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const id = parseInt(cb.dataset.id);
                if (cb.checked) {
                    this.selectedEmployees.add(id);
                } else {
                    this.selectedEmployees.delete(id);
                }
            });
        });

        console.log('About to render pagination');
        this.renderPagination();
        console.log('Render complete!');
    }

    renderPagination() {
        console.log('renderPagination called');
        const pagination = document.getElementById('pagination');
        const totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage);

        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let html = '<button class="page-btn" data-page="prev">‹ Назад</button>';

        for (let i = 1; i <= totalPages; i++) {
            html += `<button class="page-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }

        html += '<button class="page-btn" data-page="next">Далее ›</button>';

        pagination.innerHTML = html;

        // Attach pagination events
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = btn.dataset.page;
                if (page === 'prev' && this.currentPage > 1) {
                    this.currentPage--;
                } else if (page === 'next' && this.currentPage < totalPages) {
                    this.currentPage++;
                } else if (page !== 'prev' && page !== 'next') {
                    this.currentPage = parseInt(page);
                }
                this.render();
            });
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('employeeTableContainer')) {
            window.employeeTable = new EmployeeTable('employeeTableContainer');
        }
    });
} else {
    if (document.getElementById('employeeTableContainer')) {
        window.employeeTable = new EmployeeTable('employeeTableContainer');
    }
}
