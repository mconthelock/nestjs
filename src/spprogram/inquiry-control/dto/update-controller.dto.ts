import { Type } from 'class-transformer';
import { IsString, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

import { CreateControllerDto } from './create-controller.dto';

export class UpdateControllerDto extends PartialType(CreateControllerDto) {}
