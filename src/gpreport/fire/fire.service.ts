import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { FireItemMst } from 'src/common/Entities/gpreport/table/FIRE_ITEM_MST.entity';
import { FireRepository } from './fire.repository';
import { FireInspection } from './fire-inspection';
import { CreateFireItemDto } from './dto/create-fire-item.dto';
import { UpdateFireItemDto } from './dto/update-fire-item.dto';
import { SearchFireItemDto } from './dto/search-fire-item.dto';

@Injectable()
export class FireService {
    constructor(private readonly fireRepository: FireRepository) {}

    items() {
        return this.fireRepository.allItems().then((items) => ({ items }));
    }

    async saveItem(body: Record<string, unknown>) {
        const data: Record<string, string> = {};
        for (const field of ['FIRE_CODE', 'LOCATION', 'FTYPE', 'CAPACITY', 'AREA', 'STATUS']) {
            if (body[field] != null && typeof body[field] !== 'string') {
                throw new UnprocessableEntityException('รูปแบบข้อมูลไม่ถูกต้อง');
            }
            data[field] = ((body[field] ?? '') as string).trim();
        }
        if (!data.FIRE_CODE) throw new UnprocessableEntityException('กรุณาระบุ FIRE_CODE');
        for (const field of ['FIRE_CODE', 'LOCATION', 'FTYPE', 'CAPACITY', 'AREA']) {
            const limit = field === 'FIRE_CODE' ? 20 : 100;
            if (Buffer.byteLength(data[field]) > limit)
                throw new UnprocessableEntityException(`${field} ต้องไม่เกิน ${limit} bytes`);
        }
        if (!['0', '1'].includes(data.STATUS))
            throw new UnprocessableEntityException('สถานะไม่ถูกต้อง');
        const original = body.original_code;
        if (original != null && typeof original !== 'string')
            throw new UnprocessableEntityException('รหัสรายการไม่ถูกต้อง');
        if (original) {
            if (original !== data.FIRE_CODE)
                throw new UnprocessableEntityException('ไม่สามารถเปลี่ยน FIRE_CODE ได้');
            const { FIRE_CODE, ...update } = data;
            await this.update(original as string, update);
        } else {
            await this.create(data as unknown as CreateFireItemDto);
        }
        return { message: 'บันทึกข้อมูลแล้ว' };
    }

    async deactivate(body: Record<string, unknown>) {
        const code = body.FIRE_CODE;
        if (typeof code !== 'string' || !code.trim())
            throw new UnprocessableEntityException('กรุณาระบุ FIRE_CODE');
        await this.update(code, { STATUS: '0' });
        return { message: 'เปลี่ยนสถานะเป็น Inactive แล้ว' };
    }

    async checkInspection(month: string, file: Express.Multer.File) {
        if (typeof month !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
            throw new UnprocessableEntityException('กรุณาเลือกเดือนและปีให้ถูกต้อง');
        }
        if (!file?.buffer || !/\.xlsx$/i.test(file.originalname)) {
            throw new UnprocessableEntityException(
                'กรุณาเลือกไฟล์ Excel .xlsx อีกครั้ง (ขนาดสูงสุด 10 MB)',
            );
        }
        if (file.size > 10 * 1024 * 1024)
            throw new UnprocessableEntityException('ไฟล์ต้องมีขนาดไม่เกิน 10 MB');
        const inspection = new FireInspection();
        const rows = await inspection.readExcel(file.buffer);
        const master = await this.fireRepository.allItems(true);
        if (!master.length)
            throw new UnprocessableEntityException(
                'ไม่พบข้อมูล Master ที่มี STATUS = 1 กรุณาตรวจสอบ Master ก่อน',
            );
        // Multipart headers from browsers encode UTF-8 names as Latin-1 in Multer.
        const decodedName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const filename =
            /[^\u0000-\u00ff]/u.test(file.originalname) || decodedName.includes('\ufffd')
                ? file.originalname
                : decodedName;
        return {
            ...inspection.compareRows(rows, month, master),
            filename: filename.split(/[\\/]/).pop(),
        };
    }

    search(query: SearchFireItemDto) {
        return this.fireRepository.search(query);
    }

    async findOne(fireCode: string) {
        const item = await this.fireRepository.findOne(fireCode);
        if (!item) throw new NotFoundException('FIRE_ITEM_NOT_FOUND');
        return item;
    }

    async create(dto: CreateFireItemDto) {
        if (await this.fireRepository.findOne(dto.FIRE_CODE)) {
            throw new ConflictException('FIRE_CODE_ALREADY_EXISTS');
        }
        try {
            return await this.fireRepository.create({
                FIRE_CODE: dto.FIRE_CODE,
                ...this.mapData(dto),
            });
        } catch (error) {
            if (error?.driverError?.errorNum === 1 || error?.driverError?.code === 'ORA-00001') {
                throw new ConflictException('FIRE_CODE_ALREADY_EXISTS');
            }
            throw error;
        }
    }

    async update(fireCode: string, dto: UpdateFireItemDto) {
        const data = this.mapData(dto);
        if (!Object.keys(data).length) throw new BadRequestException('NO_FIELDS_TO_UPDATE');
        const result = await this.fireRepository.update(fireCode, data);
        if (!result.affected) throw new NotFoundException('FIRE_ITEM_NOT_FOUND');
        return this.findOne(fireCode);
    }

    async remove(fireCode: string) {
        const result = await this.fireRepository.delete(fireCode);
        if (!result.affected) throw new NotFoundException('FIRE_ITEM_NOT_FOUND');
        return { message: 'FIRE_ITEM_DELETED', FIRE_CODE: fireCode };
    }

    private mapData(dto: UpdateFireItemDto): Partial<FireItemMst> {
        const data: Partial<FireItemMst> = {};
        for (const field of ['LOCATION', 'FTYPE', 'CAPACITY', 'AREA', 'STATUS'] as const) {
            if (dto[field] !== undefined) data[field] = dto[field];
        }
        return data;
    }
}
