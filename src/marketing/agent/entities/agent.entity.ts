import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Mscountry } from '../../mscountry/entities/mscountry.entity';

@Entity('AGENT_COUNTRY')
export class Agent {
  @PrimaryColumn()
  CTCODE: string;

  @PrimaryColumn()
  AGENT: string;

  @Column()
  STATUS: string;

  @ManyToOne(() => Mscountry, (country) => country.CTCODE)
  @JoinColumn([{ name: 'CTCODE', referencedColumnName: 'CTCODE' }])
  country: Mscountry;
  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  // @ManyToOne(() => User, user => user.posts)
  // user: User;
}
