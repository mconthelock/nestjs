import { ApiProperty } from '@nestjs/swagger';

export class PackUserInfoDto {
  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'User Name' })
  userName: string;

  @ApiProperty({ description: '0 = AS400 data, 1 = Local data' })
  useLocaltb: string;
}
