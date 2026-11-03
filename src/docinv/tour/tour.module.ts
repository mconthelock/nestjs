import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourService } from './services/tour.service';
import { TourController } from './controller/tour.controller';
import { TourRepository } from './repository/tour.repository';
import { TourUserRepository } from './repository/tour-user.repository';
import { TOUR } from 'src/common/Entities/docinv/table/TOUR.entity';
import { TOUR_USER } from 'src/common/Entities/docinv/table/TOUR_USER.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TOUR, TOUR_USER], 'mitsuConnection')],
    controllers: [TourController],
    providers: [TourService, TourRepository, TourUserRepository],
})
export class TourModule {}
