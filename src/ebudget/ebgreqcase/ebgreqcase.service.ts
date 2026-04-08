import { Injectable } from '@nestjs/common';
import { EbgreqcaseRepository } from './ebgreqcase.repository';

@Injectable()
export class EbgreqcaseService {
    constructor(private readonly repo: EbgreqcaseRepository) {}

    findAll() {
        return this.repo.findAll();
    }

    findOne(id: number) {
        return this.repo.findOne(id);
    }
}
