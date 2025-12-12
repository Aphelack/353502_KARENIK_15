# Pizzeria Management System

Full-stack MERN (MongoDB, Express, React, Node.js) application for managing a pizzeria with AI features and Yandex OAuth authentication.

## 🎯 Lab Work Requirements Fulfilled

### Technologies
- ✅ **React** - User interface library
- ✅ **Node.js/Express** - Backend server
- ✅ **MongoDB** - Database with Mongoose ODM
- ✅ **Google AI (Gemini)** - AI recipe recommendations and analysis
- ✅ **Yandex OAuth** - Third-party authentication

### Features Implemented

#### 1. Database Models (4 models with validators)
- **User** - Authentication, timezone, validation
- **Pizza** - Menu items, ingredients, pricing
- **Order** - Order management, tracking
- **Ingredient** - Pizza ingredients catalog

#### 2. Authentication
- ✅ Email/Password authentication
- ✅ **Yandex OAuth** integration (7+ points requirement)
- ✅ JWT token-based auth
- ✅ Protected routes

#### 3. CRUD Operations
- ✅ Full CRUD for all models
- ✅ Search and sorting
- ✅ Form validation (client & server)
- ✅ Authorized users: full access
- ✅ Unauthorized users: view only

#### 4. React Components

**Component Types:**
- ✅ **Functional with declarative function** - `Navbar`, `HomePage`, `MenuPage`
- ✅ **Arrow function components** - `HeroSection`, `FeatureCard`, `PizzaCard`, `FilterSection`
- ✅ **Class component** - `OrderTracker` (with lifecycle methods)

**React Features:**
- ✅ Props & default values
- ✅ Component composition
- ✅ State management (useState, setState)
- ✅ **useReducer hook** - PizzaCustomizer
- ✅ useEffect, useContext hooks
- ✅ Custom AuthContext

#### 5. Event Handlers (27 implemented, required 7)
1. `onTimeUpdate` - Real-time clock
2. `onLogout` - User logout
3. `onMenuToggle` - Mobile menu
4. `onLinkClick` - Navigation
5. `onIngredientSelect` - Pizza customization
6. `onSizeChange` - Size selection
7. `onBaseChange` - Base sauce selection
8. `onAnalyzeIngredients` - AI analysis
9. `onGenerateDescription` - AI description
10. `onSavePizza` - Save custom pizza
11. `onRefresh` - Order refresh
12. `onToggleAutoRefresh` - Auto-refresh toggle
13. `onPizzaClick` - Pizza selection
14. `onFilterChange` - Menu filters
15. `onSearch` - Search pizzas
16. `onViewDetails` - View pizza details
17. `onQuickOrder` - Quick order
18. `onQuantityChange` - Quantity adjustment
19. `onOrderFormChange` - Form input
20. `onSubmitOrder` - Submit order
21. `onFilterChange` - Order filters
22. `onCancelOrder` - Cancel order
23. `onInputChange` - Login input
24. `onSubmit` - Login submit
25. `onYandexLogin` - Yandex OAuth
26. `onInputChange` - Register input
27. `onSubmit` - Register submit

#### 6. AI API Integration (7+ points)
- ✅ **Google Gemini AI** for:
  - Recipe recommendations
  - Ingredient analysis
  - Description generation
  - Dietary suggestions
  - Customer support chatbot

#### 7. Async Operations (7+ points)

**XMLHttpRequest:**
- ✅ Search with progress tracking in MenuPage

**setTimeout:**
- ✅ Quick order notifications with auto-hide
- ✅ Order countdown timers
- ✅ Auto-refresh functionality

**Promise/async-await:**
- ✅ All API calls
- ✅ AI processing chains
- ✅ Order processing workflow

#### 8. Timezone Support
- ✅ User timezone detection
- ✅ Display times in user's timezone
- ✅ UTC timestamps
- ✅ Real-time clock in navbar

#### 9. CSS Styling (without Bootstrap)
- ✅ **Flexbox & Grid** layouts
- ✅ **CSS transitions & animations** (fadeIn, slideIn, spin, pulse, scaleIn)
- ✅ **Pseudo-classes** (:hover, :focus, :active)
- ✅ **Responsive design** (mobile-first)
- ✅ **CSS variables** for theming (Italian colors: red, yellow, green)
- ✅ Semantic class names

#### 10. Pages (4+ required)
1. **HomePage** - Landing page with features
2. **MenuPage** - Pizza catalog
3. **PizzaDetailPage** - Pizza details & ordering
4. **CustomizerPage** - Build custom pizza
5. **OrdersPage** - User orders
6. **OrderTracker** - Live order tracking
7. **LoginPage** - Authentication
8. **RegisterPage** - User registration

## 📋 Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- Google AI API Key (in .env)
- Yandex OAuth credentials (in .env)

## 🚀 Installation

### 1. Install Dependencies

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Environment Variables

The `.env` file is already configured with:
- Google AI API Key
- Yandex OAuth credentials
- MongoDB URI (default: localhost)

