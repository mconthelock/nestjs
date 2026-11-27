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

    async findPacking({
        order,
        item,
        combine = false,
    }: {
        order: string;
        item?: string;
        combine?: boolean;
    }) {
        try {
            let res: S011MP[];
            if (combine) {
                res = await this.repo.findByOrderCombine(order, item);
            } else if (item) {
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
                res: res,
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
                    (l) =>
                        this.getGroup(l.S11M06) === drawingGroup &&
                        l.S11M04 === main.S11M04 &&
                        l.S11M01 === main.S11M01 &&
                        l.S11M02 === main.S11M02,
                    // (l) => l.S11M04 === main.S11M04,
                );

                // console.log('drawingGroup:', drawingGroup);
                // console.log('groupLevels:', groupLevels);

                const max: number = main.S11M09;
                const minRes: number = groupLevels.reduce(
                    (acc, item) => Math.min(acc, item.S11M09),
                    Infinity,
                );
                const min = minRes == Infinity ? max : minRes;

                const values = [max - min, min];
                const maxLevels = groupLevels.filter((l) => l.S11M09 == max);
                const minLevels = groupLevels.filter((l) => l.S11M09 == min);
                // if (max - min == 0) {
                //     console.log('max:', max);
                //     console.log('min:', min);
                //     console.log('max - min:', max - min);
                //     console.log('maxLevels:', maxLevels);
                //     console.log('minLevels:', minLevels);
                //     console.log('---------------------------');
                // }
                if (max - min == 0) {
                    // console.log('no diff')
                    // console.log('drawingGroup:', drawingGroup);

                    return [
                        {
                            ...main,
                            S11M09: max,
                            LEVEL: groupLevels
                                .sort((a, b) => a.S11M06.localeCompare(b.S11M06))
                                .map((l) => this.getLevel(l.S11M06))
                                .join(''),
                            DRAWING_GROUP: drawingGroup,
                            MAXQTY: max,
                        },
                    ];
                }

                //* กรณี min-level มี 2 ตัว: แยกเป็น 2 rows โดยแต่ละ row เก็บ min-level คนละตัว
                // if (minLevels.length == 2 && max == 2) {
                //     return values.map((value, index) => {
                //         const rowLevels = [...maxLevels, minLevels[index]];
                //         return {
                //             ...main,
                //             S11M09: value,
                //             LEVEL: rowLevels
                //                 .sort((a, b) => a.S11M06.localeCompare(b.S11M06))
                //                 .map((l) => this.getLevel(l.S11M06))
                //                 .join(''),
                //             DRAWING_GROUP: drawingGroup,
                //             MAXQTY: max,
                //         };
                //     });
                // }

                if (max == 2 && minLevels.length > 0) {
                    // console.log('max = 2')
                    // console.log('drawingGroup:', drawingGroup);

                    const minLevelsPerRow = Math.ceil(minLevels.length / values.length);
                    return values.map((value, index) => {
                        const start = index * minLevelsPerRow;
                        const rowLevels = [
                            ...maxLevels,
                            ...minLevels.slice(start, start + minLevelsPerRow),
                        ];
                        return {
                            ...main,
                            S11M09: value,
                            LEVEL: rowLevels
                                .sort((a, b) => a.S11M06.localeCompare(b.S11M06))
                                .map((l) => this.getLevel(l.S11M06))
                                .join(''),
                            DRAWING_GROUP: drawingGroup,
                            MAXQTY: max,
                        };
                    });
                }
                // console.log('drawingGroup:', drawingGroup);

                /** หักตามจำนวนแบบพี่ต้นบอกยังไงก็ผิดอยู่ดีเพราะไม่รู้ว่ามันเป็นของใคร มันจะยาวอัน ส้นอัน
                    ตัวอย่าง
                    "ORDER": "ETA048243",
                    "ITEM": "26201",
                    
                    ได้      L26L42L45L61L62L78L81L85
                            L26L78L81L85
                            S11M06              S11M07  S11M09
                    โดย     BE501A752 G03 L21	0	    2
                            BE501A752 G03 L26	1	    2
                            BE501A752 G03 L45	1	    1
                            BE501A752 G03 L62	1	    1
                            BE501A752 G03 L78	1	    2
                            BE501A752 G03 L81	1	    2
                            BE501A752 G03 L85	1	    2
                            BE501A752 G03 L42	1	    1
                            BE501A752 G03 L61	1	    1
                    ต้องได้
                        L26L45L62L78L81L85
                        L26L42L61L78L81L85
                */
                // const remainingLevels = groupLevels
                //     .map((level) => ({ ...level }))
                //     .sort((a, b) => a.S11M06.localeCompare(b.S11M06));

                // return values.map((value) => {
                //     const selectedLevels = remainingLevels.filter(
                //         (level) => level.S11M09 == max || level.S11M09 == value,
                //     );
                    

                //     const result = {
                //         ...main,
                //         S11M09: value,
                //         // ตัด 3 ตัวท้ายของ S11M06 (เฉพาะที่ S11M09 เท่ากับ max หรือ value) มาต่อกัน
                //         LEVEL: selectedLevels
                //             .map((level) =>
                //                 level.S11M09 == 0 ? '' : this.getLevel(level.S11M06),
                //             )
                //             .join(''),
                //         DRAWING_GROUP: drawingGroup,
                //         MAXQTY: max,
                //     };
                //     selectedLevels.forEach((level) => {
                //         level.S11M09 -= value;
                //     });
                //     return result;
                // });

                // สร้าง 2 รายการ: ส่วนต่าง (diff) และค่าต่ำสุด (min)
                return values.map((value) => ({
                    ...main,
                    S11M09: value,
                    // ตัด 3 ตัวท้ายของ S11M06 (เฉพาะที่ S11M09 เท่ากับ max หรือ value) มาต่อกัน
                    LEVEL: groupLevels
                        .sort((a, b) => a.S11M06.localeCompare(b.S11M06))
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
