import { Column, Entity, PrimaryColumn, OneToMany, JoinColumn } from 'typeorm';
import { Agent } from '../../agent/entities/agent.entity';

@Entity('MS_COUNTRY')
export class Mscountry {
  @PrimaryColumn()
  CTCODE: string;

  @Column()
  CTCODE_ISO: string;

  @Column()
  CTCODE_ISO_SUB: string;

  @Column()
  CTNAME: string;

  @Column()
  CTNAME_ISO: string;

  @Column()
  CTSTATUS: string;

  @Column()
  CTAMECCODE: string;

  @Column()
  CCTLID: number;

  @Column()
  EMBG: number;

  @Column()
  SPDES: number;

  @Column()
  NMETRIS: string;

  @Column()
  MKONE: string;

  @Column()
  NEWTON: string;

  @Column()
  WIC: string;

  @Column()
  REGIONID: number;

  @Column()
  POPS: number;

  @OneToMany(() => Agent, (agent) => agent.CTCODE)
  @JoinColumn({ name: 'CTCODE', referencedColumnName: 'CTCODE' })
  agent: Agent;

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  // @ManyToOne(() => User, user => user.posts)
  // user: User;
}
