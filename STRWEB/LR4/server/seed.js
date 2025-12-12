const mongoose = require('mongoose');
const Ingredient = require('./models/Ingredient');
const Pizza = require('./models/Pizza');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Ingredient.deleteMany({});
    await Pizza.deleteMany({});
    
    // Check if admin exists
    let admin = await User.findOne({ email: 'admin@pizzeria.com' });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      admin = await User.create({
        email: 'admin@pizzeria.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'admin',
        timezone: 'UTC',
      });
    }

    // Seed ingredients
    const ingredients = await Ingredient.insertMany([
      // Cheese
      { name: 'Mozzarella', category: 'cheese', price: 2.5, allergens: ['dairy'], image: '/images/ingredients/mozzarella.jpg' },
      { name: 'Parmesan', category: 'cheese', price: 3.0, allergens: ['dairy'], image: '/images/ingredients/parmesan.jpg' },
      { name: 'Gorgonzola', category: 'cheese', price: 3.5, allergens: ['dairy'], image: '/images/ingredients/gorgonzola.jpg' },
      { name: 'Ricotta', category: 'cheese', price: 2.8, allergens: ['dairy'], image: '/images/ingredients/ricotta.jpg' },
      
      // Meat
      { name: 'Pepperoni', category: 'meat', price: 3.5, allergens: ['none'], image: '/images/ingredients/pepperoni.jpg' },
      { name: 'Italian Sausage', category: 'meat', price: 4.0, allergens: ['none'], image: '/images/ingredients/sausage.jpg' },
      { name: 'Prosciutto', category: 'meat', price: 5.0, allergens: ['none'], image: '/images/ingredients/prosciutto.jpg' },
      { name: 'Bacon', category: 'meat', price: 3.5, allergens: ['none'], image: '/images/ingredients/bacon.jpg' },
      { name: 'Chicken', category: 'meat', price: 4.0, allergens: ['none'], image: '/images/ingredients/chicken.jpg' },
      
      // Vegetables
      { name: 'Tomatoes', category: 'vegetable', price: 1.5, allergens: ['none'], image: '/images/ingredients/tomatoes.jpg' },
      { name: 'Bell Peppers', category: 'vegetable', price: 1.8, allergens: ['none'], image: '/images/ingredients/peppers.jpg' },
      { name: 'Mushrooms', category: 'vegetable', price: 2.0, allergens: ['none'], image: '/images/ingredients/mushrooms.jpg' },
      { name: 'Onions', category: 'vegetable', price: 1.2, allergens: ['none'], image: '/images/ingredients/onions.jpg' },
      { name: 'Olives', category: 'vegetable', price: 2.2, allergens: ['none'], image: '/images/ingredients/olives.jpg' },
      { name: 'Spinach', category: 'vegetable', price: 2.0, allergens: ['none'], image: '/images/ingredients/spinach.jpg' },
      { name: 'Arugula', category: 'vegetable', price: 2.5, allergens: ['none'], image: '/images/ingredients/arugula.jpg' },
      
      // Sauce
      { name: 'Tomato Sauce', category: 'sauce', price: 1.0, allergens: ['none'], image: '/images/ingredients/tomato-sauce.jpg' },
      { name: 'BBQ Sauce', category: 'sauce', price: 1.5, allergens: ['none'], image: '/images/ingredients/bbq-sauce.jpg' },
      { name: 'Pesto', category: 'sauce', price: 2.5, allergens: ['nuts', 'dairy'], image: '/images/ingredients/pesto.jpg' },
      { name: 'White Sauce', category: 'sauce', price: 2.0, allergens: ['dairy'], image: '/images/ingredients/white-sauce.jpg' },
      
      // Seasoning
      { name: 'Basil', category: 'seasoning', price: 0.8, allergens: ['none'], image: '/images/ingredients/basil.jpg' },
      { name: 'Oregano', category: 'seasoning', price: 0.5, allergens: ['none'], image: '/images/ingredients/oregano.jpg' },
      { name: 'Garlic', category: 'seasoning', price: 0.8, allergens: ['none'], image: '/images/ingredients/garlic.jpg' },
      { name: 'Red Pepper Flakes', category: 'seasoning', price: 0.5, allergens: ['none'], image: '/images/ingredients/red-pepper.jpg' },
    ]);

    // Create ingredient map for easy reference
    const ingredientMap = {};
    ingredients.forEach(ing => {
      ingredientMap[ing.name] = ing._id;
    });

    // Seed pizzas
    const pizzas = [
      {
        name: 'Margherita Classic',
        description: 'Traditional Italian pizza with fresh mozzarella, tomato sauce, and fragrant basil leaves. Simple yet irresistible.',
        basePrice: 12.99,
        size: 'medium',
        category: 'classic',
        ingredients: [
          { ingredient: ingredientMap['Tomato Sauce'], quantity: 1 },
          { ingredient: ingredientMap['Mozzarella'], quantity: 2 },
          { ingredient: ingredientMap['Basil'], quantity: 1 },
        ],
        preparationTime: 15,
        rating: 4.8,
        reviews: 156,
        available: true,
        createdBy: admin._id,
      },
      {
        name: 'Pepperoni Deluxe',
        description: 'Loaded with premium pepperoni slices, extra mozzarella, and our signature tomato sauce. A crowd favorite!',
        basePrice: 14.99,
        size: 'medium',
        category: 'classic',
        ingredients: [
          { ingredient: ingredientMap['Tomato Sauce'], quantity: 1 },
          { ingredient: ingredientMap['Mozzarella'], quantity: 2 },
          { ingredient: ingredientMap['Pepperoni'], quantity: 3 },
          { ingredient: ingredientMap['Oregano'], quantity: 1 },
        ],
        preparationTime: 18,
        rating: 4.9,
        reviews: 243,
        available: true,
        createdBy: admin._id,
      },
      {
        name: 'Quattro Formaggi',
        description: 'Four cheese masterpiece featuring mozzarella, parmesan, gorgonzola, and ricotta. A cheese lover\'s dream.',
        basePrice: 16.99,
        size: 'medium',
        category: 'premium',
        ingredients: [
          { ingredient: ingredientMap['White Sauce'], quantity: 1 },
          { ingredient: ingredientMap['Mozzarella'], quantity: 1 },
          { ingredient: ingredientMap['Parmesan'], quantity: 1 },
          { ingredient: ingredientMap['Gorgonzola'], quantity: 1 },
          { ingredient: ingredientMap['Ricotta'], quantity: 1 },
          { ingredient: ingredientMap['Basil'], quantity: 1 },
        ],
        preparationTime: 20,
        rating: 4.7,
        reviews: 89,
        available: true,
        createdBy: admin._id,
      },
      {
        name: 'Vegetarian Garden',
        description: 'Fresh vegetables including bell peppers, mushrooms, onions, and olives on a bed of tomato sauce and mozzarella.',
        basePrice: 13.99,
        size: 'medium',
        category: 'vegetarian',
        ingredients: [
          { ingredient: ingredientMap['Tomato Sauce'], quantity: 1 },
          { ingredient: ingredientMap['Mozzarella'], quantity: 2 },
          { ingredient: ingredientMap['Bell Peppers'], quantity: 1 },
          { ingredient: ingredientMap['Mushrooms'], quantity: 1 },
          { ingredient: ingredientMap['Onions'], quantity: 1 },
          { ingredient: ingredientMap['Olives'], quantity: 1 },
        ],
        preparationTime: 17,
        rating: 4.6,
        reviews: 124,
        available: true,
        createdBy: admin._id,
      },
      {
        name: 'Meat Feast',
        description: 'Ultimate meat lover\'s pizza with pepperoni, Italian sausage, bacon, and chicken. Protein-packed perfection.',
        basePrice: 18.99,
        size: 'large',
        category: 'meat',
        ingredients: [
          { ingredient: ingredientMap['Tomato Sauce'], quantity: 1 },
          { ingredient: ingredientMap['Mozzarella'], quantity: 2 },
          { ingredient: ingredientMap['Pepperoni'], quantity: 2 },
          { ingredient: ingredientMap['Italian Sausage'], quantity: 1 },
          { ingredient: ingredientMap['Bacon'], quantity: 1 },
          { ingredient: ingredientMap['Chicken'], quantity: 1 },
        ],
        preparationTime: 25,
        rating: 4.9,
        reviews: 178,
        available: true,
        createdBy: admin._id,
      },
      {
        name: 'Prosciutto e Rucola',
        description: 'Elegant combination of thin prosciutto slices and fresh arugula on a white sauce base with parmesan shavings.',
        basePrice: 19.99,
        size: 'medium',
        category: 'premium',
        ingredients: [
          { ingredient: ingredientMap['White Sauce'], quantity: 1 },
          { ingredient: ingredientMap['Mozzarella'], quantity: 1 },
          { ingredient: ingredientMap['Prosciutto'], quantity: 2 },
          { ingredient: ingredientMap['Arugula'], quantity: 1 },
          { ingredient: ingredientMap['Parmesan'], quantity: 1 },
        ],
        preparationTime: 20,
        rating: 4.8,
        reviews: 95,
        available: true,
        createdBy: admin._id,
      },
      {
        name: 'BBQ Chicken',
        description: 'Tangy BBQ sauce, grilled chicken, red onions, and mozzarella create this American-Italian fusion favorite.',
        basePrice: 15.99,
        size: 'medium',
        category: 'classic',
        ingredients: [
          { ingredient: ingredientMap['BBQ Sauce'], quantity: 1 },
          { ingredient: ingredientMap['Mozzarella'], quantity: 2 },
          { ingredient: ingredientMap['Chicken'], quantity: 2 },
          { ingredient: ingredientMap['Onions'], quantity: 1 },
        ],
        preparationTime: 22,
        rating: 4.7,
        reviews: 167,
        available: true,
        createdBy: admin._id,
      },
      {
        name: 'Spinach & Ricotta',
        description: 'Healthy and delicious white pizza with fresh spinach, creamy ricotta, garlic, and mozzarella.',
        basePrice: 14.99,
        size: 'medium',
        category: 'vegetarian',
        ingredients: [
          { ingredient: ingredientMap['White Sauce'], quantity: 1 },
          { ingredient: ingredientMap['Mozzarella'], quantity: 1 },
          { ingredient: ingredientMap['Spinach'], quantity: 2 },
          { ingredient: ingredientMap['Ricotta'], quantity: 1 },
          { ingredient: ingredientMap['Garlic'], quantity: 1 },
        ],
        preparationTime: 18,
        rating: 4.6,
        reviews: 102,
        available: true,
        createdBy: admin._id,
      },
      {
        name: 'Pesto Supreme',
        description: 'Basil pesto base with sun-dried tomatoes, fresh mozzarella, and pine nuts. Mediterranean perfection.',
        basePrice: 17.99,
        size: 'medium',
        category: 'premium',
        ingredients: [
          { ingredient: ingredientMap['Pesto'], quantity: 1 },
          { ingredient: ingredientMap['Mozzarella'], quantity: 2 },
          { ingredient: ingredientMap['Tomatoes'], quantity: 1 },
          { ingredient: ingredientMap['Parmesan'], quantity: 1 },
        ],
        preparationTime: 19,
        rating: 4.7,
        reviews: 78,
        available: true,
        createdBy: admin._id,
      },
      {
        name: 'Spicy Diavola',
        description: 'Hot and spicy with pepperoni, Italian sausage, red pepper flakes, and jalapeños. Not for the faint of heart!',
        basePrice: 16.49,
        size: 'medium',
        category: 'meat',
        ingredients: [
          { ingredient: ingredientMap['Tomato Sauce'], quantity: 1 },
          { ingredient: ingredientMap['Mozzarella'], quantity: 2 },
          { ingredient: ingredientMap['Pepperoni'], quantity: 2 },
          { ingredient: ingredientMap['Italian Sausage'], quantity: 1 },
          { ingredient: ingredientMap['Red Pepper Flakes'], quantity: 2 },
        ],
        preparationTime: 20,
        rating: 4.8,
        reviews: 145,
        available: true,
        createdBy: admin._id,
      },
      {
        name: 'Mediterranean Veggie',
        description: 'Fresh vegetables with olives, tomatoes, bell peppers, and feta-style cheese. Light and flavorful.',
        basePrice: 14.49,
        size: 'medium',
        category: 'vegetarian',
        ingredients: [
          { ingredient: ingredientMap['Tomato Sauce'], quantity: 1 },
          { ingredient: ingredientMap['Mozzarella'], quantity: 1 },
          { ingredient: ingredientMap['Tomatoes'], quantity: 1 },
          { ingredient: ingredientMap['Bell Peppers'], quantity: 1 },
          { ingredient: ingredientMap['Olives'], quantity: 1 },
          { ingredient: ingredientMap['Onions'], quantity: 1 },
        ],
        preparationTime: 18,
        rating: 4.5,
        reviews: 91,
        available: true,
        createdBy: admin._id,
      },
      {
        name: 'Truffle Mushroom',
        description: 'Gourmet pizza with mixed mushrooms, truffle oil, parmesan, and fresh arugula. Sophisticated and earthy.',
        basePrice: 21.99,
        size: 'medium',
        category: 'premium',
        ingredients: [
          { ingredient: ingredientMap['White Sauce'], quantity: 1 },
          { ingredient: ingredientMap['Mozzarella'], quantity: 1 },
          { ingredient: ingredientMap['Mushrooms'], quantity: 3 },
          { ingredient: ingredientMap['Parmesan'], quantity: 1 },
          { ingredient: ingredientMap['Arugula'], quantity: 1 },
        ],
        preparationTime: 22,
        rating: 4.9,
        reviews: 63,
        available: true,
        createdBy: admin._id,
      },
    ];

    await Pizza.insertMany(pizzas);

    console.log('Database seeded successfully!');
    console.log(`Created ${ingredients.length} ingredients`);
    console.log(`Created ${pizzas.length} pizzas`);
    console.log('Admin credentials: admin@pizzeria.com / admin123');
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  }
};

// Run the seed function if this file is executed directly
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      return seedDatabase();
    })
    .then(() => {
      console.log('Seeding complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase;
