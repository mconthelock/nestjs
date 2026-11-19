import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { STY_FILES } from './STY_FILES.entity';

@Entity({ name: 'STY_TYPE', schema: 'GPREPORT' })
export class STY_TYPE {
    @PrimaryGeneratedColumn()
    TYPE_ID: number;

    @Column()
    TYPE_MASTER: string;

    @Column()
    TYPE_CODE: string;

    @Column({ type: 'decimal' })
    TYPE_NO: number;

    @Column()
    TYPE_NAME: string;

    @Column()
    TYPE_DETAIL: string;

    @Column()
    TYPE_STATUS: number;

    @OneToMany(() => STY_FILES, (file) => file.TYPE)
    FILES?: STY_FILES[];
}
