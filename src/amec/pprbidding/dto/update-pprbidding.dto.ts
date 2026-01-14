import { PartialType } from '@nestjs/swagger';
import { CreatePprbiddingDto } from './create-pprbidding.dto';

export class UpdatePprbiddingDto extends PartialType(CreatePprbiddingDto) {}
