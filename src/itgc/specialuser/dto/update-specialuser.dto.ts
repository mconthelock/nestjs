import { PartialType } from '@nestjs/swagger';
import { CreateSpecialuserDto } from './create-specialuser.dto';

export class UpdateSpecialuserDto extends PartialType(CreateSpecialuserDto) {}
