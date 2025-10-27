import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterkeyService } from './masterkey.service';
import { Masterkey } from './entities/masterkey.entity';
import { MasterkeyController } from './masterkey.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Masterkey], 'amecConnection'),
    AuthModule,
  ],
  controllers: [MasterkeyController],
  providers: [MasterkeyService],
  exports: [MasterkeyService],
})
export class MasterkeyModule {}
