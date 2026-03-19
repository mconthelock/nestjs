import { PartialType } from '@nestjs/swagger';
import { CreateF001kpDto } from './create-f001kp.dto';

export class UpdateF001kpDto extends PartialType(CreateF001kpDto) {}
