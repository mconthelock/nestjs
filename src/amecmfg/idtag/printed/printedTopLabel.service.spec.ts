import * as path from 'path';
import { PrintedTopLabelService } from './printedTopLabel.service';

describe('PrintedTopLabelService', () => {
    it('uses the active PDF directory instead of rebuilding a directory from row metadata', async () => {
        const repo = {
            findAllLabel: jest.fn().mockResolvedValue([
                {
                    FILES_ID: 123,
                    PAGE_TAG: 'ABC123',
                    SCHDCHAR: '202609XP3',
                    SCHDP: '20K',
                    FILE_FOLDER: 'TAGASSY',
                    FILE_ONAME: 'sample.pdf',
                    URGETNT: 0,
                    JAPAN: 1,
                    EARTHQ: 0,
                },
            ]),
        };

        const printed = {
            getCurrentPdfDirectory: jest
                .fn()
                .mockResolvedValue('C:/pdf/active'),
            setPdfPath: jest.fn(),
            writeLog: jest.fn().mockResolvedValue(undefined),
        };

        const service = new PrintedTopLabelService(printed as any, repo as any);

        const embedSpy = jest
            .spyOn(service as any, 'embedLabelToPdf')
            .mockResolvedValue(undefined);

        await service.processLabelDetail(123);

        expect(printed.getCurrentPdfDirectory).toHaveBeenCalledTimes(1);
        expect(printed.setPdfPath).not.toHaveBeenCalled();
        expect(embedSpy).toHaveBeenCalledWith(
            path.join('C:/pdf/active', 'ABC123.pdf'),
            'JAPAN',
        );
    });
});
