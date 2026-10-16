import { Injectable } from '@nestjs/common';
import { PilineMappingMstRepository } from './PILINE_MAPPING_MST.repository';
import { CreatePilineMappingMstDto } from './dto/CREATE-PILINE_MAPPING_MST.dto';
import { UpdatePilineMappingMstDto } from './dto/UPDATE-PILINE_MAPPING_MST.dto';
import { KeyPilineMappingMstDto } from './dto/KEY-PILINE_MAPPING_MST.dto';

@Injectable()
export class PilineMappingMstService {
    constructor(private readonly repo: PilineMappingMstRepository) {}
    findAll() {
        return this.repo.findAll();
    }

    create(dto: CreatePilineMappingMstDto) {
        return this.repo.create(dto);
    }
    update(key: KeyPilineMappingMstDto, dto: UpdatePilineMappingMstDto) {
        return this.repo.update(key, dto);
    }
    remove(key: KeyPilineMappingMstDto) {
        return this.repo.remove(key);
    }
}
