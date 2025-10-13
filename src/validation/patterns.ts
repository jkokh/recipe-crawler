const GEO_WORDS =
    "America|England|France|Italy|Philippines|India|China|Japan|Korea|Mexico|Canada|Spain|Germany|Thailand|Vietnam|Turkey|Brazil|Australia|Scotland|Ireland|Greece";

export const suspiciousPatterns = [
    // Authorship / Attribution
    /\b(recipe|adapted|courtesy|credit(?:ed)?|photography)\s+by\s+[A-Z]/i,
    /\binspired\s+by\s+[A-Z]/i,
    new RegExp(
        `\\bby\\s+(?!(${GEO_WORDS})\\b)[A-Z][a-z]+(?:\\s+[A-Z][a-z]+){0,2}\\b(?!\\s*(with|for|in|on|of|to|at|from|using|and))`
    ),
    /\bthanks\s+to\s+(?!the\b|this\b|that\b|these\b|it\b)[A-Z][A-Za-z]+/i,
    /\bspecial\s+thanks\b/i,
    /\boriginally\s+(published|posted)\b/i,
    /\bvia\s+(?!the\b|this\b|that\b)[A-Z][A-Za-z]+/i,

    // Commercial / Brands / Websites
    /\b[a-z0-9-]+\.(com|net|org|io|co|uk|ca|au|de|fr|it)\b/i,
    /https?:\/\/(?!www\.simplyrecipes\.com\/thmb\/)[^\s]+/i,
    /simplyrecipes/i,
    /allrecipes/i,
    /epicurious/i,
    /bon\s+app[eé]tit/i,
    /serious\s+eats/i,
    /food\s+network/i,
    /the\s+kitchn/i,
    /budget\s+bytes/i,
    /nyt\s+cooking/i,
    /martha\s+stewart/i,
    /king\s+arthur/i,
    /pioneer\s+woman/i,
    /america'?s\s+(test\s+kitchen|test\s+kit)/i,

    // Legal / Copyright
    /©|\(c\)|copyright|all\s+rights\s+reserved/i,
    /®|™/,
    /©\s*\d{4}/i,
    /\(c\)\s*\d{4}/i,

    // Advertising / Sponsorship
    /\bsponsored\s+by\b/i,
    /\baffiliate\b/i,
    /\bpartnership\b/i,
    /\bcollaboration\b/i,
    /\bpaid\s+promotion\b/i,
    /\badvertisement\b/i,
    /\bpromo(code)?\b/i,

    // Social media / Handles
    /@[a-z0-9_]{3,}/i,
    /#(ad|sponsored|partner|promotion)/i,
];