import { Injectable } from '@nestjs/common';
import { PilineNgRecordRepository } from './PILINE_NG_RECORD.repository';
import { CreatePilineNgRecordDto } from './dto/CREATE-PILINE_NG_RECORD.dto';
import { UpdatePilineNgRecordDto } from './dto/UPDATE-PILINE_NG_RECORD.dto';
import { KeyPilineNgRecordDto } from './dto/KEY-PILINE_NG_RECORD.dto';

@Injectable()
export class PilineNgRecordService {
    constructor(private readonly repo: PilineNgRecordRepository) {}
    create(dto: CreatePilineNgRecordDto) {
        return this.repo.create(dto);
    }
    update(key: KeyPilineNgRecordDto, dto: UpdatePilineNgRecordDto) {
        return this.repo.update(key, dto);
    }
    remove(key: KeyPilineNgRecordDto) {
        return this.repo.remove(key);
    }
}
