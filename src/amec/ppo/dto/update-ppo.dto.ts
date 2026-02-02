import { PartialType } from '@nestjs/swagger';
import { CreatePpoDto } from './create-ppo.dto';

export class UpdatePpoDto extends PartialType(CreatePpoDto) {}
