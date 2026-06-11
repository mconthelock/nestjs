import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PSRP_LIST } from "src/common/Entities/webform/table/PSRP_LIST.entity";
import { FlowModule } from "src/webform/flow/flow.module";
import { FormModule } from "src/webform/form/form.module";
import { FormmstModule } from "src/webform/formmst/formmst.module";
import { PsRPController } from "./ps-rp.controller";
import { PsRPRepository } from "./ps-rp.repository";
import { PsRPService } from "./ps-rp.service";
import { PSRP_FORM } from "src/common/Entities/webform/table/PSRP_FORM.entity";


@Module({
    imports: [
        TypeOrmModule.forFeature(
            [PSRP_LIST, PSRP_FORM],
            'webformConnection',
        ),
        FormmstModule,
        FormModule,
        FlowModule,
    ],
    controllers: [PsRPController],
    providers: [PsRPService, PsRPRepository],
    exports: [PsRPService],
})
export class PsRPModule {}