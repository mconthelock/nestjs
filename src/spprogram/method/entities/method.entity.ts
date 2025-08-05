import { Column, Entity, PrimaryColumn, JoinColumn, OneToMany } from 'typeorm';
import { Inquiry } from '../../inquiry/entities/inquiry.entity';

@Entity('SP_METHOD')
export class Method {
  @PrimaryColumn()
  METHOD_ID: number;

  @Column()
  METHOD_DESC: string;

  @Column()
  METHOD_STATUS: number;

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  // @ManyToOne(() => User, user => user.posts)
  // user: User;

  @OneToMany(() => Inquiry, (inq) => inq.method)
  @JoinColumn({
    name: 'METHOD_ID',
    referencedColumnName: 'INQ_DELIVERY_METHOD',
  })
  inqs: Inquiry;
}
