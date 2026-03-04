import { Module } from '@nestjs/common';
import { ItemarrnglstModule } from './itemarrnglst/itemarrnglst.module';
import { SpaccarrnglstModule } from './spaccarrnglst/spaccarrnglst.module';
@Module({
  imports: [ItemarrnglstModule, SpaccarrnglstModule],
})
export class ElmesModule {}
