import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('AMECCALENDAR_ACTIVITY')
export class AmeccalendarActivity {
    @PrimaryGeneratedColumn()
    ID: number;

    @Column()
    WORKID: number;

    @Column()
    WORKYEAR: number;

    @Column()
    CATEGORY: string;

    @Column()
    TITLE: string;

    @Column({ nullable: true })
    DESCRIPTION: string | null;

    @Column({ nullable: true })
    CREATE_BY: string | null;

    @Column()
    CREATE_DATE: Date;

    @Column({ nullable: true })
    UPDATE_BY: string | null;

    @Column()
    UPDATE_DATE: Date;
}
