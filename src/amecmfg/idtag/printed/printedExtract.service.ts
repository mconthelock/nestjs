import { Injectable, Inject, forwardRef } from '@nestjs/common';

export interface ProcessListInfo {
    processCode: string;
    lineText: string;
}

export interface ItemPackingInfo {
    item: string;
    itemPacking: string;
    lineText: string;
}

@Injectable()
export class PrintedExtract {
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

    extractItemPackingEntries(text: string): ItemPackingInfo[] {
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
                return [{ item, itemPacking, lineText }];
            });
    }

    extractProcessListEntries(text: string) {
        const normalizedLines = text
            .replace(/\r/g, '')
            .split('\n')
            .map((line) => line.replace(/\u00a0/g, ' ').trim())
            .filter(Boolean);

        const orderLinePattern = /^(?:[A-Z0-9]{9}\s+\d+\s*)+$/;
        const processCodePattern = /^[A-Z0-9]{6}$/;

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

        const processEntries: ProcessListInfo[] = [];
        // for (
        //     let index = processStartIndex;
        //     index < normalizedLines.length;
        //     index += 1
        // ) {
        const lineText = normalizedLines[processStartIndex];
        const processCodes = lineText.split(/\s+/).filter(Boolean);

        // if (
        //     processCodes.length === 0 || !processCodes.every((code) => processCodePattern.test(code))
        // ) {
        //     if (processEntries.length > 0) {
        //         break;
        //     }
        //     continue;
        // }

        // processEntries.push(
        //     ...processCodes.map((processCode) => ({
        //         processCode,
        //         lineText,
        //     })),
        // );
        // }

        return lineText;
    }
}
