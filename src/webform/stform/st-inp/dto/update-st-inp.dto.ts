import { PartialType } from '@nestjs/swagger';
import { CreateStInpDto } from './create-st-inp.dto';

export class UpdateStInpDto extends PartialType(CreateStInpDto) {}
