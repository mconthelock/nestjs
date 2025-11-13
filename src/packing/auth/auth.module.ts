import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Login } from './entities/login.entity';

/**
 * Auth Module
 * Handles user authentication logic and provides login APIs.
 * @author  Mr.Pathanapong Sokpukeaw
 * @since   2025-11-12
 */
@Module({
  imports: [TypeOrmModule.forFeature([Login], 'packingConnection')],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
