import { Entity, Column, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name: 'SHORT_PUR_TRACKING',
    schema: 'WORKLOAD',})
export class SHORT_PUR_TRACKING {   
@PrimaryColumn()
PONO: number;

@PrimaryColumn()
PPROD: string;

@PrimaryColumn()
PLINE: number;

@PrimaryColumn()
PORD: number;

@Column({ type: 'date', nullable: true }) // ระบุ type เป็น date ถ้าเก็บแค่วันที่
ETD?: Date;

@Column({ type: 'date', nullable: true }) // ระบุ type เป็น date ถ้าเก็บแค่วันที่
ETA?: Date;

@Column({ nullable: true })
SHIP_MODE?: string;

@Column({ type: 'date', nullable: true }) // ระบุ type เป็น date ถ้าเก็บแค่วันที่
ARV_AMEC?: Date;

@Column({ nullable: true })
ARV_QTY?: number;

@Column({ nullable: true })
INV_NO?: string;

@Column({ nullable: true })
COMMENT_PUR?: string;

@Column({ nullable: true })
NEXT_REPLY?: string;

@Column({ nullable: true })
CAUSE_OF?: string;

@Column({ nullable: true })
REMARK?: string;
// --- ให้ TypeORM จัดการเวลาแก้ไขให้โดยอัตโนมัติ ---
@UpdateDateColumn({ type: 'timestamp', nullable: true })
UPDATE_DATE?: Date;

@Column({ nullable: true })
USER_UPDATE?: string;
}