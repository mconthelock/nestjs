import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { Shipment } from './entities/shipment.entity';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment, 'amecConnection')
    private readonly ship: Repository<Shipment>,
  ) {}
}
