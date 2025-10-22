import { Module } from '@nestjs/common';
import { IsTidService } from './is-tid.service';
import { IsTidController } from './is-tid.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsTid } from './entities/is-tid.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IsTid], 'webformConnection')],
  controllers: [IsTidController],
  providers: [IsTidService],
})
export class IsTidModule {}
