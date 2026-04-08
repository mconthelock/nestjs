import { PartialType } from '@nestjs/swagger';
import { CreateUsersFileDto } from './create-user-file.dto';

export class UpdateUsersFileDto extends PartialType(CreateUsersFileDto) {}
