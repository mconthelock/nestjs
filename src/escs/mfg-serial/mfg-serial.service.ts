import { Injectable } from '@nestjs/common';
import { CreateMfgSerialDto } from './dto/create-mfg-serial.dto';
import { UpdateMfgSerialDto } from './dto/update-mfg-serial.dto';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { MfgSerialRepository } from './mfg-serial.repository';

@Injectable()
export class MfgSerialService {
    constructor(private readonly repo: MfgSerialRepository) {}
    async create(dto: CreateMfgSerialDto | CreateMfgSerialDto[]) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                return {
                    status: false,
                    message: 'Insert MFG_SERIAL Failed',
                    data: dto,
                };
            }
            return {
                status: true,
                message: 'Insert MFG_SERIAL Successfully',
                data: res,
            };
        } catch (error) {
            throw new Error('Insert MFG_SERIAL Error: ' + error.message);
        }
    }

    async findAll() {
        try {
            const res = await this.repo.findAll();
            const length = res.length;
            if (length === 0) {
                return {
                    status: false,
                    message: 'Search MFG_SERIAL Failed: No data found',
                    data: [],
                };
            }
            return {
                status: true,
                message: `Search MFG_SERIAL data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error('Search MFG_SERIAL Error: ' + error.message);
        }
    }

    async findOne(id: number) {
        try {
            const res = await this.repo.findOne(id);
            if (res == null) {
                return {
                    status: false,
                    message: `Search MFG_SERIAL by id ${id} Failed: No data found`,
                    data: [],
                };
            }
            return {
                status: true,
                message: `Search MFG_SERIAL by id ${id} data found 1 record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Search MFG_SERIAL by id ${id} Error: ` + error.message,
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
                    message: 'Search MFG_SERIAL Failed: No data found',
                    data: [],
                };
            }
            return {
                status: true,
                message: `Search MFG_SERIAL data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error('Search MFG_SERIAL Error: ' + error.message);
        }
    }

    async update(
        id: number | { NID: number } | { NDRAWINGID: number },
        dto: UpdateMfgSerialDto,
    ) {
        try {
            const res = await this.repo.update(id, dto);
            if (res.affected === 0) {
                return {
                    status: false,
                    message: `Update MFG_SERIAL by id ${id} Failed`,
                };
            }
            return {
                status: true,
                message: `Update MFG_SERIAL by id ${id} Successfully`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Update MFG_SERIAL by id ${id} Error: ` + error.message,
            );
        }
    }

    async remove(id: number) {
        try {
            const res = await this.repo.remove(id);
            if (res.affected === 0) {
                return {
                    status: false,
                    message: `Delete MFG_SERIAL by id ${id} Failed`,
                };
            }
            return {
                status: true,
                message: `Delete MFG_SERIAL by id ${id} Successfully`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Delete MFG_SERIAL by id ${id} Error: ` + error.message,
            );
        }
    }

    async removeByDrawingId(drawingId: number) {
        try {
            const res = await this.repo.remove({ NDRAWINGID: drawingId });
            if (res.affected === 0) {
                return {
                    status: false,
                    message: `Delete MFG_SERIAL by drawingId ${drawingId} Failed`,
                };
            }
            return {
                status: true,
                message: `Delete MFG_SERIAL by drawingId ${drawingId} Successfully`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Delete MFG_SERIAL by drawingId ${drawingId} Error: ` +
                    error.message,
            );
        }
    }

    async removeByCondition(condition: UpdateMfgSerialDto) {
        try {
            const res = await this.repo.remove(condition);
            if (res.affected === 0) {
                return {
                    status: false,
                    message: `Delete MFG_SERIAL by condition Failed`,
                };
            }
            return {
                status: true,
                message: `Delete MFG_SERIAL by condition Successfully`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Delete MFG_SERIAL by condition Error: ` + error.message,
            );
        }
    }
}
