# ЛР 4 REACT и NODE.JS

**Тема:**
1. Библиотека для создания пользовательских интерфейсов React;
2. Веб-фреймворк Express (Node.js/JavaScript)

**Цель работы:**
Закрепить знания и навыки по работе с библиотекой JavaScript для создания пользовательских интерфейсов React, фреймворком Express (Node.js).

**Пример:** https://www.bezkoder.com/react-node-express-mongodb-mern-stack/

**Cправочная информация по React:**
- Документация: https://ru.react.js.org, Начало работы – React
- Руководство по React (metanit.com)
- Getting started with React - Learn web development | MDN (mozilla.org)
- Быстрый старт React с примерами кода (reactdev.ru)
- React Reference Overview – React
- Учебник. React для начинающих | Microsoft Learn

**Cправочная информация по Node.js/ Express:**
- https://developer.mozilla.org/ru/docs/Learn/Server-side/Express_Nodejs
- Node.JS | Введение и начало работы (metanit.com) Node.JS | Начало работы с Express (metanit.com)
- Guides | Node.js (nodejs.org)
- Полное руководство по Node.js — Изучите Node для начинающих ⚡️ Node.js с примерами кода (nodejsdev.ru)
- Полный справочник по Node.js (questu.ru)

## Задание.
Разработать веб-сайт с использованием Node.js(Express) для реализации сервера и React для клиента.

