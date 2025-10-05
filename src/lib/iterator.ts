import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PaginatedQueryOptions {
    perPage?: number;
    startPage?: number;
    maxPages?: number;
    delayMs?: number;
    entityName?: string;
}

export class PaginatedIterator<T> {
    private delegate: any;
    private queryArgs: any = {};
    private customQuery: any = null;
    private options: PaginatedQueryOptions = {
        perPage: 100,
        startPage: 1,
        delayMs: 100,
        entityName: 'items'
    };

    constructor(delegate: any) {
        this.delegate = delegate;
    }

    where(conditions: any): PaginatedIterator<T> {
        this.queryArgs.where = conditions;
        return this;
    }

    select(fields: any): PaginatedIterator<T> {
        this.queryArgs.select = fields;
        return this;
    }

    orderBy(ordering: any): PaginatedIterator<T> {
        this.queryArgs.orderBy = ordering;
        return this;
    }

    include(relations: any): PaginatedIterator<T> {
        this.queryArgs.include = relations;
        return this;
    }

    /**
     * Use a pre-built query instead of building one with where/select/orderBy methods
     */
    query(queryArgs: any): PaginatedIterator<T> {
        this.customQuery = queryArgs;
        return this;
    }

    perPage(count: number): PaginatedIterator<T> {
        this.options.perPage = count;
        return this;
    }

    startPage(page: number): PaginatedIterator<T> {
        this.options.startPage = page;
        return this;
    }

    /**
     * Alias for startPage for more intuitive API
     */
    startPosition(page: number): PaginatedIterator<T> {
        this.options.startPage = page;
        return this;
    }

    maxPages(pages: number): PaginatedIterator<T> {
        this.options.maxPages = pages;
        return this;
    }

    delay(ms: number): PaginatedIterator<T> {
        this.options.delayMs = ms;
        return this;
    }

    entityName(name: string): PaginatedIterator<T> {
        this.options.entityName = name;
        return this;
    }

    /**
     * Internal helper: safely perform a count, with fallback for Prisma JsonNull/DbNull filters.
     */
    private async safeCount(where?: any): Promise<number> {
        try {
            return await this.delegate.count(where ? { where } : {});
        } catch (err: any) {
            if (err.name === 'PrismaClientValidationError') {
                console.warn(
                    '[iterator] .count() failed (likely JsonNull filter) — falling back to .findMany().length'
                );
                const rows = await this.delegate.findMany({
                    ...(where ? { where } : {}),
                    select: { id: true }
                });
                return rows.length;
            }
            throw err;
        }
    }

