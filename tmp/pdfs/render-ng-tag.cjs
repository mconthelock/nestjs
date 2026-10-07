require('ts-node/register/transpile-only');
require('tsconfig-paths/register');
const {JigNgTagService}=require('../../src/iedoc/jig/jig-ng-tag.service');
const fs=require('fs');
const data={form:{JIG_NO:'J26-017',JIG_NAME:'Buffer stand auto welding machine',PROCESS_CODE:'A1BD1',ITEMNO:'635',LOCATION:'K4 LINE'},ng:{DEFECT_DETAIL:'Check Point #2 - Straightness out of tolerance',ACTION:'MODIFY',CORRECTIVE:'Modify and recheck before returning JIG to production line',PLAN_DATE:'2026-09-30',LOCATION:'Workshop'},checkDate:'2026-09-24',stamps:[{CSTEPNO:'--',CAPVSTNO:'1',DAPVDATE:'2026-09-24',SNAME:'SUPAMID SURNAME',SSEC:'WSD Sec.'},{CSTEPNO:'06',CAPVSTNO:'1',DAPVDATE:'2026-09-24',SNAME:'KALLAYANEE SURNAME'},{CSTEPNO:'07',CAPVSTNO:'1',DAPVDATE:'2026-09-24',SNAME:'SOMCHAI SURNAME'}]};
new JigNgTagService(null).render(data).then(b=>fs.writeFileSync('output/pdf/jig-ng-tag-sample.pdf',b)).catch(e=>{console.error(e);process.exit(1)});
