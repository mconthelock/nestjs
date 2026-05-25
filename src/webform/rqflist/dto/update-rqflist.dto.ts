import { PartialType } from '@nestjs/swagger';
import { CreateRqflistDto } from './create-rqflist.dto';

export class UpdateRqflistDto extends PartialType(CreateRqflistDto) {}
