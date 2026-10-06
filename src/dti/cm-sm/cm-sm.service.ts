import { Injectable } from '@nestjs/common';
import { CreateCmSmDto } from './dto/create-cm-sm.dto';
import { UpdateCmSmDto } from './dto/update-cm-sm.dto';
import { CmSmRepository } from './cm-sm.repository';

@Injectable()
export class CmSmService {
    constructor(private readonly cmSmRepository: CmSmRepository) {}
}
