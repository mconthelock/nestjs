import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterkeyService } from './masterkey.service';
import { MasterkeyController } from './masterkey.controller';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseService } from '../shared/database.service';
import { Masterkey } from './entities/masterkey.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Masterkey], 'datacenterConnection'), AuthModule],
    controllers: [MasterkeyController],
    providers: [MasterkeyService, DatabaseService],
    exports: [MasterkeyService, DatabaseService],
})
export class MasterkeyModule {}
