import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('AFT_SYSDOC')
export class Aftsysdoc {
  @PrimaryColumn()
  F001: string;

  @Column()
  F003: string;

  @Column()
  F004: string;

  @Column()
  F008: string;

  @Column()
  F009: string;
}
