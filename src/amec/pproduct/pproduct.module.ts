import { Module } from '@nestjs/common';
import { PproductService } from './pproduct.service';
import { PproductController } from './pproduct.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pproduct } from '../../common/Entities/amec/table/PPRODUCT.entity';
import { Pvender } from '../../common/Entities/amec/table/PVENDER.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Pproduct, Pvender], 'mitsuConnection')],
    controllers: [PproductController],
    providers: [PproductService],
    exports: [TypeOrmModule],
})
export class PproductModule {}
