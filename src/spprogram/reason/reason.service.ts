import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateReasonDto } from './dto/create-reason.dto';
import { UpdateReasonDto } from './dto/update-reason.dto';
import { Reason } from './entities/reason.entity';

@Injectable()
export class ReasonService {
  constructor(
    @InjectRepository(Reason, 'amecConnection')
    private readonly reason: Repository<Reason>,
  ) {}
}
