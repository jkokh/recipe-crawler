import {configs} from "./configs";
import {BatchProcessor} from "./BatchProcessor";


const batch = new BatchProcessor();

export const processParagraphs = () => batch.process(configs.paragraphs);
export const processImages = () => batch.process(configs.images);
export const processTitles = () => batch.process(configs.titles);

(async () => {
    await processImages();
    await processParagraphs();
    // await processTitles(); - titles from cloude - don't run
})();