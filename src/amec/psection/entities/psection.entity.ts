import { Entity, Column, PrimaryColumn} from 'typeorm';
@Entity('PSECTION')
export class Psection {
  @PrimaryColumn()
  SSECCODE: string;

  @Column()
  SSECTION: string;

  @Column()
  SSEC: string;
}

