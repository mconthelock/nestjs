import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Appsmenu } from '../../appsmenu/entities/appsmenu.entity';

@Entity('APP_MENU_USERS')
export class Appsmenuuser {
  @PrimaryColumn()
  MENU_ID: number;

  @PrimaryColumn()
  USERS_GROUP: number;

  @PrimaryColumn()
  PROGRAM: number;

  @ManyToOne(() => Appsmenu, (menu) => menu)
  @JoinColumn({ name: 'MENU_ID' })
  Appsmenu: Appsmenu;
}
