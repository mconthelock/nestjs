export interface IfindByDataTableServerside {
    start: number;
    length: number;
    order: {
        column: number;
        dir: 'asc' | 'desc';
        name: string;
    }[];
    condition?: any;
}
