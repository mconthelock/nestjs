import { Injectable } from '@nestjs/common';
import { PilineAttRepository } from './PILINE_ATT.repository';
import { CreatePilineAttDto } from './dto/CREATE-PILINE_ATT.dto';
import { UpdatePilineAttDto } from './dto/UPDATE-PILINE_ATT.dto';
import { KeyPilineAttDto } from './dto/KEY-PILINE_ATT.dto';

@Injectable()
export class PilineAttService {
    constructor(private readonly repo: PilineAttRepository) {}
    create(dto: CreatePilineAttDto) {
        return this.repo.create(dto);
    }
    update(key: KeyPilineAttDto, dto: UpdatePilineAttDto) {
        return this.repo.update(key, dto);
    }
    remove(key: KeyPilineAttDto) {
        return this.repo.remove(key);
    }
}
