import { Injectable } from '@nestjs/common';
import { InsertAndMoveStyFilesDto } from './dto/create.dto';
import { StyTypeService } from '../sty-type/sty-type.service';
import { joinPaths, moveFileFromMulter } from 'src/common/utils/files.utils';
import { StyFilesRepository } from './sty-files.repository';
import { STY_FILES } from 'src/common/Entities/gpreport/table/STY_FILES.entity';

@Injectable()
export class StyFilesService {
    constructor(
        private readonly typeService: StyTypeService,
        private readonly repo: StyFilesRepository,
    ) {}

    /**
     * @author Sutthipong tangmongkhoncharoen(24008)
     * @since 2026-11-17
     * @description บันทึกไฟล์และย้ายไปยังปลายทางที่กำหนด ตามประเภทไฟล์ที่ระบุใน FILE_CODE
     * @returns ข้อมูล path ปลายทางและข้อมูลไฟล์ที่บันทึกลงฐานข้อมูล
     */
    async insertFiles(
        dto: InsertAndMoveStyFilesDto,
        file: Express.Multer.File | Express.Multer.File[],
    ) {
        const { FILE_CODE, FILE_PATH, FILE_USERCREATE } = dto;
        try {
            if (!file || (Array.isArray(file) && file.length === 0)) {
                throw new Error('No file uploaded');
            }

            const fileTypeRes = await this.typeService.findOneByCode(FILE_CODE);
            const typeId: number = fileTypeRes.data.TYPE_ID;
            const destination: string =
                FILE_PATH ??
                (await joinPaths(
                    process.env.AMEC_FILE_PATH,
                    process.env.STATE,
                    'safety',
                    'files',
                    fileTypeRes.data.TYPE_MASTER,
                    fileTypeRes.data.TYPE_NAME,
                ));
            const moved = await this.moveAndInsertFile({
                files: Array.isArray(file) ? file : [file],
                destination,
                typeId,
                createBy: FILE_USERCREATE,
                status: dto.STATUS, // ส่งค่า NID ของประเภทไฟล์ถ้ามี FILE_CODE และพบข้อมูลในฐานข้อมูล
            });

            return {
                status: true,
                destination,
                moved,
            };
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-11-17
     * @description ย้ายไฟล์จาก Multer ไปยังปลายทางและบันทึกข้อมูลลงฐานข้อมูล
     * @returns ข้อมูล path ปลายทางและข้อมูลไฟล์ที่บันทึกลงฐานข้อมูล
     */
    private async moveAndInsertFile({
        files,
        destination,
        typeId,
        createBy,
        status,
    }: {
        files: Express.Multer.File[];
        destination: string;
        createBy: string;
        typeId: number;
        status?: number;
    }): Promise<{ fullPath: string[]; data: STY_FILES[] }> {
        try {
            const movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
            const insertedFiles: any[] = [];
            for (const file of files) {
                const moved = await moveFileFromMulter({ file, destination });
                movedTargets.push(moved.path);
                insertedFiles.push(
                    await this.repo.create({
                        FILE_ONAME: file.originalname, // ชื่อเดิมฝั่ง client
                        FILE_FNAME: moved.newName, // ชื่อไฟล์ที่ใช้เก็บจริง
                        FILE_USERCREATE: createBy,
                        FILE_PATH: destination, // โฟลเดอร์ปลายทาง
                        TYPE_ID: typeId,
                        STATUS: status ?? 2,
                    }),
                );
            }
            return {
                fullPath: movedTargets,
                data: insertedFiles,
            };
        } catch (error) {
            throw new Error(error);
        }
    }
}
