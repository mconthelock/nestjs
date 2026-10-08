import { Module } from '@nestjs/common';
import { MfgVtrService } from './mfg-vtr.service';
import { MfgVtrController } from './mfg-vtr.controller';
import { MfgVtrRepository } from './mfg-vtr.repository';
import { FormModule } from 'src/webform/form/form.module';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { AmecModule } from 'src/amec/amec.module';
import { UsersModule } from 'src/amec/users/users.module';
@Module({
    imports: [FormmstModule, FormModule, AmecModule, UsersModule],
    controllers: [MfgVtrController],
    providers: [MfgVtrService, MfgVtrRepository],
})
export class MfgVtrModule {}
