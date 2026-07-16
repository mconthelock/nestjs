import { formatPsClmOrderNo, nextPsClmOrderNo } from './ps-clm.service';

describe('PS-CLM new order number', () => {
    it('returns the first unused number for each order type', () => {
        expect(formatPsClmOrderNo('ET123456', 1)).toBe('ET2CA0015');
        expect(formatPsClmOrderNo('ST123456', 1)).toBe('ST2CA0A16');
        expect(nextPsClmOrderNo('ET123456', [])).toBe('ET2CA0015');
        expect(nextPsClmOrderNo('ET123456', ['ET2CA0015', 'ET2CA0026'])).toBe(
            'ET2CA0030',
        );
        expect(nextPsClmOrderNo('ST123456', ['ST2CA0A16'])).toBe('ST2CA0A20');
    });
});
