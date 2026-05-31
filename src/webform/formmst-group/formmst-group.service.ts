import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { FORMMST_GROUP } from 'src/common/Entities/webform/table/FORMMST_GROUP.entity';
import { CreateFormmstGroupDto } from './dto/create-formmst-group.dto';
import { UpdateFormmstGroupDto } from './dto/update-formmst-group.dto';

@Injectable()
export class FormmstGroupService {
    constructor(
        @InjectRepository(FORMMST_GROUP, 'webformConnection')
        private readonly frm: Repository<FORMMST_GROUP>,
    ) {}

    findAll() {
        return this.frm.find();
    }

    create(createFormmstGroupDto: CreateFormmstGroupDto) {
        return this.frm.save(createFormmstGroupDto);
    }
}
