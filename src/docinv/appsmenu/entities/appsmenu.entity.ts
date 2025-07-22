import { Entity, PrimaryColumn, Column, OneToMany, JoinColumn } from 'typeorm';
import { Appsmenuuser } from '../../appsmenuusers/entities/appsmenuuser.entity';

@Entity('APP_MENU')
export class Appsmenu {
  @PrimaryColumn()
  MENU_ID: number;

  @Column()
  MENU_DISPLAY: string;

  @Column()
  MENU_CLASS: string;

  @Column()
  MENU_TYPE: number;

  @Column()
  MENU_TOP: number;

  @Column()
  MENU_SEQ: number;

  @Column()
  MENU_LINK: string;

  @Column()
  MENU_REMARK: string;

  @Column()
  MENU_PROGRAM: number;

  @Column()
  MENU_NO: number;

  @Column()
  MENU_STATUS: number;

  @Column()
  MENU_TNAME: string;

  @Column()
  MENU_ICON: string;

  @OneToMany(() => Appsmenuuser, (detail) => detail.MENU_ID)
  menuGroup: Appsmenuuser[];
}
