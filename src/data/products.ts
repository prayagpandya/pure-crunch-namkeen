export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Wafers' | 'Namkeen' | 'Khakhra' | 'Fryums & Wheels' | string;
  subcategory: string;
  ingredients: string[];
  mrp: number;
  weight: string;
  image: string;
  images?: string[];
  description: string;
  features: string[];
  isPopular?: boolean;
  isFarali?: boolean;
  rating: number;
  reviewCount: number;
  funFact: string;
  nutritionInfo?: {
    energy: string;
    protein: string;
    carbohydrates: string;
    fat: string;
    sodium: string;
  };
  reviews: Review[];
}

export const PRODUCTS: Product[] = [
  {
    id: "plain-salty",
    name: "Plain Salty Wafers",
    category: "Wafers",
    subcategory: "Potato Wafers",
    mrp: 70.00,
    weight: "125 g",
    image: "/products/plain-salty.jpg",
    images: ["/products/plain-salty.jpg"],
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
    image: "/products/plain-masala.jpg",
    images: ["/products/plain-masala.jpg"],
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
    image: "/products/salty-line.jpg",
    images: ["/products/salty-line.jpg"],
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
    image: "/products/masala-line.jpg",
    images: ["/products/masala-line.jpg"],
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
    image: "/products/mari-banana.jpg",
    images: ["/products/mari-banana.jpg"],
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
    image: "/products/farali-chevdo.jpg",
    images: ["/products/farali-chevdo.jpg"],
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
    image: "/products/healthy-wheels.jpg",
    images: ["/products/healthy-wheels.jpg"],
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
    image: "/products/masala-wheels.jpg",
    images: ["/products/masala-wheels.jpg"],
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
    image: "/products/methi-khakhra.jpg",
    images: ["/products/methi-khakhra.jpg"],
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
    image: "/products/masala-khakhra.jpg",
    images: ["/products/masala-khakhra.jpg"],
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
    image: "/products/jeera-khakhra.jpg",
    images: ["/products/jeera-khakhra.jpg"],
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
    image: "/products/kothmir-khakhra.jpg",
    images: ["/products/kothmir-khakhra.jpg"],
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
    image: "/products/farali-khakhra.jpg",
    images: ["/products/farali-khakhra.jpg"],
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

export const CATEGORIES = [
  "Wafers",
  "Namkeen",
  "Khakhra",
  "Fryums & Wheels",
  "Farali Specials"
];
