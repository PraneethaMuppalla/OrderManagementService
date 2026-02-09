import { Product } from "@/types";

export const dummyProducts: Product[] = [
  {
    id: "1",
    name: "Classic Cheese Burger",
    description: "Juicy beef patty with melted cheddar cheese, lettuce, and tomato on a sesame bun.",
// Prices updated to reflect INR values
    price: 199,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2699&auto=format&fit=crop",
    category: "Burgers"
  },
  {
    id: "2",
    name: "Pepperoni Pizza",
    description: "Classic pizza with spicy pepperoni slices on a mozzarella cheese base.",
    price: 399,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=2680&auto=format&fit=crop", 
    category: "Pizza"
  },
  {
    id: "3",
    name: "Sushi Platter",
    description: "Assorted fresh sushi including salmon, tuna, and avocado rolls.",
    price: 599,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2670&auto=format&fit=crop",
    category: "Japanese"
  },
  {
    id: "4",
    name: "Caesar Salad",
    description: "Crisp romaine lettuce with parmesan cheese, croutons, and Caesar dressing.",
    price: 199,
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?q=80&w=2574&auto=format&fit=crop",
    category: "Salads"
  },
  {
    id: "5",
    name: "Spaghetti Carbonara",
    description: "Italian pasta dish with egg, hard cheese, cured pork, and black pepper.",
    price: 349,
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=2702&auto=format&fit=crop",
    category: "Italian"
  },
  {
    id: "6",
    name: "Grilled Steak",
    description: "Perfectly grilled ribeye steak served with garlic mashed potatoes.",
    price: 699,
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2670&auto=format&fit=crop",
    category: "Main Course"
  },
];
