import { PartialType } from '@nestjs/swagger';
import { CreateGpLy01Dto } from './create-gp-ly01.dto';

export class UpdateGpLy01Dto extends PartialType(CreateGpLy01Dto) {}
