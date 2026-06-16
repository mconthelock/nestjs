import { Entity, PrimaryColumn , Column, ManyToOne ,JoinColumn } from 'typeorm';
import { VORGMST } from '../views/VORGMST.entity';
import { PPOSITION } from '../../amec/table/PPOSITION.entity';


@Entity({ name: 'FXA_LOCMST', schema: 'WEBFORM' })
export class FXA_LOCMST {
    @PrimaryColumn()
    LOCCODE: string;

    @Column()
    LOCNAME: string;

    @Column()
    VORGNO: string;

    @Column()
    SPOSCODE:string;

// 🌟 เปลี่ยนจาก @OneToOne เป็น @ManyToOne
    @ManyToOne(() => VORGMST)
    @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO' }) // แนะนำให้ใส่ referencedColumnName ของตารางปลายทางกำกับไว้ด้วยเพื่อความชัวร์
    ORG: VORGMST;

    // 🌟 เปลี่ยนจาก @OneToOne เป็น @ManyToOne
    @ManyToOne(() => PPOSITION)
    @JoinColumn({ name: 'SPOSCODE', referencedColumnName: 'SPOSCODE' }) // ⚠️ เช็กให้ดีนะครับว่า PK ของ PPOSITION ชื่อ POSCODE หรือเปล่า ถ้าใช่ ใส่แบบนี้เลยครับ
    POS: PPOSITION;
}
