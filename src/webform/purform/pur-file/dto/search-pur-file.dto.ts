import { PickType } from '@nestjs/swagger';
import { SearchIsFileDto } from 'src/webform/isform/is-file/dto/search-is-file.dto';
export class SearchPurFileDto extends PickType(SearchIsFileDto, [
  'NFRMNO',
  'VORGNO',
  'CYEAR',
  'CYEAR2',
  'NRUNNO',
  'FILE_ID'
] as const) {
}
