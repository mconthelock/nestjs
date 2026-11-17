import { Module } from '@nestjs/common';
import { FxaGrpmstService } from './fxa_grpmst.service';
import { FxaGrpmstController } from './fxa_grpmst.controller';
import { FXAGRPRepository } from './fxa_grpmst.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FXA_GRPMST } from 'src/common/Entities/webform/table/FXA_GRMST.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        FXA_GRPMST,
    ], 'mitsuConnection'),
    ],
    controllers: [FxaGrpmstController],
    providers: [FxaGrpmstService, FXAGRPRepository],
})
export class FxaGrpmstModule {}
