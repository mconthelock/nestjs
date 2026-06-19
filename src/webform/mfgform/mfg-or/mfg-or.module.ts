import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MfgOrController } from './mfg-or.controller';
import { MfgOrService } from './mfg-or.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([], 'webformConnection'),
  ],
  controllers: [MfgOrController],
  providers: [MfgOrService],
})
export class MfgOrModule {}