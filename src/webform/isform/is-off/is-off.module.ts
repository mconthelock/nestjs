import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsOffService } from './is-off.service';
import { IsOffController } from './is-off.controller';
import { LOGIN_REASON } from 'src/common/Entities/webform/table/LOGIN_REASON.entity';
import { ISOFF_VARIEDOFF } from 'src/common/Entities/webform/table/ISOFF_VARIEDOFF.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [ISOFF_VARIEDOFF, LOGIN_REASON],
            'webformConnection',
        ),
    ],
    controllers: [IsOffController],
    providers: [IsOffService],
})
export class IsOffModule {}
