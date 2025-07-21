import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MscountryService } from './mscountry.service';
import { Mscountry } from './entities/mscountry.entity';
import { MscountryController } from './mscountry.controller';

@Module({
  controllers: [MscountryController],
  imports: [
    TypeOrmModule.forFeature([Mscountry], 'amecConnection')
  ],
  providers: [MscountryService],
})
export class MscountryModule {}
