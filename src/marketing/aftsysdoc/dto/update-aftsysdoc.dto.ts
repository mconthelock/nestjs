import { PartialType } from '@nestjs/swagger';
import { CreateAftsysdocDto } from './create-aftsysdoc.dto';

export class UpdateAftsysdocDto extends PartialType(CreateAftsysdocDto) {}
