import { PartialType } from '@nestjs/mapped-types';
import { CreateAppsusersgroupDto } from './create-appsusersgroup.dto';

export class UpdateAppsusersgroupDto extends PartialType(CreateAppsusersgroupDto) {}
