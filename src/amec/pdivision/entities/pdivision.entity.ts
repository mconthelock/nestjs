import { Entity, Column, PrimaryColumn} from 'typeorm';
    
@Entity('PDIVISION')
export class Pdivision {
    
  @PrimaryColumn()
  SDIVCODE: string;

  @Column()
  SDIVISION: string;

  @Column()
  SDIV: string;


}
