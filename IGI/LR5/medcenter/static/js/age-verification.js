/**
 * Age Verification - Lab 3, Task 7
 * Checks user age and displays birth day of week information
 */
class AgeVerification {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id ${containerId} not found`);
            return;
        }

        this.minAge = 18;
        this.daysOfWeek = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];

        this.init();
    }

    init() {
        this.createInterface();
        this.attachEventListeners();
    }

    createInterface() {
        this.container.innerHTML = `
            <div class="age-verification-wrapper">
                <div class="age-verification-card">
                    <div class="verification-icon">🎂</div>
                    <h2>Проверка возраста</h2>
                    <p>Для доступа к сайту необходимо подтвердить ваш возраст</p>

                    <form id="ageVerificationForm" class="age-form">
                        <div class="form-group">
                            <label for="birthDate">Введите дату вашего рождения:</label>
                            <input 
                                type="date" 
                                id="birthDate" 
                                name="birthDate" 
                                max="${this.getTodayDate()}"
                                required 
                            />
                        </div>

                        <button type="submit" class="btn-verify">
                            Проверить возраст
                        </button>
                    </form>

                    <div id="verificationResult" class="verification-result" style="display: none;"></div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const form = document.getElementById('ageVerificationForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.verifyAge();
        });
    }

    getTodayDate() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    }

    getDayOfWeek(dateString) {
        const date = new Date(dateString);
        return this.daysOfWeek[date.getDay()];
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('ru-RU', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year} года`;
    }

    verifyAge() {
        const birthDateInput = document.getElementById('birthDate');
        const birthDate = birthDateInput.value;

        if (!birthDate) {
            this.showResult('error', 'Пожалуйста, введите дату рождения');
            return;
        }

        const age = this.calculateAge(birthDate);
        const dayOfWeek = this.getDayOfWeek(birthDate);
        const formattedDate = this.formatDate(birthDate);

        const resultDiv = document.getElementById('verificationResult');
        resultDiv.style.display = 'block';

        if (age >= this.minAge) {
            // User is 18 or older
            resultDiv.className = 'verification-result success';
            resultDiv.innerHTML = `
                <div class="result-icon">✓</div>
                <h3>Доступ разрешен</h3>
                <p>Ваш возраст: <strong>${age} ${this.getAgeWord(age)}</strong></p>
                <p>Вы родились ${formattedDate}</p>
                <p class="day-info">Это был <strong>${dayOfWeek}</strong></p>
                <div class="age-badge">Совершеннолетний</div>
            `;
        } else {
            // User is under 18
            resultDiv.className = 'verification-result warning';
            resultDiv.innerHTML = `
                <div class="result-icon">⚠️</div>
                <h3>Доступ ограничен</h3>
                <p>Ваш возраст: <strong>${age} ${this.getAgeWord(age)}</strong></p>
                <p>Вы родились ${formattedDate} (${dayOfWeek})</p>
                <div class="age-badge minor">Несовершеннолетний</div>
                <div class="warning-message">
                    ⚠️ Для использования данного сайта требуется разрешение родителей или законных представителей.
                </div>
            `;

            // Show alert as well
            alert('⚠️ ВНИМАНИЕ!\n\nВы являетесь несовершеннолетним.\n\nДля использования данного сайта необходимо разрешение родителей или законных представителей.');
        }

        // Scroll to result
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    getAgeWord(age) {
        const lastDigit = age % 10;
        const lastTwoDigits = age % 100;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
            return 'лет';
        }

        if (lastDigit === 1) {
            return 'год';
        }

        if (lastDigit >= 2 && lastDigit <= 4) {
            return 'года';
        }

        return 'лет';
    }

    showResult(type, message) {
        const resultDiv = document.getElementById('verificationResult');
        resultDiv.style.display = 'block';
        resultDiv.className = `verification-result ${type}`;
        resultDiv.innerHTML = `
            <div class="result-icon">${type === 'error' ? '✗' : 'ℹ'}</div>
            <p>${message}</p>
        `;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('ageVerificationContainer')) {
            window.ageVerification = new AgeVerification('ageVerificationContainer');
        }
    });
} else {
    if (document.getElementById('ageVerificationContainer')) {
        window.ageVerification = new AgeVerification('ageVerificationContainer');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AgeVerification;
}
