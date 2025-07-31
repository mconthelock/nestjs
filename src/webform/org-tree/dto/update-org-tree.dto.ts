import { PartialType } from '@nestjs/mapped-types';
import { CreateOrgTreeDto } from './create-org-tree.dto';

export class UpdateOrgTreeDto extends PartialType(CreateOrgTreeDto) {}
