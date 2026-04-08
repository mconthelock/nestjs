import { Injectable } from '@nestjs/common';
import { QaTypeRepository } from './qa_type.repository';

@Injectable()
export class QaTypeService {
    constructor(private readonly repo: QaTypeRepository) {}

    getQaTypeAll() {
        return this.repo.findAll();
    }

    getQaTypeByCode(code: string) {
        return this.repo.findOneByCode(code);
    }
}
