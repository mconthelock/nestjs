import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('SP_ATTACHED')
export class Attachment {
  @PrimaryColumn()
  INQ_NO: string;

  @PrimaryColumn()
  FILE_NAME: string;

  @Column()
  FILE_ORIGINAL_NAME: string;

  @Column()
  FILE_SIZE: string;

  @Column()
  FILE_TYPE: string;

  @Column()
  FILE_CLASS: string;

  @Column()
  FILE_STATUS: string;

  @Column()
  FILE_OWNER: string;

  @Column()
  FILE_MAR_READ: string;

  @Column()
  FILE_DES_READ: string;

  @Column()
  FILE_CREATE_AT: Date;

  @Column()
  FILE_CREATE_BY: string;
}
