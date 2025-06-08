import { PartialType } from '@nestjs/mapped-types';
import { CreateAppsuserDto } from './create-appsuser.dto';

export class UpdateAppsuserDto extends PartialType(CreateAppsuserDto) {}
