import { PartialType } from '@nestjs/swagger';
import { CreateF002kpDto } from './create-f002kp.dto';

export class UpdateF002kpDto extends PartialType(CreateF002kpDto) {}
