import { Injectable } from '@nestjs/common';
import { CreatePurVmmScmusrDto } from './dto/create-purvmm_scmusr.dto';
import { UpdatePurvmmScmusrDto } from './dto/update-purvmm_scmusr.dto';
import { PurvmmScmuserRepository } from './purvmm_scmusr.repository';

@Injectable()
export class PurvmmScmusrService {
    constructor(protected readonly repo: PurvmmScmuserRepository) {}
    create(dto: CreatePurVmmScmusrDto) {
        return this.repo.create(dto);
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
