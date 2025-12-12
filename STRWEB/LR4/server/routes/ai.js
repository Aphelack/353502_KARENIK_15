const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

const genAI = new GoogleGenerativeAI(process.env.API_Key);

// Generate pizza recipe recommendations
router.post('/recommend-recipe', optionalAuth, async (req, res) => {
  try {
    const { ingredients, preferences, dietary } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const prompt = `As a professional pizza chef, create a unique and delicious pizza recipe based on the following:
    
Available ingredients: ${ingredients ? ingredients.join(', ') : 'standard pizza ingredients'}
Customer preferences: ${preferences || 'balanced flavors'}
Dietary restrictions: ${dietary || 'none'}

Please provide:
1. A creative pizza name
2. A brief description (2-3 sentences)
3. Recommended cooking temperature and time
4. Flavor profile
5. Pairing suggestions (drinks/sides)

Format the response as JSON with keys: name, description, cookingTemp, cookingTime, flavorProfile, pairings`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      recommendation: text,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI Recipe error:', error);
    res.status(500).json({ 
      message: 'Failed to generate recipe', 
      error: error.message 
    });
  }
});

// Analyze ingredient combination
router.post('/analyze-ingredients', optionalAuth, async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ message: 'Please provide ingredients array' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    const prompt = `As a culinary expert, analyze this pizza ingredient combination: ${ingredients.join(', ')}

Provide:
1. Compatibility score (1-10)
2. Flavor harmony analysis
3. Suggestions for improvement
4. Potential allergen warnings
5. Nutritional insights

Be concise and practical.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      analysis: text,
      ingredients,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI Analysis error:', error);
    res.status(500).json({ 
      message: 'Failed to analyze ingredients', 
      error: error.message 
    });
  }
});

// Generate pizza description for marketing
router.post('/generate-description', authMiddleware, async (req, res) => {
  try {
    const { pizzaName, ingredients, category } = req.body;

    if (!pizzaName || !ingredients) {
      return res.status(400).json({ message: 'Pizza name and ingredients are required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    const prompt = `Create an enticing, mouth-watering marketing description for a pizza called "${pizzaName}".

Category: ${category || 'gourmet'}
Ingredients: ${Array.isArray(ingredients) ? ingredients.join(', ') : ingredients}

Requirements:
- 2-3 sentences
- Evoke sensory experiences (taste, aroma, texture)
- Highlight unique aspects
- Professional and appetizing tone
- Suitable for menu display

Just provide the description text, no additional formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      description: text.trim(),
      pizzaName,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI Description error:', error);
    res.status(500).json({ 
      message: 'Failed to generate description', 
      error: error.message 
    });
  }
});

// Dietary recommendations
router.post('/dietary-suggestions', optionalAuth, async (req, res) => {
  try {
    const { dietType, allergies, calorieLimit } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    const prompt = `As a nutritionist specializing in Italian cuisine, suggest 3 pizza options for someone with:

Diet type: ${dietType || 'no restrictions'}
Allergies: ${allergies ? allergies.join(', ') : 'none'}
Calorie limit per serving: ${calorieLimit || 'no limit'}

For each pizza suggestion, provide:
1. Name
2. Main ingredients
3. Estimated calories
4. Why it fits their requirements

Be practical and focus on commonly available ingredients.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      suggestions: text,
      criteria: { dietType, allergies, calorieLimit },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI Dietary error:', error);
    res.status(500).json({ 
      message: 'Failed to generate dietary suggestions', 
      error: error.message 
    });
  }
});

// Customer support chatbot
router.post('/chat', optionalAuth, async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    const systemContext = `You are a helpful customer service assistant for a pizzeria. 
You can help with:
- Menu recommendations
- Order status inquiries
- Ingredient information
- Delivery time estimates
- Special requests and customizations

Be friendly, concise, and helpful. If you don't know something specific about an order, 
politely ask for order number or suggest contacting direct support.`;

    const prompt = `${systemContext}

${context ? `Previous context: ${context}` : ''}

Customer message: ${message}

Provide a helpful response:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      reply: text.trim(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({ 
      message: 'Failed to process chat', 
      error: error.message 
    });
  }
});

module.exports = router;
