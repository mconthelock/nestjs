import { Module } from '@nestjs/common';
import { MfgVtrService } from './mfg-vtr.service';
import { MfgVtrController } from './mfg-vtr.controller';
import { MfgVtrRepository } from './mfg-vtr.repository';
import { FormModule } from 'src/webform/form/form.module';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { AmecModule } from 'src/amec/amec.module';
import { UsersModule } from 'src/amec/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MFGVTR_DETAIL } from 'src/common/Entities/webform/table/MFGVTR_DETAIL.entity';
import { MFGVTR_FORM } from 'src/common/Entities/webform/table/MFGVTR_FORM.entity';
import { Products } from 'src/common/Entities/pursys/table/PRODUCTS.entity';
import { Categories } from '../../../common/Entities/pursys/table/CATEGORIES.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([
        MFGVTR_DETAIL,
        MFGVTR_FORM,
        Products,
        Categories,
    ], 'mitsuConnection'),FormmstModule, FormModule, AmecModule, UsersModule],
    controllers: [MfgVtrController],
    providers: [MfgVtrService, MfgVtrRepository],
})
export class MfgVtrModule {}
