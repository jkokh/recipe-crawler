
/*
Module: IngredientNormalizer
Purpose: Provides utilities to standardize ingredient names for matching.
- Removes quantities, units, brands, descriptors, and instruction phrases
- Singularizes/pluralizes consistently and lowercases words
- Produces normalized strings and stable slugs; includes title-casing and debug helpers
*/
import pluralize from 'pluralize';

const DESCRIPTORS = new Set([
    // Freshness/State
    'fresh', 'frozen', 'dried', 'canned', 'organic', 'raw', 'cooked', 'ripe',
    'stale', 'aged', 'pickled', 'smoked', 'cured', 'fermented', 'preserved',
    'refrigerated', 'thawed', 'defrosted', 'room', 'temperature',

    // Preparation
    'chopped', 'diced', 'sliced', 'minced', 'grated', 'shredded', 'whole',
    'halved', 'quartered', 'crushed', 'ground', 'mashed', 'pureed', 'blended',
    'julienned', 'cubed', 'torn', 'cut', 'trimmed', 'peeled', 'cleaned',
    'deveined', 'deboned', 'skinless', 'boneless', 'pitted', 'seeded',
    'stems', 'removed', 'husked', 'shucked',

    // Size/Quality
    'large', 'small', 'medium', 'tiny', 'huge', 'jumbo', 'baby', 'mini',
    'extra', 'super', 'thick', 'thin', 'fine', 'coarse', 'rough', 'smooth',
    'heavy', 'light', 'lean', 'fat', 'tender', 'firm', 'soft', 'hard',
    'premium', 'quality', 'grade', 'select', 'choice', 'prime',

    // Flavor/Type
    'unsalted', 'salted', 'sweet', 'bitter', 'sour', 'spicy', 'mild', 'hot',
    'sharp', 'tangy', 'tart', 'bland', 'plain', 'seasoned', 'flavored',
    'natural', 'artificial', 'concentrated', 'reduced', 'low', 'sodium',
    'sugar', 'fat', 'free', 'diet', 'lite', 'regular', 'full',

    // Color
    'white', 'black', 'brown', 'red', 'green', 'yellow', 'orange', 'purple',
    'pink', 'blue', 'golden', 'dark', 'light', 'pale', 'deep', 'bright',

    // Cooking states
    'roasted', 'toasted', 'grilled', 'fried', 'baked', 'steamed', 'boiled',
    'sauteed', 'braised', 'charred', 'caramelized', 'blanched', 'poached',

    // Instructions/Optional
    'divided', 'taste', 'optional', 'needed', 'desired', 'preference',
    'according', 'serving', 'garnish', 'decoration', 'topping',

    // Origins/Types
    'italian', 'mexican', 'asian', 'european', 'american', 'local', 'imported',
    'homemade', 'store', 'bought', 'packaged', 'jarred', 'bottled', 'canned',
    'boxed', 'bagged',

    // Measurements that might slip through
    'inch', 'inches', 'cm', 'mm', 'piece', 'pieces', 'slice', 'slices',
    'strip', 'strips', 'chunk', 'chunks', 'bit', 'bits', 'pinch'
]);

const QUANTITY_PATTERNS = [
    // Basic numbers and fractions
    /^\d+[-\/]?\d*\s*/,
    /^\d*\.\d+\s*/,
    /^½|¼|¾|⅓|⅔|⅛|⅜|⅝|⅞\s*/,
    /^\d+\s*[-–]\s*\d+/,
    /^\d+\s*to\s*\d+/,
    /^about\s*\d+/,
    /^approximately\s*\d+/,
    /^around\s*\d+/,

    // Measurements and containers
    /\d+\s*(oz|lb|lbs|pound|pounds|kg|g|gram|grams|kilogram|kilograms)/,
    /\d+\s*(cup|cups|tsp|tbsp|tablespoon|tablespoons|teaspoon|teaspoons)/,
    /\d+\s*(ml|liter|liters|quart|quarts|pint|pints|gallon|gallons)/,
    /\d+\s*(can|cans|jar|jars|box|boxes|bag|bags|package|packages)/,
    /\d+\s*(bottle|bottles|container|containers)/,

    // Special patterns
    /\d+%/,
    /\blean\b/,
    /\bof\s+\d+/,
    /\bjuice\s+of\b/,
    /\bzest\s+of\b/,
    /\bone\b|\btwo\b|\bthree\b|\bfour\b|\bfive\b|\bsix\b|\bseven\b|\beight\b|\bnine\b|\bten\b/,
    /\ba\s+few\b/,
    /\bseveral\b/,
    /\bsome\b/,
    /\bplenty\b/,
];

