import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppsmenuusersService } from './appsmenuusers.service';
import { AppsmenuusersController } from './appsmenuusers.controller';
import { Appsmenuuser } from '../../common/Entities/docinv/table/appsmenuuser.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Appsmenuuser], 'docinvConnection')],
    controllers: [AppsmenuusersController],
    providers: [AppsmenuusersService],
    exports: [AppsmenuusersService],
})
export class AppsmenuusersModule {}
