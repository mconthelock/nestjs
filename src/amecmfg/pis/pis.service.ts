import { Injectable } from '@nestjs/common';
import { PisRepository } from './printed/pis.repository';

@Injectable()
export class PisService {
    constructor(private readonly repo: PisRepository) {}
}
