import { PartialType } from '@nestjs/swagger';
import { CreateUsersAuthorizeDto } from './create-user-authorize.dto';

export class UpdateUsersAuthorizeDto extends PartialType(CreateUsersAuthorizeDto) {}
