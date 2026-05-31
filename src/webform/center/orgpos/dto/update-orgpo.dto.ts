import { PartialType } from '@nestjs/mapped-types';
import { CreateOrgpoDto } from './create-orgpo.dto';

export class UpdateOrgpoDto extends PartialType(CreateOrgpoDto) {}
