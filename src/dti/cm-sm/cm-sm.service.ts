import { Injectable } from '@nestjs/common';
import { UpdateCmSmDto } from './dto/update-cm-sm.dto';
import { CmSmRepository } from './cm-sm.repository';

@Injectable()
export class CmSmService {
    constructor(private readonly cmSmRepository: CmSmRepository) {}

    save(payload: UpdateCmSmDto) {
        return this.cmSmRepository.save(payload);
    }

    findAll() {
        return this.cmSmRepository.findAll();
    }
}
