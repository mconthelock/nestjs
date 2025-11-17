import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Appsmenu } from './entities/appsmenu.entity';
import { CreateAppsmenuDto } from './dto/create-appsmenu.dto';

@Injectable()
export class AppsmenuService {
  constructor(
    @InjectRepository(Appsmenu, 'docinvConnection')
    private readonly menu: Repository<Appsmenu>,
  ) {}

  async findAppMenu(id: number) {
    return this.menu.find({
      where: { MENU_PROGRAM: id },
      relations: ['parent'],
      order: { MENU_TOP: 'asc', MENU_TYPE: 'asc', MENU_SEQ: 'asc' },
    });
  }

  async findOneMenu(id: number) {
    return this.menu.find({
      where: { MENU_ID: id },
      relations: ['parent'],
      order: { MENU_TOP: 'asc', MENU_TYPE: 'asc', MENU_SEQ: 'asc' },
    });
  }

  async create(data: CreateAppsmenuDto) {
    const list = this.menu.create(data);
    const result = await this.menu.save(list);
    if (data.MENU_TYPE === 1) {
      await this.menu.update(
        { MENU_ID: result.MENU_ID },
        { MENU_TOP: result.MENU_ID },
      );
    }
    // return result;
    return this.findOneMenu(result.MENU_ID);
  }

  async update(id: number, data: CreateAppsmenuDto) {
    const list = await this.menu.findOneBy({ MENU_ID: id });
    if (!list) {
      throw new NotFoundException(`Menu with id ${id} not found`);
    }
    Object.assign(list, data);
    const result = await this.menu.save(list);
    return this.findOneMenu(result.MENU_ID);
  }

  async remove(id: number) {
    return this.menu.delete({ MENU_ID: id });
  }
}
