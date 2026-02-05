import { PartialType } from '@nestjs/swagger';
import { CreateBuspassengerDto } from './create-buspassenger.dto';

export class UpdateBuspassengerDto extends PartialType(CreateBuspassengerDto) {}
