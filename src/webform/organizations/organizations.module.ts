import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORGANIZATIONS } from 'src/common/Entities/webform/views/ORGANIZATIONS.entity';
import { OrganizationsRepository } from './organizations.repository';
import { SequenceOrgModule } from '../sequence-org/sequence-org.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ORGANIZATIONS], 'webformConnection'),
        SequenceOrgModule,
    ],
    controllers: [OrganizationsController],
    providers: [OrganizationsService, OrganizationsRepository],
    exports: [OrganizationsService],
})
export class OrganizationsModule {}
