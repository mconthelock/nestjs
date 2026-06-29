import { PickType } from '@nestjs/swagger';
import { CreateFinpckAssetDto } from './create-finpck_asset.dto';

// 1. ดึงฟิลด์ที่อยากได้จาก Create มา (REMARK, PRICE)
export class UpdateFinpckAssetDto extends PickType(CreateFinpckAssetDto, [
  'NFRMNO',
  'VORGNO',
  'CYEAR',
  'CYEAR2',
  'NRUNNO',
  'ID',
  'CONFIRM',
  'NOSTICKER',
  'LOST',
  'DAMAGE',
  'MOVEMENT',
  'OTHCAUSE',
  'REMOTHCAUSE',
 'PIC'
]) {
}
