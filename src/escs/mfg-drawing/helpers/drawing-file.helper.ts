import { Injectable } from '@nestjs/common';
import { basename, extname } from 'path';
import { Workbook } from 'exceljs';
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
        masterPath: string,
        newPath: string,
        masterFilename: string,
        newFilename: string,
        typeName: string,
    ): Promise<void> {
        try {
            if (!(data && data.NINSPECTOR_STATUS == 1 && data.NSTATUS == 1)) {
                return;
            }
            
            let shouldCopy = true;
            const file = await this.getExcelFile(masterFilename, masterPath);
            newFilename = `${newFilename}.${file.extension}`;
            const fullPath = await joinPaths(newPath, newFilename);

            if (typeName === 'feeder') {
                shouldCopy = await this.canCreateFeederFile(fullPath);
            }

            if (shouldCopy) {
                await copyFile(
                    file.path,
                    newPath,
                    newFilename,
                );
            }

            await this.mfgDrawingService.update(data.NID, {
                VFULL_PATH: fullPath,
                VFILE_NAME: basename(fullPath),
                NSTATUS: 4,
                DDATEUPDATE: new Date(),
                NUSERUPDATE: data.NUSERCREATE,
            });
        } catch (error) {
            throw new Error('Create File Failed: ' + error.message);
        }
    }

    async getExcelFile(fileName: string, path: string) {
        const files = await this.fileService.listDir({
            baseDir: path,
            allow: ['xlsx'],
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

    async findFeederFileName(drawing: string, processNo: string, path: string): Promise<string> {
        const keyword = `${drawing}-${processNo}`;
        const files = await this.fileService.listDir({
            baseDir: path,
            allow: ['xlsx'],
            mode: ListMode.FILE,
        });

        const file = files.find(f =>
            f.name.includes(keyword)
        );

        if (!file) {
            throw new Error(`ไม่พบไฟล์ต้นฉบับของ ${keyword}`);
        }

        return basename(file.name, extname(file.name));
    }

    async getRevisionCheckSheetFeeder(path: string,filename: string): Promise<string> {
        const file = await this.getExcelFile(filename, path);
        const workbook = new Workbook();
        await workbook.xlsx.readFile(file.path);
        const activeTab = workbook.views?.[0]?.activeTab ?? 0;
        const worksheet = workbook.worksheets[activeTab];
        if (!worksheet) {
            throw new Error(`ไม่พบ Active Sheet ในไฟล์ ${file.name}`);
        }

        const headerA18 = worksheet.getCell('A18').text.trim().toLowerCase();
        const headerG18 = worksheet.getCell('G18').text.trim().toLowerCase();
        if (headerA18 !== 'no.' || headerG18 !== 'mc no.') {
            throw new Error(`ไฟล์ ${file.name} ไม่ใช่ Template Checksheet Feeder`);
        }

        let revision = worksheet.getCell('E3').text.trim();
        if (revision === '*') {
            revision = '0';
        }

        if (!revision) {
            throw new Error(`ไม่พบข้อมูล Revision ในเซลล์ E3 ของไฟล์ ${file.name}`);
        }

        return revision;
    }

    /**
     * Feeder files can be shared.
     * Do not create a new file if the file is already used by a record that has already been inspected.
     */
    private async canCreateFeederFile(fullPath: string): Promise<boolean> {
        const result = await this.mfgDrawingService.search({
            filters: [
                {
                    field: 'VFULL_PATH',
                    op: 'eq',
                    value: fullPath,
                },
                {
                    field: 'NSTATUS',
                    op: 'eq',
                    value: 1,
                },
                {
                    field: 'NINSPECTOR_STATUS',
                    op: 'ne',
                    value: 1,
                },
            ],
        });

        return result.data.length === 0;
    }
}