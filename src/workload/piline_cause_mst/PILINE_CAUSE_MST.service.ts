import { Injectable } from '@nestjs/common';
import { PilineCauseMstRepository } from './PILINE_CAUSE_MST.repository';
import { CreatePilineCauseMstDto } from './dto/CREATE-PILINE_CAUSE_MST.dto';
import { UpdatePilineCauseMstDto } from './dto/UPDATE-PILINE_CAUSE_MST.dto';
import { KeyPilineCauseMstDto } from './dto/KEY-PILINE_CAUSE_MST.dto';

@Injectable()
export class PilineCauseMstService {
    constructor(private readonly repo: PilineCauseMstRepository) {}
    findAll() {
        return this.repo.findAll();
    }

    create(dto: CreatePilineCauseMstDto) {
        return this.repo.create(dto);
    }
    update(key: KeyPilineCauseMstDto, dto: UpdatePilineCauseMstDto) {
        return this.repo.update(key, dto);
    }
    remove(key: KeyPilineCauseMstDto) {
        return this.repo.remove(key);
    }
}
