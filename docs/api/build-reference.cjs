// Generate documentation from TypeScript syntax only; never load app/database modules.
const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const root = path.resolve(__dirname, '../..');
function walk(dir) { return fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(dir,e.name)) : [path.join(dir,e.name)]); }
const jig = walk(path.join(root,'src/iedoc/jig')).filter(f=>f.endsWith('.ts')&&!f.endsWith('.spec.ts'));
const pi = fs.readdirSync(path.join(root,'src/workload')).filter(n=>n.toLowerCase().startsWith('piline')).flatMap(n=>walk(path.join(root,'src/workload',n))).filter(f=>f.endsWith('.ts')&&!f.endsWith('.spec.ts'));
function decorators(node) { return ts.canHaveDecorators(node) ? ts.getDecorators(node)||[] : []; }
function call(d) { const x=d.expression; return ts.isCallExpression(x) ? {name:x.expression.getText(),args:x.arguments} : {name:x.getText(),args:[]}; }
const cell = s => String(s??'—').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\|/g,'&#124;').replace(/\r?\n/g,' ').replace(/\s+/g,' ');
function build(name,files) {
  let routes=[],dtos=[];
  for (const file of files) {
    const sf=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true);
    const constants=new Map();
    for(const s of sf.statements) if(ts.isVariableStatement(s)) for(const d of s.declarationList.declarations) constants.set(d.name.getText(sf),d.initializer);
    function value(n) {
      if(!n) return '';
      if(ts.isStringLiteral(n)||ts.isNoSubstitutionTemplateLiteral(n)) return n.text;
      if(ts.isIdentifier(n)&&constants.has(n.text)) return value(constants.get(n.text));
      if(ts.isBinaryExpression(n)&&n.operatorToken.kind===ts.SyntaxKind.PlusToken) return value(n.left)+value(n.right);
      throw Error('Unresolved route '+n.getText(sf));
    }
    const rel=path.relative(root,file).replace(/\\/g,'/');
    for(const c of sf.statements.filter(ts.isClassDeclaration)) {
      const ctrl=decorators(c).map(call).find(d=>d.name==='Controller');
      if(ctrl) for(const m of c.members.filter(ts.isMethodDeclaration)) {
        for(const d of decorators(m).map(call).filter(d=>['Get','Post','Patch','Put','Delete','Head'].includes(d.name))) {
          const url='/'+[value(ctrl.args[0]),value(d.args[0])].filter(Boolean).join('/');
          const args=m.parameters.flatMap(p=>decorators(p).map(call).filter(a=>['Body','Param','Query','UploadedFiles'].includes(a.name)).map(a=>a.name+'('+ (a.args[0]?.getText(sf)||'') +'): '+(p.type?.getText(sf)||'unknown')));
          routes.push({method:d.name.toUpperCase(),url,args:args.join('; ')||'ไม่มี body/query',handler:c.name.text+'.'+m.name.getText(sf),source:rel});
        }
      }
      if(c.name && (/Dto$/.test(c.name.text)||c.name.text==='piline_bending_att')) {
        const fields=c.members.filter(ts.isPropertyDeclaration).map(p=>({name:p.name.getText(sf),type:p.type?.getText(sf)||'unknown',optional:!!p.questionToken,validation:decorators(p).map(d=>d.getText(sf)).join(' ')}));
        dtos.push({name:c.name.text,source:rel,base:c.heritageClauses?.map(h=>h.getText(sf)).join(' ')||'',fields});
      }
    }
  }
  let out=`# ${name} — Endpoint และ DTO reference\n\nอ้างอิง source วันที่ 22/10/2026; อ่านคู่มือหลักสำหรับ business rules และตัวอย่าง JSON\n\n`;
  out+='## Endpoint ทั้งหมด\n\nPath ต่อท้าย {{BASE_URL}}; :name คือ path parameter; Body=JSON เว้น endpoint multipart ที่อธิบายในคู่มือหลัก\n\n| Method | Path | Input / DTO | Handler |\n|---|---|---|---|\n';
  for(const r of routes) out+=`| ${r.method} | \`${r.url}\` | ${cell(r.args)} | ${cell(r.handler)} |\n`;
  out+=`\nรวม ${routes.length} routes จาก controller ในขอบเขตนี้ ไม่ได้นับ service method ภายในที่ไม่มี HTTP route\n\n## DTO และข้อกำหนด field\n\nเครื่องหมาย optional อ้าง TypeScript/IsOptional/ValidateIf ให้ดู decorators ร่วมด้วย เพราะเงื่อนไข service อาจบังคับเพิ่ม เช่น START_USE_DATE ของ CREATE\n\nPartialType ทำให้ช่องที่รับต่อมาเป็น optional; OmitType ตัดชื่อช่องตามรายการ; PickType เลือกเฉพาะช่อง; IntersectionType รวมช่องของทุก class อ้างตาราง class ต้นทางด้านล่างประกอบกัน\n\n`;
  for(const d of dtos) {
    out+=`### ${d.name}\n\nSource: \`${d.source}\`\n\n`;
    if(d.base) out+='รับ field เพิ่มตามนิยาม:\n\n```typescript\n'+d.base+'\n```\n\n';
    if(d.fields.length) {
      out+='| Field | Type | Optional ใน declaration | Validation / Transform ตามโค้ด |\n|---|---|---|---|\n';
      for(const f of d.fields) out+=`| ${cell(f.name)} | ${cell(f.type)} | ${f.optional?'ใช่':'ไม่'} | ${cell(f.validation)} |\n`;
    } else out+='ไม่มี field ประกาศเพิ่มเอง ดู base class ด้านบน (ถ้ามี)\n';
    out+='\n';
  }
  fs.writeFileSync(path.join(__dirname,name+'-REFERENCE.md'),out,'utf8');
  return routes;
}
const j=build('JIG',jig);
const p=build('PI-LINE',[...pi,path.join(root,'src/common/dto/filter.dto.ts'),path.join(root,'src/common/Entities/workload/table/piline_bending_att.entity.ts')]);
// Check JSON examples and relative links in the delivery files.
let examples=0;
for(const filename of ['README.md','JIG-API.md','PI-LINE-API.md','JIG-REFERENCE.md','PI-LINE-REFERENCE.md']) {
  const body=fs.readFileSync(path.join(__dirname,filename),'utf8');
  for(const m of body.matchAll(/```json\s*\n([\s\S]*?)```/g)) { JSON.parse(m[1]); examples++; }
  for(const m of body.matchAll(/\]\(([^)]+\.md)\)/g)) if(!fs.existsSync(path.resolve(__dirname,m[1]))) throw Error('Broken link '+m[1]);
}
console.log(JSON.stringify({jigRoutes:j.length,piLineRoutes:p.length,validJsonExamples:examples,links:'OK'}));
