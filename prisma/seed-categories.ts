import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
    { "id": 1, "parentId": null, "title": "Cuisine & Region", "slug": "cuisine-region" },

    { "id": 2, "parentId": 1, "title": "Asian", "slug": "asian" },
    { "id": 3, "parentId": 2, "title": "Japanese", "slug": "japanese" },
    { "id": 4, "parentId": 2, "title": "Korean", "slug": "korean" },
    { "id": 5, "parentId": 2, "title": "Chinese", "slug": "chinese" },
    { "id": 6, "parentId": 2, "title": "Thai", "slug": "thai" },
    { "id": 7, "parentId": 2, "title": "Vietnamese", "slug": "vietnamese" },
    { "id": 8, "parentId": 2, "title": "Indian & South Asian", "slug": "indian-south-asian" },
    { "id": 9, "parentId": 2, "title": "Southeast Asian (General)", "slug": "southeast-asian" },

    { "id": 10, "parentId": 1, "title": "Mediterranean & Middle Eastern", "slug": "mediterranean-middle-eastern" },
    { "id": 11, "parentId": 10, "title": "Mediterranean", "slug": "mediterranean" },
    { "id": 12, "parentId": 10, "title": "Middle Eastern", "slug": "middle-eastern" },
    { "id": 13, "parentId": 10, "title": "Turkish", "slug": "turkish" },
    { "id": 14, "parentId": 10, "title": "North African", "slug": "north-african" },

    { "id": 15, "parentId": 1, "title": "European", "slug": "european" },
    { "id": 16, "parentId": 15, "title": "Italian", "slug": "italian" },
    { "id": 17, "parentId": 15, "title": "French", "slug": "french" },
    { "id": 18, "parentId": 15, "title": "Spanish", "slug": "spanish" },
    { "id": 19, "parentId": 15, "title": "Germanic", "slug": "germanic" },
    { "id": 20, "parentId": 15, "title": "Eastern European", "slug": "eastern-european" },
    { "id": 21, "parentId": 15, "title": "Greek", "slug": "greek" },

    { "id": 22, "parentId": 1, "title": "Americas", "slug": "americas" },
    { "id": 23, "parentId": 22, "title": "Mexican & Latin American", "slug": "mexican-latin" },
    { "id": 24, "parentId": 22, "title": "United States Regional", "slug": "us-regional" },

    { "id": 25, "parentId": null, "title": "Diet & Nutrition", "slug": "diet-nutrition" },
    { "id": 26, "parentId": 25, "title": "Lifestyle", "slug": "lifestyle" },
    { "id": 27, "parentId": 26, "title": "Vegetarian", "slug": "vegetarian" },
    { "id": 28, "parentId": 26, "title": "Vegan", "slug": "vegan" },
    { "id": 29, "parentId": 26, "title": "Pescatarian", "slug": "pescatarian" },
    { "id": 30, "parentId": 26, "title": "Mediterranean Diet", "slug": "mediterranean-diet" },

    { "id": 31, "parentId": 25, "title": "Low-Carb Approaches", "slug": "low-carb-approaches" },
    { "id": 32, "parentId": 31, "title": "Keto", "slug": "keto" },
    { "id": 33, "parentId": 31, "title": "Paleo", "slug": "paleo" },

    { "id": 34, "parentId": 25, "title": "Dietary Restrictions", "slug": "dietary-restrictions" },
    { "id": 35, "parentId": 34, "title": "Gluten-Free", "slug": "gluten-free" },
    { "id": 36, "parentId": 34, "title": "Dairy-Free", "slug": "dairy-free" },
    { "id": 37, "parentId": 34, "title": "Nut-Free", "slug": "nut-free" },

    { "id": 38, "parentId": 25, "title": "Balanced & Light", "slug": "balanced-light" },
    { "id": 39, "parentId": 38, "title": "Low-Calorie", "slug": "low-calorie" },
    { "id": 40, "parentId": 38, "title": "Low-Fat", "slug": "low-fat" },
    { "id": 41, "parentId": 38, "title": "Light Meals", "slug": "light-meals" },

    { "id": 42, "parentId": 25, "title": "Macro-Focused", "slug": "macro-focused" },
    { "id": 43, "parentId": 42, "title": "High-Protein", "slug": "high-protein" },
    { "id": 44, "parentId": 42, "title": "High-Fiber", "slug": "high-fiber" },

    { "id": 45, "parentId": null, "title": "Dish Type & Format", "slug": "dish-type-format" },
    { "id": 46, "parentId": 45, "title": "Soups & Stews", "slug": "soups-stews" },
    { "id": 47, "parentId": 46, "title": "Light Soups", "slug": "light-soups" },
    { "id": 48, "parentId": 46, "title": "Hearty Stews", "slug": "hearty-stews" },
    { "id": 49, "parentId": 46, "title": "Braises", "slug": "braises" },

    { "id": 50, "parentId": 45, "title": "Curries", "slug": "curries" },
    { "id": 51, "parentId": 50, "title": "Indian Curries", "slug": "indian-curries" },
    { "id": 52, "parentId": 50, "title": "Thai Curries", "slug": "thai-curries" },
    { "id": 53, "parentId": 50, "title": "Coconut-Based Curries", "slug": "coconut-curries" },

    { "id": 54, "parentId": 45, "title": "Rice & Grains", "slug": "rice-grains" },
    { "id": 55, "parentId": 54, "title": "Pilafs", "slug": "pilafs" },
    { "id": 56, "parentId": 54, "title": "Biryani", "slug": "biryani" },
    { "id": 57, "parentId": 54, "title": "Paella", "slug": "paella" },
    { "id": 58, "parentId": 54, "title": "Risotto", "slug": "risotto" },
    { "id": 59, "parentId": 54, "title": "Other Grains", "slug": "other-grains" },

    { "id": 60, "parentId": 45, "title": "Pasta & Noodles", "slug": "pasta-noodles" },
    { "id": 61, "parentId": 60, "title": "Classic Pasta", "slug": "classic-pasta" },
    { "id": 62, "parentId": 60, "title": "Filled Pasta", "slug": "filled-pasta" },
    { "id": 63, "parentId": 60, "title": "Asian Noodles", "slug": "asian-noodles" },

    { "id": 64, "parentId": 45, "title": "Handhelds", "slug": "handhelds" },
    { "id": 65, "parentId": 64, "title": "Tortillas & Tacos", "slug": "tortillas" },
    { "id": 66, "parentId": 64, "title": "Pitas", "slug": "pitas" },
    { "id": 67, "parentId": 64, "title": "Sandwiches", "slug": "sandwiches" },
    { "id": 68, "parentId": 64, "title": "Wraps", "slug": "wraps" },
    { "id": 69, "parentId": 64, "title": "Skewers & Kebabs", "slug": "skewers-kebabs" },

    { "id": 71, "parentId": 45, "title": "Salads", "slug": "salads" },
    { "id": 72, "parentId": 71, "title": "Fresh Salads", "slug": "fresh-salads" },
    { "id": 73, "parentId": 71, "title": "Composed Salads", "slug": "composed-salads" },

    { "id": 74, "parentId": 45, "title": "Baked & Roasted", "slug": "baked-roasted" },
    { "id": 75, "parentId": 74, "title": "Roasts", "slug": "roasts" },
    { "id": 76, "parentId": 74, "title": "Casseroles", "slug": "casseroles" },
    { "id": 77, "parentId": 74, "title": "Sheet Pan Meals", "slug": "sheet-pan-meals" },
    { "id": 78, "parentId": 74, "title": "Oven Bakes", "slug": "oven-bakes" },

    { "id": 79, "parentId": 45, "title": "Grilled & Pan-Cooked", "slug": "grilled-pan-cooked" },
    { "id": 80, "parentId": 79, "title": "Grilled", "slug": "grilled" },
    { "id": 81, "parentId": 79, "title": "Pan-Seared", "slug": "pan-seared" },
    { "id": 82, "parentId": 79, "title": "Stir-Fried", "slug": "stir-fried" },
    { "id": 83, "parentId": 79, "title": "Shallow-Fried", "slug": "shallow-fried" },

    { "id": 84, "parentId": 45, "title": "One-Pot & Convenience", "slug": "one-pot-convenience" },
    { "id": 85, "parentId": 84, "title": "One-Pot Meals", "slug": "one-pot-meals" },
    { "id": 86, "parentId": 84, "title": "Pressure-Cooked", "slug": "pressure-cooked" },
    { "id": 87, "parentId": 84, "title": "Slow-Cooked", "slug": "slow-cooked" },
    { "id": 88, "parentId": 84, "title": "Quick Simmer", "slug": "quick-simmer" },
    { "id": 89, "parentId": 84, "title": "Quick Roast", "slug": "quick-roast" },

    { "id": 90, "parentId": null, "title": "Time, Ease & Occasion", "slug": "time-ease-occasion" },
    { "id": 91, "parentId": 90, "title": "Time", "slug": "time" },
    { "id": 92, "parentId": 91, "title": "Quick & Easy", "slug": "quick-easy" },
    { "id": 93, "parentId": 91, "title": "Make-Ahead", "slug": "make-ahead" },
    { "id": 94, "parentId": 90, "title": "Occasion", "slug": "occasion" },
    { "id": 95, "parentId": 94, "title": "Everyday Family", "slug": "everyday-family" },
    { "id": 96, "parentId": 94, "title": "Social Gatherings", "slug": "social-gatherings" },
    { "id": 97, "parentId": 94, "title": "Celebrations", "slug": "celebrations" },

    { "id": 98, "parentId": null, "title": "Meal Time", "slug": "meal-time" },
    { "id": 99, "parentId": 98, "title": "Breakfast", "slug": "breakfast" },
    { "id": 100, "parentId": 98, "title": "Brunch", "slug": "brunch" },
    { "id": 101, "parentId": 98, "title": "Lunch", "slug": "lunch" },
    { "id": 102, "parentId": 98, "title": "Dinner", "slug": "dinner" },

    { "id": 103, "parentId": null, "title": "Starters & Small Bites", "slug": "starters-small-bites" },
    { "id": 104, "parentId": 103, "title": "Appetizers", "slug": "appetizers" },
    { "id": 105, "parentId": 103, "title": "Snacks", "slug": "snacks" },
    { "id": 106, "parentId": 103, "title": "Small Handhelds", "slug": "small-handhelds" },

    { "id": 115, "parentId": null, "title": "Main Ingredient", "slug": "main-ingredient" },
    { "id": 116, "parentId": 115, "title": "Seafood", "slug": "seafood" },
    { "id": 117, "parentId": 116, "title": "Fish", "slug": "fish" },
    { "id": 118, "parentId": 116, "title": "Shellfish", "slug": "shellfish" },

    { "id": 119, "parentId": 115, "title": "Meat", "slug": "meat" },
    { "id": 120, "parentId": 119, "title": "Beef", "slug": "beef" },
    { "id": 121, "parentId": 119, "title": "Pork", "slug": "pork" },
    { "id": 122, "parentId": 119, "title": "Lamb", "slug": "lamb" },
    { "id": 123, "parentId": 119, "title": "Veal", "slug": "veal" },
    { "id": 124, "parentId": 119, "title": "Poultry", "slug": "poultry" },
    { "id": 125, "parentId": 119, "title": "Turkey", "slug": "turkey" },
    { "id": 126, "parentId": 119, "title": "Game Meats", "slug": "game" },

    { "id": 127, "parentId": 115, "title": "Plant Proteins", "slug": "plant-proteins" },
    { "id": 128, "parentId": 127, "title": "Legumes", "slug": "legumes" },
    { "id": 129, "parentId": 127, "title": "Soy", "slug": "soy" },
    { "id": 130, "parentId": 127, "title": "Tofu", "slug": "tofu" },
    { "id": 131, "parentId": 127, "title": "Tempeh", "slug": "tempeh" },

    { "id": 132, "parentId": 115, "title": "Vegetables", "slug": "vegetables" },
    { "id": 133, "parentId": 132, "title": "Leafy Greens", "slug": "leafy-greens" },
    { "id": 134, "parentId": 132, "title": "Brassicas", "slug": "brassicas" },
    { "id": 135, "parentId": 132, "title": "Nightshades", "slug": "nightshades" },
    { "id": 136, "parentId": 132, "title": "Mushrooms", "slug": "mushrooms" },
    { "id": 137, "parentId": 132, "title": "Root Vegetables", "slug": "root-vegetables" },
    { "id": 138, "parentId": 132, "title": "Squash", "slug": "squash" },
    { "id": 139, "parentId": 132, "title": "Avocado", "slug": "avocado" },
    { "id": 140, "parentId": 132, "title": "Olives", "slug": "olives" },
    { "id": 141, "parentId": 132, "title": "Fresh Herbs", "slug": "fresh-herbs" },
    { "id": 142, "parentId": 132, "title": "Asian Greens", "slug": "asian-greens" },

    { "id": 143, "parentId": 115, "title": "Grains, Pasta & Rice", "slug": "grains-pasta-rice" },
    { "id": 144, "parentId": 143, "title": "Rice", "slug": "rice" },
    { "id": 145, "parentId": 143, "title": "Pasta", "slug": "pasta-main" },
    { "id": 146, "parentId": 143, "title": "Noodles", "slug": "noodles" },
    { "id": 147, "parentId": 143, "title": "Whole Grains", "slug": "whole-grains" },
    { "id": 148, "parentId": 143, "title": "Grain Bowls", "slug": "grain-bowls" },

    { "id": 149, "parentId": 115, "title": "Dairy", "slug": "dairy" },
    { "id": 150, "parentId": 149, "title": "Cheese", "slug": "cheese" },
    { "id": 151, "parentId": 149, "title": "Yogurt", "slug": "yogurt" },
    { "id": 152, "parentId": 149, "title": "Tzatziki", "slug": "tzatziki" },
    { "id": 153, "parentId": 149, "title": "Butter", "slug": "butter" },
    { "id": 154, "parentId": 149, "title": "Ghee", "slug": "ghee" }
];

async function main() {
    for (const cat of categories) {
        await prisma.category.upsert({
            where: {id: cat.id},
            update: {
                parentId: cat.parentId,
                title: cat.title,
                slug: cat.slug,
            },
            create: {
                id: cat.id,             // explicit insert id
                parentId: cat.parentId,
                title: cat.title,
                slug: cat.slug,
            },
        });
    }
    console.log("✅ Categories seeded");
}

void main();