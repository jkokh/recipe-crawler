import * as cheerio from 'cheerio';

export function nutritionToJson(html: string) {
  // Load HTML with cheerio
  const $ = cheerio.load(html);
  
  // Find the nutrition label table
  const $nutritionLabel = $('.nutrition-label');

  if (!$nutritionLabel.length) {
    return null;
  }

  const $table = $nutritionLabel.find('table');
  
  // Initialize result object
  const result = {
    servings: "",
    rows: [] as { label: string; value?: string }[]
  };
  
  // Extract servings from thead
  const $thead = $table.find('thead');
  
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
      result.servings = servingsMatch[1].trim();
    } else {
      // If no explicit "Servings:" label, get all text
      result.servings = servingsText.replace(/^[^0-9]*/, '').trim();
    }
  }
  
  // Process tbody rows
  $table.find('tbody tr').each((_, row) => {
    const $cells = $(row).find('td');
    const rowText = $(row).text().trim();
    
    // Skip the "Amount per serving" row
    if (rowText.toLowerCase().includes('amount per serving')) {
      return;
    }
    
    if ($cells.length === 1) {
      // Single cell (colspan=2)
      const labelText = $cells.text().trim();
      result.rows.push({ label: labelText });
    } else if ($cells.length === 2) {
      const labelText = $cells.eq(0).text().trim();
      const valueText = $cells.eq(1).text().trim();
      
      if (valueText) {
        result.rows.push({ label: labelText, value: valueText });
      } else {
        result.rows.push({ label: labelText });
      }
    }
  });
  
  // Process tfoot rows (vitamins, minerals, etc.)
  $table.find('tfoot tr').each((_, row) => {
    const $cells = $(row).find('td');
    
    // Skip the footnote row about daily values
    if ($cells.length === 1 && $cells.text().includes('*The % Daily Value')) {
      return;
    }
    
    if ($cells.length === 2) {
      const labelText = $cells.eq(0).text().trim();
      const valueText = $cells.eq(1).text().trim();
      
      if (valueText) {
        result.rows.push({ label: labelText, value: valueText });
      } else {
        result.rows.push({ label: labelText });
      }
    }
  });
  
  return result;
}