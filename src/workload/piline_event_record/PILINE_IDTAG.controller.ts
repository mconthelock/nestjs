import { Controller, Get, Param, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { F110KP } from 'src/amecmfg/f110kp/entities/f110kp.entity';

@Injectable()
export class PilineIdtagService {
    constructor(@InjectDataSource('amecConnection') private readonly ds: DataSource) {}

    async findByIdTag(idtag: string) {
        const tag = idtag.replace(/\s/g, '').trim();
        if (tag.length !== 11) throw new BadRequestException('ID Tag must contain 11 characters');
        const data = await this.ds.getRepository(F110KP).findOne({
            where: { F11K01: tag },
            select: { F11K01: true, F11K04: true, F11K05: true, F11K06: true, F11K11: true, F11K15: true, F11K16: true, F11K18: true },
        });
        if (!data) throw new NotFoundException('ID Tag not found in F110KP');
        return { status: true, data };
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
