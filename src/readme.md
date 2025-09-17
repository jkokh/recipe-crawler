Run

1. run parser-all-to-json/start-steps.ts this will parse html files to json
2. run rephraser:
    - start-batch-article.ts (will send paragraphs to Cloude)
    - start-batch-results.ts (this will get the results and rewrite paragraphs in the json field)
    - categories/start-categories.ts (this will assign categories to recipe and save as array of ids to json)
3. 