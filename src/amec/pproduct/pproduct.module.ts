import { Module } from '@nestjs/common';
import { PproductService } from './pproduct.service';
import { PproductController } from './pproduct.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pproduct } from '../../common/Entities/amec/table/PPRODUCT.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Pproduct], 'mitsuConnection')],
    controllers: [PproductController],
    providers: [PproductService],
})
export class PproductModule {}
