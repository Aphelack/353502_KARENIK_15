/**
 * Additional APIs Demo - Lab 3, Task 9
 * Demonstrates usage of Geolocation, Speech Synthesis, and Battery APIs
 */

class AdditionalAPIsDemo {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id ${containerId} not found`);
            return;
        }

        this.init();
    }

    init() {
        this.createInterface();
        this.attachEventListeners();
        this.checkAPISupport();
    }

    createInterface() {
        this.container.innerHTML = `
            <div class="apis-demo-wrapper">
                <h2>Демонстрация дополнительных API</h2>

                <!-- Geolocation API -->
                <section class="api-section">
                    <h3>🌍 Geolocation API</h3>
                    <p>Определение текущего местоположения пользователя</p>
                    
                    <button id="btnGetLocation" class="api-btn">
                        Получить местоположение
                    </button>

                    <div id="locationResult" class="api-result"></div>
                </section>

                <!-- Speech Synthesis API -->
                <section class="api-section">
                    <h3>🗣️ Speech Synthesis API</h3>
                    <p>Синтез речи из текста</p>
                    
                    <div class="speech-controls">
                        <textarea id="speechText" rows="3" placeholder="Введите текст для озвучивания...">Добро пожаловать в наш медицинский центр! Мы рады вам помочь.</textarea>
                        
                        <div class="speech-options">
                            <label>
                                Язык:
                                <select id="speechLang">
                                    <option value="ru-RU">Русский</option>
                                    <option value="en-US">English</option>
                                    <option value="de-DE">Deutsch</option>
                                </select>
                            </label>

                            <label>
                                Скорость:
                                <input type="range" id="speechRate" min="0.5" max="2" step="0.1" value="1" />
                                <span id="rateValue">1.0</span>
                            </label>

                            <label>
                                Высота тона:
                                <input type="range" id="speechPitch" min="0" max="2" step="0.1" value="1" />
                                <span id="pitchValue">1.0</span>
                            </label>
                        </div>

                        <div class="speech-buttons">
                            <button id="btnSpeak" class="api-btn">Озвучить</button>
                            <button id="btnPause" class="api-btn secondary">Пауза</button>
                            <button id="btnResume" class="api-btn secondary">Продолжить</button>
                            <button id="btnStop" class="api-btn danger">Остановить</button>
                        </div>
                    </div>

                    <div id="speechResult" class="api-result"></div>
                </section>

                <!-- Battery API -->
                <section class="api-section">
                    <h3>🔋 Battery Status API</h3>
                    <p>Информация о состоянии батареи устройства</p>
                    
                    <button id="btnGetBattery" class="api-btn">
                        Проверить батарею
                    </button>

                    <div id="batteryResult" class="api-result"></div>
                </section>

                <!-- Additional: Clipboard API -->
                <section class="api-section">
                    <h3>📋 Clipboard API</h3>
                    <p>Работа с буфером обмена</p>
                    
                    <div class="clipboard-controls">
                        <input type="text" id="clipboardText" placeholder="Текст для копирования" value="Медицинский центр - ваше здоровье!" />
                        <button id="btnCopy" class="api-btn">Копировать</button>
                        <button id="btnPaste" class="api-btn">Вставить</button>
                    </div>

