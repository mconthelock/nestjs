import { DataSource } from "typeorm";

export function formDetailQb(dataSource: DataSource) {
    return dataSource
      .createQueryBuilder()
      .select([
          'F.*',
          'FT.VANAME AS VANAME',
          'FT.VFORMPAGE AS VFORMPAGE',
          'A.SNAME AS VINPUTNAME',
          'B.SNAME AS VREQNAME',
          'A.SSECCODE AS VINPUTSECCODE',
          'B.SSECCODE AS VREQSECCODE',
          'A.SDEPCODE AS VINPUTDEPCODE',
          'B.SDEPCODE AS VREQDEPCODE',
          'A.SDIVCODE AS VINPUTDIVCODE',
          'B.SDIVCODE AS VREQDIVCODE',
      ])
      .from('FORM', 'F')
      .innerJoin('FORMMST', 'FT', 'FT.NNO = F.NFRMNO AND FT.VORGNO = F.VORGNO AND FT.CYEAR = F.CYEAR')
      .leftJoin('AMECUSERALL', 'A', 'A.SEMPNO = F.VINPUTER')
      .leftJoin('AMECUSERALL', 'B', 'B.SEMPNO = F.VREQNO');
}

export function formatFormDetail(raw: any) {
    if (!raw) return raw;
    const year2 = String(raw.CYEAR2 ?? '').slice(2, 4);
    const runNo = String(raw.NRUNNO ?? '').padStart(6, '0');
    const formNo = `${raw.VANAME ?? ''}${year2}-${runNo}`;

    let link = '';
    const formPage = raw.VFORMPAGE ?? '';
    if (formPage) {
        const isAmecWeb = formPage.includes('amecweb');
        const prefix = isAmecWeb
            ? ''
            : 'http://webflow.mitsubishielevatorasia.co.th' +
              (formPage.startsWith('/') ? '' : '/');
        link = `${prefix}${formPage}?no=${raw.NFRMNO}&orgNo=${raw.VORGNO}&y=${raw.CYEAR}&y2=${raw.CYEAR2}&runNo=${raw.NRUNNO}&empno=`;
    }

    let requestDate: Date | null = null;
    if (raw.DREQDATE) {
        const d = new Date(raw.DREQDATE);
        if (!isNaN(d.getTime())) {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            const time = raw.CREQTIME || '00:00:00';
            requestDate = new Date(`${yyyy}-${mm}-${dd}T${time}`);
        }
    }

    return {
        ...raw,
        FORMNO: formNo,
        link,
        REQUEST_DATE: requestDate,
    };
}