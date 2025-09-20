import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Pposition } from 'src/amec/pposition/entities/pposition.entity';

@Entity('FORM1_WAGE')
export class Form1Wage {
  @PrimaryColumn()
  FYEAR: number; // หากไม่พบ Primary Key ใน SQL จะใช้ id เป็น PrimaryGeneratedColumn เริ่มต้น

  @PrimaryColumn()
  POSITION: string;

  @Column('decimal', { precision: 10, scale: 2 })
  WAGE: number;

  @Column()
  CSTATUS: string;

  @OneToOne(() => Pposition, (pos) => pos.wage)
  @JoinColumn({ name: 'POSITION', referencedColumnName: 'SPOSCODE' })
  pposition: Pposition;
}
