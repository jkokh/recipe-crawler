import crypto from "crypto";
import { Paragraph, Step } from "../types";
import { PrismaClient } from "@prisma/client";

export function generateHash(text: string): string {
    return crypto.createHash("sha256").update(text).digest("hex");
}

export async function getPhrasedText(
    sourceId: number,
    originalText: string,
    prisma: PrismaClient
): Promise<string | null> {
    if (!originalText) return null;

    const hash = generateHash(originalText);

    const phrase = await prisma.phrase.findFirst({
        where: {
            sourceId,
            hash
        },
        select: {
            text: true
        }
    });

    return phrase?.text || null;
}

export async function alterParagraphs(
    sourceId: number,
    paragraphs: Paragraph[] | null,
    prisma: PrismaClient
): Promise<Paragraph[] | null> {
    if (!paragraphs || paragraphs.length === 0) return paragraphs;

    const altered: Paragraph[] = [];

    for (let i = 0; i < paragraphs.length; i++) {
        const para = paragraphs[i];
        const alteredPara: Paragraph = { ...para };

        if (para.header) {
            const rephrased = await getPhrasedText(sourceId, para.header, prisma);
            if (rephrased) alteredPara.header = rephrased;
        }

        if (para.text) {
            const rephrased = await getPhrasedText(sourceId, para.text, prisma);
            if (rephrased) alteredPara.text = rephrased;
        }

        if (para.list && para.list.length > 0) {
            const alteredList: string[] = [];
            for (let j = 0; j < para.list.length; j++) {
                const rephrased = await getPhrasedText(sourceId, para.list[j], prisma);
                alteredList.push(rephrased || para.list[j]);
            }
            alteredPara.list = alteredList;
        }

        altered.push(alteredPara);
    }

    return altered;
}

export async function alterSteps(
    sourceId: number,
    steps: Step[] | null,
    prisma: PrismaClient
): Promise<Step[] | null> {
    if (!steps || steps.length === 0) return steps;

    const altered: Step[] = [];

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const alteredStep: Step = { ...step };

        if (step.title) {
            const rephrased = await getPhrasedText(sourceId, step.title, prisma);
            if (rephrased) alteredStep.title = rephrased;
        }

        if (step.instructions) {
            const rephrased = await getPhrasedText(sourceId, step.instructions, prisma);
            if (rephrased) alteredStep.instructions = rephrased;
        }

        altered.push(alteredStep);
    }

    return altered;
}