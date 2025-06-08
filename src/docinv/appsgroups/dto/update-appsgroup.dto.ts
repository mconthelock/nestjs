import { PartialType } from '@nestjs/mapped-types';
import { CreateAppsgroupDto } from './create-appsgroup.dto';

export class UpdateAppsgroupDto extends PartialType(CreateAppsgroupDto) {}
