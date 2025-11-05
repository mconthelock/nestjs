import { Module } from '@nestjs/common';
import { SecretlogService } from './secretlog.service';
import { SecretlogController } from './secretlog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Secretlog } from './entities/doc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Secretlog], 'amecConnection')],
  controllers: [SecretlogController],
  providers: [SecretlogService],
})
export class SecretlogModule {}
