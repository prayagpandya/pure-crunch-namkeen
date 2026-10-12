import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env file manually
const envPath = path.resolve(__dirname, "../.env");
let mongoUri = process.env.MONGODB_URI;

if (!mongoUri && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("MONGODB_URI=")) {
      mongoUri = trimmed.substring("MONGODB_URI=".length).replace(/^["']|["']$/g, "").trim();
      break;
    }
  }
}

if (!mongoUri) {
  console.error("Error: MONGODB_URI not found in environment or .env file.");
  process.exit(1);
}

const PRODUCTS = [
  {
    id: "plain-salty",
    name: "Plain Salty Wafers",
    category: "Wafers",
    subcategory: "Potato Wafers",
    mrp: 70.00,
    weight: "125 g",
    image: "/images/plain_salty_waffer.jpeg",
    images: ["/images/plain_salty_waffer.jpeg", "/images/plain_salty_waffer_1.jpeg"],
    ingredients: ["Potato", "Pure Groundnut Oil", "Rock Salt (Sindhalu)"],
    description: "Crispy, Golden-sliced potato wafers cooked to perfection in 100% Pure Groundnut oil. Lightly seasoned Rock salt (Sindhav) for a clean, Traditional Taste that is gentle on your Heart and Digestion.",
    features: ["100% Pure Groundnut Oil", "Rock Salt (Sindhalu)", "Fasting Friendly (Farali)"],
    isPopular: true,
    isFarali: true,
    rating: 4.9,
    reviewCount: 142,
    funFact: "Plain Salty Wafers are made with Pure Groundnut oil and added Sindhalu rock salt, making them 100% safe for Ekadashi and festival fasts!",
    nutritionInfo: {
      energy: "540 kcal",
      protein: "6.5 g",
      carbohydrates: "52 g",
      fat: "34 g",
      sodium: "580 mg"
    },
    reviews: [
      {
        id: "r1",
        author: "Priya Patel",
        rating: 5,
        date: "2 days ago",
        comment: "You can clearly taste the difference pure groundnut oil makes. Not greasy at all!"
      },
      {
        id: "r2",
        author: "Ramesh Bhai",
        rating: 5,
        date: "1 week ago",
        comment: "Perfect crispness and rock salt taste. Excellent quality for family snacking."
      }
    ]
  },
  {
    id: "plain-masala",
    name: "Plain Masala Wafers",
    category: "Wafers",
    subcategory: "Potato Wafers",
    mrp: 70.00,
    weight: "125 g",
    image: "/images/plain_masala_waffer.jpeg",
    images: ["/images/plain_masala_waffer.jpeg", "/images/masala_waffer.jpeg"],
    ingredients: ["Potato", "Pure Groundnut Oil", "Chilli Powder", "Black Salt", "Rock Salt (Sindhalu)"],
    description: "Crispy and thin potato wafers cooked in pure groundnut oil, tossed in a vibrant blend of spicy red chili powder, black salt, and healthy rock salt. A classic combination that packs a delicious punch.",
    features: ["100% Pure Groundnut Oil", "Rock Salt (Sindhalu)", "Authentic Spices"],
    isPopular: true,
    rating: 4.8,
    reviewCount: 118,
    funFact: "Our red chili spice blend is sourced directly from Saurashtra farmers for authentic regional flavor!",
    nutritionInfo: {
      energy: "548 kcal",
      protein: "6.8 g",
      carbohydrates: "51 g",
      fat: "35 g",
      sodium: "620 mg"
    },
    reviews: [
      {
        id: "r3",
        author: "Aniket Shah",
        rating: 5,
        date: "3 days ago",
        comment: "Just the right spicy kick without being overwhelmingly hot. Loved it!"
      }
    ]
  },
  {
    id: "salty-line",
    name: "Salty Line Wafers",
    category: "Wafers",
    subcategory: "Potato Wafers",
    mrp: 70.00,
    weight: "125 g",
    image: "/images/line_salty_waffer_2.jpeg",
    ingredients: ["Potato", "Pure Groundnut Oil", "Black Pepper", "Misri Powder", "Black Salt", "Rock Salt (Sindhalu)"],
    description: "Line-cut potato wafers designed for an extra crunch. Lightly seasoned with freshly ground black pepper, organic misri powder for a hint of natural sweetness, black salt, and rock salt.",
    features: ["100% Pure Groundnut Oil", "Rock Salt (Sindhalu)", "Premium Black Pepper"],
    rating: 4.7,
    reviewCount: 89,
    funFact: "Line-cut ridges hold just the right amount of freshly ground black pepper for a satisfying crunch!",
    nutritionInfo: {
      energy: "535 kcal",
      protein: "6.2 g",
      carbohydrates: "53 g",
      fat: "33 g",
      sodium: "590 mg"
    },
    reviews: [
      {
        id: "r4",
        author: "Meera Joshi",
        rating: 5,
        date: "5 days ago",
        comment: "The black pepper and misri hint is so balanced. Best evening tea companion."
      }
    ]
  },
  {
    id: "masala-line",
    name: "Masala Line Wafers",
    category: "Wafers",
    subcategory: "Potato Wafers",
    mrp: 70.00,
    weight: "125 g",
    image: "/images/masala_line_waffer.jpeg",
    images: ["/images/masala_line_waffer.jpeg", "/images/masala_line_waffer_2.jpeg"],
    ingredients: ["Potato", "Pure Groundnut Oil", "Chilli Powder", "Dry Ginger Powder", "Rock Salt (Sindhalu)"],
    description: "Thick line-cut potato wafers cooked in heart-friendly groundnut oil, seasoned with a rich spice mixture containing fiery red chili powder, warming dry ginger powder, and rock salt.",
    features: ["100% Pure Groundnut Oil", "Rock Salt (Sindhalu)", "Warm Ginger Notes"],
    rating: 4.8,
    reviewCount: 94,
    funFact: "Dry ginger powder gives these wafers a unique warm aroma that balances the fiery red chili!",
    reviews: []
  },
  {
    id: "mari-banana",
    name: "Mari Banana Wafers",
    category: "Wafers",
    subcategory: "Banana Wafers",
    mrp: 70.00,
    weight: "125 g",
    image: "/images/banana_waffer.jpeg",
    ingredients: ["Raw Green Banana", "Pure Groundnut Oil", "Black Pepper", "Black Salt", "Rock Salt (Sindhalu)"],
    description: "Slices of premium green bananas cooked in pure groundnut oil. Perfectly seasoned with black pepper, black salt, and rock salt. Crunchy, light, and 100% safe for fasts and religious days.",
    features: ["100% Pure Groundnut Oil", "Rock Salt (Sindhalu)", "Fasting Friendly (Farali)"],
    isPopular: true,
    isFarali: true,
    rating: 4.9,
    reviewCount: 165,
    funFact: "Banana wafers prepared in groundnut oil stay extra crisp and are rich in resistant starch for digestive wellness!",
    reviews: [
      {
        id: "r5",
        author: "Kavita Desai",
        rating: 5,
        date: "Yesterday",
        comment: "My go-to snack during Upvas! Super crisp and clean taste."
      }
    ]
  },
  {
    id: "farali-chevdo",
    name: "Farali Chevdo",
    category: "Namkeen",
    subcategory: "Chevdo & Mixes",
    mrp: 70.00,
    weight: "125 g",
    image: "/images/farali_chevdo.jpeg",
    ingredients: ["Potato Slices", "Pure Groundnut Oil", "Roasted Peanuts", "Misri Powder", "Chilli Powder", "Rock Salt (Sindhalu)"],
    description: "A traditional luxury blend of crispy potato sticks and whole roasted peanuts. Seasoned with misri powder for a subtle sweetness, red chili powder, and rock salt. A highly satisfying, fasting-safe snack.",
    features: ["100% Pure Groundnut Oil", "Rock Salt (Sindhalu)", "Rich in Peanuts", "Fasting Friendly (Farali)"],
    isPopular: true,
    isFarali: true,
    rating: 4.9,
    reviewCount: 210,
    funFact: "Farali Chevdo is a Kathiyawadi delicacy crafted specifically for fasting days, but enjoyed all year round!",
    reviews: [
      {
        id: "r6",
        author: "Sanjay Shah",
        rating: 5,
        date: "4 days ago",
        comment: "The peanut and potato ratio is spot on. Very fresh peanuts!"
      }
    ]
  },
  {
    id: "healthy-wheels",
    name: "Healthy Wheels",
    category: "Fryums & Wheels",
    subcategory: "Fryums & Wheels",
    mrp: 30.00,
    weight: "125 g",
    image: "/images/plain_healthy_wheels.jpeg",
    ingredients: ["All Purpose Wheat Flour", "Pure Groundnut Oil", "Common Salt"],
    description: "Loved by children and adults alike, these airy, wheel-shaped wheat crisps are cooked in pure groundnut oil and lightly salted. A simple, light crunch that brings joy to snack time.",
    features: ["100% Pure Groundnut Oil", "Classic Crunch", "Kid Friendly"],
    rating: 4.6,
    reviewCount: 75,
    funFact: "Airy wheels absorb less oil while frying, delivering a guilt-free crunch for kids and tea breaks!",
    reviews: []
  },
  {
    id: "masala-wheels",
    name: "Masala Wheels",
    category: "Fryums & Wheels",
    subcategory: "Fryums & Wheels",
    mrp: 30.00,
    weight: "125 g",
    image: "/images/masala_wheels.jpeg",
    ingredients: ["All Purpose Wheat Flour", "Pure Groundnut Oil", "Chilli Powder", "Common Salt"],
    description: "Classic wheel-shaped wheat snacks spiced with red chili powder and salt. Fried in pure groundnut oil, they provide a light and airy crunch with a warm, spicy kick.",
    features: ["100% Pure Groundnut Oil", "Spicy & Light", "Kid Friendly"],
    rating: 4.7,
    reviewCount: 68,
    funFact: "Fun wheel shapes dusted with spicy chili powder make this a favorite party bowl snack!",
    reviews: []
  },
  {
    id: "methi-khakhra",
    name: "Methi Khakhra",
    category: "Khakhra",
    subcategory: "Traditional Khakhra",
    mrp: 80.00,
    weight: "125 g",
    image: "/images/methi_khakhra.jpeg",
    ingredients: ["Whole Wheat Flour", "Pure Groundnut Oil", "Water", "Iodised Salt", "Fenugreek Leaves (Methi)", "Turmeric Powder"],
    description: "Handmade, roasted Crispy Methi Khakhra which is made from premium whole wheat flour, infused with fresh fenugreek leaves (methi) and turmeric. Prepared in small batches with Pure Groundnut oil for good aroma and Good Health.",
    features: ["100% Whole Wheat", "Pure Groundnut Oil", "Hand Roasted"],
    isPopular: true,
    rating: 4.8,
    reviewCount: 132,
    funFact: "Hand-roasted Khakhra prepared by traditional method to preserve the natural aroma of fresh methi leaves!",
    reviews: [
      {
        id: "r7",
        author: "Bhavna Vora",
        rating: 5,
        date: "3 days ago",
        comment: "Super thin and crispy! Perfect breakfast with morning tea."
      }
    ]
  },
  {
    id: "masala-khakhra",
    name: "Masala Khakhra",
    category: "Khakhra",
    subcategory: "Traditional Khakhra",
    mrp: 80.00,
    weight: "125 g",
    image: "/images/masala_khakhra.jpeg",
    ingredients: ["Whole Wheat Flour", "Pure Groundnut Oil", "Water", "Iodised Salt", "Chilli Powder", "Black Pepper", "Ajwain Seeds", "Turmeric Powder"],
    description: "Richly flavored whole wheat khakhra seasoned with red chili powder, black pepper, digestive ajwain seeds, and turmeric. Expertly roasted with pure groundnut oil to pair perfectly with hot chai.",
    features: ["100% Whole Wheat", "Pure Groundnut Oil", "Hand Roasted", "Spicy Blend"],
    rating: 4.8,
    reviewCount: 110,
    funFact: "Ajwain seeds inside Masala Khakhra boost digestion while giving an irresistible herbal aroma!",
    reviews: []
  },
  {
    id: "jeera-khakhra",
    name: "Jeera Khakhra",
    category: "Khakhra",
    subcategory: "Traditional Khakhra",
    mrp: 80.00,
    weight: "125 g",
    image: "/images/jeera_khakhra.jpeg",
    ingredients: ["Whole Wheat Flour", "Pure Groundnut Oil", "Water", "Iodised Salt", "Whole Cumin (Jeera)"],
    description: "Light and crispy whole wheat khakhra flavored with aromatic roasted whole cumin seeds (jeera) and salt. A highly digestible and soothing snack, toasted to thin perfection with groundnut oil.",
    features: ["100% Whole Wheat", "Pure Groundnut Oil", "Hand Roasted", "Rich in Cumin"],
    rating: 4.7,
    reviewCount: 95,
    funFact: "Roasted jeera adds natural digestive benefits and a rich earthy flavor in every bite!",
    reviews: []
  },
  {
    id: "kothmir-khakhra",
    name: "Kothmir Khakhra",
    category: "Khakhra",
    subcategory: "Traditional Khakhra",
    mrp: 80.00,
    weight: "125 g",
    image: "/images/kothmir_khakhra.jpeg",
    ingredients: ["Whole Wheat Flour", "Pure Groundnut Oil", "Water", "Iodised Salt", "Fresh Green Coriander", "Green Chilli", "Turmeric Powder"],
    description: "A fresh and herbaceous whole wheat khakhra made with real green coriander leaves (kothmir) and green chilies, balanced with turmeric. Roasted with pure groundnut oil for a fresh, zesty flavor.",
    features: ["100% Whole Wheat", "Pure Groundnut Oil", "Hand Roasted", "Fresh Herbs"],
    rating: 4.8,
    reviewCount: 88,
    funFact: "Real fresh coriander leaves are chopped daily and kneaded directly into the dough!",
    reviews: []
  },
  {
    id: "farali-khakhra",
    name: "Farali Khakhra",
    category: "Khakhra",
    subcategory: "Traditional Khakhra",
    mrp: 80.00,
    weight: "125 g",
    image: "/images/farali_khakhra.jpeg",
    ingredients: ["Farali Flour Blend", "Pure Groundnut Oil", "Water", "Rock Salt (Sindhalu)", "Ajwain Seeds", "Black Pepper", "Chilli Powder"],
    description: "A specialty flatbread made using fasting-friendly farali flour. Toasted in pure groundnut oil and spiced with ajwain seeds, black pepper, and chili. Ideal for satisfying hunger during fasts.",
    features: ["Fasting Friendly (Farali)", "Pure Groundnut Oil", "Hand Roasted"],
    isFarali: true,
    rating: 4.9,
    reviewCount: 140,
    funFact: "Made without regular wheat flour, this Khakhra is 100% suitable for fasting days!",
    reviews: []
  }
];

