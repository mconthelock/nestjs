import { PartialType } from '@nestjs/swagger';
import { CreateJopMarReqDto } from './create-jop-mar-req.dto';

export class UpdateJopMarReqDto extends PartialType(CreateJopMarReqDto) {}
