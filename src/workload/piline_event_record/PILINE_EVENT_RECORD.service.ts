import { Injectable } from '@nestjs/common';
import { PilineEventRecordRepository } from './PILINE_EVENT_RECORD.repository';
import { CreatePilineEventRecordDto } from './dto/CREATE-PILINE_EVENT_RECORD.dto';
import { UpdatePilineEventRecordDto } from './dto/UPDATE-PILINE_EVENT_RECORD.dto';
import { KeyPilineEventRecordDto } from './dto/KEY-PILINE_EVENT_RECORD.dto';

@Injectable()
export class PilineEventRecordService {
    constructor(private readonly repo: PilineEventRecordRepository) {}
    findAll() {
        return this.repo.findAll();
    }

    create(dto: CreatePilineEventRecordDto) {
        return this.repo.create(dto);
    }
    update(key: KeyPilineEventRecordDto, dto: UpdatePilineEventRecordDto) {
        return this.repo.update(key, dto);
    }
    remove(key: KeyPilineEventRecordDto) {
        return this.repo.remove(key);
    }
}
