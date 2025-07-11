
export function getSafeFields(fields: string[], allowed: string[]): string[] {
  return fields.filter(f => allowed.includes(f));
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

