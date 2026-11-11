export interface TaxFieldItem {
    label: string;
    key: string;
    unit?: string;
    class?: string;
    type?: string;
    min?: number;
    max?: number;
    maxlength?: number;
    placeholder?: string;
    label_width?: string;
}

export interface TaxGroupDetail {
    title?: string;
    grid?: string;
    fields?: TaxFieldItem[];
}

export interface TaxItemConfig {
    id: string;
    title: string;
    rate: string | string[];
    link?: string;
    group: string;
    input_type?: string;
    fixed_value?: string;
    unit?: string;
    placeholder?: string;
    details?: TaxGroupDetail[];
}

export const TAX_MASTER_ITEMS: TaxItemConfig[] = [
    {
        id: 'TAX1',
        title: '1. ค่าลดหย่อนส่วนตัว',
        rate: '60,000 บาท',
        group: 'รายการลดหย่อนภาษีเงินได้',
        input_type: 'fixed',
        fixed_value: '60,000.00',
    },
    {
        id: 'TAX2',
        title: '2. ค่าลดหย่อนคู่สมรส',
        rate: '60,000 บาท (กรณี จดทะเบียนและคู่สมรสไม่มีเงินได้)',
        group: 'รายการลดหย่อนภาษีเงินได้',
        details: [
            {
                title: '',
                grid: 'space-y-1.5',
                fields: [
                    {
                        label: 'ชื่อ-นามสกุลคู่สมรส:',
                        key: 'FAMSNA',
                        type: 'text',
                        placeholder: 'ชื่อ-นามสกุลคู่สมรส',
                        class: 'w-full max-w-xs text-xs',
                        label_width: 'min-w-[125px]',
                    },
                    {
                        label: 'เลขบัตรประชาชน:',
                        key: 'spouse_id',
                        type: 'text',
                        maxlength: 17,
                        placeholder: 'เลขประจำตัวประชาชน 13 หลัก',
                        class: 'w-full max-w-xs font-mono text-xs',
                        label_width: 'min-w-[125px]',
                    },
                ],
            },
        ],
    },
    {
        id: 'FAMCHI',
        title: '3. ค่าลดหย่อนบุตร',
        rate: [
            'บุตรคนละ 30,000 บาท (สำหรับบุตรคนแรก / บุตรที่เกิดก่อน พ.ศ.2561)',
            'บุตรคนละ 60,000 บาท (สำหรับบุตรคนที่ 2 เป็นต้นไป ที่เกิดในหรือหลัง พ.ศ. 2561 ยกเว้นบุตรบุญธรรม)',
        ],
        group: 'รายการลดหย่อนภาษีเงินได้',
        details: [
            {
                title: 'บุตรที่เกิดก่อน พ.ศ. 2561',
                grid: 'grid grid-cols-1 sm:grid-cols-2 gap-2',
                fields: [
                    {
                        label: 'บุตรเรียน:',
                        key: 'FAMIED',
                        type: 'number',
                        min: 0,
                        max: 20,
                        unit: 'คน',
                        class: 'w-20 text-center font-mono',
                        label_width: 'min-w-[65px]',
                    },
                    {
                        label: 'บุตรไม่เรียน:',
                        key: 'FAMNED',
                        type: 'number',
                        min: 0,
                        max: 20,
                        unit: 'คน',
                        class: 'w-20 text-center font-mono',
                        label_width: 'min-w-[75px]',
                    },
                ],
            },
            {
                title: 'สำหรับบุตรคนที่ 2 เป็นต้นไป (เกิดในหรือหลัง 2561)',
                grid: 'grid grid-cols-1 sm:grid-cols-2 gap-2',
                fields: [
                    {
                        label: 'บุตรเรียน:',
                        key: 'FAMIED1',
                        type: 'number',
                        min: 0,
                        max: 20,
                        unit: 'คน',
                        class: 'w-20 text-center font-mono',
                        label_width: 'min-w-[65px]',
                    },
                    {
                        label: 'บุตรไม่เรียน:',
                        key: 'FAMNED1',
                        type: 'number',
                        min: 0,
                        max: 20,
                        unit: 'คน',
                        class: 'w-20 text-center font-mono',
                        label_width: 'min-w-[75px]',
                    },
                ],
            },
        ],
    },
    {
        id: 'tax4',
        title: '4. ค่าลดหย่อนบิดา/มารดา(บิดา/มารดาของตนเองและคู่สมรส)',
        rate: [
            'คนละ 30,000 บาท',
            'บิดา-มารดา มีอายุตั้งแต่ 60 ปีขึ้นไป',
            'มีเงินได้ทั้งปีไม่เกิน 30,000 บาท ต่อคน (กรณีรวมคำนวณภาษีหรือคู่สมรสไม่มีเงินได้)',
        ],
        group: 'รายการลดหย่อนภาษีเงินได้',
        details: [
            {
                fields: [
                    {
                        label: 'บิดาตนเอง:',
                        key: 'TAXEMF',
                        type: 'text',
                        maxlength: 17,
                        placeholder: 'เลขประจำตัวประชาชน 13 หลัก',
                        class: 'w-full max-w-xs font-mono text-xs cardid',
                        label_width: 'min-w-[85px]',
                    },
                    {
                        label: 'มารดาตนเอง:',
                        key: 'TAXEMM',
                        type: 'text',
                        maxlength: 17,
                        placeholder: 'เลขประจำตัวประชาชน 13 หลัก',
                        class: 'w-full max-w-xs font-mono text-xs cardid',
                        label_width: 'min-w-[85px]',
                    },
                    {
                        label: 'บิดาคู่สมรส:',
                        key: 'TAXSFT',
                        type: 'text',
                        maxlength: 17,
                        placeholder: 'เลขประจำตัวประชาชน 13 หลัก',
                        class: 'w-full max-w-xs font-mono text-xs cardid',
                        label_width: 'min-w-[85px]',
                    },
                    {
                        label: 'มารดาคู่สมรส:',
                        key: 'TAXSPM',
                        type: 'text',
                        maxlength: 17,
                        placeholder: 'เลขประจำตัวประชาชน 13 หลัก',
                        class: 'w-full max-w-xs font-mono text-xs cardid',
                        label_width: 'min-w-[85px]',
                    },
                ],
            },
        ],
    },
    {
        id: 'TAXDIS',
        title: '5. ค่าลดหย่อนเลี้ยงดูคนพิการหรือทุพพลภาพ',
        rate: [
            'คนละ 60,000 บาท',
            'มีเงินได้ทั้งปีไม่เกิน 30,000 บาทต่อคน',
            'บัตรประจำตัวผู้พิการต้องระบุชื่อผู้มีเงืนได้เป็นผู้ดูแล',
        ],
        group: 'รายการลดหย่อนภาษีเงินได้',
        input_type: 'amount',
        unit: 'บาท',
    },
    {
        id: 'TAXPREG',
        title: '6. ค่าฝากครรภ์และทำคลอด',
        rate: 'ตามที่จ่ายจริงแต่เมื่อรวมกันแล้วต้องไม่เกินท้องล่ะ 60,000 บาท',
        group: 'รายการลดหย่อนภาษีเงินได้',
        input_type: 'amount',
        unit: 'บาท',
    },
    {
        id: 'TAXINS',
        title: '7. เบี้ยประกันชีวิตทั่วไป/เงินฝากแบบมีประกันชีวิต',
        rate: 'ตามที่จ่ายจริงแต่เมื่อรวมกันแล้วต้องไม่เกิน 100,000 บาท',
        group: 'รายการลดหย่อนภาษีเงินได้',
        input_type: 'amount',
        unit: 'บาท',
    },
    {
        id: 'TAXSIN',
        title: '8. เบี้ยประกันชีวิตของคู่สมรส',
        rate: 'ตามที่จ่ายจริงแต่ไม่เกิน 10,000 บาท (กรณีคู่สมรสไม่มีเงินได้)',
        group: 'รายการลดหย่อนภาษีเงินได้',
        input_type: 'amount',
        unit: 'บาท',
    },
    {
        id: 'TAXINH',
        title: '9. เบี้ยประกันสุขภาพตนเอง',
        rate: 'ตามที่จ่ายจริงแต่ไม่เกิน 25,000 บาท และเมื่อรวมกับเบี้ยประกันชีวิตทั่วไปแล้วต้องไม่เกิน 100,000',
        group: 'รายการลดหย่อนภาษีเงินได้',
        input_type: 'amount',
        unit: 'บาท',
    },
    {
        id: 'TAXINP',
        title: '10. เบี้ยประกันสุขภาพบิดา-มารดา',
        rate: [
            'ตามที่จ่ายจริงแต่ไม่เกิน 15,000 บาท',
            'บิดา-มารดามีเงินได้ทั้งปีไม่เกิน 30,000 บาทต่อคน',
        ],
        group: 'รายการลดหย่อนภาษีเงินได้',
        input_type: 'amount',
        unit: 'บาท',
    },
    {
        id: 'TAXLTF',
        title: '11. กองทุน Thai ESG',
        rate: [
            'ตามที่จ่ายจริง แต่ไม่เกิน 30% ของเงินได้ที่ต้องเสียภาษีและสูงสุดไม่เกิน 300,000 บาท',
        ],
        group: 'รายการลดหย่อนภาษีเงินได้',
        input_type: 'amount',
        unit: 'บาท',
    },
    {
        id: 'TAXRMF',
        title: '12. ค่าซื้อกองทุนรวมเพื่อการเลี้ยงชีพ (RMF)',
        rate: [
            'ตามที่จ่ายจริง แต่ไม่เกิน 30% ของเงินได้ที่ต้องเสียภาษี',
            'เมื่อนำข้อ 12. รวมกับ ข้อ 13., ข้อ 14. และกองทุนสำรองเลี้ยงชีพแล้ว ต้องไม่เกิน 500,000 บาท',
        ],
        group: 'รายการลดหย่อนภาษีเงินได้',
        input_type: 'amount',
        unit: 'บาท',
    },
    {
        id: 'TAXPENS',
        title: '13. เบี้ยประกันชีวิตแบบบำนาญ',
        rate: [
            'ตามที่จ่ายจริงแต่ไม่เกิน 15% ของเงินได้ที่ต้องเสียภาษีและไม่เกิน 200,000 บาท',
            'เมื่อรวมกับข้อ 12. แล้วต้องไม่เกิน 500,000 บาท',
        ],
        group: 'รายการลดหย่อนภาษีเงินได้',
        input_type: 'amount',
        unit: 'บาท',
    },
    {
        id: 'TAXEDU',
        title: '14. บริจาค การศึกษา, การกีฬา, การพัฒนาสังคมและโรงพยาบาลรัฐ',
        rate: '2 เท่าของเงินบริจาคตามที่จ่ายจริง แต่ไม่เกิน 10%',
        group: 'รายการลดหย่อนภาษีเงินได้',
        input_type: 'amount',
        unit: 'บาท',
    },
    {
        id: 'TAXDON',
        title: '15. บริจาคอื่นๆ วัด, มูลนิธิและองค์กรสาธารณกุศล',
        rate: 'ตามที่จ่ายจริง แต่ไม่เกิน 10% ของเงินได้หลังหักค่าใช้จ่ายและค่าลดหย่อน',
        group: 'รายการลดหย่อนภาษีเงินได้',
        input_type: 'amount',
        unit: 'บาท',
    },
    {
        id: 'TAXINL',
        title: '16. ดอกเบี้ยเงินกู้เพื้อซื้อที่อยู่อาศัย',
        rate: 'ตามที่จ่ายจริงแต่ไม่เกิน 100,000 บาท',
        group: 'รายการลดหย่อนภาษีเงินได้',
        input_type: 'amount',
        unit: 'บาท',
    },
    {
        id: 'TAXOT1',
        title: '17. อื่นๆ',
        rate: '',
        group: 'รายการลดหย่อนภาษีเงินได้ (เฉพาะปี)',
        input_type: 'amount',
        unit: 'บาท',
    },
    {
        id: 'TAXOT2',
        title: '18. อื่นๆ',
        rate: '',
        group: 'รายการลดหย่อนภาษีเงินได้ (เฉพาะปี)',
        input_type: 'amount',
        unit: 'บาท',
    },
];
