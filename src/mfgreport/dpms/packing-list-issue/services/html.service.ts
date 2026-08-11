import { Injectable } from '@nestjs/common';

import { ordinalIndicator } from 'src/common/utils/format.utils';

import {
    IsetHeaderParams,
    IsetTableParams,
    IgenerateParams,
} from '../interface/html.interface';

@Injectable()
export class HtmlService {
    async generate({
        revData,
        shippingMark,
        lists,
        plList,
        issueDate,
        combine,
        changeBlock,
    }: IgenerateParams): Promise<string> {
        const shippingMarkHtml = this.setShippingMark(shippingMark);

        const issueType = revData.ISSUE_TYPE;
        // กำหนดหัวกระดาษของ PL
        let headerTypePl = issueType.VDESCRIPTION;
        switch (issueType.VCODE) {
            case 'CB':
                headerTypePl = 'COMPLETE';
                break;
            case 'SP':
                headerTypePl = 'PARTIAL';
        }

        const headerHtml = this.setHeader({
            VSHOPORDERNO: revData.VSHOPORDERNO,
            VSUBJECT: revData.VSUBJECT,
            VNAMEOFBLDG: revData.VNAMEOFBLDG,
            VSOLDTO: revData.VSOLDTO,
            type: headerTypePl,
            shippingMark: shippingMarkHtml,
            totalNet: plList.totalNet,
            totalGross: plList.totalGross,
            totalDimention: plList.totalDimention,
            totalPackages: plList.totalPackages.toString(),
            packingDate: issueDate,
            round: revData.NROUND
                ? ordinalIndicator(revData.NROUND, true)
                : null,
        });

        const tableHtml = this.setTable({
            list: plList.data,
            totalNet: plList.totalNet,
            totalGross: plList.totalGross,
            totalDimention: plList.totalDimention,
            totalPackList: plList.totalPackList,
            typeCode: issueType.VCODE,
        });

        let filterCombine = combine;
        let filterChangeBlock = changeBlock;
        if (['DF', 'PT', 'SP'].includes(issueType.VCODE)) {
            const items = new Set(
                lists.flatMap((e) => e.DETAILS.map((d) => d.VITEM)),
            );
            if (combine && combine.length > 0) {
                filterCombine = combine.filter((c) => {
                    return c.S20K02 && items.has(c.S20K02.trim());
                });
            }

            if (changeBlock && changeBlock.length > 0) {
                filterChangeBlock = changeBlock.filter((c) => {
                    return c.S49K02 && items.has(c.S49K02.trim());
                });
            }
        }
        const remarkHtml = this.setRemark(filterCombine, filterChangeBlock);
        return headerHtml + tableHtml + remarkHtml;
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen (24008)
     * @since 2026-06-04
     * Set header information for the packing list.
     *
     * @param {IsetHeaderParams} header
     * @returns {string} HTML string for the header section of the packing list
     * @example
     * const header = {
     *      SHOP_ORDER_NO: "E-OS-45101-3",
     *      SUBJECT: "ELEVATOR (05B)GQXL21",
     *      NAME_OF_BLDG: "VN26215VMC-TNAL XD TRUONG",
     *      SOLD_TO: "VN26215VMC-TNAL XD TRUONG",
     *      type: "Draft",
     *      shippingMark: "<span>LINE1</span><span>LINE2</span><span>LINE3</span>"
     * };
     * const headerHtml = setHeader(header);
     */
    private setHeader({
        VSHOPORDERNO,
        VSUBJECT,
        VNAMEOFBLDG,
        VSOLDTO,
        type,
        shippingMark,
        totalNet,
        totalGross,
        totalDimention,
        totalPackages,
        packingDate,
        round,
    }: IsetHeaderParams): string {
        return `
        <div class="flex flex-col gap-5" id="pl-header">
            <span class="text-lg font-bold text-center" id="pl-company-name">MITSUBISHI ELEVATOR ASIA CO., LTD.</span>
            <div class="grid grid-cols-3 font-bold text-lg text-center" id="pl-title">
                <span class="flex justify-center gap-3" id="pl-type">
                    <span>${type.toUpperCase()}</span>
                    <span>${round ?? ''}</span>
                </span>
                <span>PACKING LIST</span>
                <span>SHIPPING MARK</span>
            </div>
            <div class="grid grid-cols-[65%_35%] gap-4" id="pl-info">
                <div class="grid grid-cols-[15%_80%] gap-5 pt-15">
                    <span>SHOP ORDER NO</span>
                    <span>${VSHOPORDERNO}</span>
                    <span>SUBJECT</span>
                    <span>${VSUBJECT}</span>
                    <span>NAME OF BLDG</span>
                    <span>${VNAMEOFBLDG}</span>
                    <span>SOLD TO</span>
                    <span>${VSOLDTO}</span>
                </div>
                <div class="flex justify-end" id="shipping-mark">
                    <div class="flex flex-col text-center pr-[20%] w-full">
                        ${shippingMark}
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-[auto_1fr_auto_1fr_auto_1fr] gap-x-6 gap-y-4 items-center" id="pl-summary"> 
                <span>TOTAL NETWEIGHT</span> 
                <span><span id="total-netweight">${totalNet ?? ''}</span> kgs</span> 

                <span>GROSS WEIGHT</span> 
                <span><span id="gross-weight">${totalGross ?? ''}</span> kgs</span> 

                <span></span> <span></span>

                <span>TOTAL CUBIC-METER</span>
                <span><span id="total-cbm">${totalDimention ?? ''}</span> M3</span>

                <span>PACKING DATE</span>
                <span id="packing-date">${packingDate}</span>

                <span>TOTAL PACKAGES</span>
                <span id="total-packages">${totalPackages ?? ''}</span>
            </div>
        </div>`;
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen (24008)
     * @since 2026-06-04
     * Set shipping mark by splitting the input string with '|' and wrapping each line in a <span> element. If the input string does not contain '|', it returns the original string.
     * @param {string} shippingMark e.g. LINE1|LINE2
     * @returns {string} HTML string with each line of the shipping mark wrapped in a <span> element. If the shipping mark does not contain '|', it returns the original string.
     * @example
     * const shippingMark = "LINE1|LINE2|LINE3";
     * const formattedMark = setShippingMark(shippingMark);
     * formattedMark will be "<span>LINE1</span><span>LINE2</span><span>LINE3</span>"
     */
    private setShippingMark(shippingMark: string): string {
        if (!shippingMark) return '';
        let mark = shippingMark;
        if (shippingMark.includes('|')) {
            mark = shippingMark
                .split('|')
                .map((line) => `<span>${line}</span>`)
                .join('');
        }
        return mark;
    }

    /**
     * author Sutthipong Tangmongkhoncharoen (24008)
     * since 2026-06-11
     * ตั้งค่าข้อมูล remark ท้ายกระดาษ
     * @param {S020KP[]} combine ข้อมูลการ combine packing list โดยมี key คือ S20K01, S20K02, S20K03
     * @param {S049KP[]} changeBlock ข้อมูลการ transfer item โดยมี key คือ S49K02, S49K03, S49K04
     * @returns {string} HTML string สำหรับแสดง remark ท้ายกระดาษ โดยจะแสดงข้อมูล combine packing list และ transfer item ตามที่ได้รับมา
     */
    private setRemark(combine, changeBlock) {
        let remark = '<div class="mt-5" id="remark">';
        if (combine) {
            remark += combine
                .map(
                    (
                        c,
                    ) => `<div class="grid grid-cols-[110px_130px_50px_40px_110px_150px_1fr] gap-2" id="combine-block">
            <span>REMARK:</span>
            <span>PACKING NO.</span>
            <span>${c.S20K02}</span>
            <span>OF</span> 
            <span>${c.S20K01}</span> 
            <span>COMBINE WITH</span> 
            <span>${c.S20K03}</span>
        </div>`,
                )
                .join('');
        }
        if (changeBlock) {
            remark += changeBlock
                .map(
                    (
                        c,
                    ) => `<div class="grid grid-cols-[110px_90px_50px_50px_60px_30px_30px_1fr] gap-2" id="change-block">
            <span>REMARK:</span>
            <span>TRANSFER</span>
            <span>ITEM</span>
            <span>${c.S49K02}</span>
            <span>FROM</span>
            <span>${c.S49K03}</span>
            <span>TO</span>
            <span>${c.S49K04}</span>
        </div>`,
                )
                .join('');
        }
        return remark + '</div>';
    }

    private setTable({
        list,
        checkbox,
        totalPackList,
        totalNet,
        totalGross,
        totalDimention,
        typeCode,
        revise,
        docType,
    }: IsetTableParams): string {
        return `
        ${
            checkbox &&
            !revise &&
            (docType.includes('PT') ||
                docType.includes('SP') ||
                typeCode === 'DF')
                ? `
        <label class="btn btn-primary mt-5" for="select-all">
            <input type="checkbox" id="select-all" class="checkbox bg-white">
            <span>Select All</span>
        </label>
            `
                : ``
        }

        
        <table class="table border mt-5 w-full">
            <colgroup>
                <col style="width: 5%" />
                <col style="width: 20%" />
                <col style="width: 30%" />
                <col style="width: 5%" />
                <col style="width: 10%" />
                <col style="width: 10%" />
                <col style="width: 20%" />
            </colgroup>
            <thead class="sticky top-0 bg-primary text-white z-10">
                <tr>
                    <th class="text-center" rowspan="2">SEQ</th>
                    <th class="text-center" rowspan="2">CASE</th>
                    <th class="text-center" rowspan="2">DESCRIPTION</th>
                    <th class="text-center" rowspan="2">QTY</th>
                    <th class="text-center" colspan="2">WEIGHT(Kgs)</th>
                    <th class="text-center">DIMENSION(cm)</th>
                </tr>
                <tr>
                    <th class="text-center">NET</th>
                    <th class="text-center">GROSS</th>
                    <th class="text-center">VOLUME (m³)</th>
                </tr>
            </thead>
            <tbody>
                ${list
                    .map((l, i) => {
                        let item = '';
                        return l.DETAILS.map((d, j) => {
                            let html = '';
                            if ((d.VITEM && d.VITEM != item) || j == 0) {
                                html += `<tr>`;
                                for (let k = 1; k < 8; k++) {
                                    html += `<td>&nbsp;</td>`;
                                }
                                html += `</tr>`;
                            }
                            const seq = j == 0 ? i + 1 : '';
                            const itemNo =
                                d.VITEM && item !== d.VITEM ? d.VITEM : '';
                            const drawing = d.VDRAWING ?? '';
                            const drawingL = d.VDRAWINGL ?? '';
                            const partname = d.VPART ? d.VPART.trim() : '';
                            html += `
                                <tr class="${
                                    typeCode == 'DF'
                                        ? ''
                                        : d.NEW_LIST == 'Y'
                                          ? 'bg-green-100'
                                          : checkbox && d.VISSUE_SELECTED == 'Y'
                                            ? 'bg-yellow-100'
                                            : ''
                                }">
                                    <td class="text-right">${
                                        checkbox && j == 0
                                            ? `<div class="flex gap-2">
                                                <input type="checkbox" name="checkbox-case" class="checkbox checkbox-primary req" value="${d.VCASE}" ${d.CHECKED == 'Y' ? 'checked' : ''} />
                                                <span>${seq}</span>
                                            </div>`
                                            : seq
                                    }
                                    </td>
                                    <td>${d.CASE ?? ''}</td>
                                    <td>
                                        <div class="grid grid-cols-[100px_250px_180px] gap-2 description">
                                            <span>${
                                                checkbox &&
                                                item !== d.VITEM &&
                                                d.VITEM
                                                    ? `<div class="flex gap-2">
                                                        <input type="checkbox" name="checkbox-item" class="checkbox checkbox-primary req" value="${d.VITEM}" d-case="${d.VCASE}" ${d.CHECKED == 'Y' ? 'checked' : ''} />
                                                        <span>${itemNo}</span>
                                                    </div>`
                                                    : itemNo
                                            }
                                            </span>
                                            <span>${
                                                checkbox && drawing
                                                    ? `<div class="flex gap-2">
                                                        <input type="checkbox" name="checkbox-drawing" class="checkbox checkbox-primary req" value="${drawing}" d-case="${d.VCASE}" d-item="${d.VITEM}" ${d.CHECKED == 'Y' ? 'checked' : ''} />
                                                        <span>${partname}</span>
                                                    </div>`
                                                    : partname
                                            } 
                                            </span>
                                            <span class="break-words drawing flex flex-col">
                                                <span>${drawing}</span>
                                                <span>${drawingL}</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td class="text-center">${d.NQTY ?? ''}</td>
                                    <td class="text-center ${d.NET ? 'edit' : ''}" type="net" caseno="${d.VCASE ?? ''}">${d.NET ?? ''}</td>
                                    <td class="text-center ${d.GROSS ? 'edit' : ''}" type="gross" caseno="${d.VCASE ?? ''}">${d.GROSS ?? ''}</td>
                                    <td class="text-center ${d.DIMENSION && d.DIMENSION.includes('x') ? 'edit' : ''}" type="dimension" caseno="${d.VCASE ?? ''}">${d.DIMENSION ?? ''}</td>
                                </tr>`;
                            item = d.VITEM;
                            return html;
                        }).join('');
                    })
                    .join('')}
                ${Object.entries(totalPackList)
                    .map(([packStyle, count], index) => {
                        if (index == 0) {
                            return `<tr>
                            <td></td>
                            <td>${packStyle}</td>
                            <td>
                                <div class="grid grid-cols-[80px_250px] gap-2  gap-2 description">
                                    <span>${count}</span>
                                    <span>PACKAGES</span>
                                </div>
                            </td>
                            <td></td>
                            <td class="text-center">${totalNet ?? ''}</td>
                            <td class="text-center">${totalGross ?? ''}</td>
                            <td class="text-center">${totalDimention ?? ''}</td>
                        </tr>`;
                        }
                        return `<tr>
                        <td></td>
                        <td></td>
                        <td>
                            <div class="grid grid-cols-[80px_250px] gap-2  gap-2 description">
                            <span>${count}</span>
                            <span>${packStyle}</span>
                            </div>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>`;
                    })
                    .join('')}
            </tbody>
        </table>
    `;
    }
}
