import { Module } from '@nestjs/common';
import { IsAdpService } from './is-adp.service';
import { IsAdpController } from './is-adp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsAdp } from './entities/is-adp.entity';
import { FormModule } from 'src/webform/form/form.module';
import { IsFileModule } from '../is-file/is-file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([IsAdp], 'webformConnection'),
    FormModule,
    IsFileModule,
  ],
  controllers: [IsAdpController],
  providers: [IsAdpService],
  exports: [IsAdpService],
})
export class IsAdpModule {}
