import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStyFilesDto, InsertAndMoveStyFilesDto } from './dto/create.dto';
import { StyTypeService } from '../sty-type/sty-type.service';
import { joinPaths, moveFileFromMulter } from 'src/common/utils/files.utils';
import { StyFilesRepository } from './sty-files.repository';

@Injectable()
export class StyFilesService {
    constructor(
        private readonly typeService: StyTypeService,
        private readonly repo: StyFilesRepository,
    ) {}
    async insertFiles(
        dto: InsertAndMoveStyFilesDto,
        file: Express.Multer.File | Express.Multer.File[],
    ) {
        const { FILE_CODE, FILE_PATH, FILE_USERCREATE } = dto;
        try {
            if (!file || (Array.isArray(file) && file.length === 0)) {
                throw new Error('No file uploaded');
            }
            let fileId: number;
            let destination: string;

            const fileTypeRes = await this.typeService.findOneByCode(FILE_CODE);
            fileId = fileTypeRes.data.TYPE_ID;
            destination =
                FILE_PATH ??
                (await joinPaths(
                    process.env.AMEC_FILE_PATH,
                    process.env.STATE,
                    'safety',
                    'files',
                    fileTypeRes.data.TYPE_NAME,
                ));
            return;
            // const moved = await this.moveAndInsertFile({
            //     files: Array.isArray(file) ? file : [file],
            //     destination,
            //     form,
            //     formType: FORM_TYPE,
            //     createBy: CREATEBY,
            //     fileType: fileType, // ส่งค่า NID ของประเภทไฟล์ถ้ามี FILE_CODE และพบข้อมูลในฐานข้อมูล
            // });
            // return {
            //     status: true,
            //     destination,
            //     moved,
            // };
        } catch (error) {
            throw new Error(error);
        }
    }

    private async moveAndInsertFile({
        files,
        destination,
        formType,
        fileType,
        createBy,
    }: {
        files: Express.Multer.File[];
        destination: string;
        createBy: string;
        fileType?: number;
        formType: string;
    }) {
        try {
            const movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
            const insertedFiles: any[] = [];
            for (const file of files) {
                const moved = await moveFileFromMulter({ file, destination });
                movedTargets.push(moved.path);
                insertedFiles.push(
                    // await this.repo.create(
                    //     {
                    //         ...form,
                    //         FILE_ONAME: file.originalname, // ชื่อเดิมฝั่ง client
                    //         FILE_FNAME: moved.newName, // ชื่อไฟล์ที่ใช้เก็บจริง
                    //         FILE_USERCREATE: createBy,
                    //         FILE_PATH: destination, // โฟลเดอร์ปลายทาง
                    //         FILE_TYPE: fileType ?? null,
                    //     },
                    //     formType,
                    // ),
                );
            }
            return {
                fullPath: movedTargets,
                data: insertedFiles,
            };
        } catch (error) {
            throw new Error(
                `Move and Insert File ${formType} => ${error.message}`,
            );
        }
    }
}
