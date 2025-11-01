import { Revision } from './entities/revision.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RevisionService {
  constructor(
    @InjectRepository(Revision, 'amecConnection')
    private readonly revisionRepository: Repository<Revision>,
  ) {}
}
