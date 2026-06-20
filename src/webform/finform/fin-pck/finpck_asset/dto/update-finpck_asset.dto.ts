import { PartialType } from '@nestjs/swagger';
import { CreateFinpckAssetDto } from './create-finpck_asset.dto';

export class UpdateFinpckAssetDto extends PartialType(CreateFinpckAssetDto) {}
