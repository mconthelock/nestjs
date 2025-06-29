import { PartialType } from '@nestjs/swagger';
import { CreateIsForm4Dto } from './create-is-form4.dto';

export class UpdateIsForm4Dto extends PartialType(CreateIsForm4Dto) {}
