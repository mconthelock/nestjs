import { Module } from '@nestjs/common';
import { IsAdpService } from './is-adp.service';
import { IsAdpController } from './is-adp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormModule } from 'src/webform/form/form.module';
import { IsFileModule } from '../is-file/is-file.module';
import { IsAdpRepository } from './is-adp.repository';
import { ISADP_FORM } from 'src/common/Entities/webform/table/ISADP_FORM.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ISADP_FORM], 'webformConnection'),
        FormModule,
        IsFileModule,
    ],
    controllers: [IsAdpController],
    providers: [IsAdpService, IsAdpRepository],
    exports: [IsAdpService],
})
export class IsAdpModule {}
