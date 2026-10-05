import { Module } from '@nestjs/common';
import { PurPraService } from './services/pur-pra.service';
import { PurPraController } from './controller/pur-pra.controller';
import { CommitteeRepository } from './repository/committe.repository';
import { GroupRepository } from './repository/group.repository';

@Module({
    controllers: [PurPraController],
    providers: [
        //service
        PurPraService,
        //repository
        CommitteeRepository,
        GroupRepository,
    ],
})
export class PurPraModule {}
