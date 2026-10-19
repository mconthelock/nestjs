import { Injectable } from '@nestjs/common';
import { PilineEventMstRepository } from './PILINE_EVENT_MST.repository';
import { CreatePilineEventMstDto } from './dto/CREATE-PILINE_EVENT_MST.dto';
import { UpdatePilineEventMstDto } from './dto/UPDATE-PILINE_EVENT_MST.dto';
import { KeyPilineEventMstDto } from './dto/KEY-PILINE_EVENT_MST.dto';

@Injectable()
export class PilineEventMstService {
    constructor(private readonly repo: PilineEventMstRepository) {}
    findAll() {
        return this.repo.findAll();
    }

    create(dto: CreatePilineEventMstDto) {
        return this.repo.create(dto);
    }
    update(key: KeyPilineEventMstDto, dto: UpdatePilineEventMstDto) {
        return this.repo.update(key, dto);
    }
    remove(key: KeyPilineEventMstDto) {
        return this.repo.remove(key);
    }
}
