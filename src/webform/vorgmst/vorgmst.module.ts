import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VorgmstService } from './vorgmst.service';
import { VorgmstController } from './vorgmst.controller';
import { VORGMST } from 'src/common/Entities/webform/views/VORGMST.entity';

@Module({
  imports: [
    // 3. 🛠️ เพิ่มบรรทัดนี้ เพื่อบอก Module ว่าเราจะใช้งานเอนทิตีนี้ผ่าน webformConnection
    TypeOrmModule.forFeature([VORGMST], 'webformConnection'),
  ],
  controllers: [VorgmstController],
  providers: [VorgmstService],
  exports: [VorgmstService],
})
export class VorgmstModule {}
