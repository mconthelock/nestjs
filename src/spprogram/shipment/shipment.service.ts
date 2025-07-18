import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Shipment } from './entities/shipment.entity';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment, 'amecConnection')
    private readonly ship: Repository<Shipment>,
  ) {}
}
