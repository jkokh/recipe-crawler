import {Source} from "@prisma/client";

export const getTitle = ($article: cheerio.Cheerio) => {
    const $title = $article.find('h1');
    $title.remove();
    return $title.text();
}