import { setRound } from 'src/common/utils/format.utils';
import { ListPLDto } from '../dto/create-packing-list-issue.dto';
import {
    ListForCreateHtml,
    DetailForCreateHtml,
    CreateDataForHTMLResult,
} from '../interface/list-builder.interface';

/**
 * @author Sutthipong Tangmongkhoncharoen (24008)
 * @since 2026-07-22
 * @description แปลงข้อมูลจาก ListPLDto เป็น ListForCreateHtml เพื่อใช้ในการสร้าง HTML
 */
export function setListForHtml(
    lists: ListPLDto[],
    type: 'pdf' | 'excel',
): CreateDataForHTMLResult {
    const list = structuredClone(lists);
    const caseNo = countByCase(list);
    let totalNet: number = 0;
    let totalGross: number = 0;
    let totalDimention: number = 0;
    const totalPackages: number = list.length;
    const totalPackList: { [key: string]: number } = { TOTAL: totalPackages };
    const dataForHtml: ListForCreateHtml[] = [];
    let seq: number = 1;
    for (const l of list) {
        const detailsForHtml: DetailForCreateHtml[] = [];
        const length: number = l.DETAILS.length;
        const dimension: number = calDimension(
            +l.VWIDTH,
            +l.VLENGTH,
            +l.VHEIGHT,
        );
        totalNet += l.NNETWEIGHT ?? 0;
        totalGross += l.NGROSSWEIGHT ?? 0;
        totalDimention += dimension;
        totalPackList[l.VPACKSTYLE] = (totalPackList[l.VPACKSTYLE] || 0) + 1;
        let item = '';
        l.DETAILS.forEach((d, j) => {
            if( d.VITEM && d.VITEM !== item) {
                if (type === 'pdf') {
                    item = d.VITEM.replace(/^(.{3})/, '$1-')
                    d.VITEM = item;
                }else{
                    item = d.VITEM;
                }
            }else{
                if(type === 'excel') {
                    delete d.VITEM;
                }
            }
            if (
                type === 'excel' &&
                d.VDRAWINGL !== undefined &&
                d.VDRAWINGL !== null &&
                d.VDRAWINGL !== ''
            ) {
                d.VDRAWING = `${d.VDRAWING} ${d.VDRAWINGL}`;
            }
            if (j === 0) {
                detailsForHtml.push({
                    ...d,
                    ...(type == 'excel'
                        ? { CASE: d.VCASE }
                        : { CASE: `${d.VCASE} ${caseNo[d.VCASE]}` }),
                    NET: setRound(l.NNETWEIGHT, 1),
                    GROSS: setRound(l.NGROSSWEIGHT, 1),
                    DIMENSION: `${setRound(l.VWIDTH, 0)} x ${setRound(l.VLENGTH, 0)} x ${setRound(l.VHEIGHT, 0)}`,
                    ...(type == 'excel'
                        ? { VOLUME: setRound(dimension, 3) }
                        : {}),
                    SEQ: seq++,
                });
            } else if (j === 1) {
                detailsForHtml.push({
                    ...d,
                    CASE: l.VPACKSTYLE,
                    ...(type == 'pdf'
                        ? { DIMENSION: setRound(dimension, 3) }
                        : {}),
                });
            } else {
                detailsForHtml.push(d);
            }
        });
        if (length === 1) {
            detailsForHtml.push({
                CASE: l.VPACKSTYLE,
                ...(type == 'pdf' ? { DIMENSION: setRound(dimension, 3) } : {}),
            });
        }
        dataForHtml.push({
            ...l,
            DETAILS: detailsForHtml,
        });
    }

    return {
        data: dataForHtml,
        totalNet: setRound(totalNet, 1),
        totalGross: setRound(totalGross, 1),
        totalDimention: setRound(totalDimention, 3),
        totalPackages,
        totalPackList,
    };
}

/**
 * @author Sutthipong Tangmongkhoncharoen (24008)
 * @since 2026-06-04
 * @description คำนวณ dimension ของ case โดยใช้สูตร (width * length * height) / 1000000
 * @param {number} width
 * @param {number} length
 * @param {number} height
 * @returns {number}
 */
function calDimension(width: number, length: number, height: number): number {
    return (width * length * height) / 1000000;
}

/**
 * @author Sutthipong Tangmongkhoncharoen (24008)
 * @since 2026-06-04
 * แปลงข้อมูลจาก DPMS_PACKING_LIST_MAIN เป็น array ของ object ที่มี caseNo และ count โดย count จะอยู่ในรูปแบบ (current/total) ซึ่ง current คือเลขสุดท้ายของ caseNo และ total คือจำนวนที่นับได้จาก case4digit
 * @param {DPMS_PACKING_LIST_MAIN[]} list
 * @return {Object} object ที่มี key เป็น caseNo และ value เป็น count ในรูปแบบ (current/total)
 * @example
 * const list = [
 *      { VCASE: "1234-1" },
 *      { VCASE: "1234-2" },
 *      { VCASE: "5678-1" },
 *      { VCASE: "5678-2" },
 *      { VCASE: "5678-3" },
 * ];
 * const result = countByCase(list);
 * result จะเป็น {
 *      "1234-1": "(1/2)",
 *      "1234-2": "(2/2)",
 *      "5678-1": "(1/3)",
 *      "5678-2": "(2/3)",
 *      "5678-3": "(3/3)",
 * }
 */
function countByCase(list: ListPLDto[]): { [key: string]: string } {
    const totalByPrefix: { [key: string]: number } = {};
    const runningByPrefix: { [key: string]: number } = {};

    // นับจำนวนแต่ละ prefix (4 ตัวแรกของ VCASE)
    list.forEach(({ VCASE }) => {
        const prefix: string = VCASE.slice(0, 4);
        totalByPrefix[prefix] = (totalByPrefix[prefix] || 0) + 1;
    });
    // สร้าง object ที่มี key เป็น VCASE และ value เป็น (current/total)
    return list.reduce((acc, { VCASE }) => {
        const prefix: string = VCASE.slice(0, 4);
        runningByPrefix[prefix] = (runningByPrefix[prefix] || 0) + 1;

        acc[VCASE] = `(${runningByPrefix[prefix]}/${totalByPrefix[prefix]})`;
        return acc;
    }, {});
}
