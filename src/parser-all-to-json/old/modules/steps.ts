import * as cheerio from 'cheerio';

interface RecipeStep {
  title: string;
  instructions: string;
  images: string[];
}

export function recipeStepsToJson(html: string) {
  // Load HTML with cheerio
  const $ = cheerio.load(html);
  
  // Find the structured project steps container
  const $stepsContainer = $('.structured-project__steps');
  
  if (!$stepsContainer.length) {
    return null;
  }
  
  // Initialize the result array
  const steps: RecipeStep[] = [];
  
  // Find all LI elements in the ordered list (these are the main steps)
  $stepsContainer.find('ol > li').each((_, stepElement) => {
    const $step = $(stepElement);
    
    // Extract the step title (subheading)
    const $subheading = $step.find('.mntl-sc-block-subheading__text');
    const title = $subheading.text().trim();
    
    // Extract the step instructions (paragraphs)
    let instructions = '';
    $step.find('p').each((_, p) => {
      let text = $(p).text().trim();

      // Skip promotional content
      if (text.includes('Did you love the recipe?')) {
        return;
      }

      // Remove any attribution text
      text = removeAttribution(text);

      if (text) {
        instructions += text + ' ';
      }
    });

    // Extract images related to this step
    const images: string[] = [];
    $step.find('img').each((_, img) => {
      const src = $(img).attr('src');
      if (src) {
        images.push(src);
      } else {
        // Try to get from data-src if src is not available
        const dataSrc = $(img).attr('data-src');
        if (dataSrc) {
          images.push(dataSrc);
        }
      }
    });

    // Add the step to our results
    steps.push({
      title: title,
      instructions: instructions.trim(),
      images: images
    });
  });

  return {
    steps: steps
  };
}

/**
 * Removes attribution text like "Simply Recipes / {name}" from text
 */
function removeAttribution(text: string): string {
  // Remove "Simply Recipes / Name" pattern
  return text
    .replace(/Simply Recipes\s*\/\s*[^,\.]+/g, '')
    .replace(/\(Simply Recipes\)/g, '')
    .replace(/Simply Recipes/g, '')
    // Clean up any double spaces that might result from removals
    .replace(/\s{2,}/g, ' ')
    .trim();
}
/**
 * Converts recipe steps HTML to structured JSON format
 * @param html The HTML content of the recipe page
 * @returns An object containing the steps or null if not found
 */