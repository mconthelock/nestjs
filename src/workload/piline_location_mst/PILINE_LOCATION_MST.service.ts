import { Injectable } from '@nestjs/common';
import { PilineLocationMstRepository } from './PILINE_LOCATION_MST.repository';
import { CreatePilineLocationMstDto } from './dto/CREATE-PILINE_LOCATION_MST.dto';
import { UpdatePilineLocationMstDto } from './dto/UPDATE-PILINE_LOCATION_MST.dto';
import { KeyPilineLocationMstDto } from './dto/KEY-PILINE_LOCATION_MST.dto';

@Injectable()
export class PilineLocationMstService {
    constructor(private readonly repo: PilineLocationMstRepository) {}
    findAll() {
        return this.repo.findAll();
    }

    create(dto: CreatePilineLocationMstDto) {
        return this.repo.create(dto);
    }
    update(key: KeyPilineLocationMstDto, dto: UpdatePilineLocationMstDto) {
        return this.repo.update(key, dto);
    }
    remove(key: KeyPilineLocationMstDto) {
        return this.repo.remove(key);
    }
}
