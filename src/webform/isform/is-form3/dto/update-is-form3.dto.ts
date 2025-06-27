import { PartialType } from '@nestjs/swagger';
import { CreateIsForm3Dto } from './create-is-form3.dto';

export class UpdateIsForm3Dto extends PartialType(CreateIsForm3Dto) {}
