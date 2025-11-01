import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulesService } from './modules.service';
import { Modules } from './entities/modules.entity';
import { ModulesController } from './modules.controller';

@Module({
  controllers: [ModulesController],
  imports: [
    TypeOrmModule.forFeature([Modules], 'amecConnection')
  ],
  providers: [ModulesService],
})
export class ModulesModule {}
