# 5. Rephraser

This module rewrites/selectively improves textual bits of a parsed recipe and stores the results in the `phrases` table via `PhraseService`.

Supported targets:
- Paragraphs (body text)
- Image alt texts
- Titles

Two execution paths exist:
- Anthropic Batch results ingester (recommended for paragraphs and image alts)
- Direct GPT rewrite for titles ("How to" titles helper)


## Prerequisites
- Node.js (project-wide requirements)
- A configured database and Prisma schema (DATABASE_URL)
- API keys as needed:
  - ANTHROPIC_API_KEY for Claude batch results
  - OPENAI_API_KEY for GPT title rewriting

Place your env values in a `.env` file at the project root (dotenv is used).


## Where results are stored
All rewritten text is persisted through `PhraseService` into the `phrases` table. The record is uniquely identified by `(type, sourceId, version)` and the original text hash is stored for reference.

Types and versions used here:
- Paragraphs: type = `paragraph`, version = `claudebatch-{{sourceId}}_{{index}}`
- Image alt texts: type = `image-alt`, version = `claudebatch-{{sourceId}}_{{index}}`
- Titles (Claude batch): type = `title`, version = `claudebatch-{{sourceId}}`
- Titles (GPT helper): type = `title`, version = `gpt v1`


## 1) Process Anthropic batch results
Files:
- src/5.rephraser/get-batch-results/configs.ts
- src/5.rephraser/get-batch-results/BatchProcessor.ts
- src/5.rephraser/get-batch-results/run-batch-results.ts

Input: one or more batch IDs saved under the `batch-ids/` folder in the project root.

Expected formats (see `configs.ts`):
- paragraphs → `batch-ids/paragraph.txt`
  - each line: `BATCH_ID [SOURCE_ID]`
  - customId used in the batch requests must be the 0-based index of the paragraph
- images → `batch-ids/image.txt`
  - each line: `BATCH_ID`
  - customId used in the batch requests must be `SOURCE_ID_INDEX` (e.g. `123_0`)
- titles → `batch-ids/title.txt`
  - each line: `BATCH_ID`
  - customId used in the batch requests must be the `SOURCE_ID`

How mapping works
- For each batch ID, results are fetched via `ClaudeBatchProvider.getBatchResults`.
- Results are grouped by `sourceId` (derived either from the batch line or from `customId`).
- For each source, the module loads `Source.jsonParsed` and maps each result back to the original item by `index` (paragraph index, image index, etc.).
- Each pair `{originalText, alteredText}` is written via `PhraseService.store` with the configured `type` and `version`.

Run from the project root:
- node --import ./register-loader.js src/5.rephraser/get-batch-results/run-batch-results.ts

By default the script:
- processes images
- processes paragraphs
- leaves titles commented out (since titles may be handled elsewhere)

You can edit `run-batch-results.ts` to enable/disable specific processors.


## 2) Rewrite titles with GPT ("How to" helper)
File:
- src/5.rephraser/titles/helpers/start-rewrite-how-to.ts

What it does
- For each existing phrase row (ordered by `sourceId`), it fetches minimal context from the corresponding `Source.jsonParsed` (title and/or paragraphs).
- Builds a prompt to create a clear, descriptive, SEO-friendly title (50–70 chars, avoids “How to Make”, avoids spam words).
- Calls GPT and stores the rewritten title as `type = "title"`, `version = "gpt v1"`.

Run from the project root:
- node --import ./register-loader.js src/5.rephraser/titles/helpers/start-rewrite-how-to.ts


## Environment variables
- DATABASE_URL=... (Prisma connection)
- ANTHROPIC_API_KEY=... (required to fetch Claude batch results)
- OPENAI_API_KEY=... (required to run GPT title helper)

Optional provider tuning in code:
- Claude model defaults to `claude-3-5-haiku-20241022` (see `lib/ai-providers/claude-batch.ts`).
- GPT model defaults to `gpt-4.1-nano` (see `lib/ai-providers/gpt.ts`).


## Troubleshooting
- Missing key errors: ensure `.env` exists and contains the required API keys.
- No updates stored: verify that `Source.jsonParsed` contains the arrays/fields referenced (paragraphs, images, title) and that batch `customId` formats match `configs.ts` expectations.
- Unique constraint conflicts: storage is done via `upsert` on `(type, sourceId, version)` so re-runs should update existing records.


## Notes
- Keep the working directory at the project root when running these scripts so relative paths like `batch-ids/...` resolve correctly.
- If you need to change the input mapping or storage versioning, modify `src/5.rephraser/get-batch-results/configs.ts`. 
