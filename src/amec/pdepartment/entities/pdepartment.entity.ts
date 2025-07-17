import { Entity, Column, PrimaryColumn} from 'typeorm';

@Entity('PDEPARTMENT')
export class Pdepartment {
  @PrimaryColumn()
  SDEPCODE: string;

  @Column()
  SDEPARTMENT: string;

  @Column()
  SDEPT: string;
}
