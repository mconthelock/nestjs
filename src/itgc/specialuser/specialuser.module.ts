import { Module } from '@nestjs/common';
import { SpecialuserService } from './specialuser.service';
import { SpecialuserController } from './specialuser.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialuser } from './entities/specialuser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Specialuser], 'auditConnection')],
  controllers: [SpecialuserController],
  providers: [SpecialuserService],
  exports: [SpecialuserService],
})
export class SpecialuserModule {}
