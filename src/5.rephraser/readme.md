# Rephrasing artifacts

## Types
1. **paragraph** - Article paragraph
2. **title** - Title
3. **image-alt** - Images alt text
4. **step** - Recipe step
5. **step-title** - Recipe step title

## Query phrases by version
```sql
SELECT 
    `type`,
    `version`,
    COUNT(*) as total_phrases,
    COUNT(DISTINCT `source_id`) as unique_sources,
    MIN(`created_at`) as first_created,
    MAX(`updated_at`) as last_updated
FROM `phrases`
WHERE `version` = 'v2'
GROUP BY `type`, `version`
ORDER BY `type`, `version`;