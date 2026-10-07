import { Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class CountriesService {
    private readonly filePath = 'src/common/json/countries_iso3166.json';
    async getAllCountries() {
        try {
            const candidates = [
                join(process.cwd(), this.filePath),
                join(process.cwd(), 'dist', this.filePath),
            ];

            const path = candidates.find((p) => existsSync(p));
            if (!path) {
                throw new Error(`Countries file not found: ${this.filePath}`);
            }

            const source = await readFile(path, 'utf-8');
            return JSON.parse(source);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async searchCountries(filters: {
        code?: string;
        code3?: string;
        name_en?: string;
        name_th?: string;
        numeric?: string;
    }) {
        const countries = await this.getAllCountries();
        
        // ถ้าไม่มี filter ใดๆ หรือทุกค่าเป็น empty string ให้คืนทั้งหมด
        const hasFilters = Object.values(filters).some(value => value && value.trim());
        if (!hasFilters) return countries;
        
        return countries.filter((country: any) => {
            let match = true;
            
            if (filters.code) {
                match = match && country.code?.toLowerCase() === filters.code.toLowerCase();
            }
            if (filters.code3) {
                match = match && country.code3?.toLowerCase() === filters.code3.toLowerCase();
            }
            if (filters.name_en) {
                match = match && country.name_en?.toLowerCase().includes(filters.name_en.toLowerCase());
            }
            if (filters.name_th) {
                match = match && country.name_th?.toLowerCase().includes(filters.name_th.toLowerCase());
            }
            if (filters.numeric) {
                match = match && country.numeric === filters.numeric;
            }
            
            return match;
        });
    }
}
