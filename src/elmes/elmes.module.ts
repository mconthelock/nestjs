import { Module } from '@nestjs/common';
import { ItemarrnglstModule } from './itemarrnglst/itemarrnglst.module';
@Module({
  imports: [ItemarrnglstModule],
})
export class ElmesModule {}
