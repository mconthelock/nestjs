import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn  } from 'typeorm';

@Entity({ name: 'Log_MethodErr' })
export class LogMethodErr {
  @PrimaryGeneratedColumn()
  ErrRec: number;

  @Column()
  ErrMethod: string;

  @Column()
  ErrDesc: string;

  @Column()
  ErrType: number;

  @Column()
  ErrUser: string;

  @Column()
  ErrDate: Date;
}