                    <div id="clipboardResult" class="api-result"></div>
                </section>
            </div>
        `;
    }

    attachEventListeners() {
        // Geolocation
        document.getElementById('btnGetLocation').addEventListener('click', () => {
            this.getGeolocation();
        });

        // Speech Synthesis
        const rateInput = document.getElementById('speechRate');
        const pitchInput = document.getElementById('speechPitch');
        
        rateInput.addEventListener('input', (e) => {
            document.getElementById('rateValue').textContent = e.target.value;
        });

        pitchInput.addEventListener('input', (e) => {
            document.getElementById('pitchValue').textContent = e.target.value;
        });

        document.getElementById('btnSpeak').addEventListener('click', () => {
            this.speak();
        });

        document.getElementById('btnPause').addEventListener('click', () => {
            this.pauseSpeech();
        });

        document.getElementById('btnResume').addEventListener('click', () => {
            this.resumeSpeech();
        });

        document.getElementById('btnStop').addEventListener('click', () => {
            this.stopSpeech();
        });

        // Battery
        document.getElementById('btnGetBattery').addEventListener('click', () => {
            this.getBatteryStatus();
        });

        // Clipboard
        document.getElementById('btnCopy').addEventListener('click', () => {
            this.copyToClipboard();
        });

        document.getElementById('btnPaste').addEventListener('click', () => {
            this.pasteFromClipboard();
        });
    }

    checkAPISupport() {
        // Check Geolocation API support
        if (!('geolocation' in navigator)) {
            document.getElementById('locationResult').innerHTML = 
                '<p class="error">❌ Geolocation API не поддерживается</p>';
        }

        // Check Speech Synthesis API support
        if (!('speechSynthesis' in window)) {
            document.getElementById('speechResult').innerHTML = 
                '<p class="error">❌ Speech Synthesis API не поддерживается</p>';
        }

        // Check Battery API support
        if (!('getBattery' in navigator)) {
            document.getElementById('batteryResult').innerHTML = 
                '<p class="warning">⚠️ Battery API не поддерживается в этом браузере</p>';
        }
    }

    // ========== GEOLOCATION API ==========
    getGeolocation() {
        const resultDiv = document.getElementById('locationResult');
        resultDiv.innerHTML = '<p class="loading">⏳ Определяем местоположение...</p>';

        if (!('geolocation' in navigator)) {
            resultDiv.innerHTML = '<p class="error">❌ Geolocation API не поддерживается</p>';
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                
                resultDiv.innerHTML = `
                    <div class="location-info">
                        <h4>✅ Местоположение определено</h4>
                        <p><strong>Широта:</strong> ${latitude.toFixed(6)}°</p>
                        <p><strong>Долгота:</strong> ${longitude.toFixed(6)}°</p>
                        <p><strong>Точность:</strong> ${accuracy.toFixed(0)} метров</p>
                        <a href="https://www.google.com/maps?q=${latitude},${longitude}" target="_blank" class="map-link">
                            📍 Показать на карте
                        </a>
                    </div>
                `;
            },
            (error) => {
                let errorMessage = '';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Пользователь отклонил запрос на геолокацию';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Информация о местоположении недоступна';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Превышено время ожидания запроса';
                        break;
                    default:
                        errorMessage = 'Произошла неизвестная ошибка';
                }
                resultDiv.innerHTML = `<p class="error">❌ ${errorMessage}</p>`;
            }
        );
    }

    // ========== SPEECH SYNTHESIS API ==========
    speak() {
        const text = document.getElementById('speechText').value;
        const lang = document.getElementById('speechLang').value;
        const rate = parseFloat(document.getElementById('speechRate').value);
        const pitch = parseFloat(document.getElementById('speechPitch').value);
        const resultDiv = document.getElementById('speechResult');

        if (!text) {
            resultDiv.innerHTML = '<p class="error">❌ Введите текст для озвучивания</p>';
            return;
        }

        if (!('speechSynthesis' in window)) {
            resultDiv.innerHTML = '<p class="error">❌ Speech Synthesis не поддерживается</p>';
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = rate;
        utterance.pitch = pitch;

        utterance.onstart = () => {
            resultDiv.innerHTML = '<p class="success">🗣️ Идет озвучивание...</p>';
        };

        utterance.onend = () => {
            resultDiv.innerHTML = '<p class="success">✅ Озвучивание завершено</p>';
        };

        utterance.onerror = (event) => {
            resultDiv.innerHTML = `<p class="error">❌ Ошибка: ${event.error}</p>`;
        };

        window.speechSynthesis.speak(utterance);
    }

    pauseSpeech() {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            document.getElementById('speechResult').innerHTML = '<p class="warning">⏸️ Озвучивание приостановлено</p>';
        }
    }

    resumeSpeech() {
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            document.getElementById('speechResult').innerHTML = '<p class="success">▶️ Озвучивание возобновлено</p>';
        }
    }

    stopSpeech() {
        window.speechSynthesis.cancel();
        document.getElementById('speechResult').innerHTML = '<p class="info">⏹️ Озвучивание остановлено</p>';
    }

    // ========== BATTERY API ==========
    async getBatteryStatus() {
        const resultDiv = document.getElementById('batteryResult');
        resultDiv.innerHTML = '<p class="loading">⏳ Получаем информацию о батарее...</p>';

        if (!('getBattery' in navigator)) {
            resultDiv.innerHTML = '<p class="warning">⚠️ Battery API не поддерживается</p>';
            return;
        }

        try {
            const battery = await navigator.getBattery();
            
            const level = (battery.level * 100).toFixed(0);
            const charging = battery.charging ? 'Да' : 'Нет';
            const chargingTime = battery.chargingTime === Infinity ? 'Н/Д' : `${Math.floor(battery.chargingTime / 60)} мин`;
            const dischargingTime = battery.dischargingTime === Infinity ? 'Н/Д' : `${Math.floor(battery.dischargingTime / 60)} мин`;

            let batteryIcon = '🔋';
            if (battery.charging) {
                batteryIcon = '🔌';
            } else if (level < 20) {
                batteryIcon = '🪫';
            }

            resultDiv.innerHTML = `
                <div class="battery-info">
                    <div class="battery-icon">${batteryIcon}</div>
                    <h4>Информация о батарее</h4>
                    <div class="battery-level">
                        <div class="battery-bar" style="width: ${level}%"></div>
                        <span class="battery-percent">${level}%</span>
                    </div>
                    <p><strong>Заряжается:</strong> ${charging}</p>
                    <p><strong>Время до полной зарядки:</strong> ${chargingTime}</p>
                    <p><strong>Время до разрядки:</strong> ${dischargingTime}</p>
                </div>
            `;
        } catch (error) {
            resultDiv.innerHTML = `<p class="error">❌ Ошибка: ${error.message}</p>`;
        }
    }

    // ========== CLIPBOARD API ==========
    async copyToClipboard() {
        const text = document.getElementById('clipboardText').value;
        const resultDiv = document.getElementById('clipboardResult');

        try {
            await navigator.clipboard.writeText(text);
            resultDiv.innerHTML = '<p class="success">✅ Текст скопирован в буфер обмена</p>';
        } catch (error) {
            resultDiv.innerHTML = `<p class="error">❌ Ошибка копирования: ${error.message}</p>`;
        }
    }

    async pasteFromClipboard() {
        const resultDiv = document.getElementById('clipboardResult');

        try {
            const text = await navigator.clipboard.readText();
            document.getElementById('clipboardText').value = text;
            resultDiv.innerHTML = `<p class="success">✅ Текст вставлен из буфера: "${text}"</p>`;
        } catch (error) {
            resultDiv.innerHTML = `<p class="error">❌ Ошибка вставки: ${error.message}</p>`;
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('apisContainer')) {
            window.apisDemo = new AdditionalAPIsDemo('apisContainer');
        }
    });
} else {
    if (document.getElementById('apisContainer')) {
        window.apisDemo = new AdditionalAPIsDemo('apisContainer');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdditionalAPIsDemo;
}
