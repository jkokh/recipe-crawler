const categories = [
    { "id": 1, "title": "Cuisine and Region", "parentId": null },

    { "id": 10, "title": "Asian", "parentId": 1 },
    { "id": 11, "title": "Mediterranean and Middle Eastern", "parentId": 1 },
    { "id": 12, "title": "European", "parentId": 1 },
    { "id": 13, "title": "Americas", "parentId": 1 },

    { "id": 14, "title": "Japanese", "parentId": 10 },
    { "id": 15, "title": "Korean", "parentId": 10 },
    { "id": 16, "title": "Chinese", "parentId": 10 },
    { "id": 17, "title": "Thai", "parentId": 10 },
    { "id": 18, "title": "Vietnamese", "parentId": 10 },
    { "id": 19, "title": "Indian and South Asian", "parentId": 10 },
    { "id": 20, "title": "Southeast Asian", "parentId": 10 },

    { "id": 21, "title": "Mediterranean", "parentId": 11 },
    { "id": 22, "title": "Middle Eastern", "parentId": 11 },
    { "id": 23, "title": "Turkish and North African", "parentId": 11 },

    { "id": 24, "title": "Italian", "parentId": 12 },
    { "id": 25, "title": "French", "parentId": 12 },
    { "id": 26, "title": "Spanish", "parentId": 12 },
    { "id": 27, "title": "Germanic and Eastern Europe", "parentId": 12 },
    { "id": 28, "title": "Greek", "parentId": 12 },

    { "id": 29, "title": "Mexican and Latin", "parentId": 13 },
    { "id": 30, "title": "United States Regional", "parentId": 13 },

    { "id": 2, "title": "Course and Meal", "parentId": null },

    { "id": 31, "title": "Breakfast and Brunch", "parentId": 2 },
    { "id": 32, "title": "Lunch", "parentId": 2 },
    { "id": 33, "title": "Dinner and Mains", "parentId": 2 },
    { "id": 34, "title": "Appetizers and Snacks", "parentId": 2 },
    { "id": 35, "title": "Sides", "parentId": 2 },
    { "id": 36, "title": "Desserts and Baking", "parentId": 2 },

    { "id": 37, "title": "Breakfast", "parentId": 31 },
    { "id": 38, "title": "Brunch", "parentId": 31 },

    { "id": 39, "title": "Starters", "parentId": 34 },
    { "id": 40, "title": "Handhelds", "parentId": 34 },

    { "id": 41, "title": "Breads and Doughs", "parentId": 36 },
    { "id": 42, "title": "Sweets", "parentId": 36 },

    { "id": 3, "title": "Diet and Nutrition", "parentId": null },

    { "id": 43, "title": "Lifestyle", "parentId": 3 },
    { "id": 44, "title": "Restrictions", "parentId": 3 },
    { "id": 45, "title": "Macros", "parentId": 3 },

    { "id": 46, "title": "Vegetarian and Vegan", "parentId": 43 },
    { "id": 47, "title": "Pescatarian", "parentId": 43 },
    { "id": 48, "title": "Keto and Low Carb", "parentId": 43 },
    { "id": 49, "title": "Paleo", "parentId": 43 },
    { "id": 50, "title": "Mediterranean Diet", "parentId": 43 },

    { "id": 51, "title": "Free From", "parentId": 44 },
    { "id": 52, "title": "Low and Light", "parentId": 44 },

    { "id": 53, "title": "Gluten Free", "parentId": 51 },
    { "id": 54, "title": "Dairy Free", "parentId": 51 },
    { "id": 55, "title": "Lactose Free", "parentId": 51 },
    { "id": 56, "title": "Soy Free", "parentId": 51 },
    { "id": 57, "title": "Nut Free", "parentId": 51 },

    { "id": 58, "title": "Low Fat", "parentId": 52 },
    { "id": 59, "title": "Low Sodium", "parentId": 52 },
    { "id": 60, "title": "Low Calorie", "parentId": 52 },
    { "id": 61, "title": "Low Sugar", "parentId": 52 },

    { "id": 62, "title": "High Protein", "parentId": 45 },

    { "id": 4, "title": "Main Ingredient", "parentId": null },

    { "id": 63, "title": "Seafood", "parentId": 4 },
    { "id": 64, "title": "Meat", "parentId": 4 },
    { "id": 65, "title": "Plant Proteins", "parentId": 4 },
    { "id": 66, "title": "Vegetables and Fungi", "parentId": 4 },
    { "id": 67, "title": "Grains Pasta and Rice", "parentId": 4 },
    { "id": 68, "title": "Cheese and Dairy", "parentId": 4 },

    { "id": 69, "title": "Fish", "parentId": 63 },
    { "id": 70, "title": "Shellfish", "parentId": 63 },

    { "id": 71, "title": "Beef", "parentId": 64 },
    { "id": 72, "title": "Pork", "parentId": 64 },
    { "id": 73, "title": "Lamb and Veal", "parentId": 64 },
    { "id": 74, "title": "Poultry and Turkey", "parentId": 64 },
    { "id": 75, "title": "Game and Other", "parentId": 64 },

    { "id": 76, "title": "Legumes", "parentId": 65 },
    { "id": 77, "title": "Soy", "parentId": 65 },

    { "id": 78, "title": "Greens and Brassicas", "parentId": 66 },
    { "id": 79, "title": "Nightshades and Others", "parentId": 66 },
    { "id": 80, "title": "Mushrooms", "parentId": 66 },
    { "id": 81, "title": "Leafy and Herbs", "parentId": 66 },
    { "id": 82, "title": "Asian Greens", "parentId": 66 },
    { "id": 83, "title": "Roots and Squash", "parentId": 66 },
    { "id": 84, "title": "Avocado and Olives", "parentId": 66 },

    { "id": 85, "title": "Rice and Bowls", "parentId": 67 },
    { "id": 86, "title": "Pasta and Noodles", "parentId": 67 },
    { "id": 87, "title": "Other Grains", "parentId": 67 },

    { "id": 88, "title": "Cheeses", "parentId": 68 },
    { "id": 89, "title": "Yogurt and Tzatziki", "parentId": 68 },
    { "id": 90, "title": "Butter and Ghee", "parentId": 68 },

    { "id": 5, "title": "Dish Type and Format", "parentId": null },

    { "id": 91, "title": "Soups and Stews", "parentId": 5 },
    { "id": 92, "title": "Curries", "parentId": 5 },
    { "id": 93, "title": "Rice and Grain Dishes", "parentId": 5 },
    { "id": 94, "title": "Pasta Dishes", "parentId": 5 },
    { "id": 95, "title": "Handhelds and Street", "parentId": 5 },
    { "id": 96, "title": "Salads", "parentId": 5 },
    { "id": 97, "title": "Baked and Roasted", "parentId": 5 },
    { "id": 98, "title": "Grilled Pan and Fry", "parentId": 5 },
    { "id": 99, "title": "One Pot and Convenience", "parentId": 5 },

    { "id": 100, "title": "Soups", "parentId": 91 },
    { "id": 101, "title": "Stews and Braises", "parentId": 91 },

    { "id": 102, "title": "Indian Curries", "parentId": 92 },
    { "id": 103, "title": "Thai Curries", "parentId": 92 },
    { "id": 104, "title": "Coconut Based", "parentId": 92 },

    { "id": 105, "title": "Pilafs and Biryani", "parentId": 93 },
    { "id": 106, "title": "Paella and Risotto", "parentId": 93 },

    { "id": 107, "title": "Tortillas and Pitas", "parentId": 95 },
    { "id": 108, "title": "Skewers and Kebabs", "parentId": 95 },
    { "id": 109, "title": "Sandwiches and Wraps", "parentId": 95 },

    { "id": 110, "title": "Roasts", "parentId": 97 },
    { "id": 111, "title": "Bakes", "parentId": 97 },
    { "id": 112, "title": "Sheet Pan", "parentId": 97 },

    { "id": 113, "title": "Grilled", "parentId": 98 },
    { "id": 114, "title": "Pan and Skillet", "parentId": 98 },
    { "id": 115, "title": "Frying", "parentId": 98 },

    { "id": 116, "title": "One Pot or Pan", "parentId": 99 },
    { "id": 117, "title": "Pressure and Slow", "parentId": 99 },
    { "id": 118, "title": "Quick Simmer or Roast", "parentId": 99 },

    { "id": 6, "title": "Flavor and Profile", "parentId": null },

    { "id": 119, "title": "Spice Level", "parentId": 6 },
    { "id": 120, "title": "Citrus and Herbs", "parentId": 6 },
    { "id": 121, "title": "Aromatics and Umami", "parentId": 6 },
    { "id": 122, "title": "Rich and Creamy", "parentId": 6 },
    { "id": 123, "title": "Sweet and Dessert", "parentId": 6 },

    { "id": 124, "title": "Mild to Hot", "parentId": 119 },

    { "id": 125, "title": "Lemon and Lime", "parentId": 120 },
    { "id": 126, "title": "Herb Forward", "parentId": 120 },

    { "id": 127, "title": "Garlic and Ginger", "parentId": 121 },
    { "id": 128, "title": "Soy and Sesame", "parentId": 121 },
    { "id": 129, "title": "Tomato and Wine", "parentId": 121 },

    { "id": 7, "title": "Time Ease and Occasion", "parentId": null },

    { "id": 130, "title": "Time", "parentId": 7 },
    { "id": 131, "title": "Ease", "parentId": 7 },
    { "id": 132, "title": "Occasion", "parentId": 7 },

    { "id": 133, "title": "10 to 20 Minutes", "parentId": 130 },
    { "id": 134, "title": "30 Minutes", "parentId": 130 },

    { "id": 135, "title": "Quick and Easy", "parentId": 131 },
    { "id": 136, "title": "Make Ahead", "parentId": 131 },

    { "id": 137, "title": "Casual and Family", "parentId": 132 },
    { "id": 138, "title": "Social and Special", "parentId": 132 },

    { "id": 200, "title": "Holidays and Celebrations", "parentId": null },
    { "id": 201, "title": "Thanksgiving", "parentId": 200 },
    { "id": 202, "title": "Christmas", "parentId": 200 },
    { "id": 203, "title": "Easter", "parentId": 200 },
    { "id": 204, "title": "Fourth of July", "parentId": 200 },
    { "id": 205, "title": "Halloween", "parentId": 200 },
    { "id": 206, "title": "Valentine’s Day", "parentId": 200 },
    { "id": 207, "title": "Super Bowl", "parentId": 200 },
    { "id": 208, "title": "St. Patrick’s Day", "parentId": 200 },
    { "id": 209, "title": "Mother’s Day", "parentId": 200 },
    { "id": 210, "title": "Father’s Day", "parentId": 200 },
    { "id": 211, "title": "New Year’s Eve and Day", "parentId": 200 },
    { "id": 212, "title": "Oktoberfest", "parentId": 200 },

    { "id": 8, "title": "Named Dishes and Classics", "parentId": null },

    { "id": 139, "title": "French Classics", "parentId": 8 },
    { "id": 140, "title": "Italian Classics", "parentId": 8 },
    { "id": 141, "title": "Global Favorites", "parentId": 8 },

    { "id": 9, "title": "Technique and Doneness", "parentId": null },

    { "id": 142, "title": "Prep and Cook", "parentId": 9 },
    { "id": 143, "title": "Texture and Result", "parentId": 9 },

    { "id": 144, "title": "Grill and Smoke", "parentId": 142 },
    { "id": 145, "title": "Roast and Bake", "parentId": 142 },
    { "id": 146, "title": "Pan and Skillet Technique", "parentId": 142 },
    { "id": 147, "title": "Fry Methods", "parentId": 142 },
    { "id": 148, "title": "Moist Heat", "parentId": 142 },
    { "id": 149, "title": "Stir and Saute", "parentId": 142 },

    { "id": 150, "title": "Tender and Crisp", "parentId": 143 },
    { "id": 151, "title": "Hearty and Rich", "parentId": 143 }
];
