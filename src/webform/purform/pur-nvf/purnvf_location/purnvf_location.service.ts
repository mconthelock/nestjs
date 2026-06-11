import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { join } from 'path';

//https://github.com/kongvut/thai-province-data

@Injectable()
export class PurnvfLocationService {
    // สร้างฟังก์ชันภายในเพื่อช่วยอ่านไฟล์ JSON จาก Root โฟลเดอร์ของโปรเจกต์
    private loadJsonFile(fileName: string): any[] {
        try {
            // ดึง path จาก root ของโปรเจกต์ที่กำลังทำงานอยู่ (รันตรงไหนก็เจอ ไม่ขึ้นกับ dist)
            const candidates = [
                join(process.cwd(), 'src', 'common', 'json', fileName),
                join(process.cwd(), 'dist', 'src', 'common', 'json', fileName),
            ];

            const filePath = candidates.find((p) => fs.existsSync(p));
            // อ่านไฟล์ออกมาเป็นข้อความ แล้วแปลงเป็น Array object
            const fileContent = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(fileContent);
        } catch (error) {
            throw new Error(`Cannot read file ${fileName}: ${error.message}`);
        }
    }

    // 1. ดึงประเทศ
    async getCountries() {
        try {
            const countriesData = this.loadJsonFile('countriesData.json'); // ใส่ชื่อไฟล์ให้ตรงตามจริงนะคะ
            return countriesData.map((country) => ({
                id: country.code,
                nameen: country.name_en,
                nameth: country.name_th,
            }));
        } catch (error) {
            throw new InternalServerErrorException(
                'Get Countries Error: ' + error.message,
            );
        }
    }

    // 2. ดึงจังหวัด
    async getProvinces() {
        try {
            const provincesData = this.loadJsonFile('provincesData.json'); // เปลี่ยนชื่อไฟล์ให้ตรงกับในเครื่องนะคะ
            const sorted = [...provincesData].sort((a, b) =>
                a.name_en.localeCompare(b.name_en),
            );
            return sorted.map((p) => ({
                id: p.id,
                nameen: p.name_en,
                nameth: p.name_th,
            }));
        } catch (error) {
            throw new InternalServerErrorException(
                'Get Provinces Error: ' + error.message,
            );
        }
    }

    // 3. ดึงอำเภอ
    async getDistricts(provinceId?: number) {
        try {
            const districtsData = this.loadJsonFile('districtsData.json');
            let list = districtsData;
            if (provinceId) {
                list = districtsData.filter(
                    (d) => d.province_id === Number(provinceId),
                );
            }
            const sorted = [...list].sort((a, b) =>
                a.name_en.localeCompare(b.name_en),
            );
            return sorted.map((d) => ({
                id: d.id,
                nameen: d.name_en,
                nameth: d.name_th,
                province_id: d.province_id,
            }));
        } catch (error) {
            throw new InternalServerErrorException(
                'Get Districts Error: ' + error.message,
            );
        }
    }

    // 4. ดึงตำบล
    async getSubDistricts(districtId?: number) {
        try {
            const subDistrictsData = this.loadJsonFile('subDistrictsData.json');
            let list = subDistrictsData;
            if (districtId) {
                list = subDistrictsData.filter(
                    (sd) => sd.district_id === Number(districtId),
                );
            }
            const sorted = [...list].sort((a, b) =>
                a.name_en.localeCompare(b.name_en),
            );
            return sorted.map((sd) => ({
                id: sd.id,
                nameen: sd.name_en,
                nameth: sd.name_th,
                district_id: sd.district_id,
                postcode: sd.zip_code,
            }));
        } catch (error) {
            throw new InternalServerErrorException(
                'Get SubDistricts Error: ' + error.message,
            );
        }
    }
}
