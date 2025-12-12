/**
 * Preloader functionality with medical theme
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('.progress-bar');
    
    if (!preloader) return;
    
    // Функция для скрытия прелоадера
    function hidePreloader() {
        preloader.classList.add('hidden');
        // Полное удаление из DOM после анимации
        setTimeout(() => {
            preloader.style.display = 'none';
            document.body.classList.remove('preloader-active');
        }, 500);
    }
    
    // Функция для обновления прогресса
    function updateProgress(progress) {
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    }
    
    // Симуляция прогресса загрузки
    function simulateProgress() {
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            updateProgress(progress);
            
            if (progress === 100) {
                clearInterval(progressInterval);
                setTimeout(hidePreloader, 300);
            }
        }, 200);
    }
    
    // Показываем прелоадер при начале загрузки
    document.body.classList.add('preloader-active');
    
    // Основной обработчик - когда вся страница загружена
    window.addEventListener('load', function() {
        // Если страница загрузилась быстро, показываем прелоадер минимум 1.5 секунды
        const minDisplayTime = 1500;
        const loadTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
        
        if (loadTime < minDisplayTime) {
            const remainingTime = minDisplayTime - loadTime;
            simulateProgress();
            setTimeout(hidePreloader, remainingTime);
        } else {
            simulateProgress();
        }
    });
    
    // Fallback - скрыть прелоадер через 5 секунд на всякий случай
    setTimeout(hidePreloader, 5000);
    
    // Показывать прелоадер при AJAX запросах (опционально)
    interceptFetchRequests();
}

/**
 * Intercept fetch requests to show preloader
 */
function interceptFetchRequests() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    
    const originalFetch = window.fetch;
    let activeRequests = 0;
    
    window.fetch = function(...args) {
        activeRequests++;
        showPreloader();
        
        return originalFetch.apply(this, args).finally(() => {
            activeRequests--;
            if (activeRequests === 0) {
                setTimeout(hidePreloader, 500);
            }
        });
    };
    
    function showPreloader() {
        preloader.style.display = 'flex';
        preloader.classList.remove('hidden');
        document.body.classList.add('preloader-active');
    }
    
    function hidePreloader() {
        preloader.classList.add('hidden');
        setTimeout(() => {
            if (activeRequests === 0) {
                preloader.style.display = 'none';
                document.body.classList.remove('preloader-active');
            }
        }, 500);
    }
}