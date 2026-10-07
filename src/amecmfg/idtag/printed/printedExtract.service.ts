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

    extractItemPackingEntries(text: string) {
        const normalizedLines = text
            .replace(/\r/g, '')
            .split('\n')
            .map((line) => line.replace(/\u00a0/g, ' ').trim())
            .filter(Boolean);

        const line = normalizedLines[3];
        if (!line) {
            return { item: '', itemPacking: '' };
        }

        const match = line.match(
            /(?<![A-Z0-9])([A-Z0-9]{5,9})\s+(?:G|-)?\d{2}\s+(?:[A-Z])?\s*(\d{3})\s+((?:\d{5}|[A-Z0-9*]{2,6}|\d{3}[A-Z0-9]{2}))(?![A-Z0-9])/i,
        );

        if (!match) {
            return { item: '', itemPacking: '', line };
        }

        const [, , item, itemPacking] = match;
        return { item, itemPacking };
    }

    extractDrawingEntries(text: string) {
        const normalizedLines = text
            .replace(/\r/g, '')
            .split('\n')
            .map((line) => line.replace(/\u00a0/g, ' ').trim())
            .filter(Boolean);

        const line = normalizedLines[4];
        if (!line) {
            return '';
        }

        const regex =
            /\b(?![A-Z]+\b)[A-Z0-9]{5,9}(?:\s?[G\-]\d+)?(?:\sL\d+)?\b/i;
        const match = line.match(regex);
        const extractedDrawing = match ? match[0] : null;
        return extractedDrawing;
    }
}
