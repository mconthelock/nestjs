import { Injectable } from '@nestjs/common';
import { basename } from 'path';
import { FileService } from 'src/common/services/file/file.service';
import { ListMode } from 'src/common/services/file/dto/file.dto';
import { copyFile, joinPaths } from 'src/common/utils/files.utils';
import { MfgDrawingService } from '../mfg-drawing.service';
import { MFG_DRAWING } from 'src/common/Entities/escs/table/MFG_DRAWING.entity';

@Injectable()
export class DrawingFileHelper {
    constructor(
        private readonly fileService: FileService,
        private readonly mfgDrawingService: MfgDrawingService,
    ) {}

    async createFile(
        data: MFG_DRAWING,
        path: string,
        destination: string,
        fileName: string,
        newName: string,
    ): Promise<void> {
        try {
            if (data && data.NINSPECTOR_STATUS == 1 && data.NSTATUS == 1) {
                const file = await this.getExcelFile(fileName, path);
                const filePath = await copyFile(
                    file.path,
                    destination,
                    newName + '.' + file.extension,
                );
                await this.mfgDrawingService.update(data.NID, {
                    VFULL_PATH: filePath,
                    VFILE_NAME: basename(filePath),
                    NSTATUS: 4,
                    DDATEUPDATE: new Date(),
                    NUSERUPDATE: data.NUSERCREATE,
                });
            }
        } catch (error) {
            throw new Error('Create File Failed: ' + error.message);
        }
    }

    async getExcelFile(fileName: string, path: string) {
        const files = await this.fileService.listDir({
            baseDir: path,
            allow: ['xls', 'xlsx'],
            mode: ListMode.FILE,
        });
        const drawingFile = files.find((f) => {
            const nameWithoutExt = f.name.replace(/\.[^/.]+$/, '');
            return (
                f.name === fileName ||
                nameWithoutExt === fileName ||
                nameWithoutExt.startsWith(fileName + ' ')
            );
        });

        if (!drawingFile) {
            throw new Error(
                `File with name ${fileName} not found in path ${path}`,
            );
        }
        return drawingFile;
    }

    async getDestinationPath(blockName: string, itemName: string): Promise<string> {
        return await joinPaths(
            process.env.CHECKSHEET_MFG_FILE_PATH,
            'temp',
            `block_${blockName}`,
            `station_${itemName}`,
        );
    }

    async getPathFeeder(folderPath: string): Promise<string> {
        return await joinPaths(
            process.env.CHECKSHEET_MFG_FILE_PATH,
            'feeder',
            folderPath,
        );
    }
}