import { BadRequestException, Body, Controller, Logger, Post, ServiceUnavailableException, UploadedFiles, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { FilesInterceptor } from '@nestjs/platform-express';
import { IsString } from 'class-validator';
import { memoryStorage } from 'multer';
import { DataSource } from 'typeorm';
import { mkdir, open, unlink } from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { ATTRNFRM } from 'src/common/Entities/webform/table/ATTRNFRM.entity';
import { PilineRejectKeyDto } from './PILINE_REJECT_REQUEST.dto';

class RejectFilesMultipartDto { @IsString() payload: string; }

@Controller('workload/piline_issue/request')
export class PilineRejectFilesController {
    private readonly logger = new Logger(PilineRejectFilesController.name);
    constructor(@InjectDataSource('webformConnection') private readonly db: DataSource) {}

    @Post('files')
    @UseInterceptors(FilesInterceptor('files',10,{storage:memoryStorage(),limits:{files:10,fileSize:5*1024*1024,fields:1,fieldSize:4096}}))
    async upload(@Body() body:RejectFilesMultipartDto,@UploadedFiles() files:Express.Multer.File[]) {
        let raw:unknown;
        try { raw=JSON.parse(body.payload); } catch { throw new BadRequestException('payload ต้องเป็น JSON ของ 5 keys'); }
        const key=await new ValidationPipe({transform:true,whitelist:true,forbidNonWhitelisted:true}).transform(raw,{type:'body',metatype:PilineRejectKeyDto}) as PilineRejectKeyDto;
        if (!key || !Number.isSafeInteger(key.NRUNNO) || key.NRUNNO>9999999) throw new BadRequestException('Invalid form key');
        if (!files?.length) throw new BadRequestException('กรุณาเลือกไฟล์');
        const root=process.env.PILINE_RN_FILE_PATH?.trim();
        if (!root || !path.isAbsolute(root)) throw new ServiceUnavailableException('กรุณาตั้งค่า PILINE_RN_FILE_PATH เป็น absolute path');
        const folder=[key.NFRMNO,key.VORGNO,key.CYEAR,key.CYEAR2,key.NRUNNO].join('_');
        const directory=path.resolve(root,folder);
        const allowed=new Set(['.pdf','.jpg','.jpeg','.png','.gif','.webp','.xlsx','.xls','.docx','.doc','.pptx','.ppt','.txt','.csv']);
        const prepared=files.map(file=>{
            const original=path.win32.basename(file.originalname || '');
            const ext=path.extname(original).toLowerCase();
            if (!allowed.has(ext)) throw new BadRequestException('ชนิดไฟล์ไม่รองรับ: '+original);
            if (!file.buffer?.length) throw new BadRequestException('ไฟล์ว่าง: '+original);
            // ASCII <=70 bytes fits legacy SFILE; UUID avoids collisions and overwriting existing files.
            const stem=path.basename(original,ext).replace(/[^a-zA-Z0-9_-]/g,'_').slice(0,28)||'file';
            const name=randomUUID().replace(/-/g,'')+'_'+stem+ext;
            return {file,name};
        });
        const created:string[]=[];
        try {
            return await this.db.transaction(async manager=>{
                const params=[key.NFRMNO,key.VORGNO,key.CYEAR,key.CYEAR2,key.NRUNNO];
                const where='NFRMNO=:1 AND VORGNO=:2 AND CYEAR=:3 AND CYEAR2=:4 AND NRUNNO=:5';
                const form=await manager.query('SELECT NRUNNO FROM WEBFORM.RNFRM WHERE '+where+' FOR UPDATE NOWAIT',params);
                if (!form.length) throw new BadRequestException('ไม่พบ Reject Notice ที่บันทึกสำเร็จ');
                await manager.query('LOCK TABLE WEBFORM.ATTRNFRM IN EXCLUSIVE MODE NOWAIT');
                const rows=await manager.query('SELECT NVL(MAX(ID),0) AS LAST_ID FROM WEBFORM.ATTRNFRM WHERE '+where,params);
                const start=Number(rows[0].LAST_ID);
                if (start+files.length>99) throw new BadRequestException('ลำดับไฟล์เกิน 99 ซึ่งเป็นขนาดคอลัมน์ ID');
                await mkdir(directory,{recursive:true});
                const attachments=[];
                for (const [index,item] of prepared.entries()) {
                    const target=path.join(directory,item.name);
                    const handle=await open(target,'wx');
                    created.push(target);
                    try { await handle.writeFile(item.file.buffer); } finally { await handle.close(); }
                    const record={...key,ID:start+index+1,SFILE:item.name,TYPENO:'1'};
                    await manager.getRepository(ATTRNFRM).insert(record);
                    attachments.push({ID:record.ID,SFILE:record.SFILE,TYPENO:'1',originalName:item.file.originalname});
                }
                return {status:true,data:{...key,folder,files:attachments}};
            });
        } catch(error) {
            // Remove only files this request created; never touch existing attachments or the shared folder.
            for (const target of created) {
                try { await unlink(target); } catch(cleanupError) { this.logger.error('Failed to clean up RN attachment '+target, String(cleanupError)); }
            }
            if (['EACCES','EPERM','ENOENT','ENOTDIR','ENOSPC','EIO'].includes(error.code)) {
                this.logger.error('RN attachment storage error',String(error));
                throw new ServiceUnavailableException('เขียนไฟล์บน WEBFLOW ไม่สำเร็จ กรุณาตรวจสอบ path และสิทธิ์บัญชีที่รัน API');
            }
            throw error;
        }
    }
}
