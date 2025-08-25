import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlowService } from './flow.service';
import { FlowController } from './flow.controller';
import { Flow } from './entities/flow.entity';
import { RepModule } from '../rep/rep.module';
import { FormModule } from '../form/form.module';
import { UsersModule } from 'src/amec/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Flow], 'amecConnection'),
    RepModule,
    forwardRef(() => FormModule),
    UsersModule
  ],
  controllers: [FlowController],
  providers: [FlowService],
  exports: [FlowService],
})
export class FlowModule {}
