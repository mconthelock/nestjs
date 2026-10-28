import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { FollowRepository } from './follow.repository';
import { FormModule } from 'src/webform/form/form.module';

@Module({
    imports: [FormModule],
    controllers: [FollowController],
    providers: [FollowService, FollowRepository],
})
export class SafetyFollowModule {}
