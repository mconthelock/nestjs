import { DataSource } from "typeorm";

export function formDetailQb(dataSource: DataSource) {
    return dataSource
      .createQueryBuilder()
      .select(`FT.VANAME || SUBSTR(F.CYEAR2,3,2) || '-' || LPAD(F.NRUNNO, 6, '0') AS FORMNO,(
                CASE
                WHEN INSTR(FT.VFORMPAGE, 'amecweb') > 0
                    THEN FT.VFORMPAGE
                ELSE
                    'http://webflow.mitsubishielevatorasia.co.th' || 
                    CASE WHEN SUBSTR(FT.VFORMPAGE, 1, 1) = '/' THEN '' ELSE '/' END ||
                    FT.VFORMPAGE
                END
            )
            || '?no='   || F.NFRMNO
            || '&orgNo='|| F.VORGNO
            || '&y='    || F.CYEAR
            || '&y2='   || F.CYEAR2
            || '&runNo='|| F.NRUNNO
            || '&empno='
            AS "link",
        F.*, A.SNAME AS VINPUTNAME, B.SNAME AS VREQNAME, A.SSECCODE AS VINPUTSECCODE, B.SSECCODE AS VREQSECCODE, A.SDEPCODE AS VINPUTDEPCODE, B.SDEPCODE AS VREQDEPCODE, A.SDIVCODE AS VINPUTDIVCODE, B.SDIVCODE AS VREQDIVCODE`)
      .from('FORM', 'F')
      .innerJoin('FORMMST', 'FT', 'FT.NNO = F.NFRMNO AND FT.VORGNO = F.VORGNO AND FT.CYEAR = F.CYEAR')
      .leftJoin('AMECUSERALL', 'A', 'A.SEMPNO = F.VINPUTER')
      .leftJoin('AMECUSERALL', 'B', 'B.SEMPNO = F.VREQNO');
}