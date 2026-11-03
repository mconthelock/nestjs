import { PartialType } from '@nestjs/mapped-types';
import { CreateF003kpDto } from './create-f003kp.dto';

export class UpdateF003kpDto extends PartialType(CreateF003kpDto) {}
