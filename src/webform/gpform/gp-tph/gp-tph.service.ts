import { Injectable } from '@nestjs/common';
import { CreateGpTphDto } from './dto/create-gp-tph.dto';
import { UpdateGpTphDto } from './dto/update-gp-tph.dto';
import { GpTphRepository } from './gp-tph.repository';

@Injectable()
export class GpTphService {
    constructor(private readonly repo: GpTphRepository) {}

    findAllAreas() {
        return this.repo.findAllAreas();
    }
}
