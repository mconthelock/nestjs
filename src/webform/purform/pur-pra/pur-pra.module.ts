import { Module } from '@nestjs/common';
import { PurPraService } from './services/pur-pra.service';
import { PurPraController } from './controller/pur-pra.controller';
import { CommitteeRepository } from './repository/committe.repository';
import { GroupRepository } from './repository/group.repository';
import { ReasonsRepository } from './repository/reasons.repository';

@Module({
    controllers: [PurPraController],
    providers: [
        //service
        PurPraService,
        //repository
        CommitteeRepository,
        GroupRepository,
        ReasonsRepository,
    ],
})
export class PurPraModule {}
