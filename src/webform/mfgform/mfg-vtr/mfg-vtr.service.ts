import { Injectable } from '@nestjs/common';
import { CreateMfgVtrDto } from './dto/create-mfg-vtr.dto';
import { UpdateMfgVtrDto } from './dto/update-mfg-vtr.dto';
import { MfgVtrRepository } from './mfg-vtr.repository';

@Injectable()
export class MfgVtrService {
    constructor(private readonly mfgVtrRepository: MfgVtrRepository) {}
}