**Постановка задачи:**
- Определить и реализовать минимум четыре модели в соответствии с предметной областью предыдущих ЛР (использовать встроенные валидаторы, подходящие типы данных). В качестве базы данных всем использовать MongoDB (https://metanit.com/web/nodejs/6.1.php, https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose ).
- Реализовать механизмы авторизации/аутентификации с помощью логина/пароля (Аутентификация ⚡️ Node.js с примерами кода (nodejsdev.ru)). **На отметку от 7 баллов** - через аккаунты Google или любой другой доступный;
- Для авторизованного юзера реализовать CRUD (create, read, update, delete) операции и возможность поиска, сортировки записей https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose; Использовать формы, созданные с использованием React, для добавления записей. https://metanit.com/web/react/3.3.php
- Для неавторизованного пользователя обеспечить только просмотр, поиск, сортировку и авторизацию;
- Обеспечить наполнение данными для демонстрации не менее 10 записей в списке товаров/услуг/объектов/клиентов.
- отображать тайм зону пользователя, текущую дату, дату добавления/изменения данных в таблицы для тайм зоны пользователя и для UTC.
- Для создания всех страниц (минимум четыре – выбрать любые из предыдущих ЛР(среди страниц обязательно должен быть каталог, просмотр инфо об объекте из каталога), переключение между ними с помощью панели навигации) использовать только React.
- Создать компоненты (см. индивидуальное задание по вариантам)
  - с использованием декларативных функций, стрелочных функций и классов.
  - Применить props, значения по умолчанию.
  - Использовать разработанные компоненты внутри других компонентов.
  - Добавить обработчики событий (минимум семь) – в функциональных компонентах, компонентах классах, с передачей параметров в обработчик события. https://metanit.com/web/react/2.5.php
  - Продемонстрировать работу со state (https://metanit.com/web/react/2.4.php )
  - Продемонстрировать использование любого из хуков.

**React компоненты (минимальные требования для всех):**
1. Функциональный компонент с декларативной функцией - для основной логики
2. Функциональный компонент со стрелочной функцией - для презентационных компонентов
3. Классовый компонент - для компонентов с сложным жизненным циклом
4. Минимум 7 обработчиков событий разных типов (onClick, onChange, onSubmit, etc.)
5. Использование state через useState/setState
6. Применение хуков (useEffect, useContext, useReducer и др.)

- Настроить стили css (см. индивидуальное задание по вариантам) (без https://www.bootstrapcdn.com/);

**CSS требования:**
- Flexbox/Grid layout
- CSS transitions/animations
- Псевдоклассы (:hover, :focus, :active)
- Адаптивный дизайн
- CSS variables для темизации
- Семантические классы

- Валидация форм как на стороне сервера, так и на стороне клиента;
- Ограничить использование API проекта для неавторизованных запросов.
- **На отметку от 7 баллов** – выполнить индивидуальные задания по добавлению AI API (хотя бы одно API) и асинхронности (хотя бы один вариант использования).

**Доп. Ссылки AI API:**
- OpenAI ChatGPT API - AI-консультант по выбору ….
  Документация: https://platform.openai.com/docs/api-reference
  Endpoint: https://api.openai.com/v1/chat/completions
- Google Vision AI - определение ….. животных по фото
  Документация: https://cloud.google.com/vision/docs
  Endpoint: https://vision.googleapis.com/v1/images:annotate
- Dialogflow ES - чат-бот для бронирования
  Документация: https://cloud.google.com/dialogflow/docs
  Endpoint: https://dialogflow.googleapis.com/v2/projects/{project}/agent/sessions/{session}:detectIntent
- IBM Watson Tone Analyzer - анализ отзывов
  Документация: https://cloud.ibm.com/apidocs/tone-analyzer
  Endpoint: https://api.us-south.tone-analyzer.watson.cloud.ibm.com/v3/tone
- Microsoft Azure Custom Vision - анализ упражнений
  Документация: https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/
  Endpoint: https://{endpoint}/customvision/v3.0/Prediction/{projectId}/classify/iterations/{publishedName}/image
- Hugging Face Inference API - генерация тренировок
  Документация: https://huggingface.co/docs/api-inference/
  Endpoint: https://api-inference.huggingface.co/models/{model_name}
- OpenAI DALL-E - генерация изображений направлений
  Документация: https://platform.openai.com/docs/api-reference/images
  Endpoint: https://api.openai.com/v1/images/generations
- Google Places API + AI - рекомендации мест
  Документация: https://developers.google.com/maps/documentation/places/web-service
  Endpoint: https://maps.googleapis.com/maps/api/place/nearbysearch/json
- Google Cloud Video Intelligence - анализ парковки
  Документация: https://cloud.google.com/video-intelligence/docs
  Endpoint: https://videointelligence.googleapis.com/v1/videos:annotate
- AWS Rekognition - распознавание номеров
  Документация: https://docs.aws.amazon.com/rekognition/
  Endpoint: https://rekognition.{region}.amazonaws.com
- Google Routes API - оптимизация маршрутов
  Документация: https://developers.google.com/maps/documentation/routes
  Endpoint: https://routes.googleapis.com/directions/v2:computeRoutes
- IBM Watson NLP - анализ грузовых накладных
  Документация: https://cloud.ibm.com/apidocs/natural-language-understanding
  Endpoint: https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/v1/analyze

**Асинхронные операции (На отметку от 7 баллов):**
- **XMLHttpRequest** (можно заменить на Fetch API) использовать для:
  - Операций с отслеживанием прогресса (upload/download)
  - Работы с legacy API или специфическими протоколами
  - Реализации кастомных обработчиков прогресса
- **setTimeout** использовать для:
  - Задержек в UI/UX (автоскрытие уведомлений)
  - Периодических обновлений данных
  - Реализации таймеров и обратного отсчета
  - сохранять состояние таймеров в localStorage
- **Promise** использовать для:
  - Цепочек асинхронных операций с зависимостями
  - Обработки нескольких параллельных запросов
  - Реализации сложной бизнес-логики с асинхронными шагами
  - использовать async/await для лучшей читаемости

---

## Индивидуальные задания по вариантам (использовать тот вариант, который был в прошлом году)

**Вариант 15. Пиццерия**

**Описание:**
Вы являетесь сотрудником коммерческого отдела компании, продающей различные товары через Интернет. Вашей задачей является отслеживание финансовой составляющей работы компании.

**AI API:**
1.  **Google Vision AI** - распознавание ингредиентов по фото
    *   API: https://cloud.google.com/vision
2.  **OpenAI API** - генерация рецептов и рекомендаций
    *   API: https://openai.com

**React компоненты/обработчики (пример):**
1.  **PizzaCustomizer** (функциональный с useReducer) - конструктор пиццы с ингредиентами
2.  **OrderTracker** (классовый) - отслеживание заказов и доставки
3.  **MenuManager** (стрелочная функция) - управление меню и акциями

**Обработчики событий:**
`onPizzaBuild`, `onOrderTrack`, `onMenuUpdate`, `onIngredientSelect`, `onDeliveryAssign`, `onPromoApply`, `onFeedback`

**CSS требования:**
Яркий итальянский стиль с красными и желтыми акцентами. Анимации добавления ингредиентов. Карточки пицц с фотографиями.

**Асинхронность (пример):**
*   **XMLHttpRequest**: Отслеживание статуса заказа и местоположения курьера
*   **setTimeout**: Автоматическая отмена заказа при длительном ожидании курьера
*   **Promise**: Процесс заказа: проверка ингредиентов → приготовление → упаковка → доставка