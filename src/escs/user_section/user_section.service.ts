import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { UserSection } from './entities/user_section.entity';
import { SearchEscsUserSectionDto } from './dto/search-escs-usersection.dto';

@Injectable()
export class UserSectionService {
  constructor(
    @InjectRepository(UserSection, 'amecConnection')
    private userSectionRepo: Repository<UserSection>,
  ) {}

  getUserSecAll() {
    return this.userSectionRepo.find({
      order: {
        SEC_ID: 'ASC',
      },
    });
  }

  getUserSecByID(id: number) {
    return this.userSectionRepo.findOne({
      where: { SEC_ID: id },
      order: {
        SEC_ID: 'ASC',
      },
    });
  }

  getSection(searchDto: SearchEscsUserSectionDto) {
    const { SEC_ID, SEC_NAME, SEC_STATUS, INCHARGE } = searchDto;
    return this.userSectionRepo.find({
      where: [
        { SEC_ID, SEC_NAME, SEC_STATUS, INCHARGE },
      ],
      order: {
        SEC_ID: 'ASC',
      },
    });
  }
}