### 3. Start MongoDB

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (update .env with connection string)
```

### 4. Seed Database

```bash
# Run seed script to populate initial data
node server/seed.js
```

This creates:
- Admin user: `admin@pizzeria.com` / `admin123`
- 24 ingredients
- 12 pizzas with ratings

### 5. Run Application

**Development (with hot reload):**
```bash
# Terminal 1 - Backend (port 5000)
npm run server

# Terminal 2 - Frontend (port 3000)
npm run client

# Or run both concurrently
npm run dev
```

**Production:**
```bash
npm start
```

## 🔑 Login Credentials

**Admin Account:**
- Email: `admin@pizzeria.com`
- Password: `admin123`

**Or register a new account or use Yandex OAuth**

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/yandex/url` - Get Yandex OAuth URL
- `POST /api/auth/yandex/callback` - Yandex OAuth callback
- `GET /api/auth/me` - Get current user

### Pizzas
- `GET /api/pizzas` - List all pizzas (public)
- `GET /api/pizzas/:id` - Get pizza details (public)
- `POST /api/pizzas` - Create pizza (auth required)
- `PUT /api/pizzas/:id` - Update pizza (auth required)
- `DELETE /api/pizzas/:id` - Delete pizza (auth required)

### Orders
- `GET /api/orders` - List orders (auth required)
- `GET /api/orders/:id` - Get order details (auth required)
- `POST /api/orders` - Create order (auth required)
- `PATCH /api/orders/:id/status` - Update order status (auth required)
- `DELETE /api/orders/:id` - Cancel order (auth required)

### Ingredients
- `GET /api/ingredients` - List ingredients (public)
- `GET /api/ingredients/:id` - Get ingredient (public)
- `POST /api/ingredients` - Create ingredient (auth required)
- `PUT /api/ingredients/:id` - Update ingredient (auth required)
- `DELETE /api/ingredients/:id` - Delete ingredient (admin only)

### AI
- `POST /api/ai/recommend-recipe` - Get recipe recommendations
- `POST /api/ai/analyze-ingredients` - Analyze ingredient combinations
- `POST /api/ai/generate-description` - Generate pizza description
- `POST /api/ai/dietary-suggestions` - Get dietary suggestions
- `POST /api/ai/chat` - Chat with AI assistant

## 🎨 Design Theme

Italian-inspired color scheme:
- **Primary Red** (#d32f2f) - Passion, tomato
- **Primary Green** (#2e7d32) - Basil, freshness
- **Primary Yellow** (#fbc02d) - Cheese, warmth
- **Cream & Beige** - Authentic Italian ambiance

## 🧪 Testing the Application

1. **Browse Menu** (public access)
   - Visit http://localhost:3000/menu
   - Search, filter, sort pizzas
   - View pizza details

2. **Register/Login**
   - Create account or use Yandex OAuth
   - Login with credentials

3. **Create Custom Pizza**
   - Navigate to "Customize Pizza"
   - Select ingredients by category
   - Use AI to analyze combinations
   - Generate description with AI
   - Save your creation

4. **Place Order**
   - Select a pizza
   - Click "Order Now"
   - Fill delivery information
   - Submit order

5. **Track Order**
   - View "My Orders"
   - Click "Track Order"
   - See real-time status updates
   - Countdown to delivery

## 📊 Project Structure

```
├── server/
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   ├── config/           # Configuration
│   ├── seed.js          # Database seeder
│   └── server.js        # Express server
├── client/
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       ├── context/     # React context
│       ├── utils/       # Helper functions
│       ├── App.js       # Main app component
│       └── index.js     # Entry point
├── .env                 # Environment variables
├── package.json         # Dependencies
└── README.md           # This file
```

## 🎯 Key Features Demonstration

### Component Types
- **Functional**: `HomePage`, `MenuPage`, `PizzaDetailPage`
- **Arrow Functions**: `HeroSection`, `FeatureCard`, `PizzaCard`
- **Class**: `OrderTracker` with full lifecycle

### State Management
- `useState` - Form inputs, UI state
- `useReducer` - Complex pizza customization
- `useEffect` - Data fetching, timers
- `useContext` - Global auth state

### Async Operations
- XMLHttpRequest for search
- setTimeout for notifications and timers
- Promises for all API calls
- Auto-refresh with intervals

### AI Integration
- Recipe generation
- Ingredient analysis
- Description writing
- Pairing suggestions
- Customer support

## 🎓 Assessment Criteria Met

- ✅ 4+ MongoDB models with validators
- ✅ Authentication (Yandex OAuth = 7+ points)
- ✅ CRUD operations with auth restrictions
- ✅ Search, sort, filters
- ✅ Form validation (client & server)
- ✅ Timezone display (user & UTC)
- ✅ 4+ pages with React
- ✅ Component types (functional, arrow, class)
- ✅ Props & composition
- ✅ 7+ event handlers (actually 27!)
- ✅ State management
- ✅ React hooks (useState, useEffect, useReducer, useContext)
- ✅ CSS without Bootstrap
- ✅ Flexbox/Grid, animations, responsive
- ✅ AI API integration (7+ points)
- ✅ Async operations: XMLHttpRequest, setTimeout, Promise (7+ points)

## 👨‍💻 Author

**Variant 15: Pizzeria**

Lab Work 4 - React & Node.js
