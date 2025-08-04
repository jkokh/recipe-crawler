export interface CrawlerConfig {
    name: string;
    seedUrl: string;
    recipeLinkSelector: string; // CSS selector for recipe links
    recipeLinkFilter?: (href: string) => boolean; // Optional extra filter for href
}

export const crawlerConfigs: CrawlerConfig[] = [
    {
        name: "SimplyRecipes",
        seedUrl: "https://www.simplyrecipes.com/one-ingredient-upgrade-chocolate-chip-cookies-11777975",
        recipeLinkSelector: 'a[href*="-recipe-"]',
        recipeLinkFilter: (href) => href.startsWith("https://www.simplyrecipes.com/")
    },
    {
        name: "AllRecipes",
        seedUrl: "https://www.allrecipes.com/recipes/",
        recipeLinkSelector: 'a[href^="https://www.allrecipes.com/recipe/"]'
    },
    {
        name: "FoodNetwork",
        seedUrl: "https://www.foodnetwork.com/recipes/recipes-a-z",
        recipeLinkSelector: 'a[href^="https://www.foodnetwork.com/recipes/"]'
    },
    {
        name: "SeriousEats",
        seedUrl: "https://www.seriouseats.com/recipes",
        recipeLinkSelector: 'a[href^="https://www.seriouseats.com/recipes/"]'
    },
    {
        name: "BBCGoodFood",
        seedUrl: "https://www.bbcgoodfood.com/recipes",
        recipeLinkSelector: 'a.card__title-link'
    },
    {
        name: "Epicurious",
        seedUrl: "https://www.epicurious.com/recipes",
        recipeLinkSelector: 'a.view-complete-item'
    },
    {
        name: "NYTCooking",
        seedUrl: "https://cooking.nytimes.com/recipes",
        recipeLinkSelector: 'a[href^="/recipes/"]',
        recipeLinkFilter: (href) => href.startsWith("/recipes/")
    },
    {
        name: "TasteOfHome",
        seedUrl: "https://www.tasteofhome.com/recipes/",
        recipeLinkSelector: 'a[data-tracking-label="recipe title"]'
    },
    {
        name: "Delish",
        seedUrl: "https://www.delish.com/cooking/recipe-ideas/",
        recipeLinkSelector: 'a.simple-item-title'
    },
    {
        name: "TheKitchn",
        seedUrl: "https://www.thekitchn.com/recipes",
        recipeLinkSelector: 'a.PostsList__postTitleLink'
    }
];
