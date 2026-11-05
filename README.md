# How to install project

1. Git clone project from GitLab repo and install dependency

```sh
git clone
git install
cp \\amecnas\amecweb\file\env\api\.env .env
```

3. Install oracle instant_client

```sh
cp \\amecnas\amecweb\file\orcle\instantclient_23_0 C:/oracle/instantclient_23_0
```

2. Start dev by use commnand

```sh
npm run start:dev
```

## GP-TPH area approvals

Area decisions use `GPTPH_AREA_RECORD.AREA_APPROVED`: `1` for approved, `0`
for no approval recorded so far, and `NULL` for no recorded decision. A `0`
is not final while another owner of that area is still pending. An area is
approved if any assigned owner approves it; the request is rejected if every
owner approves no areas. For older requests without area decisions, a completed
owner approval is treated as approval of all areas currently assigned to that
owner.

For databases containing the previous `Y`/`N` values, run
[`sql/GPTPH_AREA_APPROVED_01.sql`](sql/GPTPH_AREA_APPROVED_01.sql) after
reviewing the target environment. The API can read the previous values during
the transition but writes only `1` and `0`.

When an Area Owner has a ready approval step, the form displays only that
owner's assigned areas. The owner must explicitly select Allow or Not Allow for
each displayed area before submitting an approval; neither choice is
preselected.

Owners are resolved from the current area assignment and ORGPOS; changes to
those assignments after a request is created may require administrator
intervention. The existing workflow identifies the actor using the supplied
employee number; it does not authenticate that identity. Area changes on an
existing request are accepted only before owner decisions and when they
preserve the assigned owners and routing level.

# Prect Updated

## GB-RB

- **modile** : รวม modile เป็นอันเดียว ในการทำงานของ Nest.js จะทำการ Load ทุก module เข้าไป momory ตอน start ถ้าแยก 1 function เป็นหลาย module ระบบจะใช้ Memory มากขึ้น Function เล็กๆ อย่างการสร้างฟอร์ม ไม่จำเป็นต้องแยก module ก็ได้ครับ
- **controller** : ใช้ controller แค่อันเดียวก็พอ / ในกรณี่ต้องการแยก route แต่ใช้ method เดียวกัน สามารถกำหนด route ได้ใน parameter ของ method ได้เลย เช่น @Post('create') , @Post('update')
- **controller** : เปลี่ยนชื่อ route จาก findAll เป็น purpose เพื่อเจาะจงมากขึ้นว่า function นั้นทำหน้าที่อะไร
