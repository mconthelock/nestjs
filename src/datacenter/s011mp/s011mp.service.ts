import { Injectable } from '@nestjs/common';
import { S011mpRepository } from './s011mp.repository';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { S011MP } from 'src/common/Entities/datacenter/table/S011MP.entity';

@Injectable()
export class S011mpService {
    constructor(private readonly repo: S011mpRepository) {}
    async findAll() {
        try {
            const res = await this.repo.findAll();
            const length = res.length;
            if (length === 0) {
                return {
                    status: false,
                    message: 'Search S011MP Failed: No data found',
                    data: [],
                };
            }
            return {
                status: true,
                message: `Search S011MP data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error('Search S011MP Error: ' + error.message);
        }
    }

    async findOne(S11M01: string, S11M02: string) {
        try {
            const res = await this.repo.findOne(S11M01, S11M02);
            if (res == null) {
                return {
                    status: false,
                    message: `Search S011MP by id ${S11M01}, ${S11M02} Failed: No data found`,
                };
            }
            return {
                status: true,
                message: `Search S011MP by id ${S11M01}, ${S11M02} data found 1 record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Search S011MP by id ${S11M01}, ${S11M02} Error: ` +
                    error.message,
            );
        }
    }

    async search(dto: FiltersDto) {
        try {
            const res = await this.repo.search(dto);
            const length = res.length;
            if (length === 0) {
                return {
                    status: false,
                    message: 'Search S011MP Failed: No data found',
                    data: [],
                };
            }
            return {
                status: true,
                message: `Search S011MP data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error('Search S011MP Error: ' + error.message);
        }
    }

    async findPacking(order: string, item?: string) {
        try {
            let res: S011MP[];
            if (item) {
                res = await this.repo.findOrderItems(order, item);
            } else {
                res = await this.repo.findByOrder(order);
            }
            if (res.length === 0) {
                return {
                    status: false,
                    message: `No packing data found for order: ${order}`,
                    data: [],
                };
            }
            const data = await this.mappingLevel(res);
            return {
                status: true,
                message: `Found ${data.length} packing data(s) for order: ${order}`,
                data: data,
            };
        } catch (error) {
            throw error;
        }
    }

    async findPackingDiff(order: string) {
        try {
            const res = await this.repo.findQtyDiff(order);
            if (res.length === 0) {
                return {
                    status: false,
                    message: `No quantity differences found for order: ${order}`,
                    data: [],
                };
            }
            const data = await this.mappingLevel(res);
            return {
                status: true,
                message: `Found ${data.length} quantity difference(s) for order: ${order}`,
                data: data,
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-09-04
     * @description Map level drawing data
     * @param data
     * @returns
     */
    async mappingLevel(data: S011MP[]) {
        const mains = data.filter((item) => item.S11M07 == '0');
        const levels = data.filter((item) => item.S11M07 == '1');

        return mains
            .map((main) => {
                const drawingGroup = this.getGroup(main.S11M06);
                const groupLevels = levels.filter(
                    (l) => this.getGroup(l.S11M06) === drawingGroup,
                );

                const max: number = main.S11M09;
                const minRes: number = groupLevels.reduce(
                    (acc, item) => Math.min(acc, item.S11M09),
                    Infinity,
                );
                const min = minRes == Infinity ? max : minRes;

                if (max - min == 0) {
                    return [
                        {
                            ...main,
                            S11M09: max,
                            LEVEL: groupLevels
                                .map((l) => this.getLevel(l.S11M06))
                                .join(''),
                            DRAWING_GROUP: drawingGroup,
                            MAXQTY: max,
                        },
                    ];
                }

                // สร้าง 2 รายการ: ส่วนต่าง (diff) และค่าต่ำสุด (min)
                return [max - min, min].map((value) => ({
                    ...main,
                    S11M09: value,
                    // ตัด 3 ตัวท้ายของ S11M06 (เฉพาะที่ S11M09 เท่ากับ max หรือ value) มาต่อกัน
                    LEVEL: groupLevels
                        .filter((l) => l.S11M09 == max || l.S11M09 == value)
                        .map((l) => this.getLevel(l.S11M06))
                        .join(''),
                    DRAWING_GROUP: drawingGroup,
                    MAXQTY: max,
                }));
            })
            .flat(2);
    }

    getLevel(value: string): string {
        if (value) {
            value = value.toString();
            value = value.replace(/\s+/g, '');
            const level = value.slice(-3);
            if (level.match(/^L\d{2}$/)) {
                return level;
            }
            return null;
        }
        return value;
    }

    private getGroup(value: string): string {
        if (value) {
            value = value.toString();
            value = value.replace(/\s+/g, '');
            value = value.substring(0, 12);
        }
        return value;
    }
    // ใช้อันนี้เป็นหลัก
    // async mappingLevel(data: s011mpGroup[]) {
    //     const mains = data.filter((item) => item.S11M07 == '0');
    //     const levels = data.filter((item) => item.S11M07 == '1');

    //     return mains.map((main) => {
    //         // level ที่อยู่ใน DRAWING_GROUP เดียวกับ main
    //         const groupLevels = levels.filter(
    //             (l) => l.DRAWING_GROUP === main.DRAWING_GROUP,
    //         );

    //         const max = main.S11M09;
    //         const min = groupLevels.reduce(
    //             (acc, item) => Math.min(acc, item.S11M09),
    //             Infinity,
    //         );

    //         // สร้าง 2 รายการ: ส่วนต่าง (diff) และค่าต่ำสุด (min)
    //         return [max - min, min].map((value) => ({
    //             ...main,
    //             S11M09: value,
    //             // ตัด 3 ตัวท้ายของ S11M06 (เฉพาะที่ S11M09 เท่ากับ max หรือ value) มาต่อกัน
    //             level: groupLevels
    //                 .filter((l) => l.S11M09 == max || l.S11M09 == value)
    //                 .map((l) => l.S11M06.toString().slice(-3))
    //                 .join(''),
    //         }));
    //     });
    // }

    // แบบแรกที่ยังไม่ทำให้สั้น
    // async mappingLevel(data: s011mpGroup[]) {
    //     const main: s011mpGroup[] = data.filter((item) => item.S11M07 == '0');
    //     const level: s011mpGroup[] = data.filter((item) => item.S11M07 == '1');

    //     // รวม level เข้าใน main ที่ DRAWING_GROUP เดียวกัน
    //     const grouped = main.map((m) => {
    //         const data = level.filter(
    //             (l) => l.DRAWING_GROUP === m.DRAWING_GROUP,
    //         );
    //         return {
    //             ...m,
    //             level: data,
    //         };
    //     });

    //     const mapped = grouped.map((g) => {
    //         const max: number = g.S11M09;
    //         const min: number = g.level.reduce(
    //             (acc, item) => Math.min(acc, item.S11M09),
    //             Infinity,
    //         );
    //         const diff: number = max - min;
    //         const arr: number[] = [diff, min];
    //         // ตัด 3 ตัวท้ายของ S11M06 นำมาต่อกันโดย เอาค่าที่เท่ากับ value และ max
    //         const newData = [];
    //         for (const value of arr) {
    //             const level: string = g.level
    //                 .filter(
    //                     (item) => item.S11M09 == max || item.S11M09 == value,
    //                 )
    //                 .map((item) => {
    //                     const s11m06 = item.S11M06.toString();
    //                     return s11m06.slice(-3);
    //                 })
    //                 .join('');
    //             newData.push({ ...g, S11M09: value, level });
    //         }
    //         return newData;
    //     });
    //     return mapped;
    // }
}
