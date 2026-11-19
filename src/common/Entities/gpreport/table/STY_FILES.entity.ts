import {
    AfterLoad,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { STY_TYPE } from './STY_TYPE.entity';

@Entity({ name: 'STY_FILES', schema: 'GPREPORT' })
export class STY_FILES {
    @PrimaryGeneratedColumn()
    FILE_ID: number;

    @Column()
    FILE_ONAME: string;

    @Column()
    FILE_FNAME: string;

    @Column()
    TYPE_ID: number;

    @Column()
    FILE_USERCREATE: string;

    @Column()
    FILE_DATECREATE?: Date;

    @Column()
    FILE_USERUPDATE?: string;

    @UpdateDateColumn()
    FILE_DATEUPDATE?: Date;

    @Column()
    FILE_PATH: string;

    @Column()
    STATUS?: number;

    @ManyToOne(() => STY_TYPE, { eager: true }) // ใส่ eager: true ถ้าอยากให้ดึง type มาด้วยทุกครั้งอัตโนมัติ เฉพาะ .find, .findOne queryBuilder ต้องเรียก join เอง
    @JoinColumn({ name: 'TYPE_ID' })
    TYPE?: STY_TYPE;

    // Property สำหรับส่งออก JSON แบบแบนๆ
    TYPE_CODE?: string;
    TYPE_NAME?: string;

    @AfterLoad()
    flattenType() {
        console.log('Flattening type for STY_FILES:', this.TYPE);
        if (this.TYPE) {
            this.TYPE_CODE = this.TYPE.TYPE_CODE;
            this.TYPE_NAME = this.TYPE.TYPE_NAME;
            delete this.TYPE; // ลบ nested object ทิ้งก่อนส่งออกไปเป็น JSON
        }
    }
}
