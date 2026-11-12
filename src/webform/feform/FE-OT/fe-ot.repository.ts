import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ConectionService } from 'src/as400/conection/conection.service';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { CreatefeotDetails } from './dto/create-fe-ot.dto';
import { FEOT_DETAILS } from 'src/common/Entities/webform/table/FEOT_DETAILS.entity';
import { UpdatefeotDto } from './dto/update-fe-ot.dto';

@Injectable()
export class FEOTRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }

    async createDetails(dto: CreatefeotDetails) {
        return this.getRepository(FEOT_DETAILS).save(dto);
    }

    async getDataOT(dto: {
        PLANYEAR: number;
        PLANMONTH: number;
        SEMPNO: string;
    }) {
        return this.getRepository(FEOT_DETAILS).find({
            where: {
                PLANYEAR: dto.PLANYEAR,
                PLANMONTH: dto.PLANMONTH,
                SEMPNO: dto.SEMPNO,
            },
        });
    }

    async getDataOTall(){
        return this.getRepository(FEOT_DETAILS).find();
    }

    async remove(dto: {
        PLANYEAR: number;
        PLANMONTH: number;
        SEMPNO: string;
        WORKDATE: string;
    }) {
        return this.getRepository(FEOT_DETAILS)
            .createQueryBuilder()
            .delete()
            .from(FEOT_DETAILS)
            .where(
                `
                    PLANYEAR = :planyear
                    AND PLANMONTH = :planmonth
                    AND SEMPNO = :sempno
                    AND WORKDATE >= TO_DATE(:workdate, 'YYYY-MM-DD')
                    AND WORKDATE < TO_DATE(:workdate, 'YYYY-MM-DD') + 1
                `,
            )
            .setParameters({
                planyear: dto.PLANYEAR,
                planmonth: dto.PLANMONTH,
                sempno: dto.SEMPNO,
                workdate: dto.WORKDATE,
            })
            .execute();
    }

    async update(dto: UpdatefeotDto) {
        const { PLANYEAR, PLANMONTH, SEMPNO, OLD_WORKDATE, ...updateData } =
            dto;

        return this.getRepository(FEOT_DETAILS)
            .createQueryBuilder()
            .update(FEOT_DETAILS)
            .set(updateData)
            .where(
                `
                PLANYEAR = :planyear
                AND PLANMONTH = :planmonth
                AND SEMPNO = :sempno
                AND WORKDATE >= TO_DATE(:oldWorkdate, 'YYYY-MM-DD')
                AND WORKDATE < TO_DATE(:oldWorkdate, 'YYYY-MM-DD') + 1
            `,
            )
            .setParameters({
                planyear: PLANYEAR,
                planmonth: PLANMONTH,
                sempno: SEMPNO,
                oldWorkdate: OLD_WORKDATE,
            })
            .execute();
    }
}