const CATEGORIES = [
  "Wafers",
  "Namkeen",
  "Khakhra",
  "Fryums & Wheels",
  "Farali Specials"
];

const SITE_CONFIG = {
  name: "Pure Crunch",
  brandFullName: "PURE CRUNCH Healthy Namkeen",
  companyName: "Achyut Industries",
  slogan: "अच्छा खाओ, अच्छा खिलाओ",
  sloganTranslation: "Eat Good, Serve Good",
  tagline: "Explore iconic Indian snacks made with 100% Pure Groundnut Oil & Mineral-Rich Sindhalu Rock Salt.",
  email: "purecrunch234@gmail.com",
  instagram: "purecrunch_4all",
  instagramUrl: "https://www.instagram.com/purecrunch_4all",
  whatsappNumber: "+919876543210",
  whatsappUrl: "https://wa.me/message/5VROMDUVB3U3P1",
  phoneNumberDisplay: "+91 98765 43210",
  fssaiLicense: "10725030000551",
  address: "Achyut Industries, Rajkot, Gujarat - 360004, India",
  aboutShort: "Crafted with Pure Groundnut Oil and added Authentic Masala in small batches for your family's health",
  aboutText: "Achyut Industries is committed to bringing healthy snack options to every family through its premium brand Pure Crunch. We believe that for a healthy lifestyle, snacks should be made with healthy oils and certified spices. Due to imported palm oil and poor quality spices, the problem of blocked arteries and heart attacks has increased significantly today. Therefore, we prepare snacks in small batches, in heart-friendly, 100% pure cold-pressed peanut oil and certified spices.",
  qualityPromises: [
    {
      title: "100% Pure Groundnut Oil",
      description: "Cooked exclusively in heart-friendly, premium groundnut oil with zero harmful trans fats.",
      icon: "Droplet"
    },
    {
      title: "Farm-Fresh Red Potatoes",
      description: "Crafted from select low-moisture red potatoes that fry to a signature light, non-greasy crunch with rich natural flavor.",
      icon: "Leaf"
    },
    {
      title: "Small Batch Frying",
      description: "Prepared in small artisan batches in Rajkot, Gujarat for maximum freshness and crunch.",
      icon: "Flame"
    },
    {
      title: "No Artificial Colors or Preservatives",
      description: "100% natural ingredients with authentic Gujarati spices and aromatic spices.",
      icon: "ShieldCheck"
    }
  ],
  stats: [
    { label: "Pure Groundnut Oil", value: "100%" },
    { label: "Snack Varieties", value: "13+" },
    { label: "Happy Snackers", value: "50,000+" },
    { label: "Rock Salt Seasoned", value: "100%" }
  ]
};

