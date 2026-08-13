import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TERMCODE } from 'src/common/Entities/pursys/table/TERMCODE.entity';

@Injectable()
export class TermcodeService {
    constructor(
        @InjectRepository(TERMCODE, 'purConnection')
        private readonly term: Repository<TERMCODE>,
    ) {}

    findAll() {
        return this.term.find();
    }
}
