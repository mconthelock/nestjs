import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsJdrService } from './is-jdr.service';
import { IsJdrController } from './is-jdr.controller';
import { ISJDR_RESULT } from 'src/common/Entities/webform/table/ISJDR_RESULT.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ISJDR_RESULT], 'webformConnection')],
    controllers: [IsJdrController],
    providers: [IsJdrService],
})
export class IsJdrModule {}
