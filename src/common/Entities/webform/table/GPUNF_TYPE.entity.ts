import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'GPUNF_TYPE', schema: 'WEBFORM' })
export class GPUNF_TYPE {
    @PrimaryColumn()
    RT_ID: number;

    @Column()
    RT_DETAIL: string;

    @Column()
    RT_STATUS: number;
}
