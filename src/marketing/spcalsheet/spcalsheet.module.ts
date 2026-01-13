import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpcalsheetService } from './spcalsheet.service';
import { Spcalsheet } from './entities/spcalsheet.entity';
import { SpcalsheetController } from './spcalsheet.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Spcalsheet], 'spsysConnection')],
  controllers: [SpcalsheetController],
  providers: [SpcalsheetService],
})
export class SpcalsheetModule {}
