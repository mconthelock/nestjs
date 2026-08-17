import { Module } from '@nestjs/common';
import { LabelconfirmService } from './labelconfirm.service';
import { LabelconfirmController } from './labelconfirm.controller';
import { LabelconfirmRepository } from './labelconfirm.repository';

@Module({
    controllers: [LabelconfirmController],
    providers: [LabelconfirmService, LabelconfirmRepository],
})
export class LabelconfirmModule {}
