Run

1. run parser-all-to-json/start-steps.ts this will parse html files to json
2. run rephraser:
    - start-batch-article.ts (will send paragraphs to Cloude)
    - start-batch-results-example.ts (this will get the results and rewrite paragraphs in the json field)
    - categories/start-categories.ts (this will assign categories to recipe and save as array of ids to json)

To clean up DB / purge cache run RESET MASTER;
Restart the container.


1. Copy sitemap and run run-sitemap-parser.ts
2. Run html-fetch / html-fetch.ts