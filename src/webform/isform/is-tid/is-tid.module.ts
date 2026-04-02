import { Module } from '@nestjs/common';
import { IsTidService } from './is-tid.service';
import { IsTidController } from './is-tid.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ISTID_FORM } from 'src/common/Entities/webform/table/ISTID_FORM.entity';
import { IsTidRepository } from './is-tid.repository';
import { IsTidCreateFormService } from './is-tid-createForm.service';

@Module({
    imports: [TypeOrmModule.forFeature([ISTID_FORM], 'webformConnection')],
    controllers: [IsTidController],
    providers: [IsTidService, IsTidCreateFormService, IsTidRepository],
    exports: [IsTidService],
})
export class IsTidModule {}
