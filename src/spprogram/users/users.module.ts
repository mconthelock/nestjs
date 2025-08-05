import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpUser } from './users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpUser], 'amecConnection')],
})
export class SpUserModule {}
