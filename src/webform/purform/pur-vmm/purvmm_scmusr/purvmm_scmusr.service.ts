import { Injectable } from '@nestjs/common';
import { CreatePurVmmScmusrDto } from './dto/create-purvmm_scmusr.dto';
import { UpdatePurvmmScmusrDto } from './dto/update-purvmm_scmusr.dto';
import { PurvmmScmuserRepository } from './purvmm_scmusr.repository';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Injectable()
export class PurvmmScmusrService {
    constructor(protected readonly repo: PurvmmScmuserRepository) {}
    create(dto: CreatePurVmmScmusrDto) {
        return this.repo.create(dto);
    }

    async createMultipleUsers(
        formDto: FormDto,
        users: CreatePurVmmScmusrDto[],
    ) {
        try {
            const { NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO } = formDto;
            const currentMaxId = await this.repo.getMaxId(
                NFRMNO,
                VORGNO,
                CYEAR,
                CYEAR2,
                NRUNNO,
            );
            let runningId = currentMaxId;
            const allUsersToInsert = users.map((item) => {
                runningId += 1;
                return {
                    ...formDto,
                    ...item,
                    ID: runningId,
                };
            });

            const res = await this.repo.InsertUsers(allUsersToInsert);
            if (!res) {
                throw new Error('Failed to insert PURSCMUSER');
            }
            return {
                status: true,
                message: 'Insert PURSCMUSER Successfully',
            };
        } catch (error) {
            throw new Error('Insert PURSCMUSER Error: ' + error.message);
        }
    }

    findAll() {
        return `This action returns all purvmmScmusr`;
    }

    findOne(id: number) {
        return `This action returns a #${id} purvmmScmusr`;
    }

    update(id: number, updatePurvmmScmusrDto: UpdatePurvmmScmusrDto) {
        return `This action updates a #${id} purvmmScmusr`;
    }

    remove(id: number) {
        return `This action removes a #${id} purvmmScmusr`;
    }
}
