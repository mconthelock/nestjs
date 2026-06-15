import { Module } from '@nestjs/common';
import { S049kpService } from './s049kp.service';
import { S049kpController } from './s049kp.controller';
import { S049kpRepository } from './s049kp.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S049KP } from 'src/common/Entities/datacenter/table/S049KP.entity';

@Module({
    imports: [TypeOrmModule.forFeature([S049KP], 'datacenterConnection')],
    controllers: [S049kpController],
    providers: [S049kpService, S049kpRepository],
    exports: [S049kpService],
})
export class S049kpModule {}
