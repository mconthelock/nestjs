import { PartialType } from '@nestjs/mapped-types';
import { CreateM008kpDto } from './create-m008kp.dto';

export class UpdateM008kpDto extends PartialType(CreateM008kpDto) {}
