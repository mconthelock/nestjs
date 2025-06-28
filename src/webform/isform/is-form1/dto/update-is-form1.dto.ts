import { PartialType } from '@nestjs/swagger';
import { CreateIsForm1Dto } from './create-is-form1.dto';

export class UpdateIsForm1Dto extends PartialType(CreateIsForm1Dto) {}
