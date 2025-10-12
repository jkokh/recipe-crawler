import * as cheerio from "cheerio";
import {Nutrition} from "../../types";


export const getNutrition = ($article: cheerio.Cheerio): Nutrition | null => {
    const $ = cheerio.load($article[0]);

    // Find the nutrition label table
    const $nutrition = $('.nutrition-label table');

    if (!$nutrition.length) {
        return null;
    }

    // Initialize res object
    const res: Nutrition = {
        servings: "",
        rows: []
    };

    // Extract servings from thead
    const $thead = $nutrition.find('thead');

    // For servings - second row in thead (handle line breaks properly)
    const $servingsRow = $thead.find('tr').eq(1);
    if ($servingsRow.length) {
        // Get the HTML content to preserve line breaks
        const servingsHtml = $servingsRow.html() || '';

        // Extract all text, normalizing whitespace but preserving line break content
        let servingsText = servingsHtml
            .replace(/<br\s*\/?>/gi, ' ') // Replace <br> with space
            .replace(/\n/g, ' '); // Replace newlines with space

        // Load this normalized HTML to extract text properly
        const $servingsContent = cheerio.load(`<div>${servingsText}</div>`);
        servingsText = $servingsContent('div').text().trim();

        // Extract servings from the text
        const servingsMatch = servingsText.match(/Servings:\s*(.*)/i);
        if (servingsMatch) {
            res.servings = servingsMatch[1].trim();
        } else {
            // If no explicit "Servings:" label, get all text
            res.servings = servingsText.replace(/^[^0-9]*/, '').trim();
        }
    }

    // Process tbody rows
    $nutrition.find('tbody tr').each((_, row) => {
        const $cells = $(row).find('td');
        const rowText = $(row).text().trim();

        // Skip the "Amount per serving" row
        if (rowText.toLowerCase().includes('amount per serving')) {
            return;
        }

        if ($cells.length === 1) {
            // Single cell (colspan=2)
            const labelText = $cells.text().trim();
            res.rows.push({ label: labelText });
        } else if ($cells.length === 2) {
            const labelText = $cells.eq(0).text().trim();
            const valueText = $cells.eq(1).text().trim();

            if (valueText) {
                res.rows.push({ label: labelText, value: valueText });
            } else {
                res.rows.push({ label: labelText });
            }
        }
    });

    // Process tfoot rows (vitamins, minerals, etc.)
    $nutrition.find('tfoot tr').each((_, row) => {
        const $cells = $(row).find('td');

        // Skip the footnote row about daily values
        if ($cells.length === 1 && $cells.text().includes('*The % Daily Value')) {
            return;
        }

        if ($cells.length === 2) {
            const labelText = $cells.eq(0).text().trim();
            const valueText = $cells.eq(1).text().trim();

            if (valueText) {
                res.rows.push({ label: labelText, value: valueText });
            } else {
                res.rows.push({ label: labelText });
            }
        }
    });

    $nutrition.remove();

    return res;

}