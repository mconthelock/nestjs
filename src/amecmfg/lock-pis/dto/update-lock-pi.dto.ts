import { PartialType } from '@nestjs/mapped-types';
import { CreateLockPiDto } from './create-lock-pi.dto';

export class UpdateLockPiDto extends PartialType(CreateLockPiDto) {
}
