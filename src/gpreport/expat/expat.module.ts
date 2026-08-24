import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpatController } from './expat.controller';
import { ExpatService } from './expat.service';
import { ExpatRepository } from './expat.repository';
import { User } from 'src/amec/users/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User], 'gpreportConnection')],
    controllers: [ExpatController],
    providers: [ExpatService, ExpatRepository],
    exports: [ExpatService, ExpatRepository],
})
export class ExpatModule {}