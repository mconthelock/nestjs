import { PartialType } from '@nestjs/mapped-types';
import { CreateAppsmenuuserDto } from './create-appsmenuuser.dto';

export class UpdateAppsmenuuserDto extends PartialType(CreateAppsmenuuserDto) {}
