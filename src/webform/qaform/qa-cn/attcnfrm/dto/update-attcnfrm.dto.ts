import { PartialType } from '@nestjs/swagger';
import { CreateAttcnfrmDto } from './create-attcnfrm.dto';

export class UpdateAttcnfrmDto extends PartialType(CreateAttcnfrmDto) {}
