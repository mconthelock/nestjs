import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ISDEV_DEVELOPER } from 'src/common/Entities/webform/table/ISDEV_DEVELOPER.entity';

import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer';

@Injectable()
export class IsDevService {
    constructor(
        @InjectRepository(ISDEV_DEVELOPER, 'webformConnection')
        private readonly developer: Repository<ISDEV_DEVELOPER>,
    ) {}

    async createDev(dto: CreateDeveloperDto) {
        const newDev = this.developer.create(dto as unknown as ISDEV_DEVELOPER);
        await this.developer.save(newDev);
        return await this.developer.findOne({
            where: {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
                DEV_SEQ: dto.DEV_SEQ,
            },
            relations: ['info'],
        });
    }

    async deleteDev(dto: UpdateDeveloperDto) {
        const devToDelete = await this.developer.findOne({
            where: {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
                DEV_SEQ: dto.DEV_SEQ,
            },
        });

        if (devToDelete) {
            await this.developer.remove(devToDelete);
            return { message: 'Developer deleted successfully' };
        } else {
            return { message: 'Developer not found' };
        }
    }

    //   async search(year: string, keyword: string) {
    //     const results = await this.isdev
    //       .createQueryBuilder('isdev')
    //       .leftJoinAndSelect('isdev.form', 'form')
    //       .where('isdev.CYEAR2 = :year', { year })
    //       .where('isdev.VDETAIL LIKE :keyword OR isdev.VSYSNAME LIKE :keyword', {
    //         keyword: `%${keyword}%`,
    //       })
    //       .orderBy('isdev.NRUNNO', 'ASC')
    //       .getMany();
    //     return results;
    //   }

    //   async findByYear(year) {
    //     const results = await this.isdev.find({
    //       where: { CYEAR2: year },
    //       relations: {
    //         form: {
    //           flow: true,
    //           creator: true,
    //         },
    //       },
    //       order: { NRUNNO: 'ASC' },
    //     });

    //     // Filter only flow with CSTEPNO = '00'
    //     return results.map((isdev) => {
    //       if (Array.isArray(isdev.form.flow)) {
    //         const manager = isdev.form.flow.find((f) => f.CSTEPNO === '10');
    //         const pic = isdev.form.flow.find((f) => f.CSTEPNEXTNO === '00');
    //         const running = isdev.form.flow.find((f) => f.CSTEPST === '3');

    //         isdev.form = { ...isdev.form, ...{ manager } };
    //         isdev.form = { ...isdev.form, ...{ pic } };
    //         isdev.form = { ...isdev.form, ...{ running } };
    //         delete isdev.form.flow;
    //       }
    //       return isdev;
    //     });
    //   }

    //   async findById(year, id) {
    //     return await this.isdev.findOne({
    //       where: { CYEAR2: year, NRUNNO: id },
    //       relations: {
    //         form: {
    //           flow: true,
    //           creator: true,
    //         },
    //       },
    //     });
    //   }
}
