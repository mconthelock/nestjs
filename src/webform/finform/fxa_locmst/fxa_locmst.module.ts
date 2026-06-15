import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FxaLocmstService } from './fxa_locmst.service';
import { FxaLocmstController } from './fxa_locmst.controller';
import { FXA_LOCMST } from 'src/common/Entities/webform/table/FXA_LOCMST.entity';

@Module({
  imports: [
    // อย่าลืมเอา Entity หลักไปใส่ใน TypeOrmModule เพื่อให้ Repository ทำงานได้
    TypeOrmModule.forFeature([FXA_LOCMST]) 
  ],
  controllers: [FxaLocmstController],
  providers: [FxaLocmstService],
})
export class FxaLocmstModule {}
