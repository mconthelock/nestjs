import dayjs from 'dayjs';

export type Row = Record<string, any>;

export type MapRule = {
    out: string;
    get: (header: Row, detail: Row, timeline: Row, statusList: any[]) => any;
};

const getStatusDesc = (statusList: any[], statusId: any) => {
    if (!Array.isArray(statusList) || statusId == null) return null;

    const status = statusList.find((item) => item?.STATUS_ID === statusId);
    return status?.STATUS_DESC ?? null;
};

const getGroup = (header: Row, groupNo: number) => {
    return header?.inqgroup?.find((group) => group.INQG_GROUP === groupNo);
};

export const designProcessColumnMap: MapRule[] = [
    { out: 'SNO', get: (_h, d) => d?.INQD_SEQ ?? null },
    {
        out: 'Inquiry Date',
        get: (h) => dayjs(h.INQ_DATE).format('YYYY-MM-DD'),
    },
    {
        out: 'Inquiry Register Date',
        get: (_h, _d, t) => dayjs(t.MAR_SEND).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
        out: 'Status',
        get: (h, _d, _t, statusList) =>
            getStatusDesc(statusList, h?.status?.STATUS_ID),
    },
    { out: 'Inquiry No.', get: (h) => h.INQ_NO },
    { out: 'Inquiry Revision', get: (h) => h.INQ_REV },
    { out: 'TYPEOFINQUIRY', get: (h) => h.INQ_TYPE },
    { out: 'Series', get: (h) => h.INQ_SERIES },
    { out: 'TRADER', get: (h) => h.INQ_TRADER },
    { out: 'Agent', get: (h) => h.INQ_AGENT },
    { out: 'AREA_COUNTRY', get: (h) => h.INQ_COUNTRY },
    { out: 'Original Project No', get: (h) => h.INQ_PRJNO },
    { out: 'ORGPRJNAME', get: (h) => h.INQ_PRJNAME },
    {
        out: 'D/D Receive date',
        get: (h, d, t) =>
            getGroup(h, 6)
                ? dayjs(t.MAR_SEND).format('YYYY-MM-DD HH:mm:ss')
                : dayjs(t.SG_READ).format('YYYY-MM-DD HH:mm:ss'),
    },
    { out: 'MAR Person In-charge', get: (h) => h.maruser?.SNAME ?? null },
    { out: 'CARNO', get: (_h, d) => d?.INQD_CAR ?? null },
    { out: 'ORIGINALORDER', get: (_h, d) => d?.INQD_MFGORDER ?? null },
    { out: 'ITEM', get: (_h, d) => d?.INQD_ITEM ?? null },
    { out: 'PARTNAME', get: (_h, d) => d?.INQD_PARTNAME ?? null },
    { out: 'DRAWINGNO', get: (_h, d) => d?.INQD_DRAWING ?? null },
    { out: 'VARIABLEFACTOR', get: (_h, d) => d?.INQD_VARIABLE ?? null },
    { out: 'LT', get: (h) => h.shipment?.SHIPMENT_VALUE ?? null },
    { out: 'SUPPLIER', get: (_h, d) => d?.INQD_SUPPLIER ?? null },
    { out: 'QTY', get: (_h, d) => d?.INQD_QTY ?? null },
    { out: 'UM', get: (_h, d) => d?.INQD_UM ?? null },
    { out: 'PART2ND', get: (_h, d) => d?.INQD_SENDPART ?? null },
    { out: 'UN', get: (_h, d) => d?.INQD_UNREPLY ?? null },
    { out: 'REMARK', get: (_h, d) => d?.INQD_DES_REMARK ?? null },
    {
        out: 'Inquiry expect D/L',
        get: (h, d, t) =>
            getGroup(h, 6)
                ? dayjs(t.MAR_SEND).add(7, 'day').format('YYYY-MM-DD HH:mm:ss')
                : dayjs(t.SG_READ).add(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
    },
    {
        out: 'EME Effect',
        get: (h) => (getGroup(h, 1) ? 'Y' : null),
    },
    {
        out: 'EEL Effect',
        get: (h) => (getGroup(h, 2) ? 'Y' : null),
    },
    {
        out: 'EAP Effect',
        get: (h) => (getGroup(h, 3) ? 'Y' : null),
    },
    {
        out: 'ESO Effect',
        get: (h) => (getGroup(h, 6) ? 'Y' : null),
    },
    {
        out: 'Elevator Effect',
        get: (h) => (getGroup(h, 6) ? 'N' : 'Y'),
    },
    {
        out: 'EME Revision',
        get: (h) => getGroup(h, 1)?.INQG_REV ?? null,
    },
    {
        out: 'EME Status',
        get: (h, _d, _t, statusList) =>
            getStatusDesc(statusList, getGroup(h, 1)?.INQG_STATUS),
    },
    {
        out: 'EME Design Class',
        get: (h) => getGroup(h, 1)?.INQG_CLASS ?? null,
    },
    {
        out: 'EME Leader',
        get: (h) => getGroup(h, 1)?.INQG_ASG ?? null,
    },
    {
        out: 'EME Assign Date',
        get: (h) =>
            getGroup(h, 1)?.INQG_ASG_DATE
                ? dayjs(getGroup(h, 1)?.INQG_ASG_DATE).format(
                      'YYYY-MM-DD HH:mm:ss',
                  )
                : null,
    },
    {
        out: 'EME Designer',
        get: (h) => getGroup(h, 1)?.INQG_DES ?? null,
    },
    {
        out: 'EME Finish Design',
        get: (h) =>
            getGroup(h, 1)?.INQG_DES_DATE
                ? dayjs(getGroup(h, 1)?.INQG_DES_DATE).format(
                      'YYYY-MM-DD HH:mm:ss',
                  )
                : null,
    },
    {
        out: 'EME Checker',
        get: (h) => getGroup(h, 1)?.INQG_CHK ?? null,
    },
    {
        out: 'EME Finish Check',
        get: (h) =>
            getGroup(h, 1)?.INQG_CHK_DATE
                ? dayjs(getGroup(h, 1)?.INQG_CHK_DATE).format(
                      'YYYY-MM-DD HH:mm:ss',
                  )
                : null,
    },
    {
        out: 'EME Revision Reason',
        get: (h) => getGroup(h, 1)?.INQG_DES_REASON ?? null,
    },
    {
        out: 'EME Finish time',
        get: (h) => getGroup(h, 1)?.INQG_CHK_DATE ?? null,
    },
    {
        out: 'EEL Revision',
        get: (h) => getGroup(h, 2)?.INQG_REV ?? null,
    },
    {
        out: 'EEL Status',
        get: (h, _d, _t, statusList) =>
            getStatusDesc(statusList, getGroup(h, 2)?.INQG_STATUS),
    },
    {
        out: 'EEL Design Class',
        get: (h) => getGroup(h, 2)?.INQG_CLASS ?? null,
    },
    { out: 'EEL Leader', get: (h) => getGroup(h, 2)?.INQG_ASG ?? null },
    {
        out: 'EEL Assign Date',
        get: (h) =>
            getGroup(h, 2)?.INQG_ASG_DATE
                ? dayjs(getGroup(h, 2)?.INQG_ASG_DATE).format(
                      'YYYY-MM-DD HH:mm:ss',
                  )
                : null,
    },
    { out: 'EEL Designer', get: (h) => getGroup(h, 2)?.INQG_DES ?? null },
    {
        out: 'EEL Finish Design',
        get: (h) =>
            getGroup(h, 2)?.INQG_DES_DATE
                ? dayjs(getGroup(h, 2)?.INQG_DES_DATE).format(
                      'YYYY-MM-DD HH:mm:ss',
                  )
                : null,
    },
    { out: 'EEL Checker', get: (h) => getGroup(h, 2)?.INQG_CHK ?? null },
    {
        out: 'EEL Finish Check',
        get: (h) =>
            getGroup(h, 2)?.INQG_CHK_DATE
                ? dayjs(getGroup(h, 2)?.INQG_CHK_DATE).format(
                      'YYYY-MM-DD HH:mm:ss',
                  )
                : null,
    },
    {
        out: 'EEL Revision Reason',
        get: (h) => getGroup(h, 2)?.INQG_DES_REASON ?? null,
    },
    {
        out: 'EEL Finish time',
        get: (h) => getGroup(h, 2)?.INQG_CHK_DATE ?? null,
    },
    {
        out: 'EAP Revision',
        get: (h) => getGroup(h, 3)?.INQG_REV ?? null,
    },
    {
        out: 'EAP Status',
        get: (h, _d, _t, statusList) =>
            getStatusDesc(statusList, getGroup(h, 3)?.INQG_STATUS),
    },
    {
        out: 'EAP Design Class',
        get: (h) => getGroup(h, 3)?.INQG_CLASS ?? null,
    },
    { out: 'EAP Leader', get: (h) => getGroup(h, 3)?.INQG_ASG ?? null },
    {
        out: 'EAP Assign Date',
        get: (h) =>
            getGroup(h, 3)?.INQG_ASG_DATE
                ? dayjs(getGroup(h, 3)?.INQG_ASG_DATE).format(
                      'YYYY-MM-DD HH:mm:ss',
                  )
                : null,
    },
    { out: 'EAP Designer', get: (h) => getGroup(h, 3)?.INQG_DES ?? null },
    {
        out: 'EAP Finish Design',
        get: (h) =>
            getGroup(h, 3)?.INQG_DES_DATE
                ? dayjs(getGroup(h, 3)?.INQG_DES_DATE).format(
                      'YYYY-MM-DD HH:mm:ss',
                  )
                : null,
    },
    { out: 'EAP Checker', get: (h) => getGroup(h, 3)?.INQG_CHK ?? null },
    {
        out: 'EAP Finish Check',
        get: (h) =>
            getGroup(h, 3)?.INQG_CHK_DATE
                ? dayjs(getGroup(h, 3)?.INQG_CHK_DATE).format(
                      'YYYY-MM-DD HH:mm:ss',
                  )
                : null,
    },
    {
        out: 'EAP Revision Reason',
        get: (h) => getGroup(h, 3)?.INQG_DES_REASON ?? null,
    },
    {
        out: 'EAP Finish time',
        get: (h) => getGroup(h, 3)?.INQG_CHK_DATE ?? null,
    },
    {
        out: 'ESO Revision',
        get: (h) => getGroup(h, 6)?.INQG_REV ?? null,
    },
    {
        out: 'ESO Status',
        get: (h, _d, _t, statusList) =>
            getStatusDesc(statusList, getGroup(h, 6)?.INQG_STATUS),
    },
    {
        out: 'ESO Design Class',
        get: (h) => getGroup(h, 6)?.INQG_CLASS ?? null,
    },
    { out: 'ESO Leader', get: (h) => getGroup(h, 6)?.INQG_ASG ?? null },
    {
        out: 'ESO Assign Date',
        get: (h) =>
            getGroup(h, 6)?.INQG_ASG_DATE
                ? dayjs(getGroup(h, 6)?.INQG_ASG_DATE).format(
                      'YYYY-MM-DD HH:mm:ss',
                  )
                : null,
    },
    { out: 'ESO Designer', get: (h) => getGroup(h, 6)?.INQG_DES ?? null },
    {
        out: 'ESO Finish Design',
        get: (h) =>
            getGroup(h, 6)?.INQG_DES_DATE
                ? dayjs(getGroup(h, 6)?.INQG_DES_DATE).format(
                      'YYYY-MM-DD HH:mm:ss',
                  )
                : null,
    },
    { out: 'ESO Checker', get: (h) => getGroup(h, 6)?.INQG_CHK ?? null },
    {
        out: 'ESO Finish Check',
        get: (h) =>
            getGroup(h, 6)?.INQG_CHK_DATE
                ? dayjs(getGroup(h, 6)?.INQG_CHK_DATE).format(
                      'YYYY-MM-DD HH:mm:ss',
                  )
                : null,
    },
    {
        out: 'ESO Revision Reason',
        get: (h) => getGroup(h, 6)?.INQG_DES_REASON ?? null,
    },
    {
        out: 'ESO Finish time',
        get: (h) => getGroup(h, 6)?.INQG_CHK_DATE ?? null,
    },
    {
        out: 'D/D Finish Date',
        get: (h, d, t) =>
            t.DE_CONFIRM != null
                ? dayjs(t.DE_CONFIRM).format('YYYY-MM-DD HH:mm:ss')
                : null,
    },
    {
        out: 'Design Action Time',
        get: (h, d, t) =>
            t.DE_CONFIRM != null
                ? getGroup(h, 6)
                    ? dayjs(t.DE_CONFIRM).diff(dayjs(h.MAR_SEND), 'day')
                    : dayjs(t.DE_CONFIRM).diff(dayjs(h.SG_READ))
                : null,
    },
];
