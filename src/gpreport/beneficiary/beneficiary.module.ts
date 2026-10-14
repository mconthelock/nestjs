import { Module } from '@nestjs/common';
import { BeneficiaryService } from './beneficiary.service';
import { BeneficiaryController } from './beneficiary.controller';
import { BeneficiaryRepository } from './beneficiary.repository';
import { UsersModule } from 'src/amec/users/users.module';

@Module({
    controllers: [BeneficiaryController],
    providers: [BeneficiaryService, BeneficiaryRepository],
    imports: [UsersModule],
})
export class BeneficiaryModule {}
