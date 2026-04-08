import { Injectable } from '@nestjs/common';
import { CreateIsTidDto } from './dto/create-is-tid.dto';
import { UpdateIsTidDto } from './dto/update-is-tid.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { IsTidRepository } from './is-tid.repository';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Injectable()
export class IsTidService {
    constructor(protected readonly repo: IsTidRepository) {}

    async findOne(dto: FormDto) {
        try {
            const res = await this.repo.findOne(dto);
            if (res == null) {
                return {
                    status: false,
                    message: `Search Production Environment ID temporary use request Failed: No data found`,
                };
            }
            return {
                status: true,
                message: `Search Production Environment ID temporary use request data found 1 record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                'Search Production Environment ID temporary use request Error: ' +
                    error.message,
            );
        }
    }

    async findAll() {
        try {
            const res = await this.repo.findAll();
            const length = res.length;
            if (length === 0) {
                return {
                    status: false,
                    message:
                        'Search Production Environment ID temporary use request Failed: No data found',
                    data: [],
                };
            }
            return {
                status: true,
                message: `Search Production Environment ID temporary use request data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                'Search Production Environment ID temporary use request Error: ' +
                    error.message,
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
                    message:
                        'Search Production Environment ID temporary use request Failed: No data found',
                    data: [],
                };
            }
            return {
                status: true,
                message: `Search Production Environment ID temporary use request data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                'Search Production Environment ID temporary use request Error: ' +
                    error.message,
            );
        }
    }

    async create(dto: CreateIsTidDto) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                return {
                    status: false,
                    message: 'Insert IS_TID Failed',
                    data: dto,
                };
            }
            return {
                status: true,
                message: 'Insert IS_TID Successfully',
                data: res,
            };
        } catch (error) {
            throw new Error('Insert IS_TID Error: ' + error.message);
        }
    }

    async update(form: FormDto, dto: UpdateIsTidDto) {
        try {
            const res = await this.repo.update(form, dto);
            if (res.affected === 0) {
                return {
                    status: false,
                    message: `Update IS_TID by cyear2 = ${form.CYEAR2} nrunno = ${form.NRUNNO} Failed`,
                };
            }
            return {
                status: true,
                message: `Update IS_TID by cyear2 = ${form.CYEAR2} nrunno = ${form.NRUNNO} Successfully`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Update IS_TID by cyear2 = ${form.CYEAR2} nrunno = ${form.NRUNNO} Error: ` +
                    error.message,
            );
        }
    }

    async remove(form: FormDto) {
        try {
            const res = await this.repo.remove(form);
            if (res.affected === 0) {
                return {
                    status: false,
                    message: `Delete IS_TID by cyear2 = ${form.CYEAR2} nrunno = ${form.NRUNNO} Failed`,
                };
            }
            return {
                status: true,
                message: `Delete IS_TID by cyear2 = ${form.CYEAR2} nrunno = ${form.NRUNNO} Successfully`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Delete IS_TID by cyear2 = ${form.CYEAR2} nrunno = ${form.NRUNNO} Error: ` +
                    error.message,
            );
        }
    }
}
