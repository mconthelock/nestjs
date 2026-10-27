import { Module } from '@nestjs/common';
import { TourService } from './services/tour.service';
import { TourController } from './controller/tour.controller';
import { TourRepository } from './repository/tour.repository';
import { TourUserRepository } from './repository/tour-user.repository';

@Module({
    controllers: [TourController],
    providers: [TourService, TourRepository, TourUserRepository],
})
export class TourModule {}
