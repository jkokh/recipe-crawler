# Recipe Auto-Tagging System

## Is It Safe to Run?

**YES.** Safe to run multiple times.

- **Won't overwrite existing tags** (in MERGE mode, which is default)
- **Won't duplicate tags** (deduplication is automatic)
- **Won't crash if interrupted** (processes one recipe at a time)
- **Won't tag the same recipe twice** (skips recipes with 3+ tags)

## What Happens When You Run It

```
Starting tags processing...
Mode: MERGE existing tags

Loaded 247 existing tags

Found 1000 sources to process

OK "Chicken Tacos" (Source ID: 1) - 8 tags (1/1000)
Skip "Pasta Salad" (Source ID: 2): Already has 5 valid tags
OK "Chocolate Cake" (Source ID: 3) - 6 tags (2/1000)
FAIL "Untitled Recipe" (Source ID: 4): No valid tags found
...

Results:
  Updated: 847
  Skipped: 123  
  Failed: 30
  Total: 1000
```

## New Sources Added?

**Just run it again.** The script will:
- Skip old recipes that already have tags
- Only tag new recipes without tags
- Take ~1-2 seconds per new recipe (GPT API call)

**Example:** You have 1000 tagged recipes, add 50 new ones:
- Runtime: ~1-2 minutes
- Updated: 50 (the new ones)
- Skipped: 1000 (the old ones)

## Changing Mode: MERGE vs REWRITE

Open `run-tags.ts` and change this line:

```typescript
const MERGE_TAGS = true;  // ← Current setting
```

### MERGE Mode (Default) - SAFE
```typescript
const MERGE_TAGS = true;
```
- **Impact:** Only tags recipes with <3 tags
- **Keeps:** All existing tags
- **Use when:** Normal operation, new recipes added
- **Safe:** Yes, preserves all manual work

### REWRITE Mode - DESTRUCTIVE
```typescript
const MERGE_TAGS = false;
```
- **Impact:** Retags EVERY recipe, deletes old tags
- **Keeps:** Nothing, starts fresh
- **Use when:** Fixing bad tags, changing tagging strategy
- **Safe:** No, destroys existing tags

## What Can Go Wrong

### Scenario 1: You Have 10,000 Recipes
**Problem:** Script will take hours (1-2 seconds × 10,000)

**Solution:**
- Run overnight
- Or edit `run-tags.ts` to process in batches:
```typescript
const sources = await prisma.source.findMany({
    take: 100,  // Process only 100
    where: { 
        jsonParsed: { path: ['tags'], equals: [] } // Only recipes without tags
    }
});
```

### Scenario 2: GPT API Key Expired
**Problem:** Every recipe fails with API error

**Solution:**
- Check `.env` file has valid `OPENAI_API_KEY`
- Run again after fixing, it will retry failed recipes

### Scenario 3: Database Gets New Recipes While Running
**Problem:** None. New recipes added after script starts won't be processed this run.

**Solution:** Just run the script again.

### Scenario 4: Accidentally Run in REWRITE Mode
**Problem:** All tags deleted and replaced

**Solution:**
- Restore from database backup
- No other way to recover manual tags

### Scenario 5: Script Interrupted (Ctrl+C)
**Problem:** None. Already-processed recipes are saved.

**Solution:** Run again, it will skip completed ones and continue.

## Checking Results

After running, check your database:

```sql
-- How many recipes have tags?
SELECT COUNT(*) FROM source WHERE jsonParsed->'tags' != '[]';

-- Most common tags
SELECT t.name, COUNT(*) as count 
FROM tag t
JOIN source s ON s.jsonParsed->'tags' ? t.id::text
GROUP BY t.name
ORDER BY count DESC
LIMIT 20;

-- Recipes without tags
SELECT id, jsonParsed->>'title' 
FROM source 
WHERE jsonParsed->'tags' = '[]'
LIMIT 10;
```

## Recommendations

1. **Always use MERGE mode** unless you have a specific reason
2. **Run after importing new recipes** - takes a few minutes
3. **Check "Failed" count** - if >5%, something's wrong with recipe data
4. **Don't run in parallel** - one instance at a time
5. **Have a database backup** before switching to REWRITE mode

## Key Settings

```typescript
// run-tags.ts
const MERGE_TAGS = true;  // Safe mode (default)

// validate.ts
MIN_TAGS = 3              // Recipe needs at least 3 tags
MAX_TAGS = 12             // Won't create more than 12

// blacklist.ts
TAG_BLACKLIST             // 180+ words that won't be used as tags
                          // (e.g., "quick", "easy", "delicious")
```

## TL;DR

- **Run it:** `npx ts-node run-tags.ts`
- **Safe:** Yes (in MERGE mode)
- **Idempotent:** Yes, run as many times as you want
- **New recipes:** Just run again
- **Takes:** 1-2 seconds per untagged recipe
- **Don't:** Change to REWRITE mode unless you know what you're doing