const INSTRUCTION_PATTERNS = [
    /\bto\s+taste\b/,
    /\bas\s+needed\b/,
    /\bif\s+desired\b/,
    /\bor\s+to\s+taste\b/,
    /\bfor\s+serving\b/,
    /\bfor\s+garnish\b/,
    /\boptional\b/,
    /\baccording\s+to\s+package\s+directions\b/,
    /\bplus\s+more\s+for\b/,
    /\bplus\s+extra\s+for\b/,
];

const BRAND_INDICATORS = [
    /\b[A-Z][a-z]+['']?s?\s+(brand|mix|sauce|seasoning)\b/,
    /\bbrand\b/,
    /\b®\b|\b™\b/,
];

const PARENTHETICAL_CONTENT = [
    /\([^)]*\)/g,  // Remove anything in parentheses
    /\[[^\]]*\]/g,  // Remove anything in brackets
];

const UNIT_PATTERNS = [
    /\b(oz|lb|lbs|pound|pounds|kg|g|gram|grams|kilogram|kilograms)\b/g,
    /\b(cup|cups|tsp|tbsp|tablespoon|tablespoons|teaspoon|teaspoons)\b/g,
    /\b(ml|liter|liters|quart|quarts|pint|pints|gallon|gallons)\b/g,
    /\b(can|cans|jar|jars|box|boxes|bag|bags|package|packages)\b/g,
    /\b(bottle|bottles|container|containers|piece|pieces)\b/g,
];

// Common ingredient standardizations
const INGREDIENT_STANDARDIZATIONS = new Map([
    // Proteins
    ['chicken breast', 'chicken'],
    ['chicken thigh', 'chicken'],
    ['beef chuck', 'beef'],
    ['ground beef', 'beef'],
    ['pork shoulder', 'pork'],
    ['salmon fillet', 'salmon'],

    // Dairy variations
    ['heavy cream', 'cream'],
    ['whipping cream', 'cream'],
    ['sour cream', 'cream'],
    ['cream cheese', 'cheese'],
    ['cheddar cheese', 'cheese'],

    // Common variations
    ['extra virgin olive oil', 'olive oil'],
    ['sea salt', 'salt'],
    ['kosher salt', 'salt'],
    ['table salt', 'salt'],
    ['black pepper', 'pepper'],
    ['white pepper', 'pepper'],
]);

export class IngredientNormalizer {
    static normalize(name: string): string {
        if (!name) return '';

        let normalized = name.toLowerCase().trim();

        // Remove parenthetical content first
        for (const pattern of PARENTHETICAL_CONTENT) {
            normalized = normalized.replace(pattern, ' ');
        }

        // Remove instruction phrases
        for (const pattern of INSTRUCTION_PATTERNS) {
            normalized = normalized.replace(pattern, ' ');
        }

        // Remove brand indicators
        for (const pattern of BRAND_INDICATORS) {
            normalized = normalized.replace(pattern, ' ');
        }

        // Remove quantity patterns
        for (const pattern of QUANTITY_PATTERNS) {
            normalized = normalized.replace(pattern, ' ');
        }

        // Remove unit patterns that might remain
        for (const pattern of UNIT_PATTERNS) {
            normalized = normalized.replace(pattern, ' ');
        }

        // Clean up connectors and punctuation
        normalized = normalized
            .replace(/\band\/or\b/g, ' ')
            .replace(/\bor\b/g, ' ')
            .replace(/\band\b/g, ' ')  // Remove 'and' connector
            .replace(/[^\w\s-]/g, ' ')  // Keep hyphens as they're important for compound ingredients
            .replace(/\s+/g, ' ')
            .trim();

        // Tokenize and filter
        const tokens = normalized
            .split(/\s+/)
            .filter(Boolean)
            .filter(w => w.length >= 2)  // Allow 2-char words (like "oz" might slip through)
            .filter(w => !DESCRIPTORS.has(w))
            .filter(w => !/^\d+$/.test(w))  // Remove pure numbers
            .map(w => pluralize.singular(w));

        if (tokens.length === 0) return '';

        let result = tokens.join(' ').trim();

        // Apply standardizations
        for (const [variant, standard] of INGREDIENT_STANDARDIZATIONS) {
            if (result.includes(variant)) {
                result = result.replace(variant, standard);
                break;  // Only apply first match
            }
        }

        return result;
    }

    static slugify(normalized: string): string {
        return normalized
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')  // Remove multiple consecutive hyphens
            .replace(/^-|-$/g, '')  // Remove leading/trailing hyphens
            .slice(0, 255);
    }

    static toTitleCase(str: string): string {
        return str
            .split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    }

}