import { PrismaClient } from "@prisma/client";

export interface CategoryKeywords {
    positives?: string[];
    negatives?: string[];
}

export interface CategoryDTO {
    id: number;
    parentId: number | null;
    title: string;
    slug: string;
    keywords: CategoryKeywords;
}

export class CategoryManager {
    private prisma: PrismaClient;
    private categories: CategoryDTO[] = [];
    private categoriesById: Map<number, CategoryDTO> = new Map();
    private categoriesByParentId: Map<number | null, CategoryDTO[]> = new Map();
    private isLoaded: boolean = false;

    constructor(prisma?: PrismaClient) {
        this.prisma = prisma || new PrismaClient();
    }

    /**
     * Load all categories from database into memory
     */
    async loadCategories(): Promise<void> {
        const rawCategories = await this.prisma.category.findMany({
            select: {
                id: true,
                parentId: true,
                title: true,
                slug: true,
                keywords: true
            },
            where: {  id: {
                    //in: [12, 93, 1]
                }
            },
            orderBy: { id: "asc" }
        });

        // Transform and store categories
        this.categories = rawCategories.map(c => ({
            id: c.id,
            parentId: c.parentId,
            title: c.title,
            slug: c.slug,
            keywords: (c.keywords as CategoryKeywords) ?? { positives: [], negatives: [] }
        }));

        // Build lookup maps for efficient operations
        this.buildLookupMaps();
        this.isLoaded = true;
    }

    /**
     * Build internal lookup maps for efficient querying
     */
    private buildLookupMaps(): void {
        this.categoriesById.clear();
        this.categoriesByParentId.clear();

        // Build ID lookup map
        for (const category of this.categories) {
            this.categoriesById.set(category.id, category);
        }

        // Build parent ID lookup map
        for (const category of this.categories) {
            const parentId = category.parentId;
            if (!this.categoriesByParentId.has(parentId)) {
                this.categoriesByParentId.set(parentId, []);
            }
            this.categoriesByParentId.get(parentId)!.push(category);
        }
    }

    /**
     * Ensure categories are loaded before operations
     */
    private ensureLoaded(): void {
        if (!this.isLoaded) {
            throw new Error("Categories not loaded. Call loadCategories() first.");
        }
    }

    /**
     * Get all categories
     */
    getAllCategories(): CategoryDTO[] {
        this.ensureLoaded();
        return [...this.categories];
    }

    /**
     * Get category by ID
     */
    getCategoryById(id: number): CategoryDTO | undefined {
        this.ensureLoaded();
        return this.categoriesById.get(id);
    }

    /**
     * Get children of a category
     */
    getChildren(parentId: number | null): CategoryDTO[] {
        this.ensureLoaded();
        return this.categoriesByParentId.get(parentId) || [];
    }

    /**
     * Check if category has children
     */
    hasChildren(categoryId: number): boolean {
        this.ensureLoaded();
        return this.getChildren(categoryId).length > 0;
    }

    /**
     * Check if category is a leaf (has no children)
     */
    isLeaf(categoryId: number): boolean {
        return !this.hasChildren(categoryId);
    }

    /**
     * Check if category is root (has no parent)
     */
    isRoot(categoryId: number): boolean {
        this.ensureLoaded();
        const category = this.categoriesById.get(categoryId);
        return category?.parentId === null;
    }

    /**
     * Check if category is intermediate (has both parent and children)
     */
    isIntermediate(categoryId: number): boolean {
        this.ensureLoaded();
        const category = this.categoriesById.get(categoryId);
        return category?.parentId !== null && this.hasChildren(categoryId);
    }

    /**
     * Get only leaf categories (categories with no children)
     */
    getLeafCategories(): CategoryDTO[] {
        this.ensureLoaded();
        return this.categories.filter(category => this.isLeaf(category.id));
    }

    /**
     * Get intermediate categories (have both parent and children)
     */
    getIntermediateCategories(): CategoryDTO[] {
        this.ensureLoaded();
        return this.categories.filter(category => this.isIntermediate(category.id));
    }

    /**
     * Get root categories (have no parent)
     */
    getRootCategories(): CategoryDTO[] {
        this.ensureLoaded();
        return this.categories.filter(category => this.isRoot(category.id));
    }

    /**
     * Get category path from root to given category
     */
    getCategoryPath(categoryId: number): CategoryDTO[] {
        this.ensureLoaded();
        const path: CategoryDTO[] = [];
        let currentId: number | null = categoryId;

        while (currentId !== null) {
            const category = this.categoriesById.get(currentId);
            if (!category) break;

            path.unshift(category);
            currentId = category.parentId;
        }

        return path;
    }

    /**
     * Get all descendant categories of a given category
     */
    getDescendants(categoryId: number): CategoryDTO[] {
        this.ensureLoaded();
        const descendants: CategoryDTO[] = [];
        const queue = [categoryId];

        while (queue.length > 0) {
            const currentId = queue.shift()!;
            const children = this.getChildren(currentId);

            for (const child of children) {
                descendants.push(child);
                queue.push(child.id);
            }
        }

        return descendants;
    }

    /**
     * Search categories by title or slug
     */
    searchCategories(query: string): CategoryDTO[] {
        this.ensureLoaded();
        const lowerQuery = query.toLowerCase();

        return this.categories.filter(category =>
            category.title.toLowerCase().includes(lowerQuery) ||
            category.slug.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Get categories that contain specific keywords
     */
    getCategoriesByKeywords(keywords: string[], type: 'positives' | 'negatives' = 'positives'): CategoryDTO[] {
        this.ensureLoaded();
        const lowerKeywords = keywords.map(k => k.toLowerCase());

        return this.categories.filter(category => {
            const categoryKeywords = category.keywords[type] || [];
            return categoryKeywords.some(keyword =>
                lowerKeywords.some(searchKeyword =>
                    keyword.toLowerCase().includes(searchKeyword)
                )
            );
        });
    }

    /**
     * Reload categories from database
     */
    async reload(): Promise<void> {
        await this.loadCategories();
    }

    /**
     * Close database connection
     */
    async disconnect(): Promise<void> {
        await this.prisma.$disconnect();
    }
}