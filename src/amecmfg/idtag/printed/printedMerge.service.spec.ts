import { EventEmitter } from 'events';
import { spawn } from 'child_process';

import { PrintedMergeService } from './printedMerge.service';

jest.mock('child_process', () => ({
    spawn: jest.fn(),
}));

describe('PrintedMergeService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('uses a unique ghostscript output filename for each PDF job instead of reusing output.pdf', async () => {
        const child = new EventEmitter() as EventEmitter & {
            stderr: EventEmitter;
        };
        child.stderr = new EventEmitter();

        (spawn as jest.Mock).mockReturnValue(child);

        const service = new PrintedMergeService(
            { writeLog: jest.fn().mockResolvedValue(undefined) } as any,
            { extract: {} } as any,
        );

        const promise = service.compressPdfWithGhostscript(
            'C:/temp/input/my-file.pdf',
        );

        process.nextTick(() => {
            child.emit('close', 0);
        });

        await promise;

        const outputArg = (spawn as jest.Mock).mock.calls[0][1].find(
            (arg: string) => arg.startsWith('-sOutputFile='),
        );

        expect(outputArg).toContain('my-file.compressed-');
        expect(outputArg).not.toContain('output.pdf');
    });
});
