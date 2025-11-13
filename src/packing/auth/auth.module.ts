import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Login } from './entities/login.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Login], 'packingConnection')],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
