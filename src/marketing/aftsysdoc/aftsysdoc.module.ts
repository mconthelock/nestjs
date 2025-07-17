import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AftsysdocService } from './aftsysdoc.service';
import { Aftsysdoc } from './entities/aftsysdoc.entity';
import { AftsysdocController } from './aftsysdoc.controller';

@Module({
  controllers: [AftsysdocController],
  imports: [
    TypeOrmModule.forFeature([Aftsysdoc], 'amecConnection')
  ],
  providers: [AftsysdocService],
})
export class AftsysdocModule {}
