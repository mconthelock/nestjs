import { Injectable } from '@nestjs/common';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { IdtagEfacLogRepository } from './idtag-efac-log.repository';
import { GetMaxRunnoDto } from './dto/get-max-runno.dto';
import { InsertLogDto } from './dto/insert-log.dto';

@Injectable()
export class IdtagEfacLogService {
    constructor(private readonly repo: IdtagEfacLogRepository) {}

    async findAll() {
        try {
            const res = await this.repo.findAll();
            const length = res.length;
            if (length === 0) {
                return {
                status: false,
                message: 'Search IDTAG_EFAC_LOG Failed: No data found',
                data: [],
                };
            }
            return {
                status: true,
                message: `Search IDTAG_EFAC_LOG data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error('Search IDTAG_EFAC_LOG Error: ' + error.message);
        }
    }

    async findOne(id: number) {
        try {
            const res = await this.repo.findOne(id);
            if (res == null) {
                return {
                status: false,
                message: `Search IDTAG_EFAC_LOG by id ${id} Failed: No data found`,
                };
            }
            return {
                status: true,
                message: `Search IDTAG_EFAC_LOG by id ${id} data found 1 record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Search IDTAG_EFAC_LOG by id ${id} Error: ` + error.message,
            );
        }
    }

    async search(dto: FiltersDto) {
        try {
            const res = await this.repo.search(dto);
            const length = res.length;
            if (length === 0) {
                return {
                status: false,
                message: 'Search IDTAG_EFAC_LOG Failed: No data found',
                data: [],
                };
            }
            return {
                status: true,
                message: `Search IDTAG_EFAC_LOG data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error('Search IDTAG_EFAC_LOG Error: ' + error.message);
        }
    }

    async maxRunno(dto: GetMaxRunnoDto) {
        try {
              console.log('dto', dto);
              console.log('process', dto.process);
            const sysdate = await this.repo.getSysdate();
            const month = Number(sysdate.MONTH);
            const year  = Number(sysdate.YEAR);
            const runno = await this.repo.getMaxRunno(dto.process, month, year);
            return {
                status: true,
                year,
                year2: sysdate.YEAR2,
                month,   
                runno: runno + 1
            };
        } catch (error) {
            throw new Error('Get Max Runno Error: ' + error.message);
        }
    }

    async insertLog(dto: InsertLogDto) {
        try {
            await this.repo.create({
                CONTROL_NO: dto.ctrlno,
                PROCESS_NAME: dto.process,
                MONTH: dto.month,
                YEAR: dto.year,
                RUNNO: dto.runno,
                LOT_NO: dto.lot,
                PRINT_BY: dto.empno,
            });

            return {
                status: true,
                message: 'Insert IDTAG_EFAC_LOG Success',
                runno: dto.runno,
            };
        } catch (error) {
            throw new Error('Insert IDTAG_EFAC_LOG Error: ' + error.message);
        }
    }
}