async function seed() {
  console.log("Connecting to MongoDB Atlas...");
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    console.log("Connected successfully!");

    const db = client.db("pure_crunch_db");

    // Check existing collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log("Current collections in database:", collectionNames);

    // Drop unused collections if they exist
    if (collectionNames.includes("temp")) {
      console.log("Dropping unused 'temp' collection...");
      await db.collection("temp").drop();
    }
    if (collectionNames.includes("inquiries")) {
      console.log("Dropping unused 'inquiries' collection...");
      await db.collection("inquiries").drop();
    }

    // 1. Seed products collection
    console.log("\n--- Seeding 'products' collection ---");
    const productsCol = db.collection("products");

    // Create unique index on id
    await productsCol.createIndex({ id: 1 }, { unique: true });
    console.log("Created unique index on 'id' field.");

    // Upsert each product to prevent duplicate errors and allow re-seeding
    let productUpsertCount = 0;
    for (const prod of PRODUCTS) {
      const now = new Date();
      const prodImages = Array.isArray(prod.images) && prod.images.length > 0 ? prod.images : [prod.image];
      await productsCol.updateOne(
        { id: prod.id },
        { 
          $set: { 
            ...prod, 
            images: prodImages,
            updatedAt: now 
          },
          $setOnInsert: { 
            createdAt: now 
          }
        },
        { upsert: true }
      );
      productUpsertCount++;
    }
    console.log(`Successfully seeded ${productUpsertCount} products into 'products' collection.`);

    // 2. Seed site_config collection
    console.log("\n--- Seeding 'site_config' collection ---");
    const siteConfigCol = db.collection("site_config");
    await siteConfigCol.updateOne(
      { key: "main_config" },
      { 
        $set: { 
          key: "main_config",
          data: SITE_CONFIG, 
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    );
    console.log("Successfully seeded site configuration into 'site_config' collection.");

    // 3. Seed categories collection
    console.log("\n--- Seeding 'categories' collection ---");
    const categoriesCol = db.collection("categories");
    await categoriesCol.updateOne(
      { key: "product_categories" },
      { 
        $set: { 
          key: "product_categories",
          categories: CATEGORIES, 
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    );
    console.log("Successfully seeded categories into 'categories' collection.");

    // Verification
    const finalCollections = await db.listCollections().toArray();
    console.log("\nDatabase collections now:", finalCollections.map(c => c.name));
    
    const count = await productsCol.countDocuments();
    console.log(`Total documents in 'products': ${count}`);

    const sample = await productsCol.findOne({ id: "plain-salty" }, { projection: { _id: 0, id: 1, name: 1, image: 1, images: 1, weight: 1, mrp: 1 } });
    console.log("Sample product from MongoDB:", sample);

    console.log("\nMongoDB seeding completed successfully!");
  } catch (err) {
    console.error("Error during MongoDB seeding:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
