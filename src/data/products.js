export const CATEGORIES = ['Fruits', 'Vegetables'];

// Stock level (kg) at or below which a product is flagged "low stock".
export const LOW_STOCK = 20;

// Orders placed last month (seed data for the admin report).
export const LAST_MONTH_ORDERS = 186;

// stock   = kg available now
// sold    = kg sold all-time
// lastMonth = kg sold last month
// wasted  = kg thrown away all-time (spoilage)
export const PRODUCTS = [
  { id: 'p1', image: require('../../assets/products/banana.jpg'), name: 'Banana', emoji: '🍌', price: 50, category: 'Fruits', stock: 120, sold: 940, lastMonth: 210, wasted: 38, description: 'Banana is a very good fruit for body health and extra vitamin and extra energy for body. This is a increase of body for baby and boys.' },
  { id: 'p2', image: require('../../assets/products/orange.jpg'), name: 'Orange', emoji: '🍊', price: 70, category: 'Fruits', stock: 85, sold: 610, lastMonth: 140, wasted: 22, description: 'Orange is rich in vitamin C and helps build immunity. Fresh, juicy and sweet, perfect for daily juice.' },
  { id: 'p3', image: require('../../assets/products/pineapple.jpg'), name: 'Pineapple', emoji: '🍍', price: 120, category: 'Fruits', stock: 18, sold: 420, lastMonth: 95, wasted: 9, description: 'Pineapple is a tropical fruit full of fibre and vitamins that aids digestion and keeps you refreshed.' },
  { id: 'p4', image: require('../../assets/products/lemon.jpg'), name: 'Lemon', emoji: '🍋', price: 80, category: 'Fruits', stock: 60, sold: 380, lastMonth: 80, wasted: 12, description: 'Lemon is a sour citrus fruit loaded with vitamin C, great for drinks, cooking and detox.' },
  { id: 'p5', image: require('../../assets/products/apple.jpg'), name: 'Apple', emoji: '🍎', price: 150, category: 'Fruits', stock: 14, sold: 880, lastMonth: 190, wasted: 15, description: 'Apples are crunchy and sweet, packed with fibre and antioxidants. An apple a day keeps the doctor away.' },
  { id: 'p6', image: require('../../assets/products/grapes.jpg'), name: 'Grapes', emoji: '🍇', price: 90, category: 'Fruits', stock: 45, sold: 330, lastMonth: 70, wasted: 18, description: 'Fresh grapes are sweet and juicy, a good source of vitamin K and natural sugars for quick energy.' },
  { id: 'p7', image: require('../../assets/products/tomato.jpg'), name: 'Tomato', emoji: '🍅', price: 220, category: 'Vegetables', stock: 150, sold: 1210, lastMonth: 260, wasted: 41, description: 'Tomato is a very good vegetable for body health and extra vitamin and extra energy for body. This is a increase of body for baby and boys.' },
  { id: 'p8', image: require('../../assets/products/cabbage.jpg'), name: 'Cabbage', emoji: '🥬', price: 300, category: 'Vegetables', stock: 32, sold: 150, lastMonth: 30, wasted: 14, description: 'Cabbage is a leafy green vegetable rich in vitamin C and fibre, ideal for salads and curries.' },
  { id: 'p9', image: require('../../assets/products/carrot.jpg'), name: 'Carrot', emoji: '🥕', price: 60, category: 'Vegetables', stock: 70, sold: 520, lastMonth: 110, wasted: 20, description: 'Carrots are full of beta-carotene which is good for eye health. Eat raw or cooked.' },
  { id: 'p10', image: require('../../assets/products/pumpkin.jpg'), name: 'Sw.Pumpkin', emoji: '🎃', price: 40, category: 'Vegetables', stock: 9, sold: 95, lastMonth: 18, wasted: 7, description: 'Sweet pumpkin is soft, mildly sweet and rich in vitamin A. Perfect for soups and curries.' },
  { id: 'p11', image: require('../../assets/products/capsicum.jpg'), name: 'Capsicum', emoji: '🫑', price: 110, category: 'Vegetables', stock: 40, sold: 260, lastMonth: 55, wasted: 10, description: 'Colourful capsicum adds crunch and vitamin C to stir-fries, salads and gravies.' },
  { id: 'p12', image: require('../../assets/products/corn.jpg'), name: 'Corn', emoji: '🌽', price: 45, category: 'Vegetables', stock: 55, sold: 300, lastMonth: 62, wasted: 11, description: 'Sweet corn is a tasty source of fibre and energy. Boil, roast or add to soups.' },
];
