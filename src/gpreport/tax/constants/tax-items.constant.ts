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
    options?: TaxFieldOption[];
}
export interface TaxFieldOption {
    label: string;
    value: string;
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
        title: 'ค่าลดหย่อนส่วนตัว',
        rate: '60,000 บาท',
        group: 'รายการลดหย่อนภาษีเงินได้',
        details: [
            {
                title: 'สถานะภาพ',
                grid: 'grid grid-cols-1 sm:grid-cols-2 gap-2',
                fields: [
                    {
                        label: '',
                        key: 'MARSTE',
                        type: 'radio',
                        options: [
                            { label: 'โสด', value: 'SINGLE' },
                            {
                                label: 'จดทะเบียนและคู่สมรสมีเงินได้',
                                value: 'MARRIED & SPOUSE DOES WORK',
                            },
                            {
                                label: 'จดทะเบียนและคู่สมรสไม่มีเงินได้',
                                value: 'MARRIED & SPOUSE DOES NOT WORK',
                            },
                            { label: 'หย่าร้าง/หม้าย', value: 'DIVORCE/WIDOW' },
                            {
                                label: 'คู่สมรสเสียชีวิตระหว่างปีภาษี',
                                value: 'SPOUSE DIED IN TAX YEAR',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: 'TAX2',
        title: 'ค่าลดหย่อนคู่สมรส',
        rate: 'สำหรับคู่สมรสของผู้มีเงินได้ที่ไม่มีรายได้',
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
                        key: 'FAMSTX',
                        type: 'text',
                        maxlength: 17,
                        placeholder: 'เลขประจำตัวประชาชน 13 หลัก',
                        class: 'w-full max-w-xs font-mono text-xs cardid',
                        label_width: 'min-w-[125px]',
                    },
                    {
                        label: 'เลขที่สมรส:',
                        key: 'FAMMRN',
                        type: 'text',
                        maxlength: 17,
                        placeholder: 'เลขที่ทะเบียนสมรส',
                        class: 'w-full max-w-xs font-mono text-xs',
                        label_width: 'min-w-[125px]',
                    },
                    {
                        label: 'วันที่จดทะเบียนสมรส:',
                        key: 'FAMMRD',
                        type: 'text',
                        placeholder: 'วันที่จดทะเบียนสมรส',
                        class: 'w-full max-w-xs text-xs fdate',
                        label_width: 'min-w-[125px]',
                    },
                ],
            },
        ],
    },
    {
        id: 'TAX3',
        title: 'อุปการะบุตรชอบด้วยกฎหมายและบุตรบุญธรรม',
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
                        key: 'C1IED',
                        type: 'number',
                        min: 0,
                        max: 20,
                        unit: 'คน',
                        class: 'w-20 text-center font-mono',
                        label_width: 'min-w-[65px]',
                    },
                    {
                        label: 'บุตรไม่เรียน:',
                        key: 'C1NED',
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
                        key: 'C2IED',
                        type: 'number',
                        min: 0,
                        max: 20,
                        unit: 'คน',
                        class: 'w-20 text-center font-mono',
                        label_width: 'min-w-[65px]',
                    },
                    {
                        label: 'บุตรไม่เรียน:',
                        key: 'C2NED',
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
        id: 'TAXPRG',
        title: 'ค่าฝากครรภ์และคลอดบุตร',
        rate: 'หักลดหย่อนได้เท่าที่จ่ายจริง แต่ไม่เกิน 60,000 บาท ในแต่ละคราว',
        group: 'รายการลดหย่อนภาษีเงินได้',
        input_type: 'amount',
        unit: 'บาท',
    },
    {
        id: 'TAX4',
        title: 'ค่าอุปการะเลี้ยงดูบิดามารดาที่มีอายุ 60 ปีขึ้นไป',
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
        title: 'ค่าอุปการะเลี้ยงดูคนพิการหรือทุพพลภาพ',
        rate: [
            'คนละ 60,000 บาท',
            'บัตรประจำตัวผู้พิการต้องระบุชื่อผู้มีเงืนได้เป็นผู้ดูแล',
        ],
        group: 'รายการลดหย่อนภาษีเงินได้',
        input_type: 'amount',
        unit: 'บาท',
    },
    {
        id: 'TAXINS',
        title: 'ค่าเบี้ยประกันชีวิต',
        rate: [
            'หักตามจริงไม่เกิน 100,000 บาท',
            'กรมธรรม์อายุ 10 ปีขึ้นไป',
            'ครอบคลุมเบี้ยประกันของคู่สมรสที่ไม่มีเงินได้',
        ],
        group: 'รายการลดหย่อนภาษีเงินได้',
        input_type: 'amount',
        unit: 'บาท',
    },
    {
        id: 'TAXINH',
        title: 'ค่าเบี้ยประกันสุขภาพ (ตนเอง)',
        rate: [
            'หักลดหย่อนเท่าที่จ่ายจริง แต่ไม่เกิน 25,000 บาท',
            'หากรวมกับค่าเบี้ยประกันชีวิต ต้องไม่เกิน 100,000 บาท',
        ],
        group: 'รายการลดหย่อนภาษีเงินได้',
        input_type: 'amount',
        unit: 'บาท',
    },
    {
        id: 'TAXINP',
        title: 'ค่าเบี้ยประกันสุขภาพบิดามารดาของผู้มีเงินได้และคู่สมรส',
        rate: [
            'ตามที่จ่ายจริงแต่ไม่เกิน 15,000 บาท',
            'บิดา-มารดามีเงินได้ทั้งปีไม่เกิน 30,000 บาทต่อคน',
        ],
        group: 'รายการลดหย่อนภาษีเงินได้',
        input_type: 'amount',
        unit: 'บาท',
    },
    {
        id: 'TAXRMF',
        title: 'กองทุนรวมเพื่อการเลี้ยงชีพ (RMF)',
        rate: [
            'ไม่เกิน 30% ของเงินได้ และไม่เกิน 500,000 บาท',
            'ถือหน่วยลงทุนไม่น้อยกว่า 5 ปี',
            'เมื่อรวมกับกองทุนเพื่อการเกษียณอื่น ๆ ต้องไม่เกิน 500,000 บาท',
        ],
        group: 'รายการลดหย่อนภาษีเงินได้',
        input_type: 'amount',
        unit: 'บาท',
    },
    {
        id: 'TAXANU',
        title: 'ค่าเบี้ยประกันชีวิตแบบบำนาญ',
        rate: [
            'ไม่เกิน 15% ของเงินได้ และไม่เกิน 200,000 บาท',
            'คุ้มครอง 10 ปีขึ้นไป จ่ายบำนาญช่วงอายุ 55-85 ปี',
            'เมื่อรวมกับกองทุนเพื่อการเกษียณอื่น ๆ ต้องไม่เกิน 500,000 บาท',
        ],
        group: 'รายการลดหย่อนภาษีเงินได้',
        input_type: 'amount',
        unit: 'บาท',
    },
    // {
    //     id: 'TAXSSF',
    //     title: 'กองทุนรวมเพื่อการออม (SSF)',
    //     rate: [
    //         'หักลดหย่อนเท่าที่จ่ายจริง',
    //         'ไม่เกิน 30% ของเงินได้ และไม่เกิน 200,000 บาท',
    //     ],
    //     group: 'รายการลดหย่อนภาษีเงินได้',
    //     input_type: 'amount',
    //     unit: 'บาท',
    // },
    {
        id: 'TAXINL',
        title: 'ดอกเบี้ยกู้ยืมเพื่อที่อยู่อาศัย',
        rate: [
            'ตามจริง ไม่เกิน 100,000 บาท',
            'กู้ยืมจากสถาบันการเงินเพื่อซื้อ เช่าซื้อ หรือสร้างอาคารอยู่อาศัย',
        ],
        group: 'รายการลดหย่อนภาษีเงินได้',
        input_type: 'amount',
        unit: 'บาท',
    },
    {
        id: 'TAXLTF',
        title: 'กองทุนรวมไทยเพื่อความยั่งยืน (Thai ESG)',
        rate: [
            'ไม่เกิน 30% ของเงินได้ และไม่เกิน 300,000 บาท',
            'ต้องถือหน่วยลงทุนต่อเนื่องไม่น้อยกว่า 5 ปีนับแต่วันที่ซื้อ',
        ],
        group: 'รายการลดหย่อนภาษีเงินได้',
        input_type: 'amount',
        unit: 'บาท',
    },
    {
        id: 'TAXEDU',
        title: 'บริจาค การศึกษา, การกีฬา, การพัฒนาสังคมและโรงพยาบาลรัฐ',
        rate: '2 เท่าของเงินบริจาคตามที่จ่ายจริง แต่ไม่เกิน 10%',
        group: 'รายการลดหย่อนภาษีเงินได้',
        input_type: 'amount',
        unit: 'บาท',
    },
    {
        id: 'TAXDON',
        title: 'บริจาคอื่นๆ วัด, มูลนิธิและองค์กรสาธารณกุศล',
        rate: 'ตามที่จ่ายจริง แต่ไม่เกิน 10% ของเงินได้หลังหักค่าใช้จ่ายและค่าลดหย่อน',
        group: 'รายการลดหย่อนภาษีเงินได้',
        input_type: 'amount',
        unit: 'บาท',
    },
    {
        id: 'TAXOT1',
        title: 'อื่นๆ',
        rate: '',
        group: 'รายการลดหย่อนภาษีเงินได้ (เฉพาะปี)',
        input_type: 'amount',
        unit: 'บาท',
    },
    {
        id: 'TAXOT2',
        title: 'อื่นๆ (2)',
        rate: '',
        group: 'รายการลดหย่อนภาษีเงินได้ (เฉพาะปี)',
        input_type: 'amount',
        unit: 'บาท',
    },
];
