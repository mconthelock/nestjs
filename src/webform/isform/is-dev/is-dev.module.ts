import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsDevService } from './is-dev.service';
import { IsDevController } from './is-dev.controller';
import { IsDev } from './entities/is-dev.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IsDev], 'webformConnection')],
  controllers: [IsDevController],
  providers: [IsDevService],
})
export class IsDevModule {}
