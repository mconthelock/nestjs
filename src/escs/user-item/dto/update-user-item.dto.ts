import { PartialType } from '@nestjs/swagger';
import { CreateUserItemDto } from './create-user-item.dto';

export class UpdateUserItemDto extends PartialType(CreateUserItemDto) {}
