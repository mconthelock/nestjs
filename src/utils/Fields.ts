
export function getSafeFields(fields: string[], allowed: string[]): string[] {
  return fields.filter(f => allowed.includes(f));
}

export function getQueryFieldsBySelect(fields: string[], numberFields: string[], search : string): [string, Record<string, string>] {
    const whereSqlParts: string[] = [];
    const whereParams: Record<string, string> = {};
    fields.forEach((field, idx) => {
        // เลือก TO_CHAR เฉพาะ field ที่เป็น number ถ้าต้องการ
        // ตรงนี้ขอยกตัวอย่างใช้ LIKE เฉย ๆ
        const param = `search${idx}`;
        // ถ้า field เป็น number ให้ใช้ TO_CHAR
        if (numberFields.includes(field)) {
            whereSqlParts.push(`TO_CHAR(OrderList.${field}) LIKE :${param}`);
        } else {
            whereSqlParts.push(`OrderList.${field} LIKE :${param}`);
        }
        whereParams[param] = `%${search}%`;
    });
    // รวมเป็น query string
    const whereSql = whereSqlParts.join(' OR ');

    return [whereSql, whereParams];
}

export const mapAliasesToFields = (data: Record<string, any>[]): Record<string, any>[] =>
    data.map((item) => {
        const mappedItem = Object.entries(item).reduce((acc, [key, value]) => {
            const newKey = key.includes('_') ? key.substring(key.indexOf('_') + 1) : key;
            acc[newKey] = value;
            return acc;
        }, {} as Record<string, any>);
        return mappedItem;
    });