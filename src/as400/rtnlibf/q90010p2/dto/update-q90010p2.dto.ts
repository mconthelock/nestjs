import { PartialType } from '@nestjs/mapped-types';
import { CreateQ90010p2Dto } from './create-q90010p2.dto';

export class UpdateQ90010p2Dto extends PartialType(CreateQ90010p2Dto) {}
