import {
    AfterLoad,
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { STY_CHEMICAL_SECTION } from './STY_CHEMICAL_SECTION.entity';
import { formatDate } from 'src/common/utils/dayjs.utils';
import { STY_TYPE } from './STY_TYPE.entity';
import { STY_FILES } from './STY_FILES.entity';

@Entity({ name: 'STY_CHEMICAL', schema: 'GPREPORT' })
export class STY_CHEMICAL {
    @PrimaryGeneratedColumn()
    AMEC_SDS_ID: number;

    @Column()
    RECEIVED_SDS_DATE: Date;

    @Column()
    EFFECTIVE_DATE: Date;

    @Column()
    PRODUCT_CODE: string;

    @Column()
    CHEMICAL_NAME: string;

    @Column()
    VENDOR: string;

    @Column()
    PUR_INCHARGE: string;

    @Column()
    UN_CLASS: number;

    @Column()
    REV: string;

    @Column()
    STATUS: number;

    @Column()
    USER_CREATE: string;

    @Column()
    CREATE_DATE: Date;

    @Column()
    USER_UPDATE: string;

    @Column()
    UPDATE_DATE: Date;

    SDS_DATE?: string;
    EFF_DATE?: string;

    @AfterLoad()
    formatDates() {
        if (this.RECEIVED_SDS_DATE) {
            this.SDS_DATE = formatDate(this.RECEIVED_SDS_DATE, 'DD-MMM-YY');
        }
        if (this.EFFECTIVE_DATE) {
            this.EFF_DATE = formatDate(this.EFFECTIVE_DATE, 'DD-MMM-YY');
        }
    }

    @OneToMany(() => STY_CHEMICAL_SECTION, (s) => s.MASTER)
    SECTIONS: STY_CHEMICAL_SECTION[];

    @OneToOne(() => STY_TYPE)
    @JoinColumn({ name: 'UN_CLASS', referencedColumnName: 'TYPE_ID' })
    CLASS: STY_TYPE;

    // ความสัมพันธ์กับไฟล์ที่เกี่ยวข้องกับสารเคมี
    @ManyToMany(() => STY_FILES)
    @JoinTable({
        name: 'STY_CHEMICAL_FILES',
        joinColumn: {
            name: 'AMEC_SDS_ID',
            referencedColumnName: 'AMEC_SDS_ID',
        },
        inverseJoinColumn: {
            name: 'FILE_ID',
            referencedColumnName: 'FILE_ID',
        },
    })
    FILES?: STY_FILES[];

    // Property แยกตามประเภทที่ต้องการส่งให้ Frontend
    ORIGINAL_SDS?: STY_FILES; // หรือ STY_FILES | null ถ้ามีไฟล์เดียว
    TRANSLATE_SDS?: STY_FILES; // หรือ STY_FILES | null ถ้ามีไฟล์เดียว
    STICKER_SDS?: STY_FILES;
    IMAGES?: STY_FILES[];
    LAYOUT?: STY_FILES;

    @AfterLoad()
    groupFilesByType() {
        if (!this.FILES) return;

        // กรองเฉพาะไฟล์ที่ STATUS = 1 (Enable) และแยกตาม TYPE_CODE
        const activeFiles = this.FILES.filter((f) => f.STATUS === 1);

        this.ORIGINAL_SDS = activeFiles.find(
            (f) => f.TYPE_CODE === 'CHM_F_ORI',
        ) ?? null;
        this.TRANSLATE_SDS = activeFiles.find(
            (f) => f.TYPE_CODE === 'CHM_F_TRANS',
        ) ?? null;
        this.STICKER_SDS = activeFiles.find(
            (f) => f.TYPE_CODE === 'CHM_F_STICKER',
        ) ?? null;
        this.IMAGES = activeFiles.filter((f) => f.TYPE_CODE === 'CHM_IMAGE');
        this.LAYOUT = activeFiles.find((f) => f.TYPE_CODE === 'CHM_F_LAYOUT') ?? null;

        // ลบตัวรวมทิ้งเพื่อไม่ให้ JSON ซ้ำซ้อน
        delete this.FILES;
    }
}
