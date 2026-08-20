import { Injectable, Inject, forwardRef } from '@nestjs/common';

export interface ItemPackingInfo {
    item: string;
    itemPacking: string;
}

@Injectable()
export class PrintedExtractService {
    extractOrderEntries(text: string): Array<{ orderNo: string; qty: number }> {
        const normalizedText = text.replace(/\r/g, '').replace(/\u00a0/g, ' ');
        const matches = [
            ...normalizedText.matchAll(
                /(?<![A-Z0-9])([A-Z0-9]{9})\s+(\d+)(?![A-Z0-9])/g,
            ),
        ];

        return matches.map(([, orderNo, qty]) => ({
            orderNo,
            qty: Number(qty),
        }));
    }

    extractItemPackingEntries(text: string) {
        return text
            .replace(/\r/g, '')
            .split('\n')
            .map((line) => line.replace(/\u00a0/g, ' ').trim())
            .flatMap((lineText) => {
                if (!lineText) {
                    return [];
                }

                const match = lineText.match(
                    /[A-Z0-9]{9}\s+G\d{2}\s+(\d{3})\s+(\d{5})\s+[A-Z0-9]+$/,
                );

                if (!match) {
                    return [];
                }

                const [, item, itemPacking] = match;
                return { item, itemPacking };
            });
    }

    extractProcessListEntries(text: string) {
        const normalizedLines = text
            .replace(/\r/g, '')
            .split('\n')
            .map((line) => line.replace(/\u00a0/g, ' ').trim())
            .filter(Boolean);

        const orderLinePattern = /^(?:[A-Z0-9]{9}\s+\d+\s*)+$/;
        const firstOrderLineIndex = normalizedLines.findIndex((line) =>
            orderLinePattern.test(line),
        );

        let processStartIndex = 0;
        if (firstOrderLineIndex >= 0) {
            processStartIndex = firstOrderLineIndex;
            while (
                processStartIndex < normalizedLines.length &&
                orderLinePattern.test(normalizedLines[processStartIndex])
            ) {
                processStartIndex += 1;
            }
        }
        const lineText = normalizedLines[processStartIndex];
        return lineText;
    }

    extractDrawingEntries(text: string) {
        const normalizedLines = text
            .replace(/\r/g, '')
            .split('\n')
            .map((line) => line.replace(/\u00a0/g, ' ').trim())
            .filter(Boolean);

        const itemPattern =
            /[A-Z0-9]{9}\s+G\d{2}\s+(\d{3})\s+(\d{5})\s+[A-Z0-9]+$/;

        const firstItemLineIndex = normalizedLines.findIndex((line) =>
            itemPattern.test(line),
        );

        let dwgStartIndex = 0;
        if (firstItemLineIndex >= 0) {
            dwgStartIndex = firstItemLineIndex;
            while (
                dwgStartIndex < normalizedLines.length &&
                itemPattern.test(normalizedLines[dwgStartIndex])
            ) {
                dwgStartIndex += 1;
            }
        }

        const regex =
            /\b(?![A-Z]+\b)[A-Z0-9]{5,9}(?:\s?[G\-]\d+)?(?:\sL\d+)?\b/i;
        const lineText = normalizedLines[dwgStartIndex];
        const match = lineText.match(regex);
        const extractedDrawing = match ? match[0] : null;
        return extractedDrawing;
    }
}
