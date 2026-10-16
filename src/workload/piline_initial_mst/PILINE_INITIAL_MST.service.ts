import { Injectable } from '@nestjs/common';
import { PilineInitialMstRepository } from './PILINE_INITIAL_MST.repository';
import { CreatePilineInitialMstDto } from './dto/CREATE-PILINE_INITIAL_MST.dto';
import { UpdatePilineInitialMstDto } from './dto/UPDATE-PILINE_INITIAL_MST.dto';
import { KeyPilineInitialMstDto } from './dto/KEY-PILINE_INITIAL_MST.dto';

@Injectable()
export class PilineInitialMstService {
    constructor(private readonly repo: PilineInitialMstRepository) {}
    findAll() {
        return this.repo.findAll();
    }

    create(dto: CreatePilineInitialMstDto) {
        return this.repo.create(dto);
    }
    update(key: KeyPilineInitialMstDto, dto: UpdatePilineInitialMstDto) {
        return this.repo.update(key, dto);
    }
    remove(key: KeyPilineInitialMstDto) {
        return this.repo.remove(key);
    }
}
