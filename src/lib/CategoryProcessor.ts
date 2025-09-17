import {CategoryDTO, CategoryManager} from "./CategoryManager";
import {scoreRecipeCategories} from "src/lib/categoryScorer";
import {Recipe} from "../types";

interface CategoryScore {
    categoryId: number;
    title: string;
    score: number;
    path: CategoryDTO[];
}

interface RootCategoryResult {
    rootCategory: CategoryDTO;
    leafCategories: CategoryScore[];
    intermediateCategories: CategoryScore[];
    hasMatchingCategories: boolean;
    hasHighConfidenceLeaf: boolean;
}

class CategoryProcessor {
    private readonly categoryManager: CategoryManager;
    private readonly leafScoreThreshold = 0.6;
    private readonly intermediateScoreThreshold = 0.7;
    private readonly highConfidenceThreshold = 0.9;
    private readonly minLeafCategories = 3;
    private readonly maxLeafCategories = 2;
    public noLeafCategoriesCount = 0;

    constructor(categoryManager: CategoryManager) {
        this.categoryManager = categoryManager;
    }

    /**
     * Get formatted category results as a string for a recipe
     */
    getCategories(recipe: Recipe): string {
        const rootCategories = this.categoryManager.getRootCategories();
        const lines: string[] = [];
        let matched = false;

        for (const rootCategory of rootCategories) {
            const result = this.processRecipeForRootCategory(recipe, rootCategory);
            if (!result.hasMatchingCategories) continue;

            matched = true;

            const format = (cat: any, tag = "") =>
                `${cat.path.map((p: any) => p.title).join(" > ")}: id ${cat.categoryId}`;

            result.leafCategories.forEach((cat: any) => lines.push(format(cat)));

            if (
                !result.hasHighConfidenceLeaf &&
                result.leafCategories.length < this.minLeafCategories &&
                result.intermediateCategories.length > 0
            ) {
                result.intermediateCategories.forEach((cat: any) =>
                    lines.push(format(cat))
                );
            }
        }

        if (!matched) {
            this.noLeafCategoriesCount++;
            return "NO CATEGORIES MATCHED IN ANY ROOT";
        }

        return lines.join("\n");
    }

    private processRecipeForRootCategory(recipe: Recipe, rootCategory: CategoryDTO): RootCategoryResult {
        // Get all descendants of this root category
        const allDescendants = this.categoryManager.getDescendants(rootCategory.id);

        // Filter descendants into leaf and intermediate categories
        const leafCategories = allDescendants.filter(cat => this.categoryManager.isLeaf(cat.id));
        const intermediateCategories = allDescendants.filter(cat => this.categoryManager.isIntermediate(cat.id));

        // Score leaf categories and limit to top 2
        const leafScores = this.getScoresForCategories(recipe, leafCategories, this.leafScoreThreshold)
            .slice(0, this.maxLeafCategories);

        // Check if we have any high-confidence leaf matches
        const hasHighConfidenceLeaf = leafScores.some(score => score.score >= this.highConfidenceThreshold);

        // Score intermediate categories only if:
        // 1. We don't have high-confidence leaf matches AND
        // 2. We don't have enough leaf categories
        let intermediateScores: CategoryScore[] = [];
        if (!hasHighConfidenceLeaf && leafScores.length < this.minLeafCategories) {
            intermediateScores = this.getFilteredIntermediateScores(recipe, intermediateCategories, leafScores);
        }

        const hasMatchingCategories = leafScores.length > 0 || intermediateScores.length > 0;

        return {
            rootCategory,
            leafCategories: leafScores,
            intermediateCategories: intermediateScores,
            hasMatchingCategories,
            hasHighConfidenceLeaf
        };
    }

    private getFilteredIntermediateScores(recipe: Recipe, intermediateCategories: CategoryDTO[], leafScores: CategoryScore[]): CategoryScore[] {
        // Get all intermediate scores first
        const allIntermediateScores = this.getScoresForCategories(recipe, intermediateCategories, this.intermediateScoreThreshold);

        // Get the set of matching leaf category IDs
        const matchingLeafIds = new Set(leafScores.map(leaf => leaf.categoryId));

        // Filter out intermediates that are parents of any matching leaf categories
        return allIntermediateScores.filter(intermediate => {
            // Get all children of this intermediate category
            const children = this.categoryManager.getChildren(intermediate.categoryId);

            // Check if any child is in our matching leaf categories
            const hasMatchingChild = children.some(child => matchingLeafIds.has(child.id));

            // Include this intermediate only if it doesn't have any matching child
            return !hasMatchingChild;
        });
    }

    private getScoresForCategories(recipe: Recipe, categories: CategoryDTO[], threshold: number): CategoryScore[] {
        if (categories.length === 0) return [];

        const { scores } = scoreRecipeCategories(recipe, categories);
        return this.processScores(scores, threshold);
    }

    private processScores(scores: Record<number, number>, threshold: number): CategoryScore[] {
        return Object.entries(scores)
            .map(([categoryId, score]) => {
                const category = this.categoryManager.getCategoryById(+categoryId);
                const path = this.categoryManager.getCategoryPath(+categoryId);

                return {
                    categoryId: +categoryId,
                    title: category?.title || "Unknown",
                    score,
                    path
                };
            })
            .filter(categoryScore => categoryScore.score >= threshold)
            .sort((a, b) => b.score - a.score);
    }
}

export { CategoryProcessor };