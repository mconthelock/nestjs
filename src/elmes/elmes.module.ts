import { Module } from '@nestjs/common';
import { ItemarrnglstModule } from './itemarrnglst/itemarrnglst.module';
import { SpaccarrnglstModule } from './spaccarrnglst/spaccarrnglst.module';
import { M12023ItemarrnglstAppModule } from './m12023_itemarrnglst_app/m12023_itemarrnglst_app.module';
@Module({
  imports: [ItemarrnglstModule, SpaccarrnglstModule, M12023ItemarrnglstAppModule],
})
export class ElmesModule {}
