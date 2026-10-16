import { Injectable } from '@nestjs/common';
import { PilineSectionMstRepository } from './PILINE_SECTION_MST.repository';
import { CreatePilineSectionMstDto } from './dto/CREATE-PILINE_SECTION_MST.dto';
import { UpdatePilineSectionMstDto } from './dto/UPDATE-PILINE_SECTION_MST.dto';
import { KeyPilineSectionMstDto } from './dto/KEY-PILINE_SECTION_MST.dto';

@Injectable()
export class PilineSectionMstService {
    constructor(private readonly repo: PilineSectionMstRepository) {}
    findAll() {
        return this.repo.findAll();
    }

    create(dto: CreatePilineSectionMstDto) {
        return this.repo.create(dto);
    }
    update(key: KeyPilineSectionMstDto, dto: UpdatePilineSectionMstDto) {
        return this.repo.update(key, dto);
    }
    remove(key: KeyPilineSectionMstDto) {
        return this.repo.remove(key);
    }
}
