import { Injectable } from '@nestjs/common';
import { PisRepository } from './printed/pis.repository';

import { UpdatePisFilesDto } from './printed/dto/update-pis-file.dto';
import { SearchPisFilesDto } from './printed/dto/search-pis-file.dto';

@Injectable()
export class PisService {
    constructor(private readonly repo: PisRepository) {}
}
