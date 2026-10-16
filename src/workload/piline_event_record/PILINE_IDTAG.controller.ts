import { Controller, Get, Param, Injectable, BadRequestException, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { F110KP } from 'src/amecmfg/f110kp/entities/f110kp.entity';

@Injectable()
export class PilineIdtagService {
    constructor(
        @InjectDataSource('amecConnection') private readonly ds: DataSource,
        @InjectDataSource('workloadConnection') private readonly workload: DataSource,
    ) {}

    private async materialCodes(order: string): Promise<string[]> {
        if (!order) return [];
        if (this.workload.options.type !== 'oracle') {
            throw new ServiceUnavailableException('Material Code requires the Oracle workload database link');
        }
        // Escape LIKE metacharacters so the order is always a literal prefix.
        const prefix = order.replace(/[!%_]/g, value => '!' + value) + '%';
        try {
            const rows: { MATERIAL_ID: string | number | null }[] = await this.workload.query(
                `SELECT DISTINCT MATERIAL_ID
                 FROM AMEC.F_D011_PROCESS_SCHEDULES@PILINE_PIIS_LINK
                 WHERE SHEAR_NC LIKE :1 ESCAPE '!' AND MATERIAL_ID IS NOT NULL
                 ORDER BY MATERIAL_ID`,
                [prefix],
            );
            return [...new Set(rows.map(row => String(row.MATERIAL_ID ?? '').trim()).filter(Boolean))];
        } catch {
            throw new ServiceUnavailableException('ไม่สามารถโหลด Material Code กรุณาตรวจสอบ PILINE_PIIS_LINK และสิทธิ์อ่านตาราง');
        }
    }

    async findByIdTag(idtag: string) {
        const tag = idtag.replace(/\s/g, '').trim();
        if (tag.length !== 11) throw new BadRequestException('ID Tag must contain 11 characters');
        const data = await this.ds.getRepository(F110KP).findOne({
            where: { F11K01: tag },
            select: { F11K01: true, F11K04: true, F11K05: true, F11K06: true, F11K11: true, F11K15: true, F11K16: true, F11K18: true },
        });
        if (!data) throw new NotFoundException('ID Tag not found in F110KP');
        const order = String(data.F11K04 ?? '').trim().replace(/-/g, '');
        const materialCodes = await this.materialCodes(order);
        return { status: true, data, materialCodes };
    }
}

@Controller('workload/piline_event_record/idtag')
export class PilineIdtagController {
    constructor(private readonly service: PilineIdtagService) {}

    @Get(':idtag')
    findByIdTag(@Param('idtag') idtag: string) {
        return this.service.findByIdTag(idtag);
    }
}
