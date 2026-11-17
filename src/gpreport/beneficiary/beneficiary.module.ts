import { Module } from '@nestjs/common';
import { BeneficiaryService } from './beneficiary.service';
import { BeneficiaryController } from './beneficiary.controller';
import { BeneficiaryRepository } from './beneficiary.repository';
import { UsersModule } from 'src/amec/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BENEFICIARY } from 'src/common/Entities/gpreport/table/BENEFICIARY.entity';

@Module({
    controllers: [BeneficiaryController],
    providers: [BeneficiaryService, BeneficiaryRepository],
    imports: [
        TypeOrmModule.forFeature([
        BENEFICIARY,
    ], 'mitsuConnection'),UsersModule],
})
export class BeneficiaryModule {}
