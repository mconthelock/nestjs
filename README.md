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

# Prect Updated

## GB-RB

- **modile** : รวม modile เป็นอันเดียว ในการทำงานของ Nest.js จะทำการ Load ทุก module เข้าไป momory ตอน start ถ้าแยก 1 function เป็นหลาย module ระบบจะใช้ Memory มากขึ้น Function เล็กๆ อย่างการสร้างฟอร์ม ไม่จำเป็นต้องแยก module ก็ได้ครับ
- **controller** : ใช้ controller แค่อันเดียวก็พอ / ในกรณี่ต้องการแยก route แต่ใช้ method เดียวกัน สามารถกำหนด route ได้ใน parameter ของ method ได้เลย เช่น @Post('create') , @Post('update')
- **controller** : เปลี่ยนชื่อ route จาก findAll เป็น purpose เพื่อเจาะจงมากขึ้นว่า function นั้นทำหน้าที่อะไร
