import { PartialType } from '@nestjs/swagger';
import { ESCSCreateUserAuthorizeDto } from './create-user-authorize.dto';

export class ESCSUpdateUserAuthorizeDto extends PartialType(ESCSCreateUserAuthorizeDto) {}
