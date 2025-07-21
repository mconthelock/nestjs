import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShipmentService } from './shipment.service';

@Controller('sp/shipment')
export class ShipmentController {
  constructor(private readonly ship: ShipmentService) {}

  @Get()
  findAll() {
    return this.ship.findAll();
  }
}
