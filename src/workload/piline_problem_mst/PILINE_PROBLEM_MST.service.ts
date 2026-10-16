import { Injectable } from '@nestjs/common';
import { PilineProblemMstRepository } from './PILINE_PROBLEM_MST.repository';
import { CreatePilineProblemMstDto } from './dto/CREATE-PILINE_PROBLEM_MST.dto';
import { UpdatePilineProblemMstDto } from './dto/UPDATE-PILINE_PROBLEM_MST.dto';
import { KeyPilineProblemMstDto } from './dto/KEY-PILINE_PROBLEM_MST.dto';

@Injectable()
export class PilineProblemMstService {
    constructor(private readonly repo: PilineProblemMstRepository) {}
    findAll() {
        return this.repo.findAll();
    }

    create(dto: CreatePilineProblemMstDto) {
        return this.repo.create(dto);
    }
    update(key: KeyPilineProblemMstDto, dto: UpdatePilineProblemMstDto) {
        return this.repo.update(key, dto);
    }
    remove(key: KeyPilineProblemMstDto) {
        return this.repo.remove(key);
    }
}
