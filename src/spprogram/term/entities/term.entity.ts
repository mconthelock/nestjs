import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('SP_DELIVERY_TERM')
export class Term {
  @PrimaryColumn()
  TERM_ID: string;

  @Column()
  TERM_DESC: string;

  @Column()
  TERM_STATUS: string;
}