    /**
     * Process items page by page and run a callback on each page.
     */
    async getPageResults<R = void>(
        processPageFunction: (items: T[]) => Promise<R> | R
    ): Promise<void> {
        const {
            perPage = 100,
            startPage = 1,
            maxPages,
            delayMs = 100,
            entityName = 'items'
        } = this.options;

        const finalQueryArgs = this.customQuery || this.queryArgs;
        const countArgs = finalQueryArgs.where ? { where: finalQueryArgs.where } : {};
        const totalCount = await this.safeCount(countArgs.where);
        const calculatedMaxPages = Math.ceil(totalCount / perPage);
        const pagesToProcess = maxPages ? Math.min(calculatedMaxPages, maxPages) : calculatedMaxPages;

        console.log(`Starting batch iteration over ${totalCount} ${entityName} (${pagesToProcess} pages)`);

        let currentPage = startPage;
        let totalProcessed = 0;

        while (currentPage <= pagesToProcess) {
            console.log(`Processing page ${currentPage} of ${pagesToProcess}...`);
            const skip = (currentPage - 1) * perPage;

            const items = await this.delegate.findMany({
                ...finalQueryArgs,
                take: perPage,
                skip
            });

            try {
                await processPageFunction(items);
            } catch (error: any) {
                console.error(`Error processing page ${currentPage}:`, error.message);
            }

            totalProcessed += items.length;

            console.log(`Completed page ${currentPage}: ${items.length} ${entityName} processed`);
            console.log(
                `Total progress: ${totalProcessed}/${totalCount} (${Math.round(
                    (totalProcessed / totalCount) * 100
                )}%)`
            );

            currentPage++;

            if (currentPage <= pagesToProcess && delayMs > 0) {
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }

        console.log(`Batch iteration complete: processed ${totalProcessed} ${entityName}`);
    }

    /**
     * Iterate through all pages and process each item individually with async callback.
     */
    async forEachAsync<R = void>(
        processFunction: (item: T) => Promise<R> | R
    ): Promise<void> {
        const {
            perPage = 100,
            startPage = 1,
            maxPages,
            delayMs = 100,
            entityName = 'items'
        } = this.options;

        const finalQueryArgs = this.customQuery || this.queryArgs;
        const countArgs = finalQueryArgs.where ? { where: finalQueryArgs.where } : {};
        const totalCount = await this.safeCount(countArgs.where);
        const calculatedMaxPages = Math.ceil(totalCount / perPage);
        const pagesToProcess = maxPages ? Math.min(calculatedMaxPages, maxPages) : calculatedMaxPages;

        console.log(`Starting iteration over ${totalCount} ${entityName} (${pagesToProcess} pages)`);

        let currentPage = startPage;
        let totalProcessed = 0;

        while (currentPage <= pagesToProcess) {
            console.log(`Processing page ${currentPage} of ${pagesToProcess}...`);
            const skip = (currentPage - 1) * perPage;

            const items = await this.delegate.findMany({
                ...finalQueryArgs,
                take: perPage,
                skip
            });

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const currentItemNumber = totalProcessed + i + 1;

                try {
                    await processFunction(item);
                } catch (error: any) {
                    const itemId =
                        item && typeof item === 'object' && 'id' in item ? (item as any).id : 'unknown';
                    console.error(
                        `Error processing item ${currentItemNumber} (ID: ${itemId}):`,
                        error.message
                    );
                }
            }

            totalProcessed += items.length;

            console.log(`Completed page ${currentPage}: ${items.length} ${entityName} processed`);
            console.log(
                `Total progress: ${totalProcessed}/${totalCount} (${Math.round(
                    (totalProcessed / totalCount) * 100
                )}%)`
            );

            currentPage++;

            if (currentPage <= pagesToProcess && delayMs > 0) {
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }

        console.log(`Iteration complete: processed ${totalProcessed} ${entityName}`);
    }
}

/**
 * Create a fluent paginated iterator
 */
export function iterate<T>(delegate: any): PaginatedIterator<T> {
    return new PaginatedIterator<T>(delegate);
}

/**
 * Legacy compatibility wrapper
 */
export async function iterateQuery<T, R = void>(
    delegate: any,
    queryArgs: any,
    processFunction: (item: T) => Promise<R>,
    options: PaginatedQueryOptions = {}
): Promise<void> {
    const iterator = new PaginatedIterator<T>(delegate);

    if (queryArgs.where) iterator.where(queryArgs.where);
    if (queryArgs.select) iterator.select(queryArgs.select);
    if (queryArgs.orderBy) iterator.orderBy(queryArgs.orderBy);
    if (queryArgs.include) iterator.include(queryArgs.include);

    if (options.perPage) iterator.perPage(options.perPage);
    if (options.startPage) iterator.startPage(options.startPage);
    if (options.maxPages) iterator.maxPages(options.maxPages);
    if (options.delayMs) iterator.delay(options.delayMs);
    if (options.entityName) iterator.entityName(options.entityName);

    return iterator.forEachAsync(processFunction);
}

/**
 * Close Prisma connection
 */
export async function closeConnection() {
    await prisma.$disconnect();
}

/**
 * Export shared Prisma instance
 */
export { prisma };
