import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';

describe('VendorsController', () => {
    let controller: VendorsController;
    let vendorsService: jest.Mocked<
        Pick<VendorsService, 'search' | 'create' | 'nextVendor'>
    >;

    beforeEach(() => {
        vendorsService = {
            search: jest.fn(),
            create: jest.fn(),
            nextVendor: jest.fn(),
        };

        controller = new VendorsController(vendorsService as any);
    });

    it('should call search service with dto', async () => {
        const dto = { VND_CODE: 'V001' } as any;
        vendorsService.search.mockResolvedValue([{ VND_CODE: 'V001' }] as any);

        const result = await controller.findAll(dto);

        expect(vendorsService.search).toHaveBeenCalledWith(dto);
        expect(result).toEqual([{ VND_CODE: 'V001' }]);
    });

    it('should call create service with dto', async () => {
        const dto = {
            VENDGROUP: '6',
            VENDPURPOSE: 'A',
            VND_NAME: 'ABC Supplier',
        } as any;
        const createdVendor = {
            VND_CODE: '6000',
            VND_NAME: 'ABC Supplier',
        } as any;
        vendorsService.create.mockResolvedValue(createdVendor);

        const result = await controller.create(dto);

        expect(vendorsService.create).toHaveBeenCalledWith(dto);
        expect(result).toEqual(createdVendor);
    });

    it('should call nextVendor service with first and second code', async () => {
        const code = { first: '6', second: '5' };
        vendorsService.nextVendor.mockResolvedValue('6001');

        const result = await controller.nextVendor(code as any);

        expect(vendorsService.nextVendor).toHaveBeenCalledWith('6', '5');
        expect(result).toEqual('6001');
    });

    it('should call nextVendor service with second as undefined when second code is missing', async () => {
        const code = { first: '8' };
        vendorsService.nextVendor.mockResolvedValue('8000');

        const result = await controller.nextVendor(code as any);

        expect(vendorsService.nextVendor).toHaveBeenCalledWith('8', undefined);
        expect(result).toEqual('8000');
    });
});
